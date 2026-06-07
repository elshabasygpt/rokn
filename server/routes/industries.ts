import express from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all active industries
router.get('/', async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    let query = 'SELECT * FROM industries';
    if (!showAll) {
      query += ' WHERE active = true';
    }
    query += ' ORDER BY id ASC';
    
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching industries', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single industry by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await pool.query('SELECT * FROM industries WHERE slug = $1', [slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Industry not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching industry', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check unique slug
router.get('/check-slug/:slug', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const { id } = req.query;
    let query = 'SELECT id FROM industries WHERE slug = $1';
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

// Create industry
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name_ar, name_en, slug, icon,
      hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
      challenges_ar, challenges_en, solutions_ar, solutions_en, benefits_ar, benefits_en,
      related_services, related_case_studies, faqs,
      key_capabilities_ar, key_capabilities_en, certifications,
      cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
      seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active
    } = req.body;
    
    const query = `
      INSERT INTO industries (
        name_ar, name_en, slug, icon,
        hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
        challenges_ar, challenges_en, solutions_ar, solutions_en, benefits_ar, benefits_en,
        related_services, related_case_studies, faqs,
        key_capabilities_ar, key_capabilities_en, certifications,
        cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
        seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)
      RETURNING *
    `;
    const values = [
      name_ar, name_en, slug, icon || 'Building2',
      hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
      JSON.stringify(challenges_ar || []), JSON.stringify(challenges_en || []),
      JSON.stringify(solutions_ar || []), JSON.stringify(solutions_en || []),
      JSON.stringify(benefits_ar || []), JSON.stringify(benefits_en || []),
      JSON.stringify(related_services || []), JSON.stringify(related_case_studies || []), JSON.stringify(faqs || []),
      JSON.stringify(key_capabilities_ar || []), JSON.stringify(key_capabilities_en || []), JSON.stringify(certifications || []),
      cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
      seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active !== false
    ];
    
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating industry', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update industry
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_ar, name_en, slug, icon,
      hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
      challenges_ar, challenges_en, solutions_ar, solutions_en, benefits_ar, benefits_en,
      related_services, related_case_studies, faqs,
      key_capabilities_ar, key_capabilities_en, certifications,
      cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
      seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active
    } = req.body;
    
    const query = `
      UPDATE industries SET
        name_ar = $1, name_en = $2, slug = $3, icon = $4,
        hero_title_ar = $5, hero_title_en = $6, hero_desc_ar = $7, hero_desc_en = $8, featured_image = $9,
        challenges_ar = $10, challenges_en = $11, solutions_ar = $12, solutions_en = $13,
        benefits_ar = $14, benefits_en = $15, related_services = $16, related_case_studies = $17, faqs = $18,
        key_capabilities_ar = $19, key_capabilities_en = $20, certifications = $21,
        cta_title_ar = $22, cta_title_en = $23, cta_desc_ar = $24, cta_desc_en = $25,
        seo_title_ar = $26, seo_title_en = $27, seo_desc_ar = $28, seo_desc_en = $29, canonical_url = $30, active = $31,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $32
      RETURNING *
    `;
    const values = [
      name_ar, name_en, slug, icon || 'Building2',
      hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
      JSON.stringify(challenges_ar || []), JSON.stringify(challenges_en || []),
      JSON.stringify(solutions_ar || []), JSON.stringify(solutions_en || []),
      JSON.stringify(benefits_ar || []), JSON.stringify(benefits_en || []),
      JSON.stringify(related_services || []), JSON.stringify(related_case_studies || []), JSON.stringify(faqs || []),
      JSON.stringify(key_capabilities_ar || []), JSON.stringify(key_capabilities_en || []), JSON.stringify(certifications || []),
      cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
      seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, canonical_url, active !== false,
      id
    ];
    
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Industry not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating industry', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete industry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM industries WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting industry', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
