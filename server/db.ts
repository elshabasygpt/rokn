import { Pool } from 'pg';
import 'dotenv/config';

const PG_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
};

const pool = new Pool(PG_CONFIG);

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
        features_ar TEXT NOT NULL,
        features_en TEXT NOT NULL,
        images TEXT NOT NULL,
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
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
      
      CREATE TABLE IF NOT EXISTS careers (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        department_ar VARCHAR(100) NOT NULL,
        department_en VARCHAR(100) NOT NULL,
        location_ar VARCHAR(100) NOT NULL,
        location_en VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 'full-time',
        desc_ar TEXT NOT NULL,
        desc_en TEXT NOT NULL,
        requirements_ar TEXT NOT NULL,
        requirements_en TEXT NOT NULL,
        benefits_ar TEXT,
        benefits_en TEXT,
        active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP,
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

    // Insert default admin if none exists
    const adminCheck = await pool.query('SELECT id FROM admin WHERE username = $1', ['admin']);
    if (adminCheck.rows.length === 0) {
      await pool.query(
        'INSERT INTO admin (username, password, permissions) VALUES ($1, $2, $3)',
        ['admin', 'admin123', '["all"]']
      );
      console.log('✅ Default admin user created');
    }

    console.log('✅ Database tables initialized successfully');
  } catch (err) {
    console.error('❌ PostgreSQL connection or initialization failed!');
    console.error('Error details:', err);
    process.exit(1); // Crash the server if database cannot be reached
  }
}
