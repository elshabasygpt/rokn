import React, { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { ClipboardList, Phone, MapPin, MessageCircle, Trash2, Filter } from 'lucide-react';

interface Booking {
  id: number;
  from_city: string;
  to_city: string;
  rooms: string;
  notes: string;
  client_name: string;
  client_phone: string;
  status: string;
  created_at: string;
}

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'جديد' },
  in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'قيد التنفيذ' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'مكتمل' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'ملغي' },
};

export default function BookingsManager() {
  const api = useApi();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => { load(); }, [filter]);

  const load = async () => {
    try { setBookings(await api.get(`/api/bookings?status=${filter}`)); } catch (err) { console.error(err); }
    setLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/bookings/${id}/status`, { status });
      load();
      if (selected?.id === id) setSelected({ ...selected!, status });
    } catch (err) { console.error(err); }
  };

  const remove = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try { await api.del(`/api/bookings/${id}`); setSelected(null); load(); } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة الطلبات</h1>
          <p className="text-slate-500 text-sm mt-1">{bookings.length} طلب</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { val: 'all', label: 'الكل' },
          { val: 'new', label: 'جديد' },
          { val: 'in_progress', label: 'قيد التنفيذ' },
          { val: 'completed', label: 'مكتمل' },
          { val: 'cancelled', label: 'ملغي' },
        ].map(f => (
          <button key={f.val} onClick={() => { setFilter(f.val); setLoading(true); }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === f.val ? 'bg-amber-500 text-slate-900 shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Bookings List */}
        <div className={`${selected ? 'w-1/2' : 'w-full'} transition-all`}>
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-400 font-semibold">لا توجد طلبات</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} onClick={() => setSelected(b)}
                  className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-md ${selected?.id === b.id ? 'border-amber-500 shadow-md' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900">{b.client_name}</h3>
                    {(() => { const s = statusMap[b.status] || statusMap.new; return <span className={`${s.bg} ${s.text} text-xs font-bold px-3 py-1 rounded-full`}>{s.label}</span>; })()}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.from_city} → {b.to_city}</span>
                    <span>{new Date(b.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selected && (
          <div className="w-1/2 bg-white rounded-2xl border border-slate-200 p-6 sticky top-24 self-start">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">تفاصيل الطلب #{selected.id}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><span className="font-black text-amber-600 text-sm">{selected.client_name.charAt(0)}</span></div>
                <div>
                  <p className="font-bold text-slate-900">{selected.client_name}</p>
                  <p className="text-slate-500 text-sm" dir="ltr">{selected.client_phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-slate-500 mb-1">من مدينة</p><p className="font-bold text-slate-900">{selected.from_city}</p></div>
                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-slate-500 mb-1">إلى مدينة</p><p className="font-bold text-slate-900">{selected.to_city}</p></div>
                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-slate-500 mb-1">تفاصيل الشاحنة</p><p className="font-bold text-slate-900">{selected.rooms || 'غير محدد'}</p></div>
                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-slate-500 mb-1">التاريخ</p><p className="font-bold text-slate-900">{new Date(selected.created_at).toLocaleString('ar-SA')}</p></div>
              </div>
              {selected.notes && (
                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-slate-500 text-sm mb-1">ملاحظات</p><p className="text-slate-900 text-sm">{selected.notes}</p></div>
              )}
            </div>

            {/* Status changes */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">تغيير الحالة</label>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(statusMap).map(([key, val]) => (
                  <button key={key} onClick={() => updateStatus(selected.id, key)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selected.status === key ? `${val.bg} ${val.text} ring-2 ring-offset-1` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <a href={`tel:${selected.client_phone}`} className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-slate-900 font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors text-sm">
                <Phone className="w-4 h-4" /> اتصال
              </a>
              <a href={`https://wa.me/${selected.client_phone.replace(/^0/, '966')}`} target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#20bd5a] transition-colors text-sm">
                <MessageCircle className="w-4 h-4" /> واتساب
              </a>
              <button onClick={() => remove(selected.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
