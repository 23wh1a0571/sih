import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { Badge } from '../components/common/Badge';
import type { Facility } from '../types';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Building2,
  Clock,
  CheckCircle2,
  Users,
  Send,
  CalendarCheck,
  HardDrive,
  Sparkles,
  ChevronRight,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { useTimeGreeting } from '../hooks/useTimeGreeting';
import { TimeGreetingBadge } from '../components/common/TimeGreetingBadge';
import { useTranslation } from '../hooks/useTranslation';

export const DistrictQualityDashboard: React.FC = () => {
  const { facilities, syncedOfflineCount, currentUser } = useApp();
  const { greeting, shiftLabel } = useTimeGreeting();
  const { t } = useTranslation();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const qualityAlerts = aiService.getQualityAlerts();

  // Monthly Patient Trend Data
  const monthlyTrends = [
    { month: 'Apr', patients: 1820, referrals: 380 },
    { month: 'May', patients: 2150, referrals: 420 },
    { month: 'Jun', patients: 1980, referrals: 395 },
    { month: 'Jul', patients: 2450, referrals: 510 },
    { month: 'Aug', patients: 2780, referrals: 590 },
    { month: 'Sep (Proj)', patients: 2950, referrals: 640 },
  ];

  const maxPatients = 3200;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Command Center Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-[#0a0f1d] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
              National Health Mission • AP-Kurnool Zone
            </span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-teal-200">Real-time Quality Oversight</span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-md border border-amber-300/30">
              {shiftLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t('nav_command_center', 'District Healthcare Command Center')}
            </h1>
            <TimeGreetingBadge variant="dashboard" userName={currentUser.name} />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Welcome, <strong>{currentUser.name}</strong> ({currentUser.designation}). Continuity analytics, referral transit velocity, offline sync telemetry, and AI-driven quality bottleneck alerts.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-white shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry Active • 42 PHCs Connected</span>
          </div>
          <span className="text-[11px] text-slate-400">Data fresh as of 2 mins ago</span>
        </div>
      </div>

      {/* Large KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-4 shadow-lg backdrop-blur-sm hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('metric_patients_today', 'Patients Served')}</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">12,482</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% MoM</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-4 shadow-lg backdrop-blur-sm hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Referrals</span>
            <Send className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400">143</p>
          <span className="text-[11px] text-slate-400 font-medium">In active transit</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-4 shadow-lg backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Referrals</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-400">2,841</p>
          <span className="text-[11px] text-slate-400 font-medium">91.9% Resolution</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-4 shadow-lg backdrop-blur-sm hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Referral Time</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">4.2 hrs</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mt-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-1.8 hrs improved</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-4 shadow-lg backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Follow-up Rate</span>
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">91%</p>
          <span className="text-[11px] text-slate-400 font-medium">District benchmark 85%</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-4 shadow-lg backdrop-blur-sm hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('pending_sync', 'Offline Synced')}</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-400">{syncedOfflineCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">Zero packet loss</span>
        </div>
      </div>

      {/* AI Quality Bottleneck Alerts */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">
                AI-Powered Quality Alerts
              </h2>
              <p className="text-xs text-slate-400">
                Automated operational anomaly detection across primary and secondary healthcare delivery nodes
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Analytics Alerts (Non-Diagnostic)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {qualityAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/40 transition-colors flex items-start gap-3"
            >
              <span className="text-lg shrink-0 mt-0.5">{alert.severityTag}</span>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white">{alert.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">{alert.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Monthly Patient Visits & Referrals Trend (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Patient Footfall & Referral Growth
              </h3>
              <p className="text-xs text-slate-400">
                Monthly trends across Kurnool primary rural cluster
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-teal-400">
                <span className="w-2.5 h-2.5 rounded bg-teal-500" />
                Footfall
              </span>
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                Referrals
              </span>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyTrends.map((item, idx) => {
              const patientHeight = (item.patients / maxPatients) * 100;
              const referralHeight = (item.referrals / 800) * 80;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Values popup on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-slate-950 border border-slate-700 text-white rounded px-1.5 py-0.5 mb-1 whitespace-nowrap shadow-lg">
                    {item.patients} pts / {item.referrals} ref
                  </div>

                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    {/* Patient Bar */}
                    <div
                      className="w-1/2 bg-teal-500 hover:bg-teal-400 rounded-t-md transition-all group-hover:scale-y-102 origin-bottom shadow-sm shadow-teal-500/20"
                      style={{ height: `${patientHeight}%` }}
                    />
                    {/* Referral Bar */}
                    <div
                      className="w-1/3 bg-indigo-500 hover:bg-indigo-400 rounded-t-md transition-all group-hover:scale-y-102 origin-bottom shadow-sm shadow-indigo-500/20"
                      style={{ height: `${referralHeight}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-bold text-slate-400 mt-2">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Referral Turnaround Time by Facility (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm sm:text-base">
              Average Referral Time (Hours)
            </h3>
            <p className="text-xs text-slate-400">
              District Benchmark: &lt; 4.0 Hours
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {facilities.map((fac) => {
              const isOverBenchmark = fac.avgReferralHours > 4.0;
              const widthPercent = Math.min(100, (fac.avgReferralHours / 10) * 100);

              return (
                <div key={fac.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{fac.name}</span>
                    <span
                      className={`font-mono font-extrabold ${
                        isOverBenchmark ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {fac.avgReferralHours} hrs
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isOverBenchmark ? 'bg-rose-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-medium">
            💡 <strong>Observation:</strong> PHC Betamcherla exceeds transit benchmark due to local ambulance availability constraints.
          </div>
        </div>
      </div>

      {/* Facility Performance Matrix & Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/40">
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              Facility Performance & Workload Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Click any facility row to inspect deep-dive telemetry, staff workload, and offline sync compliance
            </p>
          </div>
          <span className="text-xs text-teal-400 font-bold">
            Showing {facilities.length} Public Health Facilities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="p-4">Facility Name & Type</th>
                <th className="p-4">Patients</th>
                <th className="p-4">Referrals</th>
                <th className="p-4">Avg Referral Time</th>
                <th className="p-4">Follow-up Rate</th>
                <th className="p-4">Workload</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Deep Dive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-semibold text-slate-200">
              {facilities.map((fac) => {
                const statusBadge = {
                  Excellent: 'emerald' as const,
                  Good: 'teal' as const,
                  'Needs Attention': 'rose' as const,
                };

                return (
                  <tr
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors" />
                        <span>{fac.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal pl-6">
                        {fac.type} • {fac.location}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-white">
                      {fac.patientsCount.toLocaleString()}
                    </td>

                    <td className="p-4 font-mono text-indigo-400">
                      {fac.referralsCount}
                    </td>

                    <td className="p-4 font-mono">
                      <span
                        className={fac.avgReferralHours > 4.5 ? 'text-rose-400 font-bold' : 'text-slate-200'}
                      >
                        {fac.avgReferralHours} hrs
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-emerald-400">
                      {fac.followUpRate}%
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              fac.staffWorkload > 85 ? 'bg-rose-500' : 'bg-teal-500'
                            }`}
                            style={{ width: `${fac.staffWorkload}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {fac.staffWorkload}%
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge variant={statusBadge[fac.status]} size="sm" dot>
                        {fac.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <button className="p-1.5 rounded-lg text-slate-400 group-hover:text-teal-400 group-hover:bg-slate-800 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facility Detailed Analytics Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-teal-950/80 text-teal-400 border border-teal-800/60">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {selectedFacility.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedFacility.type} • {selectedFacility.location}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFacility(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Indicators Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Patient Volume</p>
                <p className="text-lg font-black text-white mt-0.5">
                  {selectedFacility.patientsCount}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Referrals Handled</p>
                <p className="text-lg font-black text-indigo-400 mt-0.5">
                  {selectedFacility.referralsCount}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Avg Transit Time</p>
                <p className="text-lg font-black text-amber-400 mt-0.5">
                  {selectedFacility.avgReferralHours} hrs
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Offline Sync Rate</p>
                <p className="text-lg font-black text-emerald-400 mt-0.5">
                  {selectedFacility.offlineSyncRate}%
                </p>
              </div>
            </div>

            {/* Workload Progress */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Staff Workload Capacity</span>
                <span className={selectedFacility.staffWorkload > 85 ? 'text-rose-400' : 'text-teal-400'}>
                  {selectedFacility.staffWorkload}% utilization
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full ${
                    selectedFacility.staffWorkload > 85 ? 'bg-rose-500' : 'bg-teal-500'
                  }`}
                  style={{ width: `${selectedFacility.staffWorkload}%` }}
                />
              </div>
            </div>

            {/* Areas Requiring Attention */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Areas Requiring Attention & Field Audit Notes</span>
              </h4>
              <div className="space-y-1.5">
                {selectedFacility.attentionNotes.map((note, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 font-medium flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFacility(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Facility View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
