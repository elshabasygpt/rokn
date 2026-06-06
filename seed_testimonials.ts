import pool from './server/db.js';

async function seed() {
  try {
    // 1. Add new columns
    await pool.query(`
      ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS industry_ar TEXT;
      ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS industry_en TEXT;
      ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS duration_ar TEXT;
      ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS duration_en TEXT;
      ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS volume_ar TEXT;
      ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS volume_en TEXT;
      ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS logo TEXT;
    `);
    
    console.log('Columns added');

    // 2. Clear old ones or just add new
    await pool.query('TRUNCATE TABLE testimonials RESTART IDENTITY;');

    const data = [
      { name_ar: 'شركة الغذاء الذهبي', name_en: 'Golden Food Co.', industry_ar: 'قطاع الأغذية والمطاعم', industry_en: 'Food & Restaurants Sector', duration_ar: '+3 سنوات', duration_en: '+3 Years', volume_ar: '500+ رحلة مبردة شهرياً', volume_en: '500+ Cold Trips/Mo', text_ar: 'شراكتنا مع ركن الريان شكلت نقطة تحول في سلسلة التوريد الخاصة بنا. التزامهم الصارم بدرجات الحرارة وجدولة الرحلات الدقيقة ساهم في خفض التكاليف التشغيلية بنسبة 15%.', text_en: 'Our partnership with Rokn Elryan marked a turning point in our supply chain, reducing operational costs by 15%.' },
      { name_ar: 'مختبرات الحياة الطبية', name_en: 'Hayat Medical Labs', industry_ar: 'الرعاية الصحية والأدوية', industry_en: 'Healthcare & Pharma', duration_ar: '+5 سنوات', duration_en: '+5 Years', volume_ar: 'تغطية 12 مستشفى يومياً', volume_en: '12 Hospitals Daily', text_ar: 'نقل الأدوية الحساسة واللقاحات يتطلب دقة لا مساومة فيها. أسطول ركن الريان المجهز بأنظمة مراقبة حية على مدار الساعة منحنا الطمأنينة الكاملة لمطابقة اشتراطات هيئة الغذاء والدواء.', text_en: 'Transporting sensitive medicines requires uncompromising accuracy. Rokn Elryan gave us complete peace of mind.' },
      { name_ar: 'الشركة الوطنية للدواجن', name_en: 'National Poultry Co.', industry_ar: 'قطاع اللحوم والدواجن', industry_en: 'Meat & Poultry Sector', duration_ar: '+عامين', duration_en: '+2 Years', volume_ar: 'نقل 10,000 طن سنوياً', volume_en: '10,000 Tons Annually', text_ar: 'القدرة الاستيعابية الكبيرة والتجاوب السريع في مواسم الذروة هو ما يميز ركن الريان. لم نواجه أي تأخير أو تلف في الشحنات منذ بداية العقد الاستراتيجي بيننا.', text_en: 'High capacity and fast response during peak seasons is what distinguishes Rokn Elryan.' },
      { name_ar: 'سلسلة مطاعم الذواقة', name_en: 'Gourmet Chains', industry_ar: 'المطاعم الفاخرة', industry_en: 'Fine Dining', duration_ar: '+4 سنوات', duration_en: '+4 Years', volume_ar: 'توريد يومي لـ 45 فرع', volume_en: 'Daily to 45 Branches', text_ar: 'الاعتمادية العالية وسرعة الاستجابة جعلت ركن الريان شريكنا اللوجستي الأول. نحن نضمن جودة لحومنا الطازجة بفضل مراقبتهم الدقيقة لدرجات الحرارة.', text_en: 'High reliability made Rokn Elryan our top logistics partner.' },
      { name_ar: 'مصانع الألبان الحديثة', name_en: 'Modern Dairy Factories', industry_ar: 'منتجات الألبان', industry_en: 'Dairy Products', duration_ar: '+1 سنة', duration_en: '+1 Year', volume_ar: '300 شاحنة شهرياً', volume_en: '300 Trucks/Mo', text_ar: 'نقل الألبان يتطلب بيئة نظيفة ومبردة بدقة. أسطولهم الحديث وفريقهم المحترف وفّر لنا بيئة مثالية لنقل منتجاتنا بأعلى معايير الجودة العالمية.', text_en: 'Transporting dairy requires a clean, cooled environment. Their modern fleet provided exactly that.' },
      { name_ar: 'مزارع الوادي الخضراء', name_en: 'Green Valley Farms', industry_ar: 'الزراعة والمحاصيل', industry_en: 'Agriculture & Crops', duration_ar: '+6 أشهر', duration_en: '+6 Months', volume_ar: '100 طن أسبوعياً', volume_en: '100 Tons Weekly', text_ar: 'كان التحدي الأكبر لنا هو الحفاظ على نضارة المحاصيل من المزرعة للمستهلك. ركن الريان وفروا لنا الحل الأمثل بفضل الشاحنات المبردة ذات الكفاءة العالية.', text_en: 'Maintaining crop freshness was a challenge until Rokn Elryan provided high-efficiency refrigerated trucks.' }
    ];

    for (const d of data) {
      await pool.query(
        `INSERT INTO testimonials 
        (name_ar, name_en, role_ar, role_en, text_ar, text_en, industry_ar, industry_en, duration_ar, duration_en, volume_ar, volume_en)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [d.name_ar, d.name_en, d.industry_ar, d.industry_en, d.text_ar, d.text_en, d.industry_ar, d.industry_en, d.duration_ar, d.duration_en, d.volume_ar, d.volume_en]
      );
    }

    console.log('Testimonials seeded');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
