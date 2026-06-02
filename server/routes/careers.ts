import { Router, Request, Response } from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/careers/jobs (public)
router.get('/jobs', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/careers/jobs (admin)
router.post('/jobs', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title_ar, title_en, type, location_ar, location_en, description_ar, description_en, requirements_ar, requirements_en, is_active } = req.body;
    
    // Check if SQLite is being used by trying to see if returning is supported or just doing standard insert
    // But pool.query abstracts it. For SQLite fallback it uses sqlite3 run.
    const result = await pool.query(
      `INSERT INTO jobs (title_ar, title_en, type, location_ar, location_en, description_ar, description_en, requirements_ar, requirements_en, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title_ar, title_en, type, location_ar, location_en, description_ar, description_en, requirements_ar, requirements_en, is_active ?? true]
    );
    return res.status(201).json(result.rows[0] || { success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/careers/jobs/:id (admin)
router.put('/jobs/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title_ar, title_en, type, location_ar, location_en, description_ar, description_en, requirements_ar, requirements_en, is_active } = req.body;
    const result = await pool.query(
      `UPDATE jobs SET title_ar = $1, title_en = $2, type = $3, location_ar = $4, location_en = $5, description_ar = $6, description_en = $7, requirements_ar = $8, requirements_en = $9, is_active = $10
       WHERE id = $11 RETURNING *`,
      [title_ar, title_en, type, location_ar, location_en, description_ar, description_en, requirements_ar, requirements_en, is_active ?? true, id]
    );
    return res.json(result.rows[0] || { success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/careers/jobs/:id (admin)
router.delete('/jobs/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/careers/apply (public)
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { job_id, name, email, phone, resume_url, cover_letter } = req.body;
    
    const result = await pool.query(
      `INSERT INTO job_applications (job_id, name, email, phone, resume_url, cover_letter)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [job_id, name, email, phone, resume_url, cover_letter]
    );
    return res.status(201).json(result.rows[0] || { success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/careers/applications (admin)
router.get('/applications', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { job_id } = req.query;
    let query = `
      SELECT a.*, j.title_ar as job_title_ar, j.title_en as job_title_en 
      FROM job_applications a
      LEFT JOIN jobs j ON a.job_id = j.id
    `;
    const params = [];
    
    if (job_id) {
      query += ` WHERE a.job_id = $1`;
      params.push(job_id);
    }
    
    query += ` ORDER BY a.created_at DESC`;
    
    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/careers/applications/:id/status (admin)
router.put('/applications/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return res.json(result.rows[0] || { success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
