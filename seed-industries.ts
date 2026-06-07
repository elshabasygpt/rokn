import pool from './server/db';

const industriesData = [
  {
    name_ar: 'المصانع الغذائية',
    name_en: 'Food Manufacturing',
    slug: 'food-manufacturing',
    icon: 'PackageCheck',
    hero_title_ar: 'سلاسل إمداد غذائية لا تنقطع لدعم خطوط إنتاجك',
    hero_title_en: 'Unbroken Food Supply Chains for Your Production Lines',
    hero_desc_ar: 'شريكك اللوجستي الموثوق لنقل المواد الخام والمنتجات النهائية. نضمن تدفق الإنتاج من مصنعك إلى مراكز التوزيع دون أي اختلال في سلسلة التبريد للحفاظ على جودة الأغذية.',
    hero_desc_en: 'Your reliable logistics partner for transporting raw materials and finished products. We ensure production flow from your factory to distribution centers without any break in the cold chain.',
    featured_image: 'https://images.unsplash.com/photo-1615810220412-2c6767eb14db?q=80&w=2070&auto=format&fit=crop',
    challenges_ar: ['حساسية المواد الخام للتقلبات الحرارية', 'الحاجة لتوريد دقيق في مواعيد محددة (JIT)', 'خطر التلوث البكتيري وتلف المنتجات'],
    challenges_en: ['Sensitivity of raw materials to temperature fluctuations', 'Need for precise Just-in-Time (JIT) delivery', 'Risk of bacterial contamination and product spoilage'],
    solutions_ar: ['أسطول مبرد بأحدث أنظمة العزل الحراري', 'جدولة دقيقة وعمليات توريد مجدولة 24/7', 'تعقيم دوري للشاحنات وفق معايير سلامة الغذاء'],
    solutions_en: ['Refrigerated fleet with advanced thermal insulation', 'Precise 24/7 scheduled supply operations', 'Regular truck sanitization meeting food safety standards'],
    benefits_ar: ['تقليل هدر المواد الخام بنسبة 99%', 'ضمان استمرارية خطوط الإنتاج', 'الامتثال التام لاشتراطات هيئة الغذاء والدواء'],
    benefits_en: ['Reduce raw material waste by 99%', 'Ensure continuous production line operations', 'Full compliance with SFDA requirements'],
    faqs: [
      { q_ar: 'هل تدعمون نقل اللحوم والدواجن المجمدة؟', a_ar: 'نعم، نمتلك شاحنات قادرة على التبريد حتى درجة -18 مئوية.', q_en: 'Do you support frozen meat and poultry transport?', a_en: 'Yes, our trucks can cool down to -18°C.' },
      { q_ar: 'هل يتم مراقبة درجات الحرارة أثناء النقل؟', a_ar: 'بالتأكيد، عبر أنظمة تتبع لحظية متصلة بغرفة التحكم.', q_en: 'Are temperatures monitored during transport?', a_en: 'Absolutely, via real-time tracking systems connected to our control room.' }
    ],
    cta_title_ar: 'تأمين سلسلة إمداد مصنعك',
    cta_title_en: 'Secure Your Factory Supply Chain',
    cta_desc_ar: 'تواصل مع فريقنا لإنشاء عقد لوجستي مؤسسي يضمن تدفق إنتاجك بسلاسة.',
    cta_desc_en: 'Contact our team to establish an enterprise logistics contract ensuring your production flows smoothly.',
    seo_title_ar: 'نقل مبرد للمصانع الغذائية | ركن الريان',
    seo_title_en: 'Refrigerated Transport for Food Manufacturing | Rokn Elryan',
    seo_desc_ar: 'حلول لوجستية ونقل مبرد موثوق للمصانع الغذائية في السعودية لدعم خطوط الإنتاج.',
    seo_desc_en: 'Reliable cold chain logistics and refrigerated transport for food manufacturing in Saudi Arabia.'
  },
  {
    name_ar: 'شركات الأدوية',
    name_en: 'Pharmaceutical Companies',
    slug: 'pharmaceuticals',
    icon: 'Activity',
    hero_title_ar: 'نقل طبي موثوق لإنقاذ الأرواح',
    hero_title_en: 'Reliable Medical Transport to Save Lives',
    hero_desc_ar: 'نعي تماماً حساسية المنتجات الدوائية. نقدم حلول نقل مبردة مزودة بأجهزة تتبع حراري دقيقة لضمان سلامة الأدوية واللقاحات وتوافقها مع أعلى المعايير الصحية.',
    hero_desc_en: 'We fully understand the sensitivity of pharmaceutical products. We provide refrigerated transport solutions equipped with precise temperature trackers to ensure the safety of medicines and vaccines.',
    featured_image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=2070&auto=format&fit=crop',
    challenges_ar: ['فقدان فعالية الأدوية بسبب تغير درجات الحرارة', 'اشتراطات صارمة لهيئة الغذاء والدواء SFDA', 'الحاجة لتسليم طارئ ومستعجل للمستشفيات'],
    challenges_en: ['Loss of drug efficacy due to temperature changes', 'Strict requirements by SFDA', 'Need for urgent and emergency hospital deliveries'],
    solutions_ar: ['تبريد دقيق يتراوح بين 2+ إلى 8+ درجة مئوية', 'سجلات حرارية (Data Loggers) لكل رحلة', 'فريق طوارئ وجاهزية على مدار الساعة'],
    solutions_en: ['Precise cooling ranging from +2°C to +8°C', 'Thermal data loggers for every trip', '24/7 emergency response and readiness team'],
    benefits_ar: ['حماية الأدوية الحساسة واللقاحات من التلف', 'الامتثال للمعايير الطبية الدولية والمحلية', 'تقارير أداء دورية لمراجعات الجودة'],
    benefits_en: ['Protect sensitive medicines and vaccines from damage', 'Compliance with local and international medical standards', 'Periodic performance reports for quality audits'],
    faqs: [
      { q_ar: 'هل أنتم معتمدون من هيئة الغذاء والدواء؟', a_ar: 'نعم، جميع مركباتنا مرخصة ومعتمدة خصيصاً لنقل الأدوية.', q_en: 'Are you approved by the SFDA?', a_en: 'Yes, all our vehicles are specifically licensed and approved for medical transport.' }
    ],
    cta_title_ar: 'اعتماد ركن الريان كناقل طبي',
    cta_title_en: 'Appoint Rokn Elryan as Your Medical Carrier',
    cta_desc_ar: 'احمِ منتجاتك الدوائية بشراكة مع خبراء النقل المبرد.',
    cta_desc_en: 'Protect your pharmaceutical products by partnering with cold chain experts.',
    seo_title_ar: 'النقل المبرد للأدوية والمستلزمات الطبية | ركن الريان',
    seo_title_en: 'Cold Transport for Pharmaceuticals & Medical Supplies | Rokn Elryan',
    seo_desc_ar: 'حلول نقل آمنة للأدوية واللقاحات مع تتبع حراري لحظي واعتماد هيئة الغذاء والدواء.',
    seo_desc_en: 'Safe transport solutions for medicines and vaccines with real-time temperature tracking and SFDA compliance.'
  },
  {
    name_ar: 'المطاعم',
    name_en: 'Restaurants',
    slug: 'restaurants',
    icon: 'Briefcase',
    hero_title_ar: 'توريد طازج ويومي لمطعمك',
    hero_title_en: 'Fresh & Daily Supply for Your Restaurant',
    hero_desc_ar: 'نعلم أن جودة أطباقك تبدأ من جودة المكونات. أسطولنا يضمن وصول اللحوم والخضروات الطازجة إلى مطعمك يومياً بأعلى معايير النضارة لتلبية طلبات عملائك المتزايدة.',
    hero_desc_en: 'We know your dishes quality starts with the ingredients. Our fleet ensures fresh meat and vegetables reach your restaurant daily at the highest standards of freshness to meet growing customer demands.',
    featured_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
    challenges_ar: ['تأخر وصول المكونات في أوقات الذروة', 'تذبذب جودة المواد الغذائية الحساسة', 'التكاليف العالية لامتلاك أسطول توصيل خاص'],
    challenges_en: ['Delayed ingredient arrival during peak hours', 'Fluctuating quality of sensitive food materials', 'High costs of owning a private delivery fleet'],
    solutions_ar: ['عمليات توزيع دقيقة ومرنة داخل المدن', 'شاحنات متعددة الدرجات (لحوم، خضار، مجمدات)', 'الاستعانة بمصادر خارجية للوجستيات لتقليل التكاليف'],
    solutions_en: ['Precise and flexible inner-city distribution operations', 'Multi-temperature trucks (meat, veg, frozen)', 'Outsourcing logistics to reduce operational costs'],
    benefits_ar: ['الحفاظ على سمعة المطعم بجودة مكونات عالية', 'توفير التكاليف التشغيلية للأسطول والمندوبين', 'توصيل يومي مضمون لدعم عملياتك'],
    benefits_en: ['Maintain restaurant reputation with high-quality ingredients', 'Save operational costs on fleets and drivers', 'Guaranteed daily delivery to support operations'],
    faqs: [
      { q_ar: 'هل يمكنكم التوصيل لعدة فروع في نفس اليوم؟', a_ar: 'نعم، نقدم خدمة التوزيع متعدد النقاط (Multi-Drop) لتغطية جميع فروعك بكفاءة.', q_en: 'Can you deliver to multiple branches in the same day?', a_en: 'Yes, we offer multi-drop distribution services to cover all your branches efficiently.' }
    ],
    cta_title_ar: 'طلب توريد يومي للمطاعم',
    cta_title_en: 'Request Daily Restaurant Supply',
    cta_desc_ar: 'دعنا نتولى التوريد اللوجستي لتركز أنت على إبداعك في المطبخ.',
    cta_desc_en: 'Let us handle the logistics so you can focus on your culinary creativity.',
    seo_title_ar: 'توزيع ونقل مبرد للمطاعم | ركن الريان',
    seo_title_en: 'Refrigerated Distribution & Transport for Restaurants | Rokn Elryan',
    seo_desc_ar: 'خدمات التوصيل اليومي للمكونات الطازجة لسلاسل المطاعم في السعودية.',
    seo_desc_en: 'Daily delivery services of fresh ingredients for restaurant chains in Saudi Arabia.'
  },
  {
    name_ar: 'سلاسل التجزئة',
    name_en: 'Retail Chains',
    slug: 'retail-chains',
    icon: 'Building',
    hero_title_ar: 'توزيع قوي يغطي رفوف سوبرماركتك',
    hero_title_en: 'Robust Distribution Filling Your Supermarket Shelves',
    hero_desc_ar: 'دعم لوجستي متكامل لسلاسل السوبرماركت والهايبر ماركت. نقوم بنقل الأغذية الطازجة والمجمدة من المستودعات المركزية إلى الفروع بكفاءة عالية واحترافية لا مثيل لها.',
    hero_desc_en: 'Integrated logistics support for supermarket and hypermarket chains. We transport fresh and frozen foods from central warehouses to branches with high efficiency and unmatched professionalism.',
    featured_image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop',
    challenges_ar: ['إدارة مخزون الرفوف بسرعة لمنع النقص', 'نقل كميات ضخمة لمناطق جغرافية واسعة', 'التعامل مع منتجات متنوعة باشتراطات مختلفة'],
    challenges_en: ['Rapid shelf inventory management to prevent shortages', 'Transporting massive volumes across wide geographic areas', 'Handling diverse products with different requirements'],
    solutions_ar: ['أسطول شاحنات ضخمة مبردة (تريلات)', 'شبكة لوجستية تغطي جميع مدن المملكة', 'غرف تبريد مقسمة للحفاظ على كل منتج ببيئته'],
    solutions_en: ['Massive refrigerated truck fleet (Trailers)', 'Logistics network covering all Kingdom cities', 'Partitioned cooling rooms to keep products in specific environments'],
    benefits_ar: ['توفر دائم للمنتجات الطازجة في فروعك', 'تغطية توسعاتك الجغرافية بسهولة', 'شريك لوجستي واحد لجميع عمليات النقل'],
    benefits_en: ['Constant availability of fresh products in your branches', 'Easily cover your geographic expansions', 'A single logistics partner for all transport operations'],
    faqs: [],
    cta_title_ar: 'دعم لوجستي للتجزئة',
    cta_title_en: 'Retail Logistics Support',
    cta_desc_ar: 'عقود مرنة لتزويد سلاسل التجزئة بكفاءة عالية.',
    cta_desc_en: 'Flexible contracts to efficiently supply retail chains.',
    seo_title_ar: 'نقل مبرد لسلاسل التجزئة والسوبرماركت | ركن الريان',
    seo_title_en: 'Cold Transport for Retail Chains & Supermarkets | Rokn Elryan',
    seo_desc_ar: 'شريك لوجستي قوي لدعم سلاسل التجزئة والمقاضي بأسطول مبرد يغطي كافة مناطق المملكة.',
    seo_desc_en: 'A strong logistics partner supporting retail chains and groceries with a refrigerated fleet covering all regions of the Kingdom.'
  },
  {
    name_ar: 'المستودعات',
    name_en: 'Warehouses',
    slug: 'warehouses',
    icon: 'Building2',
    hero_title_ar: 'ربط لوجستي من الباب إلى الباب للمستودعات',
    hero_title_en: 'Door-to-Door Logistics for Warehouses',
    hero_desc_ar: 'نقدم خدمات نقل مبرد موثوقة لربط المستودعات الفرعية والرئيسية. نسهل نقل المخزون بين مواقع التخزين بسلاسة واحترافية وبدون فقدان درجات الحرارة المطلوبة.',
    hero_desc_en: 'We provide reliable refrigerated transport services to connect main and sub-warehouses. We facilitate smooth and professional inventory transfer between storage sites without losing the required temperatures.',
    featured_image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c50800?q=80&w=2070&auto=format&fit=crop',
    challenges_ar: ['نقل البضائع الضخمة (Bulk) بطريقة آمنة', 'بطء تحميل وتفريغ الشاحنات', 'صعوبة تتبع حركة المخزون بين المواقع'],
    challenges_en: ['Transporting bulk goods securely', 'Slow truck loading and unloading processes', 'Difficulty tracking inventory movement between sites'],
    solutions_ar: ['شاحنات مجهزة برافعات خلفية لتسريع التحميل', 'أنظمة GPS لمراقبة الشحنات بين المستودعات', 'خدمات الجدولة المتقدمة للرحلات المتكررة'],
    solutions_en: ['Trucks equipped with tail lifts to speed up loading', 'GPS systems for monitoring shipments between warehouses', 'Advanced scheduling services for recurring trips'],
    benefits_ar: ['تحسين كفاءة إدارة المخزون', 'سرعة استجابة بين مرافق التخزين', 'تقليل الجهد البشري وأخطاء التحميل'],
    benefits_en: ['Improve inventory management efficiency', 'Fast response between storage facilities', 'Reduce human effort and loading errors'],
    faqs: [],
    cta_title_ar: 'اطلب ربط مستودعاتك',
    cta_title_en: 'Request Warehouse Connectivity',
    cta_desc_ar: '',
    cta_desc_en: '',
    seo_title_ar: 'خدمات النقل بين المستودعات | ركن الريان',
    seo_title_en: 'Inter-Warehouse Transport Services | Rokn Elryan',
    seo_desc_ar: 'نقل مخزون مبرد موثوق وفعال بين المستودعات والمخازن الرئيسية في السعودية.',
    seo_desc_en: 'Reliable and efficient refrigerated inventory transport between main warehouses and storages in Saudi Arabia.'
  },
  {
    name_ar: 'مراكز التوزيع',
    name_en: 'Distribution Centers',
    slug: 'distribution-centers',
    icon: 'ThermometerSnowflake',
    hero_title_ar: 'عصب التوزيع للميل الأخير (Last-Mile)',
    hero_title_en: 'The Backbone of Last-Mile Distribution',
    hero_desc_ar: 'نعزز عمليات مراكز التوزيع عبر توفير أسطول مرن وسريع مخصص لتوصيل البضائع للوجهة النهائية للمستهلكين بسلامة وفي الوقت المحدد.',
    hero_desc_en: 'We enhance distribution center operations by providing a fast, flexible fleet dedicated to delivering goods to their final destination safely and on time.',
    featured_image: 'https://images.unsplash.com/photo-1621508215663-df62100df874?q=80&w=2070&auto=format&fit=crop',
    challenges_ar: ['تحديات توصيل الميل الأخير المعقدة', 'الحفاظ على جودة المنتج حتى باب العميل', 'التقلبات الكبيرة في حجم الطلبات اليومية'],
    challenges_en: ['Complex last-mile delivery challenges', 'Maintaining product quality to the customer\'s door', 'High fluctuations in daily order volumes'],
    solutions_ar: ['شاحنات خفيفة (دينا) مخصصة للشوارع والأحياء', 'نماذج تسعير مرنة تواكب الطلب المتغير', 'تتبع دقيق يتيح للعملاء معرفة موقع شحناتهم'],
    solutions_en: ['Light trucks (Dyna) optimized for city streets and neighborhoods', 'Flexible pricing models keeping up with variable demand', 'Precise tracking allowing clients to locate shipments'],
    benefits_ar: ['رضا عملاء مرتفع لتسليم الطلبات سليمة', 'مرونة تشغيلية في المواسم وأوقات الذروة', 'تحويل التكاليف الثابتة إلى متغيرة'],
    benefits_en: ['High customer satisfaction due to intact deliveries', 'Operational flexibility during peak seasons', 'Converting fixed costs into variable costs'],
    faqs: [],
    cta_title_ar: 'عزز قوة مركز التوزيع',
    cta_title_en: 'Empower Your Distribution Center',
    cta_desc_ar: '',
    cta_desc_en: '',
    seo_title_ar: 'اللوجستيات وتوصيل مراكز التوزيع | ركن الريان',
    seo_title_en: 'Logistics & Distribution Center Delivery | Rokn Elryan',
    seo_desc_ar: 'حلول ذكية وفعالة لمراكز التوزيع لتسهيل توصيل الميل الأخير المبرد للعملاء والشركات.',
    seo_desc_en: 'Smart, efficient solutions for distribution centers to facilitate refrigerated last-mile delivery for B2B and consumers.'
  }
];

async function seedIndustries() {
  console.log('🌱 Starting Industries Seeding...');
  let added = 0;
  for (const ind of industriesData) {
    try {
      // Check if it already exists
      const { rows: existing } = await pool.query('SELECT id FROM industries WHERE slug = $1', [ind.slug]);
      if (existing.length > 0) {
        console.log(`⚠️ Skipping ${ind.slug} - already exists.`);
        continue;
      }

      const query = `
        INSERT INTO industries (
          name_ar, name_en, slug, icon,
          hero_title_ar, hero_title_en, hero_desc_ar, hero_desc_en, featured_image,
          challenges_ar, challenges_en, solutions_ar, solutions_en, benefits_ar, benefits_en,
          faqs, cta_title_ar, cta_title_en, cta_desc_ar, cta_desc_en,
          seo_title_ar, seo_title_en, seo_desc_ar, seo_desc_en
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20,
          $21, $22, $23, $24
        )
      `;
      const values = [
        ind.name_ar, ind.name_en, ind.slug, ind.icon,
        ind.hero_title_ar, ind.hero_title_en, ind.hero_desc_ar, ind.hero_desc_en, ind.featured_image,
        JSON.stringify(ind.challenges_ar || []), JSON.stringify(ind.challenges_en || []),
        JSON.stringify(ind.solutions_ar || []), JSON.stringify(ind.solutions_en || []),
        JSON.stringify(ind.benefits_ar || []), JSON.stringify(ind.benefits_en || []),
        JSON.stringify(ind.faqs || []),
        ind.cta_title_ar, ind.cta_title_en, ind.cta_desc_ar, ind.cta_desc_en,
        ind.seo_title_ar, ind.seo_title_en, ind.seo_desc_ar, ind.seo_desc_en
      ];

      await pool.query(query, values);
      added++;
      console.log(`✅ Inserted ${ind.slug}`);
    } catch (err) {
      console.error(`❌ Failed to insert ${ind.slug}:`, err);
    }
  }

  console.log(`🎉 Seeding complete. Added ${added} industries.`);
  process.exit(0);
}

seedIndustries();
