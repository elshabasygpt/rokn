import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Search, CheckCircle, XCircle, ArrowRightLeft } from 'lucide-react';
import { useApi } from './useApi';

interface Redirect {
  id: number;
  old_path: string;
  new_path: string;
  status_code: number;
  active: boolean;
  created_at: string;
}

export default function RedirectsManager() {
  const api = useApi();
  const [items, setItems] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Partial<Redirect> | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/redirects');
      setItems(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing?.old_path || !editing?.new_path) {
      alert('الرجاء إدخال الرابط القديم والرابط الجديد');
      return;
    }
    try {
      if (editing.id) {
        await api.put(`/api/redirects/${editing.id}`, editing);
      } else {
        await api.post('/api/redirects', editing);
      }
      setEditing(null);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'حدث خطأ أثناء الحفظ (ربما الرابط القديم مسجل مسبقاً)');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التوجيه؟ سيؤدي ذلك لظهور صفحة Error 404 للزوار القادمين من الرابط القديم.')) return;
    try {
      await api.del(`/api/redirects/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter(c => 
    c.old_path?.includes(searchTerm) || c.new_path?.includes(searchTerm)
  );

  if (loading) return <div className="p-8 text-center text-slate-500">جاري التحميل...</div>;

  if (editing) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900">{editing.id ? 'تعديل توجيه' : 'إضافة توجيه جديد (301 Redirect)'}</h1>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-bold transition-colors">إلغاء</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
              <Save className="w-4 h-4" /> حفظ
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-3xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الرابط القديم (Old Path)</label>
              <input type="text" value={editing.old_path || ''} onChange={e => setEditing({ ...editing, old_path: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left text-red-600 bg-red-50" dir="ltr" placeholder="/old-page" />
              <p className="text-xs text-slate-500 mt-1">يجب أن يبدأ بـ / (مثال: /services/old-service)</p>
            </div>
            
            <div className="flex justify-center">
              <ArrowRightLeft className="w-6 h-6 text-slate-400 rotate-90" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الرابط الجديد (New Path)</label>
              <input type="text" value={editing.new_path || ''} onChange={e => setEditing({ ...editing, new_path: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-left text-emerald-600 bg-emerald-50" dir="ltr" placeholder="/new-page" />
              <p className="text-xs text-slate-500 mt-1">يجب أن يبدأ بـ / أو رابط كامل http (مثال: /services/new-service)</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">نوع التوجيه (Status Code)</label>
              <select value={editing.status_code || 301} onChange={e => setEditing({ ...editing, status_code: parseInt(e.target.value) })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" dir="rtl">
                <option value={301}>301 (نقل دائم - Permanent) - الأفضل للسيو</option>
                <option value={302}>302 (نقل مؤقت - Temporary)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <label className="font-bold text-slate-700">تفعيل التوجيه؟</label>
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
          <h1 className="text-2xl font-black text-slate-900">إدارة الروابط والسيو (SEO Redirects)</h1>
          <p className="text-slate-500 mt-1">قم بتوجيه الزوار ومحركات البحث من الروابط القديمة إلى الروابط الجديدة للحفاظ على ترتيب موقعك (301 Redirects).</p>
        </div>
        <button onClick={() => setEditing({ active: true, status_code: 301 })} className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors">
          <Plus className="w-5 h-5" /> إضافة توجيه
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن رابط..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pr-11 pl-4 py-2.5 outline-none focus:border-amber-500 font-mono text-left" dir="ltr"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-sm">
                <th className="p-4 font-bold text-left">الرابط القديم (Old Path)</th>
                <th className="p-4 font-bold text-center">نوع التوجيه</th>
                <th className="p-4 font-bold text-left">الرابط الجديد (New Path)</th>
                <th className="p-4 font-bold text-center">الحالة</th>
                <th className="p-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-red-500 font-mono font-bold text-left" dir="ltr">{item.old_path}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold font-mono ${item.status_code === 301 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.status_code}
                    </span>
                  </td>
                  <td className="p-4 text-emerald-600 font-mono font-bold text-left flex items-center gap-2" dir="ltr">
                    <ArrowRightLeft className="w-4 h-4 text-slate-400" /> {item.new_path}
                  </td>
                  <td className="p-4 text-center">
                    {item.active ? <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle className="w-3 h-3" /> مفعل</span> : <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold"><XCircle className="w-3 h-3" /> معطل</span>}
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
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">لا توجد توجيهات مضافة.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
