import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MultilingualVoiceAssistant } from '../components/voice/MultilingualVoiceAssistant';
import { aiService } from '../services/aiService';
import type { Language } from '../types';
import {
  UserPlus,
  Save,
  Activity,
  ArrowRight,
  WifiOff,
  Sparkles,
  Heart,
  Thermometer,
  Wind,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const PatientRegistration: React.FC = () => {
  const {
    addPatient,
    setCurrentView,
    setSelectedPatientId,
    language,
    isOfflineMode,
    toggleOfflineMode,
  } = useApp();
  const { t } = useTranslation();

  // Form State initialized with Ramesh Kumar's profile for seamless SIH demo
  const [name, setName] = useState('Ramesh Kumar');
  const [age, setAge] = useState<number | string>(54);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+91 98480 23145');
  const [village, setVillage] = useState('Venkatapuram');
  const [address, setAddress] = useState('H.No 3-42, Near Gram Panchayat, Venkatapuram');
  const [preferredLang, setPreferredLang] = useState<Language>('te');
  const [emergencyName, setEmergencyName] = useState('Suresh Kumar');
  const [emergencyRelation, setEmergencyRelation] = useState('Son');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98480 99881');

  // Clinical & Vitals State
  const [symptomsInput, setSymptomsInput] = useState('Fever, Headache, Vomiting');
  const [duration, setDuration] = useState('3 days');
  const [symptomsDesc, setSymptomsDesc] = useState(
    'High fever for 3 days accompanied by persistent headache and episodes of non-bilious vomiting.'
  );
  const [existingConditions, setExistingConditions] = useState('Mild pre-hypertension');
  const [currentMedication, setCurrentMedication] = useState('Paracetamol 500mg SOS');
  const [allergies, setAllergies] = useState('No known drug allergies');

  const [temperature, setTemperature] = useState<number | string>(102.0);
  const [bloodPressure, setBloodPressure] = useState('128/82');
  const [heartRate, setHeartRate] = useState<number | string>(88);
  const [spo2, setSpo2] = useState<number | string>(97);

  // Auto-fill from Voice Assistant callback
  const handleVoiceExtracted = (data: {
    symptoms: string[];
    duration: string;
    description: string;
    language: Language;
  }) => {
    setSymptomsInput(data.symptoms.join(', '));
    setDuration(data.duration);
    setSymptomsDesc(data.description);
    setPreferredLang(data.language);
  };

  const handleSave = (proceedToTriage: boolean = false, saveAsOffline: boolean = false) => {
    if (saveAsOffline && !isOfflineMode) {
      toggleOfflineMode();
    }

    const symptomsList = symptomsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const conditionsList = existingConditions.split(',').map((c) => c.trim()).filter(Boolean);

    const vitals = {
      temperature: Number(temperature) || 98.6,
      bloodPressure: bloodPressure || '120/80',
      heartRate: Number(heartRate) || 75,
      spo2: Number(spo2) || 98,
    };

    // Calculate AI Triage evaluation
    const triageEval = aiService.evaluateTriage(symptomsList, vitals, Number(age) || 40, conditionsList);

    const saved = addPatient({
      name,
      age: Number(age) || 40,
      gender,
      phone,
      village,
      address,
      preferredLanguage: preferredLang,
      emergencyContact: {
        name: emergencyName,
        relation: emergencyRelation,
        phone: emergencyPhone,
      },
      symptoms: symptomsList,
      symptomsDescription: symptomsDesc,
      duration,
      existingConditions: conditionsList,
      currentMedication,
      allergies,
      vitals,
      riskLevel: triageEval.riskLevel,
      suggestedAction: triageEval.suggestedAction,
      missingInfo: triageEval.missingInformation,
    });

    setSelectedPatientId(saved.id);

    if (proceedToTriage) {
      setCurrentView('ai_triage');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-teal-400" />
            <span>{t('form_patient_reg', 'Frontline Patient Registration')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Rapid rural registration with vernacular speech recognition & offline persistence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(false, true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/60 font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span>{t('offline_status', 'Save Offline')}</span>
          </button>
        </div>
      </div>

      {/* Embedded Multilingual Voice Assistant */}
      <MultilingualVoiceAssistant onApplyExtractedData={handleVoiceExtracted} />

      {/* Main Registration Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave(true, false);
        }}
        className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 md:p-8 space-y-8 backdrop-blur-sm"
      >
        {/* Section 1: Demographics */}
        <div>
          <h2 className="text-base font-bold text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-950 text-teal-300 border border-teal-800 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span>Patient Demographics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('form_full_name', 'Full Name')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="e.g. Ramesh Kumar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('form_age', 'Age')} *
              </label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="54"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('form_gender', 'Gender')} *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white outline-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('form_phone', 'Phone Number')}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="+91 98480 23145"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('form_village', 'Village / Hamlet')} *
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="Venkatapuram"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Local Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="House No, Landmark"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('change_language', 'Preferred Language')}
              </label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as Language)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white outline-none cursor-pointer"
              >
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 outline-none"
                placeholder="Suresh Kumar"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Relationship
              </label>
              <input
                type="text"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 outline-none"
                placeholder="Son"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Emergency Phone
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 outline-none"
                placeholder="+91 98480 99881"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Symptoms & History */}
        <div>
          <h2 className="text-base font-bold text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-950 text-teal-300 border border-teal-800 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span>{t('symptoms', 'Symptoms & Health Information')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Reported Symptoms (Comma Separated) *
              </label>
              <input
                type="text"
                required
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="Fever, Headache, Vomiting"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Duration of Illness *
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="3 days"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('form_symptoms_desc', 'Detailed Symptom Description')}
              </label>
              <textarea
                rows={2}
                value={symptomsDesc}
                onChange={(e) => setSymptomsDesc(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="Detailed patient complaints..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Existing Conditions
              </label>
              <input
                type="text"
                value={existingConditions}
                onChange={(e) => setExistingConditions(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="e.g. Mild pre-hypertension"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Current Medication
              </label>
              <input
                type="text"
                value={currentMedication}
                onChange={(e) => setCurrentMedication(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="e.g. Paracetamol 500mg SOS"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Known Drug Allergies
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-teal-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="e.g. No known drug allergies"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Vital Signs */}
        <div>
          <h2 className="text-base font-bold text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-950 text-teal-300 border border-teal-800 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span>{t('vitals_title', 'Recorded Vital Parameters')}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-300 mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>{t('vital_temp', 'Temp (°F)')}</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full text-lg font-black p-2 rounded-lg border border-slate-700 bg-slate-900 text-white outline-none"
                placeholder="102.0"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 98.6°F</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t('vital_bp', 'BP (mmHg)')}</span>
              </label>
              <input
                type="text"
                required
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full text-lg font-black p-2 rounded-lg border border-slate-700 bg-slate-900 text-white outline-none"
                placeholder="128/82"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 120/80</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>{t('vital_hr', 'Heart Rate')}</span>
              </label>
              <input
                type="number"
                required
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full text-lg font-black p-2 rounded-lg border border-slate-700 bg-slate-900 text-white outline-none"
                placeholder="88"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: 60-100</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-1 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('vital_spo2', 'SpO2 (%)')}</span>
              </label>
              <input
                type="number"
                required
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full text-lg font-black p-2 rounded-lg border border-slate-700 bg-slate-900 text-white outline-none"
                placeholder="97"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Normal: &gt;95%</span>
            </div>
          </div>
        </div>

        {/* Submission Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => handleSave(false, true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>Save Record Locally</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 rounded-xl font-black text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-101 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span>Save & Proceed to AI Triage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
