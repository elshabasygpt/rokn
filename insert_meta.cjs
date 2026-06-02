const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'alsuqour',
  user: 'postgres',
  password: ''
});

const val = {
  title_ar: 'اتصل بنا',
  title_en: 'Contact Us',
  desc_ar: 'نحن هنا للإجابة على استفساراتكم وتلبية احتياجاتكم في نقل الأثاث.',
  desc_en: 'We are here to answer your inquiries and meet your moving needs.',
  info_title_ar: 'معلومات التواصل',
  info_title_en: 'Contact Info',
  info_hqText_ar: 'المملكة العربية السعودية، أبها - حي الخالدية',
  info_hqText_en: 'Kingdom of Saudi Arabia, Abha - Al-Khaldiya Dist',
  info_hoursText_ar: 'نعمل على مدار 24 ساعة، طوال أيام الأسبوع',
  info_hoursText_en: 'We operate 24/7, all week long',
  waText_ar: 'تواصل معنا الآن عبر الواتساب للرد السريع',
  waText_en: 'Contact us now on WhatsApp for a quick reply',
  form_title_ar: 'احجز خدمتك الآن',
  form_title_en: 'Book Your Service Now',
  form_desc_ar: 'أكمل الخطوات الثلاث البسيطة وسنصلك في أسرع وقت',
  form_desc_en: 'Complete the three simple steps and we will reach you ASAP',
  form_successTitle_ar: 'تم استلام طلبك بنجاح!',
  form_successTitle_en: 'Your request was received successfully!',
  form_successDesc_ar: 'سنتواصل معك في أقرب وقت لتأكيد حجزك.',
  form_successDesc_en: 'We will contact you shortly to confirm your booking.'
};

pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', ['contactMeta', JSON.stringify(val)])
  .then(() => {
    console.log('Successfully inserted default contactMeta settings.');
    pool.end();
  })
  .catch(e => {
    console.error(e);
    pool.end();
  });
