import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, ThermometerSnowflake, ShieldCheck, MapPin, Wind, Zap, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const iconMap: Record<string, any> = {
  Truck: <Truck className="w-8 h-8 text-amber-500" />,
  Wind: <Wind className="w-8 h-8 text-amber-500" />,
  Zap: <Zap className="w-8 h-8 text-amber-500" />,
  ThermometerSnowflake: <ThermometerSnowflake className="w-8 h-8 text-amber-500" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8 text-amber-500" />,
  MapPin: <MapPin className="w-8 h-8 text-amber-500" />
};

const VehicleDisplay = ({ vehicle, isReversed, title, desc, capacity, vIcon, i18n }: any) => {
  const [activeImage, setActiveImage] = useState(vehicle.image);

  useEffect(() => {
    setActiveImage(vehicle.image);
  }, [vehicle.image]);

  return (
    <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
      <motion.div 
        initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:w-1/2 flex flex-col gap-4 w-full"
      >
        <div className="relative w-full h-[350px] md:h-[450px] rounded-[2rem] bg-slate-50 overflow-hidden group border border-slate-200 shadow-2xl flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent z-0"></div>
          
          <AnimatePresence mode="wait">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              src={activeImage} 
              alt={title} 
              className="w-full h-full object-contain relative z-10 p-6 drop-shadow-xl"
            />
          </AnimatePresence>

          <div className="absolute top-4 end-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 z-20 transition-transform group-hover:scale-110">
            {vIcon}
          </div>
        </div>
        
        {vehicle.images && vehicle.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 pt-2 z-10 scrollbar-hide px-1">
            <button
              onClick={() => setActiveImage(vehicle.image)}
              className={`relative rounded-xl overflow-hidden h-20 md:h-24 aspect-[4/3] flex-shrink-0 transition-all duration-300 border-2 ${
                activeImage === vehicle.image 
                  ? 'border-amber-500 shadow-md shadow-amber-500/20 scale-105' 
                  : 'border-transparent hover:border-amber-500/50 opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={vehicle.image}
                alt={`${title} - رئيسية`}
                className="w-full h-full object-cover"
              />
            </button>
            {vehicle.images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`relative rounded-xl overflow-hidden h-20 md:h-24 aspect-[4/3] flex-shrink-0 transition-all duration-300 border-2 ${
                  activeImage === img 
                    ? 'border-amber-500 shadow-md shadow-amber-500/20 scale-105' 
                    : 'border-transparent hover:border-amber-500/50 opacity-70 hover:opacity-100'
                }`}
              >
                <img 
                  src={img}
                  alt={`${title} - إضافية ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:w-1/2"
      >
        <h2 className="text-4xl font-black text-slate-900 mb-6">{title}</h2>
        <p className="text-xl text-slate-600 leading-relaxed mb-8">
          {desc}
        </p>
        
        <div className="bg-slate-900 text-white p-6 rounded-2xl border-s-4 border-amber-500 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-lg">{capacity}</span>
          </div>
        </div>

        <Link 
          to="/enterprise-quote" 
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/30"
        >
          {i18n.language === 'en' ? 'Request Pricing' : 'طلب تسعيرة للشاحنة'}
        </Link>
      </motion.div>
    </div>
  );
};

export default function Fleet() {
  const { t, i18n } = useTranslation();
  const [meta, setMeta] = useState<any>(null);
  const [apiVehicles, setApiVehicles] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/settings` )
      .then(res => res.json())
      .then(data => {
        if (data.fleetMeta) setMeta(data.fleetMeta);
        if (data.fleetData?.list) setApiVehicles(data.fleetData.list);
      })
      .catch(console.error);
  }, []);

  const vehicles = [
    {
      id: 'dyna',
      key: 'fleet.vehicles.dyna',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      icon: <Truck className="w-8 h-8 text-amber-500" />
    },
    {
      id: 'jumbo',
      key: 'fleet.vehicles.jumbo',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      icon: <Wind className="w-8 h-8 text-amber-500" />
    },
    {
      id: 'trailer',
      key: 'fleet.vehicles.trailer',
      image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2070&auto=format&fit=crop',
      icon: <Zap className="w-8 h-8 text-amber-500" />
    }
  ];

  const features = [
    { icon: <ThermometerSnowflake className="w-6 h-6 text-blue-500" />, key: 'fleet.features.dataLogger' },
    { icon: <MapPin className="w-6 h-6 text-emerald-500" />, key: 'fleet.features.gps' },
    { icon: <ShieldCheck className="w-6 h-6 text-amber-500" />, key: 'fleet.features.sanitized' },
    { icon: <Wind className="w-6 h-6 text-sky-500" />, key: 'fleet.features.thermoKing' }
  ];

  const pageTitle = meta ? (i18n.language === 'en' ? meta.title_en : meta.title_ar) : t('fleet.title', { defaultValue: i18n.language === 'en' ? 'Our Refrigerated Fleet' : 'أسطول النقل المبرد' });
  const pageDesc = meta ? (i18n.language === 'en' ? meta.subtitle_en : meta.subtitle_ar) : t('fleet.subtitle', { defaultValue: i18n.language === 'en' ? 'Comprehensive fleet of refrigerated trucks.' : 'أسطول متكامل من الشاحنات المبردة.' });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEO title={`${pageTitle} | ${i18n.language === 'en' ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد'}`} description={pageDesc} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 z-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1580674292641-8e01768651c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Refrigerated Fleet" 
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
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-amber-500/30">
              <Truck className="w-4 h-4" />
              {i18n.language === 'en' ? 'Fleet Capabilities' : 'إمكانيات الأسطول'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-sm">{pageTitle}</h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
              {pageDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Technology Features Strip */}
      <div className="bg-white border-b border-slate-200 shadow-sm relative z-30 -mt-8 mx-4 md:mx-auto max-w-6xl rounded-2xl p-6 md:p-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                {feature.icon}
              </div>
              <p className="font-bold text-slate-700">{t(feature.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Vehicles Details */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="space-y-24">
          {(apiVehicles.length > 0 ? apiVehicles : vehicles).map((vehicle, idx) => {
            const isReversed = idx % 2 !== 0;
            const title = apiVehicles.length > 0 ? (i18n.language === 'en' ? vehicle.title_en : vehicle.title_ar) : t(`${vehicle.key}.title`);
            const desc = apiVehicles.length > 0 ? (i18n.language === 'en' ? vehicle.desc_en : vehicle.desc_ar) : t(`${vehicle.key}.desc`);
            const capacity = apiVehicles.length > 0 ? (i18n.language === 'en' ? vehicle.capacity_en : vehicle.capacity_ar) : t(`${vehicle.key}.capacity`);
            const vIcon = apiVehicles.length > 0 ? (iconMap[vehicle.icon] || <Truck className="w-8 h-8 text-amber-500" />) : vehicle.icon;

            return (
              <VehicleDisplay 
                key={vehicle.id}
                vehicle={vehicle}
                isReversed={isReversed}
                title={title}
                desc={desc}
                capacity={capacity}
                vIcon={vIcon}
                i18n={i18n}
              />
            );
          })}
        </div>
      </section>

    </div>
  );
}
