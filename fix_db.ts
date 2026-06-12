import pool from './server/db.ts';

async function fix() {
  console.log("Fixing database...");
  await pool.query(`UPDATE settings SET value = REPLACE(value, 'نقل الأثاث', 'النقل المبرد')`);
  await pool.query(`UPDATE settings SET value = REPLACE(value, 'نقل وتغليف وتركيب الأثاث', 'النقل المبرد')`);
  await pool.query(`UPDATE settings SET value = REPLACE(value, 'الأثاث', 'المبرد')`);
  console.log("Database fixed!");
  process.exit(0);
}
fix();
