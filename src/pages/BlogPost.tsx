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
    "image": article.image ? [article.image.startsWith('/') ? `${window.location.origin}${article.image}` : article.image] : [],
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
    <article className="bg-[#f8fafc] min-h-screen relative font-sans selection:bg-[#D4A017]/30 selection:text-[#0A2A5E]">
      <SEO title={`${title} | ${isEn ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد'}`} description={desc} schema={schema} />
      
      {/* Reading Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4A017] to-amber-600 z-[100] origin-left"
        style={{ scaleX }}
      />
      
      {/* Hero Section - Maximum Visual Impact */}
      <div className="relative pt-32 pb-24 md:pb-32 lg:pb-40 px-4 md:px-0 overflow-hidden bg-[#0A2A5E] min-h-[60vh] flex items-end rounded-b-[3rem] md:rounded-b-[5rem] shadow-2xl">
        {/* Clear Background Image with Gradient Fade */}
        {article.image && (
           <div className="absolute inset-0 z-0">
              <img 
                src={article.image.startsWith('/') ? article.image : article.image} 
                alt={title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A5E] via-[#0A2A5E]/80 to-[#0A2A5E]/20"></div>
           </div>
        )}
        
        {/* Subtle Gold Accent */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4A017]/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className={`container mx-auto max-w-5xl relative z-10 flex flex-col items-center text-center mt-20`}>
          <Link 
            to={isEn ? '/en/blog' : '/blog'} 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 font-bold text-sm bg-white/10 hover:bg-[#D4A017] px-6 py-2.5 rounded-full backdrop-blur-md border border-white/20"
          >
            {isEn ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            {isEn ? 'Back to Knowledge Center' : 'العودة لمركز المعرفة'}
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.3] md:leading-[1.3] mb-10 drop-shadow-2xl">
              {title}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-semibold text-white/90">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-5 py-2.5 rounded-2xl border border-white/10 shadow-xl">
                 <Calendar className="w-4 h-4 text-[#D4A017]" />
                 {new Date(article.created_at).toLocaleDateString(isEn ? 'en-US' : 'ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-5 py-2.5 rounded-2xl border border-white/10 shadow-xl">
                 <Clock className="w-4 h-4 text-[#D4A017]" />
                 {readTimeMin} {isEn ? 'min read' : 'دقائق قراءة'}
              </span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-5 py-2.5 rounded-2xl border border-white/10 shadow-xl">
                 <Eye className="w-4 h-4 text-[#D4A017]" />
                 {article.views} {isEn ? 'Views' : 'مشاهدة'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl -mt-10 relative z-20 mb-20 lg:mb-32">
        <div className={`flex flex-col ${isEn ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-start justify-center`}>
          
          {/* Main Content Area */}
          <main className="w-full lg:max-w-[850px] shrink-0">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-[#0A2A5E]/10 border border-slate-100"
            >
              {/* Content Body */}
              <div className="p-8 md:p-12 lg:p-16">
                <div 
                  className={`prose prose-lg md:prose-2xl max-w-none prose-slate 
                    text-xl md:text-[22px] leading-[2.2] md:leading-[2.4] font-medium text-slate-700 whitespace-pre-line
                    prose-headings:font-black prose-headings:text-[#0A2A5E] prose-headings:mt-12 prose-headings:mb-6
                    prose-p:text-slate-700 prose-p:leading-[2.2] md:prose-p:leading-[2.4] prose-p:mb-8 prose-p:text-justify
                    prose-a:text-[#D4A017] hover:prose-a:text-amber-700 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-[#0A2A5E] prose-strong:font-black prose-li:text-slate-700 prose-li:mb-2
                    prose-blockquote:border-l-[6px] prose-blockquote:border-[#D4A017] prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-[#0A2A5E] prose-blockquote:font-bold prose-blockquote:text-2xl prose-blockquote:leading-relaxed prose-blockquote:shadow-sm
                    ${!isEn && 'text-right prose-blockquote:border-r-[6px] prose-blockquote:border-[#D4A017] prose-blockquote:border-l-0 prose-blockquote:rounded-l-2xl prose-blockquote:rounded-r-none'}`}
                  dangerouslySetInnerHTML={{ __html: content }}
                >
                </div>

                {/* Keywords Tags */}
                {article.seo_keywords && (
                  <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-3">
                    {article.seo_keywords.split(',').map((kw, i) => kw.trim() && (
                      <span key={i} className="bg-slate-50 text-slate-600 px-5 py-2.5 text-sm rounded-xl font-bold hover:bg-[#0A2A5E] hover:text-white transition-colors cursor-pointer border border-slate-100 shadow-sm">#{kw.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Author / Enterprise CTA Box */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mt-12 bg-[#0A2A5E] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017] rounded-full blur-[120px] opacity-20 -mr-20 -mt-20"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[120px] opacity-10 -ml-20 -mb-20"></div>
               
               <div className="relative z-10 text-center md:text-right flex flex-col md:flex-row items-center gap-8">
                  <div className="w-28 h-28 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-xl p-4 overflow-hidden border-4 border-white/10">
                     {(() => {
                        const blogLogo = isEn 
                          ? settings?.general?.logo_blog_en || '/logo.png'
                          : settings?.general?.logo_blog_ar || '/logo.png';
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
                     <h4 className="text-2xl font-black text-white mb-3">{isEn ? 'Rokn Elryan Refrigerated Transport' : 'شركة ركن الريان للنقل المبرد'}</h4>
                     <p className="text-slate-300 leading-relaxed mb-8 font-medium">
                        {isEn ? 'The leading enterprise in refrigerated logistics across Saudi Arabia. We deliver supply chain excellence, ensuring your temperature-sensitive cargo reaches its destination with uncompromising quality.' : 'الشريك اللوجستي الرائد للنقل المبرد في المملكة. نقدم حلول سلاسل التوريد المتكاملة لضمان وصول شحناتك الحساسة للحرارة بأعلى معايير الجودة والأمان.'}
                     </p>
                     <Link to={isEn ? '/en/contact' : '/contact'} className="inline-block bg-[#D4A017] hover:bg-[#b58812] text-white font-bold px-10 py-4 rounded-xl transition-colors shadow-lg shadow-[#D4A017]/20">
                        {isEn ? 'Request Enterprise Quote' : 'احصل على عرض سعر للشركات'}
                     </Link>
                  </div>
               </div>
            </motion.div>
          </main>

          {/* Sticky Sidebar */}
          <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-8 space-y-8 mt-12 lg:mt-0">
             {/* Float Share Box */}
             <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-[#0A2A5E]/10 border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4A017]/10 rounded-full blur-2xl"></div>
                <h4 className="text-xl font-black text-[#0A2A5E] mb-6">{isEn ? 'Share Article' : 'شارك المقال'}</h4>
                <div className="flex justify-center gap-4">
                   <a href={`https://wa.me/?text=${shareText} - ${shareUrl}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                      <Share2 className="w-5 h-5" />
                   </a>
                   <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                      <Twitter className="w-5 h-5" />
                   </a>
                   <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                      <Linkedin className="w-5 h-5" />
                   </a>
                </div>
             </div>

             {/* Enterprise Contact Banner */}
             <div className="bg-gradient-to-br from-[#0A2A5E] to-slate-900 rounded-3xl p-8 shadow-2xl shadow-[#0A2A5E]/20 text-center text-white relative overflow-hidden border border-slate-700">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#D4A017]/20 rounded-full blur-2xl"></div>
                
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10">
                   <CheckCircle2 className="w-8 h-8 text-[#D4A017]" />
                </div>
                
                <h4 className="text-2xl font-black mb-4 relative z-10 leading-tight">
                  {isEn ? 'Enterprise Logistics Solutions' : 'حلول لوجستية متكاملة للمؤسسات'}
                </h4>
                
                <p className="text-slate-300 font-medium mb-8 relative z-10 text-sm leading-relaxed">
                   {isEn ? 'Secure your cold chain with our modern fleet and temperature-controlled operations.' : 'حافظ على سلامة منتجاتك المبردة مع أسطولنا الحديث وعملياتنا المراقبة على مدار الساعة.'}
                </p>
                
                <div className="space-y-3 relative z-10">
                   {settings?.whatsapp && (
                     <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold w-full py-4 rounded-xl transition-colors shadow-lg">
                        <Facebook className="w-5 h-5 hidden" /> {/* Just for spacing visually if needed, but lets use real icon */}
                        {isEn ? 'WhatsApp Us' : 'تواصل عبر الواتساب'}
                     </a>
                   )}
                   <Link to={isEn ? '/en/contact' : '/contact'} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold w-full py-4 rounded-xl transition-colors backdrop-blur-md border border-white/10">
                      {isEn ? 'Contact Sales' : 'تواصل مع المبيعات'}
                   </Link>
                </div>
             </div>
          </aside>

        </div>
      </div>

      {/* Related Articles Section - Premium Cards */}
      {relatedArticles.length > 0 && (
         <div className="bg-white py-24 border-t border-slate-100">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
               <div className="flex justify-between items-end mb-16">
                  <div>
                     <h3 className="text-3xl md:text-4xl font-black text-[#0A2A5E] mb-4">{isEn ? 'Industry Insights' : 'رؤى القطاع اللوجستي'}</h3>
                     <p className="text-slate-500 text-lg">{isEn ? 'Latest news and supply chain expertise' : 'أحدث الأخبار وخبرات سلاسل التوريد'}</p>
                  </div>
                  <Link to={isEn ? '/en/blog' : '/blog'} className="hidden md:flex items-center gap-2 text-[#0A2A5E] font-bold hover:text-white hover:bg-[#0A2A5E] transition-all border-2 border-[#0A2A5E] px-8 py-3 rounded-xl">
                     {isEn ? 'View All Insights' : 'عرض كافة الرؤى'}
                     {isEn ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
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
                        <Link to={`/${isEn ? 'en/' : ''}blog/${rel.slug}`} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-[#D4A017]/30 hover:shadow-2xl hover:shadow-[#0A2A5E]/5 transition-all duration-300">
                           <div className="h-56 overflow-hidden relative">
                              {rel.image ? (
                                 <img 
                                    src={rel.image.startsWith('/') ? rel.image : rel.image} 
                                    alt={isEn ? rel.title_en : rel.title_ar} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                 />
                              ) : (
                                 <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                    <Bookmark className="w-10 h-10 text-slate-300" />
                                 </div>
                              )}
                              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#0A2A5E] shadow-sm">
                                {isEn ? 'Logistics' : 'لوجستيات'}
                              </div>
                           </div>
                           <div className="p-8 flex-1 flex flex-col">
                              <span className="text-xs font-bold text-[#D4A017] mb-4 block tracking-wider">
                                 {new Date(rel.created_at).toLocaleDateString(isEn ? 'en-US' : 'ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                              <h4 className="font-black text-xl text-[#0A2A5E] mb-4 group-hover:text-[#D4A017] transition-colors line-clamp-2 leading-tight">
                                 {isEn ? rel.title_en : rel.title_ar}
                              </h4>
                              <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-6 flex-1">
                                 {isEn ? rel.seo_desc_en : rel.seo_desc_ar}
                              </p>
                              <div className="flex items-center gap-2 text-[#0A2A5E] font-bold text-sm mt-auto group-hover:text-[#D4A017] transition-colors">
                                {isEn ? 'Read Article' : 'قراءة المقال'}
                                {isEn ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                              </div>
                           </div>
                        </Link>
                     </motion.div>
                  ))}
               </div>
               
               <Link to={isEn ? '/en/blog' : '/blog'} className="mt-10 flex md:hidden items-center justify-center gap-2 text-[#0A2A5E] font-bold border-2 border-[#0A2A5E] hover:bg-[#0A2A5E] hover:text-white transition-colors px-6 py-4 rounded-xl w-full">
                  {isEn ? 'View All Insights' : 'عرض كافة الرؤى'}
               </Link>
            </div>
         </div>
      )}

    </article>
  );
}
