import React, { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { Plus, Pencil, Trash2, X, Save, GripVertical } from 'lucide-react';

interface FleetMeta {
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
}

interface FleetVehicle {
  id: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  capacity_ar: string;
  capacity_en: string;
  image: string;
  images?: string[];
  icon: string;
}

export default function FleetManager() {
  const api = useApi();
  const [meta, setMeta] = useState<FleetMeta>({
    title_ar: 'أسطول النقل المبرد',
    title_en: 'Our Refrigerated Fleet',
    subtitle_ar: 'أسطول متكامل من الشاحنات المبردة.',
    subtitle_en: 'Comprehensive fleet of refrigerated trucks.'
  });
  
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [editing, setEditing] = useState<FleetVehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await api.get('/api/settings');
      if (data.fleetMeta) setMeta(data.fleetMeta);
      if (data.fleetData?.list) {
        setVehicles(data.fleetData.list);
      } else {
        // Fallback to default
        const defaultVehicles = [
          {
            id: 'dyna',
            title_ar: 'دينا تبريد (4 طن)',
            title_en: 'Refrigerated Dyna (4 Ton)',
            desc_ar: 'مثالية للتوزيع اليومي داخل المدن.',
            desc_en: 'Ideal for daily inner-city distribution.',
            capacity_ar: 'سعة التحميل: حتى 4 طن',
            capacity_en: 'Load Capacity: Up to 4 Tons',
            image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            icon: 'Truck'
          },
          {
            id: 'jumbo',
            title_ar: 'جامبو تبريد (6-8 طن)',
            title_en: 'Refrigerated Jumbo (6-8 Ton)',
            desc_ar: 'الخيار الأمثل للمتطلبات المتوسطة.',
            desc_en: 'The perfect choice for medium requirements.',
            capacity_ar: 'سعة التحميل: حتى 8 طن',
            capacity_en: 'Load Capacity: Up to 8 Tons',
            image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            icon: 'Wind'
          },
          {
            id: 'trailer',
            title_ar: 'تريلا تبريد (25 طن)',
            title_en: 'Refrigerated Trailer (25 Ton)',
            desc_ar: 'مخصصة للمصانع والربط الاستراتيجي بين المدن الرئيسية.',
            desc_en: 'Dedicated for factories and strategic linking between major cities.',
            capacity_ar: 'سعة التحميل: حتى 25 طن',
            capacity_en: 'Load Capacity: Up to 25 Tons',
            image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2070&auto=format&fit=crop',
            images: [],
            icon: 'Zap'
          }
        ];
        setVehicles(defaultVehicles);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const saveMeta = async () => {
    try {
      await api.put('/api/settings/fleetMeta', { value: meta });
      alert('تم حفظ إعدادات الصفحة');
    } catch (err) {
      console.error(err);
    }
  };

  const saveVehicles = async (newVehicles: FleetVehicle[]) => {
    try {
      await api.put('/api/settings/fleetData', { value: { list: newVehicles } });
      setVehicles(newVehicles);
    } catch (err) {
      console.error(err);
    }
  };

  const saveVehicle = () => {
    if (!editing) return;
    const isNew = !editing.id;
    const v = { ...editing, id: editing.id || Date.now().toString() };
    const newList = isNew ? [...vehicles, v] : vehicles.map(x => x.id === v.id ? v : x);
    saveVehicles(newList);
    setEditing(null);
  };

  const removeVehicle = (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    const newList = vehicles.filter(x => x.id !== id);
    saveVehicles(newList);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editing) return;
    const file = e.target.files[0];
    try {
      const result = await api.upload(file);
      setEditing({ ...editing, image: result.url });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editing) return;
    const files = Array.from(e.target.files);
    
    try {
      const urls = await Promise.all(
        files.map(file => api.upload(file as File).then((res: any) => res.url))
      );
      setEditing({ ...editing, images: [...(editing.images || []), ...urls] });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">جاري التحميل...</div>;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900">{editing.id ? 'تعديل مركبة' : 'إضافة مركبة'}</h1>
          <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الاسم (عربي)</label>
              <input value={editing.title_ar} onChange={e => setEditing({...editing, title_ar: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Name (English)</label>
              <input value={editing.title_en} onChange={e => setEditing({...editing, title_en: e.target.value})} dir="ltr" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الوصف (عربي)</label>
              <textarea rows={3} value={editing.desc_ar} onChange={e => setEditing({...editing, desc_ar: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description (English)</label>
              <textarea rows={3} value={editing.desc_en} onChange={e => setEditing({...editing, desc_en: e.target.value})} dir="ltr" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">السعة (عربي)</label>
              <input value={editing.capacity_ar} onChange={e => setEditing({...editing, capacity_ar: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Capacity (English)</label>
              <input value={editing.capacity_en} onChange={e => setEditing({...editing, capacity_en: e.target.value})} dir="ltr" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الصورة</label>
              <div className="flex items-center gap-4">
                {editing.image && <img src={editing.image} alt="" className="w-20 h-20 rounded-xl object-cover" />}
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl cursor-pointer transition-colors text-sm font-bold">
                  رفع صورة جديدة
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الأيقونة</label>
              <select value={editing.icon} onChange={e => setEditing({...editing, icon: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500">
                {['Truck', 'Wind', 'Zap', 'ThermometerSnowflake', 'ShieldCheck', 'MapPin'].map(ic => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">صور أخرى (إضافية)</label>
            <div className="flex flex-wrap gap-4 mb-3">
              {(editing.images || []).map((img, i) => (
                <div 
                  key={i} 
                  className="relative cursor-move ring-2 ring-transparent hover:ring-amber-500 rounded-xl transition-all"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('imageIndex', i.toString());
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const sourceIndex = parseInt(e.dataTransfer.getData('imageIndex'), 10);
                    if (isNaN(sourceIndex) || sourceIndex === i || !editing.images) return;
                    
                    const newImages = [...editing.images];
                    const [draggedImage] = newImages.splice(sourceIndex, 1);
                    newImages.splice(i, 0, draggedImage);
                    
                    setEditing({ ...editing, images: newImages });
                  }}
                >
                  <img src={img} alt="" draggable={false} className="w-20 h-20 rounded-xl object-cover" />
                  <button onClick={(e) => {
                    e.preventDefault(); // Prevent any possible drag issues when clicking delete
                    const newImages = [...(editing.images || [])];
                    newImages.splice(i, 1);
                    setEditing({...editing, images: newImages});
                  }} className="absolute -top-2 -end-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl cursor-pointer transition-colors text-sm font-bold inline-block">
              رفع صور إضافية
              <input type="file" multiple accept="image/*" onChange={handleAdditionalImagesUpload} className="hidden" />
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button onClick={saveVehicle} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-400 transition-colors">
              <Save className="w-5 h-5" /> حفظ
            </button>
            <button onClick={() => setEditing(null)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">إلغاء</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">إدارة الأسطول</h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-black text-slate-800 mb-4">إعدادات صفحة الأسطول</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">العنوان (عربي)</label>
            <input value={meta.title_ar} onChange={e => setMeta({...meta, title_ar: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title (English)</label>
            <input value={meta.title_en} onChange={e => setMeta({...meta, title_en: e.target.value})} dir="ltr" className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الوصف (عربي)</label>
            <textarea value={meta.subtitle_ar} onChange={e => setMeta({...meta, subtitle_ar: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500 resize-none" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description (English)</label>
            <textarea value={meta.subtitle_en} onChange={e => setMeta({...meta, subtitle_en: e.target.value})} dir="ltr" className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500 resize-none" rows={2} />
          </div>
        </div>
        <button onClick={saveMeta} className="mt-4 flex items-center gap-2 bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-colors">
          <Save className="w-4 h-4" /> حفظ الإعدادات
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-slate-800">مركبات الأسطول</h2>
        <button onClick={() => setEditing({ id: '', title_ar: '', title_en: '', desc_ar: '', desc_en: '', capacity_ar: '', capacity_en: '', image: '', images: [], icon: 'Truck' })} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-xl hover:bg-amber-400 transition-colors">
          <Plus className="w-4 h-4" /> إضافة مركبة
        </button>
      </div>

      <div className="space-y-3">
        {vehicles.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <GripVertical className="w-5 h-5 text-slate-300 cursor-grab flex-shrink-0" />
            {v.image && <img src={v.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 truncate">{v.title_ar}</h3>
              <p className="text-slate-500 text-sm truncate">{v.desc_ar}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setEditing({...v})} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => removeVehicle(v.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="text-center py-10 text-slate-500 bg-white rounded-2xl border border-slate-200">
            لا يوجد مركبات مضافة بعد
          </div>
        )}
      </div>
    </div>
  );
}
