import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Clock, CheckCircle2, ChevronLeft, ChevronRight, Truck, Home, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '../components/SearchableSelect';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    from_city: '',
    to_city: '',
    rooms: '',
    notes: '',
    client_name: '',
    client_phone: '',
  });

  const [settings, setSettings] = useState<any>({});
  const [companyInfo, setCompanyInfo] = useState<any>({});
  const [meta, setMeta] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/settings` )
      .then(res => res.json())
      .then(data => {
        setSettings(data.general || {});
        if (data.company_info) setCompanyInfo(data.company_info);
        if (data.contactMeta) setMeta(data.contactMeta);
        if (data.citiesMeta && data.citiesMeta.list) setCities(data.citiesMeta.list);
      })
      .catch(console.error);
  }, []);

  const tLang = (key: string, fallbackKey: string) => {
    if (meta) {
      const val = i18n.language === 'en' ? meta[`${key}_en`] : meta[`${key}_ar`];
      if (val) return val;
    }
    return t(fallbackKey);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      try {
        const { getAttributionData } = await import('../lib/attribution');
        const attribution = getAttributionData();
        
        const payload = {
          ...formData,
          marketing_attribution: attribution
        };

        const API_URL = import.meta.env.VITE_API_URL || '';
        await fetch(`${API_URL}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setIsSubmitted(true);
        
        // Track Conversion Events
        if (typeof window !== 'undefined') {
          if ((window as any).gtag) (window as any).gtag('event', 'generate_lead', { currency: 'SAR', value: 100 });
          if ((window as any).fbq) (window as any).fbq('track', 'Lead');
          if ((window as any).snaptr) (window as any).snaptr('track', 'SIGN_UP');
          if ((window as any).ttq) (window as any).ttq.track('SubmitForm');
        }

        setTimeout(() => {
          setIsSubmitted(false);
          setCurrentStep(1);
          setFormData({ from_city: '', to_city: '', rooms: '', notes: '', client_name: '', client_phone: '' });
        }, 5000);
      } catch (err) {
        console.error(err);
      }
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { num: 1, title: t('contact.form.steps.s1'), icon: Truck },
    { num: 2, title: t('contact.form.steps.s2'), icon: Home },
    { num: 3, title: t('contact.form.steps.s3'), icon: User }
  ];

  const isRTL = i18n.language === 'ar';
  const baseCityOptions = Object.entries(t('home.estimator.cities', { returnObjects: true }) as Record<string, string>).map(([key, val]) => ({ value: key, label: val }));
  const dynamicCityOptions = cities.length > 0 ? cities.map(c => ({ value: c.ar || c.en, label: isRTL ? c.ar : c.en })) : baseCityOptions;
  const cityOptions = dynamicCityOptions;

  const pageTitle = tLang('title', 'contact.title');
  const pageDesc = tLang('desc', 'contact.desc');

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <SEO title={`${pageTitle} | ${i18n.language === 'en' ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد'}`} description={pageDesc} />
      
      {/* Premium Hero Section */}
      <div className="relative pt-32 pb-40 md:pt-40 md:pb-56 bg-slate-900 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('${meta?.hero_image || 'https://images.unsplash.com/photo-1586528116311-ad8ed7e66364?q=80&w=2000&auto=format&fit=crop'}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold mb-6 backdrop-blur-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]"></span>
              {i18n.language === 'en' ? 'Always Ready to Serve' : 'نحن هنا لخدمتك دائماً'}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              {tLang('title', 'contact.title')}
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto drop-shadow-md">
              {tLang('contact_desc', 'نحن هنا للإجابة على استفساراتكم وتلبية احتياجاتكم في النقل المبرد.')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Main Content Grid (Overlapping Hero) */}
        <div className="relative z-20 max-w-7xl mx-auto mb-20 -mt-24 md:-mt-36">
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col lg:flex-row">
            
            {/* Contact Info Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-2/5 p-10 md:p-14 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-e border-slate-700"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 end-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
              <div className="absolute bottom-0 start-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black mb-10 text-amber-400 leading-normal pb-1">
                  {tLang('info_title', 'contact.info.title')}
                </h2>
                
                <div className="space-y-8 md:space-y-10">
                  {/* Primary Phone */}
                  <a href={`tel:${companyInfo.phone || settings.phone1 || ''}`} className="flex items-center gap-5 group block">
                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 shrink-0 shadow-lg">
                      <Phone className="w-6 h-6 text-amber-400 group-hover:text-slate-900 transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-400 mb-1">{t('contact.info.p1Label')}</div>
                      <div dir="ltr" className="text-xl md:text-2xl font-black text-white group-hover:text-amber-400 transition-colors text-end">{companyInfo.phone || settings.phone1 || '050 237 5887'}</div>
                    </div>
                  </a>
                  
                  {/* Secondary Phone */}
                  {(settings.phone2 || companyInfo.phone2) && (
                    <a href={`tel:${settings.phone2 || companyInfo.phone2 || ''}`} className="flex items-center gap-5 group block">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 shrink-0 shadow-lg">
                        <Phone className="w-6 h-6 text-amber-400 group-hover:text-slate-900 transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-400 mb-1">{t('contact.info.p2Label')}</div>
                        <div dir="ltr" className="text-xl md:text-2xl font-black text-white group-hover:text-amber-400 transition-colors text-end">{settings.phone2 || companyInfo.phone2 || '053 453 2962'}</div>
                      </div>
                    </a>
                  )}

                  {/* WhatsApp - Highlighted */}
                  <a href={`https://wa.me/${companyInfo.whatsapp || settings.whatsapp || ''}`} target="_blank" rel="noreferrer" className="flex items-center gap-5 group block bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 hover:bg-[#25D366] hover:shadow-lg hover:shadow-[#25D366]/20 transition-all duration-300 -mx-4 px-4">
                    <div className="w-14 h-14 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#25D366]/40 group-hover:bg-white group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-7 h-7 text-white group-hover:text-[#25D366] transition-colors">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#25D366] group-hover:text-emerald-50 mb-1 transition-colors">{t('contact.info.waLabel')}</div>
                      <div className="text-xl md:text-2xl font-black text-white" dir="ltr">{companyInfo.whatsapp || settings.whatsapp || tLang('waText', 'contact.info.waText')}</div>
                    </div>
                  </a>

                  {/* Location */}
                  <a href={companyInfo.map_url || '#'} target="_blank" rel="noreferrer" className="flex items-start gap-5 group block">
                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 shrink-0 shadow-lg mt-1">
                      <MapPin className="w-7 h-7 text-amber-400 group-hover:text-slate-900 transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-400 mb-2">{t('contact.info.hqLabel')}</div>
                      <div className="text-base md:text-lg font-bold text-slate-200 group-hover:text-amber-400 transition-colors leading-relaxed max-w-xs">{companyInfo.city ? `${companyInfo.city}, ${companyInfo.district || ''}` : tLang('info_hqText', 'contact.info.hqText')}</div>
                    </div>
                  </a>

                  {/* Working Hours */}
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg mt-1">
                      <Clock className="w-7 h-7 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-400 mb-2">{t('contact.info.hoursLabel')}</div>
                      <div className="text-base md:text-lg font-bold text-slate-200 leading-relaxed max-w-xs">{tLang('info_hoursText', 'contact.info.hoursText')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form Wizard */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-3/5 p-8 md:p-14 bg-white relative flex flex-col"
            >
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-900 mb-3">{tLang('form_title', 'contact.form.title')}</h3>
                <p className="text-slate-500 text-lg font-medium">{tLang('form_desc', 'contact.form.desc')}</p>
              </div>
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-10 text-center flex flex-col items-center justify-center flex-grow min-h-[400px]"
                  >
                    <div className="w-24 h-24 bg-white shadow-xl shadow-emerald-200/50 rounded-full flex items-center justify-center mb-8 relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h4 className="text-3xl font-black text-slate-900 mb-4">{tLang('form_successTitle', 'contact.form.successTitle')}</h4>
                    <p className="text-lg text-slate-600 font-medium max-w-md">{tLang('form_successDesc', 'contact.form.successDesc')}</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col flex-grow text-start"
                  >
                    {/* Progress Bar */}
                    <div className="mb-12 relative">
                      <div className="absolute top-5 left-0 right-0 h-1.5 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
                      <div 
                        className="absolute top-5 start-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                      ></div>
                      <div className="flex justify-between relative z-10 px-2">
                        {steps.map((step) => (
                          <div key={step.num} className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${currentStep >= step.num ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/40 scale-110 ring-4 ring-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                              <step.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-sm font-black transition-colors ${currentStep >= step.num ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                      <div className="flex-grow">
                        {/* Step 1: Location */}
                        {currentStep === 1 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-6">
                              <div>
                                <label className="block text-sm font-black text-slate-700 mb-3">{t('contact.form.fields.fromCity')}</label>
                                <SearchableSelect 
                                  required 
                                  value={formData.from_city} 
                                  onChange={val => setFormData({...formData, from_city: val})} 
                                  options={cityOptions}
                                  placeholder={t('contact.form.fields.fromPlaceholder')}
                                  className="w-full px-5 py-4 rounded-xl border border-slate-200 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/20 transition-all bg-white font-bold text-slate-800 shadow-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-black text-slate-700 mb-3">{t('contact.form.fields.toCity')}</label>
                                <SearchableSelect 
                                  required 
                                  value={formData.to_city} 
                                  onChange={val => setFormData({...formData, to_city: val})} 
                                  options={cityOptions}
                                  placeholder={t('contact.form.fields.toPlaceholder')}
                                  className="w-full px-5 py-4 rounded-xl border border-slate-200 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/20 transition-all bg-white font-bold text-slate-800 shadow-sm"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 2: Details */}
                        {currentStep === 2 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-6">
                              <div>
                                <label className="block text-sm font-black text-slate-700 mb-3">{t('contact.form.fields.volume')}</label>
                                <select required value={formData.rooms} onChange={e => setFormData({...formData, rooms: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 hover:border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all bg-white font-bold text-slate-800 shadow-sm appearance-none cursor-pointer">
                                  <option value="">{t('contact.form.fields.volumePlaceholder')}</option>
                                  <option value="1">{t('contact.form.fields.options.1')}</option>
                                  <option value="2">{t('contact.form.fields.options.2')}</option>
                                  <option value="3">{t('contact.form.fields.options.3')}</option>
                                  <option value="4">{t('contact.form.fields.options.4')}</option>
                                  <option value="office">{t('contact.form.fields.options.office')}</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-black text-slate-700 mb-3">{t('contact.form.fields.notes')}</label>
                                <textarea rows={4} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 hover:border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all bg-white font-bold text-slate-800 shadow-sm resize-none" placeholder={t('contact.form.fields.notesPlaceholder')}></textarea>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3: Contact */}
                        {currentStep === 3 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-6">
                              <div>
                                <label className="block text-sm font-black text-slate-700 mb-3">{t('contact.form.fields.name')}</label>
                                <input required value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} type="text" className="w-full px-5 py-4 rounded-xl border border-slate-200 hover:border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all bg-white font-bold text-slate-800 shadow-sm" placeholder={t('contact.form.fields.namePlaceholder')} />
                              </div>
                              <div>
                                <label className="block text-sm font-black text-slate-700 mb-3">{t('contact.form.fields.phone')}</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                  </div>
                                  <input required value={formData.client_phone} onChange={e => setFormData({...formData, client_phone: e.target.value})} type="tel" className="w-full px-5 py-4 ps-12 rounded-xl border border-slate-200 hover:border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all bg-white font-bold text-slate-800 shadow-sm text-end" placeholder={t('contact.form.fields.phonePlaceholder')} dir="ltr" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                        {currentStep > 1 && (
                          <button type="button" onClick={prevStep} className={`px-6 py-4 rounded-xl font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                            {t('contact.form.actions.prev')}
                          </button>
                        )}
                        <button type="submit" disabled={isSubmitting} className={`flex-1 bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-xl hover:bg-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'} disabled:opacity-50 disabled:hover:translate-y-0`}>
                          {currentStep < 3 ? (
                            <>
                              {t('contact.form.actions.next')}
                              {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                            </>
                          ) : (
                            <>
                              {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                t('contact.form.actions.submit')
                              )}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Modern Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <div className="bg-white p-4 md:p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="bg-slate-50 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">{i18n.language === 'en' ? 'Our Headquarters' : 'مقرنا الرئيسي'}</h3>
                  <p className="text-slate-500 font-bold">{i18n.language === 'en' ? 'Visit us for a coffee and logistics chat' : 'تفضل بزيارتنا لمناقشة حلولك اللوجستية'}</p>
                </div>
              </div>
              <a href={companyInfo.map_url || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-black hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <MapPin className="w-5 h-5 text-amber-400" />
                {i18n.language === 'en' ? 'Get Directions' : 'احصل على الاتجاهات'}
              </a>
            </div>
            
            <div className="w-full h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] z-10"></div>
              <iframe
                src={companyInfo.map_embed_url || (companyInfo.map_url?.includes('embed') ? companyInfo.map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118106.70010221668!2d42.42598379051833!3d18.215886910775836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15fc171927c3e535%3A0xc68d6fbb339a7b7!2sAbha%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1716128000000!5m2!1sen!2s")}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-0 grayscale-[0.2] contrast-125 hover:grayscale-0 transition-all duration-700 object-cover"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
