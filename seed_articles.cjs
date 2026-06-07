const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'Rokn Elryan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'admin123',
});

const articles = [
  {
    title_ar: 'أفضل 5 شركات نقل مبرد في السعودية (دليل 2026)',
    title_en: 'Top 5 Refrigerated Transport Companies in Saudi Arabia (2026 Guide)',
    slug: 'top-5-refrigerated-transport-companies-saudi-arabia',
    content_ar: `
<h2>مقدمة في سوق النقل المبرد السعودي</h2>
<p>مع تسارع وتيرة التطور في قطاعات الأغذية والأدوية في المملكة العربية السعودية، أصبح الاعتماد على النقل المبرد الموثوق ضرورة لا غنى عنها. في هذا الدليل، نستعرض أفضل الشركات المتخصصة في هذا المجال، وكيف تتصدر شركة ركن الريان المشهد بخدماتها المتكاملة.</p>

<h3>1. شركة ركن الريان للنقل المبرد (الخيار الأفضل للشركات)</h3>
<p>تتميز شركة ركن الريان بأسطول ضخم معتمد من هيئة الغذاء والدواء (SFDA)، يغطي كافة مناطق المملكة من القصيم إلى جدة والرياض. توفر الشركة تقنيات تتبع حراري لحظي (IoT) وحلولاً متخصصة لنقل الأدوية، اللحوم المجمدة، والتمور بدقة متناهية.</p>

<h3>2. الشركات الإقليمية والموزعون المحليون</h3>
<p>هناك العديد من الشركات الأخرى التي تقدم خدمات النقل، ولكن التحدي يكمن دائماً في الحفاظ على سلسلة التبريد دون انقطاع، وهو ما تتفوق فيه ركن الريان.</p>

<h2>لماذا تعتبر ركن الريان الخيار الأمثل؟</h2>
<ul>
  <li>أسطول حديث ومجهز بالكامل (دينا، لوري، تريلات).</li>
  <li>امتثال صارم لدرجات الحرارة المطلوبة (-18°C إلى +25°C).</li>
  <li>عقود شهرية وسنوية مخصصة للشركات (B2B).</li>
</ul>
<p>للمزيد من المعلومات أو لطلب تسعيرة، يمكنك استخدام <a href="/calculator">حاسبة سعة الشاحنات</a> الخاصة بنا.</p>
`,
    content_en: `
<h2>Introduction to the Saudi Cold Chain Market</h2>
<p>With the rapid development of the food and pharmaceutical sectors in Saudi Arabia, reliable refrigerated transport is essential. In this guide, we review the top companies specializing in this field, and why Rokn Elryan leads the market.</p>

<h3>1. Rokn Elryan Logistics (The Top Choice for B2B)</h3>
<p>Rokn Elryan stands out with a massive SFDA-approved fleet covering all regions from Qassim to Jeddah and Riyadh. They provide real-time IoT temperature tracking and specialized solutions for pharmaceuticals, frozen meats, and dates.</p>

<h2>Why Choose Rokn Elryan?</h2>
<ul>
  <li>Modern, fully equipped fleet (Dyna, Lorry, Trailers).</li>
  <li>Strict temperature compliance (-18°C to +25°C).</li>
  <li>Customized monthly and yearly B2B contracts.</li>
</ul>
`,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455aeb7?q=80&w=1200&auto=format&fit=crop',
    seo_desc_ar: 'اكتشف أفضل شركات النقل المبرد في السعودية لعام 2026. دليل شامل يوضح معايير اختيار الشريك اللوجستي، وتصدر شركة ركن الريان للسوق.',
    seo_desc_en: 'Discover the top 5 refrigerated transport companies in Saudi Arabia for 2026. A comprehensive guide for B2B logistics.',
    seo_keywords: 'أفضل شركات النقل المبرد, نقل مبرد السعودية, ثلاجات نقل',
    is_featured: true
  },
  {
    title_ar: 'الفرق بين النقل المبرد والتجميد: دليلك الشامل للشحنات',
    title_en: 'Chilled vs. Frozen Transport: The Ultimate Guide',
    slug: 'difference-chilled-frozen-refrigerated-transport',
    content_ar: `
<h2>ما هو الفرق بين التبريد والتجميد؟</h2>
<p>عند التعاقد مع شركة نقل لوجستي، من المهم جداً التفريق بين النقل المبرد (Chilled) والنقل المجمد (Frozen) لتجنب تلف البضائع.</p>

<h3>1. النقل المبرد (+2 إلى +8 درجات مئوية)</h3>
<p>يستخدم للمنتجات الطازجة مثل: الخضروات، الفواكه، الألبان، وبعض أنواع الأدوية واللقاحات. يتطلب هذا النوع تحكماً دقيقاً لمنع تجمد المنتجات وتلف خلاياها.</p>

<h3>2. النقل المجمد (-18 إلى -20 درجة مئوية)</h3>
<p>مخصص للمنتجات التي تتطلب بيئة تجميد عميق مثل: اللحوم، الدواجن، المأكولات البحرية، والآيس كريم.</p>

<h2>كيف تضمن ركن الريان الجودة؟</h2>
<p>في ركن الريان، نمتلك مقطورات قادرة على دمج بيئتين في نفس الشاحنة (Dual-Evaporator)، مما يوفر تكاليف النقل على عملائنا مع ضمان أقصى درجات الحماية. راجع <a href="/compliance">معايير الامتثال</a> الخاصة بنا للمزيد.</p>
`,
    content_en: `
<h2>What is the Difference Between Chilled and Frozen?</h2>
<p>When contracting a logistics partner, it's crucial to differentiate between Chilled and Frozen transport to prevent cargo spoilage.</p>

<h3>1. Chilled Transport (+2°C to +8°C)</h3>
<p>Used for fresh produce, dairy, and pharmaceuticals. Requires strict control to prevent the cargo from freezing.</p>

<h3>2. Frozen Transport (-18°C to -20°C)</h3>
<p>Designed for deep-freeze environments like meats, poultry, seafood, and ice cream.</p>

<h2>Rokn Elryan's Dual-Cooling Advantage</h2>
<p>We operate dual-evaporator trailers capable of maintaining both zones simultaneously, saving costs for our B2B clients.</p>
`,
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop',
    seo_desc_ar: 'تعرف على الفرق بين النقل المبرد والنقل المجمد، ودرجات الحرارة المطلوبة لكل نوع من أنواع الأغذية والأدوية.',
    seo_desc_en: 'Learn the difference between chilled and frozen transport, and the required temperatures for food and pharma.',
    seo_keywords: 'نقل مبرد, نقل مجمد, درجات حرارة الثلاجات',
    is_featured: false
  },
  {
    title_ar: 'كيف تختار أفضل شريك لوجستي لنقل التمور؟',
    title_en: 'How to Choose the Best Logistics Partner for Dates Transport',
    slug: 'how-to-choose-logistics-partner-for-dates-transport',
    content_ar: `
<h2>أهمية النقل المبرد في حفظ جودة التمور</h2>
<p>تعتبر التمور من أهم المحاصيل الاستراتيجية في المملكة. ولكن نقلها يحتاج لعناية فائقة، فالتعرض للحرارة أو الرطوبة العالية يؤدي إلى تلف وتخمر المحصول.</p>

<h3>معايير اختيار شركة النقل للقطاع الزراعي</h3>
<ol>
  <li><strong>التحكم في الرطوبة:</strong> التبريد وحده لا يكفي، يجب أن تكون الشاحنات قادرة على ضبط معدلات الرطوبة.</li>
  <li><strong>السعة الضخمة (تريلات):</strong> لضمان نقل المحصول خلال مواسم الحصاد (في القصيم وغيرها) بأقل عدد رحلات.</li>
  <li><strong>سجلات البيانات:</strong> القدرة على طباعة إيصال الحرارة لتأكيد سلامة المحصول للمستوردين.</li>
</ol>

<h2>ركن الريان: شريك المزارع والشركات</h2>
<p>بفضل مقرنا الرئيسي في القصيم، نحن رواد نقل التمور في المملكة. يمكنك الاعتماد علينا لنقل مئات الأطنان بكفاءة. تفقد <a href="/industries/agriculture">قطاع الزراعة</a> لدينا.</p>
`,
    content_en: `
<h2>The Importance of Refrigerated Dates Transport</h2>
<p>Dates are a strategic crop in KSA. Transporting them requires extreme care, as excess heat or humidity leads to fermentation.</p>

<h3>Criteria for Choosing an Agri-Logistics Partner</h3>
<ol>
  <li><strong>Humidity Control:</strong> Cooling alone isn't enough; trucks must control moisture.</li>
  <li><strong>Massive Capacity:</strong> Heavy trailers are needed during peak harvest seasons in Qassim.</li>
  <li><strong>Data Logs:</strong> Essential for proving cargo integrity to importers.</li>
</ol>

<h2>Rokn Elryan: The Farmers' Partner</h2>
<p>With our HQ in Qassim, we are the kingdom's leaders in dates transport.</p>
`,
    image: 'https://images.unsplash.com/photo-1615486171448-4fdcb70de63c?q=80&w=1200&auto=format&fit=crop',
    seo_desc_ar: 'دليل شامل لاختيار شركة النقل المبرد المناسبة لنقل وتصدير التمور والمحاصيل الزراعية من القصيم إلى كافة مناطق المملكة.',
    seo_desc_en: 'Comprehensive guide to choosing the right cold chain partner for dates and agricultural transport in KSA.',
    seo_keywords: 'نقل تمور, نقل زراعي, ثلاجات القصيم',
    is_featured: false
  }
];

async function seedArticles() {
  try {
    await client.connect();
    console.log('Connected to DB');

    for (const article of articles) {
      // Check if exists
      const checkRes = await client.query('SELECT id FROM articles WHERE slug = $1', [article.slug]);
      
      if (checkRes.rows.length === 0) {
        console.log("Inserting " + article.slug + "...");
        const query = `
          INSERT INTO articles (title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, seo_keywords, is_featured, active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
        `;
        const values = [
          article.title_ar, article.title_en, article.slug, 
          article.content_ar, article.content_en, article.image, 
          article.seo_desc_ar, article.seo_desc_en, article.seo_keywords, 
          article.is_featured
        ];
        await client.query(query, values);
      } else {
        console.log("Article " + article.slug + " already exists, skipping.");
      }
    }

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await client.end();
  }
}

seedArticles();
