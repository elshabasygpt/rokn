import React, { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { ClipboardList, Phone, MapPin, MessageCircle, Trash2, Calendar, X } from 'lucide-react';
import LeadDetails from './LeadDetails';

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

const columns = [
  { id: 'new', title: 'عميل جديد', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', ring: 'ring-blue-400' },
  { id: 'qualified', title: 'تم التأهيل', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', ring: 'ring-purple-400' },
  { id: 'quoted', title: 'تم إرسال عرض سعر', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', ring: 'ring-amber-400' },
  { id: 'negotiation', title: 'مفاوضات', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', ring: 'ring-orange-400' },
  { id: 'won', title: 'صفقة رابحة', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', ring: 'ring-emerald-400' },
  { id: 'lost', title: 'صفقة خاسرة', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', ring: 'ring-red-400' },
  { id: 'in_progress', title: 'قيد التنفيذ (قديم)', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', ring: 'ring-slate-400' },
  { id: 'completed', title: 'مكتمل (قديم)', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', ring: 'ring-slate-400' },
  { id: 'cancelled', title: 'ملغي (قديم)', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', ring: 'ring-slate-400' },
];

export default function BookingsManager() {
  const api = useApi();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    load();
  }, [page, search]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/bookings?status=all&page=${page}&limit=50&search=${encodeURIComponent(search)}`);
      setBookings(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/bookings/${id}/status`, { status });
      // Optimistic update
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      await api.del(`/api/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && bookings.length === 0) return <div className="p-8 text-center text-slate-500 font-bold">جاري تحميل الطلبات...</div>;

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] p-8 overflow-hidden bg-slate-50">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة المبيعات والطلبات (CRM)</h1>
          <p className="text-slate-500 text-sm mt-1">لوحة تحكم تفاعلية لمتابعة حالة الطلبات وتسريع المبيعات.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <form onSubmit={e => { e.preventDefault(); load(); }} className="relative">
            <input 
              type="text" 
              placeholder="بحث بالاسم، الجوال، الشركة..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm w-64 focus:border-amber-500 outline-none"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </form>

          <button 
            onClick={async () => {
              try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/bookings/export?status=all&search=${encodeURIComponent(search)}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
              });
              if (!res.ok) throw new Error('Export failed');
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'leads_export.csv';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            } catch (err) {
              console.error(err);
              alert('فشل تصدير التقرير');
            }
          }}
          className="bg-slate-900 text-white font-bold py-2 px-4 rounded-xl hover:bg-slate-800 transition-colors"
        >
          تصدير التقرير (CSV)
        </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const colBookings = bookings.filter(b => b.status === col.id);
          return (
            <div key={col.id} className={`flex-none w-80 rounded-2xl flex flex-col ${col.bg} border ${col.border}`}>
              <div className="p-4 border-b border-black/5 flex items-center justify-between shrink-0">
                <h3 className={`font-bold ${col.text}`}>{col.title}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/60 ${col.text}`}>{colBookings.length}</span>
              </div>
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {colBookings.map(b => (
                  <div key={b.id} onClick={() => setSelected(b)} className="bg-white p-4 rounded-xl shadow-sm border border-black/5 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 line-clamp-1">{b.client_name}</h4>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> <span dir="ltr">{b.client_phone}</span></div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> <span>{b.from_city} → {b.to_city}</span></div>
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> <span>{new Date(b.created_at).toLocaleDateString('ar-SA')}</span></div>
                    </div>
                  </div>
                ))}
                {colBookings.length === 0 && (
                  <div className="text-center py-8 text-black/40 text-sm font-medium border-2 border-dashed border-black/10 rounded-xl">
                    لا يوجد طلبات هنا
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selected && (
        <LeadDetails 
          lead={selected} 
          onClose={() => setSelected(null)} 
          onUpdate={load} 
          columns={columns} 
        />
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-auto shrink-0 bg-white px-6 py-3 rounded-2xl shadow-sm border">
          <p className="text-sm font-bold text-slate-500">
            إجمالي الطلبات: <span className="text-slate-900">{total}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 text-sm font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50"
            >
              السابق
            </button>
            <span className="text-sm font-bold text-slate-900 px-2">صفحة {page} من {totalPages}</span>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-4 py-2 text-sm font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
