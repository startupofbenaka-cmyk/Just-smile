export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  clinic: string;
  passwordHash: string;
  lastLogin?: string;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    clinic: string;
  };
  expiresAt: string;
}

const USERS_STORAGE_KEY = 'just_smile_admin_users_v2';
const SESSION_STORAGE_KEY = 'just_smile_admin_session_v2';

const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    email: 'startupofbenaka@gmail.com',
    name: 'Dr. Benaka (Clinic Director)',
    role: 'Chief Dental Officer & Administrator',
    clinic: 'Just Smile Dental Clinic - Girinagar',
    passwordHash: 'JustSmile@2026'
  },
  {
    id: 'admin-2',
    email: 'admin@justsmiledental.in',
    name: 'Clinic Front Desk',
    role: 'Front Desk Receptionist',
    clinic: 'Just Smile Dental Clinic - Girinagar',
    passwordHash: 'Clinic@1234'
  }
];

export const authService = {
  getUsers(): AdminUser[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMINS));
        return DEFAULT_ADMINS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_ADMINS;
    }
  },

  getCurrentSession(): AuthSession | null {
    try {
      // Use sessionStorage only, and never auto-authenticate visitors
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;
      const session: AuthSession = JSON.parse(stored);

      if (new Date(session.expiresAt) < new Date()) {
        authService.signOut();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  },

  signIn(email: string, password: string): Promise<AuthSession> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = authService.getUsers();
        const trimmedEmail = email.trim().toLowerCase();

        const user = users.find(u => u.email.toLowerCase() === trimmedEmail);
        if (!user) {
          reject(new Error('No clinic administrator account found with this email.'));
          return;
        }

        if (user.passwordHash !== password) {
          reject(new Error('Incorrect password. Please check your spelling and try again.'));
          return;
        }

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 8); // 8-hour session

        const session: AuthSession = {
          token: `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            clinic: user.clinic
          },
          expiresAt: expiresAt.toISOString()
        };

        // Saved only in sessionStorage
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        user.lastLogin = new Date().toISOString();
        const updatedUsers = users.map(u => u.id === user.id ? user : u);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

        resolve(session);
      }, 400);
    });
  },

  signOut(): void {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('just_smile_admin_session_v1');
    localStorage.removeItem('just_smile_admin_session_v2');
  },

  changePassword(userId: string, currentPass: string, newPass: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const users = authService.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        reject(new Error('User not found.'));
        return;
      }

      if (users[userIndex].passwordHash !== currentPass) {
        reject(new Error('Current password does not match.'));
        return;
      }

      if (newPass.length < 6) {
        reject(new Error('New password must be at least 6 characters long.'));
        return;
      }

      users[userIndex].passwordHash = newPass;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      resolve(true);
    });
  },

  resetAdminCredentials(): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMINS));
  }
};
