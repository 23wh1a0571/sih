import React from 'react';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';
import { Users, Stethoscope, Building2, ShieldAlert, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const RoleLogin: React.FC = () => {
  const { setRole } = useApp();

  const roles: Array<{
    id: Role;
    title: string;
    persona: string;
    location: string;
    description: string;
    icon: any;
    color: string;
    btnClass: string;
    features: string[];
  }> = [
    {
      id: 'asha',
      title: 'ASHA / ANM Frontline Worker',
      persona: 'Sai Mikkil Reddy (ASHA)',
      location: 'Venkatapuram Sub-Centre, Kurnool Block',
      description: 'Conduct village health surveys, register patients via Telugu voice recognition, and triage with offline-first support.',
      icon: Users,
      color: 'border-teal-300 bg-teal-50/60',
      btnClass: 'bg-teal-600 hover:bg-teal-700 text-white',
      features: ['Multilingual Voice Input', 'Offline-First Local Storage', 'Frontline Triage Risk Scoring'],
    },
    {
      id: 'doctor',
      title: 'Doctor / Specialist Physician',
      persona: 'Dr. Vikram Rathore (MD)',
      location: 'District Hospital Kurnool (General Medicine)',
      description: 'Review inbound smart referrals, consult via simulated teleconsultation, and document doctor-entered treatment notes.',
      icon: Stethoscope,
      color: 'border-indigo-300 bg-indigo-50/60',
      btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      features: ['AI Patient Clinical Brief', 'Simulated Teleconsultation', 'Prescription Documentation'],
    },
    {
      id: 'phc',
      title: 'PHC Medical Officer & Staff',
      persona: 'Dr. K. S. Rao (MBBS)',
      location: 'PHC Kurnool Rural',
      description: 'Evaluate frontline referrals, review rapid diagnostic tests (Malaria/Dengue), and escalate cases to district hospital.',
      icon: Building2,
      color: 'border-blue-300 bg-blue-50/60',
      btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      features: ['Intermediate Diagnostics Review', 'Smart Referral Escalation', 'Bed & OPD Routing'],
    },
    {
      id: 'admin',
      title: 'District Healthcare Administrator',
      persona: 'S. K. Verma, IAS',
      location: 'District Health Command Center, Kurnool',
      description: 'Monitor district-wide healthcare quality, track referral transit delays, view facility workloads, and respond to AI bottleneck alerts.',
      icon: ShieldAlert,
      color: 'border-amber-300 bg-amber-50/60',
      btnClass: 'bg-amber-600 hover:bg-amber-700 text-white',
      features: ['Real-time KPI Analytics', 'Referral Delay Detection', 'Facility Performance Matrix'],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SIH Prototype • Zero Friction Demo Mode</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Welcome to SwasthyaSetu AI
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Select a healthcare persona to experience role-based continuity of care across rural and district tiers.
        </p>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg flex flex-col justify-between ${r.color}`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-white rounded-2xl shadow-xs text-slate-800 border border-slate-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white rounded-full border border-slate-200 text-slate-600">
                    Demo Role
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{r.title}</h3>
                  <p className="text-xs font-bold text-teal-700">{r.persona}</p>
                  <p className="text-[11px] text-slate-500">{r.location}</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {r.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  {r.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => setRole(r.id)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all ${r.btnClass}`}
                >
                  <span>Login as {r.persona.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Information */}
      <div className="p-4 rounded-xl bg-slate-100 text-center text-xs text-slate-500">
        <p>
          🔒 <strong>Demo Mode Activated</strong>: No passwords or OTPs required for hackathon presentation.
          Data resets automatically upon browser session refresh or via settings.
        </p>
      </div>
    </div>
  );
};
