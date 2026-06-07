import express from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM redirects ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching redirects', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { old_path, new_path, status_code, active } = req.body;
    
    // Ensure paths start with /
    const cleanOldPath = old_path.startsWith('/') ? old_path : `/${old_path}`;
    const cleanNewPath = new_path.startsWith('/') || new_path.startsWith('http') ? new_path : `/${new_path}`;

    const query = `
      INSERT INTO redirects (old_path, new_path, status_code, active)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [cleanOldPath, cleanNewPath, status_code || 301, active !== false];
    
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err: any) {
    console.error('Error creating redirect', err);
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'الرابط القديم موجود مسبقاً' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { old_path, new_path, status_code, active } = req.body;
    
    const cleanOldPath = old_path.startsWith('/') ? old_path : `/${old_path}`;
    const cleanNewPath = new_path.startsWith('/') || new_path.startsWith('http') ? new_path : `/${new_path}`;

    const query = `
      UPDATE redirects SET
        old_path = $1, new_path = $2, status_code = $3, active = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const values = [cleanOldPath, cleanNewPath, status_code || 301, active !== false, id];
    
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Redirect not found' });
    res.json(rows[0]);
  } catch (err: any) {
    console.error('Error updating redirect', err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'الرابط القديم موجود مسبقاً' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM redirects WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting redirect', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
