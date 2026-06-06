import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Truck, CheckCircle2, ShieldCheck, ThermometerSnowflake, ArrowRight, Building, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const cityData: Record<string, { ar: string, en: string, desc_ar: string, desc_en: string, isHQ?: boolean }> = {
  // Headquarters
  'qassim': { 
    ar: 'القصيم', en: 'Qassim',
    desc_ar: 'المقر الرئيسي لعملياتنا وسلة الغذاء للمملكة. نوفر من القصيم أسطولاً ضخماً لتصدير وتوزيع التمور والمحاصيل الزراعية والأغذية لجميع مناطق المملكة بأعلى معايير الجودة المبردة.',
    desc_en: 'Our operational headquarters and the food basket of the Kingdom. From Qassim, we provide a massive fleet for distributing dates, crops, and food to all regions with the highest cold chain standards.',
    isHQ: true
  },
  // Major Hubs
  'riyadh': { 
    ar: 'الرياض', en: 'Riyadh',
    desc_ar: 'المركز التجاري الأكبر. نوفر تغطية كاملة للعاصمة بأسطول حديث مخصص لخدمة السوبرماركت، المطاعم، وشركات الأدوية.',
    desc_en: 'The major commercial hub. We provide full coverage of the capital with a modern fleet dedicated to supermarkets, restaurants, and pharma.'
  },
  'jeddah': { 
    ar: 'جدة', en: 'Jeddah',
    desc_ar: 'البوابة الغربية. خدمات لوجستية متخصصة من الميناء إلى المستودعات لضمان سلامة الأغذية والمجمدات.',
    desc_en: 'The western gateway. Specialized port-to-warehouse logistics ensuring the safety of food and frozen goods.'
  },
  'dammam': { 
    ar: 'الدمام', en: 'Dammam',
    desc_ar: 'المحور الصناعي. خدمات نقل مبرد موثوقة لقطاع النفط، المصانع، والإعاشة في المنطقة الشرقية.',
    desc_en: 'The industrial hub. Reliable refrigerated transport for oil & gas catering and factories in the Eastern Province.'
  },
  'mecca': { 
    ar: 'مكة المكرمة', en: 'Mecca',
    desc_ar: 'دعم المواسم الاستثنائية. تغطية كاملة لاحتياجات الإعاشة والفنادق خلال مواسم الحج والعمرة.',
    desc_en: 'Exceptional seasonal support. Full coverage for catering and hotel needs during Hajj and Umrah seasons.'
  },
  'medina': { 
    ar: 'المدينة المنورة', en: 'Medina',
    desc_ar: 'إمداد غذائي مستمر. نقل آمن وسريع للمواد الغذائية والأدوية لخدمة زوار المدينة.',
    desc_en: 'Continuous food supply. Safe and fast transport of food and pharma to serve the city visitors.'
  },
  'abha': { 
    ar: 'أبها', en: 'Abha',
    desc_ar: 'النقل الجبلي. أسطول مجهز للتعامل مع التضاريس الصعبة لضمان وصول الشحنات بأمان للمنطقة الجنوبية.',
    desc_en: 'Mountain transport. Fleet equipped to handle rough terrains, ensuring safe delivery to the Southern Region.'
  },
  // Other Regions
  'tabuk': {
    ar: 'تبوك', en: 'Tabuk',
    desc_ar: 'بوابة الشمال. نضمن وصول المنتجات الطازجة والمبردة لأقصى شمال المملكة بكفاءة عالية.',
    desc_en: 'The northern gateway. Ensuring fresh and chilled products reach the far north of the Kingdom with high efficiency.'
  },
  'jazan': {
    ar: 'جازان', en: 'Jazan',
    desc_ar: 'محور التنمية الجنوبي. خدمات نقل مبرد تدعم الاستزراع السمكي والقطاعات الزراعية المتنامية.',
    desc_en: 'The southern development hub. Refrigerated transport supporting aquaculture and growing agricultural sectors.'
  },
  'hail': {
    ar: 'حائل', en: 'Hail',
    desc_ar: 'نقطة التقاء الطرق. مركز لوجستي استراتيجي لدعم العمليات التجارية والنقل المبرد.',
    desc_en: 'The crossroads. A strategic logistics center supporting commercial operations and refrigerated transport.'
  },
  'najran': {
    ar: 'نجران', en: 'Najran',
    desc_ar: 'تغطية حدودية متكاملة. إمداد سلس وموثوق للمواد الغذائية والأدوية في أقصى الجنوب.',
    desc_en: 'Comprehensive border coverage. Seamless and reliable supply of food and medicine in the deep south.'
  },
  'albaha': {
    ar: 'الباحة', en: 'Al Baha',
    desc_ar: 'خدمات نقل مخصصة تلبي احتياجات قطاع السياحة والإعاشة في المرتفعات.',
    desc_en: 'Customized transport services meeting the needs of the tourism and catering sector in the highlands.'
  },
  'aljawf': {
    ar: 'الجوف', en: 'Al Jawf',
    desc_ar: 'دعم القطاع الزراعي. متخصصون في نقل زيت الزيتون والمحاصيل الاستراتيجية بأفضل شروط التبريد.',
    desc_en: 'Supporting the agricultural sector. Specialists in transporting olive oil and strategic crops under the best cooling conditions.'
  },
  'taif': {
    ar: 'الطائف', en: 'Taif',
    desc_ar: 'عاصمة الورد والصيف. إمداد لوجستي مبرد يخدم الفنادق والمنتجعات والمصانع المحلية.',
    desc_en: 'Capital of roses and summer. Refrigerated logistics supply serving hotels, resorts, and local factories.'
  },
  'jubail': {
    ar: 'الجبيل', en: 'Jubail',
    desc_ar: 'القلب الصناعي. حلول نقل مبرد للكيماويات الحساسة للحرارة والإعاشة الصناعية.',
    desc_en: 'The industrial heart. Refrigerated transport solutions for temperature-sensitive chemicals and industrial catering.'
  },
  'yanbu': {
    ar: 'ينبع', en: 'Yanbu',
    desc_ar: 'لؤلؤة البحر الأحمر. تغطية لوجستية متكاملة لدعم القطاع الصناعي والبحري.',
    desc_en: 'Pearl of the Red Sea. Comprehensive logistics coverage supporting the industrial and maritime sector.'
  },
  'khobar': {
    ar: 'الخبر', en: 'Khobar',
    desc_ar: 'توزيع تجاري سريع. نخدم قطاع التجزئة والمطاعم الفاخرة بأحدث أسطول مبرد.',
    desc_en: 'Fast commercial distribution. Serving the retail sector and luxury restaurants with the latest refrigerated fleet.'
  },
  // --- PROGRAMMATIC SEO NATIONWIDE EXPANSION ---
  'alahsa': { ar: 'الأحساء', en: 'Al Ahsa', desc_ar: 'تغطية واسعة لأكبر واحة زراعية. نقل مبرد للتمور والمحاصيل الزراعية.', desc_en: 'Extensive coverage for the largest agricultural oasis. Refrigerated transport for dates and crops.' },
  'hafaralbatin': { ar: 'حفر الباطن', en: 'Hafar Al Batin', desc_ar: 'الربط الشمالي الشرقي. خدمات نقل وتوزيع الأغذية للمنطقة وتلبية العقود اللوجستية.', desc_en: 'Northeastern connection. Food transport and distribution services fulfilling logistics contracts.' },
  'buraidah': { ar: 'بريدة', en: 'Buraidah', desc_ar: 'قلب القصيم. خدمات نقل مبرد متكاملة لدعم المصانع والزراعة المحلية.', desc_en: 'Heart of Qassim. Integrated refrigerated transport supporting local factories and agriculture.' },
  'unaizah': { ar: 'عنيزة', en: 'Unaizah', desc_ar: 'مركز زراعي وتجاري. نضمن وصول شحنات التمور والأغذية بأمان.', desc_en: 'Agricultural and commercial center. We ensure safe delivery of dates and food shipments.' },
  'arrass': { ar: 'الرس', en: 'Ar Rass', desc_ar: 'خدمات التوزيع اللوجستي. أسطول دينا مبرد لخدمة أسواق الجملة والتجزئة.', desc_en: 'Logistics distribution services. Refrigerated Dyna fleet serving wholesale and retail markets.' },
  'alkharj': { ar: 'الخرج', en: 'Al Kharj', desc_ar: 'سلة إنتاج الألبان. متخصصون في نقل الألبان ومشتقاتها بأعلى معايير التبريد السريع.', desc_en: 'Dairy production basket. Specialists in transporting dairy with the highest rapid cooling standards.' },
  'almajmaah': { ar: 'المجمعة', en: 'Al Majmaah', desc_ar: 'ربط وسط المملكة. خطوط نقل يومية لدعم سلسلة الإمداد الغذائي.', desc_en: 'Connecting central KSA. Daily transport lines supporting the food supply chain.' },
  'dawadmi': { ar: 'الدوادمي', en: 'Dawadmi', desc_ar: 'تغطية النطاق الغربي للرياض. نقل البضائع الحساسة للحرارة بأمان.', desc_en: 'Covering western Riyadh region. Safely transporting temperature-sensitive goods.' },
  'wadiaddawasir': { ar: 'وادي الدواسر', en: 'Wadi ad-Dawasir', desc_ar: 'عاصمة الزراعة الجنوبية. نقل المحاصيل الزراعية عبر مسافات طويلة بتبريد مستقر.', desc_en: 'Southern agricultural capital. Transporting crops over long distances with stable cooling.' },
  'sakaka': { ar: 'سكاكا', en: 'Sakaka', desc_ar: 'خدمات النقل المبرد لمنطقة الجوف. تلبية احتياجات مشاريع زيت الزيتون.', desc_en: 'Refrigerated transport for Al Jawf. Meeting the needs of olive oil projects.' },
  'arar': { ar: 'عرعر', en: 'Arar', desc_ar: 'بوابة الحدود الشمالية. شحن مبرد للواردات والصادرات وخدمات الإعاشة.', desc_en: 'Northern borders gateway. Refrigerated freight for imports, exports, and catering.' },
  'qurayyat': { ar: 'القريات', en: 'Qurayyat', desc_ar: 'نقطة الربط البري. إدارة سلاسل الإمداد المبرد عبر الحدود بكفاءة.', desc_en: 'Land connection point. Efficient cross-border cold chain management.' },
  'turaif': { ar: 'طريف', en: 'Turaif', desc_ar: 'منطقة التعدين والصناعة. دعم المشروعات الصناعية بحلول نقل مبردة مخصصة.', desc_en: 'Mining and industry zone. Supporting industrial projects with custom cooling transport.' },
  'khafji': { ar: 'الخفجي', en: 'Khafji', desc_ar: 'تغطية المنطقة المقسومة. خدمات تبريد لوجستية لقطاعات النفط والشركات.', desc_en: 'Divided zone coverage. Logistics cooling services for oil sectors and corporations.' },
  'alqatif': { ar: 'القطيف', en: 'Al Qatif', desc_ar: 'عاصمة صيد الأسماك. خبرة عميقة في النقل المجمد للأسماك والمأكولات البحرية.', desc_en: 'Fishing capital. Deep expertise in frozen transport for seafood.' },
  'dhahran': { ar: 'الظهران', en: 'Dhahran', desc_ar: 'مركز الأعمال والطاقة. خدمات نقل لوجستية راقية للشركات العالمية والمطاعم.', desc_en: 'Business and energy center. Premium logistics transport for international companies.' },
  'bisha': { ar: 'بيشة', en: 'Bisha', desc_ar: 'واحة الجنوب. نقل المنتجات الزراعية والتمور عبر أسطول مجهز بمبردات حديثة.', desc_en: 'Oasis of the south. Transporting agricultural products and dates via modern cooling fleets.' },
  'khamismushait': { ar: 'خميس مشيط', en: 'Khamis Mushait', desc_ar: 'المركز التجاري الجنوبي. شحن مبرد ثقيل لخدمة المستودعات والمراكز التجارية.', desc_en: 'Southern commercial hub. Heavy refrigerated freight serving warehouses and malls.' },
  'muhayil': { ar: 'محايل عسير', en: 'Muhayil', desc_ar: 'التوزيع الإقليمي. نقل أدوية ومواد غذائية لضمان التدفق التجاري بتهامة عسير.', desc_en: 'Regional distribution. Pharma and food transport ensuring trade flow in Tihamah.' },
  'alqunfudhah': { ar: 'القنفذة', en: 'Al Qunfudhah', desc_ar: 'الساحل الغربي. نقل المنتجات البحرية والغذائية للمدن الرئيسية.', desc_en: 'Western coast. Transporting seafood and food products to major cities.' },
  'allith': { ar: 'الليث', en: 'Al Lith', desc_ar: 'تغطية الخط الساحلي. دعم الاستزراع السمكي والمشاريع الغذائية.', desc_en: 'Coastal line coverage. Supporting aquaculture and food projects.' },
  'rabigh': { ar: 'رابغ', en: 'Rabigh', desc_ar: 'مدينة الصناعات. نقل مبرد يدعم قطاع البتروكيماويات والشركات الاستراتيجية.', desc_en: 'City of industries. Refrigerated transport supporting petrochemicals and strategic companies.' },
  'alula': { ar: 'العلا', en: 'Al Ula', desc_ar: 'الوجهة السياحية العالمية. خدمات نقل وإعاشة فائقة الجودة للفنادق والمطاعم الفاخرة.', desc_en: 'Global tourist destination. Premium catering and transport services for luxury hotels.' },
  'neom': { ar: 'نيوم', en: 'Neom', desc_ar: 'مدينة المستقبل. دعم لوجستي مبرد للشركات المطورة ومشاريع البنية التحتية.', desc_en: 'City of the future. Refrigerated logistics support for developers and infrastructure projects.' },
  'dhurma': { ar: 'ضرما', en: 'Dhurma', desc_ar: 'الظهير الزراعي للرياض. نقل المحاصيل والخضروات الطازجة بسرعة للحفاظ على جودتها.', desc_en: 'Agricultural backyard of Riyadh. Fast transport of fresh crops to preserve quality.' },
  'shaqra': { ar: 'شقراء', en: 'Shaqra', desc_ar: 'ملتقى الوشم. خطوط إمداد متطورة لدعم السوق المحلي بأحدث الشاحنات.', desc_en: 'Al-Washm junction. Advanced supply lines supporting the local market with modern trucks.' },
  'zulfi': { ar: 'الزلفي', en: 'Zulfi', desc_ar: 'تغطية شمال نجد. شحن مبرد يحافظ على جودة المواد الاستهلاكية والغذائية.', desc_en: 'Northern Najd coverage. Refrigerated freight maintaining consumer and food goods quality.' },
  'qunfudhah': { ar: 'القنفذة', en: 'Qunfudhah', desc_ar: 'النقل البحري والبري. دمج خدمات النقل لضمان وصول الشحنات للمنطقة الغربية.', desc_en: 'Sea and land transport. Integrating transport services to ensure shipments reach the west.' },
  'afif': { ar: 'عفيف', en: 'Afif', desc_ar: 'محطة الحجاز القديمة. نقل الإعاشة والتموين الاستراتيجي على طول طريق الحجاز.', desc_en: 'Old Hejaz station. Strategic catering and supply transport along the Hejaz route.' },
};

export default function CityPage() {
  const { city } = useParams<{ city: string }>();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const cityInfo = city && cityData[city.toLowerCase()] ? cityData[city.toLowerCase()] : null;
  
  if (!cityInfo) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{isEn ? 'Location Not Found' : 'المدينة غير موجودة'}</h1>
          <Link to="/" className="text-amber-600 underline">
            {isEn ? 'Return Home' : 'العودة للرئيسية'}
          </Link>
        </div>
      </div>
    );
  }

  const cityName = isEn ? cityInfo.en : cityInfo.ar;
  const pageTitle = isEn ? `Refrigerated Transport in ${cityName}` : `النقل المبرد في ${cityName}`;
  const pageDesc = isEn ? cityInfo.desc_en : cityInfo.desc_ar;

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Refrigerated Transport",
    "provider": {
      "@type": "LocalBusiness",
      "name": "ركن الريان للنقل المبرد"
    },
    "areaServed": {
      "@type": "City",
      "name": cityName
    },
    "description": pageDesc
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title={`${pageTitle} | ${isEn ? 'Rokn Elryan' : 'ركن الريان'}`} description={pageDesc} schema={localSchema} />
      
      {/* City Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full font-bold border border-amber-500/30">
                <MapPin className="w-5 h-5" />
                {isEn ? `Logistics Hub: ${cityName}` : `مركز الخدمة: ${cityName}`}
              </div>
              {cityInfo.isHQ && (
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full font-bold border border-blue-500/30">
                  <Building className="w-5 h-5" />
                  {isEn ? 'Headquarters' : 'المقر الرئيسي للشركة'}
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {pageTitle}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl leading-relaxed">
              {pageDesc}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-amber-400 transition-all flex items-center gap-2">
                {isEn ? 'Request Corporate Quote' : 'طلب تسعيرة للشركات'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+966502375887" dir="ltr" className="bg-white/10 text-white backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                +966 50 237 5887
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services in this City */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <ThermometerSnowflake className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {isEn ? 'Pharma Transport' : 'نقل الأدوية والمستلزمات'}
              </h3>
              <p className="text-slate-600">
                {isEn ? `SFDA-compliant medical transport serving hospitals and pharmacies across ${cityName}.` : `نقل طبي مطابق لاشتراطات هيئة الغذاء والدواء يخدم المستشفيات والصيدليات في ${cityName}.`}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {isEn ? 'Food & Catering' : 'الأغذية والإعاشة'}
              </h3>
              <p className="text-slate-600">
                {isEn ? `Daily distribution routes for supermarkets and restaurant chains in ${cityName}.` : `مسارات توزيع يومية مجدولة لخدمة السوبرماركت وسلاسل المطاعم في ${cityName}.`}
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {isEn ? 'Inter-city Haulage' : 'النقل بين المدن'}
              </h3>
              <p className="text-slate-600">
                {isEn ? `Heavy refrigerated freight connecting ${cityName} to all regions of the Kingdom.` : `شحن مبرد ثقيل يربط ${cityName} بجميع مناطق ومحافظات المملكة.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Trust */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-12">
            {isEn ? `Why Choose Rokn Elryan in ${cityName}?` : `لماذا تختار ركن الريان في ${cityName}؟`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
              <div className="text-start">
                <h4 className="font-bold text-lg mb-1">{isEn ? 'SFDA Approved' : 'معتمدون من الغذاء والدواء'}</h4>
                <p className="text-slate-400 text-sm">{isEn ? 'Full regulatory compliance' : 'التزام كامل بالمعايير الصحية'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <Clock className="w-10 h-10 text-amber-400 shrink-0" />
              <div className="text-start">
                <h4 className="font-bold text-lg mb-1">{isEn ? '24/7 Dispatch' : 'جاهزية 24/7'}</h4>
                <p className="text-slate-400 text-sm">{isEn ? `Emergency fleet ready in ${cityName}` : `أسطول طوارئ جاهز في ${cityName}`}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
