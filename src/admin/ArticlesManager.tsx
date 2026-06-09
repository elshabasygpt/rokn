import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Save, FileText, Image as ImageIcon } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from './context/AuthContext';

interface Article {
  id: number;
  title_ar: string;
  title_en: string;
  slug: string;
  content_ar: string;
  content_en: string;
  image: string;
  seo_desc_ar: string;
  seo_desc_en: string;
  seo_keywords: string;
  active: boolean;
  is_featured: boolean;
  views: number;
  created_at: string;
}

export default function ArticlesManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const [slugError, setSlugError] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles?all=true', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error('Error fetching articles', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlugUpdate = async (slug: string) => {
    setCurrentArticle({...currentArticle, slug});
    if (!slug) {
      setSlugError('');
      return;
    }
    try {
      const res = await fetch(`/api/articles/check-slug/${encodeURIComponent(slug)}${currentArticle.id ? `?id=${currentArticle.id}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.unique) {
        setSlugError('هذا الرابط مستخدم بالفعل. الرجاء اختيار رابط آخر.');
      } else {
        setSlugError('');
      }
    } catch (err) {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugError) return;
    
    setError('');
    
    try {
      // Auto-generate slug if empty
      const payload = { ...currentArticle };
      if (!payload.slug && payload.title_en) {
        payload.slug = payload.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      const url = payload.id ? `/api/articles/${payload.id}` : '/api/articles';
      const method = payload.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to save article');
      }

      await fetchArticles();
      setIsEditing(false);
      setCurrentArticle({});
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال بصورة نهائية؟')) return;
    
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchArticles();
    } catch (err) {
      alert('Error deleting article');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentArticle({ ...currentArticle, image: data.url });
      }
    } catch (err) {
      alert('Upload failed');
    }
  };

  if (isLoading) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            إدارة المقالات والمدونة
          </h1>
          <p className="text-slate-500 text-sm mt-1">أضف مقالات استراتيجية لرفع أرشفة الموقع في جوجل</p>
        </div>
        <button
          onClick={() => {
            setCurrentArticle({ active: true, is_featured: false, title_ar: '', title_en: '', content_ar: '', content_en: '', slug: '' });
            setIsEditing(true);
            setSlugError('');
          }}
          className="bg-amber-500 flex items-center gap-2 px-4 py-2 rounded-xl text-slate-900 font-bold hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          مقال جديد
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">
              {currentArticle.id ? 'تعديل المقال' : 'إضافة مقال جديد'}
            </h2>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Arabic Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-700 bg-slate-50 p-2 rounded-lg">النسخة العربية</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">عنوان المقال</label>
                  <input
                    type="text"
                    value={currentArticle.title_ar || ''}
                    onChange={(e) => setCurrentArticle({...currentArticle, title_ar: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">المحتوى</label>
                  <ReactQuill 
                    theme="snow"
                    value={currentArticle.content_ar || ''}
                    onChange={(val) => setCurrentArticle({...currentArticle, content_ar: val})}
                    className="bg-white rounded-xl mb-12 h-64"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">وصف قصير للبحث (SEO Meta)</label>
                  <textarea
                    value={currentArticle.seo_desc_ar || ''}
                    onChange={(e) => setCurrentArticle({...currentArticle, seo_desc_ar: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 h-20"
                  />
                  <p className="text-xs text-slate-500 mt-1">هذا النص سيظهر تحت رابط المقال في نتائج قوقل، احرص أن يكون مشوقاً.</p>
                </div>
              </div>

              {/* English Details */}
              <div className="space-y-4" dir="ltr">
                <h3 className="font-bold text-lg text-slate-700 bg-slate-50 p-2 rounded-lg">English Version</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={currentArticle.title_en || ''}
                    onChange={(e) => setCurrentArticle({...currentArticle, title_en: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-left"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
                  <ReactQuill 
                    theme="snow"
                    value={currentArticle.content_en || ''}
                    onChange={(val) => setCurrentArticle({...currentArticle, content_en: val})}
                    className="bg-white rounded-xl mb-12 h-64"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SEO Meta Description</label>
                  <textarea
                    value={currentArticle.seo_desc_en || ''}
                    onChange={(e) => setCurrentArticle({...currentArticle, seo_desc_en: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 h-20 text-left"
                  />
                </div>
              </div>
            </div>

            {/* Global Settings */}
            <div className="pt-6 border-t border-slate-100 space-y-6">
               <h3 className="font-bold text-lg text-slate-700 bg-slate-50 p-2 rounded-lg">إعدادات متقدمة</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">رابط المقال (Slug) - إنجليزي فقط</label>
                    <div className="flex" dir="ltr">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-sm">
                        roknelryan.com/blog/
                      </span>
                      <input
                        type="text"
                        value={currentArticle.slug || ''}
                        onChange={(e) => handleSlugUpdate(e.target.value)}
                        className={`flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-xl border ${slugError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-amber-500'} focus:border-amber-500 sm:text-sm`}
                        placeholder="best-moving-tips"
                      />
                    </div>
                    {slugError ? (
                      <p className="text-xs text-red-500 mt-1">{slugError}</p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-1">مثال: best-moving-tips (سيتم إنشاؤه تلقائياً إن تركته فارغاً)</p>
                    )}
                 </div>

                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">الكلمات المفتاحية (Keywords)</label>
                    <input
                      type="text"
                      value={currentArticle.seo_keywords || ''}
                      onChange={(e) => setCurrentArticle({...currentArticle, seo_keywords: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="نقل عفش, نصائح نقل, شركة نقل"
                    />
                    <p className="text-xs text-slate-500 mt-1">افصل بين الكلمات باستخدام فاصلة (,)</p>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-2">صورة المقال البارزة (Thumbnail)</label>
                 <div className="flex items-center gap-4">
                  {currentArticle.image && (
                    <img 
                      src={currentArticle.image.startsWith('/') ? currentArticle.image : currentArticle.image} 
                      alt="Thumbnail" 
                      className="w-32 h-20 object-cover rounded-lg border border-slate-200"
                    />
                  )}
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors">
                    <ImageIcon className="w-5 h-5" />
                    <span>رفع صورة</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                 </div>
               </div>

               <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 w-max">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={currentArticle.active !== false}
                        onChange={(e) => setCurrentArticle({...currentArticle, active: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                    <span className="font-semibold text-slate-700">حالة المقال: {currentArticle.active !== false ? 'منشور ومرئي للجمهور' : 'مسودة (مخفي)'}</span>
                 </div>
                 
                 <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100 w-max">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={currentArticle.is_featured === true}
                        onChange={(e) => setCurrentArticle({...currentArticle, is_featured: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                    <span className="font-semibold text-amber-800">تثبيت في الرئيسية: {currentArticle.is_featured === true ? 'نعم (يظهر في الرئيسية)' : 'لا'}</span>
                 </div>
               </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={!!slugError}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                تأكيد وحفظ المقال
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <th className="p-4 font-bold">صورة</th>
                  <th className="p-4 font-bold">العنوان</th>
                  <th className="p-4 font-bold text-center">المشاهدات</th>
                  <th className="p-4 font-bold text-center">الحالة</th>
                  <th className="p-4 font-bold">تاريخ النشر</th>
                  <th className="p-4 font-bold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 w-24">
                       {article.image ? (
                          <img src={article.image.startsWith('/') ? article.image : article.image} alt={article.title_ar} className="w-16 h-12 object-cover rounded-lg shadow-sm" />
                       ) : (
                          <div className="w-16 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          </div>
                       )}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{article.title_ar}</p>
                      <p className="text-xs text-slate-500 mt-1" dir="ltr">{article.title_en}</p>
                    </td>
                    <td className="p-4 text-center font-bold text-amber-600">
                      <div className="flex flex-col items-center gap-1">
                        <span>{article.views || 0}</span>
                        {article.is_featured && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">★ مثبت بالرئيسية</span>}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        article.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${article.active ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                        {article.active ? 'منشور' : 'مخفي'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-medium">
                      {new Date(article.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setCurrentArticle(article);
                            setIsEditing(true);
                            setSlugError('');
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      لا يوجد مقالات حتى الآن. ابدأ بكتابة مقالك الأول!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
