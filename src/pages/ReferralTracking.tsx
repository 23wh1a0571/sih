import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import type { Priority, ReferralStatus } from '../types';
import {
  Send,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Stethoscope,
  Building2,
  ArrowUpDown,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const ReferralTracking: React.FC = () => {
  const { referrals, setSelectedReferralId, setCurrentView, setRole } = useApp();
  const { t } = useTranslation();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Priority' | 'Completed' | 'Delayed'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReferrals = referrals.filter((ref) => {
    // Search match
    const matchesSearch =
      ref.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.fromFacility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.toFacility.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return ref.status === 'Pending';
    if (activeFilter === 'Priority') return ref.priority === 'Priority' || ref.priority === 'Emergency';
    if (activeFilter === 'Completed') return ref.status === 'Completed';
    if (activeFilter === 'Delayed') return ref.priority === 'Priority' && ref.status === 'Pending';
    return true;
  });

  const priorityColors = {
    Routine: 'slate' as const,
    Priority: 'amber' as const,
    Emergency: 'rose' as const,
  };

  const statusColors = {
    Pending: 'amber' as const,
    Accepted: 'blue' as const,
    'In Consultation': 'purple' as const,
    Completed: 'emerald' as const,
    Cancelled: 'slate' as const,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-teal-400" />
            <span>{t('nav_referral_tracking', 'Digital Referral Tracking')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            End-to-end monitoring of inter-facility patient transfers across Kurnool District
          </p>
        </div>

        <button
          onClick={() => setCurrentView('smart_referral')}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
        >
          <span>+ {t('btn_create_referral', 'Create New Referral')}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Referrals</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">2,841</p>
          <p className="text-[11px] text-teal-400 font-semibold mt-0.5">Kurnool District YTD</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Triage</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">143</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-0.5">Awaiting MO / Specialist review</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">2,612</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">91.9% Resolution rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Delayed (&gt;6h)</p>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">86</p>
          <p className="text-[11px] text-rose-400 font-semibold mt-0.5">AI Bottleneck flagged</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl backdrop-blur-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Pending', 'Priority', 'Completed', 'Delayed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient, ID, or facility..."
            className="w-full text-xs font-semibold pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:border-teal-500 outline-none bg-slate-950 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="p-4">Patient</th>
                <th className="p-4">Referral ID</th>
                <th className="p-4">Origin & Destination</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Created</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-semibold text-slate-200">
              {filteredReferrals.map((ref) => (
                <tr
                  key={ref.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => {
                    setSelectedReferralId(ref.id);
                    setCurrentView('smart_referral');
                  }}
                >
                  {/* Patient Name */}
                  <td className="p-4">
                    <div className="font-bold text-white">{ref.patientName}</div>
                    <div className="text-[11px] text-slate-400 font-normal">
                      {ref.patientAge}y • {ref.patientGender}
                    </div>
                  </td>

                  {/* Referral ID */}
                  <td className="p-4 font-mono font-bold text-teal-400">
                    {ref.id}
                  </td>

                  {/* From -> To */}
                  <td className="p-4">
                    <div className="text-white font-bold">{ref.fromFacility}</div>
                    <div className="text-[11px] text-indigo-400 flex items-center gap-1 font-medium">
                      <span>→ {ref.toFacility}</span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="p-4">
                    <Badge variant={priorityColors[ref.priority]} size="sm" dot>
                      {ref.priority}
                    </Badge>
                  </td>

                  {/* Created Date */}
                  <td className="p-4 text-slate-400 text-[11px] font-normal">
                    {ref.createdAt}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <Badge variant={statusColors[ref.status]} size="sm">
                      {ref.status}
                    </Badge>
                  </td>

                  {/* Action */}
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedReferralId(ref.id);
                          setRole('doctor');
                          setCurrentView('teleconsultation');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 text-xs font-bold border border-indigo-800/50 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Open in Doctor Teleconsultation Hub"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Doctor Brief</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedReferralId(ref.id);
                          setCurrentView('smart_referral');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
