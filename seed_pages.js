import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./Rokn Elryan.db');

db.serialize(() => {
  db.run(`INSERT OR IGNORE INTO dynamic_pages (slug, title_ar, title_en, content_ar, content_en, seo_desc_ar, seo_desc_en) 
    VALUES (
      'terms', 
      'الشروط والأحكام', 
      'Terms and Conditions', 
      '<p><b>مرحباً بك في صفحة الشروط والأحكام.</b></p><ul><li>الشرط الأول</li><li>الشرط الثاني</li></ul>', 
      '<p><b>Welcome to Terms and Conditions.</b></p><ul><li>Condition 1</li><li>Condition 2</li></ul>', 
      'شروط وأحكام ركن الريان', 
      'Rokn Elryan terms and conditions'
    )`);
    
  db.run(`INSERT OR IGNORE INTO dynamic_pages (slug, title_ar, title_en, content_ar, content_en, seo_desc_ar, seo_desc_en) 
    VALUES (
      'privacy', 
      'سياسة الخصوصية', 
      'Privacy Policy', 
      '<p><b>نحن نحترم خصوصيتك.</b></p><br/><p>بياناتك في أمان.</p>', 
      '<p><b>We respect your privacy.</b></p><br/><p>Your data is safe.</p>', 
      'سياسة الخصوصية لشركة ركن الريان', 
      'Rokn Elryan privacy policy'
    )`);
});
db.close(() => console.log('Seeded successfully'));
