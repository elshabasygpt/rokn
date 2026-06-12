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

const defaultServices = [
  {
    icon: 'ThermometerSnowflake',
    title_ar: 'نقل مبرد ومجمد',
    title_en: 'Refrigerated Transport',
    desc_ar: 'نقل جميع أنواع المواد الغذائية الطازجة والمجمدة، بالإضافة إلى الأدوية، باستخدام شاحنات مزودة بأنظمة تبريد عالية الجودة.',
    desc_en: 'Transport of fresh and frozen food and medicine using high-quality refrigerated trucks.',
    features_ar: JSON.stringify(["تجميد وتبريد لدرجات دقيقة","نقل اللحوم والدواجن والأسماك","نقل الخضروات والفواكه","نقل الأدوية والمستلزمات الطبية"]),
    features_en: JSON.stringify(["Precise cooling & freezing","Meat, poultry & fish transport","Vegetables & fruits transport","Medicine transport"]),
    images: JSON.stringify(['https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop'])
  },
  {
    icon: 'Truck',
    title_ar: 'شاحنة ثلاجة للإيجار',
    title_en: 'Refrigerated Truck Rental',
    desc_ar: 'خدمة تأجير شاحنات مبردة لتلبية احتياجات الشركات، المصانع، والمطاعم سواء للمشاوير اليومية أو العقود الشهرية.',
    desc_en: 'Refrigerated truck rental for companies, factories, and restaurants.',
    features_ar: JSON.stringify(["إيجار يومي، شهري، سنوي","سائقون ذوو خبرة في التوزيع","صيانة دورية للثلاجات","أسعار خاصة للشركات"]),
    features_en: JSON.stringify(["Daily, monthly, yearly rental","Experienced distribution drivers","Periodic maintenance","Special corporate rates"]),
    images: JSON.stringify(['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop'])
  },
  {
    icon: 'PackageSearch',
    title_ar: 'توزيع البضائع الغذائية',
    title_en: 'Food Distribution',
    desc_ar: 'تولي خطوط السير اليومية لتوزيع المنتجات الغذائية على السوبرماركت والمطاعم بدقة والتزام تام بالمواعيد.',
    desc_en: 'Daily distribution routes for supermarkets and restaurants with strict schedules.',
    features_ar: JSON.stringify(["توزيع داخل جدة وخارجها","فريق محترف في التحميل والتنزيل","متابعة دقيقة للمسارات","الحفاظ على سلسلة التبريد"]),
    features_en: JSON.stringify(["Distribution inside and outside Jeddah","Professional loading team","Precise route tracking","Cold chain maintenance"]),
    images: JSON.stringify(['https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop'])
  },
  {
    icon: 'Map',
    title_ar: 'نقل مبرد بين المدن',
    title_en: 'Intercity Transport',
    desc_ar: 'نقل البضائع بحمولات مختلفة من مدينة جدة إلى الرياض، الدمام، المنطقة الجنوبية وكافة مناطق المملكة.',
    desc_en: 'Transport goods with various capacities between cities across the Kingdom.',
    features_ar: JSON.stringify(["تغطية شاملة للمملكة","سرعة في التوصيل","تأمين على البضائع","تتبع مستمر للرحلة"]),
    features_en: JSON.stringify(["Kingdom-wide coverage","Fast delivery","Cargo insurance","Continuous trip tracking"]),
    images: JSON.stringify(['https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=800&auto=format&fit=crop'])
  }
];

async function run() {
  console.log("🚚 جاري استعادة الخدمات المبردة الأساسية...");
  try {
    await pool.query('DELETE FROM services');
    for (const s of defaultServices) {
      await pool.query(
        `INSERT INTO services (icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, images) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [s.icon, s.title_ar, s.title_en, s.desc_ar, s.desc_en, s.features_ar, s.features_en, s.images]
      );
    }
    console.log("✅ تمت استعادة الخدمات الأربعة بنجاح!");
  } catch (err) {
    console.error("❌ حدث خطأ:", err);
  } finally {
    pool.end();
  }
}

run();
