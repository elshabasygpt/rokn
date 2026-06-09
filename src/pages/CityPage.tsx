import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Truck, CheckCircle2, ShieldCheck, ThermometerSnowflake, ArrowRight, Building, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Fallback hardcoded data
const fallbackCityData: Record<string, { ar: string, en: string, desc_ar: string, desc_en: string, isHQ?: boolean }> = {
  'qassim': { 
    ar: 'القصيم', en: 'Qassim',
    desc_ar: 'المقر الرئيسي لعملياتنا وسلة الغذاء للمملكة. نوفر من القصيم أسطولاً ضخماً لتصدير وتوزيع التمور والمحاصيل الزراعية والأغذية لجميع مناطق المملكة بأعلى معايير الجودة المبردة.',
    desc_en: 'Our operational headquarters and the food basket of the Kingdom. From Qassim, we provide a massive fleet for distributing dates, crops, and food to all regions with the highest cold chain standards.',
    isHQ: true
  },
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
  }
};

export default function CityPage() {
  const { city: slug } = useParams();
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [cityData, setCityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/cities/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found in DB');
        return res.json();
      })
      .then(data => setCityData(data))
      .catch(() => {
        // Fallback to hardcoded
        if (slug && fallbackCityData[slug]) {
          setCityData(fallbackCityData[slug]);
        } else {
          setCityData(null); // Will show 404
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!cityData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <MapPin className="w-20 h-20 text-slate-200 mb-6" />
        <h1 className="text-4xl font-black text-slate-900 mb-4">{isEn ? 'City Not Found' : 'المدينة غير موجودة'}</h1>
        <p className="text-slate-500 mb-8">{isEn ? 'We might not have an active logistics hub in this city yet.' : 'قد لا يتوفر لدينا مركز لوجستي في هذه المدينة حالياً.'}</p>
        <Link to="/" className="bg-amber-500 text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-amber-400">
          {isEn ? 'Return to Home' : 'العودة للرئيسية'}
        </Link>
      </div>
    );
  }

  // Map backend DB fields to variables, falling back to the hardcoded structure if needed
  const isFromDB = !!cityData.hero_title_ar;
  
  const cityName = isEn ? (isFromDB ? cityData.name_en : cityData.en) : (isFromDB ? cityData.name_ar : cityData.ar);
  const heroTitle = isFromDB ? (isEn ? cityData.hero_title_en : cityData.hero_title_ar) : (isEn ? `Refrigerated Transport in ${cityName}` : `النقل المبرد في ${cityName}`);
  const heroDesc = isFromDB ? (isEn ? cityData.hero_desc_en : cityData.hero_desc_ar) : (isEn ? cityData.desc_en : cityData.desc_ar);
  const bgImage = cityData.featured_image || "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2000&auto=format&fit=crop";
  const ctaTitle = isFromDB ? (isEn ? cityData.cta_title_en : cityData.cta_title_ar) : (isEn ? 'Request Corporate Quote' : 'طلب تسعيرة للشركات');
  const ctaDesc = isFromDB ? (isEn ? cityData.cta_desc_en : cityData.cta_desc_ar) : null;
  const serviceCoverage = isFromDB ? (isEn ? cityData.service_coverage_en : cityData.service_coverage_ar) : null;
  const faqs = isFromDB ? cityData.faqs : [];

  const metaTitle = isFromDB ? (isEn ? cityData.seo_title_en : cityData.seo_title_ar) : `${heroTitle} | ${isEn ? 'Rokn Elryan' : 'ركن الريان'}`;
  const metaDesc = isFromDB ? (isEn ? cityData.seo_desc_en : cityData.seo_desc_ar) : heroDesc;
  const canonical = isFromDB ? cityData.canonical_url : undefined;

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
    "description": metaDesc
  };

  const getRegionCode = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('riyadh') || lowerName.includes('رياض')) return 'SA-01';
    if (lowerName.includes('jeddah') || lowerName.includes('makkah') || lowerName.includes('جدة') || lowerName.includes('مكة') || lowerName.includes('taif') || lowerName.includes('طائف')) return 'SA-02';
    if (lowerName.includes('madinah') || lowerName.includes('مدينة')) return 'SA-03';
    if (lowerName.includes('dammam') || lowerName.includes('khobar') || lowerName.includes('jubail') || lowerName.includes('دمام') || lowerName.includes('خبر') || lowerName.includes('جبيل')) return 'SA-04';
    if (lowerName.includes('qassim') || lowerName.includes('buraidah') || lowerName.includes('قصيم') || lowerName.includes('بريدة')) return 'SA-05';
    if (lowerName.includes('tabuk') || lowerName.includes('تبوك')) return 'SA-07';
    if (lowerName.includes('hail') || lowerName.includes('حائل')) return 'SA-06';
    if (lowerName.includes('najran') || lowerName.includes('نجران')) return 'SA-10';
    if (lowerName.includes('jazan') || lowerName.includes('jizan') || lowerName.includes('جازان') || lowerName.includes('جيزان')) return 'SA-09';
    return 'SA-14'; // Default to HQ Asir
  };

  const geoData = {
    region: getRegionCode(cityName),
    placename: cityName,
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title={metaTitle || heroTitle} description={metaDesc || heroDesc} schema={localSchema} canonical={canonical} geo={geoData} />
      
      {/* City Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}></div>
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full font-bold border border-amber-500/30">
                <MapPin className="w-5 h-5" />
                {isEn ? `Logistics Hub: ${cityName}` : `مركز الخدمة: ${cityName}`}
              </div>
              {cityData.isHQ && (
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full font-bold border border-blue-500/30">
                  <Building className="w-5 h-5" />
                  {isEn ? 'Headquarters' : 'المقر الرئيسي للشركة'}
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {heroTitle || (isEn ? `Refrigerated Transport in ${cityName}` : `النقل المبرد في ${cityName}`)}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl leading-relaxed">
              {heroDesc}
            </p>
            {ctaDesc && (
              <p className="text-lg md:text-xl font-bold text-amber-400 mb-8 max-w-2xl leading-relaxed border-l-4 border-amber-500 pl-4 rtl:pl-0 rtl:pr-4 rtl:border-l-0 rtl:border-r-4">
                {ctaDesc}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-amber-400 transition-all flex items-center gap-2">
                {ctaTitle || (isEn ? 'Request Corporate Quote' : 'طلب تسعيرة للشركات')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+966502375887" dir="ltr" className="bg-white/10 text-white backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                +966 50 237 5887
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Content or Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {serviceCoverage ? (
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-slate-900 mb-6">{isEn ? `Our Coverage in ${cityName}` : `تغطيتنا في ${cityName}`}</h2>
              <div className="prose prose-slate max-w-none text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                {serviceCoverage}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <ThermometerSnowflake className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{isEn ? 'Pharma Transport' : 'نقل الأدوية والمستلزمات'}</h3>
                <p className="text-slate-600">{isEn ? `SFDA-compliant medical transport serving hospitals across ${cityName}.` : `نقل طبي مطابق لاشتراطات هيئة الغذاء والدواء يخدم المستشفيات في ${cityName}.`}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{isEn ? 'Food & Catering' : 'الأغذية والإعاشة'}</h3>
                <p className="text-slate-600">{isEn ? `Daily distribution routes for supermarkets in ${cityName}.` : `مسارات توزيع يومية مجدولة لخدمة السوبرماركت في ${cityName}.`}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{isEn ? 'Inter-city Haulage' : 'النقل بين المدن'}</h3>
                <p className="text-slate-600">{isEn ? `Heavy refrigerated freight connecting ${cityName} to all regions.` : `شحن مبرد ثقيل يربط ${cityName} بجميع مناطق ومحافظات المملكة.`}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dynamic FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="py-20 bg-slate-100">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-black text-center mb-12">{isEn ? `Frequently Asked Questions in ${cityName}` : `الأسئلة الشائعة في ${cityName}`}</h2>
            <div className="space-y-4">
              {faqs.map((faq: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{isEn ? faq.q_en : faq.q_ar}</h3>
                  <p className="text-slate-600">{isEn ? faq.a_en : faq.a_ar}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
