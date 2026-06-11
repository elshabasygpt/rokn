import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, MessageCircle, Percent, Truck, Globe, ShieldCheck, Snowflake, MapPin, Activity, CheckCircle2, ChevronRight, ChevronDown, Home, Package, Image as ImageIcon, Info, FileText, Briefcase, PhoneCall, Factory, FlaskConical, Utensils, Store, Warehouse, Mail, Clock, Building, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { initAttribution } from '../lib/attribution';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 448 512"
    fill="currentColor"
    className={className}
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

export default function Layout() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPromoVisible, setIsPromoVisible] = useState(true);
  
  // Initialize settings from localStorage to prevent "flash of old data"
  const [settings, setSettings] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('siteSettings');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });
  const [cities, setCities] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('siteCities');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [industries, setIndustries] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('siteIndustries');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const location = useLocation();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    Promise.all([
      fetch(`${API_URL}/api/settings`).then(res => res.json()),
      fetch(`${API_URL}/api/cities`).then(res => res.json()),
      fetch(`${API_URL}/api/industries`).then(res => res.json())
    ]).then(([settingsData, citiesData, industriesData]) => {
      if (settingsData && settingsData.general) {
        const newSettings = { ...settingsData.general, ...settingsData };
        setSettings(newSettings);
        localStorage.setItem('siteSettings', JSON.stringify(newSettings));
      }
      
      if (Array.isArray(citiesData)) {
        setCities(citiesData);
        localStorage.setItem('siteCities', JSON.stringify(citiesData));
      }
      
      if (Array.isArray(industriesData)) {
        setIndustries(industriesData);
        localStorage.setItem('siteIndustries', JSON.stringify(industriesData));
      }
    }).catch(console.error);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const isEn = location.pathname === '/en' || location.pathname.startsWith('/en/');
    if (isEn && i18n.language !== 'en') i18n.changeLanguage('en');
    if (!isEn && i18n.language !== 'ar') i18n.changeLanguage('ar');
  }, [location.pathname, i18n.language, i18n]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    const isEn = location.pathname === '/en' || location.pathname.startsWith('/en/');
    if (isEn) {
      navigate(location.pathname.replace(/^\/en/, '') || '/');
    } else {
      navigate('/en' + (location.pathname === '/' ? '' : location.pathname));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trackWhatsAppClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_whatsapp', {
        event_category: 'Contact',
        event_label: 'WhatsApp Button'
      });
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);

    // Initialize marketing attribution
    initAttribution();

    // Update document title for SEO
    let title = i18n.language === 'en' ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد';
    if (i18n.language === 'en') title = 'Rokn Elryan Refrigerated Transport';
    
    if (location.pathname === '/services') title += i18n.language === 'en' ? ' | Services' : ' | خدماتنا';
    else if (location.pathname === '/gallery') title += i18n.language === 'en' ? ' | Gallery' : ' | معرض الأعمال';
    else if (location.pathname === '/about') title += i18n.language === 'en' ? ' | About Us' : ' | من نحن';
    else if (location.pathname === '/contact') title += i18n.language === 'en' ? ' | Contact Us' : ' | اتصل بنا';

    document.title = title;

    // Track page view in Google Analytics
    if (typeof window !== 'undefined' && settings?.googleAnalyticsId) {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      function gtag(...args: any[]){ w.dataLayer.push(args); }
      gtag('config', settings.googleAnalyticsId, {
        page_path: location.pathname + location.search
      });
    }
  }, [location.pathname, i18n.language]);

  const Logo = () => {
    const currentLang = i18n.language;
    let headerLogoRaw = currentLang === 'en' ? settings.logo_header_en : settings.logo_header_ar;
    if (!headerLogoRaw) headerLogoRaw = settings.logo; // fallback
    const headerLogoUrl = headerLogoRaw ? (headerLogoRaw.startsWith('/') ? headerLogoRaw : headerLogoRaw) : "/logo.png";
    
    return (
    <Link to={i18n.language === 'en' ? '/en' : '/'} className="flex items-center gap-3 group shrink-0" aria-label="Home">
      <div className="relative flex items-center justify-center">
        <img 
          src={headerLogoUrl} 
          alt={t('layout.logo.alt')} 
          className={`w-auto object-contain transition-all duration-300 group-hover:scale-[1.02] ${isScrolled ? 'h-20 md:h-24 lg:h-28' : 'h-32 md:h-[140px] lg:h-[160px] 2xl:h-[180px]'}`} 
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} 
        />
        {/* Fallback Logo if image missing */}
        <div className="hidden fallback-logo items-center gap-2">
          <div className={`bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <Truck className={`${isScrolled ? 'w-5 h-5' : 'w-6 h-6'} text-slate-900`} />
          </div>
          <div className="flex flex-col">
            <span className={`font-black tracking-tight text-slate-900 leading-none ${isScrolled ? 'text-lg' : 'text-xl'}`}>{t('layout.logo.title')}</span>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-1">{t('layout.logo.subtitle')}</span>
          </div>
        </div>
      </div>
    </Link>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 focus:outline-none selection:bg-amber-500 selection:text-slate-900 pb-20 md:pb-0 font-${i18n.language === 'en' ? 'sans' : 'cairo'}`}>
      {settings.googleSiteVerification || settings.googleAnalyticsId || settings.company_info ? (
        <Helmet>
          {settings.googleSiteVerification && <meta name="google-site-verification" content={settings.googleSiteVerification} />}
          {settings.googleAnalyticsId && <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}></script>}
          {settings.googleAnalyticsId && (
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.googleAnalyticsId}', { page_path: window.location.pathname });
            `}} />
          )}
          {settings.company_info && (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": settings.company_info.name || "شركة ركن الريان",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "SA",
                "addressRegion": settings.company_info.region,
                "addressLocality": settings.company_info.city,
                "streetAddress": settings.company_info.street + (settings.company_info.district ? ` - حي ${settings.company_info.district}` : ''),
                "postalCode": settings.company_info.postal_code
              },
              "vatID": settings.company_info.vat_number,
              "telephone": settings.company_info.phone,
              "email": settings.company_info.email,
              "url": "https://www.roknelryan.com",
              "logo": "https://www.roknelryan.com/logo.png"
            })}} />
          )}
        </Helmet>
      ) : null}

      {/* Promo Banner */}
      <AnimatePresence>
        {isPromoVisible && settings.promo?.enabled && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-b border-yellow-200/50 text-slate-900 overflow-hidden relative z-50 group shadow-lg"
          >
            {/* Background Texture & Animated Gradients */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="container mx-auto px-4 py-3 md:py-4 grid grid-cols-[1fr_auto] gap-2 md:gap-4 items-center min-h-[60px]">
              {/* Content Column */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-[15px] md:text-[18px] font-bold text-center w-full">
                <span className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-yellow-400 shadow-[0_0_15px_rgba(0,0,0,0.15)] animate-pulse shrink-0">
                  <Percent className="w-5 h-5 md:w-6 md:h-6" />
                </span>
                <span className="text-slate-900 tracking-wide flex flex-wrap items-center justify-center gap-3">
                  <span className="text-slate-900 font-black tracking-widest text-sm md:text-base bg-white/40 px-3 py-1 rounded border border-slate-900/10 flex items-center gap-1.5 shrink-0 shadow-sm">
                    <span className="md:hidden"><Percent className="w-4 h-4" /></span>
                    {i18n.language === 'en' ? 'SPECIAL OFFER' : 'عرض خاص'}
                  </span>
                  <span>{settings.promo[`text_${i18n.language}` as 'text_ar'|'text_en'] || settings.promo.text_ar || t('layout.promoBanner')}</span>
                </span>
                
                <Link to={i18n.language === 'en' ? "/en/contact" : "/contact"} className="hidden lg:flex items-center gap-2 text-base bg-slate-900 text-yellow-400 px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all hover:scale-105 shadow-md font-black border border-slate-800 shrink-0">
                  {i18n.language === 'en' ? 'Claim Offer Now' : 'احجز واستفد من العرض'}
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </Link>
              </div>
              
              {/* Close Button Column */}
              <button 
                onClick={() => setIsPromoVisible(false)}
                className="text-slate-800 hover:text-slate-950 hover:bg-black/10 p-2 rounded-full transition-colors flex items-center justify-center self-start md:self-center shrink-0"
                aria-label={t('layout.promoBtn')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar (Contact Info) */}
      <div className="bg-slate-950 py-3 2xl:py-4 hidden lg:block text-[17px] lg:text-[19px] 2xl:text-[22px] border-b border-white/5 relative z-50">
        <div className="w-full max-w-[1920px] mx-auto px-4 lg:px-8 2xl:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 xl:gap-4 2xl:gap-6">
            {settings.phone1 && (
              <a href={`tel:${settings.phone1}`} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 xl:px-5 xl:py-2.5 2xl:px-6 2xl:py-3 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all group shadow-sm" dir="ltr">
                <div className="bg-amber-500/10 p-1.5 rounded-lg group-hover:bg-amber-500 transition-colors">
                  <Phone className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-amber-500 group-hover:text-slate-900 transition-colors" />
                </div>
                <span className="flex gap-2 items-center"><span className="text-slate-400 font-bold">{i18n.language === 'en' ? 'Support:' : 'الدعم:'}</span> <span className="text-white font-black tracking-widest">{settings.phone1}</span></span>
              </a>
            )}
            {settings.phone2 && (
              <a href={`tel:${settings.phone2}`} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 xl:px-5 xl:py-2.5 2xl:px-6 2xl:py-3 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all group shadow-sm" dir="ltr">
                <div className="bg-amber-500/10 p-1.5 rounded-lg group-hover:bg-amber-500 transition-colors">
                  <Phone className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-amber-500 group-hover:text-slate-900 transition-colors" />
                </div>
                <span className="flex gap-2 items-center"><span className="text-slate-400 font-bold">{i18n.language === 'en' ? 'Sales:' : 'المبيعات:'}</span> <span className="text-white font-black tracking-widest">{settings.phone2}</span></span>
              </a>
            )}
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 px-4 py-2 xl:px-5 xl:py-2.5 2xl:px-6 2xl:py-3 rounded-2xl border border-[#25D366]/20 hover:border-[#25D366]/50 transition-all group shadow-sm" dir="ltr">
                <div className="bg-[#25D366]/20 p-1.5 rounded-lg group-hover:bg-[#25D366] transition-colors">
                  <WhatsAppIcon className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#25D366] group-hover:text-white transition-colors" />
                </div>
                <span className="text-white font-black tracking-widest">{settings.whatsapp}</span>
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 xl:px-5 xl:py-2.5 2xl:px-6 2xl:py-3 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all group shadow-sm">
                <div className="bg-amber-500/10 p-1.5 rounded-lg group-hover:bg-amber-500 transition-colors">
                  <Mail className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-amber-500 group-hover:text-slate-900 transition-colors" />
                </div>
                <span className="text-white font-bold">{settings.email}</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-3 text-amber-400 font-black bg-amber-500/10 px-6 py-2.5 2xl:py-3 rounded-2xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
               <Clock className="w-5 h-5 xl:w-6 xl:h-6" />
               <span>{i18n.language === 'en' ? 'Available 24/7' : 'نعمل على مدار الساعة'}</span>
             </span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-white/90 backdrop-blur-lg border-b border-slate-200/50'}`}>
        <div className={`w-full max-w-[1920px] mx-auto px-4 lg:px-8 2xl:px-12 flex items-center justify-between gap-4 2xl:gap-8 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5 md:py-6'}`}>
          <div className="shrink-0 flex items-center">
            <Logo />
          </div>
          
          {/* Desktop Nav - Clean Enterprise Layout */}
          <div className="hidden xl:flex flex-1 items-center justify-center gap-8 lg:gap-10 2xl:gap-14 px-4">
            {[
              { path: '', label: t('layout.nav.home'), icon: Home },
              { path: 'services', label: t('layout.nav.services'), icon: Package },
              { path: 'industries', label: i18n.language === 'en' ? 'Industries' : 'القطاعات', icon: Activity, isDropdown: true, items: industries, type: 'industry' },
              { path: 'locations', label: i18n.language === 'en' ? 'Coverage' : 'التغطية', icon: MapPin, isDropdown: true, items: cities, type: 'city' },
              { path: 'company', label: i18n.language === 'en' ? 'Company' : 'الشركة', icon: Globe, isDropdown: true, type: 'company', items: [
                  { slug: 'about', name_en: 'About Us', name_ar: 'من نحن', icon: Info, desc_en: 'Discover our history and mission.', desc_ar: 'اكتشف تاريخنا ورؤيتنا' },
                  { slug: 'case-studies', name_en: 'Case Studies', name_ar: 'دراسات الحالة', icon: FileText, desc_en: 'Real-world success stories.', desc_ar: 'قصص نجاح واقعية لعملائنا' },
                  { slug: 'fleet', name_en: 'Our Fleet', name_ar: 'أسطولنا', icon: Truck, desc_en: 'Advanced refrigerated trucks.', desc_ar: 'شاحنات مبردة متطورة' },
                  { slug: 'blog', name_en: 'Knowledge Center', name_ar: 'مركز المعرفة', icon: FileText, desc_en: 'Latest news and articles.', desc_ar: 'أحدث الأخبار والمقالات اللوجستية' },
                  { slug: 'compliance', name_en: 'Operational Standards', name_ar: 'معايير الامتثال', icon: ShieldCheck, desc_en: 'Quality & safety guidelines.', desc_ar: 'معايير الجودة والسلامة' },
                  { slug: 'calculator', name_en: 'Payload Calculator', name_ar: 'حاسبة سعة الشاحنات', icon: Package, desc_en: 'Estimate your truck capacity.', desc_ar: 'احسب سعة الشاحنة المطلوبة' },
                  { slug: 'checker', name_en: 'Compliance Checker', name_ar: 'فحص الجاهزية الذكي', icon: CheckCircle2, desc_en: 'Check shipment readiness.', desc_ar: 'تحقق من جاهزية شحنتك' },
                  { slug: 'careers', name_en: 'Careers', name_ar: 'التوظيف', icon: Briefcase, desc_en: 'Join our growing team.', desc_ar: 'انضم إلى فريقنا المتميز' },
                  { slug: 'faq', name_en: 'Help & FAQs', name_ar: 'مركز المساعدة', icon: MessageCircle, desc_en: 'Find answers quickly.', desc_ar: 'إجابات للأسئلة الشائعة' }
              ]},
              { path: 'contact', label: t('layout.nav.contact'), icon: PhoneCall },
            ].map(link => {
              const fullPath = i18n.language === 'en' ? `/en${link.path ? `/${link.path}` : ''}` : `/${link.path}`;
              const isActive = link.path === '' 
                ? (location.pathname === '/' || location.pathname === '/en') 
                : (link.type === 'company' 
                    ? link.items?.some((item:any) => location.pathname.includes(`/${item.slug}`)) 
                    : location.pathname.includes(`/${link.path}`));
              
              if (link.isDropdown) {
                const isMegaMenu = link.items && (link.items.length > 8 || link.type === 'industry' || link.type === 'city' || link.type === 'company');

                return (
                  <div key={link.path} className="relative group">
                    <button className={`flex items-center gap-2 py-2 text-[19px] lg:text-[20px] 2xl:text-[22px] font-bold whitespace-nowrap transition-all duration-300 relative ${isActive ? 'text-amber-600' : 'text-slate-700 hover:text-amber-600'}`}>
                      <span className="relative z-10">{link.label}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-amber-500 group-hover:rotate-180'}`} />
                      <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[4px] rounded-t-full bg-amber-500 transition-all duration-300 ${isActive ? 'w-[70%] opacity-100' : 'w-0 opacity-0 group-hover:w-[70%] group-hover:opacity-100'}`}></span>
                    </button>
                    
                    <div className={`absolute top-full mt-4 w-[95vw] lg:w-[1150px] xl:w-[1400px] 2xl:w-[1550px] max-w-[1800px] start-1/2 rtl:translate-x-1/2 ltr:-translate-x-1/2 bg-white rounded-[2rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.25)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-3 group-hover:translate-y-0 z-50 overflow-hidden p-8 lg:p-10 flex gap-10 lg:gap-12`}>
                      
                      {/* Left Side: Navigation Links (RTL: Right Side) */}
                      <div className="flex-1 px-4 py-2 flex flex-col justify-center">
                        
                        {/* Company Menu */}
                        {link.type === 'company' && (
                          <div className="grid grid-cols-3 gap-10 xl:gap-16 text-start w-full">
                            {[
                              { title: i18n.language === 'en' ? 'About Company' : 'الشركة والأسطول', items: [
                                { label_ar: 'من نحن', label_en: 'About Us', slug: 'about', icon: Building },
                                { label_ar: 'أسطولنا', label_en: 'Our Fleet', slug: 'fleet', icon: Truck },
                                { label_ar: 'دراسات الحالة', label_en: 'Case Studies', slug: 'case-studies', icon: Briefcase }
                              ] },
                              { title: i18n.language === 'en' ? 'Tools & Standards' : 'الأدوات والمعايير', items: [
                                { label_ar: 'معايير الامتثال', label_en: 'Operational Standards', slug: 'compliance', icon: ShieldCheck },
                                { label_ar: 'حاسبة الشحنات', label_en: 'Payload Calculator', slug: 'calculator', icon: Percent },
                                { label_ar: 'فحص الجاهزية', label_en: 'Compliance Checker', slug: 'checker', icon: CheckCircle2 }
                              ] },
                              { title: i18n.language === 'en' ? 'Resources' : 'الموارد', items: [
                                { label_ar: 'مركز المعرفة', label_en: 'Knowledge Center', slug: 'blog', icon: FileText },
                                { label_ar: 'التوظيف', label_en: 'Careers', slug: 'careers', icon: Activity },
                                { label_ar: 'الأسئلة الشائعة', label_en: 'Help & FAQs', slug: 'faq', icon: MessageCircle }
                              ] }
                            ].map((col, idx) => (
                              <div key={idx} className="flex flex-col">
                                <h4 className="text-[20px] lg:text-[22px] font-black text-slate-900 mb-6">{col.title}</h4>
                                <ul className="space-y-2">
                                  {col.items.map((item: any, i: number) => {
                                    const ItemIcon = item.icon;
                                    return (
                                      <li key={i}>
                                        <Link to={i18n.language === 'en' ? `/en/${item.slug}` : `/${item.slug}`} className="group/item flex items-center gap-4 p-3 -mx-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
                                          <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0 rounded-full bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center group-hover/item:border-amber-200 group-hover/item:bg-amber-50 group-hover/item:shadow-[0_4px_12px_-4px_rgba(245,158,11,0.3)] transition-all">
                                            <ItemIcon className="w-5 h-5 lg:w-6 lg:h-6 text-slate-400 group-hover/item:text-amber-500 group-hover/item:scale-110 transition-transform duration-300" />
                                          </div>
                                          <div>
                                            <span className="text-[17px] lg:text-[19px] font-bold text-slate-700 group-hover/item:text-amber-600 transition-colors block">{i18n.language === 'en' ? item.label_en : item.label_ar}</span>
                                          </div>
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Industries Menu */}
                        {link.type === 'industry' && (
                          <div className="w-full">
                            <h4 className="text-[20px] lg:text-[22px] font-black text-slate-900 mb-6 text-start">{i18n.language === 'en' ? 'Industries We Serve' : 'القطاعات التي نخدمها'}</h4>
                            <div className="grid grid-cols-2 gap-6 lg:gap-8">
                              {(link.items || []).slice(0, 6).map((item: any) => {
                                const itemPath = i18n.language === 'en' ? `/en/industries/${item.slug}` : `/industries/${item.slug}`;
                                let ItemIcon = Activity;
                                const name = ((item.name_en || '') + ' ' + (item.name_ar || '')).toLowerCase();
                                if (name.includes('food') || name.includes('مصانع') || name.includes('أغذية')) ItemIcon = Factory;
                                else if (name.includes('pharma') || name.includes('أدوية')) ItemIcon = FlaskConical;
                                else if (name.includes('restaurant') || name.includes('مقهى') || name.includes('مطاعم') || name.includes('كافيهات')) ItemIcon = Utensils;
                                else if (name.includes('retail') || name.includes('تجزئة')) ItemIcon = Store;
                                else if (name.includes('warehouse') || name.includes('مستودعات')) ItemIcon = Warehouse;
                                else if (name.includes('distribution') || name.includes('توزيع')) ItemIcon = Truck;
                                else ItemIcon = Activity;

                                return (
                                  <Link key={item.slug} to={itemPath} className="group/card flex items-center justify-between bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl px-6 py-5 hover:border-amber-400 hover:shadow-[0_8px_20px_-6px_rgba(245,158,11,0.3)] transition-all duration-300">
                                    <span className="font-black text-[17px] lg:text-[19px] text-slate-700 group-hover/card:text-amber-600">{i18n.language === 'en' ? item.name_en : item.name_ar}</span>
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white group-hover/card:bg-amber-50 border border-slate-200 group-hover/card:border-amber-200 flex items-center justify-center transition-colors shadow-sm">
                                      <ItemIcon className="w-5 h-5 lg:w-6 lg:h-6 text-slate-400 group-hover/card:text-amber-500 group-hover/card:scale-110 transition-transform" />
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Coverage (Cities) Menu */}
                        {link.type === 'city' && (() => {
                          const sortedCities = link.items || [];

                          return (
                          <div className="w-full flex gap-10 xl:gap-16">
                            <div className="flex-[2.5] xl:flex-[3]">
                              <h4 className="text-[22px] lg:text-[24px] font-black text-slate-900 mb-8 text-start">{i18n.language === 'en' ? 'Main Cities' : 'المدن الرئيسية'}</h4>
                              <div className="grid grid-cols-4 gap-5 lg:gap-6">
                                {sortedCities.slice(0, 8).map((item: any) => {
                                  const itemPath = i18n.language === 'en' ? `/en/locations/${item.slug}` : `/locations/${item.slug}`;
                                  let CityIcon = MapPin;
                                  const name = ((item.name_en || '') + ' ' + (item.name_ar || '')).toLowerCase();
                                  if (name.includes('makkah') || name.includes('مكة')) CityIcon = Building; // Can use specific icons if needed, using Building as generic.
                                  if (name.includes('riyadh') || name.includes('رياض')) CityIcon = Building;
                                  if (name.includes('jeddah') || name.includes('جدة')) CityIcon = FlaskConical; // Sample from mockup icon shapes
                                  
                                  return (
                                    <Link key={item.slug} to={itemPath} className="group/city flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 hover:border-amber-400 hover:shadow-[0_8px_20px_-6px_rgba(245,158,11,0.3)] transition-all duration-300">
                                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white group-hover/city:bg-amber-50 border border-slate-200 group-hover/city:border-amber-200 flex items-center justify-center transition-colors shadow-sm">
                                        <CityIcon className="w-6 h-6 lg:w-7 lg:h-7 text-slate-400 group-hover/city:text-amber-500 group-hover/city:scale-110 transition-transform" />
                                      </div>
                                      <span className="font-black text-[16px] lg:text-[18px] text-slate-700 group-hover/city:text-amber-600 text-center">{i18n.language === 'en' ? item.name_en : item.name_ar}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex-1 ps-8 lg:ps-12 border-s border-slate-200">
                              <h4 className="text-[22px] lg:text-[24px] font-black text-slate-900 mb-8 text-start">{i18n.language === 'en' ? 'Other Areas' : 'مناطق أخرى'}</h4>
                              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                {sortedCities.slice(8).map((item: any) => {
                                  const itemPath = i18n.language === 'en' ? `/en/locations/${item.slug}` : `/locations/${item.slug}`;
                                  return (
                                    <Link key={item.slug} to={itemPath} className="flex items-center gap-2.5 text-slate-600 hover:text-amber-600 transition-colors group">
                                      <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform shrink-0"></span>
                                      <span className="font-bold text-[15px] lg:text-[16px] truncate" title={i18n.language === 'en' ? item.name_en : item.name_ar}>{i18n.language === 'en' ? item.name_en : item.name_ar}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          );
                        })()}
                        
                        {(!link.items || link.items.length === 0) && (link.type === 'city' || link.type === 'industry') && (
                          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3 w-full">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-amber-500 animate-spin"></div>
                            <span className="text-sm font-semibold">{i18n.language === 'en' ? 'Loading...' : 'جاري التحميل...'}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Side: Visual Panel Box (RTL: Left Side) */}
                      <div className="w-[360px] lg:w-[400px] xl:w-[420px] rounded-[1.5rem] relative overflow-hidden flex flex-col shrink-0 shadow-xl group/panel">
                        <div className="absolute inset-0 z-0">
                          <img 
                            src={
                              link.type === 'industry' 
                                ? (settings.nav_industry_bg || 'https://images.unsplash.com/photo-1586528116311-ad8ed7e66364?q=80&w=600&auto=format&fit=crop')
                                : link.type === 'city'
                                ? (settings.nav_city_bg || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop')
                                : (settings.nav_company_bg || 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=600&auto=format&fit=crop')
                            }
                            alt="Visual Panel"
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover/panel:scale-110 ${link.type === 'city' ? 'opacity-80' : ''}`}
                          />
                          <div className={`absolute inset-0 ${link.type === 'city' ? 'bg-slate-900/80' : 'bg-slate-900/70'}`}></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                        </div>

                        <div className="relative z-10 flex-1 p-8 lg:p-10 flex flex-col text-white text-start">
                          <h3 className="text-[26px] lg:text-[28px] font-black mb-4 leading-tight text-white drop-shadow-lg">
                            {link.type === 'industry' 
                              ? (i18n.language === 'en' ? 'Custom Solutions for Every Sector' : 'حلول لوجستية مخصصة لكل قطاع')
                              : link.type === 'city'
                              ? (i18n.language === 'en' ? 'Covering all KSA Cities' : 'نغطي جميع مدن المملكة')
                              : (i18n.language === 'en' ? 'Leading Refrigerated Transport' : 'شركة رائدة في النقل المبرد')}
                          </h3>
                          <p className="text-[16px] lg:text-[18px] text-slate-200 leading-relaxed font-semibold mb-10 drop-shadow-md">
                            {link.type === 'industry' 
                              ? (i18n.language === 'en' ? 'We provide integrated refrigerated transport solutions that suit your business needs.' : 'نقدم حلول نقل مبرد متكاملة تناسب احتياجات عملك.')
                              : link.type === 'city'
                              ? (i18n.language === 'en' ? 'A wide logistics network to serve you everywhere.' : 'شبكة لوجستية واسعة لخدمتكم في كل مكان.')
                              : (i18n.language === 'en' ? 'Committed to the highest quality standards and cold chain safety.' : 'نلتزم بأعلى معايير الجودة وسلامة السلسلة الباردة.')}
                          </p>

                          <div className="mt-auto">
                            {link.type === 'city' ? (
                              <Link to={i18n.language === 'en' ? '/en/locations' : '/locations'} className="w-fit bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-black text-[17px] lg:text-[19px] flex items-center justify-center gap-3 transition-all duration-300 shadow-lg">
                                {i18n.language === 'en' ? 'View All Cities' : 'عرض جميع المدن'}
                                <ChevronRight className="w-5 h-5 rtl:-scale-x-100" />
                              </Link>
                            ) : (
                              <Link to={i18n.language === 'en' ? '/en/enterprise-quote' : '/enterprise-quote'} className="w-fit bg-amber-500 text-slate-900 hover:bg-amber-400 px-8 py-4 rounded-xl font-black text-[17px] lg:text-[19px] flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-amber-500/20">
                                {i18n.language === 'en' ? 'Get a Quote' : 'احصل على عرض سعر'}
                                <ChevronRight className="w-5 h-5 rtl:-scale-x-100" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link 
                  key={link.path}
                  to={fullPath} 
                  className={`flex items-center py-2 text-[19px] lg:text-[20px] 2xl:text-[22px] font-bold whitespace-nowrap transition-all duration-300 relative group ${isActive ? 'text-amber-600' : 'text-slate-700 hover:text-amber-600'}`}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[4px] rounded-t-full bg-amber-500 transition-all duration-300 ${isActive ? 'w-[70%] opacity-100' : 'w-0 opacity-0 group-hover:w-[70%] group-hover:opacity-100'}`}></span>
                </Link>
              );
            })}
          </div>

            <div className="flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-3 2xl:gap-5">
              <button onClick={toggleLanguage} className="flex items-center justify-center gap-2.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-4 py-3 2xl:px-5 2xl:py-4 rounded-xl transition-all border-2 border-slate-200 hover:border-amber-400 font-bold text-[17px] 2xl:text-[19px] shadow-sm" title={i18n.language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}>
                <Globe className="w-6 h-6 2xl:w-7 2xl:h-7 text-amber-500" />
                <span>{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
              
              <Link to={i18n.language === 'en' ? '/en/contact' : '/contact'} className="bg-amber-500 text-slate-900 px-6 lg:px-8 2xl:px-10 py-3 2xl:py-4 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 text-[18px] 2xl:text-[20px] flex items-center gap-3 group border border-amber-400 hover:border-amber-300 whitespace-nowrap shrink-0">
                {i18n.language === 'en' ? 'Get a Quote' : 'احصل على عرض سعر'}
                <Truck className="w-5 h-5 2xl:w-6 2xl:h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="xl:hidden text-slate-900 p-2 bg-slate-50 rounded-xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Trust Bar below navigation */}
        <div className={`hidden lg:block border-t border-slate-100/60 bg-slate-50/50 transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-16 opacity-100'}`}>
          <div className="w-full max-w-[1920px] mx-auto px-4 lg:px-8 2xl:px-12 h-full flex justify-center items-center text-[16px] xl:text-[18px] 2xl:text-[20px] font-bold text-slate-600">
             <div className="flex items-center justify-center gap-6 xl:gap-24 w-full px-2">
               <span className="flex items-center gap-2 xl:gap-3 whitespace-nowrap"><MapPin className="w-5 h-5 xl:w-6 xl:h-6 text-amber-500"/> <span className="hidden xl:inline">{i18n.language === 'en' ? 'Nationwide Coverage' : 'تغطية جميع مدن المملكة'}</span><span className="xl:hidden">{i18n.language === 'en' ? 'Nationwide' : 'تغطية شاملة'}</span></span>
               <span className="flex items-center gap-2 xl:gap-3 whitespace-nowrap"><Activity className="w-5 h-5 xl:w-6 xl:h-6 text-amber-500"/> <span className="hidden xl:inline">{i18n.language === 'en' ? '24/7 Temp Monitoring' : 'مراقبة حرارة 24/7'}</span><span className="xl:hidden">24/7</span></span>
               <span className="flex items-center gap-2 xl:gap-3 whitespace-nowrap"><CheckCircle2 className="w-5 h-5 xl:w-6 xl:h-6 text-amber-500"/> <span className="hidden xl:inline">{i18n.language === 'en' ? '5000+ Successful Trips' : 'أكثر من 5000 رحلة ناجحة'}</span><span className="xl:hidden">+5000 رحلة</span></span>
               <span className="flex items-center gap-2 xl:gap-3 whitespace-nowrap"><Snowflake className="w-5 h-5 xl:w-6 xl:h-6 text-amber-500"/> <span className="hidden xl:inline">{i18n.language === 'en' ? 'Full Cold Chain Compliance' : 'التزام كامل بسلسلة التبريد'}</span><span className="xl:hidden">سلسلة التبريد</span></span>
             </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-slate-100 flex flex-col p-4 gap-2 font-semibold text-slate-700 max-h-[80vh] overflow-y-auto">
            <button onClick={toggleLanguage} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-amber-600 bg-amber-50/50">
              <Globe className="w-5 h-5" />
              {i18n.language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            </button>
            <div className="h-px bg-slate-100 my-1"></div>
            {[
              { path: '', label: t('layout.nav.home'), icon: Home },
              { path: 'services', label: t('layout.nav.services'), icon: Package },
              { path: 'industries', label: i18n.language === 'en' ? 'Industries' : 'القطاعات', icon: Activity, isDropdown: true, items: industries, type: 'industry' },
              { path: 'locations', label: i18n.language === 'en' ? 'Coverage' : 'التغطية', icon: MapPin, isDropdown: true, items: cities, type: 'city' },
              { path: 'company', label: i18n.language === 'en' ? 'Company' : 'الشركة', icon: Globe, isDropdown: true, type: 'company', items: [
                  { slug: 'about', name_en: 'About Us', name_ar: 'من نحن' },
                  { slug: 'case-studies', name_en: 'Case Studies', name_ar: 'دراسات الحالة' },
                  { slug: 'fleet', name_en: 'Our Fleet', name_ar: 'أسطولنا' },
                  { slug: 'blog', name_en: 'Knowledge Center', name_ar: 'مركز المعرفة' },
                  { slug: 'compliance', name_en: 'Operational Standards', name_ar: 'معايير الامتثال' },
                  { slug: 'calculator', name_en: 'Payload Calculator', name_ar: 'حاسبة سعة الشاحنات' },
                  { slug: 'checker', name_en: 'Compliance Checker', name_ar: 'فحص الجاهزية الذكي' },
                  { slug: 'careers', name_en: 'Careers', name_ar: 'التوظيف' },
                  { slug: 'faq', name_en: 'Help & FAQs', name_ar: 'مركز المساعدة (FAQ)' }
              ]},
              { path: 'contact', label: t('layout.nav.contact'), icon: PhoneCall },
            ].map(link => {
              const Icon = link.icon;
              const isActive = link.path === '' 
                ? (location.pathname === '/' || location.pathname === '/en') 
                : (link.type === 'company' 
                    ? link.items?.some((item:any) => location.pathname.includes(`/${item.slug}`)) 
                    : location.pathname.includes(`/${link.path}`));
              
              if (link.isDropdown) {
                return (
                  <div key={link.path} className="flex flex-col">
                    <div className={`flex items-center gap-4 p-3.5 rounded-xl text-start text-[20px] transition-all font-bold ${isActive ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700 shadow-sm border border-amber-200/60' : 'text-slate-700 border border-transparent'}`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-amber-600 drop-shadow-sm' : 'text-slate-400'}`} />
                      {link.label}
                    </div>
                    <div className="flex flex-col ps-12 gap-2 mt-1">
                      {link.items?.map((item: any) => {
                        const itemPath = i18n.language === 'en' 
                          ? (link.type === 'company' ? `/en/${item.slug}` : `/en/${link.type === 'industry' ? 'industries' : 'locations'}/${item.slug}`)
                          : (link.type === 'company' ? `/${item.slug}` : `/${link.type === 'industry' ? 'industries' : 'locations'}/${item.slug}`);
                        return (
                          <Link key={item.slug} to={itemPath} className="text-[18px] text-slate-600 hover:text-amber-600 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                            {i18n.language === 'en' ? item.name_en : item.name_ar}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
               <Link key={link.path} to={i18n.language === 'en' ? `/en/${link.path}` : (link.path ? `/${link.path}` : '/')} className={`flex items-center gap-4 p-3.5 rounded-xl text-start text-[20px] transition-all font-bold ${isActive ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700 shadow-sm border border-amber-200/60' : 'hover:bg-slate-50 text-slate-700 border border-transparent'}`} onClick={() => setIsMobileMenuOpen(false)}>
                 <Icon className={`w-6 h-6 ${isActive ? 'text-amber-600 drop-shadow-sm' : 'text-slate-400'}`} />
                 {link.label}
               </Link>
              );
            })}
            <div className="h-px bg-slate-100 my-2"></div>
            <div className="flex flex-col gap-2">
              <a href={`tel:${settings.phone1 || ''}`} className="flex items-center justify-center gap-3 bg-amber-50 text-amber-700 p-4 rounded-xl font-bold text-[18px]" dir="ltr">
                <Phone className="w-5 h-5" />
                <div className="flex flex-col text-left">
                   <span className="text-[10px] text-amber-600/80 uppercase">{i18n.language === 'en' ? 'Support' : 'الدعم'}</span>
                   <span>{settings.phone1 || '050 237 5887'}</span>
                </div>
              </a>
              {settings.phone2 && (
                <a href={`tel:${settings.phone2}`} className="flex items-center justify-center gap-3 bg-amber-50 text-amber-700 p-4 rounded-xl font-bold text-[18px]" dir="ltr">
                  <Phone className="w-5 h-5" />
                  <div className="flex flex-col text-left">
                     <span className="text-[10px] text-amber-600/80 uppercase">{i18n.language === 'en' ? 'Sales' : 'المبيعات'}</span>
                     <span>{settings.phone2}</span>
                  </div>
                </a>
              )}
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-[#25D366]/10 text-[#25D366] p-4 rounded-xl font-bold text-[18px]" dir="ltr">
                  <WhatsAppIcon className="w-5 h-5" />
                  <div className="flex flex-col text-left">
                     <span className="text-[10px] text-[#25D366]/80 uppercase">{i18n.language === 'en' ? 'WhatsApp' : 'تواصل عبر واتساب'}</span>
                     <span>{settings.whatsapp}</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Premium Enterprise Footer */}
      <footer className="bg-slate-950 text-slate-400 relative mt-auto pt-20 border-t border-slate-900">
        {/* Background Gradients & Textures */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-slate-950 to-slate-950 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        {/* Decorative Background */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* 1. Pre-Footer CTA Section */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 mb-20 shadow-2xl relative overflow-hidden group">
            {/* Inner glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] group-hover:bg-amber-500/20 transition-colors duration-700"></div>
            
            <div className="text-start lg:w-7/12 relative z-10">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                {i18n.language === 'en' ? 'Ready to elevate your logistics?' : 'مستعد للارتقاء بخدماتك اللوجستية؟'}
              </h3>
              <p className="text-slate-400 text-lg">
                {i18n.language === 'en' ? 'Join hundreds of major companies relying on Rokn Elryan for secure and efficient refrigerated transport across the Kingdom.' : 'انضم إلى مئات الشركات الكبرى التي تعتمد على ركن الريان للنقل المبرد الآمن والفعال في جميع أنحاء المملكة.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 relative z-10 shrink-0">
              <Link to={i18n.language === 'en' ? '/en/contact' : '/contact'} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(245,158,11,0.2)]">
                {i18n.language === 'en' ? 'Request a Quote' : 'اطلب تسعيرة الآن'}
                <Truck className="w-5 h-5" />
              </Link>
              <a href={`https://wa.me/${settings.whatsapp || ''}`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-[#25D366] text-white border border-slate-700/80 hover:border-[#25D366] backdrop-blur-md px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-[0_15px_40px_rgba(37,211,102,0.3)] hover:-translate-y-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out"></div>
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 relative z-10">
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366] group-hover:text-white transition-colors" />
                </div>
                <span className="relative z-10">{i18n.language === 'en' ? 'WhatsApp Contact' : 'تواصل عبر واتساب'}</span>
              </a>
            </div>
          </div>

          {/* 2. Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-8 2xl:gap-12 mb-16">
            
            {/* Company Overview */}
            <div className="lg:col-span-2 xl:col-span-3 flex flex-col items-start pe-4 lg:pe-12">
              <div className="mb-8 w-full">
                {(() => {
                  const currentLang = i18n.language;
                  let footerLogoRaw = currentLang === 'en' ? settings.logo_footer_en : settings.logo_footer_ar;
                  if (!footerLogoRaw) footerLogoRaw = settings.logo;
                  const footerLogoUrl = footerLogoRaw ? (footerLogoRaw.startsWith('/') ? footerLogoRaw : footerLogoRaw) : "/logo.png";
                  return (
                    <img src={footerLogoUrl} alt={t('layout.logo.alt')} className="w-auto h-auto object-contain max-h-[220px] md:max-h-[280px] drop-shadow-2xl hover:scale-105 transition-transform duration-500" onError={(e) => e.currentTarget.style.display = 'none'} />
                  );
                })()}
              </div>
              <p className="text-slate-400 text-lg md:text-xl leading-loose font-medium text-justify">
                {i18n.language === 'en' 
                  ? (settings.footerMeta?.about_en || t('layout.footer.about'))
                  : (settings.footerMeta?.about_ar || t('layout.footer.about'))}
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-amber-500" />
                {i18n.language === 'en' ? 'Services' : 'خدماتنا'}
              </h4>
              <ul className="space-y-4 font-semibold">
                <li><Link to={i18n.language === 'en' ? '/en/services' : '/services'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Refrigerated Transport' : 'النقل المبرد'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/services' : '/services'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Frozen Transport' : 'النقل المجمد'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/services' : '/services'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Dry Transport' : 'النقل الجاف'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/services' : '/services'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Logistics Contracts' : 'العقود اللوجستية'}</Link></li>
              </ul>
              
              <h4 className="text-white font-black text-lg mt-8 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                {i18n.language === 'en' ? 'Industries' : 'القطاعات'}
              </h4>
              <ul className="space-y-4 font-semibold">
                {(industries || []).map((industry) => (
                  <li key={industry.slug}>
                    <Link to={i18n.language === 'en' ? `/en/industries/${industry.slug}` : `/industries/${industry.slug}`} className="flex items-center gap-2 hover:text-amber-500 transition-colors group">
                      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> 
                      {i18n.language === 'en' ? industry.name_en : industry.name_ar}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coverage Areas */}
            <div className="lg:col-span-1 xl:col-span-1">
              <h4 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                {i18n.language === 'en' ? 'Coverage' : 'تغطيتنا'}
              </h4>
              <div className="flex flex-wrap gap-2.5 font-semibold">
                {(cities || []).slice(0, 14).map((city) => (
                  <Link key={city.slug} to={i18n.language === 'en' ? `/en/locations/${city.slug}` : `/locations/${city.slug}`} className="bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800 text-slate-400 hover:text-amber-400 px-3.5 py-2 rounded-xl transition-all text-sm flex items-center gap-1.5 group shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-500 transition-colors" />
                    {i18n.language === 'en' ? city.name_en : city.name_ar}
                  </Link>
                ))}
                {(cities || []).length > 14 && (
                   <Link to={i18n.language === 'en' ? '/en/locations' : '/locations'} className="bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:text-amber-400 text-amber-500 px-3.5 py-2 rounded-xl transition-all text-sm flex items-center gap-1 font-bold">
                     {i18n.language === 'en' ? 'All Locations' : 'كل المدن'} <ChevronRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                   </Link>
                )}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-500" />
                {i18n.language === 'en' ? 'Company' : 'الشركة'}
              </h4>
              <ul className="space-y-4 font-semibold">
                <li><Link to={i18n.language === 'en' ? '/en/about' : '/about'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {t('layout.nav.about')}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/case-studies' : '/case-studies'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Case Studies' : 'دراسات الحالة'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/fleet' : '/fleet'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {t('layout.nav.fleet') || (i18n.language === 'en' ? 'Our Fleet' : 'أسطولنا')}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/blog' : '/blog'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Knowledge Center' : 'مركز المعرفة'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/compliance' : '/compliance'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Operational Standards' : 'معايير الامتثال'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/calculator' : '/calculator'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group text-blue-500 font-bold"><ChevronRight className="w-4 h-4 text-blue-500 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Payload Calculator' : 'حاسبة سعة الشاحنات'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/checker' : '/checker'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group text-blue-500 font-bold"><ChevronRight className="w-4 h-4 text-blue-500 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Compliance Checker' : 'فحص الجاهزية الذكي'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/careers' : '/careers'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Careers' : 'التوظيف'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/faq' : '/faq'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group text-emerald-400 font-bold"><ChevronRight className="w-4 h-4 text-emerald-500 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Help & FAQs' : 'مركز المساعدة (FAQ)'}</Link></li>
                {settings.general?.profile_download_enabled !== false && settings.general?.company_profile_url && (
                  <li><a href={settings.general.company_profile_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors group"><Download className="w-4 h-4 text-amber-500 group-hover:-translate-y-1 transition-transform" /> {i18n.language === 'en' ? 'Download Company Profile' : 'تحميل الملف التعريفي'}</a></li>
                )}
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="lg:col-span-1 xl:col-span-1">
              <h4 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-500" />
                {i18n.language === 'en' ? 'Contact Us' : 'تواصل معنا'}
              </h4>
              <div className="flex flex-col gap-4">
                <a href={`tel:${settings.company_info?.phone || settings.phone1 || '0502375887'}`} className="flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800 p-3 2xl:p-4 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-all group" dir="ltr">
                  <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform"><Phone className="w-5 h-5" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] 2xl:text-xs text-slate-400 font-bold tracking-wider uppercase mb-0.5">{i18n.language === 'en' ? 'Sales & Support' : 'المبيعات والدعم'}</span>
                    <span className="text-base 2xl:text-lg text-white font-black tracking-wide">{settings.company_info?.phone || settings.phone1 || '050 237 5887'}</span>
                  </div>
                </a>
                
                <a href={`https://wa.me/${settings.company_info?.whatsapp || settings.whatsapp || ''}`} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800 p-3 2xl:p-4 rounded-2xl border border-slate-800 hover:border-[#25D366]/30 transition-all group" dir="ltr">
                  <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center text-[#25D366] shrink-0 group-hover:scale-110 transition-transform">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] 2xl:text-xs text-slate-400 font-bold tracking-wider uppercase mb-0.5">{i18n.language === 'en' ? 'Fast Response' : 'استجابة سريعة'}</span>
                    <span className="text-sm 2xl:text-base text-white font-bold">WhatsApp Support</span>
                  </div>
                </a>

                <Link to={i18n.language === 'en' ? '/en/contact' : '/contact'} className="inline-flex items-center justify-center gap-2 mt-2 py-3 px-4 rounded-xl font-bold text-amber-500 hover:text-slate-900 hover:bg-amber-500 transition-all border border-amber-500/20 hover:border-amber-500 group">
                  {i18n.language === 'en' ? 'View all contact options' : 'عرض كافة خيارات التواصل'}
                  <ChevronRight className="w-4 h-4 rtl:-scale-x-100 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

          {/* 3. Trust Statistics Section */}
          <div className="py-10 border-y border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center bg-slate-900/30 rounded-[2rem] backdrop-blur-sm">
             <div className="flex flex-col items-center justify-center">
               <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">5000+</div>
               <div className="text-amber-500 text-xs md:text-sm font-bold uppercase tracking-wider">{i18n.language === 'en' ? 'Successful Deliveries' : 'رحلة نقل ناجحة'}</div>
             </div>
             <div className="flex flex-col items-center justify-center">
               <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">24/7</div>
               <div className="text-amber-500 text-xs md:text-sm font-bold uppercase tracking-wider">{i18n.language === 'en' ? 'Live Monitoring' : 'مراقبة حية ودعم'}</div>
             </div>
             <div className="flex flex-col items-center justify-center">
               <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">100%</div>
               <div className="text-amber-500 text-xs md:text-sm font-bold uppercase tracking-wider">{i18n.language === 'en' ? 'Nationwide Coverage' : 'تغطية للمملكة'}</div>
             </div>
             <div className="flex flex-col items-center justify-center">
               <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">-18°C</div>
               <div className="text-amber-500 text-xs md:text-sm font-bold uppercase tracking-wider">{i18n.language === 'en' ? 'Temp Compliance' : 'تجميد مستمر'}</div>
             </div>
          </div>

          {/* 4. Bottom Legal Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-10 text-xs md:text-sm text-slate-500 font-semibold">
             <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 bg-slate-900 px-6 py-3 rounded-full border border-slate-800">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> <span className="text-slate-300">{i18n.language === 'en' ? 'Certified Logistics' : 'لوجستيات معتمدة'}</span></span>
                <span className="hidden md:inline text-slate-700">|</span>
                <span className="flex items-center gap-1"><span className="text-amber-600">{i18n.language === 'en' ? 'CR:' : 'س.ت:'}</span> <span className="text-slate-300">{settings.company_info?.cr_number || '1131335461'}</span></span>
                <span className="hidden md:inline text-slate-700">|</span>
                <span className="flex items-center gap-1"><span className="text-amber-600">{i18n.language === 'en' ? 'VAT:' : 'ض.ق.م:'}</span> <span className="text-slate-300">{settings.company_info?.vat_number || '310636667600003'}</span></span>
             </div>
             
             <div className="flex flex-col items-center lg:items-end gap-2">
               <div className="flex items-center gap-4 text-slate-400">
                 <Link to={i18n.language === 'en' ? '/en/privacy' : '/privacy'} className="hover:text-amber-500 transition-colors">{i18n.language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}</Link>
                 <span className="text-slate-700">•</span>
                 <Link to={i18n.language === 'en' ? '/en/terms' : '/terms'} className="hover:text-amber-500 transition-colors">{i18n.language === 'en' ? 'Terms of Service' : 'الشروط والأحكام'}</Link>
               </div>
               <div className="text-slate-600">
                  © {new Date().getFullYear()} {i18n.language === 'en' ? 'Rokn Elryan Logistics. All rights reserved.' : 'ركن الريان للنقل المبرد والمجمد. جميع الحقوق محفوظة.'}
               </div>
             </div>
          </div>
        </div>
      </footer>

      {(settings.company_info?.whatsapp || settings.whatsapp) && (
        <a 
          href={`https://wa.me/${settings.company_info?.whatsapp || settings.whatsapp}`} 
          target="_blank" 
          rel="noreferrer"
          className="hidden md:flex fixed bottom-6 end-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-[#25D366]/40 transition-all duration-300 group"
          aria-label={t('layout.floating.whatsappAlt')}
        >
          <WhatsAppIcon className="w-10 h-10" />
          <span className="absolute end-full me-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {t('layout.floating.whatsappText')}
          </span>
        </a>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 p-3 flex gap-3 border-t border-slate-100">
        {(settings.company_info?.whatsapp || settings.whatsapp) && (
          <a 
            href={`https://wa.me/${settings.company_info?.whatsapp || settings.whatsapp}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-1 bg-[#25D366] text-white p-2 rounded-xl"
          >
            <WhatsAppIcon className="w-6 h-6" />
            {t('layout.cta.whatsapp')}
          </a>
        )}
        {(settings.company_info?.phone || settings.phone1) && (
          <a 
            href={`tel:${settings.company_info?.phone || settings.phone1}`} 
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm"
          >
            <Phone className="w-5 h-5" />
            {t('layout.cta.call')}
          </a>
        )}
      </div>
    </div>
  );
}
