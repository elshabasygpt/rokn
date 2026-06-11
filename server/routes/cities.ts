import express from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all active cities (Public)
router.get('/', async (req, res) => {
  try {
    const showAll = req.query.all === 'true'; // For admin to see drafts
    let query = 'SELECT * FROM cities';
    if (!showAll) {
      query += ' WHERE active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';
    
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching cities', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reorder cities (Admin)
router.put('/reorder', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items } = req.body; // Array of { id, display_order }
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });

    await client.query('BEGIN');
    for (const item of items) {
      await client.query('UPDATE cities SET display_order = $1 WHERE id = $2', [item.display_order, item.id]);
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering cities', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// Temporary endpoint to fix city order
router.get('/fix-order', async (req, res) => {
  const client = await pool.connect();
  try {
    const desiredOrder = [
      'qassim', 'buraidah', 'unaizah', 'ar-rass', 'al-bukayriyah', 'al-mithnab', 'al-badayea',
      'riyadh', 'jeddah', 'dammam', 'makkah', 'madinah', 'khobar', 'jubail', 'al-ahsa',
      'taif', 'tabuk', 'hail', 'abha', 'jizan', 'najran', 'yanbu'
    ];
    await client.query('BEGIN');
    for (let i = 0; i < desiredOrder.length; i++) {
      await client.query('UPDATE cities SET display_order = $1 WHERE slug = $2', [i, desiredOrder[i]]);
    }
    await client.query('COMMIT');
    res.json({ success: true, message: 'Cities ordered successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// Get a single city by slug (Public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await pool.query('SELECT * FROM cities WHERE slug = $1', [slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching city', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check unique slug
router.get('/check-slug/:slug', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const { id } = req.query;
    let query = 'SELECT id FROM cities WHERE slug = $1';
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

// Create city (Admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name_ar, name_en, slug,
      hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
      service_coverage_ar, service_coverage_en, faqs,
      cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
      seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active
    } = req.body;
    
    const query = `
      INSERT INTO cities (
        name_ar, name_en, slug,
        hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
        service_coverage_ar, service_coverage_en, faqs,
        cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
        seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `;
    const values = [
      name_ar, name_en, slug,
      hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
      service_coverage_ar, service_coverage_en, JSON.stringify(faqs || []),
      cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
      seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active !== false
    ];
    
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating city', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update city (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_ar, name_en, slug,
      hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
      service_coverage_ar, service_coverage_en, faqs,
      cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
      seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active
    } = req.body;
    
    const query = `
      UPDATE cities SET
        name_ar = $1, name_en = $2, slug = $3,
        hero_title_ar = $4, hero_title_en = $5, hero_desc_ar = $6, hero_desc_en = $7, featured_image = $8,
        service_coverage_ar = $9, service_coverage_en = $10, faqs = $11,
        cta_title_ar = $12, cta_title_en = $13, cta_desc_ar = $14, cta_desc_en = $15,
        seo_title_ar = $16, seo_title_en = $17, seo_desc_ar = $18, seo_desc_en = $19, canonical_url = $20, active = $21,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $22
      RETURNING *
    `;
    const values = [
      name_ar, name_en, slug,
      hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
      service_coverage_ar, service_coverage_en, JSON.stringify(faqs || []),
      cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
      seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active !== false,
      id
    ];
    
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating city', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete city (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cities WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting city', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
