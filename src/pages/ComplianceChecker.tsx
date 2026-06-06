import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, CheckCircle2, XCircle, Download, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const checklistItems = [
  { id: 'c1', en: 'Pre-cooling: Cargo area has reached target temperature before loading.', ar: 'التبريد المسبق: وصلت منطقة الشحن إلى درجة الحرارة المستهدفة قبل التحميل.' },
  { id: 'c2', en: 'Cleanliness: Interior is free of debris, odors, and visible dirt.', ar: 'النظافة: المقصورة الداخلية خالية من الحطام والروائح والأوساخ المرئية.' },
  { id: 'c3', en: 'Sanitation: Vehicle has been chemically sanitized within the last 24 hours.', ar: 'التعقيم: تم تعقيم الشاحنة كيميائياً خلال الـ 24 ساعة الماضية.' },
  { id: 'c4', en: 'Data Logger: IoT temperature sensor is active and recording.', ar: 'مسجل البيانات: مستشعر الحرارة (IoT) نشط وقيد التسجيل.' },
  { id: 'c5', en: 'Door Seals: Rubber gaskets are intact with no air leaks.', ar: 'أختام الأبواب: الإطارات المطاطية سليمة ولا يوجد بها تسرب هواء.' },
  { id: 'c6', en: 'Pallet Placement: Cargo allows for proper air circulation (not blocking vents).', ar: 'توزيع الطبالي: الشحنة تسمح بتدفق الهواء بشكل سليم (لا تسد الفتحات).' },
  { id: 'c7', en: 'Driver PPE: Driver is wearing appropriate sanitary gear (if required).', ar: 'معدات السائق: يرتدي السائق معدات الوقاية الصحية المناسبة.' },
];

export default function ComplianceChecker() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isAllChecked = checklistItems.every(item => checkedItems[item.id]);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((checkedCount / checklistItems.length) * 100);

  const pageTitle = isEn ? 'Pre-Loading SFDA Compliance Checker' : 'أداة فحص الامتثال قبل التحميل (موافقة لـ SFDA)';
  const pageDesc = isEn 
    ? 'An interactive digital checklist for warehouse managers to ensure refrigerated trucks meet strict SFDA and GMP logistics standards before loading.' 
    : 'قائمة فحص رقمية تفاعلية لمديري المستودعات للتأكد من أن شاحنات التبريد تلبي المعايير اللوجستية الصارمة لهيئة الغذاء والدواء قبل التحميل.';

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <SEO title={`${pageTitle} | ${isEn ? 'Rokn Elryan' : 'ركن الريان'}`} description={pageDesc} />
      
      {/* Header */}
      <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed font-medium">
            {isEn 
              ? 'Use this interactive tool to verify that your dispatched truck is 100% compliant and ready for sensitive cargo transport.' 
              : 'استخدم هذه الأداة التفاعلية للتحقق من أن شاحنتك الموجهة ممتثلة بنسبة 100% وجاهزة لنقل الشحنات الحساسة.'}
          </p>
        </div>
      </section>

      {/* Interactive Tool */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-slate-100">
          
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-slate-700">{isEn ? 'Inspection Progress' : 'نسبة فحص الجاهزية'}</span>
              <span className={`font-black text-xl ${isAllChecked ? 'text-emerald-500' : 'text-amber-500'}`}>
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${isAllChecked ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-4 mb-10">
            {checklistItems.map((item) => {
              const isChecked = checkedItems[item.id];
              return (
                <div 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${isChecked ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-amber-300'}`}
                >
                  <div className={`mt-1 shrink-0 ${isChecked ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {isChecked ? <CheckCircle2 className="w-7 h-7" /> : <div className="w-7 h-7 rounded-full border-2 border-slate-300" />}
                  </div>
                  <div className={`font-bold text-lg md:text-xl transition-colors ${isChecked ? 'text-emerald-900' : 'text-slate-700'}`}>
                    {isEn ? item.en : item.ar}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Box */}
          {isAllChecked && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-600 text-white p-8 rounded-2xl text-center shadow-lg border border-emerald-500"
            >
              <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-emerald-200" />
              <h3 className="text-3xl font-black mb-2">{isEn ? 'Vehicle is Ready for Loading' : 'الشاحنة جاهزة تماماً للتحميل'}</h3>
              <p className="text-emerald-100 font-medium mb-6">
                {isEn ? 'All compliance checks passed successfully. You may proceed with loading the cargo.' : 'تم اجتياز جميع فحوصات الامتثال بنجاح. يمكنك البدء في تحميل الشحنة بأمان.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.print()}
                  className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  {isEn ? 'Print Certificate' : 'طباعة الشهادة'}
                </button>
                <button 
                  onClick={() => setCheckedItems({})}
                  className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors"
                >
                  <Truck className="w-5 h-5" />
                  {isEn ? 'Inspect Next Vehicle' : 'فحص شاحنة أخرى'}
                </button>
              </div>
            </motion.div>
          )}

          {!isAllChecked && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
              <p className="text-slate-500 font-bold flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5 text-amber-500" />
                {isEn ? 'Please complete all checks before loading.' : 'يرجى إكمال جميع الفحوصات قبل السماح بالتحميل.'}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mt-20 text-center max-w-2xl">
         <h3 className="text-2xl font-bold text-slate-900 mb-4">
           {isEn ? 'Need a logistics partner that guarantees this level of compliance?' : 'هل تبحث عن شريك لوجستي يضمن لك هذا المستوى من الامتثال؟'}
         </h3>
         <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-amber-400 transition-all shadow-xl hover:-translate-y-1">
            {isEn ? 'Partner with Rokn Elryan' : 'تعاقد مع ركن الريان'}
            <ArrowRight className="w-5 h-5" />
         </Link>
      </section>

    </div>
  );
}
