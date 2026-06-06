import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, ArrowRight, ShieldCheck, Activity, PackageCheck, ThermometerSnowflake } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const industryData: Record<string, { ar: string, en: string, subtitle_ar: string, subtitle_en: string, desc_ar: string, desc_en: string, icon: React.ReactNode, tempRange: string }> = {
  'pharma': { 
    ar: 'قطاع الأدوية والصيدلة', en: 'Pharmaceuticals',
    subtitle_ar: 'نقل طبي معتمد من هيئة الغذاء والدواء', subtitle_en: 'SFDA-Approved Medical Transport',
    desc_ar: 'نحن ندرك حساسية المنتجات الدوائية. نقدم حلول نقل مبردة مزودة بأجهزة تتبع حراري لحظية لضمان سلامة الأدوية واللقاحات والمستحضرات التجميلية وتوافقها التام مع اشتراطات هيئة الغذاء والدواء.',
    desc_en: 'We understand the sensitivity of pharmaceutical products. We provide refrigerated transport solutions equipped with real-time temperature trackers to ensure the safety of medicines, vaccines, and cosmetics, fully compliant with SFDA regulations.',
    icon: <Activity className="w-6 h-6" />,
    tempRange: '+2°C to +8°C / +15°C to +25°C'
  },
  'food': { 
    ar: 'المصانع الغذائية', en: 'Food Manufacturing',
    subtitle_ar: 'سلاسل إمداد غذائية لا تنقطع', subtitle_en: 'Unbroken Food Supply Chains',
    desc_ar: 'شريكك اللوجستي الموثوق لنقل المواد الخام والمنتجات النهائية. أسطولنا الضخم يضمن تدفق الإنتاج من المصنع إلى مراكز التوزيع دون أي اختلال في سلسلة التبريد.',
    desc_en: 'Your reliable logistics partner for transporting raw materials and finished products. Our massive fleet ensures production flow from factory to distribution centers without any break in the cold chain.',
    icon: <PackageCheck className="w-6 h-6" />,
    tempRange: '-18°C to +4°C'
  },
  'retail': { 
    ar: 'قطاع التجزئة والمطاعم', en: 'Retail & Restaurants',
    subtitle_ar: 'توزيع يومي سريع وموثوق', subtitle_en: 'Fast & Reliable Daily Distribution',
    desc_ar: 'نخدم السوبرماركت وسلاسل المطاعم الكبرى عبر شبكة توزيع معقدة داخل المدن. أسطول دينا المبرد يضمن وصول اللحوم، الدواجن، والخضار الطازج يومياً بأعلى جودة.',
    desc_en: 'Serving supermarkets and major restaurant chains through a complex inner-city distribution network. Our refrigerated Dyna fleet ensures daily delivery of fresh meat, poultry, and vegetables at the highest quality.',
    icon: <Briefcase className="w-6 h-6" />,
    tempRange: 'Multi-Temperature Capabilities'
  },
  'agriculture': { 
    ar: 'القطاع الزراعي والتمور', en: 'Agriculture & Dates',
    subtitle_ar: 'حماية المحاصيل الاستراتيجية', subtitle_en: 'Protecting Strategic Crops',
    desc_ar: 'خبرة طويلة في تصدير ونقل التمور والمحاصيل الزراعية من مزارع القصيم ومناطق المملكة. نضبط الرطوبة والحرارة بدقة لمنع التلف وإطالة عمر المنتج.',
    desc_en: 'Extensive experience in exporting and transporting dates and crops from Qassim farms and across the Kingdom. We precisely control humidity and temperature to prevent spoilage and extend shelf life.',
    icon: <ThermometerSnowflake className="w-6 h-6" />,
    tempRange: '+10°C to +18°C (Humidity Controlled)'
  }
};

export default function IndustryPage() {
  const { industry } = useParams<{ industry: string }>();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const info = industry && industryData[industry.toLowerCase()] ? industryData[industry.toLowerCase()] : null;
  
  if (!info) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{isEn ? 'Industry Not Found' : 'القطاع غير موجود'}</h1>
          <Link to="/" className="text-amber-600 underline">
            {isEn ? 'Return Home' : 'العودة للرئيسية'}
          </Link>
        </div>
      </div>
    );
  }

  const titleName = isEn ? info.en : info.ar;
  const pageTitle = isEn ? `Cold Chain Logistics for ${titleName}` : `النقل المبرد لـ ${titleName}`;
  const subtitle = isEn ? info.subtitle_en : info.subtitle_ar;
  const pageDesc = isEn ? info.desc_en : info.desc_ar;

  const industrySchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": pageTitle,
    "provider": {
      "@type": "LocalBusiness",
      "name": "ركن الريان للنقل المبرد"
    },
    "description": pageDesc,
    "audience": {
      "@type": "Audience",
      "audienceType": isEn ? "B2B Enterprise" : "شركات ومؤسسات B2B"
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title={`${pageTitle} | ${isEn ? 'Rokn Elryan' : 'ركن الريان'}`} description={pageDesc} schema={industrySchema} />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full font-bold mb-6 border border-blue-500/30">
              {info.icon}
              {subtitle}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {pageTitle}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl leading-relaxed font-medium">
              {pageDesc}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-amber-400 transition-all flex items-center gap-2">
                {isEn ? 'Request Enterprise Contract' : 'طلب تعاقد مؤسسي'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SLA & Capabilities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6">
                  {isEn ? 'Enterprise-Grade Compliance' : 'معايير امتثال بمستوى الشركات الكبرى'}
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{isEn ? 'Strict Temperature Control' : 'تحكم صارم بدرجات الحرارة'}</h4>
                      <p className="text-slate-600">{isEn ? `Supported Range: ${info.tempRange}` : `النطاق المدعوم: ${info.tempRange}`}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{isEn ? 'Live GPS & Data Logging' : 'تتبع لحظي وسجلات بيانات'}</h4>
                      <p className="text-slate-600">{isEn ? 'Continuous monitoring to ensure no cold-chain breaches.' : 'مراقبة مستمرة لضمان عدم وجود أي اختلال في التبريد.'}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{isEn ? 'Dedicated Account Manager' : 'مدير حساب مخصص'}</h4>
                      <p className="text-slate-600">{isEn ? 'Direct B2B support line for operational requests.' : 'خط دعم مباشر للطلبات التشغيلية المستعجلة.'}</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                 <div className="text-6xl font-black text-amber-500 mb-4">99.9%</div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">{isEn ? 'SLA Fulfillment Rate' : 'معدل الوفاء باتفاقيات مستوى الخدمة'}</h3>
                 <p className="text-slate-500">{isEn ? 'Consistent on-time and on-temp deliveries for major corporations.' : 'التزام تام بمواعيد التسليم ودرجات الحرارة لكبرى الشركات.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
