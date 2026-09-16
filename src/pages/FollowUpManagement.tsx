import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import type { FollowUpStatus } from '../types';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Activity,
  Calendar,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const FollowUpManagement: React.FC = () => {
  const { followUps, completeFollowUp, setCurrentView, setSelectedPatientId } = useApp();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'All' | 'Due' | 'Completed' | 'Missed'>('All');
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState('Patient visited in village. Vitals stable. Medication continued.');

  const filtered = followUps.filter((f) => {
    if (filter === 'All') return true;
    return f.status === filter;
  });

  const dueCount = followUps.filter((f) => f.status === 'Due').length;
  const completedCount = followUps.filter((f) => f.status === 'Completed').length;
  const missedCount = followUps.filter((f) => f.status === 'Missed').length;

  const handleConfirmCompletion = (id: string) => {
    completeFollowUp(id, completionNotes);
    setCompletingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-teal-400" />
            <span>{t('nav_followups', 'Community Follow-up Management')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Ensures longitudinal care continuity and prevents post-consultation dropouts in rural hamlets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal" size="md">
            94% Overall Completion Rate
          </Badge>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-sm text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Due Today / Upcoming</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{dueCount}</p>
          <p className="text-[11px] text-amber-300 font-semibold mt-0.5">Village home visits</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-sm text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed This Month</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{completedCount}</p>
          <p className="text-[11px] text-emerald-300 font-semibold mt-0.5">Verified by ASHA</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-sm text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Missed Visits</p>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{missedCount}</p>
          <p className="text-[11px] text-rose-300 font-semibold mt-0.5">Rescheduled for week</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {(['All', 'Due', 'Completed', 'Missed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filter === f
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Follow-up Cards List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isDue = item.status === 'Due';
          const isCompleted = item.status === 'Completed';

          return (
            <div
              key={item.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl font-extrabold flex items-center justify-center text-sm shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      : isDue
                      ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                      : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white text-base">{item.patientName}</h3>
                    <Badge
                      variant={isCompleted ? 'emerald' : isDue ? 'amber' : 'rose'}
                      size="sm"
                      dot={isDue}
                    >
                      {item.status}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">{item.dueDate}</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-300">{item.reason}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      Village: {item.village}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {item.patientPhone}
                    </span>
                    <span>•</span>
                    <span className="text-teal-400 font-semibold">
                      Assigned: {item.assignedWorker}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/50 mt-2">
                      Notes: {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {isDue ? (
                  completingId === item.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in">
                      <input
                        type="text"
                        value={completionNotes}
                        onChange={(e) => setCompletionNotes(e.target.value)}
                        placeholder="Visit outcome notes..."
                        className="text-xs p-2 rounded-lg border border-slate-700 w-48 bg-slate-950 text-white placeholder-slate-500 outline-none"
                      />
                      <button
                        onClick={() => handleConfirmCompletion(item.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCompletingId(item.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  )
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    {item.completedAt || 'Follow-up Closed'}
                  </span>
                )}

                <button
                  onClick={() => {
                    setSelectedPatientId(item.patientId);
                    setCurrentView('patient_profile');
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="View Patient Record"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
