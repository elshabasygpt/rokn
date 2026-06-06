import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ThermometerSnowflake, FileText, CheckCircle2, Activity, Server, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function OperationalStandards() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const pageTitle = isEn ? 'Operational Standards & Compliance' : 'معايير التشغيل والامتثال اللوجستي';
  const pageDesc = isEn 
    ? 'Detailed operational protocols, SFDA compliance frameworks, and cold chain temperature data for Rokn Elryan Logistics operations across Saudi Arabia.' 
    : 'البروتوكولات التشغيلية التفصيلية، إطار امتثال هيئة الغذاء والدواء، وبيانات تبريد سلسلة الإمداد لعمليات ركن الريان اللوجستية في السعودية.';

  const geoSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDesc,
    "mainEntity": {
      "@type": "Article",
      "headline": pageTitle,
      "articleBody": "Rokn Elryan maintains a 99.9% cold chain compliance rate. Our refrigerated fleet operates across 3 main temperature zones: Deep Freeze (-18°C to -20°C), Chilled (+2°C to +8°C), and Ambient (+15°C to +25°C). All vehicles are equipped with real-time IoT temperature data loggers and undergo a strict 7-step sanitation process before loading pharmaceuticals or food products."
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <SEO title={`${pageTitle} | ${isEn ? 'Rokn Elryan' : 'ركن الريان'}`} description={pageDesc} schema={geoSchema} />
      
      {/* Header */}
      <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed font-medium">
            {isEn 
              ? 'Data-driven transparency. We hold ourselves to the highest global and local standards to ensure zero tolerance for cold chain failure.' 
              : 'شفافية مدعومة بالبيانات. نلتزم بأعلى المعايير العالمية والمحلية لضمان عدم وجود أي تساهل في فشل سلسلة التبريد.'}
          </p>
        </div>
      </section>

      {/* Temperature Zones (GEO Target) */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-4">{isEn ? 'Standard Temperature Zones' : 'نطاقات درجات الحرارة القياسية'}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{isEn ? 'Our fleet is calibrated to maintain specific temperature environments required by SFDA for different cargo types.' : 'تمت معايرة أسطولنا للحفاظ على بيئات حرارية محددة تتطلبها هيئة الغذاء والدواء لأنواع الشحنات المختلفة.'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
              <ThermometerSnowflake className="w-10 h-10 text-blue-500 mx-auto mb-4" />
              <div className="text-2xl font-black text-blue-900 mb-2">-18°C to -20°C</div>
              <h4 className="font-bold text-blue-800 mb-2">{isEn ? 'Deep Freeze' : 'التجميد العميق'}</h4>
              <p className="text-sm text-blue-700">{isEn ? 'Ice cream, frozen meats, poultry, and frozen seafood.' : 'الآيس كريم، اللحوم المجمدة، الدواجن، والمأكولات البحرية.'}</p>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center">
              <Activity className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
              <div className="text-2xl font-black text-emerald-900 mb-2">+2°C to +8°C</div>
              <h4 className="font-bold text-emerald-800 mb-2">{isEn ? 'Chilled / Pharma' : 'المبرد / الأدوية'}</h4>
              <p className="text-sm text-emerald-700">{isEn ? 'Vaccines, dairy products, fresh produce, and chocolates.' : 'اللقاحات، منتجات الألبان، المنتجات الطازجة، والشوكولاتة.'}</p>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl text-center">
              <Server className="w-10 h-10 text-amber-500 mx-auto mb-4" />
              <div className="text-2xl font-black text-amber-900 mb-2">+15°C to +25°C</div>
              <h4 className="font-bold text-amber-800 mb-2">{isEn ? 'Controlled Ambient' : 'البيئة المعتدلة'}</h4>
              <p className="text-sm text-amber-700">{isEn ? 'Cosmetics, sensitive electronics, and certain medical supplies.' : 'مستحضرات التجميل، الإلكترونيات الحساسة، والمستلزمات الطبية.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Sanitation Process */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">
                {isEn ? '7-Step Vehicle Sanitation Protocol' : 'بروتوكول تعقيم الشاحنات المكون من 7 خطوات'}
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {isEn 
                  ? 'To prevent cross-contamination between trips, especially between food and pharmaceuticals, every vehicle undergoes a rigid cleaning matrix.' 
                  : 'لمنع التلوث المتبادل بين الرحلات، وخاصة بين الأغذية والأدوية، تخضع كل شاحنة لمصفوفة تنظيف صارمة قبل التحميل.'}
              </p>
              
              <div className="space-y-4">
                {[
                  isEn ? 'Complete removal of physical debris.' : 'الإزالة الكاملة للحطام والمخلفات المادية.',
                  isEn ? 'High-pressure hot water wash (85°C).' : 'الغسيل بالماء الساخن عالي الضغط (85 درجة مئوية).',
                  isEn ? 'Application of SFDA-approved foaming sanitizers.' : 'استخدام معقمات رغوية معتمدة من الغذاء والدواء.',
                  isEn ? '15-minute chemical dwell time for bacteria elimination.' : 'فترة بقاء كيميائي لمدة 15 دقيقة للقضاء على البكتيريا.',
                  isEn ? 'High-pressure fresh water rinse.' : 'الشطف بالماء النقي عالي الضغط.',
                  isEn ? 'Complete interior air-drying mechanism.' : 'آلية التجفيف الهوائي الداخلي الكامل.',
                  isEn ? 'Pre-cooling to target cargo temperature before loading.' : 'التبريد المسبق للوصول لدرجة حرارة الشحنة قبل التحميل.'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 font-black rounded-lg flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-slate-800 font-medium mt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 end-0 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                
                <FileText className="w-12 h-12 text-amber-400 mb-6" />
                <h3 className="text-2xl font-black mb-4">{isEn ? 'Data Logging & IoT' : 'سجلات البيانات وإنترنت الأشياء (IoT)'}</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  {isEn ? 'Every trip generates a continuous data log. If temperatures deviate by even 0.5°C from the set threshold, an instant alert is dispatched to our 24/7 control tower.' : 'كل رحلة تقوم بإنشاء سجل بيانات مستمر. إذا انحرفت درجات الحرارة بمقدار 0.5 درجة مئوية فقط عن الحد المعين، يتم إرسال تنبيه فوري إلى برج المراقبة الخاص بنا الذي يعمل على مدار الساعة.'}
                </p>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-slate-200">{isEn ? 'Printed Temperature Receipts' : 'إيصالات درجات الحرارة المطبوعة'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-slate-200">{isEn ? 'Cloud Data Retention (5 Years)' : 'الاحتفاظ السحابي بالبيانات (5 سنوات)'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-slate-200">{isEn ? 'Live Client Dashboard API' : 'واجهة بيانات حية للعميل'}</span>
                  </li>
                </ul>

                <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-black hover:bg-amber-400 transition-colors w-full justify-center">
                  {isEn ? 'Request Full Compliance Document' : 'طلب وثيقة الامتثال الكاملة'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
