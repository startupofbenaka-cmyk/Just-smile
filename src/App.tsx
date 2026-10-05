/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, ClinicConfig } from './types';
import { storageService } from './services/storage';
import { authService, AuthSession } from './services/auth';
import { Header } from './components/Header';
import { MobileActionBar } from './components/MobileActionBar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { AdminSignInPage } from './pages/AdminSignInPage';
import { AlertCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig>(() => storageService.getClinicConfig());
  const [showNoticeBanner, setShowNoticeBanner] = useState<boolean>(true);
  // Admin dashboard requires sign in every session
  const [adminSession, setAdminSession] = useState<AuthSession | null>(null);

  // Sync title based on active page
  useEffect(() => {
    const titles: Record<PageId, string> = {
      home: 'Just Smile Dental Clinic | Girinagar, Bengaluru | Near Narayana PU College',
      about: 'About Us & Sterilization Standards | Just Smile Dental Clinic Girinagar',
      services: 'Dental Treatments & Services | Just Smile Dental Clinic Girinagar',
      book: 'Book Dental Appointment | Just Smile Dental Clinic Girinagar Bengaluru',
      contact: 'Visit Clinic, Map & FAQs | Just Smile Dental Clinic Girinagar',
      admin: adminSession
        ? `Admin Dashboard (${adminSession.user.name}) | Just Smile Dental Clinic`
        : 'Admin Sign In | Just Smile Dental Clinic Girinagar'
    };
    document.title = titles[currentPage] || titles.home;
  }, [currentPage, adminSession]);

  const handleNavigate = (page: PageId, serviceId?: string) => {
    setCurrentPage(page);
    if (serviceId) {
      setPreselectedServiceId(serviceId);
    }
    window.scrollTo(0, 0);
  };

  const handleUpdateClinicConfig = (newConfig: ClinicConfig) => {
    setClinicConfig(newConfig);
  };

  const handleAdminSignInSuccess = (session: AuthSession) => {
    setAdminSession(session);
  };

  const handleAdminSignOut = () => {
    authService.signOut();
    setAdminSession(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Special Announcement Banner if set by clinic owner */}
      {clinicConfig.specialNotice && showNoticeBanner && currentPage !== 'admin' && (
        <div className="bg-blue-900 text-white text-xs py-2 px-4 border-b border-blue-800 flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-center justify-center flex-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
            <span className="font-semibold text-sky-200">Clinic Notice:</span>
            <span>{clinicConfig.specialNotice}</span>
          </div>
          <button
            onClick={() => setShowNoticeBanner(false)}
            className="text-blue-300 hover:text-white p-1 rounded transition-colors ml-2"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Sticky Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        clinicConfig={clinicConfig}
        isAuthenticated={!!adminSession}
      />

      {/* Page Content View Router */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentPage === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                clinicConfig={clinicConfig}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                onNavigate={handleNavigate}
                clinicConfig={clinicConfig}
              />
            )}

            {currentPage === 'services' && (
              <ServicesPage
                onNavigate={handleNavigate}
                clinicConfig={clinicConfig}
                preselectedServiceId={preselectedServiceId}
              />
            )}

            {currentPage === 'book' && (
              <BookingPage
                onNavigate={handleNavigate}
                clinicConfig={clinicConfig}
                initialServiceId={preselectedServiceId}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage
                onNavigate={handleNavigate}
                clinicConfig={clinicConfig}
              />
            )}

            {currentPage === 'admin' && (
              adminSession ? (
                <AdminPage
                  onNavigate={handleNavigate}
                  clinicConfig={clinicConfig}
                  onUpdateClinicConfig={handleUpdateClinicConfig}
                  session={adminSession}
                  onSignOut={handleAdminSignOut}
                />
              ) : (
                <AdminSignInPage
                  onSuccess={handleAdminSignInSuccess}
                  onNavigatePublic={handleNavigate}
                  clinicConfig={clinicConfig}
                />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        clinicConfig={clinicConfig}
      />

      {/* Mobile Sticky Bottom Action Bar */}
      <MobileActionBar
        clinicConfig={clinicConfig}
        onBookClick={() => handleNavigate('book')}
        currentPage={currentPage}
      />
    </div>
  );
}
