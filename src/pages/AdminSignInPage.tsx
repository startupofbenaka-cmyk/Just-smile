import React, { useState } from 'react';
import { PageId, ClinicConfig } from '../types';
import { authService, AuthSession } from '../services/auth';
import { BrandLogo } from '../components/BrandLogo';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface AdminSignInPageProps {
  onSuccess: (session: AuthSession) => void;
  onNavigatePublic: (page: PageId) => void;
  clinicConfig: ClinicConfig;
}

export const AdminSignInPage: React.FC<AdminSignInPageProps> = ({
  onSuccess,
  onNavigatePublic
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please type both your email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const session = await authService.signIn(email, password);
      onSuccess(session);
    } catch (err: any) {
      setErrorMessage(err.message || 'Wrong email or password. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {/* Back to main website */}
      <div className="max-w-md w-full mx-auto mb-5 flex items-center justify-between">
        <button
          onClick={() => onNavigatePublic('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Website</span>
        </button>

        <span className="text-xs font-medium text-slate-500">
          Clinic Staff Only
        </span>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="md" variant="light" />
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Staff & Doctor Sign In
            </span>
            <h1 className="text-2xl font-black font-heading tracking-tight mt-1 text-white">
              Sign In to Admin
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Please enter your clinic email and password to view patient appointments.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-sky-300" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Password protected. Only clinic doctors and staff can view patient details.</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Forgot password? Please ask Dr. Benaka (Clinic Director) to reset it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
