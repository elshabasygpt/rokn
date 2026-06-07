import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Search, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { useApi } from './useApi';

interface City {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  hero_title_ar: string;
  hero_title_en: string;
  hero_desc_ar: string;
  hero_desc_en: string;
  featured_image: string;
  service_coverage_ar: string;
  service_coverage_en: string;
  faqs: any[];
  cta_title_ar: string;
  cta_title_en: string;
  cta_desc_ar: string;
  cta_desc_en: string;
  seo_title_ar: string;
  seo_title_en: string;
  seo_desc_ar: string;
  seo_desc_en: string;
  canonical_url: string;
  active: boolean;
}

export default function CitiesManager() {
  const api = useApi();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Partial<City> | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'seo' | 'faqs'>('basic');
  const [langTab, setLangTab] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await api.get('/api/cities/admin?all=true');
      setCities(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing?.name_ar || !editing?.slug) {
      alert('الرجاء إدخال الاسم والرابط');
      return;
    }
    try {
      if (editing.id) {
        await api.put(`/api/cities/${editing.id}`, editing);
      } else {
        await api.post('/api/cities', editing);
      }
      setEditing(null);
      fetchCities();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await api.del(`/api/cities/${id}`);
      fetchCities();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      const result = await api.upload(e.target.files[0]);
      setEditing({ ...editing, featured_image: result.url });
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = cities.filter(c => 
    c.name_ar?.includes(searchTerm) || c.name_en?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-slate-500">جاري التحميل...</div>;

  if (editing) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900">{editing.id ? 'تعديل صفحة مدينة' : 'إضافة مدينة جديدة'}</h1>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-bold transition-colors">إلغاء</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
              <Save className="w-4 h-4" /> حفظ ونشر
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <button onClick={() => setActiveTab('basic')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'basic' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>المعلومات الأساسية</button>
            <button onClick={() => setActiveTab('content')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'content' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>المحتوى النصي (Hero & CTA)</button>
            <button onClick={() => setActiveTab('seo')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'seo' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>إعدادات الأرشفة (SEO)</button>
            <button onClick={() => setActiveTab('faqs')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'faqs' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>الأسئلة الشائعة (FAQs)</button>
          </div>

          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-6">
              <button onClick={() => setLangTab('ar')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${langTab === 'ar' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>العربية</button>
              <button onClick={() => setLangTab('en')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${langTab === 'en' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>English</button>
            </div>

            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">اسم المدينة ({langTab.toUpperCase()})</label>
                  <input type="text" value={langTab === 'ar' ? editing.name_ar || '' : editing.name_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, name_ar: e.target.value } : { ...editing, name_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الرابط (Slug) - باللغة الإنجليزية دائماً</label>
                  <input type="text" value={editing.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left" dir="ltr" placeholder="e.g. riyadh" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الصورة البارزة (Featured Image)</label>
                  <div className="flex items-center gap-4">
                    {editing.featured_image && <img src={editing.featured_image} alt="" className="w-32 h-20 object-cover rounded-lg border border-slate-200" />}
                    <label className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg cursor-pointer hover:bg-slate-200 transition-colors">
                      رفع صورة
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <label className="font-bold text-slate-700">تفعيل الصفحة؟</label>
                  <input type="checkbox" checked={editing.active !== false} onChange={e => setEditing({ ...editing, active: e.target.checked })} className="w-5 h-5 accent-amber-500" />
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عنوان البانر الرئيسي (Hero Title)</label>
                  <input type="text" value={langTab === 'ar' ? editing.hero_title_ar || '' : editing.hero_title_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, hero_title_ar: e.target.value } : { ...editing, hero_title_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">وصف البانر (Hero Description)</label>
                  <textarea rows={3} value={langTab === 'ar' ? editing.hero_desc_ar || '' : editing.hero_desc_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, hero_desc_ar: e.target.value } : { ...editing, hero_desc_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">محتوى التغطية (Service Coverage Info)</label>
                  <textarea rows={5} value={langTab === 'ar' ? editing.service_coverage_ar || '' : editing.service_coverage_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, service_coverage_ar: e.target.value } : { ...editing, service_coverage_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium">
                  هذه البيانات تظهر في نتائج بحث جوجل. احرص على استخدام كلمات مفتاحية متعلقة بالمدينة.
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Meta Title</label>
                  <input type="text" value={langTab === 'ar' ? editing.seo_title_ar || '' : editing.seo_title_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, seo_title_ar: e.target.value } : { ...editing, seo_title_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Meta Description</label>
                  <textarea rows={3} value={langTab === 'ar' ? editing.seo_desc_ar || '' : editing.seo_desc_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, seo_desc_ar: e.target.value } : { ...editing, seo_desc_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Canonical URL (اختياري)</label>
                  <input type="text" value={editing.canonical_url || ''} onChange={e => setEditing({ ...editing, canonical_url: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left" dir="ltr" />
                </div>
              </div>
            )}

            {activeTab === 'faqs' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 mb-4">أضف أسئلة شائعة مخصصة لهذه المدينة بالتحديد لتحسين أرشفة Google.</p>
                {editing.faqs?.map((faq, index) => (
                  <div key={index} className="border border-slate-200 p-4 rounded-xl bg-slate-50 relative">
                    <button onClick={() => {
                      const newFaqs = [...editing.faqs!];
                      newFaqs.splice(index, 1);
                      setEditing({...editing, faqs: newFaqs});
                    }} className="absolute top-4 left-4 text-red-500 hover:bg-red-100 p-1 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1">السؤال ({langTab})</label>
                      <input type="text" value={langTab === 'ar' ? faq.q_ar : faq.q_en} onChange={e => {
                        const newFaqs = [...editing.faqs!];
                        if(langTab === 'ar') newFaqs[index].q_ar = e.target.value;
                        else newFaqs[index].q_en = e.target.value;
                        setEditing({...editing, faqs: newFaqs});
                      }} className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الجواب ({langTab})</label>
                      <textarea rows={2} value={langTab === 'ar' ? faq.a_ar : faq.a_en} onChange={e => {
                        const newFaqs = [...editing.faqs!];
                        if(langTab === 'ar') newFaqs[index].a_ar = e.target.value;
                        else newFaqs[index].a_en = e.target.value;
                        setEditing({...editing, faqs: newFaqs});
                      }} className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                    </div>
                  </div>
                ))}
                <button onClick={() => setEditing({...editing, faqs: [...(editing.faqs || []), { q_ar: '', q_en: '', a_ar: '', a_en: '' }]})} className="flex items-center gap-2 text-amber-600 font-bold px-4 py-2 bg-amber-50 rounded-lg hover:bg-amber-100">
                  <Plus className="w-4 h-4" /> إضافة سؤال جديد
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة المدن (Programmatic SEO)</h1>
          <p className="text-slate-500 mt-1">أنشئ صفحات هبوط مخصصة لكل مدينة للسيطرة على نتائج البحث المحلية.</p>
        </div>
        <button onClick={() => setEditing({ active: true, faqs: [] })} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors">
          <Plus className="w-5 h-5" /> إضافة مدينة
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن مدينة..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pr-11 pl-4 py-2.5 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-sm">
                <th className="p-4 font-bold">المدينة</th>
                <th className="p-4 font-bold">الرابط (Slug)</th>
                <th className="p-4 font-bold text-center">الحالة</th>
                <th className="p-4 font-bold text-center">تاريخ الإضافة</th>
                <th className="p-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(city => (
                <tr key={city.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    {city.featured_image ? <img src={city.featured_image} className="w-10 h-10 rounded-lg object-cover" alt="" /> : <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center"><MapPin className="w-5 h-5 text-slate-400" /></div>}
                    {city.name_ar}
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-sm" dir="ltr">{city.slug}</td>
                  <td className="p-4 text-center">
                    {city.active ? <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle className="w-3 h-3" /> منشور</span> : <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold"><XCircle className="w-3 h-3" /> مسودة</span>}
                  </td>
                  <td className="p-4 text-center text-slate-500 text-sm">{new Date(city.created_at || Date.now()).toLocaleDateString('ar-SA')}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setEditing(city)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(city.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">لا توجد مدن مضافة حتى الآن.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
