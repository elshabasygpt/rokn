import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Eye, ArrowLeft, ArrowRight, HomeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

interface Article {
  id: number;
  title_ar: string;
  title_en: string;
  slug: string;
  seo_desc_ar: string;
  seo_desc_en: string;
  image: string;
  views: number;
  created_at: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching articles:', err);
        setIsLoading(false);
      });
  }, []);

  const isEn = i18n.language === 'en';
  
  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <SEO 
        title={isEn ? 'Our Blog & Articles | Rokn Elryan Refrigerated Transport' : 'المدونة والمقالات | ركن الريان للنقل المبرد'} 
        description={isEn ? 'Read our latest tips and articles about moving, packing and furniture assembly.' : 'اقرأ أحدث نصائحنا ومقالاتنا حول نقل وتغليف وتركيب الأثاث.'} 
      />
      <div className="container mx-auto px-4 md:px-6">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold mb-6">
            <FileText className="w-5 h-5" />
            {isEn ? 'Moving Tips & Articles' : 'نصائح ومقالات النقل'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{isEn ? 'Latest from our Blog' : 'أحدث مقالاتنا'}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {isEn ? 'Discover expert advice, packing hacks, and updates to make your next move seamless.' : 'اكتشف نصائح الخبراء وحيل التغليف وأحدث التوجيهات لجعل عملية نقلك القادمة سلسة ومريحة.'}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl border border-slate-200">
             <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-700">{isEn ? 'No articles yet' : 'لا توجد مقالات حتى الآن'}</h3>
             <p className="text-slate-500 mt-2">{isEn ? 'Check back soon for updates!' : 'عد قريباً لتجد الجديد الممتع!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => {
              const title = isEn ? article.title_en : article.title_ar;
              const desc = isEn ? article.seo_desc_en : article.seo_desc_ar;
              const link = isEn ? `/en/blog/${article.slug}` : `/blog/${article.slug}`;

              return (
                <motion.article 
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group border border-slate-100 flex flex-col h-full"
                >
                  <Link to={link} className="relative block h-56 overflow-hidden">
                    {article.image ? (
                      <img 
                        src={article.image.startsWith('/') ? article.image : article.image} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <HomeIcon className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4 font-medium">
                       <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full text-slate-600 border border-slate-100">
                         <Calendar className="w-4 h-4 text-amber-500" />
                         {new Date(article.created_at).toLocaleDateString(isEn ? 'en-US' : 'ar-SA')}
                       </span>
                       <span className="flex items-center gap-1">
                         <Eye className="w-4 h-4" />
                         {article.views}
                       </span>
                    </div>

                    <Link to={link}>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {title}
                      </h2>
                    </Link>
                    
                    <p className="text-slate-600 line-clamp-3 mb-6 flex-1">
                      {desc || ''}
                    </p>

                    <Link 
                      to={link}
                      className="inline-flex items-center gap-2 font-bold text-amber-600 group-hover:text-amber-700 transition-colors mt-auto"
                    >
                      {isEn ? 'Read More' : 'اقرأ المزيد'}
                      {isEn ? <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /> : <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />}
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
