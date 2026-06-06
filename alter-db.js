const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
});

async function run() {
  try {
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS industry_ar VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS industry_en VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS duration_ar VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS duration_en VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS volume_ar VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS volume_en VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS logo VARCHAR(255);');
    
    // Also check if any other table needs altering
    console.log("Success altering testimonials!");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
