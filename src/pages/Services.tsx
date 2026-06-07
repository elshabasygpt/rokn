import React, { useState, useEffect } from 'react';
import { Truck, ThermometerSnowflake, Wind, Snowflake, ShieldCheck, CheckCircle2, MapPin, Clock, HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const ImageSlider = ({ images, alt, t }: { images: string[], alt: string, t: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, [images?.length]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] rounded-3xl bg-slate-100 flex items-center justify-center border border-slate-200">
         <HomeIcon className="w-12 h-12 text-slate-300" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-xl group" dir="ltr">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].startsWith('/') ? images[currentIndex] : images[currentIndex]}
          alt={`${alt} - ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-amber-500 w-8' : 'bg-white/60 hover:bg-white w-2.5'}`}
            aria-label={`${t('servicesPage.imageAlt')} ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Services() {
  const { t, i18n } = useTranslation();
  const [apiServices, setApiServices] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    // Fetch individual services
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/services` )
      .then(res => res.json())
      .then(data => setApiServices(data))
      .catch(console.error);

    // Fetch page meta settings
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/settings` )
      .then(res => res.json())
      .then(data => setMeta(data.servicesMeta || null))
      .catch(console.error);
  }, []);
  
  const serviceItems = t('servicesPage.items', { returnObjects: true }) as {
    id: string,
    title: string,
    desc: string,
    features: string[]
  }[];

  const serviceImages: Record<string, string[]> = {
    'transport': [
      'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2070&auto=format&fit=crop', // Refrigerated Truck on highway
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Truck rear
      'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Warehouse docking
    ],
    'pharma': [
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop', // Pharma vials
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2069&auto=format&fit=crop', // Medicine storage
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop' // Lab/Medical logistics
    ],
    'food': [
      'https://images.unsplash.com/photo-1603501728347-cbdb654a9fc2?q=80&w=2070&auto=format&fit=crop', // Cold food storage
      'https://images.unsplash.com/photo-1587049352847-4d4b1f6ea9e1?q=80&w=2080&auto=format&fit=crop', // Fresh produce
      'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=1915&auto=format&fit=crop' // Grocery/FMCG distribution
    ],
    'storage': [
      'https://images.unsplash.com/photo-1586528116311-ad8ed7c1590f?q=80&w=2070&auto=format&fit=crop', // Logistics warehouse
      'https://images.unsplash.com/photo-1580674292641-8e01768651c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Boxes in warehouse
      'https://images.unsplash.com/photo-1622322588329-373e3eb23c7b?q=80&w=2080&auto=format&fit=crop' // Industrial freezer concept
    ]
  };

  const iconMap: any = { Truck, ThermometerSnowflake, Wind, Snowflake, ShieldCheck, MapPin, Clock, Home: HomeIcon };

  // Helper for meta data
  const getMeta = (field: string, fallbackKey: string) => {
    if (meta && meta[field]) return meta[field];
    return t(fallbackKey);
  };

  const pageTitle = meta ? (i18n.language === 'en' ? meta.title_en : meta.title_ar) : t('servicesPage.title');
  const pageDesc = meta ? (i18n.language === 'en' ? meta.desc_en : meta.desc_ar) : t('servicesPage.desc');
  
  const ctaTitle = meta ? (i18n.language === 'en' ? meta.cta_title_en : meta.cta_title_ar) : t('servicesPage.cta.title');
  const ctaDesc = meta ? (i18n.language === 'en' ? meta.cta_desc_en : meta.cta_desc_ar) : t('servicesPage.cta.desc');
  const ctaBtn1 = meta ? (i18n.language === 'en' ? meta.cta_btn1_en : meta.cta_btn1_ar) : t('servicesPage.cta.book');
  const ctaBtn2 = meta ? (i18n.language === 'en' ? meta.cta_btn2_en : meta.cta_btn2_ar) : t('servicesPage.cta.call');

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
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{pageTitle}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {pageDesc}
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-12 md:space-y-20"
        >
          {(apiServices.length > 0 ? apiServices : serviceItems.map((s, i) => ({ ...s, icon: ['Truck','ThermometerSnowflake','Wind','Snowflake'][i]}))).map((service, index) => {
            const Icon = iconMap[service.icon] || Truck;
            const title = apiServices.length > 0 ? service[`title_${i18n.language}` as 'title_ar'|'title_en'] : service.title;
            const desc = apiServices.length > 0 ? service[`desc_${i18n.language}` as 'desc_ar'|'desc_en'] : service.desc;
            const features = apiServices.length > 0 ? service[`features_${i18n.language}` as 'features_ar'|'features_en'] || [] : service.features;
            const images = apiServices.length > 0 && service.images && service.images.length > 0 ? service.images : serviceImages[service.id || Object.keys(serviceImages)[index % 4]] || serviceImages['moving'];

            return (
              <motion.div variants={fadeInUp} key={service.id || index} className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}>
                <div className="w-full md:w-1/2">
                  <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 relative overflow-hidden group text-start">
                    <div className="absolute top-0 end-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors"></div>
                    <Icon className="w-16 h-16 text-amber-500 mb-6 relative z-10" />
                    <h2 className="text-3xl font-black text-slate-900 mb-4 relative z-10">{title}</h2>
                    <p className="text-slate-600 text-lg leading-relaxed mb-8 relative z-10">{desc}</p>
                    
                    <ul className="space-y-3 relative z-10">
                      {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-semibold">
                          <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <ImageSlider images={images} alt={title} t={t} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-24 bg-slate-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519003722824-194d4455aeb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{ctaTitle}</h2>
            <p className="text-slate-300 text-lg mb-10">
              {ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-amber-500 text-slate-900 font-bold text-lg px-8 py-4 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
                {ctaBtn1}
              </Link>
              <a href="tel:0502375887" className="bg-white/10 text-white border border-white/20 backdrop-blur-sm font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
                {ctaBtn2}
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
