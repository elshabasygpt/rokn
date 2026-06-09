import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const PG_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
};

const pool = new Pool(PG_CONFIG);

const cities = [
  { name_ar: 'القصيم', name_en: 'Qassim', slug: 'qassim', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'بريدة', name_en: 'Buraidah', slug: 'buraidah', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'عنيزة', name_en: 'Unaizah', slug: 'unaizah', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'الرس', name_en: 'Ar Rass', slug: 'ar-rass', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'البكيرية', name_en: 'Al Bukayriyah', slug: 'al-bukayriyah', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'المذنب', name_en: 'Al Mithnab', slug: 'al-mithnab', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'البدائع', name_en: 'Al Badayea', slug: 'al-badayea', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },

  { name_ar: 'الرياض', name_en: 'Riyadh', slug: 'riyadh', hero_img: 'https://images.unsplash.com/photo-1586724236152-f1e14f0ea51e?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'جدة', name_en: 'Jeddah', slug: 'jeddah', hero_img: 'https://images.unsplash.com/photo-1582206684742-1e90d79672bd?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'الدمام', name_en: 'Dammam', slug: 'dammam', hero_img: 'https://images.unsplash.com/photo-1628186175604-02302ed19a2e?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'مكة المكرمة', name_en: 'Makkah', slug: 'makkah', hero_img: 'https://images.unsplash.com/photo-1565552643982-2d1d0725a74e?q=80&w=2069&auto=format&fit=crop' },
  { name_ar: 'المدينة المنورة', name_en: 'Madinah', slug: 'madinah', hero_img: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop' },
  
  { name_ar: 'الخبر', name_en: 'Khobar', slug: 'khobar', hero_img: 'https://images.unsplash.com/photo-1628186175604-02302ed19a2e?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'الجبيل', name_en: 'Jubail', slug: 'jubail', hero_img: 'https://images.unsplash.com/photo-1628186175604-02302ed19a2e?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'الأحساء', name_en: 'Al Ahsa', slug: 'al-ahsa', hero_img: 'https://images.unsplash.com/photo-1628186175604-02302ed19a2e?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'الطائف', name_en: 'Taif', slug: 'taif', hero_img: 'https://images.unsplash.com/photo-1565552643982-2d1d0725a74e?q=80&w=2069&auto=format&fit=crop' },
  { name_ar: 'تبوك', name_en: 'Tabuk', slug: 'tabuk', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'حائل', name_en: 'Hail', slug: 'hail', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'أبها', name_en: 'Abha', slug: 'abha', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'جازان', name_en: 'Jizan', slug: 'jizan', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'نجران', name_en: 'Najran', slug: 'najran', hero_img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
  { name_ar: 'ينبع', name_en: 'Yanbu', slug: 'yanbu', hero_img: 'https://images.unsplash.com/photo-1582206684742-1e90d79672bd?q=80&w=2070&auto=format&fit=crop' }
];

async function seed() {
  try {
    for (const city of cities) {
      const hero_title_ar = "خدمات النقل المبرد والمجمد في " + city.name_ar;
      const hero_title_en = "Refrigerated Transport Services in " + city.name_en;
      const hero_desc_ar = "نقدم أفضل خدمات النقل اللوجستي المبرد والمجمد والجاف في " + city.name_ar + " وما حولها، مع التزام كامل بمعايير الجودة ودرجات الحرارة لتلبية احتياجاتك بفعالية.";
      const hero_desc_en = "We provide the best refrigerated, frozen, and dry logistics transport services in " + city.name_en + " and surrounding areas, with full commitment to quality and temperature standards.";
      
      const service_coverage_ar = "تغطي شبكة ركن الريان للنقل المبرد جميع أحياء ومناطق " + city.name_ar + "، ونضمن توصيل الشحنات بأعلى معايير الأمان وفي الوقت المحدد من وإلى " + city.name_ar + ".";
      const service_coverage_en = "Rokn Elryan refrigerated transport network covers all areas and districts of " + city.name_en + ", ensuring secure and on-time delivery of shipments.";
      
      const seo_title_ar = "النقل المبرد والمجمد في " + city.name_ar + " | ركن الريان للخدمات اللوجستية";
      const seo_title_en = "Refrigerated Transport in " + city.name_en + " | Rokn Elryan Logistics";
      
      const seo_desc_ar = "تبحث عن خدمات نقل مبرد في " + city.name_ar + "؟ شركة ركن الريان تقدم أسطولاً مجهزاً بالكامل لضمان سلامة منتجاتك الغذائية والطبية وفق أحدث معايير التبريد.";
      const seo_desc_en = "Looking for refrigerated transport services in " + city.name_en + "? Rokn Elryan offers a fully equipped fleet to ensure the safety of your food and medical products.";

      const cta_title_ar = "اطلب تسعيرة النقل لمدينة " + city.name_ar;
      const cta_title_en = "Request a Quote for Transport to " + city.name_en;
      const cta_desc_ar = "تواصل معنا الآن للحصول على أفضل عروض النقل المبرد من وإلى " + city.name_ar + ". فريقنا جاهز لخدمتك على مدار الساعة.";
      const cta_desc_en = "Contact us now to get the best refrigerated transport offers to and from " + city.name_en + ". Our team is ready to serve you 24/7.";

      const faqs = [
        {
          q_ar: "هل تغطون جميع مناطق " + city.name_ar + "؟",
          a_ar: "نعم، أسطولنا يغطي جميع المناطق والأحياء داخل " + city.name_ar + " والمناطق المحيطة بها.",
          q_en: "Do you cover all areas of " + city.name_en + "?",
          a_en: "Yes, our fleet covers all areas and districts within " + city.name_en + " and its surroundings."
        },
        {
          q_ar: "هل توفرون النقل المجمد في " + city.name_ar + "؟",
          a_ar: "بالتأكيد، سياراتنا مزودة بأحدث أجهزة التبريد التي تصل إلى درجات تجميد -18 درجة مئوية.",
          q_en: "Do you provide frozen transport in " + city.name_en + "?",
          a_en: "Absolutely, our vehicles are equipped with the latest cooling units reaching freezing temperatures of -18°C."
        }
      ];

      const query = "INSERT INTO cities (name_ar, name_en, slug, hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image, service_coverage_ar, service_coverage_en, faqs, seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en, cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, true) ON CONFLICT (slug) DO UPDATE SET hero_title_ar = EXCLUDED.hero_title_ar, hero_desc_ar = EXCLUDED.hero_desc_ar, service_coverage_ar = EXCLUDED.service_coverage_ar, active = true;";
      
      await pool.query(query, [
        city.name_ar, city.name_en, city.slug,
        hero_title_ar, hero_title_en,
        hero_desc_ar, hero_desc_en,
        city.hero_img,
        service_coverage_ar, service_coverage_en,
        JSON.stringify(faqs),
        seo_title_ar, seo_title_en,
        seo_desc_ar, seo_desc_en,
        cta_title_ar, cta_title_en,
        cta_desc_ar, cta_desc_en
      ]);
      console.log("✅ Added/Updated: " + city.name_ar);
    }
    
    console.log("🎉 All cities seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding cities:", error);
  } finally {
    pool.end();
  }
}

seed();
