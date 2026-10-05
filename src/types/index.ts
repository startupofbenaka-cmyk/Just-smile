export type PageId = 'home' | 'about' | 'services' | 'book' | 'contact' | 'admin';

export type ServiceCategory = 'all' | 'preventive' | 'restorative' | 'cosmetic' | 'specialized';

export interface DentalService {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDesc: string;
  fullDesc: string;
  durationMinutes: number;
  iconName: string;
  benefits: string[];
  recommendedFor: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type PreferredContact = 'whatsapp' | 'call' | 'email';

export interface AppointmentRequest {
  id: string; // e.g. JSD-2026-1042
  patientName: string;
  phone: string;
  email: string;
  serviceId: string;
  serviceName: string;
  preferredDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  preferredContact: PreferredContact;
  message?: string;
  isFirstVisit: boolean;
  status: AppointmentStatus;
  adminNotes?: string;
  createdAt: string; // ISO date
}

export interface DaySchedule {
  day: string;
  morning: string; // e.g. "09:30 AM - 01:30 PM"
  evening: string; // e.g. "04:30 PM - 08:30 PM"
  isOpen: boolean;
}

export interface ClinicConfig {
  clinicName: string;
  tagline: string;
  locationArea: string;
  city: string;
  state: string;
  landmark: string;
  fullAddress: string;
  pincode: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  googleMapsUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  todayOverrideStatus?: 'normal' | 'emergency_only' | 'closed';
  specialNotice?: string;
  weeklySchedule: Record<number, DaySchedule>; // 0=Sunday, 1=Monday ... 6=Saturday
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface VerifiedReview {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  serviceUsed: string;
  reviewText: string;
  source: 'Google Reviews (Verified Girinagar Patient)';
  verified: boolean;
}
