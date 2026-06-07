import express from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    let query = 'SELECT * FROM case_studies';
    if (!showAll) {
      query += ' WHERE active = true';
    }
    query += ' ORDER BY id ASC';
    
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching case studies', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      slug, industry_ar, industry_en, title_ar, title_en,
      problem_ar, problem_en, solution_ar, solution_en,
      kpi_ar, kpi_en, image, active
    } = req.body;
    
    const query = `
      INSERT INTO case_studies (
        slug, industry_ar, industry_en, title_ar, title_en,
        problem_ar, problem_en, solution_ar, solution_en,
        kpi_ar, kpi_en, image, active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const values = [
      slug, industry_ar, industry_en, title_ar, title_en,
      problem_ar, problem_en, solution_ar, solution_en,
      kpi_ar, kpi_en, image, active !== false
    ];
    
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating case study', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      slug, industry_ar, industry_en, title_ar, title_en,
      problem_ar, problem_en, solution_ar, solution_en,
      kpi_ar, kpi_en, image, active
    } = req.body;
    
    const query = `
      UPDATE case_studies SET
        slug = $1, industry_ar = $2, industry_en = $3, title_ar = $4, title_en = $5,
        problem_ar = $6, problem_en = $7, solution_ar = $8, solution_en = $9,
        kpi_ar = $10, kpi_en = $11, image = $12, active = $13, updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;
    const values = [
      slug, industry_ar, industry_en, title_ar, title_en,
      problem_ar, problem_en, solution_ar, solution_en,
      kpi_ar, kpi_en, image, active !== false, id
    ];
    
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Case study not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating case study', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM case_studies WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting case study', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
