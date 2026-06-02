import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

// Get a dynamic page by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM dynamic_pages WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to get page:', err);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Update a dynamic page (Admin only)
router.put('/:slug', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const { title_ar, title_en, content_ar, content_en, seo_desc_ar, seo_desc_en } = req.body;
    
    // Check if exists
    const check = await pool.query('SELECT id FROM dynamic_pages WHERE slug = $1', [slug]);
    
    if (check.rows.length === 0) {
      // Insert if not exists
      await pool.query(
        `INSERT INTO dynamic_pages (slug, title_ar, title_en, content_ar, content_en, seo_desc_ar, seo_desc_en) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [slug, title_ar, title_en, content_ar, content_en, seo_desc_ar, seo_desc_en]
      );
    } else {
      // Update
      await pool.query(
        `UPDATE dynamic_pages 
         SET title_ar = $1, title_en = $2, content_ar = $3, content_en = $4, seo_desc_ar = $5, seo_desc_en = $6, updated_at = CURRENT_TIMESTAMP
         WHERE slug = $7`,
        [title_ar, title_en, content_ar, content_en, seo_desc_ar, seo_desc_en, slug]
      );
    }
    
    res.json({ message: 'Page updated successfully' });
  } catch (err) {
    console.error('Failed to update page:', err);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// Get all dynamic pages info (for admin list)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, slug, title_ar, title_en, updated_at FROM dynamic_pages ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to list pages:', err);
    res.status(500).json({ error: 'Failed to list pages' });
  }
});

export default router;
