import pg from 'pg';
const pool = new pg.Pool({ connectionString: 'postgresql://postgres:LbhgmNcbnrfVGsvVcgOZvVpyQGwhObnZ@hopper.proxy.rlwy.net:27398/railway' });
async function test() {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, my_text TEXT);');
    await pool.query('INSERT INTO test_table (my_text) VALUES ($1)', ['["foo", "bar"]']);
    const res = await pool.query('SELECT * FROM test_table');
    console.log('Result:', res.rows);
    await pool.query('DROP TABLE test_table;');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}
test();
