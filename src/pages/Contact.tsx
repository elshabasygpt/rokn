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
  const [meta, setMeta] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data.general || {});
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
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
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
    <div className="py-12 md:py-20">
      <SEO title={`${pageTitle} | ${i18n.language === 'en' ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد'}`} description={pageDesc} />
      <div className="container mx-auto px-4 md:px-6">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{tLang('title', 'contact.title')}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {tLang('desc', 'contact.desc')}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-2/5 p-10 md:p-12 text-white bg-slate-800 relative overflow-hidden"
          >
            <div className="absolute top-0 end-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 text-start">
              <h2 className="text-3xl font-black mb-8">{tLang('info_title', 'contact.info.title')}</h2>
              
              <div className="space-y-8">
                <a href={`tel:${settings.phone1 || ''}`} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500 transition-colors flex-shrink-0">
                    <Phone className="w-7 h-7 text-amber-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">{t('contact.info.p1Label')}</div>
                    <div dir="ltr" className="text-2xl font-bold group-hover:text-amber-400 transition-colors text-end">{settings.phone1 || '050 237 5887'}</div>
                  </div>
                </a>
                
                <a href={`tel:${settings.phone2 || ''}`} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500 transition-colors flex-shrink-0">
                    <Phone className="w-7 h-7 text-amber-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">{t('contact.info.p2Label')}</div>
                    <div dir="ltr" className="text-2xl font-bold group-hover:text-amber-400 transition-colors text-end">{settings.phone2 || '053 453 2962'}</div>
                  </div>
                </a>

                <a href={`https://wa.me/${settings.whatsapp || ''}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#25D366] transition-colors flex-shrink-0">
                    <MessageCircle className="w-7 h-7 text-[#25D366] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">{t('contact.info.waLabel')}</div>
                    <div className="text-xl font-bold group-hover:text-[#25D366] transition-colors" dir="ltr">{settings.whatsapp || tLang('waText', 'contact.info.waText')}</div>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">{t('contact.info.hqLabel')}</div>
                    <div className="text-xl font-bold">{tLang('info_hqText', 'contact.info.hqText')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">{t('contact.info.hoursLabel')}</div>
                    <div className="text-xl font-bold">{tLang('info_hoursText', 'contact.info.hoursText')}</div>
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
            className="lg:w-3/5 p-8 md:p-12 bg-white relative flex flex-col"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{tLang('form_title', 'contact.form.title')}</h3>
            <p className="text-slate-600 mb-8">{tLang('form_desc', 'contact.form.desc')}</p>
            
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center flex-grow min-h-[400px]"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">{tLang('form_successTitle', 'contact.form.successTitle')}</h4>
                  <p className="text-slate-600">{tLang('form_successDesc', 'contact.form.successDesc')}</p>
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
                  <div className="mb-8 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
                    <div 
                      className="absolute top-1/2 start-0 h-1 bg-amber-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                    ></div>
                    <div className="flex justify-between relative z-10">
                      {steps.map((step) => (
                        <div key={step.num} className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${currentStep >= step.num ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                            <step.icon className="w-5 h-5" />
                          </div>
                          <span className={`text-xs font-bold ${currentStep >= step.num ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                    <div className="flex-grow">
                      {/* Step 1: Location */}
                      {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.form.fields.fromCity')}</label>
                            <SearchableSelect 
                              required 
                              value={formData.from_city} 
                              onChange={val => setFormData({...formData, from_city: val})} 
                              options={cityOptions}
                              placeholder={t('contact.form.fields.fromPlaceholder')}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 hover:border-amber-500 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all bg-slate-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.form.fields.toCity')}</label>
                            <SearchableSelect 
                              required 
                              value={formData.to_city} 
                              onChange={val => setFormData({...formData, to_city: val})} 
                              options={cityOptions}
                              placeholder={t('contact.form.fields.toPlaceholder')}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 hover:border-amber-500 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all bg-slate-50"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Details */}
                      {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.form.fields.volume')}</label>
                            <select required value={formData.rooms} onChange={e => setFormData({...formData, rooms: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-slate-50">
                              <option value="">{t('contact.form.fields.volumePlaceholder')}</option>
                              <option value="1">{t('contact.form.fields.options.1')}</option>
                              <option value="2">{t('contact.form.fields.options.2')}</option>
                              <option value="3">{t('contact.form.fields.options.3')}</option>
                              <option value="4">{t('contact.form.fields.options.4')}</option>
                              <option value="office">{t('contact.form.fields.options.office')}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.form.fields.notes')}</label>
                            <textarea rows={4} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-slate-50 resize-none" placeholder={t('contact.form.fields.notesPlaceholder')}></textarea>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Contact */}
                      {currentStep === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.form.fields.name')}</label>
                            <input required value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-slate-50" placeholder={t('contact.form.fields.namePlaceholder')} />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('contact.form.fields.phone')}</label>
                            <input required value={formData.client_phone} onChange={e => setFormData({...formData, client_phone: e.target.value})} type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all bg-slate-50 text-end" placeholder={t('contact.form.fields.phonePlaceholder')} dir="ltr" />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                      {currentStep > 1 && (
                        <button type="button" onClick={prevStep} className={`px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                          {t('contact.form.actions.prev')}
                        </button>
                      )}
                      <button type="submit" disabled={isSubmitting} className={`flex-1 bg-amber-500 text-slate-900 font-bold text-lg py-4 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'} disabled:opacity-50`}>
                        {currentStep < 3 ? (
                          <>
                            {t('contact.form.actions.next')}
                            {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                          </>
                        ) : (
                          t('contact.form.actions.submit')
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
    </div>
  );
}
