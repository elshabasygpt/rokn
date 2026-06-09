import { Router, Request, Response } from 'express';
import pool from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/company (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT value FROM settings WHERE key = 'company_info'");
    
    // Default pre-filled company info if none exists
    const defaultInfo = {
      name: 'شركة ركن الريان',
      cr_number: '1131335461',
      unified_number: '7038221060',
      vat_number: '310636667600003',
      country: 'Saudi Arabia',
      region: 'Al Qassim',
      city: 'Buraidah',
      district: 'Al Safa',
      street: 'King Faisal Road',
      postal_code: '52353',
      building_number: '3472',
      additional_number: '7716',
      map_url: 'https://www.google.com/maps?q=26.318370819091797,43.96059036254883&z=17&hl=en',
      email: 'info@roknelryan.com',
      phone: '0502375887',
      whatsapp: '0502375887'
    };

    if (rows.length === 0) {
      return res.json(defaultInfo);
    }
    
    return res.json({ ...defaultInfo, ...rows[0].value });
  } catch (err) {
    console.error('Error fetching company info:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/company (admin only)
router.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const companyData = req.body;
    
    // Perform basic backend validation
    if (companyData.vat_number && !companyData.vat_number.startsWith('3')) {
      return res.status(400).json({ error: 'VAT number must start with 3' });
    }
    if (companyData.vat_number && companyData.vat_number.length !== 15) {
      return res.status(400).json({ error: 'VAT number must be exactly 15 digits' });
    }
    
    // Upsert logic
    const { rows } = await pool.query("SELECT id FROM settings WHERE key = 'company_info'");
    if (rows.length > 0) {
      await pool.query("UPDATE settings SET value = $1 WHERE key = 'company_info'", [companyData]);
    } else {
      await pool.query("INSERT INTO settings (key, value) VALUES ('company_info', $1)", [companyData]);
    }
    
    return res.json({ success: true, data: companyData });
  } catch (err) {
    console.error('Error updating company info:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
