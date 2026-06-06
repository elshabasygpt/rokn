import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Plus, Minus, ShieldCheck, Truck, Banknote, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const faqData = [
  {
    category_en: 'Fleet & Capacities',
    category_ar: 'الأسطول والسعات',
    icon: <Truck className="w-6 h-6" />,
    questions: [
      {
        q_en: 'How many pallets can a refrigerated Dyna hold?',
        q_ar: 'كم طبلية تشيل الدينا المبردة؟',
        a_en: 'A standard refrigerated Dyna can hold up to 5 standard pallets (120x100cm) with a maximum weight capacity of 4 Tons. It is ideal for inner-city distribution.',
        a_ar: 'تتسع دينا التبريد القياسية لما يصل إلى 5 طبالي (بمقاس 120x100 سم) بحمولة قصوى تصل إلى 4 طن، وهي مثالية للتوزيع داخل المدن.'
      },
      {
        q_en: 'What is the capacity of a refrigerated trailer?',
        q_ar: 'ما هي سعة تريلا النقل المبرد؟',
        a_en: 'A heavy refrigerated trailer can accommodate up to 24 standard pallets, with a maximum weight capacity of 25 Tons. It is designed for long-haul and inter-city transport.',
        a_ar: 'تستوعب تريلا التبريد الثقيلة حتى 24 طبلية قياسية، بحمولة قصوى تصل إلى 25 طناً، وهي مصممة للنقل الطويل بين المدن والمناطق.'
      },
      {
        q_en: 'Do you offer multi-temperature trucks?',
        q_ar: 'هل توفرون شاحنات متعددة درجات الحرارة؟',
        a_en: 'Yes, we have dual-evaporator trailers that can maintain two separate temperature zones (e.g., one compartment for frozen goods at -18°C and another for chilled goods at +4°C) simultaneously.',
        a_ar: 'نعم، نمتلك مقطورات (تريلات) مجهزة بمبخرين منفصلين يمكنها الحفاظ على نطاقين مختلفين من درجات الحرارة في نفس الوقت (مثل قسم للمجمدات عند -18 مئوية، وقسم للمبردات عند +4 مئوية).'
      }
    ]
  },
  {
    category_en: 'Compliance & Safety (SFDA)',
    category_ar: 'الامتثال والسلامة (هيئة الغذاء والدواء)',
    icon: <ShieldCheck className="w-6 h-6" />,
    questions: [
      {
        q_en: 'Is your fleet approved by the Saudi Food and Drug Authority (SFDA)?',
        q_ar: 'هل أسطولكم معتمد من هيئة الغذاء والدواء (SFDA)؟',
        a_en: 'Absolutely. 100% of our fleet is SFDA-approved. We strictly adhere to good distribution practices (GDP) for transporting pharmaceuticals, cosmetics, and food products.',
        a_ar: 'بالتأكيد. أسطولنا معتمد بالكامل من هيئة الغذاء والدواء. نحن نلتزم التزاماً تاماً بممارسات التوزيع الجيدة (GDP) لنقل الأدوية ومستحضرات التجميل والمنتجات الغذائية.'
      },
      {
        q_en: 'How do you monitor temperature during transit?',
        q_ar: 'كيف تتم مراقبة درجة الحرارة أثناء النقل؟',
        a_en: 'All vehicles are equipped with IoT data loggers that provide real-time temperature tracking. If the temperature deviates by 0.5°C, our control tower is alerted instantly.',
        a_ar: 'جميع الشاحنات مزودة بأجهزة تسجيل بيانات (Data Loggers) متصلة بإنترنت الأشياء (IoT) توفر تتبعاً لحظياً. في حال انحراف الحرارة بمقدار 0.5 مئوية، يتم تنبيه برج المراقبة فوراً.'
      },
      {
        q_en: 'How do you clean vehicles between trips?',
        q_ar: 'كيف يتم تعقيم الشاحنات بين الرحلات؟',
        a_en: 'We use a 7-step sanitation protocol involving high-pressure 85°C hot water washes and SFDA-approved foaming sanitizers to ensure zero cross-contamination.',
        a_ar: 'نستخدم بروتوكول تعقيم مكون من 7 خطوات يتضمن غسيلاً بماء ساخن (85 مئوية) عالي الضغط، ومطهرات رغوية معتمدة لضمان عدم حدوث أي تلوث متبادل.'
      }
    ]
  },
  {
    category_en: 'Coverage & Locations',
    category_ar: 'التغطية الجغرافية والمواقع',
    icon: <MapPin className="w-6 h-6" />,
    questions: [
      {
        q_en: 'Which cities do you cover in Saudi Arabia?',
        q_ar: 'ما هي المدن التي تغطونها في السعودية؟',
        a_en: 'We cover all major regions and cities in the Kingdom, including Riyadh, Jeddah, Dammam, Qassim (Our HQ), Mecca, Medina, Neom, Tabuk, Jazan, and more.',
        a_ar: 'نحن نغطي جميع المناطق والمدن الرئيسية في المملكة، بما في ذلك الرياض، جدة، الدمام، القصيم (مقرنا الرئيسي)، مكة، المدينة، نيوم، تبوك، جازان وغيرها.'
      },
      {
        q_en: 'Do you transport outside Saudi Arabia?',
        q_ar: 'هل تنقلون البضائع خارج السعودية؟',
        a_en: 'Currently, our primary focus is dominating the domestic logistics network within Saudi Arabia, ensuring the fastest transit times nationwide.',
        a_ar: 'في الوقت الحالي، ينصب تركيزنا الأساسي على السيطرة على الشبكة اللوجستية المحلية داخل المملكة لضمان أسرع أوقات العبور (Transit Times) على مستوى الدولة.'
      }
    ]
  },
  {
    category_en: 'Contracts & Pricing',
    category_ar: 'العقود والأسعار',
    icon: <Banknote className="w-6 h-6" />,
    questions: [
      {
        q_en: 'Do you offer monthly or yearly B2B contracts?',
        q_ar: 'هل توفرون عقوداً شهرية أو سنوية للشركات (B2B)؟',
        a_en: 'Yes, we provide highly customized, dedicated fleet contracts for businesses. This guarantees vehicle availability, fixed pricing, and a dedicated account manager.',
        a_ar: 'نعم، نقدم عقود تشغيل أساطيل مخصصة للشركات والمصانع. يضمن لك هذا التوافر الدائم للشاحنات، أسعاراً ثابتة، ومدير حساب مخصص لشركتك.'
      },
      {
        q_en: 'How much does refrigerated transport cost?',
        q_ar: 'كم تكلفة النقل المبرد؟',
        a_en: 'Pricing depends on route distance, required temperature range, and vehicle size. You can use our "Payload Calculator" to estimate capacity, or contact our sales team for an exact quote.',
        a_ar: 'تعتمد الأسعار على مسافة المسار، ونطاق الحرارة المطلوب، وحجم الشاحنة. يمكنك استخدام "حاسبة سعة الشاحنات" لدينا، أو التواصل مع فريق المبيعات للحصول على تسعيرة دقيقة.'
      }
    ]
  }
];

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [openCategory, setOpenCategory] = useState<number>(0);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const pageTitle = isEn ? 'Frequently Asked Questions (FAQ)' : 'الأسئلة الشائعة حول النقل المبرد';
  const pageDesc = isEn 
    ? 'Find answers to the most common questions about our refrigerated transport services, SFDA compliance, and logistics fleet in Saudi Arabia.' 
    : 'اعثر على إجابات للأسئلة الأكثر شيوعاً حول خدمات النقل المبرد لدينا، الامتثال لاشتراطات هيئة الغذاء والدواء، وأسطولنا اللوجستي في السعودية.';

  // Construct FAQ Schema for Google
  const allQs = faqData.flatMap(cat => cat.questions);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allQs.map(q => ({
      "@type": "Question",
      "name": isEn ? q.q_en : q.q_ar,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": isEn ? q.a_en : q.a_ar
      }
    }))
  };

  const toggleQuestion = (id: string) => {
    setOpenQuestion(openQuestion === id ? null : id);
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
          
          {/* Category Tabs (Desktop) */}
          <div className="hidden md:flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-lg border border-slate-100">
            {faqData.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setOpenCategory(idx)}
                className={`flex-1 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${openCategory === idx ? 'bg-amber-500 text-slate-900 shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <span className={openCategory === idx ? 'text-slate-900' : 'text-slate-400'}>{cat.icon}</span>
                {isEn ? cat.category_en : cat.category_ar}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-slate-100 min-h-[400px]">
            {/* Category Title for Mobile */}
            <div className="md:hidden mb-6 pb-4 border-b border-slate-100 flex items-center gap-3 text-amber-500">
              {faqData[openCategory].icon}
              <h2 className="text-xl font-black text-slate-900">
                {isEn ? faqData[openCategory].category_en : faqData[openCategory].category_ar}
              </h2>
            </div>
            
            <div className="space-y-4">
              {faqData[openCategory].questions.map((q, idx) => {
                const qId = `cat-${openCategory}-q-${idx}`;
                const isOpen = openQuestion === qId;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={qId} 
                    className={`border ${isOpen ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 bg-white'} rounded-2xl overflow-hidden transition-colors`}
                  >
                    <button 
                      onClick={() => toggleQuestion(qId)}
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

            {/* Mobile Category Selector */}
            <div className="md:hidden mt-8 pt-6 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-500 mb-3">{isEn ? 'Browse other categories:' : 'تصفح أقسام أخرى:'}</label>
              <div className="grid grid-cols-1 gap-2">
                {faqData.map((cat, idx) => (
                  openCategory !== idx && (
                    <button
                      key={idx}
                      onClick={() => setOpenCategory(idx)}
                      className="w-full py-3 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 flex items-center justify-between hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{cat.icon}</span>
                        {isEn ? cat.category_en : cat.category_ar}
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  )
                ))}
              </div>
            </div>

          </div>
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
