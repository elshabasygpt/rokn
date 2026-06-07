import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Truck, Package, Weight, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function PayloadCalculator() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const [inputType, setInputType] = useState<'pallets' | 'weight'>('pallets');
  const [amount, setAmount] = useState<number | ''>('');
  
  const [config, setConfig] = useState<any>(null);

  React.useEffect(() => {
    // Fetch settings to get payload_config
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data && data.payload_config) {
          setConfig(data.payload_config);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConfig();
  }, []);
  
  const calculateRecommendation = () => {
    if (!amount || amount <= 0) return null;
    
    // Default variables if CMS is empty
    const palletWeightKg = config?.pallet_weight_kg || 800;
    const palletWeightTon = palletWeightKg / 1000;
    
    const smallPallets = config?.small_max_pallets || 5;
    const smallTons = config?.small_max_tons || 4;
    
    const mediumPallets = config?.medium_max_pallets || 12;
    const mediumTons = config?.medium_max_tons || 10;
    
    const trailerPallets = config?.trailer_max_pallets || 24;

    let pallets = 0;
    let weightTon = 0;

    if (inputType === 'pallets') {
      pallets = Number(amount);
      weightTon = pallets * palletWeightTon; 
    } else {
      weightTon = Number(amount);
      pallets = Math.ceil(weightTon / palletWeightTon);
    }

    if (pallets <= smallPallets || weightTon <= smallTons) {
      return {
        vehicle: isEn ? 'Refrigerated Dyna (Small)' : 'دينا تبريد (صغير)',
        capacity: isEn ? `Up to ${smallPallets} Pallets / ${smallTons} Tons` : `حتى ${smallPallets} طبالي / ${smallTons} طن`,
        temp: '-18°C to +25°C',
        bestFor: isEn ? 'Inner-city distribution, restaurants, pharmacies.' : 'التوزيع داخل المدن، المطاعم، الصيدليات.',
        image: 'https://images.unsplash.com/photo-1519003722824-194d4455aeb7?q=80&w=800&auto=format&fit=crop'
      };
    } else if (pallets <= mediumPallets || weightTon <= mediumTons) {
      return {
        vehicle: isEn ? 'Refrigerated Truck (Medium)' : 'لوري تبريد (متوسط)',
        capacity: isEn ? `Up to ${mediumPallets} Pallets / ${mediumTons} Tons` : `حتى ${mediumPallets} طبلية / ${mediumTons} طن`,
        temp: '-18°C to +25°C',
        bestFor: isEn ? 'Regional distribution, supermarkets, regional pharma.' : 'التوزيع الإقليمي، السوبرماركت، مستودعات الأدوية.',
        image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop'
      };
    } else {
      const trailersNeeded = Math.ceil(pallets / trailerPallets);
      return {
        vehicle: isEn ? 'Refrigerated Trailer (Heavy)' : 'تريلا تبريد (ثقيل)',
        capacity: isEn ? `Up to ${trailerPallets} Pallets / ${config?.trailer_max_tons || 25} Tons per trailer` : `حتى ${trailerPallets} طبلية / ${config?.trailer_max_tons || 25} طن للتريلا الواحدة`,
        count: trailersNeeded,
        temp: '-20°C to +25°C',
        bestFor: isEn ? 'Long-haul, nationwide distribution, food manufacturing.' : 'النقل الطويل، التوزيع بين المدن، المصانع الغذائية.',
        image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=800&auto=format&fit=crop'
      };
    }
  };

  const recommendation = calculateRecommendation();

  const pageTitle = isEn ? 'Refrigerated Truck Payload Calculator' : 'حاسبة سعة شاحنات النقل المبرد';
  const pageDesc = isEn 
    ? 'Calculate the exact refrigerated truck size you need based on pallets or weight. Discover our logistics capacity for cold chain transport across Saudi Arabia.' 
    : 'احسب حجم شاحنة النقل المبرد التي تحتاجها بناءً على عدد الطبالي أو الوزن. أداة دقيقة للشركات والمصانع لمعرفة السعة اللوجستية المطلوبة.';

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": pageTitle,
    "description": pageDesc,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All"
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <SEO title={`${pageTitle} | ${isEn ? 'Rokn Elryan' : 'ركن الريان'}`} description={pageDesc} schema={toolSchema} />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            {isEn ? 'Enter your cargo volume to instantly discover the optimal refrigerated truck size for your logistics needs.' : 'أدخل حجم أو وزن شحنتك لمعرفة حجم شاحنة التبريد المثالية والموفرة للتكاليف لاحتياجاتك اللوجستية.'}
          </p>
        </div>
      </section>

      {/* Calculator Interface */}
      <section className="container mx-auto px-4 -mt-8 relative z-20 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Form */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-amber-500" />
                {isEn ? 'Cargo Details' : 'تفاصيل الشحنة'}
              </h3>
              
              <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                <button 
                  onClick={() => { setInputType('pallets'); setAmount(''); }}
                  className={`flex-1 py-3 font-bold text-sm md:text-base rounded-lg transition-all flex justify-center items-center gap-2 ${inputType === 'pallets' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Package className="w-5 h-5" />
                  {isEn ? 'By Pallets' : 'حسب عدد الطبالي'}
                </button>
                <button 
                  onClick={() => { setInputType('weight'); setAmount(''); }}
                  className={`flex-1 py-3 font-bold text-sm md:text-base rounded-lg transition-all flex justify-center items-center gap-2 ${inputType === 'weight' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Weight className="w-5 h-5" />
                  {isEn ? 'By Weight (Tons)' : 'حسب الوزن (بالطن)'}
                </button>
              </div>

              <div className="mb-8">
                <label className="block text-slate-700 font-bold mb-3">
                  {inputType === 'pallets' 
                    ? (isEn ? 'Number of Pallets (Standard 120x100cm)' : 'عدد الطبالي (قياسي 120x100 سم)')
                    : (isEn ? 'Total Weight (in Tons)' : 'الوزن الإجمالي (بالطن)')
                  }
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder={inputType === 'pallets' ? 'e.g. 10' : 'e.g. 5'}
                  className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-xl font-bold text-slate-900"
                />
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  {isEn ? 'Smart Algorithm' : 'خوارزمية ذكية'}
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {isEn ? 'This tool calculates the most cost-effective fleet configuration ensuring SFDA compliance and optimal air circulation.' : 'تقوم هذه الأداة بحساب أفضل خيار متاح للأسطول من حيث التكلفة، لضمان تدفق هواء التبريد بشكل سليم ومطابق للمواصفات.'}
                </p>
              </div>
            </div>

            {/* Results Area */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 h-full flex flex-col justify-center">
              {!recommendation ? (
                <div className="text-center opacity-50 flex flex-col items-center">
                  <Truck className="w-20 h-20 text-slate-300 mb-4" />
                  <p className="text-lg font-bold text-slate-500">
                    {isEn ? 'Enter your cargo amount to see the recommended vehicle.' : 'أدخل كمية الشحنة لرؤية الشاحنة الموصى بها.'}
                  </p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  <div className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-wide">
                    {isEn ? 'Recommended Configuration' : 'الإعداد الموصى به'}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-6">
                    {recommendation.count && recommendation.count > 1 ? `${recommendation.count}x ` : ''}{recommendation.vehicle}
                  </h3>
                  
                  <img src={recommendation.image} alt={recommendation.vehicle} className="w-full h-48 object-cover rounded-xl mb-6 shadow-md border border-slate-200" />
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-slate-600 font-medium">{isEn ? 'Max Capacity' : 'السعة القصوى'}</span>
                      <span className="font-bold text-slate-900">{recommendation.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-slate-600 font-medium">{isEn ? 'Cooling Range' : 'نطاق التبريد'}</span>
                      <span className="font-bold text-emerald-600">{recommendation.temp}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3">
                      <span className="text-slate-600 font-medium">{isEn ? 'Best For' : 'الاستخدام الأفضل'}</span>
                      <span className="font-bold text-slate-900 text-end w-1/2">{recommendation.bestFor}</span>
                    </div>
                  </div>

                  <Link to={isEn ? '/en/enterprise-quote' : '/enterprise-quote'} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                    {isEn ? 'Request Quote for this Fleet' : 'طلب تسعيرة لهذا الأسطول'}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
