const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'admin123',
});

const caseStudies = [
  {
    slug: 'pharma-summer-crisis',
    industry_en: 'Pharmaceuticals',
    industry_ar: 'قطاع الأدوية والصيدلة',
    title_en: 'SFDA-Compliant Vaccine Transport During 45°C Peak Summer',
    title_ar: 'نقل لقاحات مطابق لاشتراطات الغذاء والدواء في ذروة الصيف (45 مئوية)',
    problem_en: 'A major pharma distributor needed to transport sensitive vaccines from Jeddah Port to Riyadh while maintaining a strict +2°C to +8°C environment amidst an extreme summer heatwave.',
    problem_ar: 'احتاج موزع أدوية رئيسي إلى نقل لقاحات حساسة من ميناء جدة إلى الرياض مع الحفاظ على بيئة صارمة بين +2 إلى +8 درجات مئوية وسط موجة حر صيفية شديدة.',
    solution_en: 'Deployed 5 specialized dual-cooling trailers equipped with IoT live data loggers. Drivers used optimized night routes to minimize external heat impact.',
    solution_ar: 'تم نشر 5 مقطورات متخصصة بتبريد مزدوج ومجهزة بمسجلات بيانات IoT لحظية. استخدم السائقون مسارات ليلية محسنة لتقليل تأثير الحرارة الخارجية.',
    kpi_en: '100% Temperature Compliance | 0% Spoilage | 12 Hours Transit',
    kpi_ar: 'امتثال حراري بنسبة 100% | 0% نسبة تلف | وقت العبور 12 ساعة',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop'
  },
  {
    slug: 'national-supermarket-scale',
    industry_en: 'Retail & FMCG',
    industry_ar: 'التجزئة والسلع الاستهلاكية',
    title_en: 'Scaling Food Distribution for a National Supermarket Chain',
    title_ar: 'توسيع نطاق توزيع الأغذية لسلسلة سوبرماركت وطنية',
    problem_en: 'A growing supermarket chain struggled with inconsistent delivery times and high spoilage rates of fresh produce across its 20+ branches in the central region.',
    problem_ar: 'عانت سلسلة سوبرماركت متنامية من عدم انتظام أوقات التسليم وارتفاع معدلات تلف المنتجات الطازجة عبر أكثر من 20 فرعاً في المنطقة الوسطى.',
    solution_en: 'Implemented a dedicated fleet of 15 refrigerated Dyna trucks on automated daily routes, ensuring fresh produce arrived before 6:00 AM daily.',
    solution_ar: 'تنفيذ أسطول مخصص مكون من 15 دينا تبريد على مسارات يومية مجدولة تلقائياً، لضمان وصول المنتجات الطازجة قبل الساعة 6:00 صباحاً يومياً.',
    kpi_en: 'Spoilage reduced by 40% | On-time delivery improved to 98%',
    kpi_ar: 'انخفاض نسبة التلف بـ 40% | تحسن التسليم في الموعد إلى 98%',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=800&auto=format&fit=crop'
  }
];

async function seedCaseStudies() {
  try {
    await client.connect();
    console.log('Connected to DB');

    for (const study of caseStudies) {
      // Check if exists
      const checkRes = await client.query('SELECT id FROM case_studies WHERE slug = $1', [study.slug]);
      
      if (checkRes.rows.length === 0) {
        console.log("Inserting " + study.slug + "...");
        const query = `
          INSERT INTO case_studies (
            slug, industry_ar, industry_en, title_ar, title_en,
            problem_ar, problem_en, solution_ar, solution_en,
            kpi_ar, kpi_en, image, active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
        `;
        const values = [
          study.slug, study.industry_ar, study.industry_en, study.title_ar, study.title_en,
          study.problem_ar, study.problem_en, study.solution_ar, study.solution_en,
          study.kpi_ar, study.kpi_en, study.image
        ];
        await client.query(query, values);
      } else {
        console.log("Case study " + study.slug + " already exists, skipping.");
      }
    }

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await client.end();
  }
}

seedCaseStudies();
