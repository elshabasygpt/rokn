import poolWrapper from './server/db.js';

const services = [
  {
    icon: 'Truck',
    title_ar: 'نقل مبرد ومجمد',
    title_en: 'Refrigerated & Frozen Transport',
    desc_ar: 'نقل جميع أنواع المواد الغذائية الطازجة والمجمدة، بالإضافة إلى الأدوية، باستخدام شاحنات مزودة بأنظمة تبريد عالية الجودة.',
    desc_en: 'Transporting all types of fresh and frozen food, as well as medicines, using trucks equipped with high-quality cooling systems.',
    features_ar: ['تجميد وتبريد لدرجات دقيقة', 'نقل اللحوم والدواجن والأسماك', 'نقل الخضروات والفواكه', 'نقل الأدوية والمستلزمات الطبية'],
    features_en: ['Freezing and cooling to precise degrees', 'Transporting meat, poultry, and fish', 'Transporting vegetables and fruits', 'Transporting medicines and medical supplies'],
    sort_order: 1
  },
  {
    icon: 'ThermometerSnowflake',
    title_ar: 'شاحنة ثلاجة للإيجار',
    title_en: 'Refrigerated Truck Rental',
    desc_ar: 'خدمة تأجير شاحنات مبردة (شاحنة) لتلبية احتياجات الشركات، المصانع، والمطاعم سواء للمشاوير اليومية أو العقود الشهرية.',
    desc_en: 'Refrigerated truck rental services to meet the needs of companies, factories, and restaurants, whether for daily trips or monthly contracts.',
    features_ar: ['إيجار يومي، شهري، سنوي', 'سائقون ذوو خبرة في التوزيع', 'صيانة دورية للثلاجات', 'أسعار خاصة للشركات'],
    features_en: ['Daily, monthly, and annual rentals', 'Drivers experienced in distribution', 'Periodic maintenance of refrigerators', 'Special rates for companies'],
    sort_order: 2
  },
  {
    icon: 'Wind',
    title_ar: 'توزيع البضائع الغذائية',
    title_en: 'Food Product Distribution',
    desc_ar: 'تولي خطوط السير اليومية لتوزيع المنتجات الغذائية على السوبرماركت والمطاعم بدقة والتزام تام بالمواعيد.',
    desc_en: 'Taking charge of daily routes for distributing food products to supermarkets and restaurants with precision and strict punctuality.',
    features_ar: ['توزيع داخل جدة وخارجها', 'فريق محترف في التحميل والتنزيل', 'متابعة دقيقة للمسارات', 'الحفاظ على سلسلة التبريد'],
    features_en: ['Distribution inside and outside Jeddah', 'Professional team in loading and unloading', 'Precise tracking of routes', 'Maintaining the cold chain'],
    sort_order: 3
  },
  {
    icon: 'Snowflake',
    title_ar: 'نقل مبرد بين المدن',
    title_en: 'Intercity Refrigerated Transport',
    desc_ar: 'نقل البضائع بحمولات مختلفة (شاحنة، جامبو، تريلا) من مدينة جدة إلى الرياض، الدمام، المنطقة الجنوبية وكافة مناطق المملكة.',
    desc_en: 'Transporting goods with different load capacities (Truck, Jumbo, Trailer) from Jeddah to Riyadh, Dammam, the Southern Region, and all regions of the Kingdom.',
    features_ar: ['تغطية شاملة للمملكة', 'سرعة في التوصيل', 'تأمين على البضائع', 'تتبع مستمر للرحلة'],
    features_en: ['Comprehensive coverage of the Kingdom', 'Speed in delivery', 'Insurance on goods', 'Continuous trip tracking'],
    sort_order: 4
  }
];

async function updateDB() {
  try {
    console.log('Deleting old services...');
    await poolWrapper.query('DELETE FROM services');

    for (const service of services) {
      await poolWrapper.query(
        `INSERT INTO services (icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          service.icon, 
          service.title_ar, 
          service.title_en, 
          service.desc_ar, 
          service.desc_en, 
          service.features_ar, 
          service.features_en, 
          service.sort_order
        ]
      );
      console.log(`Inserted: ${service.title_ar}`);
    }
    
    console.log('Successfully updated services in DB.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating DB:', error);
    process.exit(1);
  }
}

updateDB();
