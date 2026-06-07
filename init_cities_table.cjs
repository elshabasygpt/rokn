const { Pool } = require('pg');
require('dotenv').config();

const PG_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
};

const pool = new Pool(PG_CONFIG);

async function createCitiesTable() {
  try {
    console.log('Connecting to database...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        hero_title_ar VARCHAR(255),
        hero_title_en VARCHAR(255),
        hero_desc_ar TEXT,
        hero_desc_en TEXT,
        featured_image VARCHAR(500),
        service_coverage_ar TEXT,
        service_coverage_en TEXT,
        faqs JSONB DEFAULT '[]',
        cta_title_ar VARCHAR(255),
        cta_title_en VARCHAR(255),
        cta_desc_ar TEXT,
        cta_desc_en TEXT,
        seo_title_ar VARCHAR(255),
        seo_title_en VARCHAR(255),
        seo_desc_ar TEXT,
        seo_desc_en TEXT,
        canonical_url VARCHAR(500),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Successfully created "cities" table!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating table:', err);
    process.exit(1);
  }
}

createCitiesTable();
