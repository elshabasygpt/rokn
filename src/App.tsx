/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MarketingTags from './components/MarketingTags';
import Layout from './components/Layout';

// Public Lazy Imports
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const EnterpriseQuote = lazy(() => import('./pages/EnterpriseQuote'));
const Fleet = lazy(() => import('./pages/Fleet'));
const Careers = lazy(() => import('./pages/Careers'));
const CityPage = lazy(() => import('./pages/CityPage'));
const IndustryPage = lazy(() => import('./pages/IndustryPage'));
const PayloadCalculator = lazy(() => import('./pages/PayloadCalculator'));

// Admin imports
import { AuthProvider, useAuth } from './admin/context/AuthContext';
const Login = lazy(() => import('./admin/Login'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const ServicesManager = lazy(() => import('./admin/ServicesManager'));
const FleetManager = lazy(() => import('./admin/FleetManager'));
const GalleryManager = lazy(() => import('./admin/GalleryManager'));
const TestimonialsManager = lazy(() => import('./admin/TestimonialsManager'));
const BookingsManager = lazy(() => import('./admin/BookingsManager'));
const SettingsManager = lazy(() => import('./admin/SettingsManager'));
const PartnersManager = lazy(() => import('./admin/PartnersManager'));
const FaqManager = lazy(() => import('./admin/FaqManager'));
const ArticlesManager = lazy(() => import('./admin/ArticlesManager'));
const RolesManager = lazy(() => import('./admin/RolesManager'));
const PagesManager = lazy(() => import('./admin/PagesManager'));
const CareersManager = lazy(() => import('./admin/CareersManager'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
    </div>
  );
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function AdminLoginRoute() {
  const { admin, isLoading } = useAuth();
  if (isLoading) return null;
  if (admin) return <Navigate to="/admin" replace />;
  return <Login />;
}

export default function App() {
  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.general?.favicon) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.general.favicon.startsWith('/') ? data.general.favicon : data.general.favicon;
        } else if (data.general?.logo) {
          // Fallback to main logo if favicon is not set
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.general.logo.startsWith('/') ? data.general.logo : data.general.logo;
        }
      })
      .catch(console.error);
  }, []);

  return (
    <HelmetProvider>
      <MarketingTags />
      <BrowserRouter>
        <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Site - Main Language (Arabic) */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="enterprise-quote" element={<EnterpriseQuote />} />
              <Route path="fleet" element={<Fleet />} />
              <Route path="careers" element={<Careers />} />
              <Route path="locations/:city" element={<CityPage />} />
              <Route path="industries/:industry" element={<IndustryPage />} />
              <Route path="calculator" element={<PayloadCalculator />} />
            </Route>

            {/* Public Site - English Language */}
            <Route path="/en" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="enterprise-quote" element={<EnterpriseQuote />} />
              <Route path="fleet" element={<Fleet />} />
              <Route path="careers" element={<Careers />} />
              <Route path="locations/:city" element={<CityPage />} />
              <Route path="industries/:industry" element={<IndustryPage />} />
              <Route path="calculator" element={<PayloadCalculator />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLoginRoute />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<BookingsManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="fleet" element={<FleetManager />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="partners" element={<PartnersManager />} />
              <Route path="faqs" element={<FaqManager />} />
              <Route path="articles" element={<ArticlesManager />} />
              <Route path="pages" element={<PagesManager />} />
              <Route path="careers" element={<CareersManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="roles" element={<RolesManager />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}
