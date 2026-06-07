import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Search, CheckCircle, XCircle, TrendingUp, Target, ShieldCheck, Activity } from 'lucide-react';
import { useApi } from './useApi';

interface CaseStudy {
  id: number;
  slug: string;
  industry_ar: string;
  industry_en: string;
  title_ar: string;
  title_en: string;
  problem_ar: string;
  problem_en: string;
  solution_ar: string;
  solution_en: string;
  kpi_ar: string;
  kpi_en: string;
  image: string;
  active: boolean;
  created_at: string;
}

export default function CaseStudiesManager() {
  const api = useApi();
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Partial<CaseStudy> | null>(null);
  const [langTab, setLangTab] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/case-studies?all=true');
      setItems(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing?.title_ar || !editing?.slug) {
      alert('الرجاء إدخال العنوان والرابط');
      return;
    }
    try {
      if (editing.id) {
        await api.put(`/api/case-studies/${editing.id}`, editing);
      } else {
        await api.post('/api/case-studies', editing);
      }
      setEditing(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await api.del(`/api/case-studies/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      const result = await api.upload(e.target.files[0]);
      setEditing({ ...editing, image: result.url });
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter(c => 
    c.title_ar?.includes(searchTerm) || c.industry_ar?.includes(searchTerm) || c.title_en?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-slate-500">جاري التحميل...</div>;

  if (editing) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900">{editing.id ? 'تعديل دراسة حالة' : 'إضافة دراسة حالة'}</h1>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-bold transition-colors">إلغاء</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
              <Save className="w-4 h-4" /> حفظ
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-6">
            <button onClick={() => setLangTab('ar')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${langTab === 'ar' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>العربية</button>
            <button onClick={() => setLangTab('en')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${langTab === 'en' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>English</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">الرابط (Slug)</label>
              <input type="text" value={editing.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left" dir="ltr" placeholder="e.g. pharma-summer-crisis" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">اسم القطاع ({langTab.toUpperCase()})</label>
              <input type="text" value={langTab === 'ar' ? editing.industry_ar || '' : editing.industry_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, industry_ar: e.target.value } : { ...editing, industry_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} placeholder={langTab === 'ar' ? 'مثال: قطاع الأدوية' : 'e.g. Pharmaceuticals'} />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">عنوان دراسة الحالة ({langTab.toUpperCase()})</label>
              <input type="text" value={langTab === 'ar' ? editing.title_ar || '' : editing.title_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, title_ar: e.target.value } : { ...editing, title_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Target className="w-4 h-4 text-red-500"/> التحدي / المشكلة ({langTab.toUpperCase()})</label>
              <textarea rows={3} value={langTab === 'ar' ? editing.problem_ar || '' : editing.problem_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, problem_ar: e.target.value } : { ...editing, problem_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 bg-red-50/30" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> الحل ({langTab.toUpperCase()})</label>
              <textarea rows={3} value={langTab === 'ar' ? editing.solution_ar || '' : editing.solution_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, solution_ar: e.target.value } : { ...editing, solution_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 bg-emerald-50/30" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500"/> النتائج والمؤشرات (KPIs) ({langTab.toUpperCase()})</label>
              <input type="text" value={langTab === 'ar' ? editing.kpi_ar || '' : editing.kpi_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, kpi_ar: e.target.value } : { ...editing, kpi_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 bg-amber-50/30" dir={langTab === 'ar' ? 'rtl' : 'ltr'} placeholder={langTab === 'ar' ? 'مثال: نسبة تلف 0% | التسليم خلال 12 ساعة' : 'e.g. 0% Spoilage | 12 Hours Delivery'} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">الصورة المرفقة</label>
              <div className="flex items-center gap-4">
                {editing.image && <img src={editing.image} alt="" className="w-32 h-20 object-cover rounded-lg border border-slate-200" />}
                <label className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg cursor-pointer hover:bg-slate-200 transition-colors">
                  رفع صورة
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <label className="font-bold text-slate-700">تفعيل ونشر؟</label>
              <input type="checkbox" checked={editing.active !== false} onChange={e => setEditing({ ...editing, active: e.target.checked })} className="w-5 h-5 accent-amber-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة دراسات الحالة</h1>
          <p className="text-slate-500 mt-1">أضف قصص نجاح وتحديات واقعية قمنا بحلها لعملائنا لزيادة الثقة والمبيعات.</p>
        </div>
        <button onClick={() => setEditing({ active: true })} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors">
          <Plus className="w-5 h-5" /> إضافة دراسة حالة
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث..." 
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
                <th className="p-4 font-bold">القطاع</th>
                <th className="p-4 font-bold">العنوان</th>
                <th className="p-4 font-bold text-center">الحالة</th>
                <th className="p-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600 font-bold">{item.industry_ar}</td>
                  <td className="p-4 font-bold text-slate-900">{item.title_ar}</td>
                  <td className="p-4 text-center">
                    {item.active ? <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle className="w-3 h-3" /> منشور</span> : <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold"><XCircle className="w-3 h-3" /> مسودة</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setEditing(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">لا توجد دراسات حالة مضافة.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
