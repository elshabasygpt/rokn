import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from './useApi';
import { ClipboardList, Package, Image, Star, TrendingUp, Clock, CheckCircle2, AlertCircle, Users } from 'lucide-react';

interface BookingStats {
  total: number;
  new: number;
  in_progress: number;
  completed: number;
}

interface Booking {
  id: number;
  client_name: string;
  client_phone: string;
  from_city: string;
  to_city: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const api = useApi();
  const [stats, setStats] = useState<BookingStats>({ total: 0, new: 0, in_progress: 0, completed: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [counts, setCounts] = useState({ services: 0, gallery: 0, testimonials: 0, partners: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingStats, bookings, services, gallery, testimonials, partners] = await Promise.all([
        api.get('/api/bookings/stats'),
        api.get('/api/bookings?status=all'),
        api.get('/api/services'),
        api.get('/api/gallery'),
        api.get('/api/testimonials'),
        api.get('/api/partners'),
      ]);
      setStats(bookingStats);
      setRecentBookings(bookings.slice(0, 5));
      setCounts({ services: services.length, gallery: gallery.length, testimonials: testimonials.length, partners: partners.length });
    } catch (err) {
      console.error(err);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      new: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'جديد' },
      qualified: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'مؤهل' },
      quoted: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'عرض سعر' },
      negotiation: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'مفاوضات' },
      won: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'صفقة رابحة' },
      lost: { bg: 'bg-red-100', text: 'text-red-700', label: 'خاسرة' },
      in_progress: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'قيد التنفيذ (قديم)' },
      completed: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'مكتمل (قديم)' },
      cancelled: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'ملغي (قديم)' },
    };
    const s = map[status] || map.new;
    return <span className={`${s.bg} ${s.text} text-xs font-bold px-3 py-1 rounded-full`}>{s.label}</span>;
  };

  const statCards = [
    { label: 'طلبات جديدة', value: stats.new, icon: AlertCircle, color: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-100 text-blue-600', path: '/admin/bookings' },
    { label: 'قيد التنفيذ', value: stats.in_progress, icon: Clock, color: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-100 text-amber-600', path: '/admin/bookings' },
    { label: 'مكتملة', value: stats.completed, icon: CheckCircle2, color: 'from-green-500 to-green-600', iconBg: 'bg-green-100 text-green-600', path: '/admin/bookings' },
    { label: 'إجمالي الطلبات', value: stats.total, icon: TrendingUp, color: 'from-slate-600 to-slate-700', iconBg: 'bg-slate-100 text-slate-600', path: '/admin/bookings' },
  ];

  const contentCards = [
    { label: 'الخدمات', value: counts.services, icon: Package, color: 'text-amber-500', path: '/admin/services' },
    { label: 'الشركاء', value: counts.partners, icon: Users, color: 'text-purple-500', path: '/admin/partners' },
    { label: 'المعرض', value: counts.gallery, icon: Image, color: 'text-blue-500', path: '/admin/gallery' },
    { label: 'الآراء', value: counts.testimonials, icon: Star, color: 'text-green-500', path: '/admin/testimonials' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-2">لوحة التحكم</h1>
      <p className="text-slate-500 mb-8">مرحباً بك في لوحة إدارة ركن الريان للنقل المبرد</p>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <Link to={card.path} key={i} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-shadow block">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{card.value}</p>
            <p className="text-slate-500 text-sm font-semibold mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {contentCards.map((card, i) => (
          <Link to={card.path} key={i} className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover:shadow-lg transition-shadow block">
            <card.icon className={`w-8 h-8 mx-auto mb-3 ${card.color}`} />
            <p className="text-2xl font-black text-slate-900">{card.value}</p>
            <p className="text-slate-500 text-sm font-semibold">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <ClipboardList className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-black text-slate-900">آخر الطلبات</h2>
        </div>
        {recentBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semebold">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="text-start px-6 py-3 font-bold">#</th>
                  <th className="text-start px-6 py-3 font-bold">العميل</th>
                  <th className="text-start px-6 py-3 font-bold">المسار</th>
                  <th className="text-start px-6 py-3 font-bold">الحالة</th>
                  <th className="text-start px-6 py-3 font-bold">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-400">{b.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{b.client_name}</p>
                      <p className="text-slate-500 text-xs" dir="ltr">{b.client_phone}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{b.from_city} → {b.to_city}</td>
                    <td className="px-6 py-4">{statusBadge(b.status)}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(b.created_at).toLocaleDateString('ar-SA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
