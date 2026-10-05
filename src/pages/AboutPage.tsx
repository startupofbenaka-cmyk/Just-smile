import React from 'react';
import { PageId, ClinicConfig } from '../types';
import {
  ShieldCheck,
  Heart,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
  CheckCircle,
  Stethoscope,
  Microscope,
  Award,
  Layers,
  FileCheck
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  clinicConfig: ClinicConfig;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, clinicConfig }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-800/80 border border-blue-600/70 text-sky-200 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>Friendly Family Dental Care</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading leading-tight">
              Gentle, Friendly and Honest Dental Care in Girinagar.
            </h1>

            <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
              At Just Smile Dental Clinic, we make sure going to the dentist is gentle, comfortable, and painless. We treat you like family, explain everything simply, and keep all our tools super clean.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-blue-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                Near Narayana PU College, Girinagar, Bengaluru
              </span>
              <span>•</span>
              <span>Zero-Fear Dentistry</span>
              <span>•</span>
              <span>100% Clean Tools</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Care Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-800 font-heading">
                How We Take Care of You
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
                A Kind, Patient-First Clinic
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Many people feel nervous about visiting a dentist because they fear pain or fear being scolded. We promise you will always be treated with kindness, respect, and a gentle smile here.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We take all the time needed to check your teeth without rushing. We show you your teeth on a screen and explain what is happening in simple words that anyone can understand.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Honest Advice with No Pressure</h4>
                  <p className="text-xs text-slate-600">We tell you clearly what your teeth need right now, what can wait, and what you can do at home. We never force extra treatments.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Gentle Numbing & Painless Care</h4>
                  <p className="text-xs text-slate-600">We use gentle sweet-flavored numbing gel before any procedure so you do not feel uncomfortable.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Clear and Fair Prices</h4>
                  <p className="text-xs text-slate-600">No surprise costs. Everything is explained clearly before we begin.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=900&q=80"
                alt="Doctor gently explaining tooth pictures to a patient"
                className="w-full h-80 sm:h-96 object-cover object-center"
              />
              <div className="p-4 bg-slate-900 text-white text-xs flex items-center justify-between">
                <span>Gentle Check-up & Explanation</span>
                <span className="text-sky-300 font-semibold">Girinagar Clinic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Strict 4-Step Cleaning & Germ Protection */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 font-heading">
              100% Clean & Safe
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              How We Keep Every Tool Clean & Germ-Free
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Your safety comes first. Every tool we use goes through a 4-step cleaning process so it is as clean and fresh as new before it ever touches your mouth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900/80 text-sky-300 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-base text-white font-heading">
                Deep Water Wash
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Right after each visit, tools are washed in a special vibrating water bath that removes even the tiniest specks of dirt.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900/80 text-sky-300 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-base text-white font-heading">
                Sealed in Clean Bags
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The tools are dried and tightly sealed inside individual medical pouches so air and dust cannot touch them.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900/80 text-sky-300 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-base text-white font-heading">
                High-Heat Steaming
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The sealed bags are placed inside a hospital-grade steam machine that gets super hot (134°C) to kill 100% of all bacteria and germs.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900/80 text-sky-300 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-bold text-base text-white font-heading">
                Opened In Front of You
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The sealed clean pouch is only opened right before your eyes when you sit on the dental chair.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>We use brand-new disposable cups, gloves, and bibs for every single visitor. Nothing is shared.</span>
            </div>
            <button
              onClick={() => onNavigate('book')}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Book an Appointment
            </button>
          </div>
        </div>
      </section>

      {/* 4. Modern Gentle Equipment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-800 font-heading">
            Gentle Equipment
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Modern Tools That Make Visits Easy
          </h2>
          <p className="text-slate-600 text-sm">
            Modern tools mean faster treatments, less waiting, and zero discomfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Microscope className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-heading">Safe Digital Tooth Pictures</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Takes instant tooth pictures on a screen so you can see your teeth up close with very low, safe digital light.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sky-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-heading">Gentle Water Spray Scaler</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Uses gentle water spray and soft vibrations to wash away hardened dirt without scraping or hurting your teeth.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-heading">Quiet Pain-Relief Instruments</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Quiet and gentle modern tools to clear out bad toothaches quickly without loud scary sounds.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Serving Girinagar & South Bengaluru */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Your Neighborhood Clinic
            </span>
            <h3 className="text-2xl font-bold text-slate-900 font-heading">
              Right Near Narayana PU College in Girinagar
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Located on 50 Feet Main Road, we are right around the corner for families, college students, and neighbors in Girinagar, Hanumanthanagar, and Banashankari.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('book')}
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-3.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-blue-800" />
              <span>View Location & Hours</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
