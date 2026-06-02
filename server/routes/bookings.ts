import { Router, Request, Response } from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';
import { sendBookingNotification } from '../notify';

const router = Router();

// POST /api/bookings (public — from contact form)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { from_city, to_city, rooms, notes, client_name, client_phone } = req.body;
    if (!from_city || !to_city || !client_name || !client_phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (from_city, to_city, rooms, notes, client_name, client_phone)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [from_city, to_city, rooms || '', notes || '', client_name, client_phone]
    );

    const booking = result.rows[0];

    // Send notification asynchronously (don't block response)
    sendBookingNotification(booking).catch(err => console.error('Notification error:', err));

    return res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings (admin)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM bookings';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' WHERE status = $1';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/stats (admin)
router.get('/stats', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM bookings');
    const newCount = await pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'new'");
    const inProgress = await pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'in_progress'");
    const completed = await pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'completed'");

    return res.json({
      total: parseInt(total.rows[0].count),
      new: parseInt(newCount.rows[0].count),
      in_progress: parseInt(inProgress.rows[0].count),
      completed: parseInt(completed.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/bookings/:id/status (admin)
router.put('/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['new', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/bookings/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
