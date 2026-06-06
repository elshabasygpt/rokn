import React, { useState, useEffect } from 'react';
import { ShieldCheck, Target, Award, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import AnimatedCounter from '../components/AnimatedCounter';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function About() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  const [pagesMeta, setPagesMeta] = useState<any>(null);
  const [dynamicPage, setDynamicPage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.general) setSettings(data.general);
        if (data.aboutMeta) setMeta(data.aboutMeta);
        if (data.pagesMeta) setPagesMeta(data.pagesMeta);
      })
      .catch(console.error);

    fetch('/api/pages/about')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setDynamicPage(data);
      })
      .catch(console.error);
  }, []);

  const currentLang = i18n.language;
  let aboutLogoRaw = currentLang === 'en' ? settings?.logo_about_en : settings?.logo_about_ar;
  if (!aboutLogoRaw) aboutLogoRaw = settings?.logo;
  const logoUrl = aboutLogoRaw ? (aboutLogoRaw.startsWith('/') ? aboutLogoRaw : aboutLogoRaw) : null;

  const tLang = (key: string, fallbackKey: string) => {
    if (meta) {
      const val = i18n.language === 'en' ? meta[`${key}_en`] : meta[`${key}_ar`];
      if (val) return val;
    }
    return t(fallbackKey);
  };

  const pageTitle = tLang('title', 'about.title');
  const pageDesc = tLang('subtitle', 'about.subtitle');

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title={`${pageTitle} | ركن الريان للنقل المبرد`} description={pageDesc} />
      {/* 🌟 Premium Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-900 z-10">
        <div className="absolute inset-0 z-0">
          <img 
            src={meta?.hero_image?.startsWith('/') ? meta.hero_image : meta?.hero_image || "https://images.unsplash.com/photo-1519003722824-194d4455aeb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-44 h-44 md:w-56 md:h-56 mx-auto mb-8 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 flex items-center justify-center shadow-2xl p-4 relative"
            >
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
              <img src={logoUrl || "/logo.png"} alt="ركن الريان للنقل المبرد" className={logoUrl ? "w-full h-full object-contain relative z-10 drop-shadow-xl" : "w-16 h-16 object-contain relative z-10"} onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }} />
              <span className="hidden text-amber-500 font-black text-3xl">ركن الريان</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-sm">{tLang('title', 'about.title')}</h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
              {tLang('subtitle', 'about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 Dynamic Rich Text OR The Story Split Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          {dynamicPage?.content_ar ? (
             <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-16 max-w-5xl mx-auto">
               <div 
                 className={`prose prose-lg max-w-none ${i18n.language === 'en' ? 'text-left' : 'text-right'}`} 
                 dangerouslySetInnerHTML={{ __html: i18n.language === 'en' ? dynamicPage.content_en : dynamicPage.content_ar }} 
               />
             </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: i18n.language === 'en' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 text-start relative"
              >
                <div className="absolute -top-10 -start-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
                <h2 className="text-sm font-bold text-amber-500 tracking-widest uppercase mb-2">{tLang('title', 'about.title')}</h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">{tLang('story_title', 'about.story.title')}</h3>
                
                <div className="space-y-6 text-slate-600 text-lg md:text-xl leading-relaxed relative z-10 border-s-4 border-amber-500 ps-6">
                  <p className="font-medium text-slate-800">{tLang('story_p1', 'about.story.p1')}</p>
                  <p>{tLang('story_p2', 'about.story.p2')}</p>
                  <p>{tLang('story_p3', 'about.story.p3')}</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-[2.5rem] transform rotate-3 opacity-20 blur-lg"></div>
                <img 
                  src={meta?.story_image?.startsWith('/') ? meta.story_image : meta?.story_image || "https://images.unsplash.com/photo-1580674292641-8e01768651c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                  alt="Our Team" 
                  className="rounded-[2rem] shadow-2xl object-cover h-[500px] md:h-[600px] w-full relative z-10"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-10 start-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-white">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-2xl text-slate-900">+<AnimatedCounter end={meta?.stat_years || 15} /></div>
                    <div className="text-sm font-bold text-slate-600">{t('about.stats.years')}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* 🌟 Vision 2030 Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto bg-amber-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-amber-500/20">
              <Target className="w-10 h-10 text-slate-900" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-amber-500">{tLang('vision_title', 'about.vision.title')}</h2>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light mb-12">
              {tLang('vision_desc', 'about.vision.desc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <ShieldCheck className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">{i18n.language === 'en' ? 'Food & Drug Security' : 'الأمن الغذائي والدوائي'}</h3>
                <p className="text-slate-400 text-sm">{i18n.language === 'en' ? 'Ensuring continuous supply chains per SFDA standards.' : 'ضمان استمرارية سلاسل الإمداد وفق أعلى معايير الجودة لهيئة الغذاء والدواء.'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <Award className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">{i18n.language === 'en' ? 'Logistics Efficiency' : 'كفاءة الخدمات اللوجستية'}</h3>
                <p className="text-slate-400 text-sm">{i18n.language === 'en' ? 'Deploying advanced tracking systems and lowering operation costs.' : 'تطبيق أحدث أنظمة التتبع (Data Loggers) لرفع كفاءة عمليات التوزيع.'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <Clock className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">{i18n.language === 'en' ? 'Sustainable Fleet' : 'أسطول مستدام'}</h3>
                <p className="text-slate-400 text-sm">{i18n.language === 'en' ? 'Modern refrigerated trucks utilizing eco-friendly Thermo King units.' : 'شاحنات مبردة حديثة تعتمد على وحدات تبريد موفرة للطاقة وصديقة للبيئة.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 Premium Core Values Cards */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">{tLang('vision_title', 'about.vision.title')} & {tLang('values_title', 'about.values.title')}</h2>
            <div className="w-20 h-1.5 bg-amber-500 rounded-full mx-auto"></div>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Vision */}
            <motion.div variants={fadeInUp} className="group bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 end-0 bg-blue-50 w-40 h-40 rounded-bl-[100px] -z-10 group-hover:bg-blue-500 transition-colors duration-500"></div>
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-blue-600 shadow-sm transition-colors duration-500">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{tLang('vision_title', 'about.vision.title')}</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                {pagesMeta?.about?.[`vision_${currentLang}`] || tLang('vision_desc', 'about.vision.desc')}
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div variants={fadeInUp} className="group bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden text-white mt-0 md:mt-8">
              <div className="absolute top-0 end-0 bg-amber-500/20 w-40 h-40 rounded-bl-[100px] -z-10 group-hover:bg-amber-500 transition-colors duration-500"></div>
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm text-amber-400 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-amber-500 shadow-sm transition-colors duration-500">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">{tLang('mission_title', 'about.mission.title')}</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-light">
                {pagesMeta?.about?.[`mission_${currentLang}`] || tLang('mission_desc', 'about.mission.desc')}
              </p>
            </motion.div>

            {/* Values */}
            <motion.div variants={fadeInUp} className="group bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 end-0 bg-green-50 w-40 h-40 rounded-bl-[100px] -z-10 group-hover:bg-green-500 transition-colors duration-500"></div>
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-green-600 shadow-sm transition-colors duration-500">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{tLang('values_title', 'about.values.title')}</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                {tLang('values_desc', 'about.values.desc')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 Geometric Stats Banner */}
      <section className="py-20 md:py-24 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-amber-500 rounded-[3rem] p-12 lg:p-20 text-slate-900 shadow-2xl relative overflow-hidden"
          >
            {/* Geometric Patterns */}
            <div className="absolute top-0 end-0 w-64 h-64 bg-white/20 rounded-full mix-blend-overlay blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 start-0 w-48 h-48 bg-black/5 rounded-full mix-blend-overlay blur-md transform -translate-x-1/3 translate-y-1/3"></div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center relative z-10" dir="ltr">
              <div className="group">
                <div className="text-5xl lg:text-7xl font-black mb-2 flex justify-center text-white drop-shadow-md group-hover:scale-110 transition-transform">
                  <AnimatedCounter end={meta?.stat_years || 15} prefix="+" />
                </div>
                <div className="text-lg lg:text-xl font-bold bg-white/20 inline-block px-4 py-1 rounded-full">{t('about.stats.years')}</div>
              </div>
              <div className="group">
                <div className="text-5xl lg:text-7xl font-black mb-2 flex justify-center text-white drop-shadow-md group-hover:scale-110 transition-transform">
                  <AnimatedCounter end={meta?.stat_success || 5000} prefix="+" />
                </div>
                <div className="text-lg lg:text-xl font-bold bg-white/20 inline-block px-4 py-1 rounded-full">{t('about.stats.success')}</div>
              </div>
              <div className="group">
                <div className="text-5xl lg:text-7xl font-black mb-2 flex justify-center text-white drop-shadow-md group-hover:scale-110 transition-transform">
                  <AnimatedCounter end={meta?.stat_trucks || 50} prefix="+" />
                </div>
                <div className="text-lg lg:text-xl font-bold bg-white/20 inline-block px-4 py-1 rounded-full">{t('about.stats.trucks')}</div>
              </div>
              <div className="group">
                <div className="text-5xl lg:text-7xl font-black mb-2 flex justify-center text-white drop-shadow-md group-hover:scale-110 transition-transform">
                  <AnimatedCounter end={meta?.stat_quality || 100} suffix="%" />
                </div>
                <div className="text-lg lg:text-xl font-bold bg-white/20 inline-block px-4 py-1 rounded-full">{t('about.stats.quality')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
