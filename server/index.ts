import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDB } from './db';
import pool from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import authRoutes from './routes/auth';
import servicesRoutes from './routes/services';
import galleryRoutes from './routes/gallery';
import testimonialsRoutes from './routes/testimonials';
import settingsRoutes from './routes/settings';
import bookingsRoutes from './routes/bookings';
import partnersRouter from './routes/partners';
import faqsRouter from './routes/faqs';
import uploadRoutes from './routes/upload';
import articlesRoutes from './routes/articles';
import backupRoutes from './routes/backup';
import careersRoutes from './routes/careers';
import pagesRoutes from './routes/pages';
import citiesRoutes from './routes/cities';
import industriesRoutes from './routes/industries';
import caseStudiesRoutes from './routes/case-studies';
import redirectsRoutes from './routes/redirects';
import companyRoutes from './routes/company';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({ origin: true, credentials: true, exposedHeaders: ['Content-Disposition'] }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '../public/uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/partners', partnersRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/articles', articlesRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/industries', industriesRoutes);
app.use('/api/case-studies', caseStudiesRoutes);
app.use('/api/redirects', redirectsRoutes);
app.use('/api/company', companyRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SEO & SSR Routes
async function getBaseUrl(req: express.Request) {
  try {
    const res = await pool.query("SELECT value FROM settings WHERE key = 'general'");
    if (res.rows.length > 0 && res.rows[0].value.domain) {
      let domain = res.rows[0].value.domain.trim();
      if (domain.endsWith('/')) domain = domain.slice(0, -1);
      if (!domain.startsWith('http')) domain = 'https://' + domain;
      return domain;
    }
  } catch (e) {
    console.error('Failed to get BASE_URL from DB', e);
  }
  return `${req.protocol}://${req.get('host')}`;
}

app.get('/robots.txt', async (req, res) => {
  const BASE_URL = await getBaseUrl(req);
  res.type('text/plain');
  res.send(`User-agent: *\nDisallow: /admin/\nDisallow: /api/\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml`);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const BASE_URL = await getBaseUrl(req);
    const servicesRes = await pool.query('SELECT * FROM services WHERE active = true'); // Future 
    const articlesRes = await pool.query('SELECT slug FROM articles WHERE active = true');
    const citiesRes = await pool.query('SELECT slug FROM cities WHERE active = true');
    const industriesRes = await pool.query('SELECT slug FROM industries WHERE active = true');

    const baseUrls = [
      '',
      '/about',
      '/contact',
      '/gallery',
      '/services',
      '/blog',
      '/careers',
      '/case-studies',
      '/faq',
      '/enterprise-quote',
      '/compliance',
      '/calculator',
      '/fleet',
      '/checker',
      '/privacy',
      '/terms'
    ];

    // Add dynamic articles
    for (const article of articlesRes.rows) {
      baseUrls.push(`/blog/${article.slug}`);
    }

    // Add dynamic cities
    for (const city of citiesRes.rows) {
      baseUrls.push(`/locations/${city.slug}`);
    }

    // Add dynamic industries
    for (const ind of industriesRes.rows) {
      baseUrls.push(`/industries/${ind.slug}`);
    }
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    for (const basePath of baseUrls) {
      const urlAr = `${BASE_URL}${basePath}`;
      const urlEn = `${BASE_URL}/en${basePath}`;
      const priority = basePath === '' ? '1.0' : '0.8';

      // Arabic URL node
      xml += `\n  <url>\n    <loc>${urlAr}</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${urlEn}"/>\n    <xhtml:link rel="alternate" hreflang="ar" href="${urlAr}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${urlAr}"/>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

      // English URL node
      xml += `\n  <url>\n    <loc>${urlEn}</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${urlEn}"/>\n    <xhtml:link rel="alternate" hreflang="ar" href="${urlAr}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${urlAr}"/>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    }

    xml += `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// --- SEO 301 Redirects Middleware ---
// Must be placed before the React SPA catch-all and after API routes
app.use(async (req, res, next) => {
  // Ignore API requests and static assets
  if (req.path.startsWith('/api/') || req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return next();
  }
  
  try {
    const { rows } = await pool.query(
      'SELECT new_path, status_code FROM redirects WHERE old_path = $1 AND active = true LIMIT 1',
      [req.path]
    );
    
    if (rows.length > 0) {
      const redirect = rows[0];
      return res.redirect(redirect.status_code, redirect.new_path);
    }
    next();
  } catch (err) {
    console.error('Redirects middleware error:', err);
    next(); // Fail gracefully
  }
});

// Serve frontend static files in production for SSR OpenGraph
app.use(express.static(path.resolve(__dirname, '../dist'), { index: false }));

app.get('*', async (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /WhatsApp|Twitterbot|facebookexternalhit|LinkedInBot|discordbot|Slackbot|TelegramBot|Googlebot|Google-Site-Verification|Bingbot|YandexBot|DuckDuckBot|Baiduspider|Slurp/i.test(userAgent);
  
  const indexPath = path.resolve(__dirname, '../dist/index.html');
  
  let siteVerification = '';
  try {
    const genRes = await pool.query("SELECT value FROM settings WHERE key = 'general'");
    if (genRes.rows.length > 0 && genRes.rows[0].value.googleSiteVerification) {
      siteVerification = `<meta name="google-site-verification" content="${genRes.rows[0].value.googleSiteVerification}" />`;
    }
  } catch (e) {
    console.error('Failed to fetch SEO settings', e);
  }
  
  if (isBot) {
    try {
      const BASE_URL = await getBaseUrl(req);
      
      // Basic fallback metadata
      let title = 'ركن الريان للنقل المبرد';
      let desc = 'نحن نقدم أفضل خدمات نقل وتغليف الأثاث مع الفك والتركيب في جميع أنحاء المملكة. ضمان كامل وسرعة واحترافية.';
      let image = `${BASE_URL}/logo.png`;
      let ogType = 'website';
      let geoTags = `\n  <meta name="geo.region" content="SA">\n  <meta name="geo.placename" content="Abha">\n  <meta name="geo.position" content="18.2164;42.5053">\n  <meta name="ICBM" content="18.2164, 42.5053">`;

      // Fetch dynamic settings to enrich SSR
      const settingsRes = await pool.query('SELECT key, value FROM settings');
      const settings: any = {};
      settingsRes.rows.forEach(r => settings[r.key] = r.value);

      const isEn = req.path.startsWith('/en');
      const lang = isEn ? 'en' : 'ar';

      // Determine Page title based on Path
      if (req.path.includes('/services') && settings.servicesMeta) {
        title = (isEn ? settings.servicesMeta.title_en : settings.servicesMeta.title_ar) + ' | ' + title;
        desc = isEn ? settings.servicesMeta.desc_en : settings.servicesMeta.desc_ar;
      } else if (req.path.includes('/gallery') && settings.galleryMeta) {
        title = (isEn ? settings.galleryMeta.title_en : settings.galleryMeta.title_ar) + ' | ' + title;
        desc = isEn ? settings.galleryMeta.desc_en : settings.galleryMeta.desc_ar;
      } else if (req.path.includes('/about') && settings.aboutMeta) {
        title = (isEn ? settings.aboutMeta.title_en : settings.aboutMeta.title_ar) + ' | ' + title;
        desc = isEn ? settings.aboutMeta.subtitle_en : settings.aboutMeta.subtitle_ar;
      } else if (req.path.includes('/contact') && settings.contactMeta) {
        title = (isEn ? settings.contactMeta.title_en : settings.contactMeta.title_ar) + ' | ' + title;
        desc = isEn ? settings.contactMeta.desc_en : settings.contactMeta.desc_ar;
      } else if (req.path.includes('/careers')) {
        title = (isEn ? 'Careers | Join Our Team' : 'التوظيف | انضم لفريقنا') + ' | ' + title;
        desc = isEn ? 'Explore career opportunities at Rokn Elryan and become part of our growing logistics family.' : 'اكتشف فرص العمل المتاحة في ركن الريان وكن جزءاً من عائلتنا اللوجستية المتنامية.';
      } else if (req.path.includes('/blog') && !req.path.endsWith('/blog')) {
        // If it's a specific article route /blog/:slug
        const slug = req.path.split('/').pop();
        const articleRes = await pool.query('SELECT * FROM articles WHERE slug = $1 AND active = true', [slug]);
        if (articleRes.rows.length > 0) {
           const article = articleRes.rows[0];
           ogType = 'article';
           title = (isEn ? article.title_en : article.title_ar) + ' | ' + title;
           desc = (isEn ? article.seo_desc_en : article.seo_desc_ar) || desc;
           if (article.image) {
             image = article.image.startsWith('/') ? `${BASE_URL}${article.image}` : article.image;
           }
        } else {
           return res.status(404).send('<!DOCTYPE html><html><head><meta name="robots" content="noindex"></head><body><h1>404 Not Found</h1></body></html>');
        }
      } else if (req.path.includes('/locations') && !req.path.endsWith('/locations')) {
        const getRegionCode = (cityName: string) => {
          const name = cityName.toLowerCase();
          if (name.includes('riyadh') || name.includes('رياض')) return 'SA-01';
          if (name.includes('jeddah') || name.includes('makkah') || name.includes('جدة') || name.includes('مكة') || name.includes('taif') || name.includes('طائف')) return 'SA-02';
          if (name.includes('madinah') || name.includes('مدينة')) return 'SA-03';
          if (name.includes('dammam') || name.includes('khobar') || name.includes('jubail') || name.includes('دمام') || name.includes('خبر') || name.includes('جبيل')) return 'SA-04';
          if (name.includes('qassim') || name.includes('buraidah') || name.includes('قصيم') || name.includes('بريدة')) return 'SA-05';
          if (name.includes('abha') || name.includes('khamis') || name.includes('أبها') || name.includes('خميس')) return 'SA-14';
          if (name.includes('tabuk') || name.includes('تبوك')) return 'SA-07';
          if (name.includes('hail') || name.includes('حائل')) return 'SA-06';
          if (name.includes('najran') || name.includes('نجران')) return 'SA-10';
          if (name.includes('jazan') || name.includes('jizan') || name.includes('جازان') || name.includes('جيزان')) return 'SA-09';
          return 'SA-14';
        };

        const slug = req.path.split('/').pop();
        const cityRes = await pool.query('SELECT * FROM cities WHERE slug = $1 AND active = true', [slug]);
        if (cityRes.rows.length > 0) {
           const city = cityRes.rows[0];
           const pageTitle = isEn ? (city.seo_title_en || city.name_en) : (city.seo_title_ar || city.name_ar);
           title = pageTitle + ' | ' + title;
           desc = (isEn ? (city.seo_desc_en || city.hero_desc_en) : (city.seo_desc_ar || city.hero_desc_ar)) || desc;
           if (city.featured_image) image = city.featured_image.startsWith('/') ? `${BASE_URL}${city.featured_image}` : city.featured_image;
           
           const regionCode = getRegionCode(city.name_en || city.name_ar);
           geoTags = `\n  <meta name="geo.region" content="${regionCode}">\n  <meta name="geo.placename" content="${isEn ? city.name_en : city.name_ar}">\n  <meta name="geo.position" content="18.2164;42.5053">\n  <meta name="ICBM" content="18.2164, 42.5053">`;
        } else {
           return res.status(404).send('<!DOCTYPE html><html><head><meta name="robots" content="noindex"></head><body><h1>404 Not Found</h1></body></html>');
        }
      } else if (req.path.includes('/industries') && !req.path.endsWith('/industries')) {
        const slug = req.path.split('/').pop();
        const indRes = await pool.query('SELECT * FROM industries WHERE slug = $1 AND active = true', [slug]);
        if (indRes.rows.length > 0) {
           const ind = indRes.rows[0];
           const pageTitle = isEn ? (ind.seo_title_en || ind.name_en) : (ind.seo_title_ar || ind.name_ar);
           title = pageTitle + ' | ' + title;
           desc = (isEn ? (ind.seo_desc_en || ind.hero_desc_en) : (ind.seo_desc_ar || ind.hero_desc_ar)) || desc;
           if (ind.featured_image) image = ind.featured_image.startsWith('/') ? `${BASE_URL}${ind.featured_image}` : ind.featured_image;
           geoTags = `\n  <meta name="geo.region" content="SA-14">\n  <meta name="geo.placename" content="Abha">\n  <meta name="geo.position" content="18.2164;42.5053">\n  <meta name="ICBM" content="18.2164, 42.5053">`;
        } else {
           return res.status(404).send('<!DOCTYPE html><html><head><meta name="robots" content="noindex"></head><body><h1>404 Not Found</h1></body></html>');
        }
      } else if (settings.hero) {
        // Home page default
        title = (isEn ? settings.hero.title1_en : settings.hero.title1_ar) + ' | ' + title;
        desc = (isEn ? settings.hero.desc_en : settings.hero.desc_ar) || desc;
        if (settings.hero.images && settings.hero.images.length > 0) {
          image = settings.hero.images[0].startsWith('/') ? `${BASE_URL}${settings.hero.images[0]}` : settings.hero.images[0];
        }
        geoTags = `\n  <meta name="geo.region" content="SA">\n  <meta name="geo.placename" content="Abha">\n  <meta name="geo.position" content="18.2164;42.5053">\n  <meta name="ICBM" content="18.2164, 42.5053">`;
      }

      let baseHtml = '';
      if (fs.existsSync(indexPath)) {
         baseHtml = await fs.promises.readFile(indexPath, 'utf-8');
      } else {
         baseHtml = '<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>';
      }

      // Remove default meta tags to avoid duplication
      baseHtml = baseHtml.replace(/<title>.*?<\/title>/i, '');
      baseHtml = baseHtml.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, '');
      baseHtml = baseHtml.replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i, '');
      baseHtml = baseHtml.replace(/<meta\s+name="geo\.[^"]+"\s+content="[^"]*"\s*\/?>/gi, '');
      baseHtml = baseHtml.replace(/<meta\s+name="ICBM"\s+content="[^"]*"\s*\/?>/i, '');

      // Fix lang and dir for English paths
      if (isEn) {
        baseHtml = baseHtml.replace(/<html[^>]*>/i, '<html lang="en" dir="ltr">');
      }

      const safeTitle = title.replace(/"/g, '&quot;');
      const safeDesc = desc.replace(/"/g, '&quot;');
      const safeImage = image.replace(/"/g, '&quot;');
      const safeUrl = `${BASE_URL}${req.path}`.replace(/"/g, '&quot;');

      const headInjection = `
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}">
  <!-- Open Graph -->
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:url" content="${safeUrl}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="ركن الريان للنقل المبرد">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImage}">
  <meta name="twitter:url" content="${safeUrl}">
  ${siteVerification}
  ${geoTags}`;
      
      const finalHtml = baseHtml.replace('</head>', `${headInjection}\n</head>`);
      return res.send(finalHtml);
    } catch (e) {
      console.error('SSR Error', e);
      // Fallback below
    }
  }

  // Normal Users: Return the React SPA index.html
  if (fs.existsSync(indexPath)) {
    if (siteVerification) {
      try {
        let html = await fs.promises.readFile(indexPath, 'utf-8');
        html = html.replace('</head>', `  ${siteVerification}\n</head>`);
        return res.send(html);
      } catch (err) {
        return res.sendFile(indexPath);
      }
    }
    res.sendFile(indexPath);
  } else {
    // If running in dev mode where dist doesn't exist, just send a basic response or let Vite handle it
    res.send('Frontend is not built. Please run "npm run build" or use the Vite dev server on port 3000.');
  }
});

// Start server
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Rokn Elryan API Server running on http://localhost:${PORT}`);
      console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`🔐 Default admin: admin / admin123\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (!process.env.VERCEL) {
  start();
} else {
  // On Vercel, we don't start the server, but we MUST initialize the database!
  initDB().catch(console.error);
}

export default app;
