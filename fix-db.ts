import pool from './server/db';

async function run() {
  try {
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS industry_ar VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS industry_en VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS duration_ar VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS duration_en VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS volume_ar VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS volume_en VARCHAR(255);');
    await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS logo VARCHAR(255);');
    
    console.log("Success altering testimonials!");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
