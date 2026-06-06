import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const articles = [
  {
    title_ar: "أهمية الحفاظ على سلسلة التبريد في النقل الغذائي",
    title_en: "The Importance of Maintaining the Cold Chain in Food Transport",
    slug: "importance-of-cold-chain-in-food-transport",
    content_ar: "تعتبر سلسلة التبريد من أهم العوامل لضمان سلامة وجودة المنتجات الغذائية من المصنع إلى المستهلك. إن كسر سلسلة التبريد قد يؤدي إلى تلف المنتجات وخسائر مادية فادحة، بالإضافة إلى المخاطر الصحية على المستهلكين. في ركن الريان، نستخدم أحدث أجهزة التبريد والمراقبة لضمان بقاء درجة الحرارة ضمن المستويات المطلوبة طوال رحلة النقل.",
    content_en: "The cold chain is one of the most important factors in ensuring the safety and quality of food products from the factory to the consumer. Breaking the cold chain can lead to product spoilage and massive financial losses, in addition to health risks for consumers. At Rokn Elryan, we use the latest cooling and monitoring devices to ensure the temperature remains within the required levels throughout the transport journey.",
    seo_desc_ar: "تعرف على أهمية الحفاظ على سلسلة التبريد في النقل الغذائي وكيف تضمن ركن الريان وصول منتجاتك بأعلى جودة.",
    seo_desc_en: "Learn about the importance of maintaining the cold chain in food transport and how Rokn Elryan ensures your products arrive in top quality.",
    image: null,
    seo_keywords: "سلسلة التبريد, النقل الغذائي, النقل المبرد, ركن الريان"
  },
  {
    title_ar: "دليل شامل لنقل الأدوية والمستلزمات الطبية بأمان",
    title_en: "A Comprehensive Guide to Safely Transporting Pharmaceuticals",
    slug: "guide-to-safely-transporting-pharmaceuticals",
    content_ar: "تتطلب الأدوية والمستلزمات الطبية عناية فائقة أثناء النقل، حيث يجب حفظها في درجات حرارة محددة (مثل +4 إلى +8 درجات مئوية). النقل الخاطئ قد يفسد فعالية الدواء. نقدم في هذا الدليل أفضل الممارسات لنقل الأدوية بشكل مطابق لاشتراطات هيئة الغذاء والدواء وكيفية تجنب الأخطاء الشائعة.",
    content_en: "Pharmaceuticals and medical supplies require extreme care during transport, as they must be kept at specific temperatures (like +4 to +8 degrees Celsius). Improper transport can ruin the medication's effectiveness. In this guide, we provide best practices for transporting pharmaceuticals in compliance with SFDA requirements and how to avoid common mistakes.",
    seo_desc_ar: "دليلك الشامل لنقل الأدوية والمستلزمات الطبية بأمان ومطابقة لمعايير هيئة الغذاء والدواء.",
    seo_desc_en: "Your comprehensive guide to safely transporting pharmaceuticals in compliance with SFDA standards.",
    image: null,
    seo_keywords: "نقل الأدوية, النقل الطبي, هيئة الغذاء والدواء, الخدمات اللوجستية"
  },
  {
    title_ar: "كيف تختار شركة النقل المبرد المناسبة لأعمالك",
    title_en: "How to Choose the Right Refrigerated Transport Company for Your Business",
    slug: "how-to-choose-refrigerated-transport-company",
    content_ar: "اختيار الشريك اللوجستي المناسب هو قرار استراتيجي لنجاح أعمالك. عند اختيار شركة نقل مبرد، يجب التأكد من توفر أسطول حديث، تقنيات تتبع متطورة، وتراخيص معتمدة. في ركن الريان، نفخر بتقديم خدمات متكاملة تضمن راحة بالك ونمو أعمالك.",
    content_en: "Choosing the right logistics partner is a strategic decision for the success of your business. When choosing a refrigerated transport company, you must ensure they have a modern fleet, advanced tracking technologies, and approved licenses. At Rokn Elryan, we take pride in offering integrated services that guarantee your peace of mind and business growth.",
    seo_desc_ar: "نصائح هامة لاختيار شركة النقل المبرد والخدمات اللوجستية الأنسب لشركتك وتلبية احتياجات التوزيع.",
    seo_desc_en: "Important tips for choosing the most suitable refrigerated transport and logistics company for your business needs.",
    image: null,
    seo_keywords: "شركة نقل مبرد, شريك لوجستي, النقل المبرد في السعودية"
  },
  {
    title_ar: "أحدث التقنيات في إدارة أساطيل النقل المبرد",
    title_en: "Latest Technologies in Refrigerated Transport Fleet Management",
    slug: "latest-technologies-in-fleet-management",
    content_ar: "التقنية تلعب دوراً محورياً في تطوير قطاع اللوجستيات. من أنظمة تتبع درجات الحرارة لحظة بلحظة (Real-time monitoring) إلى تحديد المسارات باستخدام الذكاء الاصطناعي لتقليل وقت التوصيل. تعرف على كيف تستخدم ركن الريان هذه التقنيات لتقديم خدمة لا مثيل لها.",
    content_en: "Technology plays a pivotal role in developing the logistics sector. From real-time temperature tracking systems to AI-powered routing to reduce delivery times. Learn how Rokn Elryan uses these technologies to provide unparalleled service.",
    seo_desc_ar: "اكتشف كيف تساهم التقنيات الحديثة والذكاء الاصطناعي في تطوير كفاءة إدارة أساطيل النقل المبرد واللوجستيات.",
    seo_desc_en: "Discover how modern technologies and AI contribute to improving the efficiency of refrigerated transport fleet management.",
    image: null,
    seo_keywords: "تقنيات النقل, إدارة الأساطيل, تتبع الشاحنات, اللوجستيات الذكية"
  },
  {
    title_ar: "التحديات الشائعة في النقل اللوجستي وكيفية التغلب عليها",
    title_en: "Common Challenges in Logistics Transport and How to Overcome Them",
    slug: "common-challenges-in-logistics",
    content_ar: "يواجه قطاع النقل اللوجستي العديد من التحديات، مثل تقلبات الطقس، الازدحام المروري، وأعطال الشاحنات المفاجئة. استراتيجيات التخطيط المسبق والصيانة الدورية للأسطول هي مفتاح التغلب على هذه العقبات لضمان استمرارية التوريد للعملاء.",
    content_en: "The logistics transport sector faces many challenges, such as weather fluctuations, traffic congestion, and sudden truck breakdowns. Proactive planning strategies and regular fleet maintenance are key to overcoming these obstacles to ensure continuous supply for customers.",
    seo_desc_ar: "أبرز التحديات التي تواجه قطاع الخدمات اللوجستية والنقل وكيف تضمن الشركات التغلب عليها بكفاءة.",
    seo_desc_en: "The main challenges facing the logistics and transport sector and how companies can efficiently overcome them.",
    image: null,
    seo_keywords: "تحديات اللوجستيات, النقل البري, إدارة سلاسل الإمداد"
  },
  {
    title_ar: "معايير هيئة الغذاء والدواء لنقل المنتجات الحساسة للحرارة",
    title_en: "SFDA Standards for Transporting Temperature-Sensitive Products",
    slug: "sfda-standards-for-temperature-sensitive-transport",
    content_ar: "الالتزام بمعايير هيئة الغذاء والدواء (SFDA) ليس مجرد خيار، بل هو ضرورة قصوى. تشمل هذه المعايير معايرة أجهزة القياس، توفير سجلات لدرجات الحرارة، وتدريب السائقين على التعامل مع الحالات الطارئة. في ركن الريان، نضمن مطابقة كافة عملياتنا لهذه المعايير الصارمة.",
    content_en: "Compliance with Saudi Food and Drug Authority (SFDA) standards is not just an option, it is an absolute necessity. These standards include calibrating measuring devices, providing temperature logs, and training drivers on how to handle emergencies. At Rokn Elryan, we ensure all our operations comply with these strict standards.",
    seo_desc_ar: "دليل مبسط لمعايير هيئة الغذاء والدواء السعودية (SFDA) الخاصة بنقل الأغذية والأدوية المبردة.",
    seo_desc_en: "A simplified guide to SFDA standards for transporting refrigerated food and pharmaceuticals.",
    image: null,
    seo_keywords: "هيئة الغذاء والدواء, SFDA, نقل مبرد معتمد, معايير النقل"
  }
];

const pool = new pg.Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
});

async function seedArticles() {
  try {
    await pool.query('DELETE FROM articles');
    console.log('✅ تم مسح المقالات القديمة.');

    for (const article of articles) {
      await pool.query(
        `INSERT INTO articles (title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, seo_keywords, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          article.title_ar, article.title_en, article.slug, article.content_ar, article.content_en, 
          article.image, article.seo_desc_ar, article.seo_desc_en, article.seo_keywords, true
        ]
      );
    }
    console.log('✅ تم إضافة المقالات الجديدة المتخصصة في النقل المبرد بنجاح.');
    process.exit(0);
  } catch (error) {
    console.error('❌ حدث خطأ أثناء إضافة المقالات:', error);
    process.exit(1);
  }
}

seedArticles();
