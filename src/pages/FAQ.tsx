import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fallbackFaqs = [
  {
    q_en: 'How many pallets can a refrigerated Dyna hold?',
    q_ar: 'كم طبلية تشيل الدينا المبردة؟',
    a_en: 'A standard refrigerated Dyna can hold up to 5 standard pallets (120x100cm) with a maximum weight capacity of 4 Tons.',
    a_ar: 'تتسع دينا التبريد القياسية لما يصل إلى 5 طبالي بحمولة قصوى تصل إلى 4 طن.'
  },
  {
    q_en: 'Is your fleet approved by the Saudi Food and Drug Authority (SFDA)?',
    q_ar: 'هل أسطولكم معتمد من هيئة الغذاء والدواء (SFDA)؟',
    a_en: 'Absolutely. 100% of our fleet is SFDA-approved.',
    a_ar: 'بالتأكيد. أسطولنا معتمد بالكامل من هيئة الغذاء والدواء.'
  },
  {
    q_en: 'Which cities do you cover in Saudi Arabia?',
    q_ar: 'ما هي المدن التي تغطونها في السعودية؟',
    a_en: 'We cover all major regions and cities in the Kingdom, including Riyadh, Jeddah, Dammam, Qassim (Our HQ), Mecca, Medina, and more.',
    a_ar: 'نحن نغطي جميع المناطق والمدن الرئيسية في المملكة، بما في ذلك الرياض، جدة، الدمام، القصيم (مقرنا الرئيسي)، مكة، المدينة وغيرها.'
  }
];

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/faqs`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Filter only active FAQs
          setFaqs(data.filter((f: any) => f.active !== false));
        } else {
          setFaqs(fallbackFaqs);
        }
      })
      .catch(err => {
        console.error('Error fetching FAQs:', err);
        setFaqs(fallbackFaqs);
      })
      .finally(() => setLoading(false));
  }, []);

  const pageTitle = isEn ? 'Frequently Asked Questions (FAQ)' : 'الأسئلة الشائعة حول النقل المبرد';
  const pageDesc = isEn 
    ? 'Find answers to the most common questions about our refrigerated transport services, SFDA compliance, and logistics fleet in Saudi Arabia.' 
    : 'اعثر على إجابات للأسئلة الأكثر شيوعاً حول خدمات النقل المبرد لدينا، الامتثال لاشتراطات هيئة الغذاء والدواء، وأسطولنا اللوجستي في السعودية.';

  // Construct FAQ Schema for Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(q => ({
      "@type": "Question",
      "name": isEn ? q.q_en : q.q_ar,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": isEn ? q.a_en : q.a_ar
      }
    }))
  };

  const toggleQuestion = (idx: number) => {
    setOpenQuestion(openQuestion === idx ? null : idx);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <SEO title={`${pageTitle} | ${isEn ? 'Rokn Elryan' : 'ركن الريان'}`} description={pageDesc} schema={faqSchema} />
      
      {/* Header */}
      <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed font-medium">
            {isEn 
              ? 'Everything you need to know about scaling your cold chain logistics with Rokn Elryan.' 
              : 'كل ما تحتاج معرفته حول تطوير وإدارة لوجستيات سلسلة التبريد الخاصة بك مع ركن الريان.'}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center text-slate-500">
              {isEn ? 'Loading questions...' : 'جاري تحميل الأسئلة...'}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-slate-100 min-h-[400px]">
              <div className="space-y-4">
                {faqs.map((q, idx) => {
                  const isOpen = openQuestion === idx;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={idx} 
                      className={`border ${isOpen ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 bg-white'} rounded-2xl overflow-hidden transition-colors`}
                    >
                      <button 
                        onClick={() => toggleQuestion(idx)}
                        className="w-full px-6 py-5 flex items-center justify-between text-start focus:outline-none"
                      >
                        <span className={`font-bold text-lg md:text-xl pr-4 ${isOpen ? 'text-amber-700' : 'text-slate-800'}`}>
                          {isEn ? q.q_en : q.q_ar}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>
                          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-6"
                          >
                            <div className="pt-4 border-t border-amber-200/50 text-slate-600 leading-relaxed text-lg">
                              {isEn ? q.a_en : q.a_ar}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="container mx-auto px-4 mt-16 max-w-4xl">
        <div className="bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-2xl">
          <div className="text-center md:text-start">
            <h3 className="text-2xl font-black text-white mb-2">{isEn ? 'Still have questions?' : 'هل لا زال لديك استفسارات؟'}</h3>
            <p className="text-slate-400">{isEn ? 'Our logistics experts are ready to assist you 24/7.' : 'خبراء اللوجستيات لدينا جاهزون لمساعدتك على مدار الساعة.'}</p>
          </div>
          <div className="flex gap-4">
            <Link to={isEn ? '/en/contact' : '/contact'} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
              {isEn ? 'Contact Us' : 'تواصل معنا'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
