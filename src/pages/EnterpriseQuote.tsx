import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Send, Building2, Phone, Mail, Building, Truck, ThermometerSnowflake } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function EnterpriseQuote() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    crNumber: '',
    contactName: '',
    phone: '',
    email: '',
    industry: '',
    monthlyTrips: '',
    tempRequired: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      
      // Track Conversion Events
      if (typeof window !== 'undefined') {
        if ((window as any).gtag) (window as any).gtag('event', 'generate_lead', { currency: 'SAR', value: 500 }); // Enterprise lead is higher value
        if ((window as any).fbq) (window as any).fbq('track', 'Lead');
        if ((window as any).snaptr) (window as any).snaptr('track', 'SIGN_UP');
        if ((window as any).ttq) (window as any).ttq.track('SubmitForm');
      }
    }, 1000);
  };

  const pageTitle = i18n.language === 'en' ? 'Enterprise Quote Request' : 'طلب تسعيرة للشركات';
  const pageDesc = i18n.language === 'en' 
    ? 'Request a formal B2B logistics quote for your commercial cold chain requirements.'
    : 'اطلب تسعيرة رسمية لخدمات النقل اللوجستي المبرد لشركتك.';

  if (submitted) {
    return (
      <div className="py-24 min-h-[70vh] bg-slate-50 flex items-center justify-center">
        <SEO title={`${pageTitle} | ركن الريان للنقل المبرد`} description={pageDesc} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            {i18n.language === 'en' ? 'Request Received' : 'تم استلام طلبك بنجاح'}
          </h2>
          <p className="text-slate-600 mb-8">
            {i18n.language === 'en' 
              ? 'Our enterprise sales team will review your requirements and contact you within 24 hours.' 
              : 'سيقوم فريق مبيعات الشركات بمراجعة متطلباتك والتواصل معك خلال 24 ساعة لتقديم عرض السعر الرسمي.'}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            {i18n.language === 'en' ? 'Return to Home' : 'العودة للصفحة الرئيسية'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <SEO title={`${pageTitle} | ركن الريان للنقل المبرد`} description={pageDesc} />
      <div className="container mx-auto px-4 md:px-6">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Building2 className="w-4 h-4" />
            {i18n.language === 'en' ? 'Corporate Procurement' : 'بوابة مبيعات الشركات'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{pageTitle}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {pageDesc}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="bg-slate-900 text-white p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-amber-500">
                  {i18n.language === 'en' ? 'Enterprise Benefits' : 'مزايا التعاقد المؤسسي'}
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">{i18n.language === 'en' ? 'Formal SLAs' : 'اتفاقيات مستوى الخدمة (SLA)'}</h4>
                      <p className="text-slate-400 text-sm">{i18n.language === 'en' ? 'Guaranteed on-time delivery and strict temperature compliance.' : 'ضمان الالتزام بالمواعيد ومعايير درجات الحرارة الصارمة.'}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Truck className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">{i18n.language === 'en' ? 'Dedicated Fleet' : 'أسطول مخصص'}</h4>
                      <p className="text-slate-400 text-sm">{i18n.language === 'en' ? 'Priority access to our modern refrigerated trucks.' : 'أولوية الوصول لأسطولنا الحديث من الشاحنات المبردة.'}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ThermometerSnowflake className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">{i18n.language === 'en' ? 'Real-time Tracking' : 'تتبع لحظي للحرارة'}</h4>
                      <p className="text-slate-400 text-sm">{i18n.language === 'en' ? 'Live data logger reports for every shipment.' : 'تقارير لحظية لدرجات الحرارة لضمان الجودة.'}</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm text-slate-400 mb-2">{i18n.language === 'en' ? 'Direct Contact:' : 'التواصل المباشر:'}</p>
                <a href={`mailto:${settings?.notifications?.email_to || 'sales@roknelryan.com'}`} className="flex items-center gap-2 font-bold hover:text-amber-500 transition-colors">
                  <Mail className="w-4 h-4" /> {settings?.notifications?.email_to || 'sales@roknelryan.com'}
                </a>
              </div>
            </div>
            
            <div className="col-span-2 p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {i18n.language === 'en' ? 'Company Name *' : 'اسم الشركة *'}
                    </label>
                    <div className="relative">
                      <Building className="absolute top-3 right-3 text-slate-400 w-5 h-5" />
                      <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {i18n.language === 'en' ? 'Commercial Registration (CR)' : 'رقم السجل التجاري'}
                    </label>
                    <div className="relative">
                      <FileText className="absolute top-3 right-3 text-slate-400 w-5 h-5" />
                      <input type="text" name="crNumber" value={formData.crNumber} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {i18n.language === 'en' ? 'Contact Person *' : 'الشخص المسؤول *'}
                    </label>
                    <input required type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {i18n.language === 'en' ? 'Phone Number *' : 'رقم الجوال *'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute top-3 right-3 text-slate-400 w-5 h-5" />
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all" dir="ltr" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {i18n.language === 'en' ? 'Industry Sector' : 'قطاع العمل'}
                    </label>
                    <select name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all">
                      <option value="">{i18n.language === 'en' ? 'Select Industry...' : 'اختر القطاع...'}</option>
                      <option value="Pharma">{i18n.language === 'en' ? 'Pharmaceuticals' : 'الأدوية والمستلزمات الطبية'}</option>
                      <option value="Food">{i18n.language === 'en' ? 'FMCG & Food' : 'الأغذية والسلع الاستهلاكية'}</option>
                      <option value="Meat">{i18n.language === 'en' ? 'Meat & Poultry' : 'اللحوم والدواجن'}</option>
                      <option value="Catering">{i18n.language === 'en' ? 'Catering & Restaurants' : 'المطاعم والإعاشة'}</option>
                      <option value="Other">{i18n.language === 'en' ? 'Other' : 'أخرى'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {i18n.language === 'en' ? 'Required Temperature' : 'درجة الحرارة المطلوبة'}
                    </label>
                    <select name="tempRequired" value={formData.tempRequired} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all">
                      <option value="">{i18n.language === 'en' ? 'Select Temp...' : 'اختر الدرجة...'}</option>
                      <option value="Frozen">{i18n.language === 'en' ? 'Frozen (-18°C)' : 'تجميد (-18°C)'}</option>
                      <option value="Chilled">{i18n.language === 'en' ? 'Chilled (+4°C to +8°C)' : 'تبريد (+4°C إلى +8°C)'}</option>
                      <option value="Dry">{i18n.language === 'en' ? 'Dry (Room Temp)' : 'جاف (درجة الغرفة)'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {i18n.language === 'en' ? 'Estimated Monthly Trips' : 'عدد الرحلات الشهرية المتوقعة'}
                  </label>
                  <select name="monthlyTrips" value={formData.monthlyTrips} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all">
                    <option value="">{i18n.language === 'en' ? 'Select Volume...' : 'اختر الحجم...'}</option>
                    <option value="1-10">{i18n.language === 'en' ? '1 - 10 trips' : '1 - 10 رحلات'}</option>
                    <option value="11-50">{i18n.language === 'en' ? '11 - 50 trips' : '11 - 50 رحلة'}</option>
                    <option value="50+">{i18n.language === 'en' ? 'More than 50 trips' : 'أكثر من 50 رحلة'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {i18n.language === 'en' ? 'Additional Details (Routes, SLA requirements)' : 'تفاصيل إضافية (مسارات محددة، اشتراطات خاصة)'}
                  </label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-amber-500 text-slate-900 font-bold text-lg py-4 rounded-xl hover:bg-amber-400 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30">
                  <Send className="w-5 h-5" />
                  {i18n.language === 'en' ? 'Submit RFP Request' : 'إرسال طلب تسعيرة الشركات'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
