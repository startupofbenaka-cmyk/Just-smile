import React, { useState } from 'react';
import { PageId, ClinicConfig, FAQItem } from '../types';
import { CLINIC_FAQS } from '../data/clinicData';
import { storageService } from '../services/storage';
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  ExternalLink,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Car,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageId) => void;
  clinicConfig: ClinicConfig;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, clinicConfig }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const liveStatus = storageService.getLiveClinicStatus(clinicConfig);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 font-heading">
              Girinagar, Bengaluru
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading">
              Visit Just Smile Dental Clinic
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Conveniently located near Narayana PU College on 50 Feet Main Road in Girinagar. Reach out to book your visit or get prompt answers to your dental questions.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Primary Contact & Real-time Schedule Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Clinic Phone & WhatsApp */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Direct Clinic Numbers
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Call our reception directly for appointments, questions, or sudden toothache during clinic hours.
              </p>

              <div className="space-y-2.5 pt-2">
                <a
                  href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-800" />
                    <span>Primary: {clinicConfig.primaryPhone}</span>
                  </span>
                  <span className="text-blue-800 font-medium">Call now</span>
                </a>

                <a
                  href={`https://wa.me/${clinicConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Just%20Smile%20Dental%20Clinic,%20I%20have%20an%20enquiry`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-900 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp: {clinicConfig.whatsappNumber}</span>
                  </span>
                  <span className="text-emerald-700 font-medium">Chat</span>
                </a>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Reception Desk: Mon–Sat 9:30 AM – 8:30 PM
            </div>
          </div>

          {/* Card 2: Location & Landmark */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-sky-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Address & Landmark
              </h3>
              
              <div className="space-y-2 text-xs text-slate-700">
                <p className="font-bold text-slate-900 text-sm">
                  Girinagar, Bengaluru, Karnataka
                </p>
                <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-100 font-semibold text-blue-900">
                  Landmark: {clinicConfig.landmark}
                </div>
                <p className="leading-relaxed text-slate-600">
                  {clinicConfig.fullAddress}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                <p className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Ample two-wheeler & roadside four-wheeler parking</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>5 mins from Avalahalli BDA Park & Hanumanthanagar</span>
                </p>
              </div>
            </div>

            <a
              href={clinicConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Google Maps App</span>
            </a>
          </div>

          {/* Card 3: Real-Time Clinic Timings */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-700" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Clinic Hours
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  liveStatus.badgeColor === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                  liveStatus.badgeColor === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {liveStatus.statusText}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">Monday to Saturday</span>
                  <div className="flex justify-between text-slate-600">
                    <span>Morning Session:</span>
                    <span className="font-semibold text-slate-900">09:30 AM – 01:30 PM</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Evening Session:</span>
                    <span className="font-semibold text-slate-900">04:30 PM – 08:30 PM</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
                  <span className="font-bold text-slate-900 block">Sunday (Morning Only)</span>
                  <div className="flex justify-between text-slate-600">
                    <span>Morning Session:</span>
                    <span className="font-semibold text-amber-900">10:00 AM – 01:00 PM</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">Evening: Closed for thorough cleaning</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('book')}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment Slot</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Interactive Location Section with Map Embed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-400 font-heading">
                Map & Directions
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading mt-1">
                Find Just Smile Dental Clinic in Girinagar
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                Near Narayana PU College, 50 Feet Main Road, Bengaluru.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={clinicConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
              >
                <Compass className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors border border-slate-700 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-sky-400" />
                <span>Call Clinic</span>
              </a>

              <button
                onClick={() => onNavigate('book')}
                className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Slot</span>
              </button>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-inner">
            <iframe
              title="Just Smile Dental Clinic Girinagar Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.58330752494!2d77.5413!3d12.9428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae159048a1a9f1%3A0x8e89f8d16f8ef1a0!2sGirinagar%2C%20Bengaluru%2C%20Karnataka%20560085!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-80 sm:h-96 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions (FAQ Section) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
            <span>Helpful Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Helpful answers to common questions about visiting Just Smile Dental Clinic.
          </p>
        </div>

        <div className="space-y-3">
          {CLINIC_FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 font-heading">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'bg-blue-800 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Dental Emergency Advisory */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1 text-xs text-amber-900">
            <p className="font-bold text-sm flex items-center gap-1.5 text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Sudden Bad Tooth Pain or Broken Tooth?</span>
            </p>
            <p className="leading-relaxed text-amber-800">
              If you broke a tooth, bumped a tooth while playing, or have sudden bad swelling, call our Girinagar clinic right away. If a permanent tooth was knocked out, place it in a cup of clean cold milk and visit us within 1 hour so our dentist can try to save it!
            </p>
          </div>

          <a
            href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shrink-0 whitespace-nowrap"
          >
            Call {clinicConfig.primaryPhone}
          </a>
        </div>
      </section>
    </div>
  );
};
