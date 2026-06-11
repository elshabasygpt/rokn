import { initDB } from './server/db.js';
import pool from './server/db.js';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const ALL_TABLES = [
  'admin',
  'settings',
  'services',
  'gallery',
  'articles',
  'testimonials',
  'partners',
  'faqs',
  'cities',
  'industries',
  'case_studies',
  'redirects',
  'dynamic_pages',
  'jobs',
  'job_applications',
  'bookings',
  'lead_activities'
];

async function run() {
  try {
    console.log('Testing Database Connection...');
    await pool.query('SELECT 1');
    console.log('Connected.');

    const backupData: Record<string, any[]> = {};
    for (const table of ALL_TABLES) {
      try {
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        backupData[table] = rows;
        console.log(`Table ${table} exported successfully. Rows: ${rows.length}`);
      } catch (err) {
        console.error(`Error exporting table ${table}:`, err);
      }
    }
    
    console.log('Successfully queried all 17 tables!');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

run();
