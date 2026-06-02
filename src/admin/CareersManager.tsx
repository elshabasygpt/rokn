import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Plus, Trash2, Edit3, CheckCircle2, XCircle, FileText, Check, Clock } from 'lucide-react';
import { useApi } from './useApi';

export default function CareersManager() {
  const api = useApi();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  
  // Jobs State
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<any>(null);
  
  // Applications State
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, appsData] = await Promise.all([
        api.get('/api/careers/jobs'),
        api.get('/api/careers/applications')
      ]);
      setJobs(jobsData);
      setApplications(appsData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob.id) {
        await api.put(`/api/careers/jobs/${editingJob.id}`, editingJob);
      } else {
        await api.post('/api/careers/jobs', editingJob);
      }
      setEditingJob(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) return;
    try {
      await api.del(`/api/careers/jobs/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/careers/applications/${id}/status`, { status });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const statusMap: any = {
    pending: { label: 'قيد المراجعة', color: 'text-amber-600 bg-amber-50', icon: Clock },
    reviewed: { label: 'تمت المراجعة', color: 'text-blue-600 bg-blue-50', icon: FileText },
    accepted: { label: 'مقبول', color: 'text-green-600 bg-green-50', icon: CheckCircle2 },
    rejected: { label: 'مرفوض', color: 'text-red-600 bg-red-50', icon: XCircle }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">نظام التوظيف</h1>
          <p className="text-slate-500 text-sm">إدارة الوظائف المتاحة واستقبال طلبات التوظيف</p>
        </div>
        {activeTab === 'jobs' && (
          <button 
            onClick={() => setEditingJob({ title_ar: '', title_en: '', type: 'Full-time', location_ar: 'الرياض', location_en: 'Riyadh', description_ar: '', description_en: '', requirements_ar: '', requirements_en: '', is_active: true })}
            className="flex items-center gap-2 bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-xl hover:bg-amber-400 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" /> إضافة وظيفة
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Briefcase className="w-4 h-4" /> الوظائف המتاحة ({jobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition-colors ${activeTab === 'applications' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Users className="w-4 h-4" /> طلبات التوظيف ({applications.length})
        </button>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && !editingJob && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200">
              لا توجد وظائف مضافة حالياً.
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{job.title_ar}</h3>
                      <p className="text-slate-500 text-sm dir-ltr text-right">{job.title_en}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {job.is_active ? 'نشط' : 'مغلق'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-600 font-medium mb-4">
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{job.type}</span>
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{job.location_ar}</span>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-slate-100 pt-4">
                  <button onClick={() => setEditingJob(job)} className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-amber-50 text-amber-700 rounded-xl transition-colors font-bold text-sm">
                    <Edit3 className="w-4 h-4" /> تعديل
                  </button>
                  <button onClick={() => handleDeleteJob(job.id)} className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-red-50 text-red-600 rounded-xl transition-colors font-bold text-sm">
                    <Trash2 className="w-4 h-4" /> حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Job Form */}
      {activeTab === 'jobs' && editingJob && (
        <form onSubmit={handleSaveJob} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold">{editingJob.id ? 'تعديل وظيفة' : 'وظيفة جديدة'}</h2>
            <button type="button" onClick={() => setEditingJob(null)} className="text-slate-400 hover:text-slate-600">إلغاء</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">المسمى الوظيفي (عربي)</label>
              <input required value={editingJob.title_ar} onChange={e => setEditingJob({...editingJob, title_ar: e.target.value})} className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Job Title (English)</label>
              <input required value={editingJob.title_en} onChange={e => setEditingJob({...editingJob, title_en: e.target.value})} dir="ltr" className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">نوع العمل (Type)</label>
              <select value={editingJob.type} onChange={e => setEditingJob({...editingJob, type: e.target.value})} className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500">
                <option value="دوام كامل">دوام كامل (Full-time)</option>
                <option value="دوام جزئي">دوام جزئي (Part-time)</option>
                <option value="عن بعد">عن بعد (Remote)</option>
                <option value="عقد">عقد (Contract)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">الحالة</label>
              <select value={editingJob.is_active ? '1' : '0'} onChange={e => setEditingJob({...editingJob, is_active: e.target.value === '1'})} className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500">
                <option value="1">نشط (يظهر في الموقع)</option>
                <option value="0">مغلق (مخفي)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">المقر (عربي)</label>
              <input required value={editingJob.location_ar} onChange={e => setEditingJob({...editingJob, location_ar: e.target.value})} className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Location (English)</label>
              <input required value={editingJob.location_en} onChange={e => setEditingJob({...editingJob, location_en: e.target.value})} dir="ltr" className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">الوصف الوظيفي (عربي)</label>
              <textarea required value={editingJob.description_ar} onChange={e => setEditingJob({...editingJob, description_ar: e.target.value})} className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500 h-24" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">Job Description (English)</label>
              <textarea required value={editingJob.description_en} onChange={e => setEditingJob({...editingJob, description_en: e.target.value})} dir="ltr" className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500 h-24" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">المتطلبات (عربي)</label>
              <textarea value={editingJob.requirements_ar} onChange={e => setEditingJob({...editingJob, requirements_ar: e.target.value})} className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500 h-24" placeholder="- خبرة سنتين..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">Requirements (English)</label>
              <textarea value={editingJob.requirements_en} onChange={e => setEditingJob({...editingJob, requirements_en: e.target.value})} dir="ltr" className="w-full border rounded-xl px-4 py-2 outline-none focus:border-amber-500 h-24" placeholder="- 2 years experience..." />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setEditingJob(null)} className="px-6 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">إلغاء</button>
            <button type="submit" className="px-8 py-2 font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors shadow-sm">حفظ الوظيفة</button>
          </div>
        </form>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {applications.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              لا توجد طلبات توظيف حتى الآن.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold">الاسم</th>
                    <th className="px-6 py-4 font-bold">الوظيفة المتقدم لها</th>
                    <th className="px-6 py-4 font-bold">التواصل</th>
                    <th className="px-6 py-4 font-bold">الحالة</th>
                    <th className="px-6 py-4 font-bold">التاريخ</th>
                    <th className="px-6 py-4 font-bold text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map(app => {
                    const status = statusMap[app.status] || statusMap.pending;
                    const StatusIcon = status.icon;
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{app.name}</td>
                        <td className="px-6 py-4">
                          {app.job_title_ar ? (
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">{app.job_title_ar}</span>
                          ) : (
                            <span className="text-slate-400">وظيفة محذوفة</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-600" dir="ltr">{app.phone}</div>
                          <div className="text-slate-500 text-xs mt-1">{app.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" /> {status.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(app.created_at).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select 
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-amber-500"
                          >
                            <option value="pending">قيد المراجعة</option>
                            <option value="reviewed">تمت المراجعة</option>
                            <option value="accepted">مقبول</option>
                            <option value="rejected">مرفوض</option>
                          </select>
                          {app.resume_url && (
                            <a href={app.resume_url} target="_blank" rel="noreferrer" className="block mt-2 text-xs text-amber-600 hover:underline font-bold">
                              عرض السيرة الذاتية
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
