import express from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faqs ORDER BY sort_order ASC, id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { q_ar, q_en, a_ar, a_en, active, sort_order } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO faqs (q_ar, q_en, a_ar, a_en, active, sort_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [q_ar, q_en, a_ar, a_en, active !== false, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { q_ar, q_en, a_ar, a_en, active, sort_order } = req.body;
  try {
    const result = await pool.query(
      'UPDATE faqs SET q_ar = $1, q_en = $2, a_ar = $3, a_en = $4, active = $5, sort_order = $6 WHERE id = $7 RETURNING *',
      [q_ar, q_en, a_ar, a_en, active !== false, sort_order || 0, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'FAQ not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM faqs WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
