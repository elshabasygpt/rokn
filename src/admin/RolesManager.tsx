import React, { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { useAuth } from './context/AuthContext';
import { Shield, Plus, Trash2, Edit2, CheckCircle2, User, Key, KeyRound, Save } from 'lucide-react';

const availablePermissions = [
  { id: 'all', label: 'التحكم الكامل (Super Admin)' },
  { id: 'manage_services', label: 'إدارة الخدمات (Services)' },
  { id: 'manage_gallery', label: 'إدارة الصور (Gallery)' },
  { id: 'manage_articles', label: 'إدارة المدونة (Articles)' },
  { id: 'manage_settings', label: 'إدارة الإعدادات والفوتر' },
  { id: 'manage_faqs', label: 'إدارة الأسئلة الشائعة' },
  { id: 'manage_partners', label: 'إدارة شركاء النجاح' },
];

export default function RolesManager() {
  const api = useApi();
  const { admin } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ username: '', password: '', permissions: [] as string[] });

  // For adding new admin
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await api.get('/api/auth/admins');
      setAdmins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/admins', editForm);
      setEditForm({ username: '', password: '', permissions: [] });
      setShowAdd(false);
      loadAdmins();
    } catch (err: any) {
      alert(err.message || 'فشل في حفظ البيانات');
    }
  };

  const handleSaveEdit = async (id: number) => {
    try {
      if (!window.confirm('تأكيد تحديث الصلاحيات؟')) return;
      const body: any = { permissions: editForm.permissions };
      if (editForm.password) body.password = editForm.password;
      await api.put(`/api/auth/admins/${id}`, body);
      setIsEditing(null);
      loadAdmins();
    } catch (err: any) {
      alert('فشل التحديث');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف الحساب الإداري نهائياً؟')) return;
    try {
      await api.del(`/api/auth/admins/${id}`);
      loadAdmins();
    } catch (err: any) {
      alert('فشل في حذف الحساب. تأكد أنه ليس الحساب الرئيسي و أنك لست الحساب المحذوف.');
    }
  };

  const togglePermission = (permId: string) => {
    if (permId === 'all') {
      setEditForm({ ...editForm, permissions: editForm.permissions.includes('all') ? [] : ['all'] });
      return;
    }
    const current = editForm.permissions.filter(p => p !== 'all');
    if (current.includes(permId)) {
      setEditForm({ ...editForm, permissions: current.filter(p => p !== permId) });
    } else {
      setEditForm({ ...editForm, permissions: [...current, permId] });
    }
  };

  if (!admin?.permissions.includes('all')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Shield className="w-16 h-16 mb-4 text-slate-300" />
        <h2 className="text-xl font-bold">عذراً، ليس لديك صلاحية للوصول!</h2>
        <p>هذه الصفحة مخصصة لمدير النظام (Super Admin) فقط.</p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-500" />
            إدارة الصلاحيات والمستخدمين
          </h1>
          <p className="text-slate-500 text-sm">أضف حسابات فرعية للوحة التحكم وقم بتحديد مهامهم وصلاحياتهم.</p>
        </div>
        {!showAdd && (
          <button onClick={() => { setShowAdd(true); setEditForm({ username: '', password: '', permissions: [] }); setIsEditing(null); }}
            className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-4 py-2.5 rounded-xl hover:bg-amber-400">
            <Plus className="w-5 h-5" /> إضافة مستخدم
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleSaveAdd} className="bg-white rounded-2xl border border-amber-200 p-6 mb-8 shadow-sm">
          <h2 className="font-bold border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" /> إضافة مستخدم جديد
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">اسم المستخدم (Username)</label>
              <input required value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" dir="ltr" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">كلمة المرور (Password)</label>
              <input required value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500" dir="ltr" />
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
            <label className="text-sm font-bold text-slate-700 block mb-3">تحديد المهام والصلاحيات</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePermissions.map(p => (
                <label key={p.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-amber-300">
                  <input type="checkbox" className="w-5 h-5 accent-amber-500" 
                    checked={editForm.permissions.includes('all') ? true : editForm.permissions.includes(p.id)}
                    disabled={editForm.permissions.includes('all') && p.id !== 'all'}
                    onChange={() => togglePermission(p.id)} />
                  <span className={`${p.id === 'all' ? 'font-bold text-amber-700' : 'text-slate-700'} text-sm`}>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800">
              إنشاء الحساب
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="bg-slate-100 text-slate-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-200">
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Admins List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {admins.map(user => (
          <div key={user.id} className="border-b border-slate-100 last:border-0 p-6 flex flex-col items-start gap-4 hover:bg-slate-50 transition-colors">
            
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${user.permissions.includes('all') ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">{user.username}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {user.permissions.includes('all') ? (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded flex items-center gap-1 font-bold"><Shield className="w-3 h-3"/> مدير النظام</span>
                    ) : (
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">حساب مُخصص</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isEditing !== user.id && (
                  <button onClick={() => { setIsEditing(user.id); setEditForm({ username: user.username, password: '', permissions: user.permissions }); setShowAdd(false); }} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200" title="تعديل">
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(user.id)} disabled={user.id === 1 || user.id === admin?.id} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed" title="حذف">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editing State */}
            {isEditing === user.id && (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4">
                 <h4 className="font-bold text-sm text-slate-700 mb-4 border-b border-slate-200 pb-2">تحديث بيانات ({user.username})</h4>
                 <div className="mb-4">
                   <label className="text-xs font-bold text-slate-500 block mb-2">كلمة المرور الجديدة (اتركه فارغاً لعدم التغيير)</label>
                   <input type="text" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} dir="ltr"
                     className="w-full md:w-1/2 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500" placeholder="***" />
                 </div>
                 
                 <div className="mb-5">
                   <label className="text-xs font-bold text-slate-500 block mb-3">صلاحيات الحساب</label>
                   <div className="flex flex-wrap gap-3">
                     {availablePermissions.map(p => (
                        <label key={p.id} className={`flex w-full md:w-auto items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${editForm.permissions.includes(p.id) || editForm.permissions.includes('all') ? 'bg-amber-50 border-amber-500' : 'bg-white border-slate-200'}`}>
                          <input type="checkbox" className="hidden" 
                            checked={editForm.permissions.includes('all') ? true : editForm.permissions.includes(p.id)}
                            disabled={editForm.permissions.includes('all') && p.id !== 'all'}
                            onChange={() => togglePermission(p.id)} />
                          {editForm.permissions.includes('all') || editForm.permissions.includes(p.id) ? <CheckCircle2 className="w-4 h-4 text-amber-600" /> : <div className="w-4 h-4 rounded-full border border-slate-300" />}
                          <span className={`${p.id === 'all' ? 'font-bold' : ''} text-sm text-slate-700`}>{p.label}</span>
                        </label>
                      ))}
                   </div>
                 </div>

                 <div className="flex gap-3">
                   <button onClick={() => handleSaveEdit(user.id)} className="flex items-center gap-2 text-sm bg-slate-900 text-white font-bold px-4 py-2 rounded-lg hover:bg-slate-800">
                     <Save className="w-4 h-4" /> حفظ التغييرات
                   </button>
                   <button onClick={() => setIsEditing(null)} className="text-sm bg-white border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-lg hover:bg-slate-50">
                     إلغاء
                   </button>
                 </div>
              </div>
            )}
            
            {/* Display Readonly Permissions */}
            {isEditing !== user.id && (
              <div className="flex flex-wrap gap-2 px-2">
                {user.permissions.includes('all') ? (
                  <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full whitespace-nowrap">الكنترول الكامل لجميع الصفحات والميزات</span>
                ) : (
                  user.permissions.map((p: string) => {
                    const label = availablePermissions.find(ap => ap.id === p)?.label || p;
                    return <span key={p} className="text-xs text-slate-600 bg-white border border-slate-200 shadow-sm px-3 py-1 rounded-full whitespace-nowrap">{label}</span>
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
