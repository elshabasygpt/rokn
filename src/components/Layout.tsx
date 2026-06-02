import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, MessageCircle, Percent, Truck, Globe, ShieldCheck } from 'lucide-react';
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
  const [settings, setSettings] = useState<any>({});
  const location = useLocation();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({ ...data.general, promo: data.promo });
      })
      .catch(console.error);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const isEn = location.pathname.startsWith('/en');
    if (isEn && i18n.language !== 'en') i18n.changeLanguage('en');
    if (!isEn && i18n.language !== 'ar') i18n.changeLanguage('ar');
  }, [location.pathname, i18n]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    if (location.pathname.startsWith('/en')) {
      navigate(location.pathname.replace('/en', '') || '/');
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
    <Link to={i18n.language === 'en' ? '/en' : '/'} className="flex items-center gap-3 group shrink-0">
      <div className="relative flex items-center justify-center">
        <img 
          src={headerLogoUrl} 
          alt={t('layout.logo.alt')} 
          className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${isScrolled ? 'h-16 md:h-20' : 'h-20 md:h-24'}`} 
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} 
        />
        {/* Fallback Logo if image missing */}
        <div className="hidden fallback-logo items-center gap-2">
          <div className={`bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <Truck className={`${isScrolled ? 'w-5 h-5' : 'w-7 h-7'} text-slate-900`} />
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
        </Helmet>
      ) : null}

      {/* Promo Banner */}
      <AnimatePresence>
        {isPromoVisible && settings.promo?.enabled && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-amber-600 to-amber-500 text-white overflow-hidden relative z-50"
          >
            <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm md:text-base font-bold mx-auto">
                <Percent className="w-4 h-4 md:w-5 md:h-5" />
                <span>{settings.promo[`text_${i18n.language}` as 'text_ar'|'text_en'] || settings.promo.text_ar || t('layout.promoBanner')}</span>
              </div>
              <button 
                onClick={() => setIsPromoVisible(false)}
                className="text-white/80 hover:text-white transition-colors absolute start-4"
                aria-label={t('layout.promoBtn')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 border-b border-slate-100' : 'bg-white/70 backdrop-blur-md py-4 border-b border-slate-200/50'}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          <Logo />
          
          {/* Desktop Nav - Pill Design */}
          <div className="hidden lg:flex items-center gap-1 bg-white/60 p-1.5 rounded-2xl border border-slate-200/60 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] backdrop-blur-xl">
            {[
              { path: '', label: t('layout.nav.home') },
              { path: 'services', label: t('layout.nav.services') },
              { path: 'fleet', label: t('layout.nav.fleet') || (i18n.language === 'en' ? 'Our Fleet' : 'أسطولنا') },
              { path: 'gallery', label: t('layout.nav.gallery') },
              { path: 'about', label: t('layout.nav.about') },
              { path: 'blog', label: i18n.language === 'en' ? 'Blog' : 'المقالات' },
              { path: 'careers', label: i18n.language === 'en' ? 'Careers' : 'التوظيف' },
              { path: 'contact', label: t('layout.nav.contact') },
            ].map(link => {
              const fullPath = i18n.language === 'en' ? `/en${link.path ? `/${link.path}` : ''}` : `/${link.path}`;
              const isActive = link.path === '' ? (location.pathname === '/' || location.pathname === '/en') : location.pathname.includes(`/${link.path}`);
              return (
                <Link 
                  key={link.path}
                  to={fullPath} 
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isActive ? 'bg-white text-amber-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-600 hover:text-amber-600 hover:bg-white/50'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-3">
              <button onClick={toggleLanguage} className="flex items-center gap-2 text-slate-700 font-bold hover:text-slate-900 bg-white shadow-sm border border-slate-200 hover:border-slate-300 px-3 py-2.5 rounded-xl transition-all" title={i18n.language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}>
                <Globe className="w-4 h-4 text-amber-500" />
                <span className="text-sm">{i18n.language === 'ar' ? 'EN' : 'عربي'}</span>
              </button>
              <a href={`tel:${settings.phone1 || ''}`} className="hidden xl:flex items-center gap-2 text-slate-800 font-bold hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-4 py-2.5 rounded-xl transition-all shadow-sm" dir="ltr">
                <Phone className="w-4 h-4 text-amber-600" />
                <span className="text-sm">{settings.phone1 || '050 237 5887'}</span>
              </a>
              <Link to={i18n.language === 'en' ? '/en/contact' : '/contact'} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 text-sm flex items-center gap-2 group border border-slate-800 hover:border-slate-700">
                {t('layout.cta.book')}
                <Truck className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden text-slate-900 p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 flex flex-col p-4 gap-4 font-semibold text-slate-700">
            <button onClick={toggleLanguage} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-amber-600">
              <Globe className="w-5 h-5" />
              {i18n.language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            </button>
            <Link to={i18n.language === 'en' ? '/en' : '/'} className="p-2 hover:bg-slate-50 rounded-lg text-start">{t('layout.nav.home')}</Link>
            <Link to={i18n.language === 'en' ? '/en/services' : '/services'} className="p-2 hover:bg-slate-50 rounded-lg text-start">{t('layout.nav.services')}</Link>
            <Link to={i18n.language === 'en' ? '/en/fleet' : '/fleet'} className="p-2 hover:bg-slate-50 rounded-lg text-start">{t('layout.nav.fleet') || (i18n.language === 'en' ? 'Our Fleet' : 'أسطولنا')}</Link>
            <Link to={i18n.language === 'en' ? '/en/gallery' : '/gallery'} className="p-2 hover:bg-slate-50 rounded-lg text-start">{t('layout.nav.gallery')}</Link>
            <Link to={i18n.language === 'en' ? '/en/about' : '/about'} className="p-2 hover:bg-slate-50 rounded-lg text-start">{t('layout.nav.about')}</Link>
            <Link to={i18n.language === 'en' ? '/en/blog' : '/blog'} className="p-2 hover:bg-slate-50 rounded-lg text-start">{i18n.language === 'en' ? 'Blog' : 'المقالات'}</Link>
            <Link to={i18n.language === 'en' ? '/en/careers' : '/careers'} className="p-2 hover:bg-slate-50 rounded-lg text-start">{i18n.language === 'en' ? 'Careers' : 'التوظيف'}</Link>
            <Link to={i18n.language === 'en' ? '/en/contact' : '/contact'} className="p-2 hover:bg-slate-50 rounded-lg text-start">{t('layout.nav.contact')}</Link>
            <div className="h-px bg-slate-100 my-2"></div>
            <a href={`tel:${settings.phone1 || ''}`} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 p-3 rounded-lg font-bold" dir="ltr">
              <Phone className="w-5 h-5" />
              {settings.phone1 || ''}
            </a>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/10 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="mb-6 inline-block">
                {(() => {
                  const currentLang = i18n.language;
                  let footerLogoRaw = currentLang === 'en' ? settings.logo_footer_en : settings.logo_footer_ar;
                  if (!footerLogoRaw) footerLogoRaw = settings.logo;
                  const footerLogoUrl = footerLogoRaw ? (footerLogoRaw.startsWith('/') ? footerLogoRaw : footerLogoRaw) : "/logo.png";
                  return (
                    <img src={footerLogoUrl} alt={t('layout.logo.alt')} className="h-36 md:h-44 w-auto object-contain max-w-[280px] drop-shadow-2xl hover:scale-105 transition-transform duration-500" onError={(e) => e.currentTarget.style.display = 'none'} />
                  );
                })()}
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ whiteSpace: 'pre-wrap' }}>
                {i18n.language === 'en' 
                  ? (settings.footerMeta?.about_en || t('layout.footer.about'))
                  : (settings.footerMeta?.about_ar || t('layout.footer.about'))}
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t('layout.footer.quickLinks')}</h4>
              <ul className="space-y-2">
                <li><Link to={i18n.language === 'en' ? '/en' : '/'} className="hover:text-amber-500 transition-colors text-start block">{t('layout.nav.home')}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/services' : '/services'} className="hover:text-amber-500 transition-colors text-start block">{t('layout.nav.services')}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/fleet' : '/fleet'} className="hover:text-amber-500 transition-colors text-start block">{t('layout.nav.fleet') || (i18n.language === 'en' ? 'Our Fleet' : 'أسطولنا')}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/gallery' : '/gallery'} className="hover:text-amber-500 transition-colors text-start block">{t('layout.nav.gallery')}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/about' : '/about'} className="hover:text-amber-500 transition-colors text-start block">{t('layout.nav.about')}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/blog' : '/blog'} className="hover:text-amber-500 transition-colors text-start block">{i18n.language === 'en' ? 'Blog' : 'المقالات'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/careers' : '/careers'} className="hover:text-amber-500 transition-colors text-start block">{i18n.language === 'en' ? 'Careers' : 'التوظيف'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/contact' : '/contact'} className="hover:text-amber-500 transition-colors text-start block">{t('layout.nav.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{i18n.language === 'en' ? 'Legal' : 'قانوني'}</h4>
              <ul className="space-y-2">
                <li><Link to={i18n.language === 'en' ? '/en/privacy' : '/privacy'} className="hover:text-amber-500 transition-colors text-start block">{i18n.language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}</Link></li>
                <li><Link to={i18n.language === 'en' ? '/en/terms' : '/terms'} className="hover:text-amber-500 transition-colors text-start block">{i18n.language === 'en' ? 'Terms of Service' : 'الشروط والأحكام'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t('layout.footer.areas')}</h4>
              <ul className="space-y-2">
                {(() => {
                  const areasText = i18n.language === 'en' ? settings.footerMeta?.areas_en : settings.footerMeta?.areas_ar;
                  if (areasText) {
                    return areasText.split('\n').filter((l: string) => l.trim()).map((area: string, i: number) => (
                      <li key={i} className="text-start">{area}</li>
                    ));
                  }
                  return (
                    <>
                      <li className="text-start">{t('layout.footer.abha')}</li>
                      <li className="text-start">{t('layout.footer.khamis')}</li>
                      <li className="text-start">{t('layout.footer.allKsa')}</li>
                    </>
                  );
                })()}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 pb-4 flex flex-wrap justify-between items-center gap-6 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
               <span className="flex items-center gap-1 font-bold"><span className="text-amber-500">{i18n.language === 'en' ? 'CR:' : 'سجل تجاري:'}</span> 1010123456</span>
               <span className="hidden md:inline text-slate-700">|</span>
               <span className="flex items-center gap-1 font-bold"><span className="text-amber-500">{i18n.language === 'en' ? 'VAT:' : 'الرقم الضريبي:'}</span> 300123456700003</span>
               <span className="hidden md:inline text-slate-700">|</span>
               <span className="flex items-center gap-1 font-bold"><span className="text-amber-500">{i18n.language === 'en' ? 'TGA License:' : 'ترخيص هيئة النقل (TGA):'}</span> 040112</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-400">
               <ShieldCheck className="w-4 h-4 text-emerald-500" /> {i18n.language === 'en' ? 'Certified Saudi Logistics Company' : 'شركة سعودية لوجستية معتمدة'}
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              {i18n.language === 'en' 
                ? (settings.footerMeta?.copyright_en || t('layout.footer.copyright', { year: new Date().getFullYear() }))
                : (settings.footerMeta?.copyright_ar || t('layout.footer.copyright', { year: new Date().getFullYear() }))}
            </p>
            <div className="flex gap-4" dir="ltr">
              <span className="font-bold">{settings.phone1 || '050 237 5887'}</span>
              <span className="text-slate-600">|</span>
              <span className="font-bold">{settings.phone2 || '053 453 2962'}</span>
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
