import express from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all articles (public & admin)
router.get('/', async (req, res) => {
  try {
    const showAll = req.query.all === 'true'; // Admin might request all
    let query = 'SELECT * FROM articles';
    if (!showAll) {
      query += ' WHERE active = true';
    }
    query += ' ORDER BY created_at DESC LIMIT 500';
    
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching articles', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single article by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await pool.query('SELECT * FROM articles WHERE slug = $1', [slug]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Increment views safely asynchronously
    pool.query('UPDATE articles SET views = views + 1 WHERE slug = $1', [slug]).catch(console.error);

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching article', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if slug is unique
router.get('/check-slug/:slug', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const { id } = req.query; // exclude current ID if editing
    let query = 'SELECT id FROM articles WHERE slug = $1';
    let params: any[] = [slug];
    if (id) {
       query += ' AND id != $2';
       params.push(id);
    }
    const { rows } = await pool.query(query, params);
    res.json({ unique: rows.length === 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Basic XSS Sanitizer since dompurify install failed due to network
function sanitizeHtml(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/on\w+="[^"]*"/gi, '') // Remove inline event handlers (e.g. onclick="...")
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, 'about:blank'); // Prevent javascript: links
}

// Create article (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    let { title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, active, seo_keywords, is_featured } = req.body;
    
    // Sanitize content
    content_ar = sanitizeHtml(content_ar);
    content_en = sanitizeHtml(content_en);
    
    const query = `
      INSERT INTO articles (title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, active, seo_keywords, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, active !== false, seo_keywords, is_featured || false];
    
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating article', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update article (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    let { title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, active, seo_keywords, is_featured } = req.body;
    
    // Sanitize content
    content_ar = sanitizeHtml(content_ar);
    content_en = sanitizeHtml(content_en);
    
    const query = `
      UPDATE articles 
      SET title_ar = $1, title_en = $2, slug = $3, content_ar = $4, content_en = $5, image = $6, seo_desc_ar = $7, seo_desc_en = $8, active = $9, seo_keywords = $10, is_featured = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;
    const values = [title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, active, seo_keywords, is_featured || false, id];
    
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Article not found' });
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating article', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete article (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result: any = await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    if (result.rowCount === 0 || result.changes === 0) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    console.error('Error deleting article', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
