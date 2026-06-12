import { Router, Request, Response } from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/services (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM services WHERE active = true ORDER BY sort_order ASC, id ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/services/all (admin — includes inactive)
router.get('/all', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY sort_order ASC, id ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/services (admin)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, images, sort_order } = req.body;
    const result = await pool.query(
      `INSERT INTO services (icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, images, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [icon || 'Truck', title_ar, title_en, desc_ar, desc_en, JSON.stringify(features_ar || []), JSON.stringify(features_en || []), JSON.stringify(images || []), sort_order || 0]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/services/:id (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, images, sort_order, active } = req.body;
    const result = await pool.query(
      `UPDATE services SET icon=$1, title_ar=$2, title_en=$3, desc_ar=$4, desc_en=$5,
       features_ar=$6, features_en=$7, images=$8, sort_order=$9, active=$10, updated_at=CURRENT_TIMESTAMP
       WHERE id=$11 RETURNING *`,
      [icon, title_ar, title_en, desc_ar, desc_en, JSON.stringify(features_ar || []), JSON.stringify(features_en || []), JSON.stringify(images || []), sort_order, active, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/services/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM services WHERE id = $1', [id]);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
