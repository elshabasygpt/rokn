import pool from '../server/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '../server/middleware/auth';

export default async function(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Pure Serverless Login
  if (req.url === '/api/auth/login' || req.url === '/auth/login' || req.url.includes('/login')) {
    try {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);

      const { username, password } = body;
      const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
      
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const admin = result.rows[0];
      const valid = await bcrypt.compare(password, admin.password);
      
      if (!valid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const permissions = admin.permissions ? (typeof admin.permissions === 'string' ? JSON.parse(admin.permissions) : admin.permissions) : ['all'];
      const token = generateToken({ id: admin.id, username: admin.username, permissions });
      
      return res.status(200).json({ token, admin: { id: admin.id, username: admin.username, permissions } });
    } catch (err: any) {
      console.error('SERVERLESS LOGIN ERROR:', err);
      return res.status(500).json({ error: 'DB_ERROR: ' + err.message });
    }
  }

  // Return 404 for anything else so we know it hit this function
  return res.status(404).json({ error: 'API route not found: ' + req.url });
}
