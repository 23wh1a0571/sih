import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { useTimeGreeting } from '../hooks/useTimeGreeting';
import { TimeGreetingBadge } from '../components/common/TimeGreetingBadge';
import { Badge } from '../components/common/Badge';
import {
  Users,
  Send,
  CalendarCheck,
  HardDrive,
  UserPlus,
  Activity,
  ArrowRight,
  Wifi,
  WifiOff,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Phone,
  Mic,
  Zap,
} from 'lucide-react';

export const AshaDashboard: React.FC = () => {
  const {
    patients,
    referrals,
    followUps,
    pendingSyncCount,
    isOfflineMode,
    toggleOfflineMode,
    setCurrentView,
    setSelectedPatientId,
    currentUser,
  } = useApp();

  const { t } = useTranslation();
  const { greeting, shiftLabel } = useTimeGreeting();
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Health Worker';

  const dueFollowUps = followUps.filter((f) => f.status === 'Due');
  const pendingReferrals = referrals.filter((r) => r.status === 'Pending');

  return (
    <div className="space-y-6 select-none">
      {/* Frontline Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
              {t('nav_frontline_dashboard')}
            </span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-teal-200 font-medium">{currentUser.facility || 'Venkatapuram Village Roster'}</span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-md border border-amber-300/30">
              {shiftLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {greeting}, {firstName} 👋
            </h1>
            <TimeGreetingBadge variant="dashboard" userName={currentUser.name} />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>PHC: {currentUser.facility || 'Rural Health Centre - Kurnool • Sub-Centre Venkatapuram'}</span>
          </p>
        </div>

        {/* Live Connectivity Status Pill */}
        <div className="flex flex-col items-start sm:items-end gap-2">
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isOfflineMode
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 hover:bg-rose-900/60'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>🔴 {t('offline_status')}</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>🟢 {t('online_status')}</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-slate-400">
            Background telemetry: Active
          </span>
        </div>
      </div>

      {/* Metric Cards (Section 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Patients Today */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-md hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('metric_patients_today')}
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-teal-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">24</p>
          <p className="text-xs text-teal-400 font-semibold mt-1 flex items-center gap-1">
            <span>+4 since 09:00 AM</span>
          </p>
        </div>

        {/* Card 2: Pending Referrals */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-md hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Referrals
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{pendingReferrals.length || 7}</p>
          <p className="text-xs text-amber-400 font-semibold mt-1">
            2 Priority cases awaiting MO review
          </p>
        </div>

        {/* Card 3: Follow-ups Due */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-md hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('metric_due_followups')}
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{dueFollowUps.length || 5}</p>
          <p className="text-xs text-indigo-300 font-semibold mt-1">
            3 village home visits scheduled
          </p>
        </div>

        {/* Card 4: Offline Records */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-md hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('metric_pending_sync')}
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-rose-400">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{pendingSyncCount}</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {pendingSyncCount > 0 ? 'Queued for automatic sync' : 'All records synchronized'}
          </p>
        </div>
      </div>

      {/* Main Frontline Worker Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setCurrentView('register_patient')}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/30 transition-all hover:scale-101 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('nav_register_patient')}</span>
        </button>

        <button
          onClick={() => {
            setSelectedPatientId('PID-2026-8891');
            setCurrentView('ai_triage');
          }}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/30 transition-all hover:scale-101 cursor-pointer animate-pulse"
        >
          <Activity className="w-4 h-4" />
          <span>{t('nav_ai_triage')}</span>
        </button>

        <button
          onClick={() => {
            setSelectedPatientId('PID-2026-8891');
            setCurrentView('smart_referral');
          }}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-101 cursor-pointer"
        >
          <Send className="w-4 h-4 text-teal-400" />
          <span>{t('nav_smart_referral')}</span>
        </button>

        <button
          onClick={() => setCurrentView('patient_profile')}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-101 cursor-pointer"
        >
          <Users className="w-4 h-4 text-indigo-400" />
          <span>{t('nav_patient_records')}</span>
        </button>
      </div>

      {/* Recent Patients Roster & Queue */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              Recent Village Patients
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 font-semibold border border-slate-700">
                {patients.length} Registered
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live roster of individuals screened by {currentUser.name} in {currentUser.facility || 'Venkatapuram cluster'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('register_patient')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Register</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {patients.slice(0, 5).map((patient) => {
            const riskColors = {
              Low: 'emerald' as const,
              Moderate: 'amber' as const,
              High: 'rose' as const,
              Emergency: 'rose' as const,
            };

            return (
              <div
                key={patient.id}
                className="p-4 sm:p-5 hover:bg-slate-850/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Patient Summary */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 text-teal-300 font-bold flex items-center justify-center text-sm shrink-0 border border-slate-700">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {patient.name}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {patient.age} years • {patient.gender}
                      </span>
                      <Badge variant={riskColors[patient.riskLevel]} size="sm" dot>
                        {patient.riskLevel} Risk
                      </Badge>
                      {patient.syncStatus === 'pending_sync' && (
                        <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-600/40 px-2 py-0.5 rounded-full font-bold">
                          Pending Sync
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {patient.village}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-200">
                        {patient.symptoms.join(', ')}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">
                        Vitals: {patient.vitals.temperature}°F | BP {patient.vitals.bloodPressure} | SpO2 {patient.vitals.spo2}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => {
                      setSelectedPatientId(patient.id);
                      setCurrentView('ai_triage');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-950/80 hover:bg-teal-900 text-teal-300 text-xs font-semibold border border-teal-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-teal-400" />
                    <span>AI Triage</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPatientId(patient.id);
                      setCurrentView('smart_referral');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold border border-indigo-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Referral</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPatientId(patient.id);
                      setCurrentView('patient_profile');
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="View Full Profile"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
