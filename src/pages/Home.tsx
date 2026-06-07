import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, Truck, Wrench, Package, Clock, ThumbsUp, Users, Star, Calculator, ChevronDown, Quote, Award, CheckCircle2, MapPin, ArrowRightLeft, Plus, Minus, Calendar, MessageCircle, Snowflake, ThermometerSnowflake, Wind, Thermometer, FileText, Download, Activity } from 'lucide-react';
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
  const [isHoliday, setIsHoliday] = useState(false);
  const [estimate, setEstimate] = useState<number>(0);
  const [breakdown, setBreakdown] = useState({ baseTruck: 0, distanceFee: 0, temp: 0, holiday: 0, isLocal: false, isCustom: false });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [estimatorImgIndex, setEstimatorImgIndex] = useState(0);

  // Dynamic API state
  const [apiData, setApiData] = useState({
    hero: { title1_ar: '', title1_en: '', title2_ar: '', title2_en: '', desc_ar: '', desc_en: '', images: [] },
    services: [] as any[],
    testimonials: [] as any[],
    partners: [] as any[],
    faqs: [] as any[],
    content: null as any,
    estimator: { title_ar: '', title_en: '', desc_ar: '', desc_en: '', image: '', images: [] as string[] },
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

  const estimatorImages = apiData.estimator?.images?.length > 0 
    ? apiData.estimator.images 
    : (apiData.estimator?.image ? [apiData.estimator.image] : ["https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const [settingsRes, servicesRes, testimonialsRes, partnersRes, faqsRes, articlesRes] = await Promise.all([
          fetch(`${API_URL}/api/settings`).then(r => r.json()),
          fetch(`${API_URL}/api/services`).then(r => r.json()),
          fetch(`${API_URL}/api/testimonials`).then(r => r.json()),
          fetch(`${API_URL}/api/partners`).then(r => r.json()),
          fetch(`${API_URL}/api/faqs`).then(r => r.json()),
          fetch(`${API_URL}/api/articles`).then(r => r.json())
        ]);
        setApiData({
          hero: settingsRes.hero || apiData.hero,
          estimator: settingsRes.estimator || apiData.estimator,
          content: settingsRes.content || null,
          services: servicesRes.slice(0, 4), // Show top 4 for a 2x2 grid
          testimonials: testimonialsRes,
          faqs: faqsRes,
          partners: partnersRes,
          articles: Array.isArray(articlesRes) ? (articlesRes.filter((a: any) => a.is_featured).length > 0 ? articlesRes.filter((a: any) => a.is_featured).slice(0, 3) : articlesRes.slice(0, 3)) : [],
          citiesMeta: settingsRes.citiesMeta || null,
          pagesMeta: settingsRes.pagesMeta || null,
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

  useEffect(() => {
    if (estimatorImages.length <= 1) return;
    const timer = setInterval(() => {
      setEstimatorImgIndex((prev) => (prev + 1) % estimatorImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [estimatorImages.length]);

  let dsCities: { value: string; label: string }[] = [];
  
  // Extract unique cities from unified custom routes table
  const customRoutes = apiData.estimator?.custom_routes || [];
  const citySet = new Set<string>();
  customRoutes.forEach((r: any) => {
    if (r.from && r.from.trim()) citySet.add(r.from.trim());
    if (r.to && r.to.trim()) citySet.add(r.to.trim());
  });
  
  if (citySet.size > 0) {
    dsCities = Array.from(citySet).map(c => ({ value: c, label: c }));
  } else {
    const fallback = ['أبها', 'خميس مشيط', 'الرياض', 'جدة', 'الدمام'];
    dsCities = fallback.map(c => ({ value: c, label: c }));
  }

  useEffect(() => {
    const estState = apiData.estimator;
    if (!estState || !dsCities || dsCities.length === 0) return;
    
    const validValues = dsCities.map(c => c.value);
    // Auto-select valid cities if current state is not in the list
    if (!validValues.includes(fromCity) && validValues[0]) setFromCity(validValues[0]);
    if (!validValues.includes(toCity) && validValues.length > 1) setToCity(validValues[1] || validValues[0]);
    const isLocal = fromCity === toCity;

    const customRoutes = estState.custom_routes || [];
    const customRoute = customRoutes.find((r: any) => 
      (r.from === fromCity && r.to === toCity) || (r.from === toCity && r.to === fromCity)
    );

    let baseTruck = 0;
    let tempCost = 0;
    let isCustom = false;

    if (customRoute) {
      isCustom = true;
      if (truckType === 'شاحنة صغيرة') {
        baseTruck = customRoute.small ?? 0;
        if (tempType === 'تجميد') tempCost = customRoute.small_freezing ?? 0;
        else if (tempType === 'تبريد') tempCost = customRoute.small_cooling ?? 0;
      }
      else if (truckType === 'جامبو') {
        baseTruck = customRoute.jumbo ?? 0;
        if (tempType === 'تجميد') tempCost = customRoute.jumbo_freezing ?? 0;
        else if (tempType === 'تبريد') tempCost = customRoute.jumbo_cooling ?? 0;
      }
      else {
        baseTruck = customRoute.large ?? 0;
        if (tempType === 'تجميد') tempCost = customRoute.large_freezing ?? 0;
        else if (tempType === 'تبريد') tempCost = customRoute.large_cooling ?? 0;
      }
    }

    const tripTotalBase = baseTruck;
    let holidayCost = isHoliday && tripTotalBase > 0 ? Math.round(tripTotalBase * (estState.holiday_percent ?? 5) / 100) : 0;

    setBreakdown({ baseTruck, distanceFee: 0, temp: tempCost, holiday: holidayCost, isLocal: false, isCustom });
    setEstimate(baseTruck + tempCost + holidayCost);
  }, [fromCity, toCity, truckType, tempType, isHoliday, apiData.estimator, dsCities]);

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": dsFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <SEO title={`${homeTitle} | ${isEn ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد'}`} description={homeDesc} schema={[localBusinessSchema, faqSchema]} />
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-950">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={heroIndex}
              src={heroImages[heroIndex]}
              alt="Hero Background"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-900/30"></div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === heroIndex ? 'bg-amber-500 w-12' : 'bg-white/30 hover:bg-white/60 w-3'}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-16">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl text-white"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-black leading-[1.15] mb-8 tracking-tight drop-shadow-2xl">
              {isEn ? 'Refrigerated Transport for Food and Pharmaceuticals Across Saudi Arabia.' : 'نقل مبرد للأغذية والأدوية في جميع أنحاء المملكة العربية السعودية.'}
            </motion.h1>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 md:gap-4 mb-10">
              {[
                { icon: CheckCircle2, text: isEn ? '5000+ Successful Deliveries' : '5000+ رحلة نقل ناجحة' },
                { icon: Activity, text: isEn ? '24/7 Monitoring' : 'مراقبة حية 24/7' },
                { icon: ThermometerSnowflake, text: isEn ? 'Temperature Controlled Fleet' : 'أسطول بتحكم حراري كامل' },
                { icon: MapPin, text: isEn ? 'Nationwide Coverage' : 'تغطية لجميع أنحاء المملكة' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-slate-900/60 backdrop-blur-md px-5 py-3 rounded-full border border-slate-700/60 shadow-xl">
                  <item.icon className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="font-bold text-white text-base md:text-lg">{item.text}</span>
                </div>
              ))}
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl leading-relaxed font-semibold drop-shadow-lg">
              {apiData.hero[`desc_${i18n.language}` as keyof typeof apiData.hero] || (isEn ? 'Premium cold chain logistics ensuring the safety and quality of your sensitive cargo from pickup to delivery.' : 'لوجستيات سلسلة تبريد متميزة لضمان سلامة وجودة شحناتك الحساسة من الاستلام وحتى التسليم.')}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row flex-wrap gap-5">
              <Link to={isEn ? '/en/contact' : '/contact'} className="flex items-center justify-center gap-3 bg-amber-500 text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-amber-400 transition-all shadow-[0_15px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.4)] hover:-translate-y-1">
                {isEn ? 'Request a Quote' : 'اطلب تسعيرة الآن'}
                <Truck className="w-6 h-6" />
              </Link>
              <a href={`https://wa.me/${apiData.contact?.whatsapp || ''}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-slate-800/80 text-white border border-slate-700/80 backdrop-blur-md px-10 py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1">
                <MessageCircle className="w-6 h-6 text-green-400" />
                {isEn ? 'WhatsApp Contact' : 'التواصل عبر واتساب'}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Metrics Section (Replaces generic partners carousel) */}
      <section className="py-16 md:py-24 bg-amber-500 relative overflow-hidden">
        {/* Background Texture & Glow */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-400/30 to-amber-600/30"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 lg:gap-8 lg:divide-x lg:divide-slate-900/20" dir="ltr">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center px-4"
              dir={isEn ? 'ltr' : 'rtl'}
            >
              <Truck className="w-12 h-12 md:w-16 md:h-16 text-slate-900 mb-4 opacity-90 drop-shadow-sm" />
              <div className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-2 tracking-tighter drop-shadow-md">5000+</div>
              <div className="text-slate-800 font-black text-sm md:text-lg uppercase tracking-widest">{isEn ? 'Deliveries' : 'رحلة ناجحة'}</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center text-center px-4"
              dir={isEn ? 'ltr' : 'rtl'}
            >
              <Users className="w-12 h-12 md:w-16 md:h-16 text-slate-900 mb-4 opacity-90 drop-shadow-sm" />
              <div className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-2 tracking-tighter drop-shadow-md">300+</div>
              <div className="text-slate-800 font-black text-sm md:text-lg uppercase tracking-widest">{isEn ? 'Business Clients' : 'عميل تجاري'}</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center text-center px-4"
              dir={isEn ? 'ltr' : 'rtl'}
            >
              <Award className="w-12 h-12 md:w-16 md:h-16 text-slate-900 mb-4 opacity-90 drop-shadow-sm" />
              <div className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-2 tracking-tighter drop-shadow-md">15+</div>
              <div className="text-slate-800 font-black text-sm md:text-lg uppercase tracking-widest">{isEn ? 'Years Experience' : 'عاماً من الخبرة'}</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col items-center text-center px-4"
              dir={isEn ? 'ltr' : 'rtl'}
            >
              <Activity className="w-12 h-12 md:w-16 md:h-16 text-slate-900 mb-4 opacity-90 drop-shadow-sm" />
              <div className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-2 tracking-tighter drop-shadow-md">24/7</div>
              <div className="text-slate-800 font-black text-sm md:text-lg uppercase tracking-widest">{isEn ? 'Monitoring' : 'مراقبة حية'}</div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Partners & Clients Section */}
      {apiData.settings?.general?.partners_enabled !== false && (
      <section className="py-20 bg-white border-b border-slate-100 overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-3">
              {apiData.pagesMeta?.homePartners?.[`title_${i18n.language}`] || (isEn ? 'Trusted By Industry Leaders' : 'نعتز بثقة شركائنا في مختلف القطاعات')}
            </h3>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 px-4 max-w-6xl mx-auto" dir="ltr">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group flex items-center justify-center p-6 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300 ease-out h-28 md:h-32 ${idx === 4 ? 'col-span-2 lg:col-span-1 max-w-xs mx-auto lg:max-w-none' : ''}`}
              >
                {partner.image_url ? (
                  <img src={partner.image_url.startsWith('/') ? partner.image_url : partner.image_url} alt={partner.name} className="h-10 md:h-14 w-auto grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 object-contain" />
                ) : Icon ? (
                  <Icon 
                    className="h-10 md:h-14 w-auto grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                    style={{ '--hover-color': partner.color, color: 'currentColor' } as React.CSSProperties}
                  />
                ) : null}
              </motion.div>
            )})}
          </div>
        </div>
      </section>
      )}

      {/* Industries We Serve Section */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-50"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block py-2 px-5 rounded-full bg-blue-100 text-blue-800 font-black text-sm mb-6 shadow-sm">
              {i18n.language === 'en' ? 'Our Focus' : 'نطاق تخصصنا'}
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              {apiData.pagesMeta?.industries?.[`title_${i18n.language}`] || (i18n.language === 'en' ? 'Industries We Serve' : 'قطاعات الأعمال التي نخدمها')}
            </h2>
            <p className="text-slate-600 text-xl md:text-2xl font-medium leading-relaxed">
              {apiData.pagesMeta?.industries?.[`desc_${i18n.language}`] || (i18n.language === 'en' ? 'We provide specialized cold chain logistics tailored to the unique requirements of various B2B sectors in Saudi Arabia.' : 'نقدم حلول نقل لوجستية مبردة مصممة خصيصاً لتلبية المعايير الصارمة لمختلف قطاعات الأعمال في المملكة.')}
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
            {(apiData.pagesMeta?.industries?.items?.length > 0 ? apiData.pagesMeta.industries.items : [
              { icon: '🍔', badge_ar: 'قطاع التجزئة', badge_en: 'Retail Sector', title_ar: 'الأغذية والسلع الاستهلاكية', title_en: 'FMCG & Food', desc_ar: 'الحفاظ على نضارة وجودة المنتجات لأسواق التجزئة من خلال تبريد دقيق.', desc_en: 'Maintaining freshness for grocery chains with precise cooling.' },
              { icon: '💊', badge_ar: 'القطاع الطبي', badge_en: 'Medical Sector', title_ar: 'الأدوية والمستلزمات الطبية', title_en: 'Pharmaceuticals', desc_ar: 'نقل مطابق لاشتراطات هيئة الغذاء والدواء بمدى (+4°C إلى +8°C).', desc_en: 'SFDA compliant transport (+4°C to +8°C) for sensitive medical supplies.' },
              { icon: '🥩', badge_ar: 'التصنيع الغذائي', badge_en: 'Food Manufacturing', title_ar: 'اللحوم والدواجن', title_en: 'Meat & Poultry', desc_ar: 'تجميد عميق يصل إلى -18°C لضمان سلامة اللحوم والمجمدات.', desc_en: 'Deep freezing down to -18°C ensuring the safety of meat and poultry.' },
              { icon: '🏨', badge_ar: 'قطاع الضيافة', badge_en: 'Hospitality', title_ar: 'المطاعم والإعاشة', title_en: 'Restaurants & Catering', desc_ar: 'توزيع يومي مجدول وموثوق لقطاع المطاعم، الفنادق، وخدمات الإعاشة.', desc_en: 'Scheduled daily reliable distribution for restaurants and catering services.' }
            ]).map((industry: any, i: number) => {
              
              const defaultBadgesAr = ['قطاع التجزئة', 'القطاع الطبي', 'التصنيع الغذائي', 'قطاع الضيافة'];
              const defaultBadgesEn = ['Retail Sector', 'Medical Sector', 'Food Manufacturing', 'Hospitality'];
              const badgeText = industry[`badge_${i18n.language}`] || (i18n.language === 'en' ? defaultBadgesEn[i % 4] : defaultBadgesAr[i % 4]);
              
              return (
              <div key={i} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-500 overflow-hidden group flex flex-col h-full border border-slate-100">
                {industry.icon && (industry.icon.startsWith('http') || industry.icon.startsWith('/')) ? (
                  <div className="w-full h-72 md:h-80 overflow-hidden relative">
                    <div className="absolute top-6 start-6 z-20">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg border border-white/10 uppercase tracking-wide">
                        {badgeText}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10 duration-500"></div>
                    <img src={industry.icon} alt={industry.title_ar} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                ) : (
                  <div className="w-full h-72 md:h-80 bg-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-amber-50 transition-colors duration-500">
                    <div className="absolute top-6 start-6 z-20">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg border border-white/10 uppercase tracking-wide">
                        {badgeText}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlN2U1ZTQiLz48L3N2Zz4=')] opacity-50"></div>
                    <div className="text-8xl md:text-9xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 drop-shadow-md relative z-10">{industry.icon}</div>
                  </div>
                )}
                <div className="p-10 text-start flex-1 flex flex-col relative bg-white">
                  {/* Decorative line that expands on hover */}
                  <div className="absolute top-0 start-10 w-12 h-1.5 bg-amber-500 rounded-b-full transition-all duration-500 group-hover:w-24 group-hover:bg-amber-400"></div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-5 mt-2">{industry[`title_${i18n.language}`] || (i18n.language === 'en' ? industry.title_en : industry.title_ar)}</h3>
                  <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed flex-1">{industry[`desc_${i18n.language}`] || (i18n.language === 'en' ? industry.desc_en : industry.desc_ar)}</p>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Services Summary Section */}
      <section className="py-24 md:py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[150px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8"
          >
            <div className="max-w-3xl">
              <span className="inline-block py-2 px-5 rounded-full bg-slate-800 text-amber-400 font-bold text-sm mb-6 border border-slate-700 shadow-sm uppercase tracking-wider">
                {i18n.language === 'en' ? 'Enterprise Services' : 'خدماتنا اللوجستية'}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                {apiData.pagesMeta?.homeServices?.[`title_${i18n.language}`] || t('home.services.title')}
              </h2>
              <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed">
                {apiData.pagesMeta?.homeServices?.[`desc_${i18n.language}`] || t('home.services.desc')}
              </p>
            </div>
            <Link to="/services" className="hidden md:flex bg-amber-500 text-slate-900 font-black px-10 py-5 rounded-xl hover:bg-amber-400 transition-all items-center gap-3 group shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:-translate-y-1 text-lg">
              {t('home.services.viewAll')}
              <Truck className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {(apiData.services.length > 0 ? apiData.services : serviceItems.slice(0, 4).map((s, i) => ({ ...s, icon: ['Truck','ThermometerSnowflake','Wind','MapPin'][i]}))).map((service, index) => {
              const iconMap: any = { Truck, ThermometerSnowflake, Wind, ShieldCheck, MapPin, Clock, Home };
              const Icon = iconMap[service.icon] || Truck;
              const title = apiData.services.length > 0 ? service[`title_${i18n.language}` as keyof typeof service] : service.title;
              const desc = apiData.services.length > 0 ? service[`desc_${i18n.language}` as keyof typeof service] : service.desc;
              
              return (
                <motion.div variants={fadeInUp} key={index} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/60 rounded-3xl hover:bg-slate-800 hover:border-amber-500/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-500 overflow-hidden group flex flex-col">
                  
                  {/* Image Top */}
                  <div className="w-full bg-slate-900 relative overflow-hidden h-64 md:h-80 border-b border-slate-700/50">
                    <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img 
                      src={service.images && service.images.length > 0 ? (service.images[0].startsWith('/') ? service.images[0] : service.images[0]) : [
                        'https://images.unsplash.com/photo-1580674292641-8e01768651c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1519003722824-194d4455aeb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                      ][index % 4]} 
                      alt={title} 
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Floating Icon over Image */}
                    <div className="absolute top-6 end-6 z-20 w-14 h-14 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-700 flex items-center justify-center shadow-xl group-hover:bg-amber-500 group-hover:border-amber-400 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-amber-500 group-hover:text-slate-900 transition-colors duration-300" />
                    </div>
                  </div>
                  
                  {/* Content Bottom */}
                  <div className="p-8 md:p-10 flex flex-col flex-1 relative">
                    <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-amber-400 transition-colors mb-4">{title}</h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium mb-8 flex-1">{desc}</p>
                    
                    {/* Trust Labels / Benefits */}
                    <div className="flex flex-wrap gap-2.5 mt-auto pt-6 border-t border-slate-700/50">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700 group-hover:border-slate-600 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {isEn ? 'Real-time Tracking' : 'تتبع لحظي'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700 group-hover:border-slate-600 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {isEn ? 'Temp Control' : 'تحكم حراري'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700 group-hover:border-slate-600 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {isEn ? 'Secure' : 'أمان عالي'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          <div className="mt-12 text-center md:hidden">
            <Link to="/services" className="inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-amber-400 transition-colors shadow-lg w-full text-lg">
              {t('home.services.viewAll')}
              <Truck className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Cost Estimator Section */}
      {apiData.estimator?.enabled !== false && (
        <section className="py-24 relative overflow-hidden bg-slate-50">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/40 to-amber-50/40"></div>
          </div>
          
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:w-5/12 flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm text-blue-600 px-5 py-2 rounded-full text-sm font-bold mb-6">
                <Calculator className="w-4 h-4 text-amber-500" />
                {t('home.estimator.badge')}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 mb-6 leading-tight">
                {apiData.estimator[`title_${i18n.language}` as keyof typeof apiData.estimator] || t('home.estimator.title')}
              </h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                {apiData.estimator[`desc_${i18n.language}` as keyof typeof apiData.estimator] || t('home.estimator.desc')}
              </p>
              
              <div className="bg-white/80 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 relative">
                  <div className="w-full relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('home.estimator.fromCity')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                        <MapPin className="w-6 h-6 text-slate-400" />
                      </div>
                      <SearchableSelect 
                        value={fromCity} 
                        onChange={setFromCity} 
                        options={dsCities}
                        placeholder={t('home.estimator.fromCity')}
                        className="w-full ps-12 pe-4 py-5 text-lg rounded-2xl border border-slate-200 hover:border-amber-500 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white font-semibold text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 mt-6 sm:mt-0 z-10 hidden sm:flex">
                    <button onClick={handleSwapCities} className="w-14 h-14 bg-white hover:bg-slate-100 mt-6 rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors tooltip" aria-label="Swap Cities">
                      <ArrowRightLeft className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-shrink-0 z-10 flex sm:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1">
                    <button onClick={handleSwapCities} className="w-12 h-12 bg-white hover:bg-slate-100 rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors">
                      <ArrowRightLeft className="w-5 h-5 rotate-90" />
                    </button>
                  </div>

                  <div className="w-full relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('home.estimator.toCity')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                        <MapPin className="w-6 h-6 text-slate-400" />
                      </div>
                      <SearchableSelect 
                        value={toCity} 
                        onChange={setToCity} 
                        options={dsCities}
                        placeholder={t('home.estimator.toCity')}
                        className="w-full ps-12 pe-4 py-5 text-lg rounded-2xl border border-slate-200 hover:border-amber-500 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-white font-semibold text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8 flex flex-col gap-8">
                  <div>
                    <label className="block text-base font-black text-slate-800 mb-4">{i18n.language === 'en' ? 'Truck Size' : 'حجم الشاحنة'}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['شاحنة صغيرة', 'جامبو', 'تريلا'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setTruckType(type)}
                          className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl border transition-all ${truckType === type ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-xl scale-[1.03]' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:bg-amber-50/80 shadow-sm'}`}
                        >
                          {type === 'شاحنة صغيرة' ? <Package className={`w-8 h-8 ${truckType === type ? 'text-slate-900' : 'text-slate-400'}`} /> : <Truck className={`w-8 h-8 ${truckType === type ? 'text-slate-900' : 'text-slate-400'}`} />}
                          <span className="text-base font-bold">{i18n.language === 'en' ? (type === 'شاحنة صغيرة' ? 'Small' : type === 'جامبو' ? 'Jumbo' : 'Trailer') : type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-black text-slate-800 mb-4">{i18n.language === 'en' ? 'Temperature' : 'درجة الحرارة'}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['تجميد', 'تبريد', 'جاف'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setTempType(type)}
                          className={`flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-2xl border transition-all ${tempType === type ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-[1.03]' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50/80 shadow-sm'}`}
                        >
                          {type === 'تجميد' ? <Snowflake className={`w-8 h-8 ${tempType === type ? 'text-white' : 'text-slate-400'}`} /> : type === 'تبريد' ? <ThermometerSnowflake className={`w-8 h-8 ${tempType === type ? 'text-white' : 'text-slate-400'}`} /> : <Wind className={`w-8 h-8 ${tempType === type ? 'text-white' : 'text-slate-400'}`} />}
                          <span className="text-base font-bold">{i18n.language === 'en' ? (type === 'تجميد' ? 'Frozen' : type === 'تبريد' ? 'Chilled' : 'Dry') : type}</span>
                          <span className={`text-xs font-bold tracking-wide mt-1 px-3 py-1 rounded-full ${tempType === type ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                            {type === 'تجميد' ? '< -18°C' : type === 'تبريد' ? '2°C - 8°C' : 'Ambient'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors bg-slate-50">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={isHoliday} 
                        onChange={(e) => setIsHoliday(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {i18n.language === 'en' ? 'Transport during Weekend/Holiday' : 'موعد النقل يوافق عطلة نهاية الأسبوع أو موسم'}
                    </span>
                  </label>
                </div>

                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {i18n.language === 'en' ? 'Service covers all Saudi cities.' : 'التغطية تشمل جميع مدن المملكة.'}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {i18n.language === 'en' ? 'Guaranteed temperature control.' : 'ضمان التحكم بدرجات الحرارة وتقارير الشحنة.'}
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-6 md:p-8 rounded-2xl text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="mb-6 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-amber-200/50 space-y-3 text-start relative z-10 shadow-sm">
                    {breakdown.baseTruck > 0 ? (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-700 font-bold flex items-center gap-2">
                            <Truck className="w-4 h-4 text-amber-500" />
                            {isEn ? 'Truck Base Cost' : 'تكلفة الشاحنة'}
                            <span className={`px-2 py-0.5 rounded text-xs ms-1 ${breakdown.isCustom ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                              {breakdown.isCustom ? (isEn ? 'Custom Route' : 'مسار مخصص') : truckType}
                            </span>
                          </span>
                          <span className="font-bold text-slate-800" dir="ltr">{breakdown.baseTruck} SAR</span>
                        </div>
                        
                        {breakdown.temp > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-700 font-bold flex items-center gap-2">
                              <ThermometerSnowflake className="w-4 h-4 text-blue-500" />
                              {isEn ? 'Temperature Control' : 'تحكم درجة الحرارة'}
                            </span>
                            <span className="font-bold text-slate-800" dir="ltr">+{breakdown.temp} SAR</span>
                          </div>
                        )}

                        {breakdown.holiday > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-700 font-bold flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-amber-500" />
                              {isEn ? 'Weekend/Holiday Extra' : 'إضافة عطلة/موسم'}
                            </span>
                            <span className="font-bold text-slate-800" dir="ltr">+{breakdown.holiday} SAR</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm font-bold text-slate-700">{isEn ? 'Custom pricing required for this route.' : 'التسعيرة غير متوفرة حالياً لهذا المسار.'}</p>
                        <p className="text-xs text-slate-500 mt-1">{isEn ? 'Please contact us for an accurate quote.' : 'يرجى التواصل معنا للحصول على تسعيرة دقيقة.'}</p>
                      </div>
                    )}
                  </div>

                  {estimate > 0 ? (
                    <>
                      <div className="text-sm text-amber-800 font-bold mb-3 relative z-10">{t('home.estimator.estimateStart')}</div>
                      <div className="text-5xl md:text-6xl font-black text-amber-600 mb-4 relative z-10 drop-shadow-sm tracking-tight" dir="ltr">
                        <AnimatedCounter end={estimate} /> <span className="text-xl md:text-2xl font-bold">{t('home.estimator.currency')}</span>
                      </div>
                      <p className="text-sm text-amber-700/80 max-w-sm mx-auto relative z-10 font-medium mb-6">{isEn ? 'This is an estimated price for refrigerated transport and is subject to negotiation.' : 'السعر يشمل تكاليف النقل المبرد ويعتبر سعراً تقريبياً وقابلاً للتفاوض.'}</p>
                      
                      <div className="relative z-10">
                        <a href={`https://wa.me/${apiData.contact?.whatsapp || ''}?text=${encodeURIComponent(`مرحباً، أود حجز ${truckType} تبريد (${tempType}) من ${fromCity} إلى ${toCity}. التكلفة التقريبية: ${estimate} ريال.\n\nاسم الشركة: \nقطاع العمل: \n\nطلب تسعيرة رسمية للشركات.`)}`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-3 bg-slate-900 text-white font-black px-8 py-5 text-lg rounded-2xl hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                          <span className="relative flex h-3 w-3 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                          {isEn ? 'Book & Confirm Now' : 'حجز وتأكيد الشحنة الآن'}
                          <MessageCircle className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                        </a>
                        <p className="text-xs font-bold text-amber-800 mt-3 text-center opacity-80 flex items-center justify-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {isEn ? 'Estimated response time: 5 minutes' : 'زمن الاستجابة المتوقع: 5 دقائق'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="py-2 mb-4 text-center relative z-10">
                      <a href={`https://wa.me/${apiData.contact?.whatsapp || ''}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن تسعيرة النقل بـ ${truckType} تبريد (${tempType}) من ${fromCity} إلى ${toCity}.`)}`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-3 bg-slate-900 text-white font-black px-8 py-5 text-lg rounded-2xl hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <MessageCircle className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                        {isEn ? 'Contact on WhatsApp for Quote' : 'تواصل عبر واتساب لطلب تسعيرة'}
                      </a>
                      <p className="text-xs font-bold text-amber-800 mt-3 flex items-center justify-center gap-1.5 opacity-80">
                        <Clock className="w-3.5 h-3.5" />
                        {isEn ? 'Estimated response time: 5 minutes' : 'زمن الاستجابة المتوقع: 5 دقائق'}
                      </p>
                    </div>
                  )}
                </motion.div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:w-7/12 relative min-h-[400px] lg:min-h-full"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-300/20 to-blue-300/20 rounded-[3rem] blur-2xl opacity-70"></div>
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 group/slider">
                <AnimatePresence mode="wait">
                <motion.img 
                  key={estimatorImgIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  src={estimatorImages[estimatorImgIndex] || estimatorImages[0] || "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                  alt="Cost Estimator" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {estimatorImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setEstimatorImgIndex((prev) => (prev - 1 + estimatorImages.length) % estimatorImages.length)}
                    className="absolute top-1/2 -translate-y-1/2 start-4 w-10 h-10 bg-white/20 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-slate-900 transition-all opacity-0 group-hover/slider:opacity-100 shadow-sm"
                    aria-label="Previous slide"
                  >
                    <ArrowRightLeft className="w-5 h-5 rotate-180 rtl:rotate-0" />
                  </button>
                  <button 
                    onClick={() => setEstimatorImgIndex((prev) => (prev + 1) % estimatorImages.length)}
                    className="absolute top-1/2 -translate-y-1/2 end-4 w-10 h-10 bg-white/20 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-slate-900 transition-all opacity-0 group-hover/slider:opacity-100 shadow-sm"
                    aria-label="Next slide"
                  >
                    <ArrowRightLeft className="w-5 h-5 rtl:rotate-180" />
                  </button>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full">
                    {estimatorImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setEstimatorImgIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === estimatorImgIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/60 hover:bg-white'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
              </div>
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
                    <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight drop-shadow-md">
                      {restTitle} {lastWord && <span className="text-amber-500">{lastWord}</span>}
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-slate-300 text-xl md:text-2xl mb-12 leading-relaxed font-medium">
                      {wDesc}
                    </motion.p>
                  </>
                );
              })()}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {dsWhyUs.map((feature: any, index: number) => {
                  const rawIcon = whyUsIcons[index] || whyUsIcons[0];
                  const Icon = getIcon(feature.iconName, rawIcon);
                  return (
                    <motion.div variants={fadeInUp} key={index} className="flex gap-5 text-start group">
                      <div className="flex-shrink-0 w-16 h-16 bg-white/5 group-hover:bg-amber-500/10 border border-white/10 group-hover:border-amber-500/30 rounded-xl flex items-center justify-center transition-colors shadow-lg">
                        <Icon className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl md:text-2xl mb-2 text-white">{feature.title}</h4>
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed">{feature.desc}</p>
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
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                      
                      <div className="absolute top-6 start-6">
                        <div className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-full border border-emerald-400/50 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                          </span>
                          {i18n.language === 'en' ? '24/7 Operations Active' : 'العمليات نشطة 24/7'}
                        </div>
                      </div>

                      <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-2xl border border-white/20 p-5 md:p-8 rounded-2xl transition-all duration-300 group shadow-[0_8px_30px_rgb(0,0,0,0.3)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/30 transition-colors"></div>
                            <div className="relative z-10 flex flex-col items-start">
                              <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                              <div className="text-4xl md:text-6xl font-black text-white drop-shadow-md mb-1" dir="ltr">
                                <AnimatedCounter end={stat1Num} prefix="+" />
                              </div>
                              <div className="text-base md:text-xl font-bold text-amber-400">{stat1Text}</div>
                              <div className="text-xs md:text-sm text-slate-300 mt-2 font-medium hidden md:block opacity-80 leading-relaxed">
                                {i18n.language === 'en' ? 'Proven track record of excellence in logistics' : 'سجل حافل بالتميز والموثوقية في القطاع اللوجستي'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-2xl border border-white/20 p-5 md:p-8 rounded-2xl transition-all duration-300 group shadow-[0_8px_30px_rgb(0,0,0,0.3)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-colors"></div>
                            <div className="relative z-10 flex flex-col items-start">
                              <Activity className="w-8 h-8 md:w-10 md:h-10 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                              <div className="text-4xl md:text-6xl font-black text-white drop-shadow-md mb-1" dir="ltr">
                                <AnimatedCounter end={stat2Num} prefix="+" />
                              </div>
                              <div className="text-base md:text-xl font-bold text-blue-400">{stat2Text}</div>
                              <div className="text-xs md:text-sm text-slate-300 mt-2 font-medium hidden md:block opacity-80 leading-relaxed">
                                {i18n.language === 'en' ? 'Trusted by leading enterprises across KSA' : 'شريك استراتيجي موثوق لكبرى الشركات'}
                              </div>
                            </div>
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
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative Backgrounds */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-amber-400/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-multiply pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* Section Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-20 md:mb-28"
          >
            <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-slate-900 text-white font-black text-lg md:text-xl mb-6 shadow-md">
              <MapPin className="w-5 h-5 text-amber-400" />
              {i18n.language === 'en' ? 'Our Logistics Journey' : 'رحلة النقل اللوجستي'}
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              {t('home.howItWorks.title')}
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto rounded-full mb-8 shadow-sm"></div>
            <p className="text-slate-700 text-xl md:text-2xl font-bold leading-relaxed max-w-3xl mx-auto">
              {t('home.howItWorks.desc')}
            </p>
          </motion.div>

          {/* Journey Path */}
          <div className="relative w-full max-w-[1536px] mx-auto px-4 lg:px-8">
            <div className="flex flex-col gap-16 lg:gap-20 relative z-10">
              {dsHowItWorks.map((item: any, index: number) => {
                const rawIcon = howItWorksIcons[index] || howItWorksIcons[0];
                const Icon = getIcon(item.iconName, rawIcon);
                
                // Specific HD enterprise imagery for steps
                const premiumImages = [
                  'https://images.unsplash.com/photo-1580674292641-8e01768651c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', // Booking/Planning
                  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', // Loading/Warehouse
                  'https://images.unsplash.com/photo-1519003722824-194d4455aeb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', // Transport
                  'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'  // Delivery
                ];

                // Custom badges for each step
                const badges = [
                  { icon: ShieldCheck, text: i18n.language === 'en' ? 'Dedicated Account Manager' : 'مدير حساب مخصص' },
                  { icon: Snowflake, text: i18n.language === 'en' ? '-18°C Secure Loading' : 'تحميل مبرد آمن حتى -18°C' },
                  { icon: Activity, text: i18n.language === 'en' ? '24/7 Live GPS Monitoring' : 'مراقبة حية للحرارة 24/7' },
                  { icon: CheckCircle2, text: i18n.language === 'en' ? 'Quality Inspection at Handover' : 'فحص الجودة عند التسليم' }
                ];
                
                const BadgeIcon = badges[index].icon;
                
                // RTL Alternating logic: Even = Right Image/Left Text, Odd = Left Image/Right Text
                // (Using standard DOM order with flex-row vs flex-row-reverse)
                const isEven = index % 2 === 0;

                return (
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    key={index} 
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-12 group relative`}
                  >
                    
                    {/* Step Image */}
                    <div className="w-full lg:w-1/2 relative">
                      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[400px] lg:h-[600px] border-4 border-white group-hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] transition-all duration-700">
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-multiply"></div>
                        <img 
                          src={item.imageUrl || premiumImages[index]} 
                          alt={item.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" 
                          referrerPolicy="no-referrer" 
                        />
                        
                        {/* Floating Mobile Badge (Visible only on mobile/tablet) */}
                        <div className="lg:hidden absolute bottom-5 start-5 end-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg z-20 flex items-center gap-3 border border-white/50">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0">
                            <BadgeIcon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-slate-800 text-sm md:text-base">{badges[index].text}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className={`w-full lg:w-1/2 flex flex-col ${isEven ? 'lg:pe-8' : 'lg:ps-8'}`}>
                      <div className="relative">
                        {/* Huge Watermark Number */}
                        <span className="absolute -top-16 lg:-top-24 start-0 text-[120px] md:text-[160px] lg:text-[200px] font-black text-slate-100 leading-none select-none -z-10 group-hover:text-amber-50 transition-colors duration-500">
                          0{index + 1}
                        </span>
                        
                        <div className="relative z-10 pt-6 md:pt-10 lg:pt-12">
                          <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 lg:mb-8 group-hover:text-amber-600 transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed mb-10">
                            {item.desc}
                          </p>
                          
                          {/* Trust Badge / Microcopy (Desktop) */}
                          <div className="hidden lg:inline-flex items-center gap-5 bg-white px-6 py-5 rounded-3xl shadow-sm border border-slate-200 group-hover:border-amber-300 hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                            <div className="w-14 h-14 bg-slate-50 group-hover:bg-amber-50 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition-colors border border-slate-100 group-hover:border-amber-200">
                              <BadgeIcon className="w-7 h-7" />
                            </div>
                            <span className="text-xl font-black text-slate-800">{badges[index].text}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Dark Navy Transition Band -> Introducing FAQ */}
      <div className="w-full relative py-16 md:py-24 bg-slate-900 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Title & Description */}
            <motion.div 
              initial={{ opacity: 0, x: isEn ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-start lg:w-5/12"
            >
              <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-5 py-2.5 rounded-full mb-6">
                <MessageCircle className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-amber-500 text-sm md:text-base tracking-wide">
                  {i18n.language === 'en' ? 'Support & FAQ Center' : 'مركز الدعم والأسئلة الشائعة'}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                {i18n.language === 'en' ? 'How can we help you today?' : 'كيف يمكننا مساعدتك اليوم؟'}
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                {i18n.language === 'en' 
                  ? 'Find quick, comprehensive answers to common questions about our refrigerated transport services, B2B contracts, and nationwide logistics operations.' 
                  : 'اعثر على إجابات سريعة ووافية للأسئلة الشائعة حول خدمات النقل المبرد، عقود الشركات، والعمليات اللوجستية التي نغطي بها كافة أنحاء المملكة.'}
              </p>
            </motion.div>

            {/* Trust Indicators List */}
            <motion.div 
              initial={{ opacity: 0, x: isEn ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-7/12 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
            >
              {[
                { text: isEn ? '24/7 Live Monitoring' : 'مراقبة حية على مدار 24/7' },
                { text: isEn ? 'Temperature Compliance' : 'التزام تام بدرجات التبريد' },
                { text: isEn ? 'Nationwide Coverage' : 'تغطية شاملة لمدن المملكة' },
                { text: isEn ? 'Certified Operations' : 'عمليات لوجستية معتمدة' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-5 rounded-2xl hover:bg-slate-800 hover:border-amber-500/40 hover:shadow-[0_10px_30px_rgba(245,158,11,0.05)] transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-white font-bold text-base md:text-lg">{item.text}</span>
                </div>
              ))}
            </motion.div>
            
          </div>
        </div>
        
        {/* Arrow pointer connecting to the FAQ section below */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-900 rotate-45 z-20"></div>
      </div>

      {/* FAQ & Support Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-200/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* Section Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
          >
            <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-slate-900 text-white font-black text-lg md:text-xl mb-6 shadow-md">
              <MessageCircle className="w-6 h-6 text-amber-400" />
              {i18n.language === 'en' ? 'Support & FAQ' : 'مركز الدعم والأسئلة الشائعة'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
              {t('home.faqSect.title')}
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto rounded-full mb-8 shadow-sm"></div>
            <p className="text-slate-700 text-xl md:text-2xl font-bold leading-relaxed">
              {t('home.faqSect.desc')}
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Right Side (DOM 1st in RTL): Accordion */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="w-full lg:w-7/12 flex flex-col gap-6"
            >
              {dsFaqs.map((faq: any, index: number) => (
                <motion.div 
                  variants={fadeInUp}
                  key={index} 
                  className={`rounded-[2rem] border-2 transition-all duration-300 overflow-hidden ${openFaq === index ? 'border-slate-900 bg-slate-900 shadow-2xl' : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-lg'}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 md:px-10 py-8 md:py-10 flex items-center justify-between text-start focus:outline-none group"
                    aria-expanded={openFaq === index}
                  >
                    <div className="flex items-center gap-6 pe-4">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${openFaq === index ? 'bg-white/10 text-amber-400' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-900'}`}>
                        <span className="font-black text-4xl">?</span>
                      </div>
                      <span className={`font-black text-2xl md:text-3xl leading-snug transition-colors duration-300 ${openFaq === index ? 'text-white' : 'text-slate-900'}`}>
                        {faq.q}
                      </span>
                    </div>
                    <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${openFaq === index ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-900'}`}>
                      {openFaq === index ? <Minus className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-6 md:px-10 pb-10 pt-0"
                      >
                        <div className="pt-6 border-t border-white/10">
                          <p className="text-slate-300 text-xl md:text-2xl font-medium leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* Left Side (DOM 2nd in RTL): Trust Image & Stats */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="w-full lg:w-5/12 lg:sticky lg:top-32"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <div className="absolute inset-0 bg-slate-900/40 z-10 mix-blend-multiply"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Operations Control Center" 
                  className="w-full h-[400px] md:h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-between">
                  <div className="bg-slate-900/80 backdrop-blur-md self-start px-5 py-2.5 rounded-full border border-slate-700 flex items-center gap-3 shadow-lg">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
                    </span>
                    <span className="text-white font-bold text-lg">{i18n.language === 'en' ? 'Live Operations Center' : 'مركز العمليات المباشر'}</span>
                  </div>

                  {/* Trust Indicators inside Image */}
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl p-5 md:p-6 rounded-2xl shadow-xl flex items-center gap-5 transform transition-transform hover:-translate-y-1 border border-white/50">
                      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 flex-shrink-0">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-slate-900 font-black text-xl mb-1">{i18n.language === 'en' ? 'Certified Operations' : 'عمليات معتمدة وآمنة'}</p>
                        <p className="text-slate-700 font-bold text-base">{i18n.language === 'en' ? 'SFDA Compliant' : 'مطابقة لاشتراطات الغذاء والدواء'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/95 backdrop-blur-xl p-5 md:p-6 rounded-2xl shadow-xl flex items-center justify-between transform transition-transform hover:-translate-y-1 border border-white/50">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 border border-amber-200 flex-shrink-0">
                          <Phone className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-black text-xl mb-1">{i18n.language === 'en' ? '24/7 Monitoring' : 'مراقبة ودعم 24/7'}</p>
                          <p className="text-slate-700 font-bold text-base" dir="ltr">+{apiData.contact?.phone1 || '966 50 000 0000'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] end-[-5%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] start-[-5%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-start max-w-3xl"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-inner border border-white/20">
                <Quote className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                {t('home.reviews.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">{t('home.reviews.title2')}</span>
              </h2>
              <div className="w-20 h-1.5 bg-amber-500 rounded-full mb-4 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
              <p className="text-slate-200 text-lg md:text-xl font-bold">{t('home.reviews.desc')}</p>
            </motion.div>
            
            <div className="hidden md:flex gap-4">
              <button 
                onClick={() => document.getElementById('testimonials-slider')?.scrollBy({ left: i18n.language === 'en' ? -400 : 400, behavior: 'smooth' })}
                className="w-14 h-14 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-colors shadow-lg"
              >
                <span className="text-2xl leading-none">&rarr;</span>
              </button>
              <button 
                onClick={() => document.getElementById('testimonials-slider')?.scrollBy({ left: i18n.language === 'en' ? 400 : -400, behavior: 'smooth' })}
                className="w-14 h-14 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-colors shadow-lg"
              >
                <span className="text-2xl leading-none">&larr;</span>
              </button>
            </div>
          </div>

          <div 
            id="testimonials-slider"
            className="flex overflow-x-auto gap-6 md:gap-8 text-start pb-12 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Generate more fallback items to demonstrate the carousel capability */}
            {(apiData.testimonials.length > 0 ? apiData.testimonials : [
              { name_ar: 'شركة الغذاء الذهبي', name_en: 'Golden Food Co.', industry_ar: 'قطاع الأغذية والمطاعم', industry_en: 'Food & Restaurants Sector', duration_ar: '+3 سنوات', duration_en: '+3 Years', volume_ar: '500+ رحلة مبردة شهرياً', volume_en: '500+ Cold Trips/Mo', text_ar: 'شراكتنا مع ركن الريان شكلت نقطة تحول في سلسلة التوريد الخاصة بنا. التزامهم الصارم بدرجات الحرارة وجدولة الرحلات الدقيقة ساهم في خفض التكاليف التشغيلية بنسبة 15%.', text_en: 'Our partnership with Rokn Elryan marked a turning point in our supply chain, reducing operational costs by 15%.' },
              { name_ar: 'مختبرات الحياة الطبية', name_en: 'Hayat Medical Labs', industry_ar: 'الرعاية الصحية والأدوية', industry_en: 'Healthcare & Pharma', duration_ar: '+5 سنوات', duration_en: '+5 Years', volume_ar: 'تغطية 12 مستشفى يومياً', volume_en: '12 Hospitals Daily', text_ar: 'نقل الأدوية الحساسة واللقاحات يتطلب دقة لا مساومة فيها. أسطول ركن الريان المجهز بأنظمة مراقبة حية على مدار الساعة منحنا الطمأنينة الكاملة لمطابقة اشتراطات هيئة الغذاء والدواء.', text_en: 'Transporting sensitive medicines requires uncompromising accuracy. Rokn Elryan gave us complete peace of mind.' },
              { name_ar: 'الشركة الوطنية للدواجن', name_en: 'National Poultry Co.', industry_ar: 'قطاع اللحوم والدواجن', industry_en: 'Meat & Poultry Sector', duration_ar: '+عامين', duration_en: '+2 Years', volume_ar: 'نقل 10,000 طن سنوياً', volume_en: '10,000 Tons Annually', text_ar: 'القدرة الاستيعابية الكبيرة والتجاوب السريع في مواسم الذروة هو ما يميز ركن الريان. لم نواجه أي تأخير أو تلف في الشحنات منذ بداية العقد الاستراتيجي بيننا.', text_en: 'High capacity and fast response during peak seasons is what distinguishes Rokn Elryan.' },
              { name_ar: 'سلسلة مطاعم الذواقة', name_en: 'Gourmet Chains', industry_ar: 'المطاعم الفاخرة', industry_en: 'Fine Dining', duration_ar: '+4 سنوات', duration_en: '+4 Years', volume_ar: 'توريد يومي لـ 45 فرع', volume_en: 'Daily to 45 Branches', text_ar: 'الاعتمادية العالية وسرعة الاستجابة جعلت ركن الريان شريكنا اللوجستي الأول. نحن نضمن جودة لحومنا الطازجة بفضل مراقبتهم الدقيقة لدرجات الحرارة.', text_en: 'High reliability made Rokn Elryan our top logistics partner.' },
              { name_ar: 'مصانع الألبان الحديثة', name_en: 'Modern Dairy Factories', industry_ar: 'منتجات الألبان', industry_en: 'Dairy Products', duration_ar: '+1 سنة', duration_en: '+1 Year', volume_ar: '300 شاحنة شهرياً', volume_en: '300 Trucks/Mo', text_ar: 'نقل الألبان يتطلب بيئة نظيفة ومبردة بدقة. أسطولهم الحديث وفريقهم المحترف وفّر لنا بيئة مثالية لنقل منتجاتنا بأعلى معايير الجودة العالمية.', text_en: 'Transporting dairy requires a clean, cooled environment. Their modern fleet provided exactly that.' }
            ]).map((review, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-[85vw] md:w-[360px] lg:w-[400px] shrink-0 snap-center h-auto"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
                  whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
                  className="bg-slate-800/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(245,158,11,0.15)] border border-slate-700 hover:border-amber-500/50 relative group cursor-pointer h-full flex flex-col justify-between overflow-hidden transition-all duration-500"
                >
                  <Quote className="absolute top-6 start-6 w-40 h-40 text-white/5 group-hover:text-amber-500/5 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 z-0" />
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    
                    {/* Header: Logo & Company Info */}
                    <div className="flex items-center gap-5 mb-8 border-b border-slate-700/60 pb-8">
                      {review.logo ? (
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl p-2 shadow-lg flex-shrink-0 flex items-center justify-center border border-slate-600">
                          <img src={review.logo} alt={review.name_ar} loading="lazy" className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-700 border border-slate-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Award className="w-8 h-8 text-amber-500" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-black text-white text-xl md:text-2xl mb-2 group-hover:text-amber-400 transition-colors duration-300">
                          {review[`name_${i18n.language}` as 'name_ar'|'name_en'] || review.name_ar}
                        </h4>
                        <span className="inline-flex items-center gap-2 text-amber-400 text-xs md:text-sm font-bold bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
                          <Activity className="w-4 h-4" />
                          {review[`industry_${i18n.language}` as 'industry_ar'|'industry_en'] || review.industry_ar || review.role_ar}
                        </span>
                      </div>
                    </div>

                    {/* Case Study Quote */}
                    <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-10 flex-1 relative z-10 group-hover:text-white transition-colors duration-300">
                      "{review[`text_${i18n.language}` as 'text_ar'|'text_en'] || review.text_ar}"
                    </p>
                    
                    {/* Enterprise Metrics Footer */}
                    <div className="grid grid-cols-2 gap-4 mt-auto relative z-10">
                      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700/50 group-hover:border-slate-600 transition-colors duration-300">
                        <div className="text-slate-400 text-xs md:text-sm font-bold mb-1.5 uppercase tracking-wider">
                          {i18n.language === 'en' ? 'Partnership' : 'مدة الشراكة'}
                        </div>
                        <div className="text-white font-black text-base md:text-lg flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          {review[`duration_${i18n.language}` as 'duration_ar'|'duration_en'] || review.duration_ar || '+1 سنة'}
                        </div>
                      </div>
                      
                      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700/50 group-hover:border-slate-600 transition-colors duration-300">
                        <div className="text-slate-400 text-xs md:text-sm font-bold mb-1.5 uppercase tracking-wider">
                          {i18n.language === 'en' ? 'Volume' : 'حجم العمليات'}
                        </div>
                        <div className="text-white font-black text-base md:text-lg flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-400" />
                          {review[`volume_${i18n.language}` as 'volume_ar'|'volume_en'] || review.volume_ar || 'مستمر'}
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Transition Divider */}
      {apiData.settings?.general?.articles_enabled !== false && apiData.articles && apiData.articles.length > 0 && (
        <div className="relative w-full bg-[#F8FAFC] pt-16 -mt-8 z-20 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-1.5 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full mb-6"></div>
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md border border-slate-200 transform -translate-y-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-slate-800 text-sm md:text-base tracking-wide">
                  {apiData.pagesMeta?.homeArticles?.[`badge_${i18n.language}`] || (i18n.language === 'en' ? 'Logistics Knowledge Center' : 'مركز المعرفة اللوجستية')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest Articles Section */}
      {apiData.settings?.general?.articles_enabled !== false && apiData.articles && apiData.articles.length > 0 && (
        <section className="pb-24 pt-8 bg-[#F8FAFC] relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-100/50 pointer-events-none"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                {apiData.pagesMeta?.homeArticles?.[`title_${i18n.language}`] || (i18n.language === 'en' ? 'Articles & Tips' : 'مقالات ونصائح حول نقل العفش')}
              </h2>
              <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
                {apiData.pagesMeta?.homeArticles?.[`desc_${i18n.language}`] || (i18n.language === 'en' ? 'We are distinguished by several features that make us the optimal choice for furniture moving, thanks to our experience and skill in providing high-quality services.' : 'نتميز بعدة مميزات تجعلنا الخيار الأمثل لنقل العفش، وذلك بفضل خبرتنا ومهارتنا وتفانينا في تقديم خدمة عالية الجودة للعملاء الذين يرغبون في نقل أثاثهم بأمان وسهولة.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 text-start">
              {apiData.articles.map((article: any, idx: number) => (
                <motion.div 
                  key={article.id || idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl flex flex-col group border border-slate-100 h-full transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image & Category */}
                  <div className="relative h-72 lg:h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img 
                      src={article.image ? (article.image.startsWith('/') ? article.image : article.image) : 'https://images.unsplash.com/photo-1519003722824-194d4455aeb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt={article[`title_${i18n.language}`] || article.title_ar} 
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    {article.category && (
                      <div className="absolute top-6 start-6 bg-slate-900/80 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg z-20 border border-white/10">
                        {article.category}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 md:p-10 flex-grow flex flex-col relative">
                    {/* Floating Date Badge */}
                    <div className="absolute -top-6 end-8 bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.created_at || Date.now()).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'ar-SA', { day: 'numeric', month: 'short' })}
                    </div>

                    <h3 className="font-black text-2xl text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-amber-600 transition-colors">
                      {article[`title_${i18n.language}`] || article.title_ar}
                    </h3>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed line-clamp-3 mb-8">
                      {article[`content_${i18n.language}`] ? article[`content_${i18n.language}`].replace(/<[^>]+>/g, '').substring(0, 150) + '...' : (article.content_ar ? article.content_ar.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '')}
                    </p>
                    
                    <div className="mt-auto">
                      <Link to={`/${i18n.language === 'en' ? 'en/blog' : 'blog'}/${article.slug || article.id}`} className="bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 text-slate-800 hover:text-amber-700 w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md">
                        {i18n.language === 'en' ? 'Read Full Article' : 'قراءة المقال كاملاً'}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 bg-amber-500 relative overflow-hidden mt-12 lg:mt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm p-10 md:p-16 rounded-[3rem] border border-white/20 shadow-2xl"
          >
            {(() => {
              const ctaMeta = (apiData.settings as any)?.ctaMeta || {};
              const title = ctaMeta[`title_${i18n.language}`] || t('home.cta.title');
              const desc = ctaMeta[`desc_${i18n.language}`] || t('home.cta.desc');
              const btn1 = ctaMeta[`btn1_${i18n.language}`] || t('home.cta.bookBtn');
              const btn2 = ctaMeta[`btn2_${i18n.language}`] || t('home.cta.waBtn');
              return (
                <>
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl transform -rotate-3">
                     <Truck className="w-10 h-10 text-slate-900" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">{title}</h2>
                  <p className="text-xl md:text-2xl text-slate-800 mb-12 font-bold max-w-2xl mx-auto leading-relaxed">
                    {desc}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link to="/contact" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                      {btn1}
                    </Link>
                    <a href={`https://wa.me/${apiData.contact?.whatsapp || ''}`} target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                      <MessageCircle className="w-6 h-6 text-green-500" />
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
