import { Pool } from 'pg';
import 'dotenv/config';

const PG_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'admin123',
};

const pool = new Pool(PG_CONFIG);

async function check() {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM services');
    console.log("Services count:", rows[0].count);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
check();
