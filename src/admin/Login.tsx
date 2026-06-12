import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Lock, User, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { login } = useAuth();
  const { i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/settings` )
      .then(res => res.json())
      .then(data => {
        if (data.general) setSettings(data.general);
      })
      .catch(console.error);
  }, []);

  const currentLang = i18n.language;
  let loginLogoRaw = currentLang === 'en' ? settings?.logo_login_en : settings?.logo_login_ar;
  if (!loginLogoRaw) loginLogoRaw = settings?.logo;
  const logoUrl = loginLogoRaw ? (loginLogoRaw.startsWith('/') ? loginLogoRaw : loginLogoRaw) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4" dir="rtl">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/30 overflow-hidden p-2">
              <img src={logoUrl || "/logo.png"} alt="Logo" className={logoUrl ? "w-full h-full object-contain bg-white rounded-2xl" : "w-14 h-14 object-contain"} onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }} />
            </div>
            <h1 className="text-2xl font-black text-white">لوحة تحكم ركن الريان</h1>
            <p className="text-slate-400 text-sm mt-1">سجّل دخولك للوصول إلى لوحة الإدارة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-12 py-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-12 py-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-l from-amber-500 to-amber-600 text-slate-900 font-bold text-lg py-4 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © ركن الريان للنقل المبرد — لوحة الإدارة
        </p>
      </div>
    </div>
  );
}
