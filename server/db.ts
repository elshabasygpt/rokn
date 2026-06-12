import { Pool } from 'pg';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const PG_CONFIG = {
  host: process.env.DB_HOST || process.env.PGHOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  database: process.env.DB_NAME || process.env.PGDATABASE || 'Rokn Elryan',
  user: process.env.DB_USER || process.env.PGUSER || 'postgres',
  password: process.env.DB_PASS || process.env.PGPASSWORD || 'postgres',
};

const pool = process.env.DATABASE_URL || process.env.POSTGRES_URL
  ? new Pool({ 
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL, 
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3000 // Throw error instead of hanging
    })
  : new Pool({
      ...PG_CONFIG,
      connectionTimeoutMillis: 3000 // Throw error instead of hanging
    });

export default pool;

export async function initDB() {
  const schema = `
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        permissions TEXT DEFAULT '["all"]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(50) DEFAULT 'Truck',
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        desc_ar TEXT NOT NULL,
        desc_en TEXT NOT NULL,
        features_ar JSONB DEFAULT '[]'::jsonb,
        features_en JSONB DEFAULT '[]'::jsonb,
        images JSONB DEFAULT '[]'::jsonb,
        sort_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) DEFAULT 'image',
        category VARCHAR(50) DEFAULT 'moving',
        url VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        title_ar VARCHAR(255),
        title_en VARCHAR(255),
        active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        role_ar VARCHAR(255),
        role_en VARCHAR(255),
        text_ar TEXT NOT NULL,
        text_en TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        active BOOLEAN DEFAULT true,
        industry_ar VARCHAR(255),
        industry_en VARCHAR(255),
        duration_ar VARCHAR(255),
        duration_en VARCHAR(255),
        volume_ar VARCHAR(255),
        volume_en VARCHAR(255),
        logo VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        svg_code TEXT,
        color VARCHAR(50),
        active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        q_ar VARCHAR(255) NOT NULL,
        a_ar TEXT NOT NULL,
        q_en VARCHAR(255) NOT NULL,
        a_en TEXT NOT NULL,
        active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        from_city VARCHAR(100),
        to_city VARCHAR(100),
        rooms INTEGER,
        notes TEXT,
        client_name VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50) NOT NULL,
        company_name VARCHAR(255),
        email VARCHAR(255),
        industry VARCHAR(100),
        lead_source VARCHAR(100),
        lead_value DECIMAL(10, 2),
        owner_id INTEGER REFERENCES admin(id) ON DELETE SET NULL,
        next_followup_date TIMESTAMP,
        marketing_attribution JSONB,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lead_activities (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        admin_id INTEGER REFERENCES admin(id) ON DELETE SET NULL,
        activity_type VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content_ar TEXT NOT NULL,
        content_en TEXT NOT NULL,
        image VARCHAR(255),
        seo_desc_ar TEXT,
        seo_desc_en TEXT,
        active BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        seo_keywords TEXT,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'Full-time',
        location_ar VARCHAR(100) NOT NULL,
        location_en VARCHAR(100) NOT NULL,
        description_ar TEXT NOT NULL,
        description_en TEXT NOT NULL,
        requirements_ar TEXT NOT NULL,
        requirements_en TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        resume_url TEXT NOT NULL,
        cover_letter TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

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

      CREATE TABLE IF NOT EXISTS industries (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        icon VARCHAR(100) DEFAULT 'Building2',
        hero_title_ar VARCHAR(255),
        hero_title_en VARCHAR(255),
        hero_desc_ar TEXT,
        hero_desc_en TEXT,
        featured_image VARCHAR(500),
        challenges_ar JSONB DEFAULT '[]',
        challenges_en JSONB DEFAULT '[]',
        solutions_ar JSONB DEFAULT '[]',
        solutions_en JSONB DEFAULT '[]',
        benefits_ar JSONB DEFAULT '[]',
        benefits_en JSONB DEFAULT '[]',
        related_services JSONB DEFAULT '[]',
        related_case_studies JSONB DEFAULT '[]',
        faqs JSONB DEFAULT '[]',
        key_capabilities_ar JSONB DEFAULT '[]',
        key_capabilities_en JSONB DEFAULT '[]',
        certifications JSONB DEFAULT '[]',
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

      -- Safe migrations for existing table
      ALTER TABLE cities ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
      
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS challenges_ar JSONB DEFAULT '[]';
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS challenges_en JSONB DEFAULT '[]';
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS solutions_ar JSONB DEFAULT '[]';
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS solutions_en JSONB DEFAULT '[]';
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS benefits_ar JSONB DEFAULT '[]';
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS benefits_en JSONB DEFAULT '[]';
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS related_services JSONB DEFAULT '[]';
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS related_case_studies JSONB DEFAULT '[]';
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS cta_desc_ar TEXT;
      ALTER TABLE industries ADD COLUMN IF NOT EXISTS cta_desc_en TEXT;

      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS email VARCHAR(255);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS lead_source VARCHAR(100);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS lead_value DECIMAL(10, 2);
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES admin(id) ON DELETE SET NULL;
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS next_followup_date TIMESTAMP;
      ALTER TABLE bookings ADD COLUMN IF NOT EXISTS marketing_attribution JSONB;
      CREATE TABLE IF NOT EXISTS case_studies (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        industry_ar VARCHAR(255),
        industry_en VARCHAR(255),
        title_ar VARCHAR(255),
        title_en VARCHAR(255),
        problem_ar TEXT,
        problem_en TEXT,
        solution_ar TEXT,
        solution_en TEXT,
        kpi_ar VARCHAR(255),
        kpi_en VARCHAR(255),
        image VARCHAR(500),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS redirects (
        id SERIAL PRIMARY KEY,
        old_path VARCHAR(500) UNIQUE NOT NULL,
        new_path VARCHAR(500) NOT NULL,
        status_code INTEGER DEFAULT 301,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS dynamic_pages (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        content_ar TEXT,
        content_en TEXT,
        seo_desc_ar TEXT,
        seo_desc_en TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `;

  try {
    // Attempt connecting just to ensure PostgreSQL is reachable
    await pool.query('SELECT 1');
    console.log('🐘 Connected to PostgreSQL Database');
    
    // Execute all table creations
    await pool.query(schema);

    // Add missing columns to testimonials if they don't exist
    try {
      await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS industry_ar VARCHAR(255);');
      await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS industry_en VARCHAR(255);');
      await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS duration_ar VARCHAR(255);');
      await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS duration_en VARCHAR(255);');
      await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS volume_ar VARCHAR(255);');
      await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS volume_en VARCHAR(255);');
      await pool.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS logo VARCHAR(255);');
    } catch (err) {
      console.log('Note: Some columns might already exist or could not be added', err);
    }

    // Insert default admin if none exists
    const adminCheck = await pool.query('SELECT id, password FROM admin WHERE username = $1', ['admin']);
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO admin (username, password, permissions) VALUES ($1, $2, $3)',
        ['admin', hashedPassword, '["all"]']
      );
      console.log('✅ Default admin user created');
    } else if (adminCheck.rows[0].password === 'admin123') {
      // Fix for databases that accidentally got the plain text password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query('UPDATE admin SET password = $1 WHERE username = $2', [hashedPassword, 'admin']);
      console.log('✅ Default admin password hash fixed');
    }

    console.log('✅ Database tables initialized successfully');
  } catch (err) {
    console.error('❌ PostgreSQL connection or initialization failed!');
    console.error('Error details:', err);
    process.exit(1); // Crash the server if database cannot be reached
  }
}
