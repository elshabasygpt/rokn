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

function deepReplace(obj: any): any {
  if (typeof obj === 'string') {
    return obj
      .replace(/نقل وتغليف وتركيب الأثاث/g, 'النقل المبرد')
      .replace(/نقل الأثاث/g, 'النقل المبرد')
      .replace(/الأثاث/g, 'المبرد');
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepReplace(item));
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = deepReplace(obj[key]);
    }
    return newObj;
  }
  return obj;
}

async function cleanDB() {
  console.log("🧹 جاري الفحص الدقيق والعميق لقاعدة البيانات...");
  
  try {
    const { rows } = await pool.query('SELECT key, value FROM settings');
    let updatedCount = 0;
    
    for (const row of rows) {
      if (!row.value) continue;
      
      let parsedValue;
      try {
        parsedValue = JSON.parse(row.value);
      } catch (e) {
        parsedValue = row.value; // It's just a regular string
      }
      
      const newValueObj = deepReplace(parsedValue);
      const newValueStr = typeof newValueObj === 'string' ? newValueObj : JSON.stringify(newValueObj);
      
      if (newValueStr !== row.value) {
        await pool.query('UPDATE settings SET value = $1 WHERE key = $2', [newValueStr, row.key]);
        updatedCount++;
      }
    }
    
    console.log(`✅ تم إيجاد وتحديث ${updatedCount} من الإعدادات التي تحتوي على كلمات قديمة!`);
    
  } catch (err) {
    console.error("❌ حدث خطأ:", err);
  } finally {
    pool.end();
    process.exit(0);
  }
}

cleanDB();
