import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, ArrowRight, ShieldCheck, Activity, PackageCheck, ThermometerSnowflake, Building2, Building, ChevronDown, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Map string icon names from DB to Lucide React components
const iconMap: Record<string, React.ReactNode> = {
  'Activity': <Activity className="w-6 h-6" />,
  'PackageCheck': <PackageCheck className="w-6 h-6" />,
  'Briefcase': <Briefcase className="w-6 h-6" />,
  'ThermometerSnowflake': <ThermometerSnowflake className="w-6 h-6" />,
  'Building2': <Building2 className="w-6 h-6" />,
  'Building': <Building className="w-6 h-6" />
};

export default function IndustryPage() {
  const { industry: slug } = useParams<{ industry: string }>();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/industries/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found in DB');
        return res.json();
      })
      .then(data => setDbData(data))
      .catch(() => setDbData(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!dbData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{isEn ? 'Industry Not Found' : 'القطاع غير موجود'}</h1>
          <Link to="/" className="text-amber-600 underline font-bold">
            {isEn ? 'Return Home' : 'العودة للرئيسية'}
          </Link>
        </div>
      </div>
    );
  }

  const titleName = isEn ? dbData.name_en : dbData.name_ar;
  const pageTitle = (isEn ? dbData.hero_title_en : dbData.hero_title_ar) || titleName;
  const pageDesc = isEn ? dbData.hero_desc_en : dbData.hero_desc_ar;
  const iconNode = iconMap[dbData.icon] || <Building2 className="w-6 h-6" />;
  const bgImage = dbData.featured_image || "https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2070&auto=format&fit=crop";
  const ctaTitle = (isEn ? dbData.cta_title_en : dbData.cta_title_ar) || (isEn ? 'Request Enterprise Contract' : 'طلب تعاقد مؤسسي');
  const ctaDesc = isEn ? dbData.cta_desc_en : dbData.cta_desc_ar;
  
  const metaTitle = (isEn ? dbData.seo_title_en : dbData.seo_title_ar) || `${pageTitle} | ${isEn ? 'Rokn Elryan' : 'ركن الريان'}`;
  const metaDesc = (isEn ? dbData.seo_desc_en : dbData.seo_desc_ar) || pageDesc;
  const canonical = dbData.canonical_url;

  // Safe JSON Parsing for dynamic lists
  const parseList = (data: any) => Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data || '[]') : []);
  
  const challenges = parseList(isEn ? dbData.challenges_en : dbData.challenges_ar);
  const solutions = parseList(isEn ? dbData.solutions_en : dbData.solutions_ar);
  const benefits = parseList(isEn ? dbData.benefits_en : dbData.benefits_ar);
  const faqs = parseList(dbData.faqs);
  const relatedCaseStudies = parseList(dbData.related_case_studies);
  const relatedServices = parseList(dbData.related_services);

  const industrySchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": pageTitle,
    "provider": {
      "@type": "LocalBusiness",
      "name": "ركن الريان للنقل المبرد"
    },
    "description": metaDesc,
    "audience": {
      "@type": "Audience",
      "audienceType": isEn ? "B2B Enterprise" : "شركات ومؤسسات B2B"
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title={metaTitle} description={metaDesc} schema={industrySchema} canonical={canonical} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full font-bold mb-6 border border-blue-500/30">
              {iconNode}
              {titleName}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {pageTitle}
            </h1>
            {pageDesc && (
              <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl leading-relaxed font-medium">
                {pageDesc}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20">
                {ctaTitle}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      {(challenges.length > 0 || solutions.length > 0) && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                {isEn ? 'Industry Challenges & Our Solutions' : 'تحديات القطاع وحلولنا المبتكرة'}
              </h2>
              <p className="text-slate-600 text-lg">
                {isEn ? `We understand the unique complexities of the ${titleName} industry.` : `نحن ندرك التعقيدات الفريدة والتحديات التشغيلية التي تواجه ${titleName}.`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Challenges */}
              {challenges.length > 0 && (
                <div className="bg-red-50/50 p-8 md:p-10 rounded-3xl border border-red-100 relative">
                  <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6">{isEn ? 'The Challenges' : 'التحديات'}</h3>
                  <ul className="space-y-5">
                    {challenges.map((c: string, idx: number) => (
                      <li key={idx} className="flex gap-4">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0"></div>
                        <span className="text-slate-700 font-medium leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solutions */}
              {solutions.length > 0 && (
                <div className="bg-emerald-50/50 p-8 md:p-10 rounded-3xl border border-emerald-100 relative">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6">{isEn ? 'Our Solutions' : 'حلول ركن الريان'}</h3>
                  <ul className="space-y-5">
                    {solutions.map((s: string, idx: number) => (
                      <li key={idx} className="flex gap-4">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span className="text-slate-700 font-bold leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="py-20 bg-white border-y border-slate-200">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                {isEn ? 'Why Partner With Us?' : 'لماذا تعتمد على أسطولنا؟'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit: string, idx: number) => (
                <div key={idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                  <TrendingUp className="w-8 h-8 text-amber-500 mb-6 group-hover:-translate-y-1 transition-transform" />
                  <h4 className="text-lg font-bold text-slate-900 leading-relaxed">{benefit}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                {isEn ? 'Frequently Asked Questions' : 'الأسئلة الشائعة للقطاع'}
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq: any, idx: number) => {
                const question = isEn ? faq.q_en : faq.q_ar;
                const answer = isEn ? faq.a_en : faq.a_ar;
                const isOpen = openFaqIndex === idx;

                if (!question || !answer) return null;

                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-amber-500/30 transition-colors">
                    <button 
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-right flex items-center justify-between focus:outline-none"
                      dir={isEn ? 'ltr' : 'rtl'}
                    >
                      <span className="font-bold text-lg text-slate-900">{question}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5">
                        <p className="text-slate-600 leading-relaxed" dir={isEn ? 'ltr' : 'rtl'}>{answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related Resources */}
      {(relatedCaseStudies.length > 0 || relatedServices.length > 0) && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-6xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {relatedCaseStudies.length > 0 && (
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><Briefcase className="w-6 h-6 text-amber-500"/> {isEn ? 'Related Case Studies' : 'دراسات حالة ذات صلة'}</h3>
                   <div className="flex flex-wrap gap-3">
                     {relatedCaseStudies.map((slug: string, i: number) => (
                       <Link key={i} to={isEn ? `/en/case-studies/${slug}` : `/case-studies/${slug}`} className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors">
                         {slug.replace(/-/g, ' ')}
                       </Link>
                     ))}
                   </div>
                 </div>
               )}
               {relatedServices.length > 0 && (
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><PackageCheck className="w-6 h-6 text-amber-500"/> {isEn ? 'Recommended Services' : 'خدمات موصى بها'}</h3>
                   <div className="flex flex-wrap gap-3">
                     {relatedServices.map((slug: string, i: number) => (
                       <Link key={i} to={isEn ? `/en/services/${slug}` : `/services/${slug}`} className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors">
                         {slug.replace(/-/g, ' ')}
                       </Link>
                     ))}
                   </div>
                 </div>
               )}
             </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                {isEn ? 'Ready to Scale Your Operations?' : 'مستعد للارتقاء بعملياتك اللوجستية؟'}
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                {ctaDesc || (isEn ? 'Join leading businesses that trust Rokn Elryan for their critical supply chain needs.' : 'انضم إلى كبرى الشركات التي تثق بركن الريان في إدارة سلاسل التبريد الخاصة بها.')}
              </p>
              <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="inline-block bg-amber-500 text-slate-900 font-black text-lg px-10 py-5 rounded-xl hover:bg-amber-400 hover:scale-105 transition-all shadow-xl shadow-amber-500/20">
                {ctaTitle}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
