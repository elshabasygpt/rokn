import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pages/privacy')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setPageData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const isEn = i18n.language === 'en';
  const pageTitle = pageData ? (isEn ? pageData.title_en : pageData.title_ar) : t('privacy.title', { defaultValue: isEn ? 'Privacy Policy' : 'سياسة الخصوصية' });
  const seoDesc = pageData ? (isEn ? pageData.seo_desc_en : pageData.seo_desc_ar) : (isEn ? 'Privacy policy and data protection for Rokn Elryan users' : 'سياسة الخصوصية وحماية بيانات المستخدمين في ركن الريان');

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <SEO title={`${pageTitle} | ${isEn ? 'Rokn Elryan Refrigerated Transport' : 'ركن الريان للنقل المبرد'}`} description={seoDesc} />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 transform rotate-3">
            <ShieldAlert className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">{pageTitle}</h1>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
          {loading ? (
             <div className="animate-pulse space-y-4">
               <div className="h-4 bg-slate-200 rounded w-3/4"></div>
               <div className="h-4 bg-slate-200 rounded w-1/2"></div>
               <div className="h-4 bg-slate-200 rounded w-full"></div>
             </div>
          ) : pageData?.content_ar ? (
             <div 
               className={`prose prose-lg max-w-none ${isEn ? 'text-left' : 'text-right'}`} 
               dangerouslySetInnerHTML={{ __html: isEn ? pageData.content_en : pageData.content_ar }} 
             />
          ) : (
            <div className={`prose prose-lg max-w-none text-slate-600 ${isEn ? 'text-left' : 'text-right'}`}>
               <p>{isEn ? 'Our privacy policy will be updated soon. Please contact support for any inquiries.' : 'سيتم تحديث سياسة الخصوصية قريباً. يرجى التواصل مع الدعم الفني لأي استفسارات.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
