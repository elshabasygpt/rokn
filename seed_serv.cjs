const http = require('http');

const services = [
  {
    icon: 'Truck',
    title_ar: 'نقل العفش والأثاث',
    title_en: 'Furniture Moving',
    desc_ar: 'نقدم خدمة نقل أثاث متكاملة باستخدام أسطول من الشاحنات الحديثة والمجهزة خصيصاً لحماية منقولاتك من أي ضرر أثناء النقل.',
    desc_en: 'We offer an integrated furniture moving service using a fleet of modern trucks specially equipped to protect your belongings from any damage during transit.',
    features_ar: [
      'سيارات مغلقة ومبطنة',
      'سائقون ذوو خبرة',
      'تغطية لجميع مدن المملكة',
      'نقل آمن وسريع'
    ],
    features_en: [
      'Closed and padded trucks',
      'Experienced drivers',
      'Coverage of all Kingdom cities',
      'Safe and fast moving'
    ],
    images: [],
    sort_order: 1,
    active: true
  },
  {
    icon: 'Package',
    title_ar: 'التغليف الاحترافي',
    title_en: 'Professional Packing',
    desc_ar: 'نستخدم أفضل مواد التغليف العالمية لضمان حماية كل قطعة أثاث، من الزجاج القابل للكسر إلى الأجهزة الكهربائية الحساسة.',
    desc_en: 'We use the best global packing materials to ensure the protection of every piece of furniture, from fragile glass to sensitive electrical appliances.',
    features_ar: [
      'كراتين مقواة مزدوجة',
      'بلاستيك فقاعي (Bubble Wrap)',
      'رول تغليف (Stretch)',
      'تغليف خاص للتحف والزجاج'
    ],
    features_en: [
      'Double reinforced cartons',
      'Bubble Wrap',
      'Stretch Wrap',
      'Special packing for antiques and glass'
    ],
    images: [],
    sort_order: 2,
    active: true
  },
  {
    icon: 'Wrench',
    title_ar: 'الفك والتركيب',
    title_en: 'Dismantling and Assembly',
    desc_ar: 'لدينا فريق من النجارين والفنيين المحترفين لفك وتركيب جميع أنواع غرف النوم، المطابخ، والمكيفات باحترافية عالية.',
    desc_en: 'We have a team of professional carpenters and technicians to dismantle and install all types of bedrooms, kitchens, and air conditioners with high professionalism.',
    features_ar: [
      'نجارين متخصصين (ايكيا، ميداس، الخ)',
      'فك وتركيب المكيفات',
      'فك وتركيب الستائر والنجف',
      'أدوات ومعدات حديثة'
    ],
    features_en: [
      'Specialized carpenters (IKEA, Midas, etc.)',
      'AC dismantling and installation',
      'Curtains and chandeliers setup',
      'Modern tools and equipment'
    ],
    images: [],
    sort_order: 3,
    active: true
  },
  {
    icon: 'ShieldCheck',
    title_ar: 'تخزين الأثاث',
    title_en: 'Furniture Storage',
    desc_ar: 'نوفر مستودعات آمنة ومجهزة بأحدث أنظمة الحماية ومكافحة الحشرات لتخزين أثاثك لفترات قصيرة أو طويلة.',
    desc_en: 'We provide safe warehouses equipped with the latest protection and pest control systems to store your furniture for short or long periods.',
    features_ar: [
      'مستودعات معزولة ونظيفة',
      'حراسة أمنية 24/7',
      'مكافحة دورية للحشرات',
      'أسعار تنافسية للتخزين'
    ],
    features_en: [
      'Insulated and clean warehouses',
      '24/7 security guarding',
      'Periodic pest control',
      'Competitive storage prices'
    ],
    images: [],
    sort_order: 4,
    active: true
  }
];

async function seed() {
  for (const s of services) {
    const postData = JSON.stringify(s);
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/services',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
    console.log(`Added: ${s.title_ar}`);
  }
}

seed().catch(console.error);
