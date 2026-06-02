const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'alsuqour',
  user: 'postgres',
  password: ''
});

const val = {
  list: [
    { ar: 'أبها', en: 'Abha' },
    { ar: 'خميس مشيط', en: 'Khamis Mushait' },
    { ar: 'الرياض', en: 'Riyadh' },
    { ar: 'جدة', en: 'Jeddah' },
    { ar: 'الدمام', en: 'Dammam' },
    { ar: 'مكة المكرمة', en: 'Makkah' },
    { ar: 'المدينة المنورة', en: 'Madinah' },
    { ar: 'جازان', en: 'Jazan' },
    { ar: 'نجران', en: 'Najran' }
  ]
};

pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', ['citiesMeta', JSON.stringify(val)])
  .then(() => {
    console.log('Successfully inserted default citiesMeta.');
    pool.end();
  })
  .catch(console.error);
