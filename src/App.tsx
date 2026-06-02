/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MarketingTags from './components/MarketingTags';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import EnterpriseQuote from './pages/EnterpriseQuote';
import Fleet from './pages/Fleet';
import Careers from './pages/Careers';

// Admin imports
import { AuthProvider, useAuth } from './admin/context/AuthContext';
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ServicesManager from './admin/ServicesManager';
import FleetManager from './admin/FleetManager';
import GalleryManager from './admin/GalleryManager';
import TestimonialsManager from './admin/TestimonialsManager';
import BookingsManager from './admin/BookingsManager';
import SettingsManager from './admin/SettingsManager';
import PartnersManager from './admin/PartnersManager';
import FaqManager from './admin/FaqManager';
import ArticlesManager from './admin/ArticlesManager';
import RolesManager from './admin/RolesManager';
import PagesManager from './admin/PagesManager';
import CareersManager from './admin/CareersManager';

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
      </AuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}
