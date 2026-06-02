import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useApi } from './useApi';
import { LayoutDashboard, Package, Image, Star, ClipboardList, Settings, LogOut, Menu, X, ChevronLeft, FileText, Shield, Truck, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'الرئيسية', icon: LayoutDashboard, end: true, req: 'all' },
    { path: '/admin/services', label: 'الخدمات', icon: Package, req: 'manage_services' },
    { path: '/admin/fleet', label: 'الأسطول', icon: Truck, req: 'manage_services' },
    { path: '/admin/gallery', label: 'معرض الأعمال', icon: Image, req: 'manage_gallery' },
    { path: '/admin/testimonials', label: 'آراء العملاء', icon: Star, req: 'manage_services' },
    { path: '/admin/partners', label: 'الشركاء', icon: Image, req: 'manage_partners' },
    { path: '/admin/faqs', label: 'الأسئلة الشائعة', icon: ClipboardList, req: 'manage_faqs' },
    { path: '/admin/articles', label: 'المدونة والمقالات', icon: FileText, req: 'manage_articles' },
    { path: '/admin/careers', label: 'التوظيف', icon: Users, req: 'manage_careers' },
    { path: '/admin/bookings', label: 'الطلبات', icon: ClipboardList, req: 'all' },
    { path: '/admin/pages', label: 'الصفحات الثابتة', icon: FileText, req: 'manage_settings' },
    { path: '/admin/settings', label: 'الإعدادات', icon: Settings, req: 'manage_settings' },
  ];

  if (admin?.permissions?.includes('all')) {
    navItems.push({ path: '/admin/roles', label: 'إدارة الصلاحيات', icon: Shield, req: 'all' });
  }

  const allowedNavs = navItems.filter(nav => 
    admin?.permissions?.includes('all') || admin?.permissions?.includes(nav.req)
  );

  const api = useApi();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    api.get('/api/settings').then(res => {
      if (res.general) setSettings(res.general);
    }).catch(console.error);
  }, []);

  const currentLang = i18n.language;
  let dashboardLogoRaw = currentLang === 'en' ? settings?.logo_dashboard_en : settings?.logo_dashboard_ar;
  if (!dashboardLogoRaw) dashboardLogoRaw = settings?.logo;
  const logoUrl = dashboardLogoRaw ? (dashboardLogoRaw.startsWith('/') ? dashboardLogoRaw : dashboardLogoRaw) : null;

  return (
    <div className="min-h-screen bg-slate-100 flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:static lg:w-72 flex flex-col shadow-2xl`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img src={logoUrl || "/logo.png"} alt="Logo" className={logoUrl ? "w-full h-full object-contain p-1 bg-white" : "w-8 h-8 object-contain"} onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }} />
            </div>
            <div>
              <h1 className="font-black text-white text-lg">ركن الريان</h1>
              <p className="text-slate-500 text-xs">لوحة التحكم</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-6 left-6 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {allowedNavs.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3.5 mx-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-black text-sm">
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{admin?.username}</p>
              <p className="text-slate-500 text-xs">مشرف</p>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="تسجيل خروج">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-500 hover:text-amber-600 transition-colors ms-auto">
            <ChevronLeft className="w-4 h-4" />
            زيارة الموقع
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
