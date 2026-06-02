import pool from './server/db.js';

async function main() {
  try {
    console.log('Creating careers tables...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        location_ar VARCHAR(255),
        location_en VARCHAR(255),
        description_ar TEXT,
        description_en TEXT,
        requirements_ar TEXT,
        requirements_en TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        resume_url TEXT,
        cover_letter TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tables jobs and job_applications created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

main();
