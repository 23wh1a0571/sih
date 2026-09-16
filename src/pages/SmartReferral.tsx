import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import type { Priority, ReferralStatus } from '../types';
import {
  Send,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  FileText,
  User,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const SmartReferral: React.FC = () => {
  const {
    selectedPatient,
    selectedReferral,
    createReferral,
    updateReferralStatus,
    setCurrentView,
    setRole,
    facilities,
  } = useApp();
  const { t } = useTranslation();

  // Create form fields
  const [fromFacility, setFromFacility] = useState('PHC Kurnool Rural');
  const [toFacility, setToFacility] = useState('District Hospital Kurnool (General Medicine)');
  const [priority, setPriority] = useState<Priority>('Priority');
  const [reason, setReason] = useState(
    'Persistent pyrexia of unknown origin for 3 days with intense headache and dehydration.'
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    '54yo male presented with high-grade fever (102°F), headache, vomiting. Rapid malaria and dengue screens negative at PHC. Elevated WBC count noted. Needs specialist evaluation and parenteral hydration.'
  );

  const activeRef = selectedReferral;

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    createReferral({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      fromFacility,
      toFacility,
      priority,
      reason,
      clinicalNotes,
    });
  };

  const priorityColors = {
    Routine: 'slate' as const,
    Priority: 'amber' as const,
    Emergency: 'rose' as const,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40">
              Continuity of Care
            </span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-slate-400 font-medium">Digital Escalation Pathway</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <Send className="w-6 h-6 text-teal-400" />
            <span>{t('nav_smart_referral', 'Smart Referral Management')}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('referral_tracking')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {t('nav_referral_tracking', 'View All Referrals')}
          </button>
        </div>
      </div>

      {/* Active Referral ID & Journey Stepper */}
      {activeRef && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Referral ID:
                </span>
                <span className="text-base font-extrabold font-mono text-teal-300 bg-teal-950/80 border border-teal-700/60 px-3 py-0.5 rounded-lg">
                  {activeRef.id}
                </span>
                <Badge variant={priorityColors[activeRef.priority]} size="sm" dot>
                  {activeRef.priority} Priority
                </Badge>
                <Badge variant={activeRef.status === 'Completed' ? 'emerald' : 'blue'} size="sm">
                  {activeRef.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Initiated: {activeRef.createdAt} • Patient: <strong className="text-white">{activeRef.patientName}</strong> ({activeRef.patientAge}y, {activeRef.patientGender})
              </p>
            </div>

            {/* Direct Quick Transition for Demo */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Status:</span>
              <select
                value={activeRef.status}
                onChange={(e) => updateReferralStatus(activeRef.id, e.target.value as ReferralStatus)}
                className="text-xs font-bold p-2 bg-slate-950 border border-slate-700 text-white rounded-lg outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="In Consultation">In Consultation</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Referral Journey Stepper */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Referral Journey Continuity Tracker
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {activeRef.journey.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border relative transition-all ${
                      isCurrent
                        ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                        : isCompleted
                        ? 'bg-emerald-950/50 border-emerald-700/60'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {step.stage}
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✓</span>
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white animate-pulse">
                          CURRENT
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          PENDING
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">
                      {step.facilityName}
                    </p>
                    {step.timestamp && (
                      <p className="text-[10px] text-slate-400 mt-1">{step.timestamp}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referral Clinical Summary & AI Brief Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Clinical Reason & Frontline Notes
              </p>
              <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                {activeRef.reason}
              </p>
              <p className="text-xs text-slate-300 mt-2 italic bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                "{activeRef.clinicalNotes}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/50">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                <span>AI Clinical Summary for Specialist</span>
              </p>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeRef.aiSummary}
              </p>
              <div className="mt-3 pt-2 border-t border-teal-900/60 flex items-center justify-between">
                <span className="text-[10px] text-teal-400 font-semibold">
                  Destination: {activeRef.toFacility}
                </span>
                <button
                  onClick={() => {
                    setRole('doctor');
                    setCurrentView('teleconsultation');
                  }}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open in Doctor Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Referral Form */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-6">
        <div className="pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">
            Initiate New Digital Referral
          </h2>
          <p className="text-xs text-slate-400">
            Escalate patient care to higher facility tier with structured clinical handover
          </p>
        </div>

        <form onSubmit={handleCreateNew} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Selected Patient
              </label>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-sm font-bold text-white flex items-center justify-between">
                <span>{selectedPatient.name} ({selectedPatient.age}y, {selectedPatient.gender})</span>
                <span className="text-xs text-teal-400 font-mono">{selectedPatient.id}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white outline-none"
              >
                <option value="Routine">Routine (Within 48 hours)</option>
                <option value="Priority">Priority (Same day / 12 hours)</option>
                <option value="Emergency">Emergency (Immediate 108 Transfer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Originating Facility *
              </label>
              <input
                type="text"
                required
                value={fromFacility}
                onChange={(e) => setFromFacility(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="PHC Kurnool Rural"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Destination Facility *
              </label>
              <input
                type="text"
                required
                value={toFacility}
                onChange={(e) => setToFacility(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="District Hospital Kurnool"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Reason for Referral *
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="e.g. Persistent pyrexia and headache requiring specialist examination"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Clinical Handover Notes
              </label>
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="Diagnostic observations, initial medication given..."
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:scale-101 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('btn_create_referral', 'Generate Smart Referral ID')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
