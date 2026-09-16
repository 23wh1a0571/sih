import React from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../types';
import {
  Settings,
  Languages,
  Eye,
  Type,
  Volume2,
  HardDrive,
  Shield,
  Lock,
  FileCheck2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const SettingsPage: React.FC = () => {
  const {
    language,
    setLanguage,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    voiceSpeed,
    setVoiceSpeed,
    showToast,
  } = useApp();
  const { t } = useTranslation();

  const handleResetDemoData = () => {
    localStorage.removeItem('swasthya_patients');
    localStorage.removeItem('swasthya_referrals');
    showToast('Demo storage reset to initial synthetic dataset. Reloading...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-400" />
          <span>{t('nav_settings', 'Platform Settings & Accessibility')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Personalize vernacular localization, display contrast, offline syncing, and review data privacy posture
        </p>
      </div>

      {/* Language Preferences */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Languages className="w-5 h-5 text-teal-400" />
          <h2 className="font-bold text-white text-base">
            {t('change_language', 'Default Interface Language')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'en', label: 'English', desc: 'Standard English for administrative reviews' },
            { id: 'te', label: 'తెలుగు (Telugu)', desc: 'Primary vernacular language in Andhra Pradesh & Telangana' },
            { id: 'hi', label: 'हिन्दी (Hindi)', desc: 'Standard Hindi for national public health worker coordination' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id as Language)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                language === lang.id
                  ? 'border-teal-400 bg-teal-950/60 ring-2 ring-teal-500/30 shadow-lg'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-sm">{lang.label}</span>
                {language === lang.id && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
              </div>
              <p className="text-xs text-slate-400 leading-tight">{lang.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Controls */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Eye className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold text-white text-base">
            Accessibility & Visual Ergonomics
          </h2>
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white">High Contrast Mode</h4>
            <p className="text-xs text-slate-400">
              Increases border weight and contrast for frontline workers operating outdoors in direct sunlight
            </p>
          </div>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              highContrast ? 'bg-teal-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Font Size Scaling */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-slate-400" />
            <span>Font Size Scaling</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'normal', label: 'Normal (100%)' },
              { id: 'large', label: 'Large (115%)' },
              { id: 'xlarge', label: 'Extra Large (130%)' },
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => setFontSize(size.id as any)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  fontSize === size.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Assistant Speed */}
        <div>
          <div className="flex items-center justify-between mb-1 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <span>Voice Readout Speed</span>
            </span>
            <span className="text-teal-400 font-mono">{voiceSpeed}x speed</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.25"
            value={voiceSpeed}
            onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Security & Data Privacy Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="font-bold text-white text-base">
              Data Privacy & Security Architecture
            </h2>
            <p className="text-xs text-slate-400">
              "Patient data is sensitive." Transparent security posture for Smart India Hackathon
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
              <Lock className="w-4 h-4 text-teal-400" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <p className="text-xs text-slate-400">
              Frontline ASHA workers only access their assigned village hamlets; doctors access inbound referral queues.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <FileCheck2 className="w-4 h-4 text-indigo-400" />
              <span>Minimal Data Exposure</span>
            </div>
            <p className="text-xs text-slate-400">
              Personal identifying details are compartmentalized; diagnostic reports are scoped to clinical need.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span>Offline Edge Encryption Model</span>
            </div>
            <p className="text-xs text-slate-400">
              Local tablet storage operates via secure client-side sandbox before background TLS cloud sync.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Ayushman Bharat (ABDM) Readiness</span>
            </div>
            <p className="text-xs text-slate-400">
              Data structures (ABHA ID, FHIR encounter models) designed for seamless integration with national health stack.
            </p>
          </div>
        </div>

        {/* SIH compliance note */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
          <p className="font-bold text-amber-300">
            ⚠️ SIH Prototype Disclosure:
          </p>
          <p>
            This system runs on synthetic, fictional patient datasets for demonstration purposes.
            No claim of full certified ABDM/government regulatory compliance is made until sandbox testing is concluded.
          </p>
        </div>
      </div>

      {/* Demo State Reset Button */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">
        <div>
          <h3 className="text-sm font-bold text-white">Reset Prototype Demonstration Data</h3>
          <p className="text-xs text-slate-400">
            Clears browser localStorage and restores Ramesh Kumar and initial Kurnool district records
          </p>
        </div>
        <button
          onClick={handleResetDemoData}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Store</span>
        </button>
      </div>
    </div>
  );
};
