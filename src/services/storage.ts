import { AppointmentRequest, ClinicConfig, AppointmentStatus } from '../types';
import { INITIAL_APPOINTMENT_REQUESTS, INITIAL_CLINIC_CONFIG } from '../data/clinicData';

const APPOINTMENTS_KEY = 'just_smile_appointments_v1';
const CLINIC_CONFIG_KEY = 'just_smile_clinic_config_v1';

export const storageService = {
  // Appointments
  getAppointments(): AppointmentRequest[] {
    try {
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      if (!stored) {
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(INITIAL_APPOINTMENT_REQUESTS));
        return INITIAL_APPOINTMENT_REQUESTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_APPOINTMENT_REQUESTS;
    }
  },

  createAppointment(requestData: Omit<AppointmentRequest, 'id' | 'status' | 'createdAt'>): Promise<AppointmentRequest> {
    return new Promise((resolve) => {
      // Simulate realistic network roundtrip
      setTimeout(() => {
        const current = storageService.getAppointments();
        const randId = Math.floor(1000 + Math.random() * 9000);
        const newAppointment: AppointmentRequest = {
          ...requestData,
          id: `JSD-2026-${randId}`,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        const updated = [newAppointment, ...current];
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
        resolve(newAppointment);
      }, 700);
    });
  },

  updateAppointmentStatus(id: string, status: AppointmentStatus, adminNotes?: string): boolean {
    try {
      const current = storageService.getAppointments();
      const index = current.findIndex(a => a.id === id);
      if (index === -1) return false;

      current[index] = {
        ...current[index],
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : current[index].adminNotes
      };

      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(current));
      return true;
    } catch {
      return false;
    }
  },

  deleteAppointment(id: string): boolean {
    try {
      const current = storageService.getAppointments();
      const filtered = current.filter(a => a.id !== id);
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  deleteAppointmentsByStatus(status: AppointmentStatus): number {
    try {
      const current = storageService.getAppointments();
      const filtered = current.filter(a => a.status !== status);
      const deletedCount = current.length - filtered.length;
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
      return deletedCount;
    } catch {
      return 0;
    }
  },

  // Clinic Config
  getClinicConfig(): ClinicConfig {
    try {
      const stored = localStorage.getItem(CLINIC_CONFIG_KEY);
      if (!stored) {
        localStorage.setItem(CLINIC_CONFIG_KEY, JSON.stringify(INITIAL_CLINIC_CONFIG));
        return INITIAL_CLINIC_CONFIG;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_CLINIC_CONFIG;
    }
  },

  updateClinicConfig(config: ClinicConfig): boolean {
    try {
      localStorage.setItem(CLINIC_CONFIG_KEY, JSON.stringify(config));
      return true;
    } catch {
      return false;
    }
  },

  resetAppointments(): void {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(INITIAL_APPOINTMENT_REQUESTS));
  },

  resetClinicConfig(): void {
    localStorage.setItem(CLINIC_CONFIG_KEY, JSON.stringify(INITIAL_CLINIC_CONFIG));
  },

  // Real-time calculation helper
  getLiveClinicStatus(config: ClinicConfig): {
    isOpen: boolean;
    statusText: string;
    subText: string;
    badgeColor: 'emerald' | 'amber' | 'rose' | 'slate';
  } {
    if (config.todayOverrideStatus === 'closed') {
      return {
        isOpen: false,
        statusText: 'Closed Today',
        subText: 'Emergency appointments on call',
        badgeColor: 'rose'
      };
    }

    if (config.todayOverrideStatus === 'emergency_only') {
      return {
        isOpen: true,
        statusText: 'Emergency Care Only',
        subText: 'Call before visiting',
        badgeColor: 'amber'
      };
    }

    const now = new Date();
    // Bengaluru is IST (UTC +5:30)
    // Convert current client time to minutes past midnight
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ...
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    const schedule = config.weeklySchedule[dayOfWeek];
    if (!schedule || !schedule.isOpen) {
      return {
        isOpen: false,
        statusText: 'Closed Today',
        subText: 'Opens Monday 09:30 AM',
        badgeColor: 'slate'
      };
    }

    // Standard weekday: 09:30 AM to 01:30 PM (570 to 810 mins), 04:30 PM to 08:30 PM (990 to 1230 mins)
    // Sunday: 10:00 AM to 01:00 PM (600 to 780 mins)
    const morningStart = dayOfWeek === 0 ? 10 * 60 : 9 * 60 + 30;
    const morningEnd = dayOfWeek === 0 ? 13 * 60 : 13 * 60 + 30;
    const eveningStart = 16 * 60 + 30;
    const eveningEnd = 20 * 60 + 30;

    if (currentMinutes >= morningStart && currentMinutes <= morningEnd) {
      return {
        isOpen: true,
        statusText: 'Open Now (Morning Session)',
        subText: `Closes at ${dayOfWeek === 0 ? '01:00 PM' : '01:30 PM'}`,
        badgeColor: 'emerald'
      };
    }

    if (dayOfWeek !== 0 && currentMinutes >= eveningStart && currentMinutes <= eveningEnd) {
      return {
        isOpen: true,
        statusText: 'Open Now (Evening Session)',
        subText: 'Closes at 08:30 PM',
        badgeColor: 'emerald'
      };
    }

    if (currentMinutes < morningStart) {
      return {
        isOpen: false,
        statusText: 'Closed Right Now',
        subText: `Opens at ${dayOfWeek === 0 ? '10:00 AM' : '09:30 AM'}`,
        badgeColor: 'amber'
      };
    }

    if (dayOfWeek !== 0 && currentMinutes > morningEnd && currentMinutes < eveningStart) {
      return {
        isOpen: false,
        statusText: 'Afternoon Break',
        subText: 'Evening session opens at 04:30 PM',
        badgeColor: 'amber'
      };
    }

    return {
      isOpen: false,
      statusText: 'Closed for the Night',
      subText: 'Opens tomorrow at 09:30 AM',
      badgeColor: 'slate'
    };
  }
};
