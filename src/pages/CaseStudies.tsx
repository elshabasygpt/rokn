import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function CaseStudies() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [studies, setStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/case-studies`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setStudies(data.filter((s: any) => s.active !== false));
        } else {
          setStudies([]);
        }
      })
      .catch(err => {
        console.error('Error fetching case studies:', err);
        setStudies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const pageTitle = isEn ? 'Enterprise Case Studies & Success Stories' : 'دراسات الحالة وقصص النجاح المؤسسية';
  const pageDesc = isEn 
    ? 'Discover how Rokn Elryan Logistics solves complex cold chain challenges for major pharmaceutical companies, food manufacturers, and retailers in Saudi Arabia.' 
    : 'اكتشف كيف تحل لوجستيات ركن الريان تحديات سلسلة التبريد المعقدة لشركات الأدوية الكبرى ومصانع الأغذية وتجار التجزئة في المملكة العربية السعودية.';

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageTitle,
    "description": pageDesc,
    "mainEntity": studies.map(cs => ({
      "@type": "Article",
      "headline": isEn ? cs.title_en : cs.title_ar,
      "articleSection": isEn ? cs.industry_en : cs.industry_ar
    }))
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <SEO title={`${pageTitle} | ${isEn ? 'Rokn Elryan' : 'ركن الريان'}`} description={pageDesc} schema={schema} />
      
      {/* Header */}
      <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed font-medium">
            {isEn 
              ? 'Real data. Real challenges. Real results. See how we architect flawless cold chain logistics for the most demanding industries.' 
              : 'بيانات حقيقية. تحديات واقعية. نتائج ملموسة. شاهد كيف نصمم لوجستيات سلسلة التبريد الخالية من العيوب لأكثر القطاعات تطلباً.'}
          </p>
        </div>
      </section>

      {/* Case Studies List */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="space-y-12">
          {loading ? (
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center text-slate-500">
              {isEn ? 'Loading case studies...' : 'جاري تحميل دراسات الحالة...'}
            </div>
          ) : (
            studies.map((cs, idx) => (
              <motion.div 
                key={cs.id || idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row group"
              >
                <div className="lg:w-2/5 relative overflow-hidden">
                  <div className="absolute top-4 start-4 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-bold z-10">
                    {isEn ? cs.industry_en : cs.industry_ar}
                  </div>
                  <img 
                    src={cs.image || 'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2070&auto=format&fit=crop'} 
                    alt={isEn ? cs.title_en : cs.title_ar} 
                    className="w-full h-64 lg:h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-amber-600 transition-colors">
                    {isEn ? cs.title_en : cs.title_ar}
                  </h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                      <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {isEn ? 'The Challenge' : 'التحدي'}
                      </h4>
                      <p className="text-red-800 leading-relaxed">{isEn ? cs.problem_en : cs.problem_ar}</p>
                    </div>
                    
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        {isEn ? 'Our Solution' : 'حل ركن الريان'}
                      </h4>
                      <p className="text-emerald-800 leading-relaxed">{isEn ? cs.solution_en : cs.solution_ar}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">{isEn ? 'Results & KPIs' : 'النتائج والمؤشرات'}</div>
                        <div className="text-lg font-black text-slate-900">{isEn ? cs.kpi_en : cs.kpi_ar}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mt-20">
        <div className="bg-amber-500 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 relative z-10">
            {isEn ? 'Ready to become our next success story?' : 'هل أنت مستعد لتكون قصة نجاحنا التالية؟'}
          </h2>
          <p className="text-xl text-slate-800 font-bold mb-8 max-w-2xl mx-auto relative z-10">
            {isEn ? 'Contact our enterprise sales team to engineer a custom logistics solution for your business.' : 'تواصل مع فريق مبيعات الشركات لهندسة حل لوجستي مخصص يتناسب تماماً مع أعمالك.'}
          </p>
          <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 relative z-10">
            {isEn ? 'Request Enterprise Proposal' : 'طلب عرض تعاقد مؤسسي'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
