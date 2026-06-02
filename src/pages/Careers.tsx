import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowLeft, ArrowRight, X, Send, CheckCircle2, FileText, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Careers() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', cover_letter: '', resume_url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/careers/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data.filter((j: any) => j.is_active));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.general) setSettings(data.general);
      })
      .catch(console.error);
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...applyForm, job_id: selectedJob.id })
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIsApplying(false);
          setSubmitted(false);
          setApplyForm({ name: '', email: '', phone: '', cover_letter: '', resume_url: '' });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload/resume', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setApplyForm({ ...applyForm, resume_url: data.url });
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert(isEn ? 'Failed to upload file' : 'فشل رفع الملف');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO 
        title={isEn ? 'Careers | Join Our Team' : 'التوظيف | انضم لفريقنا'} 
        description={isEn ? 'Explore career opportunities at Rokn Elryan and become part of our growing logistics family.' : 'اكتشف فرص العمل المتاحة في ركن الريان وكن جزءاً من عائلتنا اللوجستية المتنامية.'} 
      />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-900 z-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Careers Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {isEn ? 'Join Our ' : 'انضم إلى '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                {isEn ? 'Growing Team' : 'فريقنا المتنامي'}
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {isEn ? 'Build a rewarding career in logistics and refrigerated transport with the industry leaders in Saudi Arabia.' : 'ابنِ مسيرة مهنية ناجحة في مجال الخدمات اللوجستية والنقل المبرد مع رواد الصناعة في المملكة العربية السعودية.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-20 relative z-20 -mt-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="text-center py-20 text-slate-500">{isEn ? 'Loading jobs...' : 'جاري تحميل الوظائف...'}</div>
            ) : jobs.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{isEn ? 'No Open Positions' : 'لا توجد وظائف شاغرة حالياً'}</h3>
                <p className="text-slate-500">{isEn ? 'Please check back later or follow our social media for updates.' : 'يُرجى العودة لاحقاً أو متابعة حساباتنا على منصات التواصل الاجتماعي.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {jobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-amber-500 transition-colors">
                        {isEn ? job.title_en : job.title_ar}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Clock className="w-4 h-4 text-amber-500" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          {isEn ? job.location_en : job.location_ar}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className="flex items-center justify-center gap-2 w-full md:w-auto bg-slate-900 text-white font-bold px-8 py-3 rounded-xl group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                        {isEn ? 'View Details' : 'التفاصيل والتقديم'}
                        {isEn ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && !isApplying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-8"
              dir={isEn ? 'ltr' : 'rtl'}
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4">{isEn ? selectedJob.title_en : selectedJob.title_ar}</h2>
                  <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600">
                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                      <Clock className="w-4 h-4 text-amber-500" /> {selectedJob.type}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                      <MapPin className="w-4 h-4 text-amber-500" /> {isEn ? selectedJob.location_en : selectedJob.location_ar}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shadow-sm">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{isEn ? 'Job Description' : 'الوصف الوظيفي'}</h3>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {isEn ? selectedJob.description_en : selectedJob.description_ar}
                  </div>
                </div>
                
                {((isEn ? selectedJob.requirements_en : selectedJob.requirements_ar) || '').trim() && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{isEn ? 'Requirements' : 'متطلبات الوظيفة'}</h3>
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {isEn ? selectedJob.requirements_en : selectedJob.requirements_ar}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button onClick={() => setSelectedJob(null)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                  {isEn ? 'Close' : 'إغلاق'}
                </button>
                <button onClick={() => setIsApplying(true)} className="px-8 py-3 font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors shadow-sm flex items-center gap-2">
                  <Send className="w-5 h-5" /> {isEn ? 'Apply Now' : 'قدم الآن'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Form Modal */}
      <AnimatePresence>
        {isApplying && selectedJob && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8 relative"
              dir={isEn ? 'ltr' : 'rtl'}
            >
              {submitted ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">{isEn ? 'Application Submitted!' : 'تم تقديم طلبك بنجاح!'}</h3>
                  <p className="text-slate-600 text-lg mb-8">{isEn ? 'Thank you for your interest. Our HR team will review your application and contact you soon.' : 'شكراً لاهتمامك بالانضمام إلينا. سيقوم فريق الموارد البشرية بمراجعة طلبك والتواصل معك قريباً.'}</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{isEn ? 'Submit Application' : 'تقديم طلب التوظيف'}</h2>
                      <p className="text-slate-500 text-sm mt-1">{isEn ? selectedJob.title_en : selectedJob.title_ar}</p>
                    </div>
                    <button onClick={() => setIsApplying(false)} className="p-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shadow-sm">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <form onSubmit={handleApply} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{isEn ? 'Full Name' : 'الاسم الرباعي'} *</label>
                        <input required value={applyForm.name} onChange={e => setApplyForm({...applyForm, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all bg-slate-50 focus:bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{isEn ? 'Phone Number' : 'رقم الهاتف'} *</label>
                        <input required dir="ltr" value={applyForm.phone} onChange={e => setApplyForm({...applyForm, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all bg-slate-50 focus:bg-white text-left" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{isEn ? 'Email Address' : 'البريد الإلكتروني'} *</label>
                      <input required type="email" dir="ltr" value={applyForm.email} onChange={e => setApplyForm({...applyForm, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all bg-slate-50 focus:bg-white text-left" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{isEn ? 'Resume / CV (PDF, DOCX)' : 'السيرة الذاتية'} *</label>
                      {applyForm.resume_url ? (
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold">
                          <CheckCircle2 className="w-5 h-5" /> {isEn ? 'File Uploaded Successfully' : 'تم إرفاق الملف بنجاح'}
                        </div>
                      ) : (
                        <div className="relative">
                          <input required type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-amber-500 transition-colors text-slate-500">
                            <Upload className="w-6 h-6" />
                            <span className="font-bold">{isEn ? 'Click to upload your resume' : 'اضغط هنا لرفع السيرة الذاتية'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{isEn ? 'Cover Letter / Notes (Optional)' : 'ملاحظات إضافية (اختياري)'}</label>
                      <textarea value={applyForm.cover_letter} onChange={e => setApplyForm({...applyForm, cover_letter: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all bg-slate-50 focus:bg-white h-32 resize-none" />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
                      <button type="button" onClick={() => setIsApplying(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                        {isEn ? 'Cancel' : 'إلغاء'}
                      </button>
                      <button disabled={isSubmitting || !applyForm.resume_url} type="submit" className="px-8 py-3 font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? (isEn ? 'Submitting...' : 'جاري التقديم...') : (
                          <><Send className="w-5 h-5" /> {isEn ? 'Submit Application' : 'إرسال الطلب'}</>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
