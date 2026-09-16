import React from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  Stethoscope,
  Video,
  Send,
  AlertCircle,
  Clock,
  UserCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Activity,
  Heart,
  Thermometer,
} from 'lucide-react';
import { useTimeGreeting } from '../hooks/useTimeGreeting';
import { TimeGreetingBadge } from '../components/common/TimeGreetingBadge';
import { useTranslation } from '../hooks/useTranslation';

export const DoctorDashboard: React.FC = () => {
  const { referrals, setSelectedReferralId, setSelectedPatientId, setCurrentView, currentUser } = useApp();
  const { greeting, shiftLabel } = useTimeGreeting();
  const { t } = useTranslation();

  const pendingReferrals = referrals.filter((r) => r.status === 'Pending' || r.status === 'Accepted');
  const emergencyReferrals = referrals.filter((r) => r.priority === 'Emergency');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Doctor Portal Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-[#0a0f1d] text-white rounded-2xl p-6 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {t('nav_doctor_dashboard', 'Specialist Physician Portal')}
            </span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-indigo-200 font-medium">Telemedicine & Referral Inpatient Hub</span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-md border border-amber-300/30">
              {shiftLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {greeting}, {currentUser.name} 👋
            </h1>
            <TimeGreetingBadge variant="dashboard" userName={currentUser.name} />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
            <span>{currentUser.name} ({currentUser.designation}) • {currentUser.facility}</span>
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedReferralId('REF-2026-00142');
            setCurrentView('teleconsultation');
          }}
          className="z-10 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:scale-102 cursor-pointer"
        >
          <Video className="w-4 h-4" />
          <span>{t('btn_start_video_call', 'Launch Teleconsultation Room')}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-5 shadow-lg backdrop-blur-sm hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('metric_patients_today', "Today's Consultations")}
            </span>
            <div className="p-2 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/40">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">18</p>
          <p className="text-xs text-teal-400 font-semibold mt-1">12 completed, 6 queued</p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-5 shadow-lg backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Referrals
            </span>
            <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-indigo-400">{pendingReferrals.length}</p>
          <p className="text-xs text-indigo-400 font-semibold mt-1">From 4 peripheral PHCs</p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-rose-900/40 p-5 shadow-lg backdrop-blur-sm hover:border-rose-500/50 transition-colors relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-rose-600/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
              {t('metric_emergency_cases', 'Emergency Cases')}
            </span>
            <div className="p-2 rounded-xl bg-rose-950/90 text-rose-400 border border-rose-800/60">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-400">{emergencyReferrals.length || 2}</p>
          <p className="text-xs text-rose-300 font-semibold mt-1">High acuity 108 priority</p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-5 shadow-lg backdrop-blur-sm hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('metric_due_followups', 'Follow-ups')}
            </span>
            <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/40">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">6</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">Post-discharge reviews</p>
        </div>
      </div>

      {/* New Referral Requests */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/40">
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              New Referral Requests
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                {pendingReferrals.length} Awaiting Physician Action
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              AI pre-screened patient dossiers escalated from Sub-Centres and Primary Health Centres
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {pendingReferrals.map((ref) => {
            const isPriority = ref.priority === 'Priority' || ref.priority === 'Emergency';

            return (
              <div
                key={ref.id}
                className="p-5 hover:bg-slate-800/30 transition-colors space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-300 font-black flex items-center justify-center text-sm shrink-0 border border-indigo-800/50">
                      {ref.patientName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">
                          {ref.patientName}
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                          ({ref.patientAge}y, {ref.patientGender})
                        </span>
                        <Badge variant={ref.priority === 'Emergency' ? 'rose' : ref.priority === 'Priority' ? 'amber' : 'slate'} size="sm" dot>
                          {ref.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {ref.id} • From: <strong className="text-slate-300">{ref.fromFacility}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedReferralId(ref.id);
                        setSelectedPatientId(ref.patientId);
                        setCurrentView('teleconsultation');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{t('btn_start_video_call', 'Start Teleconsultation')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedReferralId(ref.id);
                        setSelectedPatientId(ref.patientId);
                        setCurrentView('patient_profile');
                      }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {t('btn_view_record', 'Open Patient')}
                    </button>
                  </div>
                </div>

                {/* Clinical Reason & AI Brief Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      Referral Reason
                    </p>
                    <p className="font-semibold text-slate-200">{ref.reason}</p>
                    <p className="text-[11px] text-slate-400 mt-1 italic">"{ref.clinicalNotes}"</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/50 text-xs">
                    <div className="flex items-center gap-1.5 text-teal-300 font-bold uppercase text-[10px] tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>AI Pre-Consultation Summary</span>
                    </div>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {ref.aiSummary}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
