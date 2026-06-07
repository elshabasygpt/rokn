import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { Calendar, Eye, Share2, ArrowRight, ArrowLeft, Clock, Facebook, Twitter, Linkedin, CheckCircle2, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

interface Article {
  id: number;
  title_ar: string;
  title_en: string;
  slug: string;
  content_ar: string;
  content_en: string;
  seo_desc_ar: string;
  seo_desc_en: string;
  image: string;
  views: number;
  created_at: string;
  seo_keywords: string;
  active?: boolean;
}

export default function BlogPost() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/articles/${slug}` )
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setArticle(data);
        return Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || ''}/api/articles` ).then(res => res.json()),
          fetch(`${import.meta.env.VITE_API_URL || ''}/api/settings` ).then(res => res.json())
        ]);
      })
      .then(([allData, settingsData]) => {
        setRelatedArticles(allData.filter((a: Article) => a.slug !== slug && a.active !== false).slice(0, 3));
        setSettings(settingsData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setIsLoading(false);
      });
  }, [slug]);

  const isEn = i18n.language === 'en';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent shadow-lg text-amber-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-amber-50 p-6 text-center">
        <Bookmark className="w-16 h-16 text-amber-300 mb-6" />
        <h1 className="text-4xl font-black text-slate-800 mb-4">{isEn ? 'Article Not Found' : 'المقال غير موجود'}</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">{isEn ? 'The article you are looking for may have been removed or the link is broken.' : 'يبدو أن المقال الذي تبحث عنه قد تم حذفه أو أن الرابط غير صحيح.'}</p>
        <Link to={isEn ? '/en/blog' : '/blog'} className="bg-amber-500 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
          {isEn ? <ArrowLeft className="w-5 h-5"/> : <ArrowRight className="w-5 h-5"/>}
          {isEn ? 'Back to Blog' : 'العودة للمدونة'}
        </Link>
      </div>
    );
  }

  const title = isEn ? article.title_en : article.title_ar;
  const content = isEn ? article.content_en : article.content_ar;
  const desc = isEn ? article.seo_desc_en : article.seo_desc_ar;
  
  // Calculate read time (Assume ~200 words per minute)
  const wordCount = content.trim().split(/\s+/).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "image": article.image ? [article.image.startsWith('/') ? `https://www.Rokn Elryanmoving.com${article.image}` : article.image] : [],
    "datePublished": new Date(article.created_at).toISOString(),
    "author": {
      "@type": "Organization",
      "name": isEn ? "Rokn Elryan Refrigerated Transport" : "ركن الريان للنقل المبرد"
    },
    "description": desc
  };

  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(title);

  return (
    <article className="bg-[#f8fafc] min-h-screen relative font-sans selection:bg-amber-200 selection:text-slate-900">
      <SEO title={`${title} | ${isEn ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد'}`} description={desc} schema={schema} />
      
      {/* Reading Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 z-[100] origin-left"
        style={{ scaleX }}
      />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pb-32 lg:pb-40 px-4 md:px-0 overflow-hidden bg-slate-900">
        {/* Background Overlay */}
        {article.image && (
           <div className="absolute inset-0 z-0 opacity-30">
              <img 
                src={article.image.startsWith('/') ? article.image : article.image} 
                alt={title} 
                className="w-full h-full object-cover filter blur-sm scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900"></div>
           </div>
        )}
        
        <div className={`container mx-auto max-w-4xl relative z-10 ${isEn ? 'text-left' : 'text-right'}`}>
          <Link 
            to={isEn ? '/en/blog' : '/blog'} 
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-6 font-bold text-sm bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-full backdrop-blur-sm border border-amber-500/20"
          >
            {isEn ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            {isEn ? 'Back to Blog' : 'العودة للمقالات'}
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight md:leading-tight mb-8 drop-shadow-lg">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700">
                 <Calendar className="w-4 h-4 text-amber-500" />
                 {new Date(article.created_at).toLocaleDateString(isEn ? 'en-US' : 'ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700">
                 <Clock className="w-4 h-4 text-amber-500" />
                 {readTimeMin} {isEn ? 'min read' : 'دقائق قراءة'}
              </span>
              <span className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700">
                 <Eye className="w-4 h-4 text-amber-500" />
                 {article.views} {isEn ? 'Views' : 'مشاهدة'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl -mt-16 md:-mt-24 lg:-mt-32 relative z-20 mb-20 lg:mb-32">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Main Content Area */}
          <main className="w-full lg:w-[70%]">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              {/* Featured Image inside card */}
              {article.image && (
                <div className="w-full h-[300px] md:h-[450px] relative">
                  <img 
                    src={article.image.startsWith('/') ? article.image : article.image} 
                    alt={title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              {/* Content Body */}
              <div className="p-8 md:p-12 lg:p-16">
                <div 
                  className={`prose prose-lg md:prose-xl max-w-none prose-slate prose-headings:font-black prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-amber-600 hover:prose-a:text-amber-700 prose-strong:text-slate-800 prose-li:text-slate-600 ${!isEn && 'text-right'}`}
                  dangerouslySetInnerHTML={{ __html: content }}
                >
                </div>

                {/* Keywords Tags */}
                {article.seo_keywords && (
                  <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
                    {article.seo_keywords.split(',').map((kw, i) => kw.trim() && (
                      <span key={i} className="bg-slate-100 text-slate-600 px-4 py-2 text-sm rounded-full font-bold hover:bg-slate-200 transition-colors cursor-pointer">#{kw.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Author / CTA Box */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
               <div className="relative z-10 text-center md:text-right flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg p-2 overflow-hidden">
                     {(() => {
                        const blogLogo = isEn 
                          ? settings?.general?.logo_blog_en || '/logo.png'
                          : settings?.general?.logo_blog_ar || '/logo.png';
                        // Keep logo.png absolute, process others
                        const finalSrc = blogLogo === '/logo.png' ? blogLogo : (blogLogo.startsWith('/') ? blogLogo : blogLogo);
                        return (
                          <img 
                            src={finalSrc} 
                            alt={isEn ? 'Rokn Elryan Services' : 'ركن الريان للخدمات'} 
                            className="w-full h-full object-contain" 
                          />
                        );
                     })()}
                  </div>
                  <div className="flex-1">
                     <h4 className="text-2xl font-black text-white mb-2">{isEn ? 'Rokn Elryan Refrigerated Transport' : 'شركة ركن الريان للنقل المبرد'}</h4>
                     <p className="text-slate-300 leading-relaxed mb-6 font-medium">
                        {isEn ? 'The leading company in refrigerated and frozen transport services in Saudi Arabia, serving you with professionalism and safety to preserve your products.' : 'الشركة الرائدة في خدمات النقل المبرد والمجمد في المملكة العربية السعودية، نخدمك باحترافية وأمان للحفاظ على منتجاتك.'}
                     </p>
                     <Link to={isEn ? '/en/contact' : '/contact'} className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-full transition-colors shadow-lg">
                        {isEn ? 'Book a Truck Now' : 'اطلب شاحنتك الآن'}
                     </Link>
                  </div>
               </div>
            </motion.div>
          </main>

          {/* Sticky Sidebar */}
          <aside className="w-full lg:w-[30%] lg:sticky lg:top-8 space-y-8">
             {/* Share Box */}
             <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
                <h4 className="text-lg font-bold text-slate-800 mb-6">{isEn ? 'Share this article' : 'شارك هذا المقال'}</h4>
                <div className="flex justify-center gap-3">
                   <a href={`https://wa.me/?text=${shareText} - ${shareUrl}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all transform hover:scale-110">
                      <Share2 className="w-5 h-5" />
                   </a>
                   <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all transform hover:scale-110">
                      <Twitter className="w-5 h-5" />
                   </a>
                   <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#4267B2]/10 text-[#4267B2] flex items-center justify-center hover:bg-[#4267B2] hover:text-white transition-all transform hover:scale-110">
                      <Facebook className="w-5 h-5" />
                   </a>
                   <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all transform hover:scale-110">
                      <Linkedin className="w-5 h-5" />
                   </a>
                </div>
             </div>

             {/* Quick Contact Banner */}
             <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-8 shadow-xl shadow-amber-500/20 text-center text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
                <h4 className="text-2xl font-black mb-3 relative z-10">{isEn ? 'Need to transport products safely?' : 'تحتاج نقل منتجاتك بأمان؟'}</h4>
                <p className="text-amber-50 font-medium mb-6 relative z-10">
                   {isEn ? 'Get a free immediate consultation.' : 'احصل على استشارة فورية مجانية.'}
                </p>
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="inline-block bg-slate-900 text-white font-bold w-full py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg relative z-10">
                     {isEn ? 'Contact WhatsApp' : 'تواصل واتساب'}
                  </a>
                )}
             </div>
          </aside>

        </div>
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
         <div className="bg-white py-20 border-t border-slate-100">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
               <div className="flex justify-between items-end mb-12">
                  <div>
                     <h3 className="text-3xl font-black text-slate-800 mb-2">{isEn ? 'Related Articles' : 'مقالات ذات صلة'}</h3>
                     <p className="text-slate-500">{isEn ? 'Read more from our blog' : 'اقرأ المزيد من مدونتنا'}</p>
                  </div>
                  <Link to={isEn ? '/en/blog' : '/blog'} className="hidden md:flex items-center gap-2 text-amber-500 font-bold hover:text-amber-600 transition-colors bg-amber-50 px-6 py-2 rounded-full">
                     {isEn ? 'View All' : 'عرض الكل'}
                     {isEn ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </Link>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedArticles.map((rel, i) => (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        key={rel.id} 
                     >
                        <Link to={`/${isEn ? 'en/' : ''}blog/${rel.slug}`} className="group block bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-500/10 transition-all">
                           <div className="h-48 overflow-hidden relative">
                              {rel.image ? (
                                 <img 
                                    src={rel.image.startsWith('/') ? rel.image : rel.image} 
                                    alt={isEn ? rel.title_en : rel.title_ar} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                 />
                              ) : (
                                 <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                    <Bookmark className="w-8 h-8 text-slate-400" />
                                 </div>
                              )}
                           </div>
                           <div className="p-6">
                              <span className="text-xs font-bold text-amber-500 mb-3 block uppercase tracking-wider">
                                 {new Date(rel.created_at).toLocaleDateString(isEn ? 'en-US' : 'ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                              <h4 className="font-black text-xl text-slate-800 mb-3 group-hover:text-amber-500 transition-colors line-clamp-2">
                                 {isEn ? rel.title_en : rel.title_ar}
                              </h4>
                              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                 {isEn ? rel.seo_desc_en : rel.seo_desc_ar}
                              </p>
                           </div>
                        </Link>
                     </motion.div>
                  ))}
               </div>
               
               <Link to={isEn ? '/en/blog' : '/blog'} className="mt-8 flex md:hidden items-center justify-center gap-2 text-amber-500 font-bold bg-amber-50 hover:bg-amber-100 transition-colors px-6 py-3 rounded-full w-full">
                  {isEn ? 'View All Articles' : 'عرض كافة المقالات'}
               </Link>
            </div>
         </div>
      )}

    </article>
  );
}
