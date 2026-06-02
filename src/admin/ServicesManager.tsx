import React, { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { Plus, Pencil, Trash2, X, Save, GripVertical, Eye, EyeOff } from 'lucide-react';

interface Service {
  id?: number;
  icon: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  features_ar: string[];
  features_en: string[];
  images: string[];
  sort_order: number;
  active: boolean;
}

const emptyService: Service = {
  icon: 'Truck', title_ar: '', title_en: '', desc_ar: '', desc_en: '',
  features_ar: [''], features_en: [''], images: [], sort_order: 0, active: true
};

export default function ServicesManager() {
  const api = useApi();
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await api.get('/api/services/all');
      setServices(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const save = async () => {
    if (!editing) return;
    try {
      const clean = {
        ...editing,
        features_ar: editing.features_ar.filter(f => f.trim()),
        features_en: editing.features_en.filter(f => f.trim()),
      };
      if (editing.id) {
        await api.put(`/api/services/${editing.id}`, clean);
      } else {
        await api.post('/api/services', clean);
      }
      setEditing(null);
      load();
    } catch (err) { console.error(err); }
  };

  const remove = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await api.del(`/api/services/${id}`);
      load();
    } catch (err) { console.error(err); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editing) return;
    const file = e.target.files[0];
    try {
      const result = await api.upload(file);
      setEditing({ ...editing, images: [...editing.images, result.url] });
    } catch (err) { console.error(err); }
  };

  const addFeature = (lang: 'ar' | 'en') => {
    if (!editing) return;
    const key = lang === 'ar' ? 'features_ar' : 'features_en';
    setEditing({ ...editing, [key]: [...editing[key], ''] });
  };

  const updateFeature = (lang: 'ar' | 'en', idx: number, val: string) => {
    if (!editing) return;
    const key = lang === 'ar' ? 'features_ar' : 'features_en';
    const arr = [...editing[key]];
    arr[idx] = val;
    setEditing({ ...editing, [key]: arr });
  };

  const removeFeature = (lang: 'ar' | 'en', idx: number) => {
    if (!editing) return;
    const key = lang === 'ar' ? 'features_ar' : 'features_en';
    setEditing({ ...editing, [key]: editing[key].filter((_, i) => i !== idx) });
  };

  if (loading) return <div className="text-center py-20 text-slate-400">جاري التحميل...</div>;

  // Edit form
  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900">{editing.id ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}</h1>
          <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">العنوان (عربي) *</label>
              <input value={editing.title_ar} onChange={e => setEditing({...editing, title_ar: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Title (English) *</label>
              <input value={editing.title_en} onChange={e => setEditing({...editing, title_en: e.target.value})} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الوصف (عربي) *</label>
              <textarea rows={3} value={editing.desc_ar} onChange={e => setEditing({...editing, desc_ar: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description (English) *</label>
              <textarea rows={3} value={editing.desc_en} onChange={e => setEditing({...editing, desc_en: e.target.value})} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none" />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">المميزات (عربي)</label>
              {editing.features_ar.map((f, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={f} onChange={e => updateFeature('ar', i, e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500" placeholder={`ميزة ${i+1}`} />
                  <button onClick={() => removeFeature('ar', i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => addFeature('ar')} className="text-amber-600 text-sm font-bold hover:text-amber-700">+ إضافة ميزة</button>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Features (English)</label>
              {editing.features_en.map((f, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={f} onChange={e => updateFeature('en', i, e.target.value)} dir="ltr"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500" placeholder={`Feature ${i+1}`} />
                  <button onClick={() => removeFeature('en', i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => addFeature('en')} className="text-amber-600 text-sm font-bold hover:text-amber-700">+ Add Feature</button>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الصور</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {editing.images.map((img, i) => (
                <div key={i} className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={img.startsWith('/') ? img : img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setEditing({...editing, images: editing.images.filter((_, j) => j !== i)})}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-amber-500 transition-colors">
                <Plus className="w-6 h-6 text-slate-400" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Sort and icon */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الأيقونة</label>
              <select value={editing.icon} onChange={e => setEditing({...editing, icon: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500">
                {['Truck','Package','Wrench','ShieldCheck','MapPin','Clock','Home'].map(ic => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الترتيب</label>
              <input type="number" value={editing.sort_order} onChange={e => setEditing({...editing, sort_order: parseInt(e.target.value) || 0})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
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
  }

  // List view
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة الخدمات</h1>
          <p className="text-slate-500 text-sm mt-1">{services.length} خدمة</p>
        </div>
        <button onClick={() => setEditing({...emptyService})} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
          <Plus className="w-5 h-5" /> إضافة خدمة
        </button>
      </div>

      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className={`bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow ${!service.active ? 'opacity-50' : ''}`}>
            <GripVertical className="w-5 h-5 text-slate-300 cursor-grab flex-shrink-0" />
            {service.images[0] && (
              <img src={service.images[0].startsWith('/') ? service.images[0] : service.images[0]} alt=""
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 truncate">{service.title_ar}</h3>
              <p className="text-slate-500 text-sm truncate">{service.desc_ar}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setEditing({...service})} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(service.id!)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
