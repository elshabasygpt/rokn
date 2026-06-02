import pg from 'pg';
const { Pool } = pg;
import fs from 'fs';

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'alsuqour',
  user: 'postgres',
  password: ''
});

const ar = JSON.parse(fs.readFileSync('src/locales/ar.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const arItems = ar.servicesPage.items;
const enItems = en.servicesPage.items;

const icons = ['Truck', 'Package', 'Wrench', 'ShieldCheck'];

async function insert() {
  await pool.query('DELETE FROM services');
  for (let i = 0; i < arItems.length; i++) {
    const item = arItems[i];
    const enItem = enItems[i];
    const query = 'INSERT INTO services (icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [
      icons[i] || 'Truck', 
      item.title, 
      enItem.title, 
      item.desc, 
      enItem.desc, 
      item.features,
      enItem.features, 
      i + 1
    ];
    await pool.query(query, values);
  }
  console.log('Successfully inserted default services to PostgreSQL.');
  process.exit(0);
}

insert().catch(err => {
  console.error(err);
  process.exit(1);
});
