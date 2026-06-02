import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, Truck, Wrench, Package, Clock, ThumbsUp, Users, Star, Calculator, ChevronDown, Quote, Award, CheckCircle2, MapPin, ArrowRightLeft, Plus, Minus, Calendar, MessageCircle, Snowflake, ThermometerSnowflake, Wind, Thermometer, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedCounter from '../components/AnimatedCounter';
import { useTranslation } from 'react-i18next';
import { Logo1, Logo2, Logo3, Logo4, Logo5 } from '../components/PartnerLogos';
import { getIcon } from '../lib/iconMap';
import SearchableSelect from '../components/SearchableSelect';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  // Using English as keys for cities internally, but UI shows translation
  const [fromCity, setFromCity] = useState('أبها'); // Keep keys if possible or match logic
  const [toCity, setToCity] = useState('الرياض');
  const [truckType, setTruckType] = useState('شاحنة صغيرة');
  const [tempType, setTempType] = useState('تجميد');
  const [estimate, setEstimate] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  // Dynamic API state
  const [apiData, setApiData] = useState({
    hero: { title1_ar: '', title1_en: '', title2_ar: '', title2_en: '', desc_ar: '', desc_en: '', images: [] },
    services: [] as any[],
    testimonials: [] as any[],
    partners: [] as any[],
    faqs: [] as any[],
    content: null as any,
    estimator: { title_ar: '', title_en: '', desc_ar: '', desc_en: '', image: '' },
    articles: [] as any[],
    citiesMeta: null as any,
    settings: null as any,
    pagesMeta: null as any
  });

  const heroImages = apiData.hero.images.length > 0 ? apiData.hero.images : [
    'https://images.unsplash.com/photo-1519003722824-194d4455aeb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1580674292641-8e01768651c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1494412585934-4cb66663dc5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, servicesRes, testimonialsRes, partnersRes, faqsRes, articlesRes] = await Promise.all([
          fetch('/api/settings').then(r => r.json()),
          fetch('/api/services').then(r => r.json()),
          fetch('/api/testimonials').then(r => r.json()),
          fetch('/api/partners').then(r => r.json()),
          fetch('/api/faqs').then(r => r.json()),
          fetch('/api/articles').then(r => r.json())
        ]);
        setApiData({
          hero: settingsRes.hero || apiData.hero,
          estimator: settingsRes.estimator || apiData.estimator,
          content: settingsRes.content || null,
          services: servicesRes.slice(0, 3), // Show top 3
          testimonials: testimonialsRes,
          faqs: faqsRes,
          partners: partnersRes,
          articles: Array.isArray(articlesRes) ? (articlesRes.filter((a: any) => a.is_featured).length > 0 ? articlesRes.filter((a: any) => a.is_featured).slice(0, 3) : articlesRes.slice(0, 3)) : [],
          citiesMeta: settingsRes.citiesMeta || null,
          settings: settingsRes
        });
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const dsCitiesRaw = apiData.citiesMeta?.list || apiData.estimator?.cities;
  let dsCities: { value: string; label: string }[] = [];
  if (Array.isArray(apiData.citiesMeta?.list)) {
    dsCities = apiData.citiesMeta.list.map((c: any) => ({ value: c.ar || c.en, label: i18n.language === 'en' ? c.en : c.ar }));
  } else {
    const rawArr = Array.isArray(dsCitiesRaw) && dsCitiesRaw.length > 0 
      ? dsCitiesRaw 
      : (typeof dsCitiesRaw === 'string' && dsCitiesRaw.trim().length > 0 
          ? dsCitiesRaw.split(/[,،]+/).map((s: string) => s.trim()) 
          : ['أبها', 'خميس مشيط', 'الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'الطائف', 'تبوك', 'بريدة']);
    dsCities = rawArr.map((c: string) => ({ value: c, label: c }));
  }

  useEffect(() => {
    const estState = apiData.estimator;
    if (!estState || !dsCities || dsCities.length === 0) return;
    
    const validValues = dsCities.map(c => c.value);
    // Auto-select valid cities if current state is not in the list
    if (!validValues.includes(fromCity) && validValues[0]) setFromCity(validValues[0]);
    if (!validValues.includes(toCity) && validValues.length > 1) setToCity(validValues[1] || validValues[0]);
    let localCities = estState.local_cities;
    if (!Array.isArray(localCities)) {
      localCities = typeof localCities === 'string' ? localCities.split(/[,،]+/).map(s => s.trim()) : ['أبها', 'خميس مشيط'];
    }
    const isLocal = localCities.includes(fromCity) && localCities.includes(toCity);

    let base = 0;
    if (isLocal) {
      if (truckType === 'شاحنة صغيرة') base = 300;
      else if (truckType === 'جامبو') base = 500;
      else base = 1200;
    } else {
      if (truckType === 'شاحنة صغيرة') base = 1000;
      else if (truckType === 'جامبو') base = 1800;
      else base = 3500;
    }

    if (tempType === 'تجميد') base += 200;
    else if (tempType === 'تبريد') base += 100;

    setEstimate(base);
  }, [fromCity, toCity, truckType, tempType, apiData.estimator, dsCities]);

  const handleSwapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const faqsFallback = t('home.faqs', { returnObjects: true }) as { q: string, a: string }[];
  const dsFaqs = apiData.faqs.length > 0 ? apiData.faqs.filter((f: any) => f.active).map((f: any) => ({
    q: i18n.language === 'en' ? f.q_en : f.q_ar,
    a: i18n.language === 'en' ? f.a_en : f.a_ar
  })) : faqsFallback;

  const trustItems = t('home.trust', { returnObjects: true }) as string[];
  const serviceItems = t('home.services.items', { returnObjects: true }) as { title: string, desc: string }[];
  
  const whyUsFallback = t('home.whyUs.items', { returnObjects: true }) as { title: string, desc: string }[];
  const dsWhyUs = whyUsFallback.map((fallback, i) => {
    const raw = apiData.content?.whyUs?.[i];
    return {
      title: (i18n.language === 'en' ? raw?.title_en : raw?.title_ar) || fallback.title,
      desc: (i18n.language === 'en' ? raw?.desc_en : raw?.desc_ar) || fallback.desc,
      iconName: raw?.icon
    };
  });

  const howItWorksFallback = t('home.howItWorks.items', { returnObjects: true }) as { title: string, desc: string }[];
  const dsHowItWorks = howItWorksFallback.map((fallback, i) => {
    const raw = apiData.content?.howItWorks?.[i];
    return {
      title: (i18n.language === 'en' ? raw?.title_en : raw?.title_ar) || fallback.title,
      desc: (i18n.language === 'en' ? raw?.desc_en : raw?.desc_ar) || fallback.desc,
      iconName: raw?.icon,
      imageUrl: raw?.image ? (raw.image.startsWith('/') ? raw.image : raw.image) : null
    };
  });

  const serviceIcons = [Truck, ThermometerSnowflake, Wind];
  const whyUsIcons = [Thermometer, MapPin, Calendar, Award];
  const howItWorksIcons = [Phone, ThermometerSnowflake, Truck, CheckCircle2];

  const homeTitle = apiData.hero[`title1_${i18n.language}` as keyof typeof apiData.hero] || t('home.hero.title1');
  const homeDesc = apiData.hero[`desc_${i18n.language}` as keyof typeof apiData.hero] || t('home.hero.desc');

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ركن الريان للنقل المبرد",
    "image": heroImages[0],
    "description": homeDesc,
    "telephone": `+${apiData.contact?.phone1 || ''}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Abha",
      "addressRegion": "Asir",
      "addressCountry": "SA"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <>
      <SEO title={`${homeTitle} | ${isEn ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد'}`} description={homeDesc} schema={localBusinessSchema} />
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-24 min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={heroIndex}
              src={heroImages[heroIndex]}
              alt="Hero Background"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === heroIndex ? 'bg-amber-500 w-12' : 'bg-white/40 hover:bg-white w-3'}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl text-white"
          >
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-5 py-2 rounded-full text-sm md:text-base font-bold border border-amber-500/30 backdrop-blur-sm shadow-xl">
                <ShieldCheck className="w-5 h-5" />
                {t('home.hero.badge')}
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-sm md:text-base font-bold border border-emerald-500/30 backdrop-blur-sm shadow-xl" dir="ltr">
                <span dir="rtl">{isEn ? 'SFDA Certified' : 'معتمدون من هيئة الغذاء والدواء (SFDA)'}</span>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-400 px-5 py-2 rounded-full text-sm md:text-base font-bold border border-cyan-500/30 backdrop-blur-sm shadow-xl" dir="ltr">
                <span dir="rtl">{isEn ? 'Live Temperature Monitoring (-18°C to +4°C)' : 'درجات حرارة مراقبة لحظياً (-18°C إلى +4°C)'}</span>
                <ThermometerSnowflake className="w-5 h-5" />
              </div>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight mb-4 text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] tracking-tight">
              {apiData.hero[`title1_${i18n.language}` as keyof typeof apiData.hero] || t('home.hero.title1')}
              <span className="text-white text-3xl md:text-6xl lg:text-7xl block mt-4 drop-shadow-md">
                {apiData.hero[`title2_${i18n.language}` as keyof typeof apiData.hero] || t('home.hero.title2')}
              </span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl leading-relaxed font-medium">
              {apiData.hero[`desc_${i18n.language}` as keyof typeof apiData.hero] || t('home.hero.desc')}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link to="/enterprise-quote" className="flex items-center justify-center gap-2 bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
                <FileText className="w-6 h-6" />
                {t('home.hero.callNow')}
              </Link>
              <Link to="/enterprise-quote" className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 backdrop-blur-sm px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
                <Truck className="w-5 h-5" />
                {t('home.hero.bookNow')}
              </Link>
              <a href="#" className="flex items-center justify-center gap-2 bg-transparent text-amber-400 border border-amber-500/30 backdrop-blur-sm px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-500/10 transition-colors">
                <Download className="w-5 h-5" />
                {i18n.language === 'en' ? 'Download Profile (PDF)' : 'تحميل الملف التعريفي (PDF)'}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <div className="bg-slate-900 border-b border-slate-800 relative z-20 -mt-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 py-6">
            {trustItems.map((text, idx) => {
              const icons = [ShieldCheck, Users, Truck, Award];
              const Icon = icons[idx];
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.1) }}
                  className="flex items-center gap-2 text-slate-300"
                >
                  <Icon className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-sm md:text-base">{text}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      {apiData.settings?.general?.partners_enabled !== false && (
      <section className="py-24 bg-white border-y border-slate-100 overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-4">{t('home.partnersTitle')}</h3>
            <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full shadow-lg shadow-amber-500/20"></div>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 px-4 max-w-7xl mx-auto" dir="ltr">
            {(apiData.partners && apiData.partners.length > 0 ? apiData.partners : [
              { svg_code: "Logo1", color: "#005a9c", name: "ALRAJHI" },
              { svg_code: "Logo2", color: "#d12027", name: "AL-FOUZAN" },
              { svg_code: "Logo3", color: "#007f3e", name: "Logistics Co." },
              { svg_code: "Logo4", color: "#1d1d1b", name: "South Housing" },
              { svg_code: "Logo5", color: "#4a148c", name: "Tatweer" }
            ]).map((partner: any, idx) => {
              const svgMap: any = { Logo1, Logo2, Logo3, Logo4, Logo5 };
              const Icon = partner.svg_code ? svgMap[partner.svg_code] : null;

              return (
              <motion.div 
                key={partner.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group flex items-center justify-center p-8 bg-slate-50 hover:bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 ease-out h-32 md:h-40 relative overflow-hidden ${idx === 4 ? 'col-span-2 lg:col-span-1 max-w-xs mx-auto lg:max-w-none' : ''}`}
                style={{ 
                  '--hover-color': partner.color,
                } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {partner.image_url ? (
                  <img src={partner.image_url.startsWith('/') ? partner.image_url : partner.image_url} alt={partner.name} className="h-12 md:h-16 w-auto opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-sm relative z-10 object-contain" />
                ) : Icon ? (
                  <Icon 
                    className="h-12 md:h-16 w-auto opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-sm relative z-10" 
                    style={{ color: partner.color }}
                  />
                ) : null}
              </motion.div>
            )})}
          </div>
        </div>
      </section>
      )}

      {/* Industries We Serve Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
              {apiData.pagesMeta?.industries?.[`title_${i18n.language}`] || (i18n.language === 'en' ? 'Industries We Serve' : 'قطاعات الأعمال التي نخدمها')}
            </h2>
            <p className="text-slate-600 text-lg md:text-xl font-medium">
              {apiData.pagesMeta?.industries?.[`desc_${i18n.language}`] || (i18n.language === 'en' ? 'We provide specialized cold chain logistics tailored to the unique requirements of various B2B sectors in Saudi Arabia.' : 'نقدم حلول نقل لوجستية مبردة مصممة خصيصاً لتلبية المعايير الصارمة لمختلف قطاعات الأعمال في المملكة.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(apiData.pagesMeta?.industries?.items?.length > 0 ? apiData.pagesMeta.industries.items : [
              { icon: '🍔', title_ar: 'الأغذية والسلع الاستهلاكية', title_en: 'FMCG & Food', desc_ar: 'الحفاظ على نضارة وجودة المنتجات لأسواق التجزئة.', desc_en: 'Maintaining freshness for grocery chains.' },
              { icon: '💊', title_ar: 'الأدوية والمستلزمات الطبية', title_en: 'Pharmaceuticals', desc_ar: 'نقل مطابق لاشتراطات هيئة الغذاء والدواء (+4°C).', desc_en: 'SFDA compliant transport (+4°C to +8°C).' },
              { icon: '🥩', title_ar: 'اللحوم والدواجن', title_en: 'Meat & Poultry', desc_ar: 'تجميد عميق يصل إلى -18°C لضمان سلامة اللحوم.', desc_en: 'Deep freezing down to -18°C for safety.' },
              { icon: '🏨', title_ar: 'المطاعم والإعاشة', title_en: 'Restaurants & Catering', desc_ar: 'توزيع يومي موثوق لقطاع المطاعم والضيافة.', desc_en: 'Daily reliable distribution for food service.' }
            ]).map((industry: any, i: number) => (
              <div key={i} className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:border-amber-500/30 transition-all text-center group">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{industry.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{industry[`title_${i18n.language}`] || (i18n.language === 'en' ? industry.title_en : industry.title_ar)}</h3>
                <p className="text-slate-500 font-medium">{industry[`desc_${i18n.language}`] || (i18n.language === 'en' ? industry.desc_en : industry.desc_ar)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Summary Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex justify-between items-end mb-12"
          >
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{t('home.services.title')}</h2>
              <p className="text-slate-600 text-lg">{t('home.services.desc')}</p>
            </div>
            <Link to="/services" className="hidden md:flex text-amber-600 font-bold hover:text-amber-700 transition-colors items-center gap-2">
              {t('home.services.viewAll')}
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {(apiData.services.length > 0 ? apiData.services : serviceItems.map((s, i) => ({ ...s, icon: ['Truck','ThermometerSnowflake','Wind'][i]}))).map((service, index) => {
              const iconMap: any = { Truck, ThermometerSnowflake, Wind, ShieldCheck, MapPin, Clock, Home };
              const Icon = iconMap[service.icon] || Truck;
              const title = apiData.services.length > 0 ? service[`title_${i18n.language}` as keyof typeof service] : service.title;
              const desc = apiData.services.length > 0 ? service[`desc_${i18n.language}` as keyof typeof service] : service.desc;
              
              return (
                <motion.div variants={fadeInUp} key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                    <Icon className="w-8 h-8 text-slate-700 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">{title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/services" className="inline-block bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors">
              {t('home.services.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Cost Estimator Section */}
      {apiData.estimator?.enabled !== false && (
        <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <Calculator className="w-4 h-4" />
                {t('home.estimator.badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                {apiData.estimator[`title_${i18n.language}` as keyof typeof apiData.estimator] || t('home.estimator.title')}
              </h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                {apiData.estimator[`desc_${i18n.language}` as keyof typeof apiData.estimator] || t('home.estimator.desc')}
              </p>
              
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm relative">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 relative">
                  <div className="w-full relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('home.estimator.fromCity')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-slate-400" />
                      </div>
                      <SearchableSelect 
                        value={fromCity} 
                        onChange={setFromCity} 
                        options={dsCities}
                        placeholder={t('home.estimator.fromCity')}
                        className="w-full ps-12 pe-4 py-4 rounded-2xl border border-slate-200 hover:border-amber-500 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white font-semibold text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 mt-6 sm:mt-0 z-10 hidden sm:flex">
                    <button onClick={handleSwapCities} className="w-12 h-12 bg-white hover:bg-slate-100 mt-6 rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors tooltip" aria-label="Swap Cities">
                      <ArrowRightLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-shrink-0 z-10 flex sm:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1">
                    <button onClick={handleSwapCities} className="w-10 h-10 bg-white hover:bg-slate-100 rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors">
                      <ArrowRightLeft className="w-4 h-4 rotate-90" />
                    </button>
                  </div>

                  <div className="w-full relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('home.estimator.toCity')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-slate-400" />
                      </div>
                      <SearchableSelect 
                        value={toCity} 
                        onChange={setToCity} 
                        options={dsCities}
                        placeholder={t('home.estimator.toCity')}
                        className="w-full ps-12 pe-4 py-4 rounded-2xl border border-slate-200 hover:border-amber-500 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white font-semibold text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{i18n.language === 'en' ? 'Truck Size' : 'حجم الشاحنة'}</label>
                    <div className="flex gap-2">
                      {['شاحنة صغيرة', 'جامبو', 'تريلا'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setTruckType(type)}
                          className={`flex-1 py-3 px-2 rounded-xl border text-sm font-bold transition-all ${truckType === type ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'}`}
                        >
                          {i18n.language === 'en' ? (type === 'شاحنة صغيرة' ? 'Small' : type === 'جامبو' ? 'Jumbo' : 'Trailer') : type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{i18n.language === 'en' ? 'Temperature' : 'درجة الحرارة'}</label>
                    <div className="flex gap-2">
                      {['تجميد', 'تبريد', 'جاف'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setTempType(type)}
                          className={`flex-1 py-3 px-2 rounded-xl border text-sm font-bold transition-all ${tempType === type ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                        >
                          {i18n.language === 'en' ? (type === 'تجميد' ? 'Frozen' : type === 'تبريد' ? 'Chilled' : 'Dry') : type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-6 md:p-8 rounded-2xl text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="text-sm text-amber-800 font-bold mb-3 relative z-10">{t('home.estimator.estimateStart')}</div>
                  <div className="text-5xl md:text-6xl font-black text-amber-600 mb-4 relative z-10 drop-shadow-sm tracking-tight" dir="ltr">
                    <AnimatedCounter end={estimate} /> <span className="text-xl md:text-2xl font-bold">{t('home.estimator.currency')}</span>
                  </div>
                  <p className="text-sm text-amber-700/80 max-w-sm mx-auto relative z-10 font-medium">{isEn ? 'This is an estimated price for refrigerated transport and is subject to negotiation.' : 'السعر يشمل تكاليف النقل المبرد ويعتبر سعراً تقريبياً وقابلاً للتفاوض.'}</p>
                  
                  <a href={`https://wa.me/${apiData.contact?.whatsapp || ''}?text=${encodeURIComponent(`مرحباً، أود حجز ${truckType} تبريد (${tempType}) من ${fromCity} إلى ${toCity}. التكلفة التقريبية: ${estimate} ريال.\n\nاسم الشركة: \nقطاع العمل: \n\nطلب تسعيرة رسمية للشركات.`)}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative z-10">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    {isEn ? 'Book & Confirm Now' : 'حجز وتأكيد الآن'}
                  </a>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:w-1/2"
            >
              <img 
                src={apiData.estimator.image ? (apiData.estimator.image.startsWith('/') ? apiData.estimator.image : apiData.estimator.image) : "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                alt="Cost Estimator" 
                className="rounded-3xl shadow-2xl object-cover h-[600px] w-full"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:w-1/2"
            >
              {(() => {
                const whyUsMeta = apiData.settings?.whyUsMeta || {};
                const wTitle = whyUsMeta[`title_${i18n.language}` as keyof typeof whyUsMeta] || (t('home.whyUs.title1') + ' ' + t('home.whyUs.title2'));
                const splitTitle = wTitle.split(' ');
                const lastWord = splitTitle.length > 1 ? splitTitle.pop() : '';
                const restTitle = splitTitle.join(' ');
                const wDesc = whyUsMeta[`desc_${i18n.language}` as keyof typeof whyUsMeta] || t('home.whyUs.desc');
                
                return (
                  <>
                    <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black mb-6">
                      {restTitle} {lastWord && <span className="text-amber-500">{lastWord}</span>}
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-slate-300 text-lg mb-10 leading-relaxed">
                      {wDesc}
                    </motion.p>
                  </>
                );
              })()}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dsWhyUs.map((feature: any, index: number) => {
                  const rawIcon = whyUsIcons[index] || whyUsIcons[0];
                  const Icon = getIcon(feature.iconName, rawIcon);
                  return (
                    <motion.div variants={fadeInUp} key={index} className="flex gap-4 text-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                        <p className="text-slate-400 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {(() => {
                  const whyUsMeta = apiData.settings?.whyUsMeta || {};
                  const wImg = whyUsMeta.image ? (whyUsMeta.image.startsWith('/') ? whyUsMeta.image : whyUsMeta.image) : "https://images.unsplash.com/photo-1580674292641-8e01768651c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                  
                  const stat1Num = parseInt(whyUsMeta.stat1_num) || 15;
                  const stat1Text = whyUsMeta[`stat1_text_${i18n.language}` as keyof typeof whyUsMeta] || t('home.whyUs.yearsExp');

                  const stat2Num = parseInt(whyUsMeta.stat2_num) || 5000;
                  const stat2Text = whyUsMeta[`stat2_text_${i18n.language}` as keyof typeof whyUsMeta] || t('home.whyUs.happyClients');

                  return (
                    <>
                      <img 
                        src={wImg} 
                        alt="Professional movers" 
                        className="w-full h-auto"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      <div className="absolute bottom-6 end-6 start-6">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-black text-amber-400" dir="ltr">
                              <AnimatedCounter end={stat1Num} prefix="+" />
                            </div>
                            <div className="text-sm text-slate-200 font-semibold">{stat1Text}</div>
                          </div>
                          <div className="w-px h-10 bg-white/20"></div>
                          <div>
                            <div className="text-3xl font-black text-amber-400" dir="ltr">
                              <AnimatedCounter end={stat2Num} prefix="+" />
                            </div>
                            <div className="text-sm text-slate-200 font-semibold">{stat2Text}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{t('home.howItWorks.title')}</h2>
            <p className="text-slate-600 text-lg">{t('home.howItWorks.desc')}</p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[264px] left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10"
            >
              {dsHowItWorks.map((item: any, index: number) => {
                const rawIcon = howItWorksIcons[index] || howItWorksIcons[0];
                const Icon = getIcon(item.iconName, rawIcon);
                const images = [
                  'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                  'https://images.unsplash.com/photo-1519003722824-194d4455aeb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                  'https://images.unsplash.com/photo-1580674292641-8e01768651c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                ];
                return (
                  <motion.div variants={fadeInUp} key={index} className="relative text-center group flex flex-col items-center">
                    <div className="w-full h-40 md:h-48 mb-8 rounded-2xl overflow-hidden shadow-md relative">
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                      <img src={item.imageUrl || images[index]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="w-20 h-20 mx-auto bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-xl mb-6 relative z-10 group-hover:border-amber-100 transition-colors duration-300">
                      <div className="absolute top-0 end-0 w-6 h-6 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center font-black text-sm -mt-1 -me-1 shadow-md">
                        {index + 1}
                      </div>
                      <Icon className="w-8 h-8 text-slate-700 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{t('home.faqSect.title')}</h2>
            <p className="text-slate-600 text-lg">{t('home.faqSect.desc')}</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {dsFaqs.map((faq: any, index: number) => (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                key={index} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-start focus:outline-none"
                >
                  <span className="font-bold text-lg text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-amber-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-slate-600 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] end-[-5%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] start-[-5%] w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-2xl mb-6 shadow-inner">
              <Quote className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">{t('home.reviews.title1')} <span className="text-amber-500">{t('home.reviews.title2')}</span></h2>
            <p className="text-slate-600 text-lg">{t('home.reviews.desc')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
            {(apiData.testimonials.length > 0 ? apiData.testimonials.slice(0, 3) : [
              { name_ar: 'سالم المطيري', name_en: 'Salem Al-Mutairi', role_ar: 'مدير سلسلة مطاعم', role_en: 'Restaurant Chain Manager', text_ar: 'نتعامل مع ركن الريان منذ عام لتوزيع منتجاتنا المجمدة. التزام دقيق بدرجات الحرارة ومواعيد التسليم، لم نواجه أي تلف في البضائع.', text_en: 'We have been dealing with Rokn Elryan for a year to distribute our frozen products. Strict adherence to temperatures and delivery times.', rating: 5 },
              { name_ar: 'عبدالله خالد', name_en: 'Abdullah Khalid', role_ar: 'مصنع أغذية - جدة', role_en: 'Food Factory - Jeddah', text_ar: 'شاحنات نظيفة ومجهزة بأحدث أجهزة التبريد. أسعار العقود الشهرية ممتازة وتوفر علينا الكثير من الجهد في إدارة الخدمات اللوجستية.', text_en: 'Clean trucks equipped with the latest cooling devices. Monthly contract prices are excellent and save us a lot of effort.', rating: 5  },
              { name_ar: 'مؤسسة الدواء', name_en: 'Al-Dawaa Est.', role_ar: 'قطاع الأدوية', role_en: 'Pharmaceutical Sector', text_ar: 'نقل الأدوية يتطلب دقة عالية في درجات الحرارة (+4 مئوية). ركن الريان أثبتوا جدارتهم واحترافيتهم العالية في هذا المجال. شكراً لفريقكم.', text_en: 'Transporting medicines requires high accuracy in temperatures (+4°C). Rokn Elryan proved their high professionalism in this field.', rating: 5  },
            ]).map((review, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-full"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
                  whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
                  className="bg-white p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 relative group cursor-pointer h-full flex flex-col justify-between overflow-hidden"
                >
                  <Quote className="absolute top-6 start-6 w-24 h-24 text-slate-50 opacity-60 group-hover:text-amber-50 group-hover:scale-110 transition-all duration-500 z-0" />
                  
                  <div className="relative z-10">
                    <div className="flex gap-1 mb-6">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + (i * 0.1) }}
                        >
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed mb-8 italic relative z-10">
                      "{review[`text_${i18n.language}` as 'text_ar'|'text_en'] || review.text_ar}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 relative z-10 border-t border-slate-100 pt-6 mt-auto">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center border-2 border-amber-100">
                      <span className="text-amber-600 font-bold text-xl uppercase">{(review[`name_${i18n.language}` as 'name_ar'|'name_en'] || review.name_ar)[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{review[`name_${i18n.language}` as 'name_ar'|'name_en'] || review.name_ar}</h4>
                      <p className="text-amber-500 flex items-center gap-1 text-sm font-semibold mt-1">
                        <MapPin className="w-4 h-4" />
                        {review[`role_${i18n.language}` as 'role_ar'|'role_en'] || review.role_ar}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      {apiData.articles && apiData.articles.length > 0 && (
        <section className="py-24 bg-slate-900 border-t border-slate-800 relative z-10">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                {i18n.language === 'en' ? 'Articles & Tips' : 'مقالات ونصائح حول نقل العفش'}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {i18n.language === 'en' ? 'We are distinguished by several features that make us the optimal choice for furniture moving, thanks to our experience and skill in providing high-quality services.' : 'نتميز بعدة مميزات تجعلنا الخيار الأمثل لنقل العفش، وذلك بفضل خبرتنا ومهارتنا وتفانينا في تقديم خدمة عالية الجودة للعملاء الذين يرغبون في نقل أثاثهم بأمان وسهولة.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
              {apiData.articles.map((article: any, idx: number) => (
                <motion.div 
                  key={article.id || idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col group border border-slate-200 h-full"
                >
                  {/* Image & Category */}
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={article.image ? (article.image.startsWith('/') ? article.image : article.image) : 'https://images.unsplash.com/photo-1519003722824-194d4455aeb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt={article[`title_${i18n.language}`] || article.title_ar} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    {article.category && (
                      <div className="absolute top-4 start-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {article.category}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 md:p-8 flex-grow flex flex-col">
                    <h3 className="font-bold text-xl text-slate-900 mb-4 line-clamp-2 leading-tight">
                      {article[`title_${i18n.language}`] || article.title_ar}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
                      {article[`content_${i18n.language}`] ? article[`content_${i18n.language}`].replace(/<[^>]+>/g, '').substring(0, 150) + '...' : (article.content_ar ? article.content_ar.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '')}
                    </p>
                    
                    <div className="mt-auto flex justify-center items-center w-full">
                      <Link to={`/${i18n.language === 'en' ? 'en/blog' : 'blog'}/${article.slug || article.id}`} className="text-amber-500 font-bold hover:text-amber-600 transition-colors text-center pb-2">
                        {i18n.language === 'en' ? 'Read More' : 'المزيد'}
                      </Link>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-center gap-4 text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.created_at || Date.now()).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {i18n.language === 'en' ? 'No Comments' : 'لا توجد تعليقات'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-20 bg-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            {(() => {
              const ctaMeta = (apiData.settings as any)?.ctaMeta || {};
              const title = ctaMeta[`title_${i18n.language}`] || t('home.cta.title');
              const desc = ctaMeta[`desc_${i18n.language}`] || t('home.cta.desc');
              const btn1 = ctaMeta[`btn1_${i18n.language}`] || t('home.cta.bookBtn');
              const btn2 = ctaMeta[`btn2_${i18n.language}`] || t('home.cta.waBtn');
              return (
                <>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">{title}</h2>
                  <p className="text-xl text-slate-800 mb-10 font-medium">
                    {desc}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/contact" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
                      {btn1}
                    </Link>
                    <a href={`https://wa.me/${apiData.contact?.whatsapp || ''}`} target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-xl shadow-white/20 flex items-center justify-center gap-2">
                      {btn2}
                    </a>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </div>
      </section>
    </>
  );
}
