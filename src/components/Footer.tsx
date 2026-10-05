import React, { useState } from 'react';
import { PageId, ClinicConfig } from '../types';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake, ChevronRight, X, Sparkles, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  clinicConfig: ClinicConfig;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, clinicConfig }) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const handleLink = (page: PageId) => {
    onNavigate(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-24 md:pb-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
            {/* Column 1: Clinic Overview & Landmark */}
            <div className="space-y-4">
              <BrandLogo size="md" variant="light" />

              <p className="text-sm text-slate-300 leading-relaxed">
                Modern, comfortable, and personalized dental care for you and your family in Girinagar, South Bengaluru. Prioritizing sterilization, gentle treatments, and genuine patient trust.
              </p>

              <div className="pt-2 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    Near Narayana PU College, 50 Feet Main Road, Girinagar 1st Phase, Bengaluru, Karnataka 560085
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                    {clinicConfig.primaryPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 font-heading">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button onClick={() => handleLink('home')} className="hover:text-white transition-colors flex items-center gap-1.5 text-left">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                    <span>Home</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('about')} className="hover:text-white transition-colors flex items-center gap-1.5 text-left">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                    <span>About Us & Sterilization</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('services')} className="hover:text-white transition-colors flex items-center gap-1.5 text-left">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                    <span>Treatments & Services</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('book')} className="text-sky-300 font-medium hover:text-white transition-colors flex items-center gap-1.5 text-left">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    <span>Book an Appointment</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('contact')} className="hover:text-white transition-colors flex items-center gap-1.5 text-left">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                    <span>Patient Reviews & FAQs</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('contact')} className="hover:text-white transition-colors flex items-center gap-1.5 text-left">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                    <span>Contact & Location</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Clinic Timings */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 font-heading flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Clinic Timings</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <p className="font-semibold text-white">Monday – Saturday</p>
                  <p className="text-slate-300 flex justify-between">
                    <span>Morning Session:</span>
                    <span className="font-medium text-sky-300">09:30 AM – 01:30 PM</span>
                  </p>
                  <p className="text-slate-300 flex justify-between">
                    <span>Evening Session:</span>
                    <span className="font-medium text-sky-300">04:30 PM – 08:30 PM</span>
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <p className="font-semibold text-white">Sunday</p>
                  <p className="text-slate-300 flex justify-between">
                    <span>Morning Only:</span>
                    <span className="font-medium text-amber-300">10:00 AM – 01:00 PM</span>
                  </p>
                  <p className="text-xs text-slate-400">Evening: Closed</p>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  * Appointments receive priority. Walk-ins welcomed during open hours.
                </p>
              </div>
            </div>

            {/* Column 4: Local Care Commitment */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2 font-heading">
                Girinagar Dental Care
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dedicated to serving local residents of Girinagar, Banashankari, Hanumanthanagar, and students & faculty at Narayana PU College.
              </p>
              <div className="p-3 rounded-lg bg-blue-950/50 border border-blue-900/60 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400" />
                  <span>100% Steam Cleaned Tools</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Every tool is cleaned with hot hospital steam and sealed in clean bags before use.
                </p>
              </div>

              {/* Staff Portal Link */}
              <div className="pt-2">
                <button
                  onClick={() => handleLink('admin')}
                  className="text-xs text-slate-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 text-sky-400" />
                  <span>Staff Sign In (Admin)</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Just Smile Dental Clinic. All rights reserved. Girinagar, Bengaluru, Karnataka.
            </p>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setLegalModal('privacy')}
                className="hover:text-slate-200 transition-colors underline underline-offset-4"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setLegalModal('terms')}
                className="hover:text-slate-200 transition-colors underline underline-offset-4"
              >
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Dialog Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setLegalModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {legalModal === 'privacy' ? (
              <div className="space-y-4 text-slate-700 text-sm">
                <h3 className="text-xl font-bold font-heading text-slate-900">Privacy Policy</h3>
                <p className="text-xs text-slate-500">Just Smile Dental Clinic • Girinagar, Bengaluru</p>
                <p>
                  At Just Smile Dental Clinic, we hold your personal and medical privacy with utmost seriousness. This policy outlines how we handle patient data provided through our appointment booking system.
                </p>
                <h4 className="font-semibold text-slate-900">1. Information We Collect</h4>
                <p>
                  We collect your name, phone number, email address, preferred appointment time, and relevant dental symptoms to organize clinical schedules and communicate appointment reminders.
                </p>
                <h4 className="font-semibold text-slate-900">2. Confidentiality & Medical Ethics</h4>
                <p>
                  Your contact details and clinical records are kept strictly confidential in accordance with the Dental Council of India ethical guidelines. We never sell, lease, or share patient data with commercial third-party marketing entities.
                </p>
                <h4 className="font-semibold text-slate-900">3. Contact & Opt-Out</h4>
                <p>
                  If you wish to update or delete your enquiry records, you may notify our reception at contact@justsmiledental.in or call +91 80 2672 4589.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-slate-700 text-sm">
                <h3 className="text-xl font-bold font-heading text-slate-900">Terms & Conditions</h3>
                <p className="text-xs text-slate-500">Just Smile Dental Clinic • Girinagar, Bengaluru</p>
                <p>
                  By utilizing the online booking service of Just Smile Dental Clinic, you acknowledge and agree to the following clinic guidelines:
                </p>
                <h4 className="font-semibold text-slate-900">1. Appointment Requests</h4>
                <p>
                  Online booking forms represent an appointment request. While we endeavor to honor your selected time slot, final confirmation is communicated by our clinic team via WhatsApp or telephone based on operational chair availability.
                </p>
                <h4 className="font-semibold text-slate-900">2. Consultation & Individual Treatment</h4>
                <p>
                  Information on this website serves educational purposes and cannot substitute for a direct, in-person clinical oral examination. Treatment plans and costs are determined after thorough chairside diagnosis by our dental professionals.
                </p>
                <h4 className="font-semibold text-slate-900">3. Cancellations & Rescheduling</h4>
                <p>
                  If you are unable to attend your appointment, we request at least 2 hours prior notice so that emergency patients may be accommodated.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
