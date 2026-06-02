import { Router, Request, Response } from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/gallery (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM gallery WHERE active = true ORDER BY sort_order ASC, id DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/gallery/all (admin)
router.get('/all', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY sort_order ASC, id DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/gallery (admin)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { type, category, url, thumbnail, title_ar, title_en, sort_order } = req.body;
    const result = await pool.query(
      `INSERT INTO gallery (type, category, url, thumbnail, title_ar, title_en, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [type || 'image', category || 'moving', url, thumbnail || url, title_ar, title_en, sort_order || 0]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/gallery/:id (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, category, url, thumbnail, title_ar, title_en, sort_order, active } = req.body;
    const result = await pool.query(
      `UPDATE gallery SET type=$1, category=$2, url=$3, thumbnail=$4, title_ar=$5, title_en=$6, sort_order=$7, active=$8
       WHERE id=$9 RETURNING *`,
      [type, category, url, thumbnail, title_ar, title_en, sort_order, active, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/gallery/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM gallery WHERE id = $1', [req.params.id]);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
