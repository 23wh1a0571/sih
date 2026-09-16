import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { useTimeGreeting } from '../hooks/useTimeGreeting';
import { TimeGreetingBadge } from '../components/common/TimeGreetingBadge';
import {
  Heart,
  ShieldCheck,
  Globe,
  WifiOff,
  GitPullRequest,
  BarChart3,
  ArrowRight,
  Sparkles,
  Users,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Activity,
  PlayCircle,
  FileCheck2,
  MapPin,
  LogIn,
  Bot,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setRole, setDemoTourActive, syncedOfflineCount } = useApp();
  const { t } = useTranslation();
  const { greeting, dateString } = useTimeGreeting();

  return (
    <div className="space-y-16 pb-20 select-none">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0a0f1d] to-[#070b16] border border-slate-800 p-6 md:p-12 shadow-2xl">
        {/* Ambient Emergency Glow Accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Top Pill with Dynamic Time-of-Day Greeting & SIH Banner */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-teal-500/40 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                {t('sih_badge')}
              </span>
            </div>
            <TimeGreetingBadge variant="compact" showSeconds={false} />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            SwasthyaSetu <span className="text-teal-400">AI</span>
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-teal-300">
            {t('app_tagline')}
          </p>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An offline-first, multilingual emergency healthcare continuity platform connecting frontline ASHA workers,
            primary healthcare centres, tele-specialists, and district emergency hospitals.
          </p>

          {/* Core Call-to-actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setRole('asha');
                setCurrentView('asha_dashboard');
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/30 hover:scale-102 transition-all cursor-pointer"
            >
              <span>{t('btn_explore_asha')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('network_map')}
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-102 transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>{t('btn_view_map')}</span>
            </button>

            <button
              onClick={() => setCurrentView('login')}
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700 font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-teal-400" />
              <span>{t('btn_login_portal')}</span>
            </button>

            <button
              onClick={() => {
                setDemoTourActive(true);
                setRole('asha');
                setCurrentView('asha_dashboard');
              }}
              className="flex items-center gap-2 px-5 py-3.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>{t('btn_launch_tour')}</span>
            </button>
          </div>

          {/* Section 32 Emergency Message */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 text-white shadow-md max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-400 flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>National Health Equity & Emergency Mission</span>
            </p>
            <p className="text-lg font-bold mt-1 text-slate-100">
              "Healthcare should not depend on where you live."
            </p>
            <p className="text-xs text-slate-400 mt-1">
              SwasthyaSetu AI brings continuity, 108 ambulance coordination, and multilingual assistance to the last mile.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Healthcare Network Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Integrated Continuum of Care
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Breaking data silos across every tier of the public healthcare architecture
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
          {[
            {
              step: 'Tier 1',
              title: 'Rural Village',
              desc: 'Doorstep health screening & vitals capture in vernacular dialects.',
              icon: Users,
              color: 'from-blue-600 to-indigo-700',
            },
            {
              step: 'Tier 2',
              title: 'ASHA / ANM Worker',
              desc: 'Offline-first tablet app with Telugu/Hindi voice symptom extraction.',
              icon: Activity,
              color: 'from-teal-600 to-teal-800',
            },
            {
              step: 'Tier 3',
              title: 'Sub-Centre / PHC',
              desc: 'Clinical AI-assisted triage, rapid diagnostic tests & smart referral.',
              icon: Building2,
              color: 'from-emerald-600 to-emerald-800',
            },
            {
              step: 'Tier 4',
              title: 'Tele-Specialist',
              desc: 'AI patient brief, digital teleconsultation & verified clinical Rx.',
              icon: Stethoscope,
              color: 'from-indigo-600 to-indigo-800',
            },
            {
              step: 'Tier 5',
              title: 'District Hospital',
              desc: 'Bed coordination, inpatient escalation & quality monitoring.',
              icon: ShieldCheck,
              color: 'from-rose-600 to-rose-800',
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-sm hover:border-teal-500/50 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.step}
                    </span>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-base mb-1.5 group-hover:text-teal-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
                  <span>Connected</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Impact Statistics */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-900/95 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400">12,482</p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">{t('metric_patients_today')}</p>
              <span className="text-[10px] text-teal-300">Kurnool District Prototype</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400">2,841</p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Referrals Completed</p>
              <span className="text-[10px] text-indigo-300">Avg transit 4.2 hrs</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">{syncedOfflineCount}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">{t('metric_pending_sync')}</p>
              <span className="text-[10px] text-amber-300">Zero data loss at fringe</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">94%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">{t('metric_due_followups')}</p>
              <span className="text-[10px] text-emerald-300">Community ASHA alerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why SwasthyaSetu? (6 Pillars) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Why SwasthyaSetu AI?
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Engineered to overcome critical barriers in rural emergency public healthcare delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Emergency Access & 108 Dispatch',
              desc: 'Enables rapid frontline triage and direct connection to 108 emergency ambulances with live corridor tracking.',
              icon: Heart,
              badge: 'Last-Mile Delivery',
            },
            {
              title: 'Continuity of Care',
              desc: 'Unifies fragmented paper slips into a single longitudinal health timeline from village registration to hospital discharge.',
              icon: Layers,
              badge: 'Zero Data Gaps',
            },
            {
              title: 'Multilingual Voice AI',
              desc: 'Understands Telugu, Hindi, and regional dialects with instant NLP symptom extraction and reverse vernacular patient briefing.',
              icon: Globe,
              badge: 'Vernacular First',
            },
            {
              title: 'Offline-First Resilience',
              desc: 'Full local cache on low-cost tablets. Records save instantly without network and automatically sync when connectivity returns.',
              icon: WifiOff,
              badge: 'Edge Offline Sync',
            },
            {
              title: 'Smart Digital Referrals',
              desc: 'Generates structured digital referrals (e.g., REF-2026-00142) with live 4-stage tracking: Sub-Centre → PHC → Specialist → DH.',
              icon: GitPullRequest,
              badge: 'Auditable Transfers',
            },
            {
              title: 'Quality & Bottleneck Monitoring',
              desc: 'District command center with real-time alerts flagging high referral delays, dropping follow-ups, and facility workload surges.',
              icon: BarChart3,
              badge: 'Health Intelligence',
            },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-sm hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-950/80 border border-teal-500/40 px-2 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-800 text-teal-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety & Clinical Assistive Tool Card */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shrink-0 shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-amber-200">
                AI that assists healthcare workers — not replaces doctors.
              </h3>
              <p className="text-sm text-amber-300/80 leading-relaxed font-medium">
                AI-generated suggestions are decision-support only. Final clinical decisions, diagnosis,
                and drug prescription remain strictly with qualified healthcare professionals.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-amber-300">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No automated prescription generation
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Risk stratification decision support only
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Doctor-verified clinical notes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Role Explorer Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Explore Application by Stakeholder Role
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any role to enter directly with rich synthetic demonstration data
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              role: 'asha',
              name: 'ASHA / ANM Worker',
              person: 'Sai Mikkil Reddy',
              view: 'asha_dashboard',
              desc: 'Frontline registration, Telugu voice NLP, offline triage & follow-up roster.',
              icon: Users,
              color: 'border-teal-500/30 hover:border-teal-400 bg-slate-900/90',
            },
            {
              role: 'doctor',
              name: 'Specialist Physician',
              person: 'Dr. Vikram Rathore',
              view: 'doctor_dashboard',
              desc: 'Inbound referral queue, AI patient briefs & simulated teleconsultation.',
              icon: Stethoscope,
              color: 'border-indigo-500/30 hover:border-indigo-400 bg-slate-900/90',
            },
            {
              role: 'phc',
              name: 'PHC Staff / MO',
              person: 'Dr. K. S. Rao',
              view: 'asha_dashboard',
              desc: 'Intermediate clinical reviews, lab work verification & referral escalation.',
              icon: Building2,
              color: 'border-blue-500/30 hover:border-blue-400 bg-slate-900/90',
            },
            {
              role: 'admin',
              name: 'District Health Officer',
              person: 'S. K. Verma, IAS',
              view: 'quality_dashboard',
              desc: 'Command center, referral transit KPIs, bottleneck alerts & facility matrix.',
              icon: BarChart3,
              color: 'border-amber-500/30 hover:border-amber-400 bg-slate-900/90',
            },
          ].map((r, i) => {
            const Icon = r.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  setRole(r.role as any);
                  setCurrentView(r.view as any);
                }}
                className={`p-5 rounded-2xl border text-left transition-all hover:scale-102 hover:shadow-xl cursor-pointer ${r.color}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-teal-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    1-Click Demo
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{r.name}</h4>
                <p className="text-xs text-teal-400 font-semibold mb-2">{r.person}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-200">
                  <span>Enter Role</span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
