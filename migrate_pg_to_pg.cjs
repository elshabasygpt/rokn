/**
 * Direct PG-to-PG Migration: Port 5433 (old) → Port 5432 (new)
 */
const { Pool } = require('pg');

const oldPool = new Pool({
  host: 'localhost', port: 5433, database: 'alsuqour',
  user: 'postgres', password: '',
});

const newPool = new Pool({
  host: 'localhost', port: 5432, database: 'alsuqour',
  user: 'postgres', password: '',
});

async function migrate() {
  console.log('🚀 Starting PG 5433 → PG 5432 migration...\n');

  const newClient = await newPool.connect();
  const oldClient = await oldPool.connect();

  try {
    await newClient.query('BEGIN');

    // 1. Admin
    console.log('👤 Migrating admin...');
    const admins = (await oldClient.query('SELECT * FROM admin')).rows;
    for (const a of admins) {
      await newClient.query(
        'INSERT INTO admin (id, username, password, permissions, created_at) VALUES ($1,$2,$3,$4,$5)',
        [a.id, a.username, a.password, a.permissions || '["all"]', a.created_at]
      );
    }
    console.log(`   ✅ ${admins.length} admins`);

    // 2. Settings
    console.log('📋 Migrating settings...');
    const settings = (await oldClient.query('SELECT * FROM settings')).rows;
    for (const s of settings) {
      await newClient.query(
        'INSERT INTO settings (key, value, updated_at) VALUES ($1,$2,$3)',
        [s.key, s.value, s.updated_at]
      );
    }
    console.log(`   ✅ ${settings.length} settings`);

    // 3. Gallery
    console.log('🖼️ Migrating gallery...');
    const gallery = (await oldClient.query('SELECT * FROM gallery')).rows;
    for (const g of gallery) {
      await newClient.query(
        'INSERT INTO gallery (id, type, category, url, thumbnail, title_ar, title_en, active, sort_order, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [g.id, g.type, g.category, g.url, g.thumbnail, g.title_ar, g.title_en, g.active, g.sort_order, g.created_at]
      );
    }
    console.log(`   ✅ ${gallery.length} gallery items`);

    // 4. Partners
    console.log('🤝 Migrating partners...');
    const partners = (await oldClient.query('SELECT * FROM partners')).rows;
    for (const p of partners) {
      await newClient.query(
        'INSERT INTO partners (id, name, image_url, svg_code, color, active, sort_order, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [p.id, p.name, p.image_url, p.svg_code, p.color, p.active, p.sort_order, p.created_at]
      );
    }
    console.log(`   ✅ ${partners.length} partners`);

    // 5. FAQs
    console.log('❓ Migrating FAQs...');
    const faqs = (await oldClient.query('SELECT * FROM faqs')).rows;
    for (const f of faqs) {
      await newClient.query(
        'INSERT INTO faqs (id, q_ar, a_ar, q_en, a_en, active, sort_order, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [f.id, f.q_ar, f.a_ar, f.q_en, f.a_en, f.active, f.sort_order, f.created_at]
      );
    }
    console.log(`   ✅ ${faqs.length} FAQs`);

    // 6. Articles
    console.log('📰 Migrating articles...');
    const articles = (await oldClient.query('SELECT * FROM articles')).rows;
    for (const a of articles) {
      await newClient.query(
        'INSERT INTO articles (id, title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, active, views, seo_keywords, is_featured, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',
        [a.id, a.title_ar, a.title_en, a.slug, a.content_ar, a.content_en, a.image, a.seo_desc_ar, a.seo_desc_en, a.active, a.views, a.seo_keywords, a.is_featured, a.created_at, a.updated_at]
      );
    }
    console.log(`   ✅ ${articles.length} articles`);

    // 7. Bookings
    console.log('📦 Migrating bookings...');
    const bookings = (await oldClient.query('SELECT * FROM bookings')).rows;
    for (const b of bookings) {
      await newClient.query(
        'INSERT INTO bookings (id, from_city, to_city, rooms, notes, client_name, client_phone, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [b.id, b.from_city, b.to_city, b.rooms, b.notes, b.client_name, b.client_phone, b.status, b.created_at, b.updated_at]
      );
    }
    console.log(`   ✅ ${bookings.length} bookings`);

    // 8. Testimonials
    console.log('⭐ Migrating testimonials...');
    const testimonials = (await oldClient.query('SELECT * FROM testimonials')).rows;
    for (const t of testimonials) {
      await newClient.query(
        'INSERT INTO testimonials (id, name_ar, name_en, role_ar, role_en, text_ar, text_en, rating, active, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [t.id, t.name_ar, t.name_en, t.role_ar, t.role_en, t.text_ar, t.text_en, t.rating, t.active, t.created_at]
      );
    }
    console.log(`   ✅ ${testimonials.length} testimonials`);

    // 9. Services
    console.log('🔧 Migrating services...');
    const services = (await oldClient.query('SELECT * FROM services')).rows;
    for (const s of services) {
      await newClient.query(
        'INSERT INTO services (id, icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, images, sort_order, active, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
        [s.id, s.icon, s.title_ar, s.title_en, s.desc_ar, s.desc_en, s.features_ar, s.features_en, s.images, s.sort_order, s.active, s.created_at, s.updated_at]
      );
    }
    console.log(`   ✅ ${services.length} services`);

    // Reset sequences
    const tables = ['admin', 'articles', 'bookings', 'faqs', 'gallery', 'partners', 'services', 'testimonials'];
    for (const t of tables) {
      await newClient.query(`SELECT setval('${t}_id_seq', COALESCE((SELECT MAX(id) FROM ${t}), 0) + 1, false)`);
    }

    await newClient.query('COMMIT');
    console.log('\n🎉 Migration completed successfully!');

  } catch (err) {
    await newClient.query('ROLLBACK');
    console.error('\n❌ Migration failed:', err.message);
  } finally {
    newClient.release();
    oldClient.release();
    oldPool.end();
    newPool.end();
  }
}

migrate();
