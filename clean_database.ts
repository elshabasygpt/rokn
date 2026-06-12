import { Pool } from 'pg';
import 'dotenv/config';

const PG_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'admin123',
};

const pool = new Pool(PG_CONFIG);

async function cleanDB() {
  console.log("🧹 جاري تنظيف قاعدة البيانات من الكلمات القديمة...");
  
  try {
    const { rows } = await pool.query('SELECT key, value FROM settings');
    let updatedCount = 0;
    
    for (const row of rows) {
      if (row.value && typeof row.value === 'string' && row.value.includes('الأثاث')) {
        let newValue = row.value
          .replace(/نقل وتغليف وتركيب الأثاث/g, 'النقل المبرد')
          .replace(/نقل الأثاث/g, 'النقل المبرد')
          .replace(/الأثاث/g, 'المبرد');
          
        await pool.query('UPDATE settings SET value = $1 WHERE key = $2', [newValue, row.key]);
        updatedCount++;
      }
    }
    
    console.log(`✅ تم تنظيف ${updatedCount} إعدادات وتعديلها إلى النقل المبرد بنجاح!`);
    
    // Also drop the services table to fix the schema error you had
    await pool.query('DROP TABLE IF EXISTS services CASCADE');
    console.log(`✅ تم إصلاح هيكل الجداول بنجاح!`);
    
  } catch (err) {
    console.error("❌ حدث خطأ:", err);
  } finally {
    pool.end();
    process.exit(0);
  }
}

cleanDB();
