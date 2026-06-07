import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Mail, MapPin, Building, Calendar, FileText, Send, Clock } from 'lucide-react';
import { useApi } from './useApi';

export default function LeadDetails({ lead, onClose, onUpdate, columns }: any) {
  const api = useApi();
  const [activities, setActivities] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Editable fields state
  const [companyName, setCompanyName] = useState(lead.company_name || '');
  const [leadValue, setLeadValue] = useState(lead.lead_value || '');
  const [industry, setIndustry] = useState(lead.industry || '');
  const [leadSource, setLeadSource] = useState(lead.lead_source || '');
  const [ownerId, setOwnerId] = useState(lead.owner_id || '');
  const [admins, setAdmins] = useState<any[]>([]);

  const [leadStatus, setLeadStatus] = useState(lead.status);

  useEffect(() => {
    loadActivities();
    loadAdmins();
  }, [lead.id]);

  const loadAdmins = async () => {
    try {
      const res = await api.get('/api/auth/admins');
      if (Array.isArray(res)) setAdmins(res);
    } catch (err) {
      console.error('Failed to load admins', err);
    }
  };

  const loadActivities = async () => {
    try {
      const res = await api.get(`/api/bookings/${lead.id}/activities`);
      setActivities(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await api.put(`/api/bookings/${lead.id}/status`, { status });
      setLeadStatus(status);
      onUpdate(); // refresh bookings list in background
      loadActivities(); // refresh activities to show the status change log
    } catch (err) {
      console.error(err);
    }
  };

  const saveLeadData = async () => {
    setUpdating(true);
    try {
      await api.put(`/api/bookings/${lead.id}`, {
        company_name: companyName,
        industry,
        lead_source: leadSource,
        lead_value: leadValue,
        owner_id: ownerId
      });
      loadActivities();
      onUpdate();
      alert('تم حفظ البيانات بنجاح');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await api.post(`/api/bookings/${lead.id}/activities`, {
        activity_type: 'note_added',
        description: newNote
      });
      setNewNote('');
      loadActivities();
    } catch (err) {
      console.error(err);
    }
  };

  const logCall = async () => {
    try {
      await api.post(`/api/bookings/${lead.id}/activities`, {
        activity_type: 'call_logged',
        description: 'تم إجراء مكالمة هاتفية مع العميل'
      });
      loadActivities();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-50 rounded-3xl w-full max-w-5xl h-[90vh] shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="font-black text-amber-600 text-lg">{lead.client_name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{lead.client_name}</h2>
              <p className="text-slate-500 text-sm">Lead #{lead.id} • {new Date(lead.created_at).toLocaleString('ar-SA')}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Visualizer */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {columns.map((col: any) => {
              const isActive = leadStatus === col.id;
              // hide legacy columns from the pipeline visualizer
              if (['in_progress', 'completed', 'cancelled'].includes(col.id)) return null;
              
              return (
                <button 
                  key={col.id} 
                  onClick={() => updateStatus(col.id)}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-sm font-bold transition-all text-center border-2 
                    ${isActive ? `${col.bg} ${col.text} ${col.border}` : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                >
                  {col.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Split Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Column: Lead Info */}
          <div className="w-full md:w-1/2 lg:w-[40%] bg-white border-l border-slate-200 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">معلومات العميل والشركة</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">الشركة (B2B)</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-sm focus:border-amber-500 outline-none" placeholder="اسم الشركة" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">القطاع (Industry)</label>
                  <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none" placeholder="مثال: أدوية" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">الجوال</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={lead.client_phone} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-sm text-slate-600 outline-none cursor-not-allowed" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">المصدر (Source)</label>
                  <input type="text" value={leadSource} onChange={e => setLeadSource(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none" placeholder="Google, Organic..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">قيمة الصفقة (SAR)</label>
                  <input type="number" value={leadValue} onChange={e => setLeadValue(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">تعيين إلى (Owner)</label>
                  <select value={ownerId} onChange={e => setOwnerId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none">
                    <option value="">-- غير معين --</option>
                    {admins.map(admin => (
                      <option key={admin.id} value={admin.id}>{admin.username}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={saveLeadData} disabled={updating} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2 rounded-lg transition-colors text-sm">
                {updating ? 'جاري الحفظ...' : 'حفظ التحديثات'}
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">تفاصيل الطلب (Trip Info)</h3>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-slate-500">المسار</p>
                    <p className="font-bold text-sm text-slate-900">{lead.from_city} <span className="text-slate-400 mx-1">→</span> {lead.to_city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-slate-500">حجم الشاحنة (الغرف)</p>
                    <p className="font-bold text-sm text-slate-900">{lead.rooms || 'غير محدد'}</p>
                  </div>
                </div>
                {lead.notes && (
                  <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200 text-sm text-slate-700">
                    <span className="font-bold text-xs text-slate-400 block mb-1">ملاحظة العميل الأصلية:</span>
                    {lead.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Marketing Attribution */}
            {lead.marketing_attribution && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>التسويق والمصدر (Attribution)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Touch */}
                  {lead.marketing_attribution.first_touch && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">First Touch (كيف عرفنا)</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">المصدر:</span> <span className="font-bold text-slate-900">{lead.marketing_attribution.first_touch.source}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">الوسيط:</span> <span className="font-bold text-slate-900">{lead.marketing_attribution.first_touch.medium}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">الحملة:</span> <span className="font-bold text-slate-900">{lead.marketing_attribution.first_touch.campaign}</span></div>
                        <div className="flex flex-col mt-2 pt-2 border-t border-slate-200">
                          <span className="text-[10px] text-slate-400">صفحة الهبوط:</span>
                          <span className="text-xs font-medium text-slate-700 break-all" dir="ltr">{lead.marketing_attribution.first_touch.landing_page}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Last Touch */}
                  {lead.marketing_attribution.last_touch && (
                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                      <p className="text-xs font-bold text-indigo-400 mb-3 uppercase tracking-wider">Last Touch (كيف سجل)</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">المصدر:</span> <span className="font-bold text-slate-900">{lead.marketing_attribution.last_touch.source}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">الوسيط:</span> <span className="font-bold text-slate-900">{lead.marketing_attribution.last_touch.medium}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">الحملة:</span> <span className="font-bold text-slate-900">{lead.marketing_attribution.last_touch.campaign}</span></div>
                        <div className="flex flex-col mt-2 pt-2 border-t border-indigo-200/50">
                          <span className="text-[10px] text-indigo-400">صفحة الهبوط:</span>
                          <span className="text-xs font-medium text-slate-700 break-all" dir="ltr">{lead.marketing_attribution.last_touch.landing_page}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-4">
              <a href={`tel:${lead.client_phone}`} onClick={logCall} className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-bold">
                <Phone className="w-4 h-4" /> اتصال
              </a>
              <a href={`https://wa.me/${lead.client_phone.replace(/^0/, '966')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg hover:bg-[#20bd5a] transition-colors text-sm font-bold">
                <MessageCircle className="w-4 h-4" /> واتساب
              </a>
            </div>
          </div>

          {/* Right Column: Timeline Engine */}
          <div className="w-full md:w-1/2 lg:w-[60%] flex flex-col bg-slate-50/50">
            {/* Note Input */}
            <div className="p-6 bg-white border-b border-slate-200 shrink-0">
              <form onSubmit={addNote}>
                <div className="relative">
                  <textarea 
                    value={newNote} 
                    onChange={e => setNewNote(e.target.value)} 
                    placeholder="اكتب ملاحظاتك عن المكالمة أو حالة التفاوض هنا..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pr-12 resize-none h-24 focus:border-amber-500 outline-none text-sm"
                  ></textarea>
                  <button type="submit" disabled={!newNote.trim()} className="absolute top-4 right-4 text-amber-500 hover:text-amber-600 disabled:opacity-30 transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <button type="button" onClick={logCall} className="text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> تسجيل مكالمة
                  </button>
                  <button type="button" onClick={async () => {
                    await api.post(`/api/bookings/${lead.id}/activities`, {
                      activity_type: 'followup_scheduled',
                      description: 'تم جدولة متابعة العميل.'
                    });
                    loadActivities();
                  }} className="text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> جدولة متابعة
                  </button>
                </div>
              </form>
            </div>

            {/* Activities Feed */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> السجل والأنشطة (Timeline)
              </h3>
              
              {loading ? (
                <p className="text-center text-slate-400 text-sm">جاري تحميل الأنشطة...</p>
              ) : activities.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm">لا توجد أنشطة سابقة لهذا العميل.</p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {activities.map((act: any) => (
                    <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-amber-100 text-amber-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {act.activity_type === 'call_logged' ? <Phone className="w-4 h-4" /> : 
                         act.activity_type === 'note_added' ? <FileText className="w-4 h-4" /> : 
                         <MessageCircle className="w-4 h-4" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{act.activity_type === 'call_logged' ? 'مكالمة هاتفية' : 'ملاحظة وتحديث'}</span>
                            {act.admin_name && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">بواسطة: {act.admin_name}</span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{new Date(act.created_at).toLocaleString('ar-SA')}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
