import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Image as ImageIcon, Film } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const portfolioItemsBase = [
  { 
    id: 1, 
    type: 'image', 
    category: 'transport', 
    url: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2070&auto=format&fit=crop', 
    thumbnail: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=600&auto=format&fit=crop',
  },
  { 
    id: 2, 
    type: 'image', 
    category: 'pharma', 
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop', 
    thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600&auto=format&fit=crop',
  },
  { 
    id: 3, 
    type: 'image', 
    category: 'food', 
    url: 'https://images.unsplash.com/photo-1603501728347-cbdb654a9fc2?q=80&w=2070&auto=format&fit=crop', 
    thumbnail: 'https://images.unsplash.com/photo-1603501728347-cbdb654a9fc2?q=80&w=600&auto=format&fit=crop',
  },
  { 
    id: 4, 
    type: 'image', 
    category: 'storage', 
    url: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c1590f?q=80&w=2070&auto=format&fit=crop', 
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c1590f?q=80&w=600&auto=format&fit=crop',
  },
  { 
    id: 5, 
    type: 'image', 
    category: 'transport', 
    url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
    thumbnail: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  { 
    id: 6, 
    type: 'image', 
    category: 'food', 
    url: 'https://images.unsplash.com/photo-1587049352847-4d4b1f6ea9e1?q=80&w=2080&auto=format&fit=crop', 
    thumbnail: 'https://images.unsplash.com/photo-1587049352847-4d4b1f6ea9e1?q=80&w=600&auto=format&fit=crop',
  },
];

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [apiGallery, setApiGallery] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/gallery` )
      .then(res => res.json())
      .then(data => setApiGallery(data))
      .catch(console.error);

    // Fetch page meta settings
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/settings` )
      .then(res => res.json())
      .then(data => setMeta(data.galleryMeta || null))
      .catch(console.error);
  }, []);

  const categories = [
    { id: 'all', name: i18n.language === 'en' ? 'All' : 'الكل' },
    { id: 'transport', name: i18n.language === 'en' ? 'Refrigerated Transport' : 'النقل المبرد' },
    { id: 'pharma', name: i18n.language === 'en' ? 'Pharmaceuticals' : 'الأدوية الطبية' },
    { id: 'food', name: i18n.language === 'en' ? 'Food & FMCG' : 'الأغذية والإعاشة' },
    { id: 'storage', name: i18n.language === 'en' ? 'Cold Storage' : 'التخزين المبرد' },
  ];

  const b2bTitles: Record<number, {en: string, ar: string}> = {
    1: { en: 'Refrigerated Fleet', ar: 'أسطول النقل المبرد' },
    2: { en: 'Medical Transport', ar: 'نقل الأدوية والمستلزمات الطبية' },
    3: { en: 'Food Distribution', ar: 'توزيع الأغذية والإعاشة' },
    4: { en: 'Cold Storage Warehouse', ar: 'مستودعات التخزين المبرد' },
    5: { en: 'Heavy Duty Trailers', ar: 'شاحنات النقل الثقيل (تريلا)' },
    6: { en: 'Fresh Produce Logistics', ar: 'لوجستيات المنتجات الطازجة' }
  };

  const portfolioItems = apiGallery.length > 0 ? apiGallery.map(item => ({
    ...item,
    title: item[`title_${i18n.language}` as 'title_ar'|'title_en'] || item.title_ar,
    url: item.url.startsWith('/') ? item.url : item.url,
    thumbnail: item.thumbnail ? (item.thumbnail.startsWith('/') ? item.thumbnail : item.thumbnail) : (item.url.startsWith('/') ? item.url : item.url),
  })) : portfolioItemsBase.map(item => ({
    ...item,
    title: b2bTitles[item.id]?.[i18n.language as 'en'|'ar'] || b2bTitles[item.id]?.ar
  }));

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const pageTitle = meta ? (i18n.language === 'en' ? meta.title_en : meta.title_ar) : t('gallery.title');
  const pageDesc = meta ? (i18n.language === 'en' ? meta.desc_en : meta.desc_ar) : t('gallery.desc');

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <SEO title={`${pageTitle} | ركن الريان للنقل المبرد`} description={pageDesc} />
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{pageTitle}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {pageDesc}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                activeFilter === category.id 
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30 scale-105' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-md aspect-[4/3] cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2 text-start">
                      {item.type === 'video' ? (
                        <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <Film className="w-3 h-3" /> {t('gallery.mediaParams.video')}
                        </span>
                      ) : (
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> {t('gallery.mediaParams.image')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white text-start">{item.title}</h3>
                  </div>
                </div>

                {/* Play Icon for Videos */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-amber-500/90 text-slate-900 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 flex-shrink-0" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedMedia(null)}
          >
            <button 
              className="absolute top-6 end-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <video 
                  src={selectedMedia.url} 
                  controls 
                  autoPlay 
                  className="w-full max-h-[80vh] rounded-xl shadow-2xl bg-black"
                />
              ) : (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.title} 
                  className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedMedia.title}</h3>
                <p className="text-slate-400">
                  {categories.find(c => c.id === selectedMedia.category)?.name}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
