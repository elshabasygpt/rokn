import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  schema?: any;
}

export default function SEO({ title, description, schema }: SEOProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const baseUrl = 'https://www.roknelryan.com'; // Replace with real domain when live
  
  // Clean pathname without trailing slash
  const path = location.pathname.endsWith('/') && location.pathname.length > 1 
    ? location.pathname.slice(0, -1) 
    : location.pathname;

  // Assuming /en/... for English and default for Arabic
  const isEn = location.pathname.startsWith('/en');
  const basePath = isEn ? path.replace('/en', '') || '/' : path;

  const urlAr = `${baseUrl}${basePath}`;
  const urlEn = `${baseUrl}/en${basePath === '/' ? '' : basePath}`;
  const currentUrl = `${baseUrl}${path}`;

  return (
    <Helmet>
      <html lang={i18n.language} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} />
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical Tag */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Hreflang Tags for Multi-language SEO */}
      <link rel="alternate" hrefLang="ar" href={urlAr} />
      <link rel="alternate" hrefLang="en" href={urlEn} />
      <link rel="alternate" hrefLang="x-default" href={urlAr} />

      {/* Open Graph / Social Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_SA' : 'en_US'} />
      <meta property="og:locale:alternate" content={i18n.language === 'ar' ? 'en_US' : 'ar_SA'} />

      {/* Structured Data (Schema Markup) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
