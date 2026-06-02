import React, { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { Plus, Pencil, Trash2, X, Save, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface Partner {
  id?: number;
  name: string;
  image_url: string;
  color?: string;
  svg_code?: string;
  active: boolean;
  sort_order: number;
}

const empty: Partner = {
  name: '', image_url: '', color: '#005a9c', active: true, sort_order: 0, svg_code: ''
};

export default function PartnersManager() {
  const api = useApi();
  const [items, setItems] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setItems(await api.get('/api/partners')); } catch (err) { console.error(err); }
    setLoading(false);
  };

  const save = async () => {
    if (!editing) return;
    try {
      if (editing.id) await api.put(`/api/partners/${editing.id}`, editing);
      else await api.post('/api/partners', editing);
      setEditing(null);
      load();
    } catch (err) { console.error(err); }
  };

  const remove = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الشريك؟')) return;
    try { await api.del(`/api/partners/${id}`); load(); } catch (err) { console.error(err); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    try {
      const result = await api.upload(file);
      if (editing) setEditing({ ...editing, image_url: result.url });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">جاري التحميل...</div>;

  if (editing) return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900">{editing.id ? 'تعديل شريك' : 'إضافة شريك جديد'}</h1>
        <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">اسم الشريك (للعرض الداخلي والتمييز) *</label>
          <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" placeholder="مثال: البنك الأهلي" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">شعار الشريك (اللوجو) *</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden relative group">
              {(editing.image_url || editing.svg_code) ? (
                <img src={editing.image_url || "/logo.png"} alt="Preview" className="w-full h-full object-contain p-2" />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" id="partner-logo-upload" />
              <label htmlFor="partner-logo-upload" className="cursor-pointer inline-block bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg hover:bg-slate-200">
                رفع صورة جديدة (أو استبدال)
              </label>
              <p className="text-xs text-slate-500 mt-2">يفضل صور شفافة بصيغة PNG أو WEBP لتبدو احترافية.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">اللون المميز (يُستخدم في التأثيرات)</label>
            <div className="flex gap-2">
              <input type="color" value={editing.color || '#005a9c'} onChange={e => setEditing({...editing, color: e.target.value})} className="h-12 w-12 rounded cursor-pointer" />
              <input type="text" value={editing.color || '#005a9c'} onChange={e => setEditing({...editing, color: e.target.value})} dir="ltr"
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الترتيب</label>
            <input type="number" value={editing.sort_order} onChange={e => setEditing({...editing, sort_order: parseInt(e.target.value) || 0})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <input type="checkbox" id="active" checked={editing.active !== false} onChange={e => setEditing({...editing, active: e.target.checked})} className="w-5 h-5 text-amber-500" />
          <label htmlFor="active" className="font-bold text-slate-700 cursor-pointer">تفعيل (عرض الشعار في الموقع)</label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button onClick={save} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-400"><Save className="w-5 h-5" /> حفظ البيانات</button>
          <button onClick={() => setEditing(null)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">إلغاء</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة شركاء النجاح</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} شريك مسجل</p>
        </div>
        <button onClick={() => setEditing({...empty})} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
          <Plus className="w-5 h-5" /> إضافة شريك
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between ${!item.active ? 'opacity-60' : ''}`}>
            
            <div className="h-24 flex items-center justify-center mb-4 relative bg-slate-50 rounded-xl">
              {item.image_url ? (
                <img src={item.image_url.startsWith('/') ? item.image_url : item.image_url} alt={item.name} className="h-16 w-auto object-contain" />
              ) : item.svg_code ? (
                <div className="text-xl font-bold flex items-center justify-center text-slate-400">شعار جاهز (SVG)</div>
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-300" />
              )}
              {item.active && <CheckCircle className="absolute top-2 start-2 w-5 h-5 text-green-500 bg-white rounded-full" />}
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs text-slate-500" dir="ltr">{item.color}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
              <button onClick={() => setEditing({...item})} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg font-semibold"><Pencil className="w-4 h-4" /> تعديل</button>
              <button onClick={() => remove(item.id!)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
