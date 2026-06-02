import { Pool, PoolClient } from 'pg';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let dbType: 'pg' | 'sqlite' = 'pg';
let pgPool: Pool | null = null;
let sqliteDb: any = null;

const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  connectionTimeoutMillis: 2000, // Short timeout for fallback
};

async function getDb() {
  if (dbType === 'pg' && pgPool) return pgPool;
  if (dbType === 'sqlite' && sqliteDb) return sqliteDb;

  // Try PostgreSQL first
  try {
    const pool = new Pool(PG_CONFIG);
    await pool.query('SELECT 1');
    console.log('🐘 Connected to PostgreSQL');
    pgPool = pool;
    dbType = 'pg';
    return pgPool;
  } catch (err) {
    console.log('⚠️ PostgreSQL connection failed, falling back to SQLite...');
    const dbPath = path.resolve(__dirname, '../Rokn Elryan.db');
    sqliteDb = new sqlite3.Database(dbPath);
    
    // Promisify sqlite methods
    sqliteDb.runAsync = (sql: string, params: any[] = []) => new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function(this: any, err: any) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
    
    sqliteDb.allAsync = (sql: string, params: any[] = []) => new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err: any, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    sqliteDb.getAsync = (sql: string, params: any[] = []) => new Promise((resolve, reject) => {
      sqliteDb.get(sql, params, (err: any, row: any) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    dbType = 'sqlite';
    console.log('📁 Using SQLite database at:', dbPath);
    return sqliteDb;
  }
}

const poolWrapper = {
  async query(sql: string, params: any[] = []) {
    const db = await getDb();
    
    if (dbType === 'pg') {
      return await (db as Pool).query(sql, params);
    } else {
      // SQLite Compatibility Layer
      let sqliteSql = sql
        .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/JSONB/gi, 'TEXT')
        .replace(/TEXT\[\]/gi, 'TEXT')
        .replace(/TIMESTAMP DEFAULT NOW\(\)/gi, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
        .replace(/DEFAULT NOW\(\)/gi, 'DEFAULT CURRENT_TIMESTAMP')
        .replace(/NOW\(\)/gi, "datetime('now')")
        .replace(/RETURNING \*/gi, ''); // SQLite support for RETURNING is inconsistent in older versions

      // Handle arrays/JSON in params for SQLite
      const processedParams = params.map(p => 
        Array.isArray(p) || (p !== null && typeof p === 'object') ? JSON.stringify(p) : p
      );

      // Convert array parameters to an object map {$1: val1, $2: val2} for SQLite named parameters
      const sqliteParams: Record<string, any> = {};
      processedParams.forEach((val, idx) => {
        sqliteParams[`$${idx + 1}`] = val;
      });

      try {
        if (sqliteSql.trim().toUpperCase().startsWith('SELECT')) {
          const rows = await sqliteDb.allAsync(sqliteSql, sqliteParams);
          // Parse JSON/Arrays back if needed
          const parsedRows = rows.map((row: any) => {
            const newRow = { ...row };
            for (const key in newRow) {
              if (typeof newRow[key] === 'string' && (newRow[key].startsWith('[') || newRow[key].startsWith('{'))) {
                try { newRow[key] = JSON.parse(newRow[key]); } catch(e) {}
              }
            }
            return newRow;
          });
          return { rows: parsedRows };
        } else {
          const result = await sqliteDb.runAsync(sqliteSql, sqliteParams);
          
          // If it was an INSERT/UPDATE and we stripped RETURNING, fetch the record
          if (sql.toUpperCase().includes('RETURNING *')) {
             const tableMatch = sql.match(/INTO\s+(\w+)|UPDATE\s+(\w+)/i);
             const tableName = tableMatch ? (tableMatch[1] || tableMatch[2]) : null;
             if (tableName) {
               const id = result.lastID;
               // Provide array here for getAsync since the query uses anonymous ? placeholder
               const row = await sqliteDb.getAsync(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
               // Parse JSON/Arrays back
               if (row) {
                 for (const key in row) {
                    if (typeof row[key] === 'string' && (row[key].startsWith('[') || row[key].startsWith('{'))) {
                      try { row[key] = JSON.parse(row[key]); } catch(e) {}
                    }
                 }
               }
               return { rows: row ? [row] : [] };
             }
          }
          return { rows: [], lastID: result.lastID, changes: result.changes };
        }
      } catch (err) {
        console.error('SQLite Query Error:', err, 'SQL:', sqliteSql);
        throw err;
      }
    }
  },
  async connect(): Promise<any> {
    const db = await getDb();
    if (dbType === 'pg') {
      return await (db as Pool).connect();
    } else {
      // Mock client for SQLite
      return {
        query: this.query.bind(this),
        release: () => {},
      };
    }
  }
};

export default poolWrapper;

export async function initDB() {
  const db = await getDb();
  
  // Transform schema for SQLite if needed
  let schema = `
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        permissions TEXT DEFAULT '["all"]',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(50) DEFAULT 'Truck',
        title_ar TEXT NOT NULL,
        title_en TEXT NOT NULL,
        desc_ar TEXT NOT NULL,
        desc_en TEXT NOT NULL,
        features_ar TEXT[] DEFAULT '{}',
        features_en TEXT[] DEFAULT '{}',
        images TEXT[] DEFAULT '{}',
        sort_order INT DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL DEFAULT 'image',
        category VARCHAR(50) NOT NULL DEFAULT 'moving',
        url TEXT NOT NULL,
        thumbnail TEXT,
        title_ar TEXT NOT NULL,
        title_en TEXT NOT NULL,
        active BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(200) NOT NULL,
        name_en VARCHAR(200) NOT NULL,
        role_ar VARCHAR(200) DEFAULT '',
        role_en VARCHAR(200) DEFAULT '',
        text_ar TEXT NOT NULL,
        text_en TEXT NOT NULL,
        rating INT DEFAULT 5,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        svg_code VARCHAR(255),
        color VARCHAR(50),
        active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        q_ar TEXT NOT NULL,
        a_ar TEXT NOT NULL,
        q_en TEXT NOT NULL,
        a_en TEXT NOT NULL,
        active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        from_city VARCHAR(100) NOT NULL,
        to_city VARCHAR(100) NOT NULL,
        rooms VARCHAR(50),
        notes TEXT,
        client_name VARCHAR(200) NOT NULL,
        client_phone VARCHAR(50) NOT NULL,
        status VARCHAR(30) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content_ar TEXT,
        content_en TEXT,
        image VARCHAR(255),
        seo_desc_ar TEXT,
        seo_desc_en TEXT,
        active BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        seo_keywords TEXT,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
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
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
  `;

  // PG-only migration (IF NOT EXISTS not supported in SQLite)
  const pgMigrations = `
    ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
  `;

  if (dbType === 'sqlite') {
    schema = schema
      .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/JSONB/gi, 'TEXT')
      .replace(/TEXT\[\]/gi, 'TEXT')
      .replace(/TIMESTAMP DEFAULT NOW\(\)/gi, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
      .replace(/DEFAULT NOW\(\)/gi, 'DEFAULT CURRENT_TIMESTAMP');
    
    // Split and execute one by one for SQLite
    const statements = schema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      await sqliteDb.runAsync(statement);
    }

    // SQLite migration: try adding column, ignore if already exists
    try {
      await sqliteDb.runAsync('ALTER TABLE articles ADD COLUMN is_featured BOOLEAN DEFAULT 0');
    } catch (e: any) {
      // Column already exists, ignore
    }
  } else {
    await (db as Pool).query(schema + pgMigrations);
  }

  // Seed admin if not exists
  const bcrypt = await import('bcryptjs');
  
  // Migration: Ensure permissions column exists
  try {
    await poolWrapper.query('ALTER TABLE admin ADD COLUMN permissions TEXT DEFAULT \'["all"]\'');
    console.log('✅ Added permissions column to admin table');
  } catch (err) {
    // Column already exists or table doesn't exist yet, ignore
  }

  const adminCheck = await poolWrapper.query('SELECT id FROM admin LIMIT 1');
  if (adminCheck.rows.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await poolWrapper.query('INSERT INTO admin (username, password, permissions) VALUES ($1, $2, $3)', ['admin', hash, '["all"]']);
    console.log('✅ Default admin created (admin / admin123)');
  }

  // Seed default settings if not exists
  const settingsCheck = await poolWrapper.query("SELECT key FROM settings WHERE key = 'general'");
  if (settingsCheck.rows.length === 0) {
    await poolWrapper.query(`INSERT INTO settings (key, value) VALUES 
      ('general', $1),
      ('hero', $2),
      ('promo', $3),
      ('notifications', $4),
      ('servicesMeta', $5),
      ('galleryMeta', $6),
      ('aboutMeta', $7),
      ('contactMeta', $8),
      ('citiesMeta', $9),
      ('footerMeta', $10)
    `, [

      JSON.stringify({
        phone1: '0502375887',
        phone2: '0534532962',
        whatsapp: '966502375887',
        address_ar: 'أبها - خميس مشيط',
        address_en: 'Abha - Khamis Mushait',
        hours_ar: 'متاحون 24 ساعة',
        hours_en: 'Available 24/7'
      }),
      JSON.stringify({
        title1_ar: 'شركة ركن الريان',
        title1_en: 'Rokn Elryan Company',
        title2_ar: 'الأولى لنقل الأثاث في المملكة',
        title2_en: 'The First for Furniture Moving in KSA',
        desc_ar: 'نحن في شركة ركن الريان نقدم لك خدمات نقل الأثاث من أبها وخميس مشيط بأعلى جودة، مع ضمان شامل على كافة منقولاتك.',
        desc_en: 'At Rokn Elryan Company, we offer top-quality furniture moving services from Abha and Khamis Mushait, with a total guarantee.',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        ]
      }),
      JSON.stringify({
        enabled: true,
        text_ar: 'خصم 20% على خدمات التغليف للحجوزات هذا الأسبوع!',
        text_en: '20% Discount on packing services for bookings this week!'
      }),
      JSON.stringify({
        email_enabled: false,
        email_to: '',
        whatsapp_enabled: true,
        whatsapp_to: '966502375887'
      }),
      JSON.stringify({
        title_ar: 'خدماتنا الاحترافية',
        title_en: 'Our Professional Services',
        desc_ar: 'نقدم مجموعة متكاملة من حلول نقل الأثاث المخصصة لتلبية احتياجاتك، تواصل معنا اليوم لتحصل على نقل آمن وموثوق.',
        desc_en: 'We offer a full range of customized furniture moving solutions to meet your needs, contact us today for safe and reliable moving.',
        cta_title_ar: 'هل أنت جاهز للانتقال؟',
        cta_title_en: 'Ready to Move?',
        cta_desc_ar: 'احصل على عرض سعر مجاني الآن وابدأ رحلتك مع ركن الريان.',
        cta_desc_en: 'Get a free quote now and start your journey with Rokn Elryan.',
        cta_btn1_ar: 'ابدأ الحجز الآن',
        cta_btn1_en: 'Book Now',
        cta_btn2_ar: 'تواصل عبر الواتساب',
        cta_btn2_en: 'WhatsApp Now'
      }),
      JSON.stringify({
        title_ar: 'معرض أعمالنا',
        title_en: 'Our Gallery',
        desc_ar: 'شاهد جوانب من أعمالنا السابقة في خدمات نقل وتغليف وتركيب الأثاث في مدن المملكة المختلفة.',
        desc_en: 'Watch aspects of our previous work in furniture moving, packing, and assembly services across various Kingdom cities.'
      }),
      JSON.stringify({
        title_ar: 'من نحن',
        title_en: 'About Us',
        subtitle_ar: 'شركة ركن الريان للنقل المبرد هي واحدة من الشركات الرائدة في مجال خدمات النقل والتغليف في المنطقة الجنوبية والمملكة العربية السعودية.',
        subtitle_en: 'Rokn Elryan Furniture Moving Company is one of the leading companies in moving and packing services in the Southern Region and Saudi Arabia.',
        story_title_ar: 'قصتنا',
        story_title_en: 'Our Story',
        story_p1_ar: 'بدأت رحلتنا في مدينة أبها برؤية واضحة: تقديم خدمة نقل أثاث ترتقي لمستوى تطلعات العملاء وتزيل عنهم عبء وقلق الانتقال من منزل لآخر.',
        story_p1_en: 'Our journey began in Abha with a clear vision: to provide a furniture moving service that elevates customer expectations and removes the burden and anxiety of moving.',
        story_p2_ar: 'على مدار أكثر من 15 عاماً، استطعنا بناء اسم يثق به الآلاف من العملاء، بفضل التزامنا بالجودة، الأمانة، والاحترافية في كل تفصيلة من تفاصيل العمل.',
        story_p2_en: 'Over more than 15 years, we have built a name trusted by thousands of customers, thanks to our commitment to quality, honesty, and professionalism in every detail.',
        story_p3_ar: 'اليوم، نمتلك أسطولاً ضخماً من الشاحنات المجهزة، وفريقاً يضم خيرة الفنيين والنجارين، لنغطي بخدماتنا كافة أنحاء المملكة انطلاقاً من المنطقة الجنوبية.',
        story_p3_en: 'Today, we own a massive fleet of equipped trucks, and a team featuring the best technicians and carpenters, to cover all parts of the Kingdom starting from the Southern Region.',
        vision_title_ar: 'رؤيتنا',
        vision_title_en: 'Our Vision',
        vision_desc_ar: 'أن نكون الخيار الأول والأكثر موثوقية لخدمات النقل اللوجستي ونقل الأثاث في المملكة، من خلال الجودة.',
        vision_desc_en: 'To be the first and most reliable choice for logistics and furniture moving services in the Kingdom, through quality.',
        mission_title_ar: 'رسالتنا',
        mission_title_en: 'Our Mission',
        mission_desc_ar: 'تقديم خدمات نقل آمنة، سريعة، واحترافية، تضمن راحة البال لعملائنا وتحافظ على ممتلكاتهم.',
        mission_desc_en: 'Providing safe, fast, and professional moving services that ensure peace of mind for our customers and preserve their belongings.',
        values_title_ar: 'قيمنا',
        values_title_en: 'Our Values',
        values_desc_ar: 'الأمانة والمصداقية، الجودة والإتقان، احترام وقت العميل، والتطوير المستمر.',
        values_desc_en: 'Honesty and credibility, quality and perfection, respecting the customer\'s time, and continuous development.'
      }),
      JSON.stringify({
        title_ar: 'اتصل بنا',
        title_en: 'Contact Us',
        desc_ar: 'نحن هنا للإجابة على استفساراتكم وتلبية احتياجاتكم في نقل الأثاث.',
        desc_en: 'We are here to answer your inquiries and meet your moving needs.',
        info_title_ar: 'معلومات التواصل',
        info_title_en: 'Contact Info',
        info_hqText_ar: 'المملكة العربية السعودية، أبها - حي الخالدية',
        info_hqText_en: 'Kingdom of Saudi Arabia, Abha - Al-Khaldiya Dist',
        info_hoursText_ar: 'نعمل على مدار 24 ساعة، طوال أيام الأسبوع',
        info_hoursText_en: 'We operate 24/7, all week long',
        waText_ar: 'تواصل معنا الآن عبر الواتساب للرد السريع',
        waText_en: 'Contact us now on WhatsApp for a quick reply',
        form_title_ar: 'احجز خدمتك الآن',
        form_title_en: 'Book Your Service Now',
        form_desc_ar: 'أكمل الخطوات الثلاث البسيطة وسنصلك في أسرع وقت',
        form_desc_en: 'Complete the three simple steps and we will reach you ASAP',
        form_successTitle_ar: 'تم استلام طلبك بنجاح!',
        form_successTitle_en: 'Your request was received successfully!',
        form_successDesc_ar: 'سنتواصل معك في أقرب وقت لتأكيد حجزك.',
        form_successDesc_en: 'We will contact you shortly to confirm your booking.'
      }),
      JSON.stringify({
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
      }),
      JSON.stringify({
        about_ar: 'الشركة الرائدة في خدمات نقل وتغليف الأثاث في المنطقة الجنوبية. نخدمكم باحترافية وأمان.',
        about_en: 'The leading company in furniture moving and packing services in the Southern Region. Serving you safely and professionally.',
        areas_ar: 'أبها\nخميس مشيط\nجميع مدن المملكة العربية السعودية',
        areas_en: 'Abha\nKhamis Mushait\nAll KSA Cities',
        copyright_ar: 'حقوق النشر © 2026 ركن الريان للنقل المبرد. جميع الحقوق محفوظة.',
        copyright_en: 'Copyright © 2026 Rokn Elryan Refrigerated Transport. All rights reserved.'
      })
    ]);
    console.log('✅ Default settings seeded');
  }


  // Seed default partners if not exists
  const partnersCheck = await poolWrapper.query('SELECT id FROM partners LIMIT 1');
  if (partnersCheck.rows.length === 0) {
    const defaultPartners = [
      ['ALRAJHI', '', 'Logo1', '#005a9c', 1],
      ['AL-FOUZAN', '', 'Logo2', '#d12027', 2],
      ['Logistics Co.', '', 'Logo3', '#007f3e', 3],
      ['South Housing', '', 'Logo4', '#1d1d1b', 4],
      ['Tatweer', '', 'Logo5', '#4a148c', 5],
    ];
    for (const p of defaultPartners) {
      await poolWrapper.query(
        'INSERT INTO partners (name, image_url, svg_code, color, sort_order) VALUES ($1, $2, $3, $4, $5)',
        p
      );
    }
    console.log('✅ Default partners seeded');
  }

  // Seed default faqs if not exists
  const faqsCheck = await poolWrapper.query('SELECT id FROM faqs LIMIT 1');
  if (faqsCheck.rows.length === 0) {
    const defaultFaqs = [
      ['كيف يتم تتبع درجات الحرارة أثناء النقل؟', 'نستخدم أحدث أنظمة التتبع GPS مع حساسات حرارة ذكية (Data Loggers) تراقب درجة حرارة الشحنة لحظة بلحظة وتصدر تنبيهات فورية في حال أي تغيير.', 'How are temperatures tracked during transit?', 'We use the latest GPS tracking systems with smart temperature sensors (Data Loggers) that monitor the cargo temperature in real-time and issue instant alerts for any changes.'],
      ['هل شاحناتكم مطابقة لاشتراطات هيئة الغذاء والدواء؟', 'نعم، جميع شاحناتنا معتمدة ومطابقة بالكامل للاشتراطات القياسية لهيئة الغذاء والدواء (SFDA) لضمان سلامة الأغذية والأدوية.', 'Are your trucks SFDA compliant?', 'Yes, all our trucks are fully certified and comply with the standard requirements of the Saudi Food and Drug Authority (SFDA) to ensure the safety of food and medicines.'],
      ['ما هي درجات الحرارة التي يمكنكم توفيرها؟', 'نوفر نطاق واسع يبدأ من التجميد العميق (-18 درجة مئوية) وحتى التبريد الإيجابي (+4 درجات مئوية)، بالإضافة إلى النقل الجاف حسب متطلبات الشحنة.', 'What temperatures can you provide?', 'We provide a wide range starting from deep freezing (-18°C) to positive cooling (+4°C), in addition to dry transport according to the cargo requirements.'],
      ['هل توفرون عقود إيجار للشركات والمطاعم؟', 'بالتأكيد، نوفر عقود تأجير يومية، شهرية، وسنوية لشاحنات التبريد بمرونة عالية مع توفير سائقين محترفين لتلبية خطط التوزيع الخاصة بكم.', 'Do you offer lease contracts for companies and restaurants?', 'Absolutely, we offer daily, monthly, and yearly rental contracts for refrigerated trucks with high flexibility, providing professional drivers to meet your distribution plans.']
    ];
    
    for (let i = 0; i < defaultFaqs.length; i++) {
        await poolWrapper.query(
            'INSERT INTO faqs (q_ar, a_ar, q_en, a_en, sort_order) VALUES ($1, $2, $3, $4, $5)', 
            [...defaultFaqs[i], i + 1]
        );
    }
    console.log('✅ Default FAQs seeded');
  }

  console.log('✅ Database initialized successfully');
}
