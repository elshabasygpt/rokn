import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, MessageCircle, Percent, Truck, Globe, ShieldCheck, Snowflake, MapPin, Activity, CheckCircle2, ChevronRight, Home, Package, Image as ImageIcon, Info, FileText, Briefcase, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

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
  const location = useLocation();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        const newSettings = { ...data.general, promo: data.promo };
        setSettings(newSettings);
        // Cache settings to eliminate loading flicker on next visits
        localStorage.setItem('siteSettings', JSON.stringify(newSettings));
      })
      .catch(console.error);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const isEn = location.pathname === '/en' || location.pathname.startsWith('/en/');
    if (isEn && i18n.language !== 'en') i18n.changeLanguage('en');
    if (!isEn && i18n.language !== 'ar') i18n.changeLanguage('ar');
  }, [location.pathname, i18n]);

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

    // Update document title for SEO
    let title = i18n.language === 'en' ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد';
    if (i18n.language === 'en') title = 'Rokn Elryan Refrigerated Transport';
    
    if (location.pathname === '/services') title += i18n.language === 'en' ? ' | Services' : ' | خدماتنا';
    else if (location.pathname === '/gallery') title += i18n.language === 'en' ? ' | Gallery' : ' | معرض الأعمال';
    else if (location.pathname === '/about') title += i18n.language === 'en' ? ' | About Us' : ' | من نحن';
    else if (location.pathname === '/contact') title += i18n.language === 'en' ? ' | Contact Us' : ' | اتصل بنا';

    document.title = title;
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
      {settings.googleSiteVerification || settings.googleAnalyticsId ? (
        <Helmet>
          {settings.googleSiteVerification && <meta name="google-site-verification" content={settings.googleSiteVerification} />}
          {settings.googleAnalyticsId && <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}></script>}
          {settings.googleAnalyticsId && (
            <script>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}', { page_path: window.location.pathname });
              `}
            </script>
          )}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": i18n.language === 'en' ? 'Rokn Elryan' : 'ركن الريان للنقل المبرد',
              "url": "https://www.roknelryan.com",
              "logo": "https://www.roknelryan.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": `+${settings.phone1 || '966502375887'}`,
                "contactType": "customer service"
              }
            })}
          </script>
        </Helmet>
      ) : null}

      {/* Promo Banner */}
      <AnimatePresence>
        {isPromoVisible && settings.promo?.enabled && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-900 border-b border-amber-500/30 text-white overflow-hidden relative z-50 group"
          >
            {/* Background Texture & Animated Gradients */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="container mx-auto px-4 py-3 md:py-4 grid grid-cols-[1fr_auto] gap-2 md:gap-4 items-center min-h-[60px]">
              {/* Content Column */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-[15px] md:text-[18px] font-bold text-center w-full">
                <span className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse shrink-0">
                  <Percent className="w-5 h-5 md:w-6 md:h-6" />
                </span>
                <span className="text-slate-200 tracking-wide flex flex-wrap items-center justify-center gap-3">
                  <span className="text-amber-400 font-black tracking-widest text-sm md:text-base bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 flex items-center gap-1.5 shrink-0">
                    <span className="md:hidden"><Percent className="w-4 h-4" /></span>
                    {i18n.language === 'en' ? 'SPECIAL OFFER' : 'عرض خاص'}
                  </span>
                  <span>{settings.promo[`text_${i18n.language}` as 'text_ar'|'text_en'] || settings.promo.text_ar || t('layout.promoBanner')}</span>
                </span>
                
                <Link to={i18n.language === 'en' ? "/en/contact" : "/contact"} className="hidden lg:flex items-center gap-2 text-base bg-amber-500 text-slate-900 px-6 py-2.5 rounded-xl hover:bg-amber-400 transition-all hover:scale-105 shadow-md font-black border border-amber-400 shrink-0">
                  {i18n.language === 'en' ? 'Claim Offer Now' : 'احجز واستفد من العرض'}
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </Link>
              </div>
              
              {/* Close Button Column */}
              <button 
                onClick={() => setIsPromoVisible(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-colors flex items-center justify-center self-start md:self-center shrink-0"
                aria-label={t('layout.promoBtn')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-white/90 backdrop-blur-lg border-b border-slate-200/50'}`}>
        <div className={`w-full max-w-[1920px] mx-auto px-4 lg:px-8 2xl:px-12 flex items-center justify-between gap-4 2xl:gap-8 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5 md:py-6'}`}>
          <div className="shrink-0 flex items-center">
            <Logo />
          </div>
          
          {/* Desktop Nav - Clean Enterprise Layout */}
          <div className="hidden xl:flex flex-1 items-center justify-center gap-1.5 2xl:gap-4 px-2">
            {[
              { path: '', label: t('layout.nav.home'), icon: Home },
              { path: 'services', label: t('layout.nav.services'), icon: Package },
              { path: 'fleet', label: t('layout.nav.fleet') || (i18n.language === 'en' ? 'Our Fleet' : 'أسطولنا'), icon: Truck },
              { path: 'gallery', label: t('layout.nav.gallery'), icon: ImageIcon },
              { path: 'about', label: t('layout.nav.about'), icon: Info },
              { path: 'blog', label: i18n.language === 'en' ? 'Blog' : 'المقالات', icon: FileText },
              { path: 'careers', label: i18n.language === 'en' ? 'Careers' : 'التوظيف', icon: Briefcase },
              { path: 'contact', label: t('layout.nav.contact'), icon: PhoneCall },
            ].map(link => {
              const Icon = link.icon;
              const fullPath = i18n.language === 'en' ? `/en${link.path ? `/${link.path}` : ''}` : `/${link.path}`;
              const isActive = link.path === '' ? (location.pathname === '/' || location.pathname === '/en') : location.pathname.includes(`/${link.path}`);
              return (
                <Link 
                  key={link.path}
                  to={fullPath} 
                  className={`flex items-center gap-1.5 2xl:gap-2.5 px-2.5 2xl:px-5 py-2.5 2xl:py-3.5 rounded-2xl text-[14px] 2xl:text-[18px] font-bold whitespace-nowrap transition-all duration-300 relative group overflow-hidden ${isActive ? 'text-amber-700 bg-gradient-to-br from-amber-50/80 to-amber-100/80 shadow-[inset_0_2px_10px_rgba(251,191,36,0.15)] border border-amber-300/60 drop-shadow-sm' : 'text-slate-600 hover:text-amber-600 hover:bg-slate-50 border border-transparent'}`}
                >
                  <Icon className={`w-4 h-4 2xl:w-[22px] 2xl:h-[22px] transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md text-amber-600' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100 text-slate-400 group-hover:text-amber-500'}`} />
                  <span className="relative z-10 pt-0.5">{link.label}</span>
                  {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[4px] bg-amber-500 rounded-t-full shadow-[0_-2px_10px_rgba(245,158,11,0.6)]"></div>}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-3 2xl:gap-6">
              <button onClick={toggleLanguage} className="flex items-center justify-center text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-2.5 2xl:p-3.5 rounded-xl transition-all border border-slate-200/60" title={i18n.language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}>
                <Globe className="w-5 h-5 2xl:w-6 2xl:h-6 text-amber-500" />
                <span className="sr-only">{i18n.language === 'ar' ? 'EN' : 'عربي'}</span>
              </button>
              
              <a href={`tel:${settings.phone1 || ''}`} className="hidden xl:flex items-center gap-3 2xl:gap-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 px-4 2xl:px-6 py-2.5 2xl:py-3 rounded-xl transition-all group" dir="ltr">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 2xl:w-6 2xl:h-6 text-amber-600" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] 2xl:text-[13px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1 2xl:mb-1.5">{i18n.language === 'en' ? 'Available 24/7' : 'متاح 24/7'}</span>
                  <span className="text-[16px] 2xl:text-[22px] font-black text-slate-900 leading-none">{settings.phone1 || '050 237 5887'}</span>
                </div>
              </a>
              
              <Link to={i18n.language === 'en' ? '/en/contact' : '/contact'} className="bg-amber-500 text-slate-900 px-6 2xl:px-10 py-3 2xl:py-4 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 text-[15px] 2xl:text-[18px] flex items-center gap-2 2xl:gap-3 group border border-amber-400 hover:border-amber-300 whitespace-nowrap shrink-0">
                {i18n.language === 'en' ? 'Get a Quote in Minutes' : 'احصل على عرض سعر خلال دقائق'}
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
        <div className={`hidden lg:block border-t border-slate-100/60 bg-slate-50/50 transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-14 opacity-100'}`}>
          <div className="w-full max-w-[1920px] mx-auto px-4 lg:px-8 2xl:px-12 h-full flex justify-center items-center text-[14px] 2xl:text-[17px] font-bold text-slate-600">
             <div className="flex items-center justify-center gap-4 xl:gap-16 w-full px-2">
               <span className="flex items-center gap-1.5 xl:gap-2.5 whitespace-nowrap"><MapPin className="w-4 h-4 xl:w-5 xl:h-5 text-amber-500"/> <span className="hidden xl:inline">{i18n.language === 'en' ? 'Nationwide Coverage' : 'تغطية جميع مدن المملكة'}</span><span className="xl:hidden">{i18n.language === 'en' ? 'Nationwide' : 'تغطية شاملة'}</span></span>
               <span className="flex items-center gap-1.5 xl:gap-2.5 whitespace-nowrap"><Activity className="w-4 h-4 xl:w-5 xl:h-5 text-amber-500"/> <span className="hidden xl:inline">{i18n.language === 'en' ? '24/7 Temp Monitoring' : 'مراقبة حرارة 24/7'}</span><span className="xl:hidden">24/7</span></span>
               <span className="flex items-center gap-1.5 xl:gap-2.5 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 xl:w-5 xl:h-5 text-amber-500"/> <span className="hidden xl:inline">{i18n.language === 'en' ? '5000+ Successful Trips' : 'أكثر من 5000 رحلة ناجحة'}</span><span className="xl:hidden">+5000 رحلة</span></span>
               <span className="flex items-center gap-1.5 xl:gap-2.5 whitespace-nowrap"><Snowflake className="w-4 h-4 xl:w-5 xl:h-5 text-amber-500"/> <span className="hidden xl:inline">{i18n.language === 'en' ? 'Full Cold Chain Compliance' : 'التزام كامل بسلسلة التبريد'}</span><span className="xl:hidden">سلسلة التبريد</span></span>
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
              { path: 'fleet', label: t('layout.nav.fleet') || (i18n.language === 'en' ? 'Our Fleet' : 'أسطولنا'), icon: Truck },
              { path: 'gallery', label: t('layout.nav.gallery'), icon: ImageIcon },
              { path: 'about', label: t('layout.nav.about'), icon: Info },
              { path: 'blog', label: i18n.language === 'en' ? 'Blog' : 'المقالات', icon: FileText },
              { path: 'careers', label: i18n.language === 'en' ? 'Careers' : 'التوظيف', icon: Briefcase },
              { path: 'contact', label: t('layout.nav.contact'), icon: PhoneCall },
            ].map(link => {
              const Icon = link.icon;
              const isActive = link.path === '' ? (location.pathname === '/' || location.pathname === '/en') : location.pathname.includes(`/${link.path}`);
              return (
               <Link key={link.path} to={i18n.language === 'en' ? `/en/${link.path}` : (link.path ? `/${link.path}` : '/')} className={`flex items-center gap-4 p-3.5 rounded-xl text-start text-[18px] transition-all font-bold ${isActive ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700 shadow-sm border border-amber-200/60' : 'hover:bg-slate-50 text-slate-700 border border-transparent'}`} onClick={() => setIsMobileMenuOpen(false)}>
                 <Icon className={`w-6 h-6 ${isActive ? 'text-amber-600 drop-shadow-sm' : 'text-slate-400'}`} />
                 {link.label}
               </Link>
              );
            })}
            <div className="h-px bg-slate-100 my-2"></div>
            <a href={`tel:${settings.phone1 || ''}`} className="flex items-center justify-center gap-3 bg-amber-50 text-amber-700 p-4 rounded-xl font-bold text-[16px]" dir="ltr">
              <Phone className="w-5 h-5" />
              <div className="flex flex-col text-left">
                 <span className="text-[10px] text-amber-600/80 uppercase">{i18n.language === 'en' ? 'Available 24/7' : 'متاح 24/7'}</span>
                 <span>{settings.phone1 || '050 237 5887'}</span>
              </div>
            </a>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Premium Enterprise Footer */}
      <footer className="bg-slate-950 text-slate-400 relative overflow-hidden mt-auto pt-20">
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
              <a href={`https://wa.me/${settings.whatsapp || ''}`} target="_blank" rel="noopener noreferrer" className="bg-slate-800/80 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600">
                <MessageCircle className="w-5 h-5 text-green-400" />
                {i18n.language === 'en' ? 'WhatsApp Contact' : 'تواصل عبر واتساب'}
              </a>
            </div>
          </div>

          {/* 2. Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
            
            {/* Company Overview */}
            <div className="lg:col-span-2">
              <div className="mb-8 inline-block bg-white/5 p-4 rounded-2xl border border-white/10">
                {(() => {
                  const currentLang = i18n.language;
                  let footerLogoRaw = currentLang === 'en' ? settings.logo_footer_en : settings.logo_footer_ar;
                  if (!footerLogoRaw) footerLogoRaw = settings.logo;
                  const footerLogoUrl = footerLogoRaw ? (footerLogoRaw.startsWith('/') ? footerLogoRaw : footerLogoRaw) : "/logo.png";
                  return (
                    <img src={footerLogoUrl} alt={t('layout.logo.alt')} className="h-28 w-auto object-contain max-w-[240px]" onError={(e) => e.currentTarget.style.display = 'none'} />
                  );
                })()}
              </div>
              <p className="text-slate-400 text-base leading-loose max-w-sm font-medium">
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
                <li><Link to={i18n.language === 'en' ? '/en/industries/pharma' : '/industries/pharma'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Pharmaceuticals' : 'قطاع الأدوية'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/industries/food' : '/industries/food'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Food Manufacturing' : 'المصانع الغذائية'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/industries/retail' : '/industries/retail'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Retail & Restaurants' : 'التجزئة والمطاعم'}</Link></li>
              </ul>
            </div>

            {/* Coverage Areas */}
            <div>
              <h4 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                {i18n.language === 'en' ? 'Coverage' : 'تغطيتنا'}
              </h4>
              <ul className="space-y-4 font-semibold">
                <li><Link to={i18n.language === 'en' ? '/en/locations/qassim' : '/locations/qassim'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group text-amber-500"><ChevronRight className="w-4 h-4 text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Qassim (Headquarters)' : 'القصيم (المركز الرئيسي)'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/locations/riyadh' : '/locations/riyadh'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Riyadh' : 'الرياض'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/locations/jeddah' : '/locations/jeddah'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Jeddah' : 'جدة'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/locations/dammam' : '/locations/dammam'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Dammam' : 'الدمام'}</Link></li>
              </ul>
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
                <li><Link to={i18n.language === 'en' ? '/en/careers' : '/careers'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Careers' : 'التوظيف'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/faq' : '/faq'} className="flex items-center gap-2 hover:text-amber-500 transition-colors group text-emerald-400 font-bold"><ChevronRight className="w-4 h-4 text-emerald-500 group-hover:text-amber-500 transition-colors" /> {i18n.language === 'en' ? 'Help & FAQs' : 'مركز المساعدة (FAQ)'}</Link></li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-500" />
                {i18n.language === 'en' ? 'Contact Us' : 'تواصل معنا'}
              </h4>
              <ul className="space-y-6 font-semibold">
                <li>
                  <a href={`tel:${settings.phone1 || '0502375887'}`} className="flex items-center gap-3 hover:text-amber-500 transition-colors" dir="ltr">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500 shrink-0"><Phone className="w-4 h-4" /></div>
                    <span className="text-lg text-white font-bold tracking-wide">{settings.phone1 || '050 237 5887'}</span>
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${settings.whatsapp || ''}`} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-amber-500 transition-colors" dir="ltr">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-green-400 shrink-0"><MessageCircle className="w-4 h-4" /></div>
                    <span className="text-base text-slate-300">WhatsApp Support</span>
                  </a>
                </li>
                <li>
                  <Link to={i18n.language === 'en' ? '/en/contact' : '/contact'} className="text-sm text-slate-500 hover:text-amber-500 transition-colors underline underline-offset-4">
                    {i18n.language === 'en' ? 'View all contact options' : 'عرض كافة خيارات التواصل'}
                  </Link>
                </li>
              </ul>
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
                <span className="flex items-center gap-1"><span className="text-amber-600">{i18n.language === 'en' ? 'CR:' : 'س.ت:'}</span> <span className="text-slate-300">1010123456</span></span>
                <span className="hidden md:inline text-slate-700">|</span>
                <span className="flex items-center gap-1"><span className="text-amber-600">{i18n.language === 'en' ? 'VAT:' : 'ض.ق.م:'}</span> <span className="text-slate-300">300123456700003</span></span>
                <span className="hidden lg:inline text-slate-700">|</span>
                <span className="flex items-center gap-1"><span className="text-amber-600">{i18n.language === 'en' ? 'TGA:' : 'هيئة النقل:'}</span> <span className="text-slate-300">040112</span></span>
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

      {settings.whatsapp && (
        <a 
          href={`https://wa.me/${settings.whatsapp}`} 
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
        {settings.whatsapp && (
          <a 
            href={`https://wa.me/${settings.whatsapp}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-1 bg-[#25D366] text-white p-2 rounded-xl"
          >
            <WhatsAppIcon className="w-6 h-6" />
            {t('layout.cta.whatsapp')}
          </a>
        )}
        {settings.phone1 && (
          <a 
            href={`tel:${settings.phone1}`} 
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
