import React from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { ClinicConfig, PageId } from '../types';

interface MobileActionBarProps {
  clinicConfig: ClinicConfig;
  onBookClick: () => void;
  currentPage: PageId;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ clinicConfig, onBookClick, currentPage }) => {
  // If we're on the admin page, do not show patient sticky bar
  if (currentPage === 'admin') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-2xl md:hidden safe-area-pb">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Call button */}
        <a
          href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-100 active:bg-slate-200 text-slate-800 transition-colors"
          aria-label="Call Just Smile Dental Clinic"
        >
          <Phone className="w-4 h-4 text-blue-800 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">Call</span>
        </a>

        {/* WhatsApp button */}
        <a
          href={`https://wa.me/${clinicConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Just%20Smile%20Dental%20Clinic,%20I%20would%20like%20to%20book%20an%20appointment`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-emerald-50 active:bg-emerald-100 text-emerald-800 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
        </a>

        {/* Book Appointment button */}
        <button
          onClick={onBookClick}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-blue-800 active:bg-blue-900 text-white shadow-xs transition-colors"
          aria-label="Book a Dental Appointment"
        >
          <Calendar className="w-4 h-4 text-sky-200 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">Book Slot</span>
        </button>
      </div>
    </div>
  );
};
