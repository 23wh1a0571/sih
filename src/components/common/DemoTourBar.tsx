import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  CheckCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const DEMO_STEPS = [
  { step: 1, title: 'Landing Page Overview', subtitle: 'National rural healthcare network vision' },
  { step: 2, title: 'Frontline Worker Login', subtitle: 'Select ASHA role: Sai Mikkil Reddy (Kurnool)' },
  { step: 3, title: 'ASHA Daily Dashboard', subtitle: 'Village triage queue & offline indicators' },
  { step: 4, title: 'Register New Patient', subtitle: 'Open Ramesh Kumar registration form' },
  { step: 5, title: 'Vernacular Telugu Input', subtitle: 'Select Telugu language & simulated voice' },
  { step: 6, title: 'AI Symptom Extraction', subtitle: 'NLP parses fever 3d, headache, vomiting' },
  { step: 7, title: 'AI-Assisted Triage Review', subtitle: 'Vitals & clinical decision-support evaluation' },
  { step: 8, title: 'Moderate Risk Stratification', subtitle: 'PHC evaluation recommended (Not doctor replacement)' },
  { step: 9, title: 'Simulate Offline Mode', subtitle: 'Toggle Internet OFF in remote village' },
  { step: 10, title: 'Local Offline Record Save', subtitle: 'Stores securely with Pending Sync counter' },
  { step: 11, title: 'Restore Connectivity & Sync', subtitle: 'Toggle Online & trigger cloud synchronization' },
  { step: 12, title: 'Generate Smart Referral', subtitle: 'Issue REF-2026-00142 to District Hospital' },
  { step: 13, title: 'Doctor Specialist Portal', subtitle: 'Switch to Dr. Vikram Rathore dashboard' },
  { step: 14, title: 'Review AI Patient Brief', subtitle: 'Instant pre-consultation clinical summary' },
  { step: 15, title: 'Teleconsultation & Rx Notes', subtitle: 'Simulate call, enter diagnosis & prescription' },
  { step: 16, title: 'District Command Center', subtitle: 'Real-time KPIs, SVG charts & AI quality alerts' },
];

export const DemoTourBar: React.FC = () => {
  const { demoStep, nextDemoStep, prevDemoStep, setDemoStep, demoTourActive, setDemoTourActive } =
    useApp();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!demoTourActive) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setDemoTourActive(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-semibold text-xs tracking-wide uppercase rounded-full shadow-lg hover:shadow-teal-500/25 hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>Launch SIH Demo Tour</span>
        </button>
      </div>
    );
  }

  const current = DEMO_STEPS.find((s) => s.step === demoStep) || DEMO_STEPS[0];
  const progressPercent = ((demoStep - 1) / (DEMO_STEPS.length - 1)) * 100;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-64 md:right-8 z-40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
      <div className="bg-slate-900/95 text-white border border-teal-500/30 rounded-2xl shadow-2xl backdrop-blur-xl p-3 md:p-4 overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mb-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-400 to-indigo-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Step Meta */}
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400 text-teal-300 font-bold text-xs shrink-0">
              {demoStep}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-teal-400 font-bold">
                  SIH Presentation Guide • Step {demoStep} of 16
                </span>
              </div>
              <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                {current.title}
                <span className="hidden sm:inline text-xs text-slate-400 font-normal">
                  — {current.subtitle}
                </span>
              </h4>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* Quick Step Selector */}
            <select
              value={demoStep}
              onChange={(e) => setDemoStep(Number(e.target.value))}
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
            >
              {DEMO_STEPS.map((s) => (
                <option key={s.step} value={s.step}>
                  {s.step}. {s.title}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevDemoStep}
                disabled={demoStep === 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Demo Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextDemoStep}
                disabled={demoStep === 16}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>{demoStep === 16 ? 'Completed' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDemoTourActive(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
