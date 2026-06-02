import React, { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { Save, Image as ImageIcon, MapPin, Calculator, Mail, MessageCircle, Bell, CheckCircle2, Phone, ClipboardList, Megaphone, Clock, Trash2, Plus, BarChart, LayoutDashboard, Download, Upload } from 'lucide-react';
import { availableIcons, getIcon } from '../lib/iconMap';

export default function SettingsManager() {
  const api = useApi();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Backup state
  const [backupInfo, setBackupInfo] = useState<any>(null);
  const [backupProgress, setBackupProgress] = useState<'' | 'downloading' | 'restoring' | 'drive'>('');
  const [driveResult, setDriveResult] = useState<{ success: boolean; link?: string; error?: string } | null>(null);

  useEffect(() => { load(); loadBackupInfo(); }, []);

  const load = async () => {
    try { setSettings(await api.get('/api/settings')); } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadBackupInfo = async () => {
    try { setBackupInfo(await api.get('/api/backup/info')); } catch (err) { console.error(err); }
  };

  const saveSection = async (key: string) => {
    setSaving(true);
    try {
      await api.put(`/api/settings/${key}`, { value: settings[key] });
      setSaved(key);
      setTimeout(() => {
        setSaved('');
        if (key === 'general') {
          window.location.reload();
        }
      }, 1000);
    } catch (err: any) { 
      console.error(err); 
      alert('فشل الحفظ: ' + (err.message || err));
    }
    setSaving(false);
  };

  const update = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    try {
      const result = await api.upload(file);
      const currentImages = settings.hero?.images || [];
      update('hero', 'images', [...currentImages, result.url]);
    } catch (err) { console.error(err); }
  };

  const handleSpecificLogoUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    try {
      const result = await api.upload(file);
      update('general', key, result.url);
    } catch (err) { console.error(err); }
  };

  const handleEstimatorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    try {
      const result = await api.upload(file);
      update('estimator', 'image', result.url);
    } catch (err) { console.error(err); }
  };

  const handleUploadWhyUsImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    try {
      const result = await api.upload(file);
      update('whyUsMeta', 'image', result.url);
    } catch (err) { console.error(err); }
  };

  const handleUploadHowItWorksImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    try {
      const result = await api.upload(file);
      const arr = [...(settings.content?.howItWorks || [{},{},{},{}])];
      arr[index] = { ...arr[index], image: result.url };
      update('content', 'howItWorks', arr);
    } catch (err) { console.error(err); }
  };

  const handleDownloadBackup = async () => {
    try {
      setBackupProgress('downloading');
      const token = localStorage.getItem('admin_token');
      const downloadUrl = `/api/backup/export?token=${encodeURIComponent(token || '')}`;

      // Open in new tab — Chrome downloads the file (Content-Disposition: attachment)
      // and auto-closes the blank tab
      window.open(downloadUrl, '_blank');
      setTimeout(() => setBackupProgress(''), 4000);
    } catch (err: any) {
      alert('فشل تحميل النسخة الاحتياطية: ' + (err.message || err));
      console.error(err);
      setBackupProgress('');
    }
  };

  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (!file.name.endsWith('.zip')) {
      alert('يرجى اختيار ملف بصيغة ZIP فقط.');
      e.target.value = '';
      return;
    }

    if (!window.confirm('🚨 تحذير خطير!\n\nهذه العملية ستقوم بـ:\n• مسح جميع بيانات الموقع الحالية\n• مسح جميع الصور المرفوعة\n• استبدالها ببيانات النسخة المرفوعة\n\nهل أنت متأكد تماماً؟')) {
      e.target.value = '';
      return;
    }

    try {
      setBackupProgress('restoring');
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/backup/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Restore failed');

      setSaved('backup');
      setTimeout(() => { window.location.reload(); }, 2500);
    } catch (err: any) {
      alert('فشل استعادة النسخة: ' + (err.message || err));
      console.error(err);
    } finally {
      setBackupProgress('');
      e.target.value = '';
    }
  };

  const handleUploadToDrive = async () => {
    try {
      setBackupProgress('drive');
      setDriveResult(null);

      // 1. Download the backup ZIP in a new tab
      const token = localStorage.getItem('admin_token');
      const downloadUrl = `/api/backup/export?token=${encodeURIComponent(token || '')}`;
      window.open(downloadUrl, '_blank');

      // 2. Open Google Drive after a short delay to let download start
      const driveUploadUrl = 'https://drive.google.com/drive/my-drive';
      setTimeout(() => {
        window.open(driveUploadUrl, '_blank');
      }, 2500);

      setDriveResult({
        success: true,
        link: driveUploadUrl,
      });
    } catch (err: any) {
      setDriveResult({ success: false, error: err.message || 'حدث خطأ أثناء الرفع' });
      console.error(err);
    } finally {
      setBackupProgress('');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">جاري التحميل...</div>;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-2">الإعدادات العامة</h1>
      <p className="text-slate-500 mb-8 text-sm">تحكم في إعدادات الموقع والإشعارات</p>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">معلومات التواصل</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الرقم الأول</label>
              <input value={settings.general?.phone1 || ''} onChange={e => update('general', 'phone1', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الرقم الثاني</label>
              <input value={settings.general?.phone2 || ''} onChange={e => update('general', 'phone2', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">رقم الواتساب (بصيغة دولية)</label>
              <input value={settings.general?.whatsapp || ''} onChange={e => update('general', 'whatsapp', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" placeholder="966502375887" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">رابط الموقع (Domain URL)</label>
              <input 
                placeholder="https://www.Rokn Elryanmoving.com" 
                value={settings.general?.domain || ''} 
                onChange={e => update('general', 'domain', e.target.value)}
                dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-sm" 
              />
              <p className="text-xs text-slate-500 mt-1">هام جداً لأرشفة (SEO) وعمل خرائط جوجل بشكل صحيح.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">العنوان (عربي)</label>
              <input value={settings.general?.address_ar || ''} onChange={e => update('general', 'address_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            {/* Legacy Logo Removed */}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => saveSection('general')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ
            </button>
            {saved === 'general' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ</span>}
          </div>
        </div>

        {/* Marketing & Tracking */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">التسويق والتتبع (Marketing & Tracking)</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">أدخل المعرفات (IDs) لتفعيل البيكسلات تلقائياً في الموقع.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Google Analytics 4 (GA4 ID)</label>
              <input 
                placeholder="G-XXXXXXXXXX" 
                value={settings.marketing?.ga4_id || ''} 
                onChange={e => update('marketing', 'ga4_id', e.target.value)} 
                dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Meta Pixel ID (Facebook)</label>
              <input 
                placeholder="123456789012345" 
                value={settings.marketing?.meta_pixel_id || ''} 
                onChange={e => update('marketing', 'meta_pixel_id', e.target.value)} 
                dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Snapchat Pixel ID</label>
              <input 
                placeholder="xx-xxxx-xxxx-xxxx..." 
                value={settings.marketing?.snapchat_pixel_id || ''} 
                onChange={e => update('marketing', 'snapchat_pixel_id', e.target.value)} 
                dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">TikTok Pixel ID</label>
              <input 
                placeholder="C..." 
                value={settings.marketing?.tiktok_pixel_id || ''} 
                onChange={e => update('marketing', 'tiktok_pixel_id', e.target.value)} 
                dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono text-sm" 
              />
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-800 mb-2">📌 خريطة الموقع (Sitemap) لصلاحيات البحث</h3>
            <p className="text-sm text-slate-600 mb-3">
              انسخ هذا الرابط وضعه في <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-amber-600 underline font-bold">Google Search Console</a> لتبدأ عناكب جوجل بفهرسة مقالاتك وخدماتك فوراً.
            </p>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={`${settings.general?.domain || window.location.origin}/sitemap.xml`} 
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-500 text-sm font-mono" 
                dir="ltr"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${settings.general?.domain || window.location.origin}/sitemap.xml`);
                  alert('تم نسخ الرابط!');
                }}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition"
              >
                نسخ
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => saveSection('marketing')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ الأكواد
            </button>
            {saved === 'marketing' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ</span>}
          </div>
        </div>


        {/* Section Visibility */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <LayoutDashboard className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">إدارة ظهور الأقسام (Section Visibility)</h2>
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.general?.partners_enabled !== false} 
                onChange={e => update('general', 'partners_enabled', e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer" 
              />
              <span className="font-bold text-slate-700">تفعيل قسم الشركاء (نعتز بثقتهم وشركاء في نجاحهم)</span>
            </label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => saveSection('general')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ الأقسام
            </button>
            {saved === 'general' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ</span>}
          </div>
        </div>

        {/* Logos & Branding Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">الهوية والشعارات (Logos & Branding)</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Header Logo */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">شعار القائمة العلوية (Header)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">عربي (AR)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_header_ar ? <img src={settings.general.logo_header_ar.startsWith('/') ? settings.general.logo_header_ar : settings.general.logo_header_ar} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">رفع الشعار</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_header_ar', e)} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">إنجليزي (EN)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_header_en ? <img src={settings.general.logo_header_en.startsWith('/') ? settings.general.logo_header_en : settings.general.logo_header_en} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">Upload Logo</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_header_en', e)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Logo */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">شعار النهاية (Footer)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">عربي (AR)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_footer_ar ? <img src={settings.general.logo_footer_ar.startsWith('/') ? settings.general.logo_footer_ar : settings.general.logo_footer_ar} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">رفع الشعار</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_footer_ar', e)} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">إنجليزي (EN)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_footer_en ? <img src={settings.general.logo_footer_en.startsWith('/') ? settings.general.logo_footer_en : settings.general.logo_footer_en} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">Upload Logo</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_footer_en', e)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* About Logo */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">شعار من نحن (About)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">عربي (AR)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_about_ar ? <img src={settings.general.logo_about_ar.startsWith('/') ? settings.general.logo_about_ar : settings.general.logo_about_ar} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">رفع الشعار</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_about_ar', e)} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">إنجليزي (EN)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_about_en ? <img src={settings.general.logo_about_en.startsWith('/') ? settings.general.logo_about_en : settings.general.logo_about_en} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">Upload Logo</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_about_en', e)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Admin Login Logo */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">شعار دخول الإدارة (Login)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">عربي (AR)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_login_ar ? <img src={settings.general.logo_login_ar.startsWith('/') ? settings.general.logo_login_ar : settings.general.logo_login_ar} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">رفع الشعار</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_login_ar', e)} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">إنجليزي (EN)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_login_en ? <img src={settings.general.logo_login_en.startsWith('/') ? settings.general.logo_login_en : settings.general.logo_login_en} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">Upload Logo</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_login_en', e)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            
            {/* Dashboard Logo */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">شعار لوحة التحكم (Dashboard)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">عربي (AR)</label>
                  <label className="relative flex items-center justify-center h-20 bg-slate-900 rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_dashboard_ar ? <img src={settings.general.logo_dashboard_ar.startsWith('/') ? settings.general.logo_dashboard_ar : settings.general.logo_dashboard_ar} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">رفع الشعار</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_dashboard_ar', e)} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">إنجليزي (EN)</label>
                  <label className="relative flex items-center justify-center h-20 bg-slate-900 rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_dashboard_en ? <img src={settings.general.logo_dashboard_en.startsWith('/') ? settings.general.logo_dashboard_en : settings.general.logo_dashboard_en} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">Upload Logo</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_dashboard_en', e)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            
            {/* Blog Author Logo */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">شعار كاتب المقال (Blog Author)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">عربي (AR)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_blog_ar ? <img src={settings.general.logo_blog_ar.startsWith('/') ? settings.general.logo_blog_ar : settings.general.logo_blog_ar} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">رفع الشعار</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_blog_ar', e)} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">إنجليزي (EN)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.logo_blog_en ? <img src={settings.general.logo_blog_en.startsWith('/') ? settings.general.logo_blog_en : settings.general.logo_blog_en} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">Upload Logo</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('logo_blog_en', e)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Favicon Logo */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">أيقونة المتصفح (Favicon)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">أيقونة المتصفح (تظهر في تبويب المتصفح)</label>
                  <label className="relative flex items-center justify-center h-20 bg-white rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:border-amber-500 transition-colors">
                    {settings.general?.favicon ? <img src={settings.general.favicon.startsWith('/') ? settings.general.favicon : settings.general.favicon} className="h-full object-contain p-2" /> : <span className="text-xs text-slate-400">رفع الأيقونة (يفضل مربعة 32x32)</span>}
                    <input type="file" onChange={e => handleSpecificLogoUpload('favicon', e)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => saveSection('general')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ الشعارات
            </button>
            {saved === 'general' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ</span>}
          </div>
        </div>

        {/* SEO & Analytics Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">إعدادات الأرشفة و Google (SEO & Analytics)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">معرف إحصاءات جوجل (Google Analytics ID)</label>
              <input value={settings.general?.googleAnalyticsId || ''} onChange={e => update('general', 'googleAnalyticsId', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" placeholder="e.g. G-XXXXXXX" />
              <p className="text-xs text-slate-500 mt-1">اتركه فارغاً إذا لم تكن تمتلك حساباً بعد.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">كود تأكيد ملكية الموقع (Google Site Verification)</label>
              <input value={settings.general?.googleSiteVerification || ''} onChange={e => update('general', 'googleSiteVerification', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" placeholder="e.g. random_string" />
              <p className="text-xs text-slate-500 mt-1">يُستخدم لربط الموقع بـ Google Search Console.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <button onClick={() => saveSection('general')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm w-max">
              <Save className="w-4 h-4" /> حفظ
            </button>
            {saved === 'general' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ والتحديث (سيتم إعادة تحميل الصفحة)</span>}
          </div>
        </div>

        {/* Hero Banner (Slider) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">قسم الواجهة (Slideshow)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الأول (عربي)</label>
              <input value={settings.hero?.title1_ar || ''} onChange={e => update('hero', 'title1_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Title 1 (English)</label>
              <input value={settings.hero?.title1_en || ''} onChange={e => update('hero', 'title1_en', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الثاني (عربي)</label>
              <input value={settings.hero?.title2_ar || ''} onChange={e => update('hero', 'title2_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Title 2 (English)</label>
              <input value={settings.hero?.title2_en || ''} onChange={e => update('hero', 'title2_en', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">الوصف (عربي)</label>
              <textarea value={settings.hero?.desc_ar || ''} onChange={e => update('hero', 'desc_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none h-24" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description (English)</label>
              <textarea value={settings.hero?.desc_en || ''} onChange={e => update('hero', 'desc_en', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none h-24" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">صور السلايدر</label>
            <div className="flex flex-wrap gap-4">
              {(settings.hero?.images || []).map((img: string, i: number) => (
                <div key={i} className="relative w-32 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={img.startsWith('/') ? img : img} className="w-full h-full object-cover" alt="slider" />
                  <button onClick={() => update('hero', 'images', settings.hero.images.filter((_: any, j: number) => j !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* SVG X icon */}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ))}
              <div onClick={() => fileInputRef.current?.click()} className="w-32 h-20 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-amber-500 transition-colors">
                <span className="text-xl text-slate-400">+</span>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => saveSection('hero')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ
            </button>
            {saved === 'hero' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ</span>}
          </div>
        </div>

        {/* Cost Estimator Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">قسم حاسبة التكلفة</h2>
          </div>
          
          <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.estimator?.enabled !== false} 
                onChange={e => update('estimator', 'enabled', e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer" 
              />
              <span className="font-bold text-slate-700">تفعيل القسم (عرض حاسبة التكلفة في الصفحة الرئيسية)</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">عنوان القسم (عربي)</label>
              <input value={settings.estimator?.title_ar || ''} onChange={e => update('estimator', 'title_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" placeholder="احسب تكلفة النقل المبرد تقريباً" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Section Title (English)</label>
              <input value={settings.estimator?.title_en || ''} onChange={e => update('estimator', 'title_en', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" placeholder="Calculate your moving cost roughly" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">وصف القسم (عربي)</label>
              <textarea value={settings.estimator?.desc_ar || ''} onChange={e => update('estimator', 'desc_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none h-24" placeholder="استخدم حاسبتنا الذكية..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Section Description (English)</label>
              <textarea value={settings.estimator?.desc_en || ''} onChange={e => update('estimator', 'desc_en', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none h-24" placeholder="Use our smart calculator..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">الصورة الجانبية للحاسبة</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative group">
                  {settings.estimator?.image ? (
                    <>
                      <img src={settings.estimator.image.startsWith('/') ? settings.estimator.image : settings.estimator.image} alt="Estimator" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <label className="text-white text-sm font-bold cursor-pointer">تغيير الصورة<input type="file" accept="image/*" onChange={handleEstimatorImageUpload} className="hidden" /></label>
                      </div>
                    </>
                  ) : (
                    <label className="text-slate-400 text-sm cursor-pointer flex flex-col items-center gap-2">
                      <ImageIcon className="w-6 h-6" />
                      رفع صورة
                      <input type="file" accept="image/*" onChange={handleEstimatorImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>يفضل رفع صورة بأبعاد عمودية (Portrait) مثل 800x1200.</p>
                  <p>الصورة الافتراضية ستظهر إذا لم تقم برفع صورة جديدة.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calculator className="w-4 h-4 text-amber-500" /> تسعيرة النقل والمعادلة الرياضية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">المدن المتاحة في الحاسبة (مفصولة بفاصلة)</label>
                  <input value={settings.estimator?.cities?.join('، ') || 'أبها، خميس مشيط'} 
                    onChange={e => update('estimator', 'cities', e.target.value.split('،').map(s=>s.trim()).filter(Boolean))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" placeholder="أبها، خميس مشيط، الرياض، جدة" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">المدن "المحلية" التي تنطبق عليها تسعيرة النقل الداخلي القصيرة</label>
                  <input value={settings.estimator?.local_cities?.join('، ') || 'أبها، خميس مشيط'} 
                    onChange={e => update('estimator', 'local_cities', e.target.value.split('،').map(s=>s.trim()).filter(Boolean))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" placeholder="أبها، خميس مشيط" />
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <h4 className="font-bold text-amber-900 mb-3 text-sm">التسعيرة الداخلية (محلية)</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">السعر الأساسي (للنقل)</label>
                      <input type="number" value={settings.estimator?.local_base_price ?? 300} onChange={e => update('estimator', 'local_base_price', Number(e.target.value))}
                        className="w-full border border-amber-200 rounded-lg px-3 py-2 outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">تكلفة إضافية (جامبو/تجميد)</label>
                      <input type="number" value={settings.estimator?.local_room_price ?? 150} onChange={e => update('estimator', 'local_room_price', Number(e.target.value))}
                        className="w-full border border-amber-200 rounded-lg px-3 py-2 outline-none focus:border-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-3 text-sm">التسعيرة الخارجية (بين المدن)</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">السعر الأساسي (للنقل)</label>
                      <input type="number" value={settings.estimator?.external_base_price ?? 1000} onChange={e => update('estimator', 'external_base_price', Number(e.target.value))}
                        className="w-full border border-blue-200 rounded-lg px-3 py-2 outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">تكلفة إضافية (جامبو/تجميد)</label>
                      <input type="number" value={settings.estimator?.external_room_price ?? 300} onChange={e => update('estimator', 'external_room_price', Number(e.target.value))}
                        className="w-full border border-blue-200 rounded-lg px-3 py-2 outline-none focus:border-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => saveSection('estimator')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ القسم
            </button>
            {saved === 'estimator' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح</span>}
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Megaphone className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">بانر العروض</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.promo?.enabled} onChange={e => update('promo', 'enabled', e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded" />
              <span className="font-bold text-slate-700">تفعيل بانر العروض</span>
            </label>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">نص العرض (عربي)</label>
              <input value={settings.promo?.text_ar || ''} onChange={e => update('promo', 'text_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Promo Text (English)</label>
              <input value={settings.promo?.text_en || ''} onChange={e => update('promo', 'text_en', e.target.value)} dir="ltr"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => saveSection('promo')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ
            </button>
            {saved === 'promo' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ</span>}
          </div>
        </div>

        {/* Why Us Meta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">غلاف وإحصائيات (لماذا تختارنا)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الصورة الجانبية</label>
                <div className="flex gap-4 items-end">
                  {settings.whyUsMeta?.image ? (
                    <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-200 relative group">
                      <img src={settings.whyUsMeta.image.startsWith('/') ? settings.whyUsMeta.image : settings.whyUsMeta.image} alt="Why Us" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <label className="cursor-pointer text-white text-xs font-bold bg-amber-500 px-3 py-1.5 rounded-lg">
                          تغيير الصورة
                          <input type="file" className="hidden" accept="image/*" onChange={handleUploadWhyUsImage} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
                      <label className="cursor-pointer text-slate-500 text-xs font-bold hover:text-amber-500 flex flex-col items-center gap-2">
                        <ImageIcon className="w-6 h-6" />
                        إضافة صورة
                        <input type="file" className="hidden" accept="image/*" onChange={handleUploadWhyUsImage} />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان القسم (عربي / English)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input value={settings.whyUsMeta?.title_ar || ''} onChange={e => update('whyUsMeta', 'title_ar', e.target.value)} placeholder="مثال: لماذا تختار ركن الريان" className="border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
                  <input value={settings.whyUsMeta?.title_en || ''} onChange={e => update('whyUsMeta', 'title_en', e.target.value)} placeholder="e.g: Why Choose Rokn Elryan" dir="ltr" className="border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الوصف الخاص بالقسم (عربي / English)</label>
                <div className="space-y-3">
                  <textarea value={settings.whyUsMeta?.desc_ar || ''} onChange={e => update('whyUsMeta', 'desc_ar', e.target.value)} placeholder="نحن لا ننقل البضائع فحسب..." className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500 h-20" />
                  <textarea value={settings.whyUsMeta?.desc_en || ''} onChange={e => update('whyUsMeta', 'desc_en', e.target.value)} placeholder="We do not just move furniture..." dir="ltr" className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500 h-20" />
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800">إحصائيات القسم (العداد)</h3>
              
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                <p className="text-xs font-bold text-slate-500 mb-2">الإحصائية الأولى</p>
                <input type="number" placeholder="الرقم (مثال: 5000)" value={settings.whyUsMeta?.stat1_num || ''} onChange={e => update('whyUsMeta', 'stat1_num', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-amber-500" />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="النص (عربي)" value={settings.whyUsMeta?.stat1_text_ar || ''} onChange={e => update('whyUsMeta', 'stat1_text_ar', e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 outline-none text-sm" />
                  <input placeholder="Text (English)" value={settings.whyUsMeta?.stat1_text_en || ''} onChange={e => update('whyUsMeta', 'stat1_text_en', e.target.value)} dir="ltr" className="border border-slate-200 rounded-lg px-3 py-2 outline-none text-sm" />
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                <p className="text-xs font-bold text-slate-500 mb-2">الإحصائية الثانية</p>
                <input type="number" placeholder="الرقم (مثال: 15)" value={settings.whyUsMeta?.stat2_num || ''} onChange={e => update('whyUsMeta', 'stat2_num', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-amber-500" />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="النص (عربي)" value={settings.whyUsMeta?.stat2_text_ar || ''} onChange={e => update('whyUsMeta', 'stat2_text_ar', e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 outline-none text-sm" />
                  <input placeholder="Text (English)" value={settings.whyUsMeta?.stat2_text_en || ''} onChange={e => update('whyUsMeta', 'stat2_text_en', e.target.value)} dir="ltr" className="border border-slate-200 rounded-lg px-3 py-2 outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-6">
            <button onClick={() => saveSection('whyUsMeta')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ القسم
            </button>
            {saved === 'whyUsMeta' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح</span>}
          </div>
        </div>

        {/* Home Content Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">نصوص الصفحة الرئيسية (المميزات والخطوات)</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-slate-800 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">لماذا تختارنا ؟ (4 ميزات)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl space-y-3 relative">
                    <span className="absolute top-2 left-2 bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded font-bold">{i + 1}</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={settings.content?.whyUs?.[i]?.icon || 'ThumbsUp'}
                            onChange={e => {
                              const arr = [...(settings.content?.whyUs || [{},{},{},{}])];
                              arr[i] = { ...arr[i], icon: e.target.value };
                              update('content', 'whyUs', arr);
                            }}
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 bg-white"
                          >
                            <option value="">-- اختر الأيقونة --</option>
                             {Object.keys(availableIcons).map(iconName => (
                              <option key={iconName} value={iconName}>{iconName}</option>
                            ))}
                          </select>
                          <div className="w-9 h-9 flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                            {(() => {
                              const Ico = getIcon(settings.content?.whyUs?.[i]?.icon, availableIcons.ThumbsUp);
                              return <Ico className="w-5 h-5 text-amber-500" />;
                            })()}
                          </div>
                        </div>
                        <input 
                          placeholder="العنوان (عربي)" 
                          value={settings.content?.whyUs?.[i]?.title_ar || ''} 
                          onChange={e => {
                            const arr = [...(settings.content?.whyUs || [{},{},{},{}])];
                            arr[i] = { ...arr[i], title_ar: e.target.value };
                            update('content', 'whyUs', arr);
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500" 
                        />
                        <textarea 
                          placeholder="الوصف (عربي)" 
                          value={settings.content?.whyUs?.[i]?.desc_ar || ''} 
                          onChange={e => {
                            const arr = [...(settings.content?.whyUs || [{},{},{},{}])];
                            arr[i] = { ...arr[i], desc_ar: e.target.value };
                            update('content', 'whyUs', arr);
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 h-20" 
                        />
                      </div>
                      <div className="space-y-3">
                        <input 
                          placeholder="Title (English)" dir="ltr"
                          value={settings.content?.whyUs?.[i]?.title_en || ''} 
                          onChange={e => {
                            const arr = [...(settings.content?.whyUs || [{},{},{},{}])];
                            arr[i] = { ...arr[i], title_en: e.target.value };
                            update('content', 'whyUs', arr);
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500" 
                        />
                        <textarea 
                          placeholder="Description (English)" dir="ltr"
                          value={settings.content?.whyUs?.[i]?.desc_en || ''} 
                          onChange={e => {
                            const arr = [...(settings.content?.whyUs || [{},{},{},{}])];
                            arr[i] = { ...arr[i], desc_en: e.target.value };
                            update('content', 'whyUs', arr);
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 h-20" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">كيف نعمل ؟ (4 خطوات)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl space-y-3 relative">
                    <span className="absolute top-2 left-2 bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded font-bold z-10">{i + 1}</span>
                    <div className="mb-3">
                      {settings.content?.howItWorks?.[i]?.image ? (
                        <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 relative group">
                          <img src={settings.content?.howItWorks?.[i]?.image?.startsWith('/') ? settings.content.howItWorks[i].image : settings.content?.howItWorks?.[i]?.image} alt="Step output" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <label className="cursor-pointer text-white text-xs font-bold bg-amber-500 px-3 py-1 rounded-lg">
                              تغيير الصورة
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUploadHowItWorksImage(i, e)} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
                          <label className="cursor-pointer text-slate-500 text-xs font-bold flex gap-2 items-center hover:text-amber-500">
                            <ImageIcon className="w-4 h-4" /> إضافة صورة للخطوة
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUploadHowItWorksImage(i, e)} />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={settings.content?.howItWorks?.[i]?.icon || 'CheckCircle2'}
                            onChange={e => {
                              const arr = [...(settings.content?.howItWorks || [{},{},{},{}])];
                              arr[i] = { ...arr[i], icon: e.target.value };
                              update('content', 'howItWorks', arr);
                            }}
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 bg-white"
                          >
                            <option value="">-- اختر الأيقونة --</option>
                            {Object.keys(availableIcons).map(iconName => (
                              <option key={iconName} value={iconName}>{iconName}</option>
                            ))}
                          </select>
                          <div className="w-9 h-9 flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                            {(() => {
                              const Ico = getIcon(settings.content?.howItWorks?.[i]?.icon, availableIcons.CheckCircle2);
                              return <Ico className="w-5 h-5 text-amber-500" />;
                            })()}
                          </div>
                        </div>
                        <input 
                          placeholder="العنوان (عربي)" 
                          value={settings.content?.howItWorks?.[i]?.title_ar || ''} 
                          onChange={e => {
                            const arr = [...(settings.content?.howItWorks || [{},{},{},{}])];
                            arr[i] = { ...arr[i], title_ar: e.target.value };
                            update('content', 'howItWorks', arr);
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500" 
                        />
                        <textarea 
                          placeholder="الوصف (عربي)" 
                          value={settings.content?.howItWorks?.[i]?.desc_ar || ''} 
                          onChange={e => {
                            const arr = [...(settings.content?.howItWorks || [{},{},{},{}])];
                            arr[i] = { ...arr[i], desc_ar: e.target.value };
                            update('content', 'howItWorks', arr);
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 h-20" 
                        />
                      </div>
                      <div className="space-y-3">
                        <input 
                          placeholder="Title (English)" dir="ltr"
                          value={settings.content?.howItWorks?.[i]?.title_en || ''} 
                          onChange={e => {
                            const arr = [...(settings.content?.howItWorks || [{},{},{},{}])];
                            arr[i] = { ...arr[i], title_en: e.target.value };
                            update('content', 'howItWorks', arr);
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500" 
                        />
                        <textarea 
                          placeholder="Description (English)" dir="ltr"
                          value={settings.content?.howItWorks?.[i]?.desc_en || ''} 
                          onChange={e => {
                            const arr = [...(settings.content?.howItWorks || [{},{},{},{}])];
                            arr[i] = { ...arr[i], desc_en: e.target.value };
                            update('content', 'howItWorks', arr);
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 h-20" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => saveSection('content')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ المحتوى
            </button>
            {saved === 'content' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ</span>}
          </div>
        </div>

        {/* CTA Meta Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Megaphone className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">قسم الدعوة للحجز (آخر الصفحة)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">النصوص (عربي)</h3>
              <input 
                placeholder="العنوان الرئيسي للمربع البرتقالي" 
                value={settings.ctaMeta?.title_ar || ''} 
                onChange={e => update('ctaMeta', 'title_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
              <textarea 
                placeholder="الوصف الفرعي للمربع البرتقالي" 
                value={settings.ctaMeta?.desc_ar || ''} 
                onChange={e => update('ctaMeta', 'desc_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-24" 
              />
              <input 
                placeholder="نص زر الحجز (اختياري)" 
                value={settings.ctaMeta?.btn1_ar || ''} 
                onChange={e => update('ctaMeta', 'btn1_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
              <input 
                placeholder="نص زر الواتساب (اختياري)" 
                value={settings.ctaMeta?.btn2_ar || ''} 
                onChange={e => update('ctaMeta', 'btn2_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">Texts (English)</h3>
              <input 
                placeholder="Main Title" dir="ltr"
                value={settings.ctaMeta?.title_en || ''} 
                onChange={e => update('ctaMeta', 'title_en', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
              <textarea 
                placeholder="Subtitle Description" dir="ltr"
                value={settings.ctaMeta?.desc_en || ''} 
                onChange={e => update('ctaMeta', 'desc_en', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-24" 
              />
              <input 
                placeholder="Book Button Text (Optional)" dir="ltr"
                value={settings.ctaMeta?.btn1_en || ''} 
                onChange={e => update('ctaMeta', 'btn1_en', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
              <input 
                placeholder="WhatsApp Button Text (Optional)" dir="ltr"
                value={settings.ctaMeta?.btn2_en || ''} 
                onChange={e => update('ctaMeta', 'btn2_en', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => saveSection('ctaMeta')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ القسم
            </button>
            {saved === 'ctaMeta' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح</span>}
          </div>
        </div>

        {/* Services Page Meta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">إعدادات صفحة الخدمات</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">رأس الصفحة (عربي)</h3>
              <input 
                placeholder="العنوان الرئيسي لصفحة الخدمات" 
                value={settings.servicesMeta?.title_ar || ''} 
                onChange={e => update('servicesMeta', 'title_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
              <textarea 
                placeholder="وصف صفحة الخدمات" 
                value={settings.servicesMeta?.desc_ar || ''} 
                onChange={e => update('servicesMeta', 'desc_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-24" 
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">Page Header (English)</h3>
              <input 
                placeholder="Services Page Main Title" dir="ltr"
                value={settings.servicesMeta?.title_en || ''} 
                onChange={e => update('servicesMeta', 'title_en', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
              <textarea 
                placeholder="Services Page Description" dir="ltr"
                value={settings.servicesMeta?.desc_en || ''} 
                onChange={e => update('servicesMeta', 'desc_en', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-24" 
              />
            </div>

            <div className="md:col-span-2 pt-6 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Megaphone className="w-4 h-4 text-amber-500" /> قسم الدعوة للحجز في صفحة الخدمات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input 
                    placeholder="عنوان الدعوة للحجز (عربي)" 
                    value={settings.servicesMeta?.cta_title_ar || ''} 
                    onChange={e => update('servicesMeta', 'cta_title_ar', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
                  />
                  <textarea 
                    placeholder="وصف الدعوة للحجز (عربي)" 
                    value={settings.servicesMeta?.cta_desc_ar || ''} 
                    onChange={e => update('servicesMeta', 'cta_desc_ar', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-20" 
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="نص الزر 1" value={settings.servicesMeta?.cta_btn1_ar || ''} onChange={e => update('servicesMeta', 'cta_btn1_ar', e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                    <input placeholder="نص الزر 2" value={settings.servicesMeta?.cta_btn2_ar || ''} onChange={e => update('servicesMeta', 'cta_btn2_ar', e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="space-y-4">
                  <input 
                    placeholder="CTA Title (English)" dir="ltr"
                    value={settings.servicesMeta?.cta_title_en || ''} 
                    onChange={e => update('servicesMeta', 'cta_title_en', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
                  />
                  <textarea 
                    placeholder="CTA Description (English)" dir="ltr"
                    value={settings.servicesMeta?.cta_desc_en || ''} 
                    onChange={e => update('servicesMeta', 'cta_desc_en', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-20" 
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Btn 1 Text" dir="ltr" value={settings.servicesMeta?.cta_btn1_en || ''} onChange={e => update('servicesMeta', 'cta_btn1_en', e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                    <input placeholder="Btn 2 Text" dir="ltr" value={settings.servicesMeta?.cta_btn2_en || ''} onChange={e => update('servicesMeta', 'cta_btn2_en', e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => saveSection('servicesMeta')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ قسم الخدمات
            </button>
            {saved === 'servicesMeta' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح</span>}
          </div>
        </div>

        {/* Gallery Page Meta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">إعدادات صفحة معرض الأعمال</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">رأس الصفحة (عربي)</h3>
              <input 
                placeholder="العنوان الرئيسي لصفحة المعرض" 
                value={settings.galleryMeta?.title_ar || ''} 
                onChange={e => update('galleryMeta', 'title_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
              <textarea 
                placeholder="وصف صفحة المعرض" 
                value={settings.galleryMeta?.desc_ar || ''} 
                onChange={e => update('galleryMeta', 'desc_ar', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-24" 
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">Page Header (English)</h3>
              <input 
                placeholder="Gallery Page Main Title" dir="ltr"
                value={settings.galleryMeta?.title_en || ''} 
                onChange={e => update('galleryMeta', 'title_en', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" 
              />
              <textarea 
                placeholder="Gallery Page Description" dir="ltr"
                value={settings.galleryMeta?.desc_en || ''} 
                onChange={e => update('galleryMeta', 'desc_en', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-24" 
              />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => saveSection('galleryMeta')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ قسم المعرض
            </button>
            {saved === 'galleryMeta' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح</span>}
          </div>
        </div>

        {/* About Page Meta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">إعدادات صفحة من نحن</h2>
          </div>
          
          <div className="space-y-8">
            {/* Main Header */}
            <div>
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 text-amber-600">صور الخلفية والقصة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">صورة الافتتاحية (Hero)</label>
                  <div className="flex gap-3">
                    <input value={settings.aboutMeta?.hero_image || ''} onChange={e => update('aboutMeta', 'hero_image', e.target.value)} dir="ltr"
                      className="flex-1 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" placeholder="URL" />
                    <label className="flex items-center justify-center px-4 py-3 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors font-bold text-sm text-slate-600">
                      رفع <input type="file" accept="image/*" onChange={async (e) => {
                        if (!e.target.files) return;
                        try { const res = await api.upload(e.target.files[0]); update('aboutMeta', 'hero_image', res.url); } catch(err){}
                      }} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">صورة جانبية (قصتنا)</label>
                  <div className="flex gap-3">
                    <input value={settings.aboutMeta?.story_image || ''} onChange={e => update('aboutMeta', 'story_image', e.target.value)} dir="ltr"
                      className="flex-1 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" placeholder="URL" />
                    <label className="flex items-center justify-center px-4 py-3 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors font-bold text-sm text-slate-600">
                      رفع <input type="file" accept="image/*" onChange={async (e) => {
                        if (!e.target.files) return;
                        try { const res = await api.upload(e.target.files[0]); update('aboutMeta', 'story_image', res.url); } catch(err){}
                      }} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 text-amber-600">العنوان الرئيسي والوصف</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="العنوان (عربي)" value={settings.aboutMeta?.title_ar || ''} onChange={e => update('aboutMeta', 'title_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" />
                <input placeholder="Title (EN)" dir="ltr" value={settings.aboutMeta?.title_en || ''} onChange={e => update('aboutMeta', 'title_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" />
                <textarea placeholder="الوصف (عربي)" value={settings.aboutMeta?.subtitle_ar || ''} onChange={e => update('aboutMeta', 'subtitle_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-20" />
                <textarea placeholder="Subtitle (EN)" dir="ltr" value={settings.aboutMeta?.subtitle_en || ''} onChange={e => update('aboutMeta', 'subtitle_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-20" />
              </div>
            </div>

            {/* Our Story */}
            <div>
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 text-amber-600">فقرة: قصتنا</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="عنوان القصة (عربي)" value={settings.aboutMeta?.story_title_ar || ''} onChange={e => update('aboutMeta', 'story_title_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" />
                <input placeholder="Story Title (EN)" dir="ltr" value={settings.aboutMeta?.story_title_en || ''} onChange={e => update('aboutMeta', 'story_title_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" />
                
                <textarea placeholder="الفقرة 1 (عربي)" value={settings.aboutMeta?.story_p1_ar || ''} onChange={e => update('aboutMeta', 'story_p1_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="Paragraph 1 (EN)" dir="ltr" value={settings.aboutMeta?.story_p1_en || ''} onChange={e => update('aboutMeta', 'story_p1_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                
                <textarea placeholder="الفقرة 2 (عربي)" value={settings.aboutMeta?.story_p2_ar || ''} onChange={e => update('aboutMeta', 'story_p2_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="Paragraph 2 (EN)" dir="ltr" value={settings.aboutMeta?.story_p2_en || ''} onChange={e => update('aboutMeta', 'story_p2_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                
                <textarea placeholder="الفقرة 3 (عربي)" value={settings.aboutMeta?.story_p3_ar || ''} onChange={e => update('aboutMeta', 'story_p3_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="Paragraph 3 (EN)" dir="ltr" value={settings.aboutMeta?.story_p3_en || ''} onChange={e => update('aboutMeta', 'story_p3_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
              </div>
            </div>

            {/* Vision & Mission */}
            <div>
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 text-amber-600">الرؤية والرسالة والقيم</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="عنوان الرؤية (عربي)" value={settings.aboutMeta?.vision_title_ar || ''} onChange={e => update('aboutMeta', 'vision_title_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <input placeholder="Vision Title (EN)" dir="ltr" value={settings.aboutMeta?.vision_title_en || ''} onChange={e => update('aboutMeta', 'vision_title_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="وصف الرؤية (عربي)" value={settings.aboutMeta?.vision_desc_ar || ''} onChange={e => update('aboutMeta', 'vision_desc_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="Vision Desc (EN)" dir="ltr" value={settings.aboutMeta?.vision_desc_en || ''} onChange={e => update('aboutMeta', 'vision_desc_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                
                <input placeholder="عنوان الرسالة (عربي)" value={settings.aboutMeta?.mission_title_ar || ''} onChange={e => update('aboutMeta', 'mission_title_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <input placeholder="Mission Title (EN)" dir="ltr" value={settings.aboutMeta?.mission_title_en || ''} onChange={e => update('aboutMeta', 'mission_title_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="وصف الرسالة (عربي)" value={settings.aboutMeta?.mission_desc_ar || ''} onChange={e => update('aboutMeta', 'mission_desc_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="Mission Desc (EN)" dir="ltr" value={settings.aboutMeta?.mission_desc_en || ''} onChange={e => update('aboutMeta', 'mission_desc_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />

                <input placeholder="عنوان القيم (عربي)" value={settings.aboutMeta?.values_title_ar || ''} onChange={e => update('aboutMeta', 'values_title_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <input placeholder="Values Title (EN)" dir="ltr" value={settings.aboutMeta?.values_title_en || ''} onChange={e => update('aboutMeta', 'values_title_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="وصف القيم (عربي)" value={settings.aboutMeta?.values_desc_ar || ''} onChange={e => update('aboutMeta', 'values_desc_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="Values Desc (EN)" dir="ltr" value={settings.aboutMeta?.values_desc_en || ''} onChange={e => update('aboutMeta', 'values_desc_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
              </div>
            </div>

            {/* Stats */}
            <div>
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 text-amber-600">أرقام وإحصائيات</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">سنوات الخبرة</label>
                  <input type="number" value={settings.aboutMeta?.stat_years || ''} onChange={e => update('aboutMeta', 'stat_years', parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500 text-center font-bold text-xl" />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">عمليات ناجحة</label>
                  <input type="number" value={settings.aboutMeta?.stat_success || ''} onChange={e => update('aboutMeta', 'stat_success', parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500 text-center font-bold text-xl" />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">شاحنات</label>
                  <input type="number" value={settings.aboutMeta?.stat_trucks || ''} onChange={e => update('aboutMeta', 'stat_trucks', parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500 text-center font-bold text-xl" />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">جودة (%)</label>
                  <input type="number" value={settings.aboutMeta?.stat_quality || ''} onChange={e => update('aboutMeta', 'stat_quality', parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500 text-center font-bold text-xl" />
                </div>
              </div>

            </div>

          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => saveSection('aboutMeta')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ قسم من نحن
            </button>
            {saved === 'aboutMeta' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح</span>}
          </div>
        </div>

        {/* Contact Page Meta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">إعدادات صفحة اتصل بنا</h2>
          </div>
          
          <div className="space-y-8">
            {/* Main Header */}
            <div>
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 text-amber-600">العنوان الرئيسي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="العنوان (عربي)" value={settings.contactMeta?.title_ar || ''} onChange={e => update('contactMeta', 'title_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" />
                <input placeholder="Title (EN)" dir="ltr" value={settings.contactMeta?.title_en || ''} onChange={e => update('contactMeta', 'title_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" />
                <textarea placeholder="الوصف (عربي)" value={settings.contactMeta?.desc_ar || ''} onChange={e => update('contactMeta', 'desc_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-20" />
                <textarea placeholder="Description (EN)" dir="ltr" value={settings.contactMeta?.desc_en || ''} onChange={e => update('contactMeta', 'desc_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500 h-20" />
              </div>
            </div>

            {/* Contact Info Widget Texts */}
            <div>
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 text-amber-600">نصوص معلومات التواصل</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="عنوان القسم (عربي)" value={settings.contactMeta?.info_title_ar || ''} onChange={e => update('contactMeta', 'info_title_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <input placeholder="Section Title (EN)" dir="ltr" value={settings.contactMeta?.info_title_en || ''} onChange={e => update('contactMeta', 'info_title_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                
                <textarea placeholder="نص العنوان / المقر (عربي)" value={settings.contactMeta?.info_hqText_ar || ''} onChange={e => update('contactMeta', 'info_hqText_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="HQ Text (EN)" dir="ltr" value={settings.contactMeta?.info_hqText_en || ''} onChange={e => update('contactMeta', 'info_hqText_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                
                <textarea placeholder="نص ساعات العمل (عربي)" value={settings.contactMeta?.info_hoursText_ar || ''} onChange={e => update('contactMeta', 'info_hoursText_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="Hours Text (EN)" dir="ltr" value={settings.contactMeta?.info_hoursText_en || ''} onChange={e => update('contactMeta', 'info_hoursText_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                
                <textarea placeholder="نص رسالة الواتس آب الجانبية (عربي)" value={settings.contactMeta?.waText_ar || ''} onChange={e => update('contactMeta', 'waText_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="WhatsApp Text (EN)" dir="ltr" value={settings.contactMeta?.waText_en || ''} onChange={e => update('contactMeta', 'waText_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
              </div>
            </div>

            {/* Form Texts */}
            <div>
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 text-amber-600">نصوص نموذج الحجز (الفورم)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="عنوان الفورم (عربي)" value={settings.contactMeta?.form_title_ar || ''} onChange={e => update('contactMeta', 'form_title_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <input placeholder="Form Title (EN)" dir="ltr" value={settings.contactMeta?.form_title_en || ''} onChange={e => update('contactMeta', 'form_title_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="وصف الفورم (عربي)" value={settings.contactMeta?.form_desc_ar || ''} onChange={e => update('contactMeta', 'form_desc_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="Form Desc (EN)" dir="ltr" value={settings.contactMeta?.form_desc_en || ''} onChange={e => update('contactMeta', 'form_desc_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                
                <input placeholder="عنوان رسالة النجاح (عربي)" value={settings.contactMeta?.form_successTitle_ar || ''} onChange={e => update('contactMeta', 'form_successTitle_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <input placeholder="Success Title (EN)" dir="ltr" value={settings.contactMeta?.form_successTitle_en || ''} onChange={e => update('contactMeta', 'form_successTitle_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="وصف رسالة النجاح (عربي)" value={settings.contactMeta?.form_successDesc_ar || ''} onChange={e => update('contactMeta', 'form_successDesc_ar', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
                <textarea placeholder="Success Desc (EN)" dir="ltr" value={settings.contactMeta?.form_successDesc_en || ''} onChange={e => update('contactMeta', 'form_successDesc_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" />
              </div>
            </div>

          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => saveSection('contactMeta')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ قسم اتصل بنا
            </button>
            {saved === 'contactMeta' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح</span>}
          </div>
        </div>

        {/* Cities Setup */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">إدارة مدن النقل (من وإلى)</h2>
          </div>
          
          <div className="space-y-4">
            {(settings.citiesMeta?.list || []).map((city: { ar: string, en: string }, index: number) => (
              <div key={index} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input 
                  placeholder="اسم المدينة (عربي)" 
                  value={city.ar} 
                  onChange={(e) => {
                    const newList = [...(settings.citiesMeta?.list || [])];
                    newList[index] = { ...newList[index], ar: e.target.value };
                    update('citiesMeta', 'list', newList);
                  }} 
                  className="flex-1 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" 
                />
                <input 
                  placeholder="City Name (EN)" 
                  dir="ltr"
                  value={city.en} 
                  onChange={(e) => {
                    const newList = [...(settings.citiesMeta?.list || [])];
                    newList[index] = { ...newList[index], en: e.target.value };
                    update('citiesMeta', 'list', newList);
                  }} 
                  className="flex-1 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" 
                />
                <button 
                  onClick={() => {
                    const newList = [...(settings.citiesMeta?.list || [])].filter((_, i) => i !== index);
                    update('citiesMeta', 'list', newList);
                  }} 
                  className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button 
              onClick={() => {
                const newList = [...(settings.citiesMeta?.list || []), { ar: '', en: '' }];
                update('citiesMeta', 'list', newList);
              }}
              className="flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-lg"
            >
              <Plus className="w-5 h-5" /> إضافة مدينة جديدة
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => saveSection('citiesMeta')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ المدن
            </button>
            {saved === 'citiesMeta' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح</span>}
          </div>
        </div>
        {/* Footer Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <LayoutDashboard className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">إعدادات الفوتر (تذييل الموقع)</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">نص "من نحن" في الفوتر الملاصق للشعار</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">عربي (AR)</label>
                  <textarea value={settings.footerMeta?.about_ar || ''} onChange={e => update('footerMeta', 'about_ar', e.target.value)} rows={3}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm" placeholder="الشركة الرائدة في خدمات النقل..."></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">إنجليزي (EN)</label>
                  <textarea value={settings.footerMeta?.about_en || ''} onChange={e => update('footerMeta', 'about_en', e.target.value)} rows={3} dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm" placeholder="The leading company..."></textarea>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">قائمة (مناطـق الخدمـة) في الفوتر</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">عربي (AR) - كل مدينة في سطر منفصل</label>
                  <textarea value={settings.footerMeta?.areas_ar || ''} onChange={e => update('footerMeta', 'areas_ar', e.target.value)} rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm" placeholder="أبها&#10;خميس مشيط"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">إنجليزي (EN) - Line per city</label>
                  <textarea value={settings.footerMeta?.areas_en || ''} onChange={e => update('footerMeta', 'areas_en', e.target.value)} rows={4} dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm" placeholder="Abha&#10;Khamis Mushait"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">نص (حقوق الطبع والنشر Copyrights)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">عربي (AR)</label>
                  <input type="text" value={settings.footerMeta?.copyright_ar || ''} onChange={e => update('footerMeta', 'copyright_ar', e.target.value)} 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm" placeholder="حقوق النشر © ..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">إنجليزي (EN)</label>
                  <input type="text" value={settings.footerMeta?.copyright_en || ''} onChange={e => update('footerMeta', 'copyright_en', e.target.value)} dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-sm" placeholder="Copyright © ..." />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => saveSection('footerMeta')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ الفوتر
            </button>
            {saved === 'footerMeta' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح</span>}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">إشعارات الطلبات الجديدة</h2>
          </div>
          <div className="space-y-6">
            {/* Email */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input type="checkbox" checked={settings.notifications?.email_enabled} onChange={e => update('notifications', 'email_enabled', e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded" />
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-slate-700">إشعار عبر البريد الإلكتروني</span>
              </label>
              {settings.notifications?.email_enabled && (
                <input value={settings.notifications?.email_to || ''} onChange={e => update('notifications', 'email_to', e.target.value)} dir="ltr"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 bg-white" placeholder="admin@example.com" />
              )}
            </div>

            {/* WhatsApp */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input type="checkbox" checked={settings.notifications?.whatsapp_enabled} onChange={e => update('notifications', 'whatsapp_enabled', e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded" />
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span className="font-bold text-slate-700">إشعار عبر الواتساب</span>
              </label>
              {settings.notifications?.whatsapp_enabled && (
                <input value={settings.notifications?.whatsapp_to || ''} onChange={e => update('notifications', 'whatsapp_to', e.target.value)} dir="ltr"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 bg-white" placeholder="966502375887" />
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => saveSection('notifications')} disabled={saving}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm">
              <Save className="w-4 h-4" /> حفظ
            </button>
            {saved === 'notifications' && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم الحفظ</span>}
          </div>
        </div>

        {/* Backups — Enhanced */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">النسخ الاحتياطي واستعادة الموقع</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">نسخة شاملة تضم قاعدة البيانات بالكامل + جميع الصور والوسائط المرفوعة.</p>

          {/* Backup Info Bar */}
          {backupInfo && (
            <div className="bg-gradient-to-l from-amber-50 to-slate-50 border border-amber-200/60 rounded-xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {Object.entries(backupInfo.tables || {}).map(([t, c]: [string, any]) => (
                <div key={t}>
                  <div className="text-lg font-black text-slate-800">{c}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{t}</div>
                </div>
              ))}
              <div className="col-span-2 md:col-span-4 border-t border-amber-200/50 pt-3 mt-1 flex items-center justify-center gap-6 text-xs text-slate-500">
                <span>📁 الصور: <b className="text-slate-800">{backupInfo.uploads?.count || 0}</b> ملف</span>
                <span>💾 الحجم: <b className="text-slate-800">{backupInfo.uploads?.sizeMB || 0} MB</b></span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Download Backup */}
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col items-start gap-3">
              <div>
                <h3 className="font-bold text-slate-800 mb-1 text-sm">📦 تحميل نسخة احتياطية</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">تحميل ملف ZIP يحتوي على كامل بيانات الموقع والصور.</p>
              </div>
              <button onClick={handleDownloadBackup} disabled={backupProgress === 'downloading'}
                className="flex items-center gap-2 bg-slate-900 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 text-sm mt-auto disabled:opacity-60 disabled:cursor-wait w-full justify-center">
                {backupProgress === 'downloading' ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> جاري التحضير...</>
                ) : (
                  <><Download className="w-4 h-4" /> تحميل النسخة (ZIP)</>
                )}
              </button>
            </div>

            {/* Upload to Google Drive */}
            <div className="p-5 border border-blue-200 rounded-xl bg-blue-50/40 flex flex-col items-start gap-3">
              <div>
                <h3 className="font-bold text-blue-800 mb-1 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 19.5H8L12 12.5L16 19.5H22L12 2Z" fill="#4285F4"/><path d="M8 19.5H16L12 12.5L8 19.5Z" fill="#FBBC05"/><path d="M2 19.5H8L12 12.5L6 6L2 19.5Z" fill="#34A853"/><path d="M12 12.5L16 19.5H22L16 6L12 12.5Z" fill="#EA4335"/></svg>
                  رفع إلى Google Drive
                </h3>
                <p className="text-[11px] text-blue-600/70 leading-relaxed">إنشاء نسخة وإرسالها مباشرة إلى حسابك في Google Drive.</p>
              </div>
              <button onClick={handleUploadToDrive} disabled={backupProgress === 'drive'}
                className="flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm mt-auto disabled:opacity-60 disabled:cursor-wait w-full justify-center">
                {backupProgress === 'drive' ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> جاري الرفع...</>
                ) : (
                  <><Upload className="w-4 h-4" /> رفع نسخة إلى Drive</>
                )}
              </button>
              {driveResult && (
                <div className="text-xs mt-1 w-full">
                  {driveResult.success ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-green-700">
                      ✅ تم الرفع بنجاح!
                      {driveResult.link && <a href={driveResult.link} target="_blank" rel="noreferrer" className="block underline text-blue-600 mt-1 font-bold">فتح في Google Drive ↗</a>}
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-600">❌ {driveResult.error}</div>
                  )}
                </div>
              )}
            </div>

            {/* Restore */}
            <div className="p-5 border border-red-100 rounded-xl bg-red-50/50 flex flex-col items-start gap-3">
              <div>
                <h3 className="font-bold text-red-800 mb-1 text-sm">⚠️ استعادة موقع كامل</h3>
                <p className="text-[11px] text-red-500/80 leading-relaxed">سيتم مسح بيانات الموقع الحالية وإحلال بيانات النسخة مكانها نهائياً.</p>
              </div>
              <label className={`flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-red-700 text-sm mt-auto cursor-pointer w-full justify-center ${backupProgress === 'restoring' ? 'opacity-60 cursor-wait' : ''}`}>
                {backupProgress === 'restoring' ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> جاري الاستعادة...</>
                ) : (
                  <><Upload className="w-4 h-4" /> رفع النسخة المضغوطة ZIP</>
                )}
                <input type="file" accept=".zip" onChange={handleRestoreBackup} className="hidden" disabled={backupProgress === 'restoring'} />
              </label>
              {saved === 'backup' && <span className="text-green-600 text-xs font-bold mt-1">✅ تم الاسترداد بنجاح! جاري إعادة التحميل...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

