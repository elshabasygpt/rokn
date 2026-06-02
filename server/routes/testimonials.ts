import { Router, Request, Response } from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/testimonials (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials WHERE active = true ORDER BY id DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/testimonials/all (admin)
router.get('/all', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY id DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/testimonials (admin)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name_ar, name_en, role_ar, role_en, text_ar, text_en, rating } = req.body;
    const result = await pool.query(
      `INSERT INTO testimonials (name_ar, name_en, role_ar, role_en, text_ar, text_en, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name_ar, name_en, role_ar || '', role_en || '', text_ar, text_en, rating || 5]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/testimonials/:id (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name_ar, name_en, role_ar, role_en, text_ar, text_en, rating, active } = req.body;
    const result = await pool.query(
      `UPDATE testimonials SET name_ar=$1, name_en=$2, role_ar=$3, role_en=$4, text_ar=$5, text_en=$6, rating=$7, active=$8
       WHERE id=$9 RETURNING *`,
      [name_ar, name_en, role_ar, role_en, text_ar, text_en, rating, active, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/testimonials/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
