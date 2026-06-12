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
      .replace(/الأثاث/g, 'النقل المبرد');
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

async function cleanTable(tableName: string, idColumn: string, columnsToUpdate: string[]) {
  try {
    const { rows } = await pool.query(`SELECT * FROM ${tableName}`);
    let updatedCount = 0;
    
    for (const row of rows) {
      let needsUpdate = false;
      const updateValues: any[] = [];
      const updateSet: string[] = [];
      
      for (const col of columnsToUpdate) {
        if (!row[col]) continue;
        
        let parsedValue;
        let isJson = false;
        try {
          if (typeof row[col] === 'string' && (row[col].startsWith('{') || row[col].startsWith('['))) {
            parsedValue = JSON.parse(row[col]);
            isJson = true;
          } else {
            parsedValue = row[col];
          }
        } catch (e) {
          parsedValue = row[col];
        }
        
        const newValueObj = deepReplace(parsedValue);
        const newValueStr = isJson && typeof newValueObj !== 'string' ? JSON.stringify(newValueObj) : newValueObj;
        
        if (JSON.stringify(newValueStr) !== JSON.stringify(row[col])) {
          needsUpdate = true;
          updateValues.push(newValueStr);
          updateSet.push(`${col} = $${updateValues.length}`);
        }
      }
      
      if (needsUpdate) {
        updateValues.push(row[idColumn]);
        await pool.query(
          `UPDATE ${tableName} SET ${updateSet.join(', ')} WHERE ${idColumn} = $${updateValues.length}`,
          updateValues
        );
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      console.log(`✅ تم إيجاد وتحديث ${updatedCount} صفوف في جدول ${tableName}!`);
    }
  } catch (err: any) {
    // Ignore errors for missing tables
    if (!err.message.includes('does not exist')) {
      console.error(`❌ خطأ في جدول ${tableName}:`, err.message);
    }
  }
}

async function cleanAll() {
  console.log("🧹 جاري الفحص الشامل لجميع الجداول لمسح كلمة أثاث...");
  
  await cleanTable('settings', 'key', ['value']);
  await cleanTable('services', 'id', ['title_ar', 'desc_ar', 'features_ar']);
  await cleanTable('articles', 'id', ['title_ar', 'content_ar', 'excerpt_ar']);
  await cleanTable('dynamic_pages', 'id', ['title_ar', 'content_ar']);
  await cleanTable('faqs', 'id', ['question_ar', 'answer_ar']);
  
  console.log("🎉 اكتمل التنظيف الشامل! يمكنك تصفح الموقع الآن بكل أمان.");
  pool.end();
  process.exit(0);
}

cleanAll();
