import React, { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react';

interface Testimonial {
  id?: number;
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  text_ar: string;
  text_en: string;
  rating: number;
  active: boolean;
}

const empty: Testimonial = {
  name_ar: '', name_en: '', role_ar: '', role_en: '', text_ar: '', text_en: '', rating: 5, active: true
};

export default function TestimonialsManager() {
  const api = useApi();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setItems(await api.get('/api/testimonials/all')); } catch (err) { console.error(err); }
    setLoading(false);
  };

  const save = async () => {
    if (!editing) return;
    try {
      if (editing.id) await api.put(`/api/testimonials/${editing.id}`, editing);
      else await api.post('/api/testimonials', editing);
      setEditing(null);
      load();
    } catch (err) { console.error(err); }
  };

  const remove = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await api.del(`/api/testimonials/${id}`); load(); } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">جاري التحميل...</div>;

  if (editing) return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900">{editing.id ? 'تعديل رأي' : 'إضافة رأي جديد'}</h1>
        <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">اسم العميل (عربي) *</label>
            <input value={editing.name_ar} onChange={e => setEditing({...editing, name_ar: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Client Name (English) *</label>
            <input value={editing.name_en} onChange={e => setEditing({...editing, name_en: e.target.value})} dir="ltr"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الوصف/المنصب (عربي)</label>
            <input value={editing.role_ar} onChange={e => setEditing({...editing, role_ar: e.target.value})} placeholder="مثال: نقل من أبها للرياض"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Role (English)</label>
            <input value={editing.role_en} onChange={e => setEditing({...editing, role_en: e.target.value})} dir="ltr" placeholder="e.g. Moving from Abha to Riyadh"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">نص المراجعة (عربي) *</label>
            <textarea rows={3} value={editing.text_ar} onChange={e => setEditing({...editing, text_ar: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Review Text (English) *</label>
            <textarea rows={3} value={editing.text_en} onChange={e => setEditing({...editing, text_en: e.target.value})} dir="ltr"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">التقييم</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setEditing({...editing, rating: n})}
                className={`p-1 ${n <= editing.rating ? 'text-amber-500' : 'text-slate-300'}`}>
                <Star className="w-7 h-7 fill-current" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button onClick={save} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-400"><Save className="w-5 h-5" /> حفظ</button>
          <button onClick={() => setEditing(null)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">إلغاء</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة آراء العملاء</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} مراجعة</p>
        </div>
        <button onClick={() => setEditing({...empty})} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
          <Plus className="w-5 h-5" /> إضافة رأي
        </button>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl border border-slate-200 p-5 ${!item.active ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-slate-900">{item.name_ar}</h3>
                  <div className="flex gap-0.5">
                    {Array.from({length: item.rating}).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                  </div>
                </div>
                <p className="text-slate-500 text-sm">{item.role_ar}</p>
                <p className="text-slate-700 text-sm mt-2 line-clamp-2">{item.text_ar}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ms-4">
                <button onClick={() => setEditing({...item})} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(item.id!)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
