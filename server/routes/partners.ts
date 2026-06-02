import express from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// GET /api/partners (Public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM partners ORDER BY sort_order ASC, id ASC');
    const partners = result.rows.map(p => ({
      ...p,
      active: p.active !== false
    }));
    res.json(partners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/partners (Admin)
router.post('/', authMiddleware, async (req, res) => {
  const { name, image_url, color, active, svg_code, sort_order } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO partners (name, image_url, color, active, svg_code, sort_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, image_url, color || '#000000', active !== false, svg_code || '', sort_order || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/partners/:id (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, image_url, color, active, svg_code, sort_order } = req.body;
  try {
    const result = await pool.query(
      'UPDATE partners SET name = $1, image_url = $2, color = $3, active = $4, svg_code = $5, sort_order = $6 WHERE id = $7 RETURNING *',
      [name, image_url, color, active !== false, svg_code, sort_order || 0, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/partners/:id (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM partners WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
