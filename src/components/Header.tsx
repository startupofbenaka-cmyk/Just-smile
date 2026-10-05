import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, MapPin, Menu, X, Shield, MessageSquare, ChevronRight, Lock } from 'lucide-react';
import { PageId, ClinicConfig } from '../types';
import { storageService } from '../services/storage';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  clinicConfig: ClinicConfig;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, clinicConfig, isAuthenticated }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveStatus, setLiveStatus] = useState(() => storageService.getLiveClinicStatus(clinicConfig));

  useEffect(() => {
    const update = () => {
      setLiveStatus(storageService.getLiveClinicStatus(clinicConfig));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [clinicConfig]);

  const navLinks: { id: PageId; label: string; highlight?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Treatments & Services' },
    { id: 'contact', label: 'Contact & Location' },
    { id: 'book', label: 'Book Appointment', highlight: true }
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Bar for Location, Live Hours and Quick Call */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Location & Landmark */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Girinagar, Bengaluru</span>
              <span className="hidden sm:inline text-slate-400 font-normal">({clinicConfig.landmark})</span>
            </span>

            {/* Live Open / Closed indicator */}
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-700">
              <span className={`w-2 h-2 rounded-full ${
                liveStatus.badgeColor === 'emerald' ? 'bg-emerald-400 animate-pulse' :
                liveStatus.badgeColor === 'amber' ? 'bg-amber-400' : 'bg-slate-400'
              }`} />
              <span className="text-slate-200 font-semibold">{liveStatus.statusText}</span>
              <span className="text-slate-400 font-normal">• {liveStatus.subText}</span>
            </div>
          </div>

          {/* Quick contact and Admin shortcut */}
          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
              title="Call Reception"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span className="font-semibold">{clinicConfig.primaryPhone}</span>
            </a>

            <a
              href={`https://wa.me/${clinicConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Just%20Smile%20Dental%20Clinic,%20I%20would%20like%20to%20inquire%20about%20an%20appointment`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>

            {/* Admin Panel button */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                currentPage === 'admin'
                  ? 'bg-blue-600 text-white font-semibold'
                  : isAuthenticated
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Clinic Staff & Admin Portal"
            >
              <Lock className={`w-3 h-3 ${isAuthenticated ? 'text-emerald-400' : 'text-sky-400'}`} />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Sign In'}</span>
              {isAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Clinic Brand & Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl p-1 transition-opacity hover:opacity-95"
            aria-label="Just Smile Dental Clinic - Home"
          >
            <BrandLogo size="md" variant="dark" />
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="ml-2 inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                    isActive
                      ? 'text-blue-900 bg-blue-50/80 font-bold'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => handleNavClick('book')}
              className="bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-base font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                </button>
              );
            })}

            <div className="my-2 border-t border-slate-100" />

            {/* Mobile Admin Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm text-left transition-colors ${
                currentPage === 'admin'
                  ? 'bg-slate-900 text-white font-semibold'
                  : isAuthenticated
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className={`w-4 h-4 ${isAuthenticated ? 'text-emerald-600' : 'text-sky-600'}`} />
                <span>{isAuthenticated ? 'Admin Dashboard (Active)' : 'Admin Sign In (Staff Only)'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Quick Contact buttons in mobile menu */}
            <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <a
                href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-3 rounded-lg text-sm"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call Clinic</span>
              </a>
              <a
                href={`https://wa.me/${clinicConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Just%20Smile%20Dental%20Clinic`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold py-2.5 px-3 rounded-lg text-sm"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
