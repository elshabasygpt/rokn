import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Truck, ShieldCheck, Factory, FlaskConical, Utensils, Store, Warehouse } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Industries() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [industries, setIndustries] = useState<any[]>(() => {
    const cached = localStorage.getItem('siteIndustries');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(!industries.length);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/industries`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIndustries(data);
          localStorage.setItem('siteIndustries', JSON.stringify(data));
        }
      })
      .catch(err => console.error("Error fetching industries", err))
      .finally(() => setLoading(false));
  }, []);

  const metaTitle = isEn ? 'Specialized Logistics by Industry | Rokn Elryan' : 'الحلول اللوجستية المتخصصة حسب القطاع | ركن الريان';
  const metaDesc = isEn ? 'Discover our customized refrigerated and frozen transport solutions designed specifically for your industry needs.' : 'اكتشف حلول النقل المبرد والمجمد المخصصة والمصممة خصيصاً لتلبية التحديات اللوجستية لقطاعك التجاري.';

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title={metaTitle} description={metaDesc} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8ed7e66364?q=80&w=2000&auto=format&fit=crop"
            alt="Industries Coverage"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full font-bold border border-amber-500/30 mb-6">
              <Activity className="w-5 h-5" />
              {isEn ? 'Specialized Industry Solutions' : 'حلول متخصصة للقطاعات'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {isEn ? 'Tailored Transport for' : 'نقل مخصص يخدم'} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                {isEn ? 'Every Key Industry' : 'أهم القطاعات الحيوية'}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {metaDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : industries.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-lg font-bold">
              {isEn ? 'No industries available at the moment.' : 'لا توجد قطاعات متاحة حالياً.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry: any, idx: number) => {
                const industryPath = isEn ? `/en/industries/${industry.slug}` : `/industries/${industry.slug}`;
                
                let ItemIcon = Activity;
                const name = ((industry.name_en || '') + ' ' + (industry.name_ar || '')).toLowerCase();
                if (name.includes('food') || name.includes('مصانع') || name.includes('أغذية')) ItemIcon = Factory;
                else if (name.includes('pharma') || name.includes('أدوية')) ItemIcon = FlaskConical;
                else if (name.includes('restaurant') || name.includes('مطاعم')) ItemIcon = Utensils;
                else if (name.includes('retail') || name.includes('تجزئة')) ItemIcon = Store;
                else if (name.includes('warehouse') || name.includes('مستودعات')) ItemIcon = Warehouse;
                else if (name.includes('distribution') || name.includes('توزيع')) ItemIcon = Truck;

                return (
                  <motion.div 
                    key={industry.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link to={industryPath} className="group block bg-white rounded-3xl p-8 border border-slate-100 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden h-full flex flex-col">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative z-10 flex items-center justify-between mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group-hover:border-amber-500">
                          <ItemIcon className="w-8 h-8" />
                        </div>
                        <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-amber-500 transition-colors rtl:-scale-x-100" />
                      </div>
                      
                      <div className="relative z-10 mt-auto">
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors mb-3">
                          {isEn ? industry.name_en : industry.name_ar}
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                           {isEn ? `Specialized logistics solutions engineered to meet the strict requirements of ${industry.name_en}.` : `حلول لوجستية متخصصة مصممة لتلبية المتطلبات الدقيقة لـ ${industry.name_ar}.`}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200">
            <div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">
                {isEn ? 'Need a tailored solution for your business?' : 'هل تحتاج حلاً مخصصاً لنشاطك التجاري؟'}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                {isEn ? 'We understand that every industry has unique challenges. Our logistics engineers can design a custom supply chain solution specifically for you.' : 'نحن ندرك أن كل قطاع له تحديات لوجستية فريدة. يمكن لمهندسي اللوجستيات لدينا تصميم سلسلة إمداد مخصصة خصيصاً لتناسب احتياجاتك.'}
              </p>
              <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-500 hover:text-slate-900 transition-colors">
                {isEn ? 'Consult an Expert' : 'استشر خبيراً لوجستياً'}
                <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
              </Link>
            </div>
            <div className="flex justify-center">
              <ShieldCheck className="w-40 h-40 text-slate-200" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
