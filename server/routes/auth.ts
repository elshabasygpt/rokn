import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let permissions = ['all'];
    try {
      if (admin.permissions) {
        permissions = typeof admin.permissions === 'string' ? JSON.parse(admin.permissions) : admin.permissions;
      }
    } catch {}

    const token = generateToken({ id: admin.id, username: admin.username, permissions });
    return res.json({ token, admin: { id: admin.id, username: admin.username, permissions } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  return res.json({ admin: req.admin });
});

// PUT /api/auth/password
router.put('/password', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await pool.query('SELECT * FROM admin WHERE id = $1', [req.admin!.id]);
    const admin = result.rows[0];

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admin SET password = $1 WHERE id = $2', [hash, req.admin!.id]);
    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// CRUD for Admins (Requires "all" permission)
const requireSuperAdmin = (req: AuthRequest, res: Response, next: Function) => {
  if (!req.admin?.permissions?.includes('all')) {
    return res.status(403).json({ error: 'Forbidden: Superadmin access required.' });
  }
  next();
};

router.get('/admins', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT id, username, permissions, created_at FROM admin ORDER BY id ASC');
    const admins = result.rows.map(row => ({
      ...row,
      permissions: typeof row.permissions === 'string' ? JSON.parse(row.permissions) : (row.permissions || ['all'])
    }));
    return res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/admins', authMiddleware, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, permissions } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    
    const existing = await pool.query('SELECT id FROM admin WHERE username = $1', [username]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Username already exists' });

    const hash = await bcrypt.hash(password, 10);
    const permsValid = Array.isArray(permissions) ? JSON.stringify(permissions) : '["all"]';
    
    await pool.query(
      'INSERT INTO admin (username, password, permissions) VALUES ($1, $2, $3)',
      [username, hash, permsValid]
    );
    res.status(201).json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.put('/admins/:id', authMiddleware, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { password, permissions } = req.body;
    const adminId = parseInt(req.params.id);
    
    const permsValid = Array.isArray(permissions) ? JSON.stringify(permissions) : null;
    
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE admin SET password = $1, permissions = COALESCE($2, permissions) WHERE id = $3', [hash, permsValid, adminId]);
    } else if (permsValid) {
      await pool.query('UPDATE admin SET permissions = $1 WHERE id = $2', [permsValid, adminId]);
    }
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/admins/:id', authMiddleware, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const adminId = parseInt(req.params.id);
    if (adminId === 1 || adminId === req.admin?.id) {
      return res.status(400).json({ error: 'Cannot delete primary admin or yourself.' });
    }
    await pool.query('DELETE FROM admin WHERE id = $1', [adminId]);
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

export default router;
