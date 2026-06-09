import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Search, CheckCircle, XCircle, Building2, PlusCircle, MinusCircle, GripVertical } from 'lucide-react';
import { useApi } from './useApi';

interface Industry {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  icon: string;
  hero_title_ar: string;
  hero_title_en: string;
  hero_desc_ar: string;
  hero_desc_en: string;
  featured_image: string;
  challenges_ar: string[];
  challenges_en: string[];
  solutions_ar: string[];
  solutions_en: string[];
  benefits_ar: string[];
  benefits_en: string[];
  related_services: string[];
  related_case_studies: string[];
  faqs: any[];
  key_capabilities_ar: any[];
  key_capabilities_en: any[];
  certifications: any[];
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
  display_order?: number;
}

export default function IndustriesManager() {
  const api = useApi();
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Partial<Industry> | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'lists' | 'faqs' | 'seo'>('basic');
  const [langTab, setLangTab] = useState<'ar' | 'en'>('ar');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/industries?all=true');
      setItems(Array.isArray(res) ? res : []);
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
        await api.put(`/api/industries/${editing.id}`, editing);
      } else {
        await api.post('/api/industries', editing);
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
      await api.del(`/api/industries/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      const result = await api.upload(e.target.files[0]);
      setEditing({ ...editing, featured_image: result.url });
    } catch (err: any) {
      console.error(err);
      alert(`فشل رفع الصورة: ${err.message || 'حجم الصورة كبير أو خطأ في الاتصال'}`);
    }
  };

  const handleArrayChange = (field: keyof Industry, index: number, value: string) => {
    const newArray = [...((editing?.[field] as string[]) || [])];
    newArray[index] = value;
    setEditing({ ...editing, [field]: newArray });
  };

  const addArrayItem = (field: keyof Industry) => {
    setEditing({ ...editing, [field]: [...((editing?.[field] as string[]) || []), ''] });
  };

  const removeArrayItem = (field: keyof Industry, index: number) => {
    const newArray = [...((editing?.[field] as string[]) || [])];
    newArray.splice(index, 1);
    setEditing({ ...editing, [field]: newArray });
  };

  const filtered = items.filter(c => 
    c.name_ar?.includes(searchTerm) || c.name_en?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragStart = (e: React.DragEvent, index: number) => {
    if (searchTerm) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = document.getElementById(`row-${index}`);
      if (el) el.style.opacity = '0.5';
    }, 0);
  };

  const onDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (searchTerm || draggedIndex === null || draggedIndex === index) return;
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setItems(newItems);
  };

  const onDragEnd = async () => {
    setDraggedIndex(null);
    document.querySelectorAll('tr').forEach(el => el.style.opacity = '1');
    if (searchTerm) return;
    setIsSavingOrder(true);
    try {
      const payload = items.map((c, i) => ({ id: c.id, display_order: i }));
      await api.put('/api/industries/reorder', { items: payload });
    } catch (err) {
      console.error(err);
      alert('فشل حفظ ترتيب القطاعات');
      fetchItems();
    } finally {
      setIsSavingOrder(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">جاري التحميل...</div>;

  if (editing) {
    return (
      <div className="bg-slate-50 min-h-screen pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900">{editing.id ? 'تعديل قطاع أعمال' : 'إضافة قطاع أعمال (B2B Hub)'}</h1>
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
            <button onClick={() => setActiveTab('content')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'content' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>المحتوى النصي والـ CTA</button>
            <button onClick={() => setActiveTab('lists')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'lists' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>التحديات والحلول (Lists)</button>
            <button onClick={() => setActiveTab('faqs')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'faqs' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>الأسئلة الشائعة</button>
            <button onClick={() => setActiveTab('seo')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'seo' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>إعدادات الأرشفة (SEO)</button>
          </div>

          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-6">
              <button onClick={() => setLangTab('ar')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${langTab === 'ar' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>العربية</button>
              <button onClick={() => setLangTab('en')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${langTab === 'en' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>English</button>
            </div>

            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">اسم القطاع ({langTab.toUpperCase()})</label>
                  <input type="text" value={langTab === 'ar' ? editing.name_ar || '' : editing.name_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, name_ar: e.target.value } : { ...editing, name_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الرابط (Slug)</label>
                  <input type="text" value={editing.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left" dir="ltr" placeholder="e.g. pharmaceuticals" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">أيقونة لوسيد (Lucide Icon Name)</label>
                  <input type="text" value={editing.icon || ''} onChange={e => setEditing({ ...editing, icon: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left" dir="ltr" placeholder="e.g. HeartPulse, Beef, Package" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">صورة الغلاف (Hero Image)</label>
                  <div className="flex items-center gap-4">
                    {editing.featured_image && <img src={editing.featured_image} alt="" className="w-32 h-20 object-cover rounded-lg border border-slate-200" />}
                    <label className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg cursor-pointer hover:bg-slate-200 transition-colors">
                      رفع صورة
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الخدمات المرتبطة (Related Services Slugs - مفصولة بفاصلة)</label>
                  <input type="text" value={(editing.related_services || []).join(',')} onChange={e => setEditing({ ...editing, related_services: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left" dir="ltr" placeholder="e.g. b2b-transport, cold-storage" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">دراسات الحالة المرتبطة (Case Studies Slugs - مفصولة بفاصلة)</label>
                  <input type="text" value={(editing.related_case_studies || []).join(',')} onChange={e => setEditing({ ...editing, related_case_studies: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left" dir="ltr" placeholder="e.g. pharma-summer-crisis" />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <label className="font-bold text-slate-700">نشر الصفحة للعامة؟</label>
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
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">قسم اتخاذ القرار (CTA Section)</h3>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">عنوان زر الحجز / الرسالة التحفيزية (CTA Title)</label>
                    <input type="text" value={langTab === 'ar' ? editing.cta_title_ar || '' : editing.cta_title_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, cta_title_ar: e.target.value } : { ...editing, cta_title_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">وصف الرسالة التحفيزية (CTA Description)</label>
                    <textarea rows={2} value={langTab === 'ar' ? editing.cta_desc_ar || '' : editing.cta_desc_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, cta_desc_ar: e.target.value } : { ...editing, cta_desc_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lists' && (
              <div className="space-y-10">
                {/* Challenges */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-red-600">تحديات القطاع (Challenges)</h3>
                    <button onClick={() => addArrayItem(langTab === 'ar' ? 'challenges_ar' : 'challenges_en')} className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center gap-1">
                      <PlusCircle className="w-4 h-4" /> إضافة تحدي
                    </button>
                  </div>
                  <div className="space-y-3">
                    {((editing[langTab === 'ar' ? 'challenges_ar' : 'challenges_en'] as string[]) || []).map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={item} onChange={e => handleArrayChange(langTab === 'ar' ? 'challenges_ar' : 'challenges_en', index, e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                        <button onClick={() => removeArrayItem(langTab === 'ar' ? 'challenges_ar' : 'challenges_en', index)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><MinusCircle className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solutions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-emerald-600">حلول ركن الريان (Solutions)</h3>
                    <button onClick={() => addArrayItem(langTab === 'ar' ? 'solutions_ar' : 'solutions_en')} className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center gap-1">
                      <PlusCircle className="w-4 h-4" /> إضافة حل
                    </button>
                  </div>
                  <div className="space-y-3">
                    {((editing[langTab === 'ar' ? 'solutions_ar' : 'solutions_en'] as string[]) || []).map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={item} onChange={e => handleArrayChange(langTab === 'ar' ? 'solutions_ar' : 'solutions_en', index, e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                        <button onClick={() => removeArrayItem(langTab === 'ar' ? 'solutions_ar' : 'solutions_en', index)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><MinusCircle className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-blue-600">الفوائد والعوائد (Benefits)</h3>
                    <button onClick={() => addArrayItem(langTab === 'ar' ? 'benefits_ar' : 'benefits_en')} className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center gap-1">
                      <PlusCircle className="w-4 h-4" /> إضافة فائدة
                    </button>
                  </div>
                  <div className="space-y-3">
                    {((editing[langTab === 'ar' ? 'benefits_ar' : 'benefits_en'] as string[]) || []).map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={item} onChange={e => handleArrayChange(langTab === 'ar' ? 'benefits_ar' : 'benefits_en', index, e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                        <button onClick={() => removeArrayItem(langTab === 'ar' ? 'benefits_ar' : 'benefits_en', index)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><MinusCircle className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-700">الأسئلة الشائعة الخاصة بالقطاع (FAQs)</h3>
                  <button onClick={() => setEditing({ ...editing, faqs: [...(editing.faqs || []), { q_ar: '', q_en: '', a_ar: '', a_en: '' }] })} className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center gap-1">
                    <PlusCircle className="w-4 h-4" /> إضافة سؤال
                  </button>
                </div>
                <div className="space-y-6">
                  {(editing.faqs || []).map((faq, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                      <button onClick={() => {
                        const newFaqs = [...editing.faqs!];
                        newFaqs.splice(index, 1);
                        setEditing({ ...editing, faqs: newFaqs });
                      }} className="absolute top-4 left-4 p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-500 mb-1">السؤال ({langTab.toUpperCase()})</label>
                        <input type="text" value={langTab === 'ar' ? faq.q_ar : faq.q_en} onChange={e => {
                          const newFaqs = [...editing.faqs!];
                          newFaqs[index] = { ...newFaqs[index], [langTab === 'ar' ? 'q_ar' : 'q_en']: e.target.value };
                          setEditing({ ...editing, faqs: newFaqs });
                        }} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500 bg-white" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">الإجابة ({langTab.toUpperCase()})</label>
                        <textarea rows={2} value={langTab === 'ar' ? faq.a_ar : faq.a_en} onChange={e => {
                          const newFaqs = [...editing.faqs!];
                          newFaqs[index] = { ...newFaqs[index], [langTab === 'ar' ? 'a_ar' : 'a_en']: e.target.value };
                          setEditing({ ...editing, faqs: newFaqs });
                        }} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500 bg-white" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                      </div>
                    </div>
                  ))}
                  {(!editing.faqs || editing.faqs.length === 0) && <div className="text-center text-slate-400 py-4">لم يتم إضافة أي أسئلة.</div>}
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Meta Title</label>
                  <input type="text" value={langTab === 'ar' ? editing.seo_title_ar || '' : editing.seo_title_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, seo_title_ar: e.target.value } : { ...editing, seo_title_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Meta Description</label>
                  <textarea rows={3} value={langTab === 'ar' ? editing.seo_desc_ar || '' : editing.seo_desc_en || ''} onChange={e => setEditing(langTab === 'ar' ? { ...editing, seo_desc_ar: e.target.value } : { ...editing, seo_desc_en: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir={langTab === 'ar' ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Canonical URL</label>
                  <input type="text" value={editing.canonical_url || ''} onChange={e => setEditing({ ...editing, canonical_url: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left" dir="ltr" />
                </div>
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
          <h1 className="text-2xl font-black text-slate-900">إدارة القطاعات (Industries Hubs)</h1>
          <p className="text-slate-500 mt-1">أنشئ صفحات هبوط لقطاعات الـ B2B مثل المستشفيات، المطاعم، المصانع لاستهدافها تسويقياً.</p>
        </div>
        <button onClick={() => setEditing({ active: true, challenges_ar: [], challenges_en: [], solutions_ar: [], solutions_en: [], benefits_ar: [], benefits_en: [], related_services: [], related_case_studies: [], faqs: [] })} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors">
          <Plus className="w-5 h-5" /> إضافة قطاع جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن قطاع..." 
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
                <th className="p-4 w-10"></th>
                <th className="p-4 font-bold">القطاع</th>
                <th className="p-4 font-bold">الرابط (Slug)</th>
                <th className="p-4 font-bold text-center">الحالة</th>
                <th className="p-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr 
                  key={item.id} 
                  id={`row-${index}`}
                  draggable={!searchTerm}
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragEnter={(e) => onDragEnter(e, index)}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${draggedIndex === index ? 'bg-slate-100 opacity-50' : ''}`}
                >
                  <td className="p-4">
                    {!searchTerm && <GripVertical className="w-5 h-5 text-slate-300 cursor-grab hover:text-slate-500" />}
                  </td>
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center"><Building2 className="w-5 h-5" /></div>
                    {item.name_ar}
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-sm" dir="ltr">{item.slug}</td>
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
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">لا توجد قطاعات مضافة.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
