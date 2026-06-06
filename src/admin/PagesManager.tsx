import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit, Save, X, FileText, Bold, Italic, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApi } from './useApi';


interface Page {
  id: number;
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  seo_desc_ar: string;
  seo_desc_en: string;
  updated_at: string;
}

export default function PagesManager() {
  const { t } = useTranslation();
  const api = useApi();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');
  const [formData, setFormData] = useState<Partial<Page>>({});

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await api.get('/api/pages');
      setPages(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (slug: string) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/api/pages/${slug}`);
      setEditingPage(res);
      setFormData(res);
    } catch (err) {
      console.error(err);
      const newPage = { slug, title_ar: '', title_en: '', content_ar: '', content_en: '', seo_desc_ar: '', seo_desc_en: '' };
      setEditingPage(newPage as Page);
      setFormData(newPage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingPage) return;
    try {
      setIsLoading(true);
      await api.put(`/api/pages/${editingPage.slug}`, formData);
      alert('تم الحفظ بنجاح');
      setEditingPage(null);
      fetchPages();
    } catch (err) {
      console.error(err);
      alert('Failed to save page');
    } finally {
      setIsLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const pageNames: Record<string, string> = {
    'about': 'من نحن (About Us)',
    'terms': 'الشروط والأحكام (Terms)',
    'privacy': 'سياسة الخصوصية (Privacy Policy)'
  };

  const availablePages = [
    { slug: 'about', title_ar: 'من نحن' },
    { slug: 'terms', title_ar: 'الشروط والأحكام' },
    { slug: 'privacy', title_ar: 'سياسة الخصوصية' }
  ];

  if (isLoading && (!pages || pages.length === 0)) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-800">إدارة الصفحات الثابتة (Dynamic Pages)</h1>
      </div>

      {!editingPage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePages.map((page) => (
            <div key={page.slug} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
               <FileText className="w-12 h-12 text-amber-500 mb-4" />
               <h3 className="text-lg font-bold text-slate-800 mb-2">{pageNames[page.slug] || page.title_ar}</h3>
               <button 
                 onClick={() => handleEdit(page.slug)}
                 className="w-full bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors mt-6"
               >
                 <Edit className="w-4 h-4" /> تعديل المحتوى
               </button>
            </div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-3">
               <button onClick={() => setEditingPage(null)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                 <X className="w-5 h-5 text-slate-600" />
               </button>
               <h2 className="text-xl font-bold text-slate-800">تعديل: {pageNames[editingPage.slug]}</h2>
             </div>
             <button 
               onClick={handleSave}
               disabled={isLoading}
               className="bg-amber-500 text-slate-900 px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-400 transition-colors disabled:opacity-50"
             >
               <Save className="w-4 h-4" /> {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
             </button>
           </div>

           <div className="p-6">
              <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
                 <button 
                   onClick={() => setActiveTab('ar')}
                   className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'ar' ? 'bg-amber-500 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                   العربية (AR)
                 </button>
                 <button 
                   onClick={() => setActiveTab('en')}
                   className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'en' ? 'bg-amber-500 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                   English (EN)
                 </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الصفحة</label>
                  <input 
                    type="text"
                    value={activeTab === 'ar' ? formData.title_ar || '' : formData.title_en || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [activeTab === 'ar' ? 'title_ar' : 'title_en']: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-700">المحتوى (Rich Text)</label>
                  </div>
                  <div className="bg-white" dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>
                    <textarea 
                      value={activeTab === 'ar' ? formData.content_ar || '' : formData.content_en || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [activeTab === 'ar' ? 'content_ar' : 'content_en']: e.target.value }))}
                      className="w-full h-[400px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none resize-y font-mono text-left"
                      dir="ltr"
                      placeholder="أدخل محتوى HTML هنا (Enter HTML content here)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">وصف SEO (Meta Description)</label>
                  <textarea 
                    value={activeTab === 'ar' ? formData.seo_desc_ar || '' : formData.seo_desc_en || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [activeTab === 'ar' ? 'seo_desc_ar' : 'seo_desc_en']: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-amber-500 outline-none"
                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
}
