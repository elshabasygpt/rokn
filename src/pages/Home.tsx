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

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className={className}>
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

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
    pagesMeta: null as any,
    industries: [] as any[]
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
        const [settingsRes, servicesRes, testimonialsRes, partnersRes, faqsRes, articlesRes, industriesRes] = await Promise.all([
          fetch(`${API_URL}/api/settings`).then(r => r.json()),
          fetch(`${API_URL}/api/services`).then(r => r.json()),
          fetch(`${API_URL}/api/testimonials`).then(r => r.json()),
          fetch(`${API_URL}/api/partners`).then(r => r.json()),
          fetch(`${API_URL}/api/faqs`).then(r => r.json()),
          fetch(`${API_URL}/api/articles`).then(r => r.json()),
          fetch(`${API_URL}/api/industries`).then(r => r.json())
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
          settings: settingsRes,
          industries: Array.isArray(industriesRes) ? industriesRes : []
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

  const dsCities = React.useMemo(() => {
    let cities: { value: string; label: string }[] = [];
    const customRoutes = apiData.estimator?.custom_routes || [];
    const citySet = new Set<string>();
    customRoutes.forEach((r: any) => {
      if (r.from && r.from.trim()) citySet.add(r.from.trim());
      if (r.to && r.to.trim()) citySet.add(r.to.trim());
    });
    
    if (citySet.size > 0) {
      cities = Array.from(citySet).map(c => ({ value: c, label: c }));
    } else {
      const fallback = ['أبها', 'خميس مشيط', 'الرياض', 'جدة', 'الدمام'];
      cities = fallback.map(c => ({ value: c, label: c }));
    }
    return cities;
  }, [apiData.estimator?.custom_routes]);

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

  const geoData = {
    region: 'SA-14', // Asir Region
    placename: 'Abha', // Headquarters location
    position: '18.2164;42.5053', // Abha coordinates (approx)
    icbm: '18.2164, 42.5053'
  };

  return (
    <>
      <SEO title={`${homeTitle} | ${isEn ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد'}`} description={homeDesc} schema={[localBusinessSchema, faqSchema]} geo={geoData} />
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
              <a href={`https://wa.me/${apiData.contact?.whatsapp || ''}`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-[#25D366] text-white border border-slate-700/80 hover:border-[#25D366] backdrop-blur-md px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-[0_15px_40px_rgba(37,211,102,0.3)] hover:-translate-y-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out"></div>
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 relative z-10">
                  <WhatsAppIcon className="w-6 h-6 text-[#25D366] group-hover:text-white transition-colors" />
                </div>
                <span className="relative z-10">{isEn ? 'WhatsApp Contact' : 'التواصل عبر واتساب'}</span>
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
      <section className="py-24 bg-white border-t border-slate-100 overflow-hidden relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-amber-400 opacity-[0.08] blur-[100px]"></div>
        <div className="absolute left-0 right-0 bottom-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-600 opacity-[0.05] blur-[100px]"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-slate-50 text-slate-700 font-black text-sm mb-6 shadow-sm border border-slate-200 uppercase tracking-widest">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              {isEn ? 'Our Success Partners' : 'شركاء النجاح'}
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight drop-shadow-sm">
              {apiData.pagesMeta?.homePartners?.[`title_${i18n.language}`] || (isEn ? 'Trusted By Industry Leaders' : 'نعتز بثقة شركائنا في مختلف القطاعات')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full shadow-md"></div>
          </motion.div>

          <div className="relative flex overflow-hidden w-full group py-8" dir="ltr">
            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-logo-scroll flex items-center">
              {/* Duplicate the array twice to create seamless loop */}
              {[...Array(2)].map((_, arrayIdx) => (
                <div key={arrayIdx} className="flex items-center gap-16 md:gap-32 px-8 md:px-16">
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
                      <div 
                        key={`${arrayIdx}-${partner.id || idx}`}
                        className="group flex items-center justify-center transition-all duration-300 w-[160px] md:w-[220px] h-24 md:h-32"
                      >
                        {partner.image_url ? (
                          <img src={partner.image_url.startsWith('/') ? partner.image_url : partner.image_url} alt={partner.name} className="max-h-full max-w-full w-auto transition-all duration-500 object-contain drop-shadow-sm group-hover:scale-110" />
                        ) : Icon ? (
                          <Icon 
                            className="max-h-full max-w-full w-auto transition-all duration-500 drop-shadow-sm group-hover:scale-110" 
                            style={{ '--hover-color': partner.color, color: partner.color || 'currentColor' } as React.CSSProperties}
                          />
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Industries We Serve Section */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        {/* Custom SVG Divider from Partners Section */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[70px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
        {/* Abstract Background pattern */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMTg0LCAyMDMsIDIyNSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-100"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-100 rounded-full blur-[100px] opacity-60"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-white text-slate-700 font-black text-sm mb-6 shadow-sm border border-slate-200 uppercase tracking-widest relative z-10">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              {i18n.language === 'en' ? 'Our Focus' : 'نطاق تخصصنا'}
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight drop-shadow-sm relative z-10">
              {apiData.pagesMeta?.industries?.[`title_${i18n.language}`] || (i18n.language === 'en' ? 'Industries We Serve' : 'قطاعات الأعمال التي نخدمها')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full shadow-md mb-8 relative z-10"></div>
            <p className="text-slate-600 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              {apiData.pagesMeta?.industries?.[`desc_${i18n.language}`] || (i18n.language === 'en' ? 'We provide specialized cold chain logistics tailored to the unique requirements of various B2B sectors in Saudi Arabia.' : 'نقدم حلول نقل لوجستية مبردة مصممة خصيصاً لتلبية المعايير الصارمة لمختلف قطاعات الأعمال في المملكة.')}
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10">
            {apiData.industries.map((industry: any, i: number) => {
              
              return (
              <Link to={i18n.language === 'en' ? `/en/industries/${industry.slug}` : `/industries/${industry.slug}`} key={i} className="group relative rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 min-h-[380px] md:min-h-[420px] flex items-end block">
                {industry.featured_image && (industry.featured_image.startsWith('http') || industry.featured_image.startsWith('/')) ? (
                  <>
                    <img src={industry.featured_image} alt={industry.name_ar} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out z-0" />
                    {/* Dark Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center z-0">
                      <div className="text-9xl opacity-20 transform group-hover:scale-125 transition-transform duration-700">{industry.icon || '🏢'}</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                  </>
                )}

                {/* Badge */}
                <div className="absolute top-6 start-6 z-30">
                  <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 uppercase tracking-widest shadow-sm">
                    {i18n.language === 'en' ? 'Sector' : 'قطاع'}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-20 p-8 md:p-10 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-1 bg-amber-500 rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
                    {i18n.language === 'en' ? industry.name_en : industry.name_ar}
                  </h3>
                  <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-md line-clamp-2">
                    {i18n.language === 'en' ? industry.description_en : industry.description_ar}
                  </p>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* Services Summary Section */}
      <section className="py-24 md:py-32 bg-slate-900 relative overflow-hidden">
        {/* Custom SVG Divider from Industries Section */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-slate-50"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-slate-50"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-slate-50"></path>
          </svg>
        </div>
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
        <section className="py-24 relative overflow-hidden bg-slate-950 text-white">
          {/* Custom SVG Divider from Services Section */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-900"></path>
            </svg>
          </div>
          
          {/* Futuristic Dark Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          </div>
          <div className="absolute -top-64 -right-64 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px]"></div>
          
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* Centered Premium Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-slate-800 text-amber-400 font-black text-sm mb-6 shadow-sm border border-slate-700 uppercase tracking-widest">
              <Calculator className="w-4 h-4 text-amber-500" />
              {t('home.estimator.badge')}
              <Calculator className="w-4 h-4 text-amber-500" />
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-lg">
              {apiData.estimator[`title_${i18n.language}` as keyof typeof apiData.estimator] || t('home.estimator.title')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full shadow-md mb-8"></div>
            <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              {apiData.estimator[`desc_${i18n.language}` as keyof typeof apiData.estimator] || t('home.estimator.desc')}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:w-5/12 w-full flex flex-col justify-center"
            >
              
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
      {/* Enterprise Compliance & Insurance Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Custom SVG Divider from Estimator Section */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[70px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-950"></path>
          </svg>
        </div>
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <span className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-emerald-50 text-emerald-800 font-black text-sm mb-6 shadow-sm border border-emerald-200 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {apiData.pagesMeta?.compliance?.[`badge_${i18n.language}` as keyof typeof apiData.pagesMeta.compliance] || (i18n.language === 'en' ? 'Enterprise-Grade Compliance' : 'اعتمادات مؤسسية صارمة')}
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight drop-shadow-sm">
              {apiData.pagesMeta?.compliance?.[`title_${i18n.language}` as keyof typeof apiData.pagesMeta.compliance] || (i18n.language === 'en' ? '100% Insured & Fully Certified Logistics' : 'نقل لوجستي مؤمن بالكامل ومعتمد رسمياً')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full shadow-md mb-8"></div>
            <p className="text-slate-600 text-xl font-medium leading-relaxed max-w-3xl mx-auto">
              {apiData.pagesMeta?.compliance?.[`desc_${i18n.language}` as keyof typeof apiData.pagesMeta.compliance] || (i18n.language === 'en' ? 'We eliminate risk. Our operations comply with the highest global GDP standards and local SFDA requirements, backed by comprehensive goods-in-transit insurance.' : 'نحن نقضي على المخاطر تماماً. عملياتنا تخضع لأعلى معايير الجودة العالمية ومغطاة بتأمين شامل على البضائع لحماية استثماراتك.')}
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {(() => {
              const defaultComplianceItems = [
                { id: 'sfda', icon: <ShieldCheck className="w-10 h-10 text-blue-600" />, title_ar: 'اعتماد الغذاء والدواء', title_en: 'SFDA Approved', desc_ar: 'مرخصون بالكامل من هيئة الغذاء والدواء السعودية لنقل الأدوية والأغذية المبردة.', desc_en: 'Fully licensed by the Saudi Food and Drug Authority for sensitive cold chain transport.' },
                { id: 'insurance', icon: <FileText className="w-10 h-10 text-emerald-600" />, title_ar: 'تأمين شامل', title_en: 'Comprehensive Insurance', desc_ar: 'صفر مخاطرة مالية. جميع الحمولات مغطاة ببوليصة تأمين شاملة ضد التلف والحوادث أثناء النقل.', desc_en: 'Zero financial risk. All cargo is covered by robust Goods-In-Transit insurance policies.' },
                { id: 'tga', icon: <Truck className="w-10 h-10 text-slate-700" />, title_ar: 'ترخيص هيئة النقل', title_en: 'TGA Licensed', desc_ar: 'جميع شاحناتنا تحمل بطاقات تشغيل رسمية وسارية من الهيئة العامة للنقل (TGA).', desc_en: 'Official operating cards from the Transport General Authority for our entire modern fleet.' },
                { id: 'gdp', icon: <Activity className="w-10 h-10 text-amber-500" />, title_ar: 'معايير GDP وتتبع حي', title_en: 'GDP & Live Tracking', desc_ar: 'نطبق ممارسات التوزيع الجيد (GDP) ونوفر تقارير أجهزة التتبع الحراري اللحظية (Data Loggers).', desc_en: 'Adhering to Good Distribution Practices with real-time temperature data loggers.' }
              ];
              const complianceItems = apiData.pagesMeta?.compliance?.items || defaultComplianceItems;

              const cardThemes = [
                { gradient: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', hoverBg: 'group-hover:bg-blue-100', shadow: 'hover:shadow-[0_20px_40px_rgb(59,130,246,0.1)]' },
                { gradient: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50', hoverBg: 'group-hover:bg-emerald-100', shadow: 'hover:shadow-[0_20px_40px_rgb(16,185,129,0.1)]' },
                { gradient: 'from-slate-600 to-slate-800', bg: 'bg-slate-50', hoverBg: 'group-hover:bg-slate-100', shadow: 'hover:shadow-[0_20px_40px_rgb(71,85,105,0.1)]' },
                { gradient: 'from-amber-400 to-amber-600', bg: 'bg-amber-50', hoverBg: 'group-hover:bg-amber-100', shadow: 'hover:shadow-[0_20px_40px_rgb(245,158,11,0.1)]' },
              ];

              return complianceItems.map((item: any, index: number) => {
                const theme = cardThemes[index % cardThemes.length];
                
                return (
                  <motion.div key={index} variants={fadeInUp} className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${theme.shadow} hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden text-center flex flex-col h-full`}>
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${theme.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                    
                    <div className={`w-20 h-20 ${theme.bg} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 ${theme.hoverBg}`}>
                      {item.icon ? (
                        typeof item.icon === 'string' ? (
                          item.icon.startsWith('http') || item.icon.startsWith('/') ? 
                            <img src={item.icon} alt="" className="w-10 h-10 object-contain" /> :
                            <span className="text-3xl">{item.icon}</span>
                        ) : (
                          item.icon
                        )
                      ) : (
                        <ShieldCheck className="w-10 h-10 text-slate-400" />
                      )}
                    </div>
                    <h3 className="font-black text-2xl text-slate-900 mb-4">
                      {item[`title_${i18n.language}`] || (i18n.language === 'en' ? item.title_en : item.title_ar)}
                    </h3>
                    <p className="text-slate-600 text-base font-medium leading-relaxed flex-1">
                      {item[`desc_${i18n.language}`] || (i18n.language === 'en' ? item.desc_en : item.desc_ar)}
                    </p>
                  </motion.div>
                );
              });
            })()}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 md:py-32 bg-slate-900 text-white overflow-hidden relative">
        {/* Geometric Slant Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]">
            <path d="M1200 0L0 0 0 120 1200 0z" className="fill-slate-50"></path>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {/* High-Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-stretch gap-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:w-1/2 relative"
            >
              {/* Decorative Blur */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -z-10"></div>
              
              {(() => {
                const whyUsMeta = apiData.settings?.whyUsMeta || {};
                const wTitle = whyUsMeta[`title_${i18n.language}` as keyof typeof whyUsMeta] || (t('home.whyUs.title1') + ' ' + t('home.whyUs.title2'));
                const splitTitle = wTitle.split(' ');
                const lastWord = splitTitle.length > 1 ? splitTitle.pop() : '';
                const restTitle = splitTitle.join(' ');
                const wDesc = whyUsMeta[`desc_${i18n.language}` as keyof typeof whyUsMeta] || t('home.whyUs.desc');
                
                return (
                  <div className="mb-12">
                    <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-slate-800 text-amber-400 font-bold text-sm mb-6 border border-slate-700 uppercase tracking-widest shadow-lg">
                      <Star className="w-4 h-4" fill="currentColor" />
                      {i18n.language === 'en' ? 'The Rokn Elryan Advantage' : 'ميزة ركن الريان التنافسية'}
                    </span>
                    <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.2] drop-shadow-lg">
                      {restTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">{lastWord}</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium max-w-xl">
                      {wDesc}
                    </motion.p>
                  </div>
                );
              })()}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dsWhyUs.map((feature: any, index: number) => {
                  const rawIcon = whyUsIcons[index] || whyUsIcons[0];
                  const Icon = getIcon(feature.iconName, rawIcon);
                  return (
                    <motion.div variants={fadeInUp} key={index} className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-500/30 p-6 rounded-3xl transition-all duration-500 overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="w-14 h-14 mb-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <Icon className="w-7 h-7 text-amber-400" />
                      </div>
                      <h4 className="font-black text-xl mb-3 text-white group-hover:text-amber-400 transition-colors duration-300">{feature.title}</h4>
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">{feature.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: isEn ? 50 : -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/2 relative mt-10 lg:mt-0 flex flex-col"
            >
              <div className="relative p-3 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/0 border border-white/10 shadow-[0_20px_50px_rgb(0,0,0,0.5)] flex-1 flex flex-col">
                <div className="relative rounded-[2rem] overflow-hidden bg-slate-800 flex-1">
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
                          className="w-full h-full min-h-[500px] object-cover mix-blend-overlay opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 absolute inset-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-slate-900/80 pointer-events-none"></div>
                        
                        <div className="absolute top-6 start-6 z-10">
                          <div className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs md:text-sm font-bold px-5 py-2.5 rounded-full border border-emerald-500/30 flex items-center gap-3 shadow-lg shadow-emerald-500/10">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            {i18n.language === 'en' ? '24/7 Operations Active' : 'غرفة العمليات نشطة 24/7'}
                          </div>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 z-10">
                          <div className="grid grid-cols-2 gap-4 md:gap-6">
                            {/* Stat 1 */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl transition-all duration-500 group shadow-2xl relative overflow-hidden hover:bg-white/10">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                              <div className="relative flex flex-col items-start">
                                <ShieldCheck className="w-10 h-10 text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                                <div className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md mb-2 flex items-center gap-1" dir="ltr">
                                  <span>+</span><AnimatedCounter end={stat1Num} />
                                </div>
                                <div className="text-sm md:text-lg font-bold text-amber-400">{stat1Text}</div>
                                <div className="w-12 h-1 bg-amber-500/50 rounded-full mt-4"></div>
                              </div>
                            </div>
                            
                            {/* Stat 2 */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl transition-all duration-500 group shadow-2xl relative overflow-hidden hover:bg-white/10">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                              <div className="relative flex flex-col items-start">
                                <Activity className="w-10 h-10 text-blue-400 mb-4 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                                <div className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md mb-2 flex items-center gap-1" dir="ltr">
                                  <span>+</span><AnimatedCounter end={stat2Num} />
                                </div>
                                <div className="text-sm md:text-lg font-bold text-blue-400">{stat2Text}</div>
                                <div className="w-12 h-1 bg-blue-500/50 rounded-full mt-4"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
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
      <div className="w-full relative py-20 md:py-32 bg-slate-900 overflow-hidden">
        {/* Top SVG Divider (Flowing from How it Works) */}
        <div className="absolute -top-[1px] left-0 w-full overflow-hidden leading-[0] z-0">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50"></path>
          </svg>
        </div>
        
        {/* Background Accents */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
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
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full mb-8 shadow-xl backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <span className="font-bold text-white text-sm md:text-base tracking-widest uppercase">
                  {apiData.pagesMeta?.supportGateway?.[`badge_${i18n.language}`] || (i18n.language === 'en' ? 'Live Support 24/7' : 'الدعم الفني المباشر')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.15]">
                {i18n.language === 'en' ? 'How can we ' : 'كيف يمكننا '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
                  {apiData.pagesMeta?.supportGateway?.[`title_${i18n.language}`] || (i18n.language === 'en' ? 'help you' : 'مساعدتك')}
                </span>
                {i18n.language === 'en' ? ' today?' : ' اليوم؟'}
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-lg">
                {apiData.pagesMeta?.supportGateway?.[`desc_${i18n.language}`] || (i18n.language === 'en' 
                  ? 'Find quick, comprehensive answers to common questions about our refrigerated transport services, B2B contracts, and nationwide logistics operations.' 
                  : 'اعثر على إجابات سريعة ووافية للأسئلة الشائعة حول خدمات النقل المبرد، عقود الشركات، والعمليات اللوجستية التي نغطي بها كافة أنحاء المملكة.')}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Phone Button */}
                <a 
                  href={`tel:${apiData.settings?.contact?.phone?.replace(/\s+/g, '') || '920000000'}`}
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 text-slate-900 font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <Phone className="w-6 h-6 relative z-10" />
                  <span className="relative z-10" dir="ltr">{apiData.settings?.contact?.phone || '920000000'}</span>
                </a>

                {/* WhatsApp Button */}
                <a 
                  href={`https://wa.me/${apiData.settings?.contact?.whatsapp?.replace(/\s+/g, '') || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(37,211,102,0.3)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <svg className="w-6 h-6 relative z-10 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  <span className="relative z-10">{i18n.language === 'en' ? 'WhatsApp' : 'واتساب'}</span>
                </a>
              </div>
            </motion.div>

            {/* Premium Glass Cards List */}
            <motion.div 
              initial={{ opacity: 0, x: isEn ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-7/12 w-full grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6"
            >
              {[
                { text: isEn ? '24/7 Live Monitoring' : 'مراقبة حية على مدار 24/7', icon: Activity, color: 'text-blue-400', border: 'border-blue-500/20', shadow: 'hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]' },
                { text: isEn ? 'Temperature Compliance' : 'التزام تام بدرجات التبريد', icon: Snowflake, color: 'text-cyan-400', border: 'border-cyan-500/20', shadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]' },
                { text: isEn ? 'Nationwide Coverage' : 'تغطية شاملة لمدن المملكة', icon: MapPin, color: 'text-amber-400', border: 'border-amber-500/20', shadow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]' },
                { text: isEn ? 'Certified Operations' : 'عمليات لوجستية معتمدة', icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-500/20', shadow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`group relative bg-slate-800/40 backdrop-blur-xl border border-white/5 hover:${item.border} p-6 lg:p-8 rounded-[2rem] transition-all duration-500 overflow-hidden cursor-pointer ${item.shadow}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="flex flex-col items-start gap-5 relative z-10">
                      <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                        <Icon className={`w-7 h-7 lg:w-8 lg:h-8 ${item.color} drop-shadow-lg`} />
                      </div>
                      <span className="text-white font-black text-xl lg:text-2xl leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all duration-300">
                        {item.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
            
          </div>
        </div>
      </div>

      {/* FAQ & Support Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Top SVG Divider (Flowing from Dark Band) */}
        <div className="absolute -top-[1px] left-0 w-full overflow-hidden leading-[0] z-10">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-900"></path>
          </svg>
        </div>

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
              className="w-full lg:w-7/12 flex flex-col gap-4"
            >
              {dsFaqs.map((faq: any, index: number) => (
                <motion.div 
                  variants={fadeInUp}
                  key={index} 
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${openFaq === index ? 'border-amber-400 bg-amber-50/30 shadow-lg ring-1 ring-amber-400/50' : 'border-slate-200 bg-white hover:border-amber-200 hover:shadow-md'}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 md:px-8 py-6 md:py-8 flex items-center justify-between text-start focus:outline-none group"
                    aria-expanded={openFaq === index}
                  >
                    <div className="flex items-center gap-6 pe-4 flex-1">
                      <span className={`font-black text-xl md:text-2xl leading-snug transition-colors duration-300 ${openFaq === index ? 'text-amber-700' : 'text-slate-900 group-hover:text-amber-600'}`}>
                        {faq.q}
                      </span>
                    </div>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 border-2 ${openFaq === index ? 'bg-amber-500 border-amber-500 text-slate-900 rotate-180' : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:text-amber-600'}`}>
                      {openFaq === index ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-6 md:px-8 pb-8 pt-0"
                      >
                        <div className="pt-4 border-t border-amber-200/50">
                          <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed">{faq.a}</p>
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
              className="w-full lg:w-5/12 lg:sticky lg:top-32 self-start"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 bg-slate-900 group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10 mix-blend-multiply"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Operations Control Center" 
                  className="w-full h-[450px] md:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-between">
                  <div className="bg-white/10 backdrop-blur-xl self-start px-5 py-2.5 rounded-full border border-white/20 flex items-center gap-3 shadow-xl">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-white font-bold tracking-wide text-sm md:text-base drop-shadow-sm">{i18n.language === 'en' ? 'Live Operations Center' : 'مركز العمليات المباشر'}</span>
                  </div>

                  {/* Trust Indicators inside Image */}
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-2xl p-5 rounded-2xl shadow-xl flex items-center gap-5 transform transition-all hover:-translate-y-1 hover:bg-white/15 border border-white/20 group/card">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-blue-300 border border-white/10 flex-shrink-0 group-hover/card:scale-110 transition-transform">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-white font-black text-xl mb-1 drop-shadow-md">{i18n.language === 'en' ? 'Certified Operations' : 'عمليات معتمدة وآمنة'}</p>
                        <p className="text-slate-300 font-bold text-sm md:text-base">{i18n.language === 'en' ? 'SFDA Compliant' : 'مطابقة لاشتراطات الغذاء والدواء'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-2xl p-5 rounded-2xl shadow-xl flex items-center justify-between transform transition-all hover:-translate-y-1 hover:bg-white/15 border border-white/20 group/card">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-amber-300 border border-white/10 flex-shrink-0 group-hover/card:scale-110 transition-transform">
                          <Phone className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-white font-black text-xl mb-1 drop-shadow-md">{i18n.language === 'en' ? '24/7 Monitoring' : 'مراقبة ودعم 24/7'}</p>
                          <p className="text-amber-400 font-bold text-sm md:text-base tracking-wider" dir="ltr">+{apiData.contact?.phone1 || '966 50 000 0000'}</p>
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
      <section className="py-24 bg-slate-900 relative overflow-hidden -mt-[1px]">
        {/* Top SVG Divider (Slant Cut) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-20">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[100px]">
            <path d="M1200 0L0 0 0 120 1200 0z" className="fill-slate-50"></path>
          </svg>
        </div>

        {/* Decorative Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] end-[-5%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] start-[-5%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 pt-8 md:pt-12 text-start">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-5 py-2.5 rounded-full mb-6">
                <Quote className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-amber-400 tracking-wider text-sm md:text-base">
                  {i18n.language === 'en' ? 'Client Success Stories' : 'قصص نجاح عملائنا'}
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-md">
                {apiData.pagesMeta?.homeTestimonials?.[`title_${i18n.language}`] || (i18n.language === 'en' ? 'What Our Partners Say' : 'آراء شركاء النجاح')}
              </h2>
              
              <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                {apiData.pagesMeta?.homeTestimonials?.[`desc_${i18n.language}`] || (i18n.language === 'en' ? 'We are proud of our clients\' trust in the food and restaurant sector, and we always strive to provide the best.' : 'نفخر بثقة عملائنا في قطاع الأغذية والمطاعم، ونسعى دائماً لتقديم أعلى مستويات الجودة والالتزام في كل رحلة تبريد.')}
              </p>
            </div>
            
            <div className="flex gap-4 shrink-0 mt-4 md:mt-0">
              <button 
                onClick={() => document.getElementById('testimonials-slider')?.scrollBy({ left: i18n.language === 'en' ? -400 : 400, behavior: 'smooth' })}
                className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 hover:text-slate-900 transition-all shadow-lg group"
              >
                <span className="text-2xl leading-none transform group-hover:-translate-x-1 transition-transform">&rarr;</span>
              </button>
              <button 
                onClick={() => document.getElementById('testimonials-slider')?.scrollBy({ left: i18n.language === 'en' ? 400 : -400, behavior: 'smooth' })}
                className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 hover:text-slate-900 transition-all shadow-lg group"
              >
                <span className="text-2xl leading-none transform group-hover:translate-x-1 transition-transform">&larr;</span>
              </button>
            </div>
          </div>

          <div 
            id="testimonials-slider"
            className="flex overflow-x-auto gap-6 md:gap-8 text-start pb-24 snap-x snap-mandatory"
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
                className="w-[85vw] md:w-[360px] lg:w-[420px] shrink-0 snap-center h-auto"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
                  whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
                  className="bg-slate-800/40 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl hover:shadow-[0_30px_60px_rgba(245,158,11,0.15)] border border-white/10 hover:border-amber-500/50 relative group cursor-pointer h-full flex flex-col justify-between overflow-hidden transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Quote className="absolute top-6 start-6 w-40 h-40 text-white/5 group-hover:text-amber-500/5 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 z-0" />
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    
                    {/* Header: Logo & Company Info */}
                    <div className="flex items-center gap-5 mb-8 border-b border-white/10 pb-8 group-hover:border-white/20 transition-colors">
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
        
        {/* Bottom SVG Divider (Slant Cut Reverse) inside Testimonials */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 translate-y-[1px]">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[100px]">
            <path d="M0 120L1200 120 0 0z" className="fill-[#F8FAFC]"></path>
          </svg>
        </div>
      </section>

      {/* Latest Articles Section (Premium Image Layout) */}
      {apiData.settings?.general?.articles_enabled !== false && apiData.articles && apiData.articles.length > 0 && (
        <section className="pb-32 pt-20 bg-[#F8FAFC] relative z-10 overflow-hidden">
          {/* Abstract background elements */}
          <div className="absolute top-[-10%] start-[-10%] w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] end-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-20">
              <div className="max-w-2xl text-start">
                <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 text-amber-700 px-4 py-1.5 rounded-full mb-6 font-bold text-sm shadow-sm">
                  <FileText className="w-4 h-4" />
                  {apiData.pagesMeta?.homeArticles?.[`badge_${i18n.language}`] || (i18n.language === 'en' ? 'Knowledge Center' : 'مركز المعرفة اللوجستية')}
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                  {apiData.pagesMeta?.homeArticles?.[`title_${i18n.language}`] || (i18n.language === 'en' ? 'Industry Insights & Guides' : 'رؤى وأدلة لوجستية')}
                </h2>
                <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
                  {apiData.pagesMeta?.homeArticles?.[`desc_${i18n.language}`] || (i18n.language === 'en' ? 'Stay updated with the latest trends and best practices in cold chain logistics. We share our expertise to help you maintain product quality.' : 'ابق على اطلاع بأحدث الاتجاهات وأفضل الممارسات في النقل المبرد وإدارة سلاسل الإمداد. نشارك خبراتنا لمساعدتك على الحفاظ على جودة المنتجات.')}
                </p>
              </div>
              <div className="shrink-0 mt-4 md:mt-0">
                <Link to={`/${i18n.language === 'en' ? 'en/blog' : 'blog'}`} className="group inline-flex items-center gap-3 bg-slate-900 text-white hover:bg-amber-500 px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  {i18n.language === 'en' ? 'View All Articles' : 'تصفح كل المقالات'}
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-amber-500 transition-colors">
                    {i18n.language === 'en' ? <span>&rarr;</span> : <span>&larr;</span>}
                  </div>
                </Link>
              </div>
            </div>

            {/* Dynamic Poster Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apiData.articles.map((article: any, idx: number) => (
                <motion.div 
                  key={article.id || idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative h-[450px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-end border border-slate-200/50"
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 bg-slate-900 z-0">
                    {article.image && article.image.trim() !== '' ? (
                      <img 
                        src={article.image.startsWith('/') ? article.image : article.image} 
                        alt={article[`title_${i18n.language}`] || article.title_ar} 
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-1000 ease-out opacity-80 group-hover:opacity-60" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 opacity-80 group-hover:opacity-60 transition-opacity duration-700 flex items-center justify-center">
                        <FileText className="w-32 h-32 text-slate-700/50" />
                      </div>
                    )}
                  </div>
                  
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Category Badge - Top */}
                  <div className="absolute top-6 start-6 z-20">
                    {article.category && (
                      <span className="inline-block bg-amber-500 text-slate-900 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                        {article.category}
                      </span>
                    )}
                  </div>

                  {/* Content - Bottom */}
                  <div className="relative z-20 p-8 text-start">
                    <div className="flex items-center gap-3 text-amber-400 text-sm font-bold mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.created_at || Date.now()).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-4 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors duration-300 drop-shadow-md">
                      {article[`title_${i18n.language}`] || article.title_ar}
                    </h3>
                    
                    {/* Hidden Description that slides up on hover */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                      <div className="overflow-hidden">
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed line-clamp-2 mb-6">
                          {article[`content_${i18n.language}`] ? article[`content_${i18n.language}`].replace(/<[^>]+>/g, '').substring(0, 150) + '...' : (article.content_ar ? article.content_ar.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '')}
                        </p>
                        
                        <Link to={`/${i18n.language === 'en' ? 'en/blog' : 'blog'}/${article.slug || article.id}`} className="inline-flex items-center gap-3 text-white font-bold hover:text-amber-400 transition-colors">
                          <span className="relative">
                            {i18n.language === 'en' ? 'Read Full Article' : 'قراءة المقال كاملاً'}
                            <span className="absolute -bottom-1 start-0 w-full h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-start duration-300"></span>
                          </span>
                          <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-amber-400">
                            {i18n.language === 'en' ? <span>&rarr;</span> : <span>&larr;</span>}
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section (Premium Dark & Gold) */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 relative overflow-hidden">
        {/* Unique Directional Chevron Divider with Glow */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-30 pointer-events-none -translate-y-[1px]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+2px)] h-[80px] md:h-[140px] lg:h-[180px]">
            <path d="M0,0 L600,120 L1200,0 Z" className="fill-[#F8FAFC] drop-shadow-xl"></path>
            <path d="M0,0 L600,120 L1200,0" fill="none" stroke="url(#amberGlow)" strokeWidth="3"></path>
            <defs>
              <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(245,158,11,0)" />
                <stop offset="50%" stopColor="rgba(245,158,11,1)" />
                <stop offset="100%" stopColor="rgba(245,158,11,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Background Canvas */}
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
        
        {/* Dynamic Abstract Lighting */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-5xl mx-auto bg-slate-900/50 backdrop-blur-2xl p-10 md:p-16 lg:p-20 rounded-[3rem] border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.05)] relative overflow-hidden"
          >
            {/* Glowing inner top border */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

            {(() => {
              const ctaMeta = (apiData.settings as any)?.ctaMeta || {};
              const title = ctaMeta[`title_${i18n.language}`] || t('home.cta.title');
              const desc = ctaMeta[`desc_${i18n.language}`] || t('home.cta.desc');
              const btn1 = ctaMeta[`btn1_${i18n.language}`] || t('home.cta.bookBtn');
              const btn2 = ctaMeta[`btn2_${i18n.language}`] || t('home.cta.waBtn');
              return (
                <>
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_10px_30px_rgba(245,158,11,0.3)] transform -rotate-3 hover:rotate-0 transition-transform duration-500 border border-white/20">
                     <Truck className="w-12 h-12 text-slate-900" />
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-[1.2] drop-shadow-md">
                    {title}
                  </h2>
                  <p className="text-xl md:text-2xl text-slate-300 mb-14 font-medium max-w-3xl mx-auto leading-relaxed">
                    {desc}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                    {/* Primary Button */}
                    <Link to={i18n.language === 'en' ? '/en/contact' : '/contact'} className="group relative overflow-hidden bg-amber-500 text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-amber-400 transition-all duration-300 shadow-[0_15px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out"></div>
                      <span className="relative z-10">{btn1}</span>
                      <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors">
                        {i18n.language === 'en' ? <span>&rarr;</span> : <span>&larr;</span>}
                      </span>
                    </Link>

                    {/* Premium WhatsApp Button */}
                    <a href={`https://wa.me/${apiData.contact?.whatsapp || ''}`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-[#25D366] text-white border border-slate-700/80 hover:border-[#25D366] backdrop-blur-md px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-[0_15px_40px_rgba(37,211,102,0.3)] hover:-translate-y-1 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out"></div>
                      <div className="w-10 h-10 rounded-full bg-[#25D366]/20 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 relative z-10">
                        <WhatsAppIcon className="w-6 h-6 text-[#25D366] group-hover:text-white transition-colors" />
                      </div>
                      <span className="relative z-10">{btn2}</span>
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
