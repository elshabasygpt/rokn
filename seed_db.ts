import poolWrapper from './server/db.js';
import fs from 'fs';

async function seed() {
  try {
    const ar = JSON.parse(fs.readFileSync('src/locales/ar.json', 'utf8'));
    const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
    const arItems = ar.servicesPage.items;
    const enItems = en.servicesPage.items;

    const icons = ['Truck', 'Package', 'Wrench', 'ShieldCheck'];

    await poolWrapper.query('DELETE FROM services');
    
    for (let i = 0; i < arItems.length; i++) {
        const item = arItems[i];
        const enItem = enItems[i];
        let featuresAr = item.features;
        let featuresEn = enItem.features;
        
        // Convert to Postgres Array Format if needed or just pass as an array 
        // node-postgres handles JS arrays automatically
        const query = 'INSERT INTO services (icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, sort_order, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)';
        const values = [
            icons[i] || 'Truck', 
            item.title, 
            enItem.title, 
            item.desc, 
            enItem.desc, 
            featuresAr,
            featuresEn, 
            i + 1
        ];
        await poolWrapper.query(query, values);
        console.log(`Inserted: ${item.title}`);
    }
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
