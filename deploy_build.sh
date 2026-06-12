#!/bin/bash

echo "🚀 جاري بناء واجهة الموقع (React)..."
npm run build

echo "🧹 تنظيف الملفات المكررة لتخفيف مساحة الضغط..."
# مسح مجلد المرفقات من dist لأننا سنأخذه من public
rm -rf dist/uploads

echo "📦 جاري ضغط ملفات المشروع المصدري للسيرفر..."
# نضغط السيرفر، وواجهة الموقع المبنيه، وملفات التشغيل
zip -r roknelryan_cpanel_deploy.zip server dist package.json package-lock.json public .env.production .env

echo "=========================================="
echo "✅ اكتملت المهمة! تم إنشاء ملف roknelryan_cpanel_deploy.zip بنجاح!"
echo "حجم الملف:"
du -sh roknelryan_cpanel_deploy.zip
echo "يمكنك الآن رفع هذا الملف إلى استضافة cPanel الخاصة بك!"
echo "=========================================="
