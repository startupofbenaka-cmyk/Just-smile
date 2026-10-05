import React, { useState, useEffect } from 'react';
import { PageId, ClinicConfig, PreferredContact, AppointmentRequest } from '../types';
import { INITIAL_SERVICES, AVAILABLE_TIME_SLOTS } from '../data/clinicData';
import { storageService } from '../services/storage';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  MapPin,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface BookingPageProps {
  onNavigate: (page: PageId) => void;
  clinicConfig: ClinicConfig;
  initialServiceId?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onNavigate, clinicConfig, initialServiceId }) => {
  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || INITIAL_SERVICES[0].id
  );
  
  // Tomorrow's date as default preferred date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 45);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:15 AM');
  
  // Patient details
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<PreferredContact>('whatsapp');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedRequest, setConfirmedRequest] = useState<AppointmentRequest | null>(null);

  // If initialServiceId changed via props
  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  // Check if selected date is Sunday
  const isSelectedDateSunday = () => {
    if (!selectedDate) return false;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.getDay() === 0;
  };

  // Adjust time slot if Sunday has no evening slots
  useEffect(() => {
    if (isSelectedDateSunday()) {
      // If an evening slot was selected, fall back to a morning slot
      const isEvening = selectedTimeSlot.includes('PM') && !selectedTimeSlot.startsWith('12');
      if (isEvening) {
        setSelectedTimeSlot('10:15 AM');
      }
    }
  }, [selectedDate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Name
    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters.';
    }

    // Phone (10 digits Indian format)
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    const indianMobileRegex = /^(?:91)?[6-9]\d{9}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required for appointment confirmation.';
    } else if (!indianMobileRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g., 9845012345).';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required for sending appointment details.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Date
    if (!selectedDate) {
      newErrors.date = 'Please select a preferred date.';
    } else if (selectedDate < minDateString) {
      newErrors.date = 'Preferred date cannot be in the past.';
    }

    // Time Slot
    if (!selectedTimeSlot) {
      newErrors.timeSlot = 'Please choose a preferred time slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const selectedService = INITIAL_SERVICES.find(s => s.id === selectedServiceId);
      const serviceName = selectedService ? selectedService.name : 'General Consultation';

      const created = await storageService.createAppointment({
        patientName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        serviceId: selectedServiceId,
        serviceName,
        preferredDate: selectedDate,
        timeSlot: selectedTimeSlot,
        preferredContact,
        isFirstVisit,
        message: message.trim() || undefined
      });

      setConfirmedRequest(created);
      window.scrollTo(0, 0);
    } catch {
      setErrors({ form: 'An unexpected issue occurred while submitting your request. Please call the clinic directly at +91 80 2672 4589.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for Google Calendar Link
  const generateGoogleCalendarLink = (req: AppointmentRequest) => {
    const title = encodeURIComponent(`Dental Appointment: ${req.serviceName} at Just Smile Dental Clinic`);
    const details = encodeURIComponent(
      `Appointment Request Reference: ${req.id}\nPatient: ${req.patientName}\nClinic: Just Smile Dental Clinic, Girinagar, Bengaluru (Near Narayana PU College)\nPhone: +91 80 2672 4589`
    );
    const location = encodeURIComponent('Just Smile Dental Clinic, Near Narayana PU College, Girinagar, Bengaluru, Karnataka 560085');
    
    // Simple date time string
    const dateFormatted = req.preferredDate.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T043000Z/${dateFormatted}T053000Z`;
  };

  // Helper for WhatsApp Share
  const generateWhatsAppUrl = (req: AppointmentRequest) => {
    const text = encodeURIComponent(
      `Hello Just Smile Dental Clinic, I have submitted an appointment request on your website.\n\n*Reference ID:* ${req.id}\n*Name:* ${req.patientName}\n*Treatment:* ${req.serviceName}\n*Date:* ${req.preferredDate}\n*Time:* ${req.timeSlot}\n\nPlease confirm availability for this slot. Thank you!`
    );
    return `https://wa.me/${clinicConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`;
  };

  // SUCCESS CONFIRMATION SCREEN
  if (confirmedRequest) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-sky-900 p-6 sm:p-10 text-white text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto border border-white/20">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>

            <span className="text-xs uppercase tracking-widest font-extrabold text-sky-300">
              Request Logged Successfully
            </span>

            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Appointment Request Received!
            </h1>

            <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
              Thank you for contacting Just Smile Dental Clinic. Our team will review the doctor's schedule and confirm your appointment shortly.
            </p>

            <div className="inline-block bg-white/15 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-mono tracking-wider font-semibold border border-white/25 mt-2">
              Reference Code: <span className="text-sky-300 font-bold">{confirmedRequest.id}</span>
            </div>
          </div>

          {/* Details Card */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider font-heading pb-2 border-b border-slate-200">
                Summary of Requested Visit
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">Patient Name:</span>
                  <span className="font-bold text-slate-800">{confirmedRequest.patientName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs">Requested Treatment:</span>
                  <span className="font-bold text-blue-900">{confirmedRequest.serviceName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs">Preferred Date:</span>
                  <span className="font-bold text-slate-800">
                    {new Intl.DateTimeFormat('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }).format(new Date(confirmedRequest.preferredDate))}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs">Preferred Time:</span>
                  <span className="font-bold text-slate-800">{confirmedRequest.timeSlot}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs">Contact Phone:</span>
                  <span className="font-bold text-slate-800">{confirmedRequest.phone}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs">Preferred Confirmation:</span>
                  <span className="font-bold capitalize text-slate-800">Via {confirmedRequest.preferredContact}</span>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm font-heading">What happens next?</h4>
              <ol className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                  <span>Our reception team checks the dentist's sterilizer and chair availability in Girinagar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                  <span>You will receive an official confirmation call or WhatsApp message within 30 to 45 minutes during operating hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                  <span>Please arrive 5 to 10 minutes early at our clinic near Narayana PU College.</span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
              <a
                href={generateWhatsAppUrl(confirmedRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Clinic on WhatsApp</span>
              </a>

              <a
                href={generateGoogleCalendarLink(confirmedRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-slate-300"
              >
                <CalendarIcon className="w-4 h-4 text-blue-800" />
                <span>Add to Calendar</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setConfirmedRequest(null);
                  setFullName('');
                  setPhone('');
                  setEmail('');
                  setMessage('');
                }}
                className="text-xs text-blue-800 font-semibold hover:underline"
              >
                Book another appointment
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <span>View clinic directions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Banner */}
      <div className="mb-8 space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold">
          <CalendarIcon className="w-3.5 h-3.5 text-blue-700" />
          <span>Easy Appointment Booking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
          Book an Appointment
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
          Pick the day and time that works best for you. Our friendly clinic team in Girinagar will call or message you quickly to confirm!
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Form notice */}
        <div className="bg-blue-50 border-b border-blue-100 p-4 sm:px-8 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>Note:</strong> We will send you a quick WhatsApp message or call from our Girinagar reception to confirm your visit.
            </span>
          </div>
          <span className="hidden md:inline font-semibold text-blue-800">
            Near Narayana PU College
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8" noValidate>
          {errors.form && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Step 1: Select Treatment */}
          <div className="space-y-3" id="serviceSection">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs">1</span>
                <span>Choose What You Need Help With *</span>
              </label>
              <span className="text-xs text-slate-500">Pick one</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_SERVICES.map((svc) => {
                const isSelected = selectedServiceId === svc.id;
                return (
                  <button
                    type="button"
                    key={svc.id}
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                      isSelected ? 'border-blue-700 bg-blue-700' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>

                    <div className="space-y-0.5">
                      <p className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                        {svc.name}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {svc.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Date & Available Time Slot */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs">2</span>
                <span>Pick a Day & Time *</span>
              </label>
              <span className="text-xs text-slate-500">Open clinic slots</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* Date Input */}
              <div className="sm:col-span-5 space-y-1.5" id="date">
                <label className="text-xs font-semibold text-slate-700 block">
                  Choose Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={minDateString}
                    max={maxDateString}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                {errors.date && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.date}</p>
                )}
                {isSelectedDateSunday() && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    Sunday Schedule: Morning slots only (10:00 AM - 01:00 PM).
                  </p>
                )}
              </div>

              {/* Time Slot Picker */}
              <div className="sm:col-span-7 space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Choose a Time Slot
                </label>

                {/* Morning Slots */}
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Morning Sessions
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_TIME_SLOTS.filter(s => s.period === 'Morning').map((slot) => {
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          type="button"
                          key={slot.time}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-blue-800 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening Slots (Hidden if Sunday) */}
                {!isSelectedDateSunday() ? (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Evening Sessions
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {AVAILABLE_TIME_SLOTS.filter(s => s.period === 'Evening').map((slot) => {
                        const isSelected = selectedTimeSlot === slot.time;
                        return (
                          <button
                            type="button"
                            key={slot.time}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-blue-800 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    Evening clinics closed on Sundays for hospital deep cleaning.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Patient Information */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center text-xs">3</span>
                <span>Your Contact Details *</span>
              </label>
              <span className="text-xs text-slate-500">Safe and private</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5" id="fullName">
                <label className="text-xs font-semibold text-slate-700 block">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:outline-none ${
                      errors.fullName
                        ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/30'
                        : 'border-slate-300 focus:ring-blue-600 text-slate-900'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5" id="phone">
                <label className="text-xs font-semibold text-slate-700 block">
                  Mobile Number (for SMS & WhatsApp Confirmation) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-semibold text-xs">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:outline-none ${
                      errors.phone
                        ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/30'
                        : 'border-slate-300 focus:ring-blue-600 text-slate-900'
                    }`}
                  />
                </div>
                {errors.phone ? (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.phone}</p>
                ) : (
                  <p className="text-[10px] text-slate-400">Enter standard 10-digit Indian mobile number.</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5" id="email">
                <label className="text-xs font-semibold text-slate-700 block">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:outline-none ${
                      errors.email
                        ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/30'
                        : 'border-slate-300 focus:ring-blue-600 text-slate-900'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Preferred Contact Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  How should we contact you?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferredContact('whatsapp')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                      preferredContact === 'whatsapp'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredContact('call')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                      preferredContact === 'call'
                        ? 'bg-blue-50 border-blue-500 text-blue-800'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phone Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredContact('email')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                      preferredContact === 'email'
                        ? 'bg-slate-100 border-slate-500 text-slate-800'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-600" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>

            {/* First time patient toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFirstVisit}
                  onChange={(e) => setIsFirstVisit(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-800 focus:ring-blue-600 border-slate-300"
                />
                <span className="text-xs font-medium text-slate-700">
                  This will be my first visit to Just Smile Dental Clinic in Girinagar
                </span>
              </label>
            </div>

            {/* Optional Symptoms / Message */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Any specific symptoms or questions? (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Sensitivity to cold water on upper right side, pain while chewing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No cancellation fee • We respect your time</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <CalendarIcon className="w-5 h-5" />
                  <span>Submit Appointment Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
