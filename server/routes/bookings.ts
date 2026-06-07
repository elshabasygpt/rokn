import { Router, Request, Response } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { sendBookingNotification } from '../notify';

const router = Router();

// Custom In-Memory Rate Limiter for Bookings (Max 10 requests per 15 mins)
const ipHits = new Map<string, { count: number, resetTime: number }>();
const rateLimiter = (req: Request, res: Response, next: Function) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = ipHits.get(ip);
  
  if (record && now < record.resetTime) {
    if (record.count >= 10) {
      return res.status(429).json({ error: 'Too many requests from this IP. Please try again after 15 minutes.' });
    }
    record.count++;
  } else {
    ipHits.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
  }
  next();
};

// POST /api/bookings (public — from contact form)
router.post('/', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { from_city, to_city, rooms, notes, client_name, client_phone, marketing_attribution, company_name, email, industry } = req.body;
    if (!client_name || !client_phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const parsedRooms = parseInt(rooms as string, 10);
    const roomsValue = isNaN(parsedRooms) ? null : parsedRooms;

    const result = await pool.query(
      `INSERT INTO bookings (from_city, to_city, rooms, notes, client_name, client_phone, marketing_attribution, company_name, email, industry)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [from_city || '', to_city || '', roomsValue, notes || '', client_name, client_phone, marketing_attribution || null, company_name || null, email || null, industry || null]
    );

    const booking = result.rows[0];

    // Log initial creation activity
    await pool.query(
      'INSERT INTO lead_activities (lead_id, activity_type, description) VALUES ($1, $2, $3)',
      [booking.id, 'note_added', 'تم استلام طلب جديد عبر النموذج الإلكتروني.']
    );

    // Send notification asynchronously (don't block response)
    sendBookingNotification(booking).catch(err => console.error('Notification error:', err));

    return res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings (admin)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, search, page = '1', limit = '50' } = req.query;
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status && status !== 'all') {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      query += ` AND (client_name ILIKE $${paramCount} OR client_phone ILIKE $${paramCount} OR company_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Count query for pagination
    const countResult = await pool.query(`SELECT COUNT(*) FROM (${query}) AS c`, params);
    const total = parseInt(countResult.rows[0].count);

    query += ' ORDER BY created_at DESC';

    const p = parseInt(page as string) || 1;
    const l = parseInt(limit as string) || 50;
    const offset = (p - 1) * l;
    
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(l, offset);

    const result = await pool.query(query, params);
    return res.json({ data: result.rows, total, page: p, limit: l });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/export (admin)
router.get('/export', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status && status !== 'all') {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      query += ` AND (client_name ILIKE $${paramCount} OR client_phone ILIKE $${paramCount} OR company_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    
    // Create CSV
    const headers = ['ID', 'Date', 'Client', 'Phone', 'Company', 'Industry', 'Value', 'Source', 'From', 'To', 'Status', 'Notes'];
    const escapeCsv = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
    const rows = result.rows.map(b => [
      b.id,
      new Date(b.created_at).toISOString().split('T')[0],
      escapeCsv(b.client_name),
      escapeCsv(b.client_phone),
      escapeCsv(b.company_name),
      escapeCsv(b.industry),
      b.lead_value || 0,
      escapeCsv(b.lead_source),
      escapeCsv(b.from_city),
      escapeCsv(b.to_city),
      escapeCsv(b.status),
      escapeCsv(b.notes)
    ].join(','));
    
    const csv = [headers.join(','), ...rows].join('\n');
    
    res.header('Content-Type', 'text/csv');
    res.attachment('leads_export.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/bookings/:id (admin - update CRM fields)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { company_name, industry, lead_source, lead_value, owner_id } = req.body;
    
    // Fix empty string causing Postgres numeric syntax error
    const parsedLeadValue = lead_value === '' || lead_value === null ? null : parseFloat(lead_value);
    const parsedOwnerId = owner_id === '' || owner_id === null ? null : parseInt(owner_id);
    
    const result = await pool.query(
      `UPDATE bookings 
       SET company_name = $1, industry = $2, lead_source = $3, lead_value = $4, owner_id = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [company_name, industry, lead_source, parsedLeadValue, parsedOwnerId, id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    // Log the update
    await pool.query(
      'INSERT INTO lead_activities (lead_id, admin_id, activity_type, description) VALUES ($1, $2, $3, $4)',
      [id, req.admin?.id, 'note_added', `تم تحديث بيانات العميل: الشركة (${company_name || 'غير محدد'})`]
    );
    
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/stats (admin)
router.get('/stats', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM bookings');
    const newCount = await pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'new'");
    const inProgress = await pool.query("SELECT COUNT(*) FROM bookings WHERE status IN ('qualified', 'quoted', 'negotiation', 'in_progress')");
    const wonCount = await pool.query("SELECT COUNT(*) FROM bookings WHERE status IN ('won', 'completed')");

    return res.json({
      total: parseInt(total.rows[0].count),
      new: parseInt(newCount.rows[0].count),
      in_progress: parseInt(inProgress.rows[0].count),
      completed: parseInt(wonCount.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/bookings/:id/status (admin)
router.put('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['new', 'qualified', 'quoted', 'negotiation', 'won', 'lost', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    // Log the status change activity
    await pool.query(
      'INSERT INTO lead_activities (lead_id, admin_id, activity_type, description) VALUES ($1, $2, $3, $4)',
      [id, req.admin?.id, 'note_added', `تم تغيير الحالة إلى: ${status}`]
    );
    
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/bookings/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/bookings/:id/activities (admin)
router.post('/:id/activities', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { activity_type, description } = req.body;
    
    const result = await pool.query(
      'INSERT INTO lead_activities (lead_id, admin_id, activity_type, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, req.admin?.id, activity_type, description]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/:id/activities (admin)
router.get('/:id/activities', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT la.*, a.username as admin_name 
       FROM lead_activities la 
       LEFT JOIN admin a ON la.admin_id = a.id 
       WHERE la.lead_id = $1 
       ORDER BY la.created_at DESC`,
      [id]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
