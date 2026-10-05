import React from 'react';
import { PageId, ClinicConfig } from '../types';
import { INITIAL_SERVICES, VERIFIED_REVIEWS } from '../data/clinicData';
import { storageService } from '../services/storage';
import {
  Calendar,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Heart,
  Stethoscope,
  Smile,
  Shield,
  ArrowRight,
  ExternalLink,
  Star,
  Users,
  Award
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId, serviceId?: string) => void;
  clinicConfig: ClinicConfig;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, clinicConfig }) => {
  const liveStatus = storageService.getLiveClinicStatus(clinicConfig);
  const featuredServices = INITIAL_SERVICES.slice(0, 6);

  // Today's Date in India format
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-20 bg-gradient-to-b from-blue-50/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Subtle Location & Landmark Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-100/90 text-blue-900 border border-blue-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>Near Narayana PU College, Girinagar, Bengaluru</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-heading">
                Your Smile Deserves the <span className="text-blue-800">Best Dental Care.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Gentle, comfortable, and friendly dental care for you and your family in Girinagar, Bengaluru.
              </p>

              {/* Real-time Status Strip */}
              <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs shadow-xs">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  liveStatus.badgeColor === 'emerald' ? 'bg-emerald-500 animate-pulse' :
                  liveStatus.badgeColor === 'amber' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
                <span className="font-bold text-slate-800">{liveStatus.statusText}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{liveStatus.subText}</span>
                <span className="hidden sm:inline text-slate-400">• Today: {todayFormatted}</span>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => onNavigate('book')}
                  className="inline-flex items-center justify-center gap-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-blue-200"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book an Appointment</span>
                </button>

                <a
                  href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-base px-6 py-3.5 rounded-xl shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-800" />
                  <span>Call the Clinic</span>
                </a>

                <a
                  href={`https://wa.me/${clinicConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Just%20Smile%20Dental%20Clinic,%20I%20would%20like%20to%20book%20an%20appointment`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-semibold text-sm px-4 py-3.5 rounded-xl transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Trust Strip */}
              <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Care Just for You</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Gentle Tooth Care</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Super Clean Clinic</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Near Narayana PU College</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-blue-300/30 to-sky-200/40 rounded-3xl filter blur-xl opacity-70" />
                
                {/* Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80"
                    alt="Modern high-hygiene dental operatory at Just Smile Dental Clinic in Girinagar"
                    className="w-full h-80 sm:h-96 object-cover object-center"
                    loading="eager"
                  />
                  
                  {/* Floating Trust Card on Image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                        <ShieldCheck className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">100% Clean & Germ-Free Tools</p>
                        <p className="text-[11px] text-slate-500">Cleaned with heat and sealed in fresh packs</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-1 rounded">
                      Girinagar
                    </span>
                  </div>
                </div>

                {/* Rating card overlay */}
                <div className="hidden sm:flex absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-100 px-3.5 py-2.5 items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-left text-xs">
                    <span className="font-bold text-slate-900">4.9 / 5.0</span>
                    <p className="text-[10px] text-slate-500">Google Patient Rating</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST SECTION: Dental Care You Can Feel Confident About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-800 font-heading">
            Gentle, Safe & Clean
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Dental Care You Can Feel Confident About
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Visiting the dentist should never be scary. We make sure every visit is painless, super clean, and friendly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Friendly Patient Care */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs dental-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Friendly, Caring Doctors
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We listen kindly to what you feel, explain everything in simple words, and make sure you feel relaxed with zero rush.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-800">
              <span>Unrushed, gentle visits</span>
            </div>
          </div>

          {/* Card 2: Clean & Germ-Free Tools */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs dental-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-sky-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Super Clean & Safe Rooms
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every tool is washed, heat-cleaned, and sealed in clean bags. We open them right in front of you so you are 100% safe.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-sky-800">
              <span>100% clean & hygienic</span>
            </div>
          </div>

          {/* Card 3: Modern Gentle Tools */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs dental-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Modern & Painless Tools
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We use safe digital tooth pictures and gentle water sprays that clean teeth smoothly without scratching or hurting.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-800">
              <span>Gentle on teeth and gums</span>
            </div>
          </div>

          {/* Card 4: Experienced Dental Professionals */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs dental-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-cyan-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Gentle Hands & Expert Care
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our dentists have years of practice helping children, adults, and grandparents with a very gentle and kind touch.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-cyan-800">
              <span>Kind, trusted dentists</span>
            </div>
          </div>

          {/* Card 5: Clear Treatment Plans */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs dental-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Honest Advice, No Pressure
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We only suggest what your teeth truly need. We explain everything clearly first so you always know what to expect.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-800">
              <span>Honest & transparent</span>
            </div>
          </div>

          {/* Card 6: Convenient Location */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs dental-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Easy to Reach in Girinagar
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Located on 50 Feet Main Road in Girinagar, right near Narayana PU College. Easy to find with parking right outside.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-800">
              <span>Near Narayana PU College</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION SNAPSHOT */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-800 font-heading">
                Care For Your Whole Family
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
                Treatments & Dental Care
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                From regular tooth cleaning to fixing bad toothaches, our friendly clinic is ready for your entire family.
              </p>
            </div>

            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-950 font-bold text-sm bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-xs hover:shadow transition-all self-start md:self-auto"
            >
              <span>View All Treatments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((svc) => (
              <div
                key={svc.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between dental-card"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md">
                      {svc.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ~{svc.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">
                    {svc.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {svc.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('book', svc.id)}
                    className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1.5 focus:outline-none"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('services', svc.id)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Learn more
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency / Walk-in note */}
          <div className="mt-10 p-5 rounded-2xl bg-blue-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">Having sudden, bad tooth pain or a broken tooth?</p>
                <p className="text-xs text-blue-200">Call our Girinagar reception for same-day pain relief.</p>
              </div>
            </div>
            <a
              href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
            >
              Call {clinicConfig.primaryPhone}
            </a>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image & Highlights */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
                alt="Friendly dental consultation at Just Smile Dental Clinic Girinagar"
                className="w-full h-80 sm:h-96 object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">Patient Experience</span>
                <p className="text-base font-bold">Gentle Touch. Honest, Simple Advice.</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-800 font-heading">
                The Patient Experience
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
                Why Patients Choose Just Smile Dental Clinic
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                We believe going to the dentist shouldn't feel scary. Here is how we ensure your visit is comfortable and stress-free:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Comfortable Consultations</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quiet, gentle visits with soft, comfy chairs so you can sit back and relax.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Clear Communication</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We show you tooth pictures and explain everything in simple words in Kannada, English, or Hindi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Personalized Care</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Everyone's teeth are different. We only suggest what is truly best for your teeth and budget.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Easy Appointment Scheduling</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quick online booking, morning and evening timings, and fast WhatsApp replies.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-900 font-bold text-sm"
              >
                <span>See how we clean and sterilize all tools</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PATIENT REVIEWS: What Our Patients Say */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>4.9 / 5.0 Rating on Google</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              What Our Patients Say
            </h2>
            <p className="text-slate-600 text-sm">
              Authentic patient feedback from local Girinagar and South Bengaluru residents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERIFIED_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-600">{rev.date}</span>
                  </div>

                  <p className="text-slate-700 text-sm italic leading-relaxed">
                    "{rev.reviewText}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/70">
                  <p className="text-xs font-bold text-slate-900">{rev.patientName}</p>
                  <p className="text-[11px] text-blue-800 font-medium">{rev.serviceUsed}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{rev.source}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Genuine Review Notice & CTA */}
          <div className="mt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span>Have you visited Just Smile Dental Clinic recently?</span>
            <a
              href="https://maps.google.com/?q=Just+Smile+Dental+Clinic+Girinagar+Bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Write a Google Review</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. VISIT JUST SMILE DENTAL CLINIC (Location Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Location Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-700 text-sky-300 px-3 py-1 rounded-full text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Verified Clinic Location</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
                Visit Just Smile Dental Clinic
              </h2>

              <div className="space-y-3 text-slate-300 text-sm">
                <div>
                  <p className="text-base font-bold text-white">Girinagar, Bengaluru, Karnataka</p>
                  <p className="text-sky-300 font-semibold text-sm">Near Narayana PU College</p>
                </div>
                <p className="leading-relaxed">
                  {clinicConfig.fullAddress}
                </p>
              </div>

              {/* Operating Hours in Card */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-2">
                <p className="font-bold text-slate-200 uppercase tracking-wide">Daily Timings</p>
                <div className="flex justify-between text-slate-300">
                  <span>Mon – Sat:</span>
                  <span className="text-sky-300 font-medium">9:30 AM – 1:30 PM & 4:30 PM – 8:30 PM</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Sunday:</span>
                  <span className="text-amber-300 font-medium">10:00 AM – 1:00 PM (Morning Only)</span>
                </div>
              </div>

              {/* Buttons: Get Directions, Call, Appointment */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={clinicConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors shadow-sm"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors border border-slate-700"
                >
                  <Phone className="w-4 h-4 text-sky-400" />
                  <span>Call {clinicConfig.primaryPhone}</span>
                </a>

                <button
                  onClick={() => onNavigate('book')}
                  className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>

            {/* Embedded Visual Map Preview */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 relative shadow-inner">
                {/* Embed Map iframe */}
                <iframe
                  title="Just Smile Dental Clinic Girinagar Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.58330752494!2d77.5413!3d12.9428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae159048a1a9f1%3A0x8e89f8d16f8ef1a0!2sGirinagar%2C%20Bengaluru%2C%20Karnataka%20560085!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-72 sm:h-80 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* Map Overlay Badge */}
                <div className="p-3 bg-slate-900/90 text-xs border-t border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-200 font-medium">Girinagar 1st Phase, Bengaluru</span>
                  </div>
                  <a
                    href={clinicConfig.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Open in Maps App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FINAL CONVERSION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl space-y-6">
          <span className="text-xs uppercase tracking-widest font-extrabold text-sky-300 font-heading">
            Book Your Visit Today
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-heading max-w-2xl mx-auto">
            Ready for a Healthier, Brighter Smile?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Book your visit online in less than a minute or give us a quick call. We are here to keep your family smiling with gentle, clean care.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate('book')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-blue-900 font-bold text-base px-8 py-3.5 rounded-xl shadow-lg transition-all"
            >
              <Calendar className="w-5 h-5 text-blue-800" />
              <span>Book an Appointment</span>
            </button>

            <a
              href={`tel:${clinicConfig.primaryPhone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-950/70 hover:bg-blue-950 text-white border border-blue-400/40 font-semibold text-base px-7 py-3.5 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4 text-sky-300" />
              <span>Call: {clinicConfig.primaryPhone}</span>
            </a>

            <a
              href={`https://wa.me/${clinicConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Just%20Smile%20Dental%20Clinic`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
