import React, { useState } from 'react';
import { PageId, ClinicConfig, AppointmentRequest, AppointmentStatus } from '../types';
import { INITIAL_SERVICES } from '../data/clinicData';
import { storageService } from '../services/storage';
import { authService, AuthSession } from '../services/auth';
import { BrandLogo } from '../components/BrandLogo';
import {
  Lock,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Download,
  Plus,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  MapPin,
  Save,
  Check,
  LogOut,
  UserCheck,
  Shield,
  KeyRound,
  X,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: PageId) => void;
  clinicConfig: ClinicConfig;
  onUpdateClinicConfig: (config: ClinicConfig) => void;
  session: AuthSession;
  onSignOut: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onNavigate,
  clinicConfig,
  onUpdateClinicConfig,
  session,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings'>('appointments');
  const [appointments, setAppointments] = useState<AppointmentRequest[]>(() => storageService.getAppointments());
  
  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Delete Confirmation Modal State
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentRequest | null>(null);
  const [showPurgeCancelledModal, setShowPurgeCancelledModal] = useState<boolean>(false);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  // Walk-in modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newServiceId, setNewServiceId] = useState(INITIAL_SERVICES[0].id);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newNotes, setNewNotes] = useState('');
  const [walkInError, setWalkInError] = useState<string | null>(null);

  // Settings form local state
  const [editConfig, setEditConfig] = useState<ClinicConfig>({ ...clinicConfig });
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);
  const [resetNotice, setResetNotice] = useState<boolean>(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync appointments from storage
  const reloadAppointments = () => {
    setAppointments(storageService.getAppointments());
  };

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    storageService.updateAppointmentStatus(id, newStatus);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    
    if (newStatus === 'cancelled') {
      setDeleteNotice(`Appointment ${id} marked as cancelled. You can now permanently delete its details.`);
      setTimeout(() => setDeleteNotice(null), 4000);
    }
  };

  // Safe In-App Delete Handler (No blocked browser window.confirm!)
  const executeDeleteAppointment = () => {
    if (!appointmentToDelete) return;
    const { id, patientName, status } = appointmentToDelete;
    
    storageService.deleteAppointment(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
    setAppointmentToDelete(null);

    setDeleteNotice(`Successfully deleted ${status} appointment record (${id}) for ${patientName}.`);
    setTimeout(() => setDeleteNotice(null), 4000);
  };

  // Safe Batch Purge for all Cancelled appointments
  const executePurgeAllCancelled = () => {
    const deletedCount = storageService.deleteAppointmentsByStatus('cancelled');
    setAppointments(prev => prev.filter(a => a.status !== 'cancelled'));
    setShowPurgeCancelledModal(false);

    setDeleteNotice(`Successfully purged all ${deletedCount} cancelled appointment record(s).`);
    setTimeout(() => setDeleteNotice(null), 4000);
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    setWalkInError(null);

    if (!newPatientName.trim() || !newPhone.trim()) {
      setWalkInError('Please provide patient name and contact phone number.');
      return;
    }

    const selectedService = INITIAL_SERVICES.find(s => s.id === newServiceId);
    const serviceName = selectedService ? selectedService.name : 'Walk-in Consultation';

    const randId = Math.floor(1000 + Math.random() * 9000);
    const newReq: AppointmentRequest = {
      id: `JSD-2026-${randId}`,
      patientName: newPatientName.trim(),
      phone: newPhone.trim(),
      email: 'walkin@justsmiledental.in',
      serviceId: newServiceId,
      serviceName,
      preferredDate: newDate,
      timeSlot: newTime,
      preferredContact: 'call',
      message: newNotes ? `Walk-in / Phone note: ${newNotes}` : 'Walk-in / Direct phone entry',
      isFirstVisit: true,
      status: 'confirmed',
      adminNotes: `Logged directly by ${session.user.name}`,
      createdAt: new Date().toISOString()
    };

    const current = storageService.getAppointments();
    const updated = [newReq, ...current];
    localStorage.setItem('just_smile_appointments_v1', JSON.stringify(updated));
    setAppointments(updated);

    setShowAddModal(false);
    setNewPatientName('');
    setNewPhone('');
    setNewNotes('');
    setWalkInError(null);

    setDeleteNotice(`Walk-in appointment ${newReq.id} recorded successfully.`);
    setTimeout(() => setDeleteNotice(null), 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClinicConfig(editConfig);
    storageService.updateClinicConfig(editConfig);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleResetSettings = () => {
    storageService.resetClinicConfig();
    const resetCfg = storageService.getClinicConfig();
    setEditConfig(resetCfg);
    onUpdateClinicConfig(resetCfg);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    try {
      await authService.changePassword(session.user.id, currentPassword, newPassword);
      setPasswordChangeStatus({ type: 'success', message: 'Password updated successfully! Keep your new credentials safe.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordChangeStatus(null), 4000);
    } catch (err: any) {
      setPasswordChangeStatus({ type: 'error', message: err.message || 'Failed to update password.' });
    }
  };

  const exportToCSV = () => {
    const headers = ['Reference ID', 'Patient Name', 'Phone', 'Email', 'Service', 'Date', 'Time Slot', 'Contact Mode', 'Status', 'Submitted At'];
    const rows = appointments.map(a => [
      `"${a.id}"`,
      `"${a.patientName}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.serviceName}"`,
      `"${a.preferredDate}"`,
      `"${a.timeSlot}"`,
      `"${a.preferredContact}"`,
      `"${a.status}"`,
      `"${new Date(a.createdAt).toLocaleString('en-IN')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `just_smile_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter(a => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Summary counts
  const totalCount = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Dynamic Feedback Banner for Deletions / Updates */}
      {deleteNotice && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 border border-slate-700">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{deleteNotice}</span>
          </div>
          <button
            onClick={() => setDeleteNotice(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner with Authenticated Admin Session */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="space-y-3">
          <BrandLogo size="md" variant="light" />

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-blue-900/90 text-sky-300 text-xs px-3 py-1 rounded-full font-semibold border border-blue-700/60">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>Admin Management Suite</span>
            </span>

            {/* Active User Chip */}
            <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 text-xs px-3 py-1 rounded-full font-medium border border-emerald-800/60">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Signed In: {session.user.name}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300">
            Authenticated Account: <strong className="text-white">{session.user.email}</strong> • Role: <span className="text-sky-300">{session.user.role}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl transition-colors font-medium border border-slate-700"
          >
            ← View Patient Website
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl transition-colors font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Log Walk-in / Call</span>
          </button>

          <button
            onClick={onSignOut}
            className="text-xs bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white px-3.5 py-2.5 rounded-xl transition-colors font-semibold flex items-center gap-1.5 border border-rose-800/60"
            title="Sign out of Admin Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Requests
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-heading">
            {totalCount}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">All registered records</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block">
            Pending
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-heading">
            {pendingCount}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting confirmation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
            Confirmed Slots
          </span>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 font-heading">
            {confirmedCount}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Scheduled on chair</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
            Completed
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-heading">
            {completedCount}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Treated & archived</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block">
            Cancelled
          </span>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1 font-heading">
            {cancelledCount}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Can be purged anytime</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'appointments'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointment Requests ({totalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Clinic Hours, Notices & Password</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient name, phone, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="all">All Statuses ({totalCount})</option>
                  <option value="pending">Pending ({pendingCount})</option>
                  <option value="confirmed">Confirmed ({confirmedCount})</option>
                  <option value="completed">Completed ({completedCount})</option>
                  <option value="cancelled">Cancelled ({cancelledCount})</option>
                </select>
              </div>

              {/* Purge All Cancelled Button (Prominent when cancelled records exist) */}
              {cancelledCount > 0 && (
                <button
                  onClick={() => setShowPurgeCancelledModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 px-3 py-2 rounded-xl transition-all shadow-xs"
                  title="Permanently remove all cancelled appointments"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Cancelled ({cancelledCount})</span>
                </button>
              )}

              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
                title="Download CSV report"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={reloadAppointments}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100"
                title="Refresh table"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Appointments Table / Cards */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-slate-800 font-bold text-base">No appointments found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No appointment matches your search criteria. Clear filters or add a new patient record above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((req) => {
                const waMessage = encodeURIComponent(
                  `Namaste ${req.patientName}, this is Just Smile Dental Clinic (Girinagar, near Narayana PU College) regarding your appointment request ${req.id} for ${req.serviceName} on ${req.preferredDate} at ${req.timeSlot}. We would like to confirm your slot.`
                );

                const isCancelled = req.status === 'cancelled';

                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                      isCancelled
                        ? 'border-rose-200 bg-rose-50/20'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md">
                          {req.id}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 font-heading">
                          {req.patientName}
                        </h3>
                        {req.isFirstVisit && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                            New Patient
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                            Cancelled Appointment
                          </span>
                        )}
                      </div>

                      {/* Status Selector Pill & Quick Delete */}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          req.status === 'confirmed' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                          req.status === 'pending' ? 'bg-amber-100 text-amber-900 border border-amber-200 animate-pulse' :
                          req.status === 'completed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {req.status}
                        </span>

                        <button
                          onClick={() => setAppointmentToDelete(req)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Permanently Delete Appointment Record"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Requested Service</span>
                        <span className="font-bold text-slate-800 text-sm">{req.serviceName}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Scheduled Date & Slot</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {req.preferredDate} • {req.timeSlot}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Contact Info</span>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800">{req.phone}</p>
                          <p className="text-slate-500 truncate">{req.email}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Requested On</span>
                        <span className="text-slate-600">
                          {new Date(req.createdAt).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="block text-[11px] text-blue-700 capitalize">
                          Preferred: {req.preferredContact}
                        </span>
                      </div>
                    </div>

                    {/* Notes if any */}
                    {req.message && (
                      <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-100">
                        <span className="font-bold text-slate-900 mr-1">Patient Note:</span>
                        {req.message}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
                      {/* Direct Patient Contact */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${req.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-700" />
                          <span>Call Patient</span>
                        </a>

                        <a
                          href={`https://wa.me/91${req.phone.replace(/[^0-9]/g, '')}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-colors border border-emerald-200"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Confirmation</span>
                        </a>
                      </div>

                      {/* Status Update Quick Buttons & Prominent Delete */}
                      <div className="flex items-center gap-2">
                        {isCancelled ? (
                          <>
                            {/* Explicit Prominent Delete Button for Cancelled Appointments */}
                            <button
                              onClick={() => setAppointmentToDelete(req)}
                              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                              title="Permanently remove this cancelled appointment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Cancelled Details</span>
                            </button>

                            <button
                              onClick={() => handleStatusChange(req.id, 'pending')}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1"
                              title="Restore back to pending list"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                          </>
                        ) : req.status === 'pending' ? (
                          <>
                            {/* In Pending: ONLY show Mark Confirmed and Cancel */}
                            <button
                              onClick={() => handleStatusChange(req.id, 'confirmed')}
                              className="px-3.5 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                              title="Confirm this appointment request"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-sky-300" />
                              <span>Mark Confirmed</span>
                            </button>

                            <button
                              onClick={() => handleStatusChange(req.id, 'cancelled')}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold transition-colors"
                              title="Cancel this appointment"
                            >
                              Cancel Appointment
                            </button>
                          </>
                        ) : req.status === 'confirmed' ? (
                          <>
                            {/* Once Confirmed: ONLY show Mark Completed and Cancel */}
                            <button
                              onClick={() => handleStatusChange(req.id, 'completed')}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                              title="Mark appointment as completed after patient visits"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-200" />
                              <span>Mark Completed</span>
                            </button>

                            <button
                              onClick={() => handleStatusChange(req.id, 'cancelled')}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold transition-colors"
                              title="Cancel this appointment"
                            >
                              Cancel Appointment
                            </button>

                            <button
                              onClick={() => handleStatusChange(req.id, 'pending')}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
                              title="Move back to pending"
                            >
                              Back to Pending
                            </button>
                          </>
                        ) : req.status === 'completed' ? (
                          <>
                            {/* Once Completed: Finished state */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Visit Completed</span>
                            </span>

                            <button
                              onClick={() => handleStatusChange(req.id, 'confirmed')}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
                              title="Re-open if marked completed by mistake"
                            >
                              Move Back to Confirmed
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLINIC SETTINGS & PASSWORD */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          {/* Form 1: Operational Settings */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">
                  Clinic Operating Settings & Real-Time Controls
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Updates saved here immediately modify clinic hours, phone numbers, and status on the public website.
                </p>
              </div>

              {saveSuccessNotice && (
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Clinic settings updated successfully!</span>
                </div>
              )}

              {resetNotice && (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200 px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in">
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span>Reset to original clinic defaults!</span>
                </div>
              )}
            </div>

            {/* Section 1: Live Status Override */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
                1. Current Clinic Status Override
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  editConfig.todayOverrideStatus === 'normal'
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="statusOverride"
                    checked={editConfig.todayOverrideStatus === 'normal'}
                    onChange={() => setEditConfig({ ...editConfig, todayOverrideStatus: 'normal' })}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-slate-900 block">Normal Operating Hours</span>
                  <span className="text-[11px] text-slate-500 block mt-1">Automated based on schedule</span>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  editConfig.todayOverrideStatus === 'emergency_only'
                    ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-500'
                    : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="statusOverride"
                    checked={editConfig.todayOverrideStatus === 'emergency_only'}
                    onChange={() => setEditConfig({ ...editConfig, todayOverrideStatus: 'emergency_only' })}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-amber-900 block">Emergency Care Only</span>
                  <span className="text-[11px] text-amber-700 block mt-1">Advises calling ahead</span>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  editConfig.todayOverrideStatus === 'closed'
                    ? 'border-rose-600 bg-rose-50/70 ring-1 ring-rose-500'
                    : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="statusOverride"
                    checked={editConfig.todayOverrideStatus === 'closed'}
                    onChange={() => setEditConfig({ ...editConfig, todayOverrideStatus: 'closed' })}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-rose-900 block">Closed Today (Holiday/Off)</span>
                  <span className="text-[11px] text-rose-700 block mt-1">Displays closed badge on site</span>
                </label>
              </div>

              {/* Special Notice Banner Input */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Special Announcement / Holiday Notice on Public Banner
                </label>
                <input
                  type="text"
                  value={editConfig.specialNotice || ''}
                  onChange={(e) => setEditConfig({ ...editConfig, specialNotice: e.target.value })}
                  placeholder="e.g. Clinic will remain closed on Ugadi festival. Regular slots resume Thursday."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Section 2: Contact Details */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
                2. Clinic Contact Numbers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Primary Clinic Phone</label>
                  <input
                    type="text"
                    value={editConfig.primaryPhone}
                    onChange={(e) => setEditConfig({ ...editConfig, primaryPhone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Doctor Mobile / Secondary</label>
                  <input
                    type="text"
                    value={editConfig.secondaryPhone}
                    onChange={(e) => setEditConfig({ ...editConfig, secondaryPhone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">WhatsApp Number (with Country Code)</label>
                  <input
                    type="text"
                    value={editConfig.whatsappNumber}
                    onChange={(e) => setEditConfig({ ...editConfig, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Address & Landmark */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
                3. Location & Landmark
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Landmark</label>
                  <input
                    type="text"
                    value={editConfig.landmark}
                    onChange={(e) => setEditConfig({ ...editConfig, landmark: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Google Maps Link</label>
                  <input
                    type="text"
                    value={editConfig.googleMapsUrl}
                    onChange={(e) => setEditConfig({ ...editConfig, googleMapsUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Full Physical Address</label>
                  <input
                    type="text"
                    value={editConfig.fullAddress}
                    onChange={(e) => setEditConfig({ ...editConfig, fullAddress: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Save & Reset Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetSettings}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
              >
                Reset to Factory Defaults
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish Clinic Settings</span>
              </button>
            </div>
          </form>

          {/* Form 2: Admin Password & Account Security */}
          <form onSubmit={handlePasswordChange} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 text-blue-900 font-bold font-heading text-lg">
                <KeyRound className="w-5 h-5 text-blue-700" />
                <h3>Change Administrator Password</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Update the password for account: <strong>{session.user.email}</strong>
              </p>
            </div>

            {passwordChangeStatus && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                passwordChangeStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {passwordChangeStatus.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{passwordChangeStatus.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">New Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                <KeyRound className="w-4 h-4 text-sky-400" />
                <span>Update Admin Password</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 1: CONFIRM DELETE SINGLE APPOINTMENT */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setAppointmentToDelete(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Delete Appointment Details?
                </h3>
                <p className="text-xs text-rose-600 font-semibold">
                  This action is permanent and cannot be reversed.
                </p>
              </div>
            </div>

            {/* Details Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Reference ID:</span>
                <span className="font-mono font-bold text-slate-800">{appointmentToDelete.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900">{appointmentToDelete.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Treatment:</span>
                <span className="font-semibold text-blue-900">{appointmentToDelete.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-medium text-slate-800">{appointmentToDelete.preferredDate} ({appointmentToDelete.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold uppercase ${
                  appointmentToDelete.status === 'cancelled' ? 'text-rose-700' : 'text-slate-700'
                }`}>
                  {appointmentToDelete.status}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Keep Record
              </button>

              <button
                type="button"
                onClick={executeDeleteAppointment}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM PURGE ALL CANCELLED APPOINTMENTS */}
      {showPurgeCancelledModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowPurgeCancelledModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Purge All Cancelled Appointments?
                </h3>
                <p className="text-xs text-slate-500">
                  Clear clinic clutter with one click
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              You are about to permanently delete <strong>{cancelledCount} cancelled appointment record(s)</strong> from Just Smile Dental Clinic database. This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowPurgeCancelledModal(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executePurgeAllCancelled}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Purge {cancelledCount} Records</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: WALK-IN / PHONE APPOINTMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-slate-900 mb-1">
              Log Walk-in / Phone Consultation
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Record a direct walk-in patient or phone booking into the clinic schedule.
            </p>

            {walkInError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{walkInError}</span>
              </div>
            )}

            <form onSubmit={handleCreateWalkIn} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kumar"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="9845012345"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Treatment</label>
                  <select
                    value={newServiceId}
                    onChange={(e) => setNewServiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {INITIAL_SERVICES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Time Slot</label>
                <input
                  type="text"
                  placeholder="e.g. 11:30 AM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Doctor / Reception Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Patient walked in with mild toothache. Immediate scaling prescribed."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-800 hover:bg-blue-900 text-white shadow-xs"
                >
                  Add Record to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
