/**
 * Migration script: SQLite → PostgreSQL
 * Transfers all data from alsuqour.db to the PostgreSQL database
 */
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'alsuqour.db');

const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'alsuqour',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
});

const sqliteDb = new sqlite3.Database(DB_PATH);

function sqliteAll(sql) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function migrate() {
  console.log('🚀 Starting SQLite → PostgreSQL migration...');
  console.log(`📁 SQLite DB: ${DB_PATH}`);

  const client = await pgPool.connect();

  try {
    await client.query('BEGIN');

    // 1. Migrate settings (upsert)
    console.log('\n📋 Migrating settings...');
    const settings = await sqliteAll('SELECT * FROM settings');
    for (const s of settings) {
      let value = s.value;
      // Parse if it's a string
      if (typeof value === 'string') {
        try { value = JSON.parse(value); } catch(e) {}
      }
      await client.query(
        `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, $3)
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = $3`,
        [s.key, JSON.stringify(value), s.updated_at || new Date()]
      );
    }
    console.log(`   ✅ ${settings.length} settings migrated`);

    // 2. Migrate services
    console.log('\n🔧 Migrating services...');
    const services = await sqliteAll('SELECT * FROM services');
    if (services.length > 0) {
      await client.query('DELETE FROM services');
      for (const s of services) {
        // Parse arrays from JSON strings
        let features_ar = s.features_ar;
        let features_en = s.features_en;
        let images = s.images;
        try { if (typeof features_ar === 'string') features_ar = JSON.parse(features_ar); } catch(e) { features_ar = []; }
        try { if (typeof features_en === 'string') features_en = JSON.parse(features_en); } catch(e) { features_en = []; }
        try { if (typeof images === 'string') images = JSON.parse(images); } catch(e) { images = []; }

        await client.query(
          `INSERT INTO services (id, icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, images, sort_order, active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [s.id, s.icon || 'Truck', s.title_ar, s.title_en, s.desc_ar, s.desc_en,
           Array.isArray(features_ar) ? features_ar : [], 
           Array.isArray(features_en) ? features_en : [],
           Array.isArray(images) ? images : [],
           s.sort_order || 0, s.active !== 0, s.created_at || new Date(), s.updated_at || new Date()]
        );
      }
      // Reset sequence
      await client.query(`SELECT setval('services_id_seq', (SELECT COALESCE(MAX(id),0) FROM services))`);
      console.log(`   ✅ ${services.length} services migrated`);
    } else {
      console.log('   ⏭️ No services to migrate');
    }

    // 3. Migrate gallery
    console.log('\n🖼️ Migrating gallery...');
    const gallery = await sqliteAll('SELECT * FROM gallery');
    if (gallery.length > 0) {
      await client.query('DELETE FROM gallery');
      for (const g of gallery) {
        await client.query(
          `INSERT INTO gallery (id, type, category, url, thumbnail, title_ar, title_en, active, sort_order, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [g.id, g.type || 'image', g.category || 'moving', g.url, g.thumbnail,
           g.title_ar, g.title_en, g.active !== 0, g.sort_order || 0, g.created_at || new Date()]
        );
      }
      await client.query(`SELECT setval('gallery_id_seq', (SELECT COALESCE(MAX(id),0) FROM gallery))`);
      console.log(`   ✅ ${gallery.length} gallery items migrated`);
    } else {
      console.log('   ⏭️ No gallery items to migrate');
    }

    // 4. Migrate testimonials
    console.log('\n⭐ Migrating testimonials...');
    const testimonials = await sqliteAll('SELECT * FROM testimonials');
    if (testimonials.length > 0) {
      await client.query('DELETE FROM testimonials');
      for (const t of testimonials) {
        await client.query(
          `INSERT INTO testimonials (id, name_ar, name_en, role_ar, role_en, text_ar, text_en, rating, active, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [t.id, t.name_ar, t.name_en, t.role_ar || '', t.role_en || '',
           t.text_ar, t.text_en, t.rating || 5, t.active !== 0, t.created_at || new Date()]
        );
      }
      await client.query(`SELECT setval('testimonials_id_seq', (SELECT COALESCE(MAX(id),0) FROM testimonials))`);
      console.log(`   ✅ ${testimonials.length} testimonials migrated`);
    } else {
      console.log('   ⏭️ No testimonials to migrate');
    }

    // 5. Migrate partners
    console.log('\n🤝 Migrating partners...');
    const partners = await sqliteAll('SELECT * FROM partners');
    if (partners.length > 0) {
      await client.query('DELETE FROM partners');
      for (const p of partners) {
        await client.query(
          `INSERT INTO partners (id, name, image_url, svg_code, color, active, sort_order, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [p.id, p.name, p.image_url || '', p.svg_code || '', p.color || '',
           p.active !== 0, p.sort_order || 0, p.created_at || new Date()]
        );
      }
      await client.query(`SELECT setval('partners_id_seq', (SELECT COALESCE(MAX(id),0) FROM partners))`);
      console.log(`   ✅ ${partners.length} partners migrated`);
    } else {
      console.log('   ⏭️ No partners to migrate');
    }

    // 6. Migrate FAQs
    console.log('\n❓ Migrating FAQs...');
    const faqs = await sqliteAll('SELECT * FROM faqs');
    if (faqs.length > 0) {
      await client.query('DELETE FROM faqs');
      for (const f of faqs) {
        await client.query(
          `INSERT INTO faqs (id, q_ar, a_ar, q_en, a_en, active, sort_order, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [f.id, f.q_ar, f.a_ar, f.q_en, f.a_en, f.active !== 0, f.sort_order || 0, f.created_at || new Date()]
        );
      }
      await client.query(`SELECT setval('faqs_id_seq', (SELECT COALESCE(MAX(id),0) FROM faqs))`);
      console.log(`   ✅ ${faqs.length} FAQs migrated`);
    } else {
      console.log('   ⏭️ No FAQs to migrate');
    }

    // 7. Migrate bookings
    console.log('\n📦 Migrating bookings...');
    const bookings = await sqliteAll('SELECT * FROM bookings');
    if (bookings.length > 0) {
      await client.query('DELETE FROM bookings');
      for (const b of bookings) {
        await client.query(
          `INSERT INTO bookings (id, from_city, to_city, rooms, notes, client_name, client_phone, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [b.id, b.from_city, b.to_city, b.rooms, b.notes,
           b.client_name, b.client_phone, b.status || 'new', b.created_at || new Date(), b.updated_at || new Date()]
        );
      }
      await client.query(`SELECT setval('bookings_id_seq', (SELECT COALESCE(MAX(id),0) FROM bookings))`);
      console.log(`   ✅ ${bookings.length} bookings migrated`);
    } else {
      console.log('   ⏭️ No bookings to migrate');
    }

    // 8. Migrate articles
    console.log('\n📰 Migrating articles...');
    const articles = await sqliteAll('SELECT * FROM articles');
    if (articles.length > 0) {
      await client.query('DELETE FROM articles');
      for (const a of articles) {
        await client.query(
          `INSERT INTO articles (id, title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, active, views, seo_keywords, is_featured, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [a.id, a.title_ar, a.title_en, a.slug, a.content_ar, a.content_en,
           a.image, a.seo_desc_ar, a.seo_desc_en, a.active !== 0, a.views || 0,
           a.seo_keywords, a.is_featured ? true : false, a.created_at || new Date(), a.updated_at || new Date()]
        );
      }
      await client.query(`SELECT setval('articles_id_seq', (SELECT COALESCE(MAX(id),0) FROM articles))`);
      console.log(`   ✅ ${articles.length} articles migrated`);
    } else {
      console.log('   ⏭️ No articles to migrate');
    }

    // 9. Migrate admin users (keep existing PG admin, add SQLite admins)
    console.log('\n👤 Migrating admin users...');
    const admins = await sqliteAll('SELECT * FROM admin');
    if (admins.length > 0) {
      await client.query('DELETE FROM admin');
      for (const a of admins) {
        await client.query(
          `INSERT INTO admin (id, username, password, permissions, created_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [a.id, a.username, a.password, a.permissions || '["all"]', a.created_at || new Date()]
        );
      }
      await client.query(`SELECT setval('admin_id_seq', (SELECT COALESCE(MAX(id),0) FROM admin))`);
      console.log(`   ✅ ${admins.length} admin users migrated`);
    } else {
      console.log('   ⏭️ No admin users to migrate (keeping PG default)');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Migration completed successfully!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed, rolling back...', err);
  } finally {
    client.release();
    pgPool.end();
    sqliteDb.close();
  }
}

migrate();
