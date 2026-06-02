import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';
import { useApi } from './useApi';

export default function FaqManager() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    q_ar: '', a_ar: '', q_en: '', a_en: '', active: true, sort_order: 0
  });

  const api = useApi();

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const data = await api.get('/api/faqs');
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/api/faqs/${editingId}`, formData);
      } else {
        await api.post('/api/faqs', formData);
      }
      setEditingId(null);
      resetForm();
      fetchFaqs();
    } catch (err) {
      console.error(err);
      alert('Error saving FAQ. Ensure you are logged in.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    try {
      await api.del(`/api/faqs/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (faq: any) => {
    setEditingId(faq.id);
    setFormData({
      q_ar: faq.q_ar,
      a_ar: faq.a_ar,
      q_en: faq.q_en,
      a_en: faq.a_en,
      active: faq.active,
      sort_order: faq.sort_order
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ q_ar: '', a_ar: '', q_en: '', a_en: '', active: true, sort_order: 0 });
  };

  if (loading) return <div className="text-center py-20 text-slate-400">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-800">إدارة الأسئلة الشائعة</h1>
        {!editingId && (
          <button onClick={() => setEditingId(-1)} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-xl hover:bg-amber-400 transition-colors">
            <Plus className="w-5 h-5" /> إضافة سؤال جديد
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4">{editingId === -1 ? 'إضافة سؤال جديد' : 'تعديل السؤال'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">السؤال (عربي)</label>
              <input value={formData.q_ar} onChange={e => setFormData({ ...formData, q_ar: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Question (English)</label>
              <input value={formData.q_en} onChange={e => setFormData({ ...formData, q_en: e.target.value })} dir="ltr" className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الإجابة (عربي)</label>
              <textarea value={formData.a_ar} onChange={e => setFormData({ ...formData, a_ar: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500 h-24" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Answer (English)</label>
              <textarea value={formData.a_en} onChange={e => setFormData({ ...formData, a_en: e.target.value })} dir="ltr" className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500 h-24" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الترتيب</label>
              <input type="number" value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
            </div>
            <div className="flex items-center gap-3 pt-8">
              <input type="checkbox" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500" />
              <label className="text-sm font-bold text-slate-700">مفعل (يظهر للزوار)</label>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl hover:bg-emerald-600 transition-colors">
              <CheckCircle2 className="w-5 h-5" /> {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button onClick={resetForm} disabled={saving} className="flex items-center gap-2 bg-slate-100 text-slate-600 font-bold px-5 py-2 rounded-xl hover:bg-slate-200 transition-colors">
              <X className="w-5 h-5" /> إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {faqs.map(faq => (
          <div key={faq.id} className={`bg-white p-5 rounded-2xl border ${faq.active ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60'} flex items-center justify-between`}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded text-xs">ترتيب: {faq.sort_order}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${faq.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {faq.active ? 'مفعل' : 'معطل'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-800">{faq.q_ar}</h3>
              <p className="text-slate-500 text-sm mt-1 mb-2 line-clamp-1">{faq.a_ar}</p>
              <h3 className="font-medium text-slate-600" dir="ltr">{faq.q_en}</h3>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => startEdit(faq)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-center text-slate-400 py-8">لا يوجد أسئلة مضافة حالياً.</p>}
      </div>
    </div>
  );
}
