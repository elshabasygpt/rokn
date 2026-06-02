const pg = require('pg');

async function check(port) {
  const pool = new pg.Pool({
    host: 'localhost',
    port: port,
    database: 'alsuqour',
    user: 'postgres',
    password: '',
    connectionTimeoutMillis: 2000
  });

  try {
    const res = await pool.query('SELECT count(*) FROM partners');
    console.log(`Port ${port}: Connected, count = ${res.rows[0].count}`);
    const services = await pool.query('SELECT title_ar FROM services LIMIT 1');
    console.log(`Port ${port}: Sample service = ${services.rows[0]?.title_ar}`);
  } catch (err) {
    console.log(`Port ${port}: ${err.message}`);
  } finally {
    await pool.end();
  }
}

check(5432);
check(5433);
check(5434);
