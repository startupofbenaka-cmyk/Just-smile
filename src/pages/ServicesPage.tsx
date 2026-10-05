import React, { useState } from 'react';
import { PageId, DentalService, ServiceCategory, ClinicConfig } from '../types';
import { INITIAL_SERVICES } from '../data/clinicData';
import {
  Stethoscope,
  Sparkles,
  Smile,
  ShieldCheck,
  Activity,
  Crown,
  Syringe,
  HeartPulse,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone,
  HelpCircle
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: PageId, serviceId?: string) => void;
  clinicConfig: ClinicConfig;
  preselectedServiceId?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, clinicConfig, preselectedServiceId }) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(preselectedServiceId || null);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-blue-700" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-sky-700" />;
      case 'Smile': return <Smile className="w-6 h-6 text-amber-700" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-700" />;
      case 'Activity': return <Activity className="w-6 h-6 text-rose-700" />;
      case 'Crown': return <Crown className="w-6 h-6 text-indigo-700" />;
      case 'Syringe': return <Syringe className="w-6 h-6 text-purple-700" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-cyan-700" />;
      default: return <Stethoscope className="w-6 h-6 text-blue-700" />;
    }
  };

  const filteredServices = selectedCategory === 'all'
    ? INITIAL_SERVICES
    : INITIAL_SERVICES.filter(s => s.category === selectedCategory);

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: 'All Treatments' },
    { id: 'preventive', label: 'Cleaning & Check-Up' },
    { id: 'restorative', label: 'Fillings & Pain Relief' },
    { id: 'cosmetic', label: 'Teeth Brightening' },
    { id: 'specialized', label: 'Tooth Removal' },
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 font-heading">
              Girinagar Dental Treatments
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading">
              Our Dental Treatments & Services
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every treatment is done with gentle hands, 100% clean tools, and clear explanations so you always feel safe and comfortable.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                selectedCategory === cat.id
                  ? 'bg-blue-800 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredServices.map((svc) => {
            const isExpanded = expandedServiceId === svc.id;

            return (
              <div
                key={svc.id}
                id={`service-${svc.id}`}
                className={`bg-white rounded-2xl border transition-all p-6 sm:p-8 flex flex-col justify-between ${
                  isExpanded
                    ? 'border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'border-slate-200/90 shadow-xs hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {getServiceIcon(svc.iconName)}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>~{svc.durationMinutes} min</span>
                      </span>
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {svc.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-heading mb-2">
                    {svc.name}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {svc.shortDesc}
                  </p>

                  {/* Expanded view or details toggle */}
                  {isExpanded ? (
                    <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200 text-xs text-slate-700">
                      <p className="leading-relaxed">
                        {svc.fullDesc}
                      </p>

                      <div className="p-3 bg-blue-50/70 rounded-xl space-y-1">
                        <p className="font-bold text-blue-900">Good for:</p>
                        <p className="text-slate-700">{svc.recommendedFor}</p>
                      </div>

                      <div>
                        <p className="font-bold text-slate-900 mb-2">Why This Helps You:</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {svc.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setExpandedServiceId(isExpanded ? null : svc.id)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    {isExpanded ? 'Show less' : 'Read more details'}
                  </button>

                  <button
                    onClick={() => onNavigate('book', svc.id)}
                    className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Consultation Standard & Medical Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-600">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm mb-1">
                Our Promise to You
              </p>
              <p className="leading-relaxed">
                Every person's teeth are unique. We examine your teeth kindly, tell you the honest truth about what you need, and never do any treatment without your full permission.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-blue-800 bg-white border border-slate-300 px-4 py-2 rounded-lg"
            >
              <Phone className="w-3.5 h-3.5 text-blue-800" />
              <span>Ask a Question</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
