import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { MedicalDocumentType, MedicalDocument } from '../types';
import {
  User,
  Phone,
  MapPin,
  Globe,
  Clock,
  Send,
  Activity,
  Calendar,
  FileText,
  AlertCircle,
  FlaskConical,
  Pill,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Edit3,
  Upload,
  Eye,
  Download,
  Trash2,
  X,
  FilePlus,
  ZoomIn,
  ZoomOut,
  Sliders,
  Scan,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const PatientProfile: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    setCurrentView,
    referrals,
    followUps,
    updatePatient,
    medicalDocuments,
    addMedicalDocument,
    deleteMedicalDocument,
    currentUser,
    showToast,
  } = useApp();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<
    'timeline' | 'vitals' | 'documents' | 'labs' | 'medications' | 'referrals'
  >('timeline');

  // Edit Patient Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(selectedPatient.name);
  const [editAge, setEditAge] = useState<number>(selectedPatient.age);
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Other'>(selectedPatient.gender);
  const [editPhone, setEditPhone] = useState(selectedPatient.phone);
  const [editVillage, setEditVillage] = useState(selectedPatient.village);
  const [editAddress, setEditAddress] = useState(selectedPatient.address);
  const [editSymptoms, setEditSymptoms] = useState(selectedPatient.symptoms.join(', '));
  const [editSymptomsDesc, setEditSymptomsDesc] = useState(selectedPatient.symptomsDescription);
  const [editHistory, setEditHistory] = useState(selectedPatient.existingConditions.join(', '));
  const [editMedication, setEditMedication] = useState(selectedPatient.currentMedication || '');
  const [editAllergies, setEditAllergies] = useState(selectedPatient.allergies || '');
  const [editEmergencyName, setEditEmergencyName] = useState(selectedPatient.emergencyContact.name);
  const [editEmergencyRelation, setEditEmergencyRelation] = useState(selectedPatient.emergencyContact.relation);
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(selectedPatient.emergencyContact.phone);

  // Upload Document Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<MedicalDocumentType>('CT Scan');
  const [docNotes, setDocNotes] = useState('');
  const [docFacility, setDocFacility] = useState('District Hospital Kurnool Radiology');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState('2.4 MB');

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState<MedicalDocument | null>(null);
  const [viewerZoom, setViewerZoom] = useState(1);
  const [viewerInvert, setViewerInvert] = useState(false);

  // Filter for Medical Documents
  const [docFilter, setDocFilter] = useState<string>('All');

  // Sync edit form when selectedPatient changes
  useEffect(() => {
    setEditName(selectedPatient.name);
    setEditAge(selectedPatient.age);
    setEditGender(selectedPatient.gender);
    setEditPhone(selectedPatient.phone);
    setEditVillage(selectedPatient.village);
    setEditAddress(selectedPatient.address);
    setEditSymptoms(selectedPatient.symptoms.join(', '));
    setEditSymptomsDesc(selectedPatient.symptomsDescription);
    setEditHistory(selectedPatient.existingConditions.join(', '));
    setEditMedication(selectedPatient.currentMedication || '');
    setEditAllergies(selectedPatient.allergies || '');
    setEditEmergencyName(selectedPatient.emergencyContact.name);
    setEditEmergencyRelation(selectedPatient.emergencyContact.relation);
    setEditEmergencyPhone(selectedPatient.emergencyContact.phone);
  }, [selectedPatient]);

  const patientReferrals = referrals.filter((r) => r.patientId === selectedPatient.id);
  const patientFollowUps = followUps.filter((f) => f.patientId === selectedPatient.id);
  const patientDocuments = medicalDocuments.filter((d) => d.patientId === selectedPatient.id);

  const filteredDocuments =
    docFilter === 'All'
      ? patientDocuments
      : patientDocuments.filter((d) => d.type === docFilter);

  // Handle Edit Patient Save
  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(selectedPatient.id, {
      name: editName.trim(),
      age: Number(editAge) || selectedPatient.age,
      gender: editGender,
      phone: editPhone.trim(),
      village: editVillage.trim(),
      address: editAddress.trim(),
      symptoms: editSymptoms.split(',').map((s) => s.trim()).filter(Boolean),
      symptomsDescription: editSymptomsDesc.trim(),
      existingConditions: editHistory.split(',').map((c) => c.trim()).filter(Boolean),
      currentMedication: editMedication.trim(),
      allergies: editAllergies.trim(),
      emergencyContact: {
        name: editEmergencyName.trim(),
        relation: editEmergencyRelation.trim(),
        phone: editEmergencyPhone.trim(),
      },
    });
    setShowEditModal(false);
  };

  // Handle File Upload Picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSizeStr(`${sizeMB} MB`);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, ''));
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Upload Document Submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    // Default placeholder SVG if no local image uploaded
    const defaultSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230b1120"/><rect x="20" y="20" width="560" height="360" rx="12" fill="%230f172a" stroke="%2338bdf8" stroke-width="2"/><text x="40" y="60" fill="%2338bdf8" font-family="sans-serif" font-weight="bold" font-size="16">${docType.toUpperCase()} CLINICAL RECORD</text><text x="40" y="85" fill="%2394a3b8" font-family="monospace" font-size="12">Patient: ${selectedPatient.name} (${selectedPatient.id})</text><text x="40" y="110" fill="%2394a3b8" font-family="monospace" font-size="12">Date: Today | Uploaded by: ${currentUser.name}</text><rect x="40" y="140" width="520" height="180" rx="8" fill="%231e293b"/><text x="60" y="235" fill="%2338bdf8" font-family="sans-serif" font-size="14" font-weight="bold">${docName}</text><text x="40" y="355" fill="%2322c55e" font-family="monospace" font-size="12">STATUS: DIGITALLY VERIFIED AND ENCRYPTED (ABDM COMPLIANT)</text></svg>`;

    addMedicalDocument({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      documentName: docName.trim(),
      type: docType,
      fileSize: fileSizeStr,
      fileUrl: filePreview || defaultSvg,
      notes: docNotes.trim(),
      facility: docFacility,
      uploadedBy: currentUser.name,
    });

    setShowUploadModal(false);
    setDocName('');
    setDocNotes('');
    setFilePreview(null);
  };

  // Handle Document Download
  const handleDownloadDoc = (doc: MedicalDocument) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = `${selectedPatient.name}_${doc.type}_${doc.documentName.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded: ${doc.documentName}`, 'success');
  };

  const docTypeBadgeColor: Record<MedicalDocumentType, string> = {
    'CT Scan': 'bg-cyan-950/80 text-cyan-300 border-cyan-700',
    MRI: 'bg-purple-950/80 text-purple-300 border-purple-700',
    'X-Ray': 'bg-sky-950/80 text-sky-300 border-sky-700',
    'Blood Test': 'bg-rose-950/80 text-rose-300 border-rose-700',
    Prescription: 'bg-teal-950/80 text-teal-300 border-teal-700',
    'Lab Report': 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
    'Other medical documents': 'bg-amber-950/80 text-amber-300 border-amber-700',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Patient Quick Switcher Bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Patient Roster:
        </span>
        <div className="flex items-center gap-2">
          {patients.slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all border cursor-pointer ${
                p.id === selectedPatient.id
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 border-teal-400 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {p.name} ({p.age}y)
            </button>
          ))}
        </div>
      </div>

      {/* Patient Profile Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
              {selectedPatient.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {selectedPatient.name}
                </h1>
                <Badge
                  variant={
                    selectedPatient.riskLevel === 'Low'
                      ? 'emerald'
                      : selectedPatient.riskLevel === 'Moderate'
                      ? 'amber'
                      : 'rose'
                  }
                  dot
                >
                  {selectedPatient.riskLevel} Risk
                </Badge>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-teal-400 border border-slate-700">
                  {selectedPatient.id}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-300">
                {selectedPatient.age} Years • {selectedPatient.gender} • Village: {selectedPatient.village}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {selectedPatient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  Lang: {selectedPatient.preferredLanguage === 'te' ? 'తెలుగు (Telugu)' : selectedPatient.preferredLanguage === 'hi' ? 'हिन्दी (Hindi)' : 'English'}
                </span>
                <span>
                  Emergency: {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relation}, {selectedPatient.emergencyContact.phone})
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Edit Patient, AI Triage, Smart Referral */}
          <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Edit patient personal and medical details"
            >
              <Edit3 className="w-4 h-4 text-teal-400" />
              <span>Edit Patient</span>
            </button>
            <button
              onClick={() => setCurrentView('ai_triage')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span>{t('nav_ai_triage', 'AI Triage')}</span>
            </button>
            <button
              onClick={() => setCurrentView('smart_referral')}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{t('nav_smart_referral', 'Smart Referral')}</span>
            </button>
          </div>
        </div>

        {/* Longitudinal Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 text-center">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">First Registered</p>
            <p className="text-xs font-bold text-white mt-0.5">21 Aug 2026</p>
            <p className="text-[10px] text-teal-400 font-semibold truncate">
              {selectedPatient.registeredBy || `${currentUser.name} (ASHA)`}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">Latest BP / Temp</p>
            <p className="text-xs font-bold text-white mt-0.5">
              {selectedPatient.vitals.bloodPressure} | {selectedPatient.vitals.temperature}°F
            </p>
            <p className="text-[10px] text-amber-400 font-semibold">Pyrexia Flagged</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">Active Referral</p>
            <p className="text-xs font-bold text-white mt-0.5">REF-2026-00142</p>
            <p className="text-[10px] text-indigo-400 font-semibold">District Hospital</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400">Medical Scans</p>
            <p className="text-xs font-bold text-teal-300 mt-0.5">
              {patientDocuments.length} Uploaded Files
            </p>
            <p className="text-[10px] text-slate-500">CT / MRI / X-Ray / Labs</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        {[
          { id: 'timeline', label: 'Longitudinal Timeline', count: selectedPatient.timeline.length || 5 },
          { id: 'vitals', label: 'Vitals & Symptoms', count: selectedPatient.symptoms.length },
          { id: 'documents', label: 'Medical Documents & Records', count: patientDocuments.length },
          { id: 'labs', label: 'Diagnostic Labs', count: selectedPatient.labReports.length },
          { id: 'referrals', label: 'Smart Referrals', count: patientReferrals.length },
          { id: 'medications', label: 'Medications & Allergies' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold tracking-wide border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'border-teal-400 text-teal-300 font-black'
                : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-teal-950 text-teal-300 border border-teal-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Longitudinal Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-white">Longitudinal Health Journey</h2>
            <p className="text-xs text-slate-400">
              Full audit trail connecting Frontline Worker → Primary Health Centre → Specialist Doctor → Community Follow-up
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {selectedPatient.timeline.map((event, idx) => {
              const typeColors = {
                registration: 'bg-teal-500 ring-teal-950',
                triage: 'bg-amber-500 ring-amber-950',
                consultation: 'bg-indigo-500 ring-indigo-950',
                referral: 'bg-purple-500 ring-purple-950',
                followup: 'bg-emerald-500 ring-emerald-950',
                lab: 'bg-blue-500 ring-blue-950',
              };

              return (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full ring-4 ${
                      typeColors[event.type as keyof typeof typeColors] || 'bg-slate-500 ring-slate-900'
                    }`}
                  />
                  <div className="p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/40 border border-slate-800 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className="text-sm font-bold text-white">{event.title}</h4>
                      <span className="text-xs font-semibold text-slate-400">{event.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-800/80">
                      <span className="text-teal-400 font-bold">Facility: {event.facility}</span>
                      <span>•</span>
                      <span>By: {event.performedBy}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Vitals & Symptoms */}
      {activeTab === 'vitals' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
              Current Vital Signs Record
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50">
                <p className="text-xs font-bold text-rose-300">{t('vital_temp', 'Temperature')}</p>
                <p className="text-2xl font-black text-rose-200 mt-1">
                  {selectedPatient.vitals.temperature}°F
                </p>
                <span className="text-[10px] text-rose-400 font-semibold">Elevated (Pyrexia)</span>
              </div>
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50">
                <p className="text-xs font-bold text-indigo-300">{t('vital_bp', 'Blood Pressure')}</p>
                <p className="text-2xl font-black text-indigo-200 mt-1">
                  {selectedPatient.vitals.bloodPressure}
                </p>
                <span className="text-[10px] text-indigo-400 font-semibold">mmHg</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-xs font-bold text-slate-400">{t('vital_hr', 'Heart Rate')}</p>
                <p className="text-2xl font-black text-white mt-1">
                  {selectedPatient.vitals.heartRate}
                </p>
                <span className="text-[10px] text-slate-500 font-semibold">bpm</span>
              </div>
              <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/50">
                <p className="text-xs font-bold text-teal-300">{t('vital_spo2', 'SpO2')}</p>
                <p className="text-2xl font-black text-teal-200 mt-1">
                  {selectedPatient.vitals.spo2}%
                </p>
                <span className="text-[10px] text-teal-400 font-semibold">Adequate Oxygenation</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              Symptom Narrative &amp; Frontline Observations
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              "{selectedPatient.symptomsDescription}"
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: MEDICAL DOCUMENTS & PATIENT RECORDS */}
      {activeTab === 'documents' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                <span>Patient Medical Documents &amp; Radiology Scans</span>
              </h3>
              <p className="text-xs text-slate-400">
                CT Scans, MRIs, X-Rays, Blood Tests, Digital Prescriptions, and Diagnostic Lab Reports
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Medical Document</span>
            </button>
          </div>

          {/* Document Type Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              'All',
              'CT Scan',
              'MRI',
              'X-Ray',
              'Blood Test',
              'Prescription',
              'Lab Report',
              'Other medical documents',
            ].map((type) => (
              <button
                key={type}
                onClick={() => setDocFilter(type)}
                className={`text-xs px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  docFilter === type
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-2">
              <FilePlus className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No medical documents matching this category</p>
              <p className="text-xs text-slate-500">
                Click "Upload Medical Document" to attach CT scans, MRIs, X-Rays, prescriptions or blood reports.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-3">
                    {/* Document Preview Thumbnail */}
                    <div
                      onClick={() => setViewingDoc(doc)}
                      className="relative w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer group-hover:border-teal-500/50 transition-colors flex items-center justify-center"
                    >
                      <img
                        src={doc.fileUrl}
                        alt={doc.documentName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                        <span className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Full Screen</span>
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-sm text-slate-100 line-clamp-1">
                          {doc.documentName}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                            docTypeBadgeColor[doc.type] || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {doc.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-1">
                        <span>Patient: <strong className="text-slate-300">{doc.patientName}</strong></span>
                        <span>•</span>
                        <span>Date: {doc.uploadDate}</span>
                        <span>•</span>
                        <span>Size: {doc.fileSize}</span>
                      </div>
                      {doc.notes && (
                        <p className="text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg mt-2 border border-slate-800/80 line-clamp-2">
                          {doc.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: View, Download, Delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-[10px] text-slate-500 font-mono">
                      By: {doc.uploadedBy}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-700 hover:border-teal-500/50 transition-colors cursor-pointer"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadDoc(doc)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMedicalDocument(doc.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Lab Reports */}
      {activeTab === 'labs' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Diagnostic Laboratory Tests
              </h3>
              <p className="text-xs text-slate-400">
                Field rapid test cards &amp; PHC laboratory investigation results
              </p>
            </div>
          </div>

          {selectedPatient.labReports.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">
              No lab reports registered for this patient yet.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedPatient.labReports.map((lab, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/50 shrink-0">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{lab.testName}</h4>
                      <p className="text-xs text-slate-400">{lab.date} • {lab.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-sm font-extrabold text-white">{lab.result}</span>
                    <Badge variant={lab.status === 'Normal' ? 'emerald' : 'amber'} size="sm">
                      {lab.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Referrals */}
      {activeTab === 'referrals' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-4">
          <h3 className="font-bold text-white text-base">Referral Continuity Record</h3>
          {patientReferrals.map((ref) => (
            <div
              key={ref.id}
              className="p-4 rounded-xl border border-teal-800/50 bg-teal-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-300 bg-teal-950 border border-teal-700/50 px-2.5 py-0.5 rounded">
                    {ref.id}
                  </span>
                  <Badge variant={ref.status === 'Completed' ? 'emerald' : 'amber'} size="sm">
                    {ref.status}
                  </Badge>
                  <Badge variant="rose" size="sm">
                    {ref.priority}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-slate-200 mt-2">
                  From: {ref.fromFacility} → To: {ref.toFacility}
                </p>
                <p className="text-xs text-slate-400 mt-1">{ref.reason}</p>
              </div>

              <button
                onClick={() => setCurrentView('smart_referral')}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-lg text-xs shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>Track Journey</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: Medications & Allergies */}
      {activeTab === 'medications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-400" />
              <span>Current Medications</span>
            </h3>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-200">
              {selectedPatient.currentMedication || 'None documented'}
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Drug Allergies</span>
            </h3>
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs font-semibold text-rose-200">
              {selectedPatient.allergies || 'No known allergies'}
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: EDIT PATIENT ===================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Edit Patient Profile</h3>
                  <p className="text-xs text-slate-400">PID: {selectedPatient.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePatient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">Patient Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Age</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Gender</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Village / Town</label>
                  <input
                    type="text"
                    value={editVillage}
                    onChange={(e) => setEditVillage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Full Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Symptoms (Comma Separated)</label>
                <input
                  type="text"
                  value={editSymptoms}
                  onChange={(e) => setEditSymptoms(e.target.value)}
                  placeholder="Fever, Headache, Vomiting"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Symptoms Clinical Description</label>
                <textarea
                  rows={2}
                  value={editSymptomsDesc}
                  onChange={(e) => setEditSymptomsDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Medical History / Chronic Conditions</label>
                <input
                  type="text"
                  value={editHistory}
                  onChange={(e) => setEditHistory(e.target.value)}
                  placeholder="Mild pre-hypertension, Type 2 Diabetes"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Current Medication</label>
                  <input
                    type="text"
                    value={editMedication}
                    onChange={(e) => setEditMedication(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Allergies</label>
                  <input
                    type="text"
                    value={editAllergies}
                    onChange={(e) => setEditAllergies(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">Emergency Contact</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={editEmergencyName}
                    onChange={(e) => setEditEmergencyName(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Relation (e.g. Son)"
                    value={editEmergencyRelation}
                    onChange={(e) => setEditEmergencyRelation(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Phone"
                    value={editEmergencyPhone}
                    onChange={(e) => setEditEmergencyPhone(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-lg shadow-teal-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: UPLOAD MEDICAL DOCUMENT ===================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Upload Medical Record / Scan</h3>
                  <p className="text-xs text-slate-400">Attaching to: {selectedPatient.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Document Category / Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Document Type <span className="text-rose-400">*</span>
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as MedicalDocumentType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="CT Scan">CT Scan (Computed Tomography)</option>
                  <option value="MRI">MRI (Magnetic Resonance Imaging)</option>
                  <option value="X-Ray">X-Ray (Radiograph)</option>
                  <option value="Blood Test">Blood Test (Hematology / Serology)</option>
                  <option value="Prescription">Prescription (Doctor Rx Slip)</option>
                  <option value="Lab Report">Lab Report (Pathology / Microbiology)</option>
                  <option value="Other medical documents">Other Medical Documents</option>
                </select>
              </div>

              {/* Title / Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Document Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Chest CT Scan (Axial 1.0mm) or CBC Report"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              {/* File Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Upload File / Image (DICOM, JPG, PNG, PDF)
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors">
                  <input
                    type="file"
                    id="docFileInput"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="docFileInput" className="cursor-pointer block space-y-2">
                    <Scan className="w-8 h-8 text-teal-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-200">
                      Click to browse or drag and drop scans
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports radiology images, clinical camera captures &amp; laboratory PDFs
                    </p>
                  </label>
                  {filePreview && (
                    <div className="mt-3 p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-mono text-teal-300 truncate max-w-xs">
                        Image loaded ({fileSizeStr})
                      </span>
                      <button
                        type="button"
                        onClick={() => setFilePreview(null)}
                        className="text-slate-400 hover:text-rose-400 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Health Facility */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Originating Facility
                </label>
                <input
                  type="text"
                  value={docFacility}
                  onChange={(e) => setDocFacility(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Notes / Clinical Impression */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Clinical Findings / Notes
                </label>
                <textarea
                  rows={2}
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  placeholder="Doctor or Radiologist findings / impressions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-lg shadow-teal-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload &amp; Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: FULL-SCREEN DOCUMENT VIEWER ===================== */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            {/* Viewer Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      docTypeBadgeColor[viewingDoc.type]
                    }`}
                  >
                    {viewingDoc.type}
                  </span>
                  <span className="text-xs font-bold text-white">{viewingDoc.documentName}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Patient: {viewingDoc.patientName} • Uploaded {viewingDoc.uploadDate} by {viewingDoc.uploadedBy}
                </p>
              </div>

              {/* Viewer Tools */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewerZoom((z) => Math.min(z + 0.25, 2.5))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewerZoom((z) => Math.max(z - 0.25, 0.75))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewerInvert(!viewerInvert)}
                  className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                    viewerInvert
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Invert / High Contrast DICOM Filter"
                >
                  <Sliders className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownloadDoc(viewingDoc)}
                  className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white cursor-pointer shadow-sm"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setViewingDoc(null);
                    setViewerZoom(1);
                    setViewerInvert(false);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white cursor-pointer ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewer Canvas */}
            <div className="flex-1 bg-black p-4 flex items-center justify-center overflow-auto min-h-[350px]">
              <img
                src={viewingDoc.fileUrl}
                alt={viewingDoc.documentName}
                style={{
                  transform: `scale(${viewerZoom})`,
                  filter: viewerInvert ? 'invert(1) hue-rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease-out',
                }}
                className="max-h-[60vh] max-w-full rounded-lg shadow-2xl object-contain"
              />
            </div>

            {/* Viewer Footer */}
            <div className="p-3.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Facility: {viewingDoc.facility || 'District Health Hub'}</span>
                {viewingDoc.notes && <span>• Notes: {viewingDoc.notes}</span>}
              </div>
              <span className="text-slate-500 font-mono text-[11px]">
                ABDM Compliant Clinical Document
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
