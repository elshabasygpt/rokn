import React, { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { Plus, Pencil, Trash2, X, Save, Image as ImageIcon, Film } from 'lucide-react';

interface GalleryItem {
  id?: number;
  type: string;
  category: string;
  url: string;
  thumbnail: string;
  title_ar: string;
  title_en: string;
  sort_order: number;
  active: boolean;
}

const emptyItem: GalleryItem = {
  type: 'image', category: 'moving', url: '', thumbnail: '', title_ar: '', title_en: '', sort_order: 0, active: true
};

export default function GalleryManager() {
  const api = useApi();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setItems(await api.get('/api/gallery/all')); } catch (err) { console.error(err); }
    setLoading(false);
  };

  const save = async () => {
    if (!editing) return;
    try {
      if (editing.id) await api.put(`/api/gallery/${editing.id}`, editing);
      else await api.post('/api/gallery', editing);
      setEditing(null);
      load();
    } catch (err) { console.error(err); }
  };

  const remove = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await api.del(`/api/gallery/${id}`); load(); } catch (err) { console.error(err); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editing) return;
    try {
      const result = await api.upload(e.target.files[0]);
      setEditing({ ...editing, url: result.url, thumbnail: result.url });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">جاري التحميل...</div>;

  if (editing) return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900">{editing.id ? 'تعديل عنصر' : 'إضافة عنصر جديد'}</h1>
        <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">النوع</label>
            <select value={editing.type} onChange={e => setEditing({...editing, type: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500">
              <option value="image">صورة</option>
              <option value="video">فيديو</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف</label>
            <select value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500">
              <option value="moving">نقل</option>
              <option value="packing">تغليف</option>
              <option value="assembly">فك وتركيب</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">العنوان (عربي) *</label>
            <input value={editing.title_ar} onChange={e => setEditing({...editing, title_ar: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title (English) *</label>
            <input value={editing.title_en} onChange={e => setEditing({...editing, title_en: e.target.value})} dir="ltr"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {editing.type === 'video' ? 'رابط الفيديو' : 'رفع صورة أو إدخال رابط'}
          </label>
          <div className="flex gap-3">
            <input value={editing.url} onChange={e => setEditing({...editing, url: e.target.value, thumbnail: e.target.value})} dir="ltr"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" placeholder="URL" />
            {editing.type === 'image' && (
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors font-bold text-sm text-slate-600">
                <Plus className="w-4 h-4" /> رفع
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>
          {editing.url && editing.type === 'image' && (
            <img src={editing.url.startsWith('/') ? editing.url : editing.url} alt="" className="mt-3 w-40 h-28 object-cover rounded-xl border" />
          )}
        </div>
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button onClick={save} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-400 transition-colors">
            <Save className="w-5 h-5" /> حفظ
          </button>
          <button onClick={() => setEditing(null)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">إلغاء</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة المعرض</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} عنصر</p>
        </div>
        <button onClick={() => setEditing({...emptyItem})} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
          <Plus className="w-5 h-5" /> إضافة عنصر
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden group ${!item.active ? 'opacity-50' : ''}`}>
            <div className="aspect-[4/3] relative">
              <img src={(item.thumbnail || item.url).startsWith('/') ? item.thumbnail || item.url : (item.thumbnail || item.url)} alt={item.title_ar}
                className="w-full h-full object-cover" />
              {item.type === 'video' && (
                <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <Film className="w-3 h-3" /> فيديو
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => setEditing({...item})} className="p-2 bg-white rounded-lg text-amber-600 hover:bg-amber-50"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(item.id!)} className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-bold text-slate-900 text-sm truncate">{item.title_ar}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
