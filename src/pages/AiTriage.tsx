import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { Badge } from '../components/common/Badge';
import { AmbulanceLoader } from '../components/common/AmbulanceLoader';
import { useTranslation } from '../hooks/useTranslation';
import {
  Activity,
  AlertTriangle,
  Send,
  User,
  Thermometer,
  Heart,
  Wind,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  Building2,
  FileText,
  Zap,
} from 'lucide-react';

export const AiTriage: React.FC = () => {
  const { selectedPatient, setCurrentView } = useApp();
  const { t } = useTranslation();
  const [isSimulatingAmbulance, setIsSimulatingAmbulance] = useState(false);

  // Run triage decision-support evaluation
  const evaluation = aiService.evaluateTriage(
    selectedPatient.symptoms,
    selectedPatient.vitals,
    selectedPatient.age,
    selectedPatient.existingConditions
  );

  const riskBadgeVariants = {
    Low: 'emerald' as const,
    Moderate: 'amber' as const,
    High: 'rose' as const,
    Emergency: 'rose' as const,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40">
              {t('triage_decision_support')}
            </span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-slate-400 font-medium">Frontline Clinical Screening</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-400" />
            <span>{t('nav_ai_triage')}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('smart_referral')}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/30 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('btn_create_referral')}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer Banner */}
      <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-md flex items-start gap-3.5">
        <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Mandatory Clinical Safety Notice
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-amber-100 leading-relaxed">
            AI-assisted decision support only. This does not constitute a medical diagnosis. Final assessment and treatment must be performed by a qualified healthcare professional.
          </p>
          <p className="text-[11px] text-amber-400/80">
            Designed in accordance with clinical triage safety protocols. Definitive diagnoses are withheld.
          </p>
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-teal-300 font-extrabold flex items-center justify-center text-lg border border-slate-700">
              {selectedPatient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">{selectedPatient.name}</h2>
              <p className="text-xs text-slate-400">
                {selectedPatient.age} years • {selectedPatient.gender} • Village: {selectedPatient.village}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">{t('risk_level')}:</span>
            <Badge variant={riskBadgeVariants[evaluation.riskLevel]} size="lg" dot>
              {evaluation.riskLevel} Risk
            </Badge>
          </div>
        </div>

        {/* Symptoms & Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Symptoms List */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t('symptoms')}
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Fever</span>
                <span className="text-rose-400 font-bold">{selectedPatient.duration || '3 days'}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Headache</span>
                <span className="text-teal-400">Present</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Vomiting</span>
                <span className="text-amber-400">3-4 episodes</span>
              </div>
            </div>
          </div>

          {/* Vitals Display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t('vitals_title')}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('vital_temp')}</p>
                <p className="text-sm font-extrabold text-rose-400">
                  {selectedPatient.vitals.temperature}°F
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('vital_bp')}</p>
                <p className="text-sm font-extrabold text-slate-200">
                  {selectedPatient.vitals.bloodPressure}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('vital_spo2')}</p>
                <p className="text-sm font-extrabold text-teal-400">
                  {selectedPatient.vitals.spo2}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment & Decision Support Card (Section 10) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">
              Clinical Risk Stratification & Recommended Pathway
            </h2>
            <p className="text-xs text-slate-400">
              Rule-based intelligence matching Indian Public Health Standards (IPHS)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Triage Score:</span>
            <span className="text-sm font-extrabold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40">
              {evaluation.riskScore} / 100
            </span>
          </div>
        </div>

        {/* Suggested Next Step */}
        <div className="p-4 rounded-xl bg-teal-950/60 border border-teal-500/40 space-y-1.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-teal-300">
              {t('recommendation')}
            </p>
          </div>
          <p className="text-base font-bold text-white">
            {evaluation.suggestedAction}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-teal-300 pt-1">
            <span><strong>Target Facility:</strong> {evaluation.recommendedFacility}</span>
            <span>•</span>
            <span><strong>Recommended Window:</strong> {evaluation.urgencyTimeline}</span>
          </div>
        </div>

        {/* Key Risk Factors Identified */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Key Risk Drivers Flagged by Decision Support
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {evaluation.keyRiskFactors.map((rf, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{rf}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Information Missing Checklist (Section 10) */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{t('missing_info')}</span>
          </p>
          <div className="space-y-1.5">
            {evaluation.missingInformation.map((info, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{info}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-600/40">
                  Pending Verification
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('patient_profile')}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-750 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>{t('btn_view_record')}</span>
            </button>

            {/* 108 Emergency Ambulance Simulation Trigger */}
            <button
              onClick={() => setIsSimulatingAmbulance(true)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30 transition-all hover:scale-102 animate-pulse"
              title="Test Emergency Ambulance Lights & Siren"
            >
              <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{t('btn_dispatch_ambulance')}</span>
            </button>
          </div>

          <button
            onClick={() => setCurrentView('smart_referral')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>{t('btn_create_referral')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Ambulance Blinking Lights Strobe Modal */}
      {isSimulatingAmbulance && (
        <AmbulanceLoader
          overlay={true}
          message="108 Emergency Ambulance Corridor Activated"
          subtext={`Emergency ALS unit dispatched to Venkatapuram Sub-Centre for ${selectedPatient.name} • ETA 14 mins`}
          onClose={() => setIsSimulatingAmbulance(false)}
        />
      )}
    </div>
  );
};
