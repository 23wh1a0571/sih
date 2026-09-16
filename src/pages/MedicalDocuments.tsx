import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedicalDocumentType, MedicalDocument } from '../types';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Eye,
  Download,
  Trash2,
  X,
  Scan,
  Sliders,
  ZoomIn,
  ZoomOut,
  FolderOpen,
  User,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FilePlus,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const MedicalDocuments: React.FC = () => {
  const {
    medicalDocuments,
    addMedicalDocument,
    deleteMedicalDocument,
    patients,
    selectedPatientId,
    setSelectedPatientId,
    setCurrentView,
    currentUser,
    showToast,
  } = useApp();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>('All');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [targetPatientId, setTargetPatientId] = useState(selectedPatientId);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<MedicalDocumentType>('CT Scan');
  const [docNotes, setDocNotes] = useState('');
  const [docFacility, setDocFacility] = useState('District Hospital Kurnool Radiology');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState('3.2 MB');

  // Viewer modal state
  const [viewingDoc, setViewingDoc] = useState<MedicalDocument | null>(null);
  const [viewerZoom, setViewerZoom] = useState(1);
  const [viewerInvert, setViewerInvert] = useState(false);

  // Filtered documents
  const filteredDocs = medicalDocuments.filter((doc) => {
    const matchesSearch =
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.notes && doc.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'All' || doc.type === selectedType;
    const matchesPatient = selectedPatientFilter === 'All' || doc.patientId === selectedPatientFilter;

    return matchesSearch && matchesType && matchesPatient;
  });

  const docTypeBadgeColor: Record<MedicalDocumentType, string> = {
    'CT Scan': 'bg-cyan-950/80 text-cyan-300 border-cyan-700',
    MRI: 'bg-purple-950/80 text-purple-300 border-purple-700',
    'X-Ray': 'bg-sky-950/80 text-sky-300 border-sky-700',
    'Blood Test': 'bg-rose-950/80 text-rose-300 border-rose-700',
    Prescription: 'bg-teal-950/80 text-teal-300 border-teal-700',
    'Lab Report': 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
    'Other medical documents': 'bg-amber-950/80 text-amber-300 border-amber-700',
  };

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

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const patientObj = patients.find((p) => p.id === targetPatientId) || patients[0];

    const defaultSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230b1120"/><rect x="20" y="20" width="560" height="360" rx="12" fill="%230f172a" stroke="%2338bdf8" stroke-width="2"/><text x="40" y="60" fill="%2338bdf8" font-family="sans-serif" font-weight="bold" font-size="16">${docType.toUpperCase()} CLINICAL RECORD</text><text x="40" y="85" fill="%2394a3b8" font-family="monospace" font-size="12">Patient: ${patientObj.name} (${patientObj.id})</text><text x="40" y="110" fill="%2394a3b8" font-family="monospace" font-size="12">Date: Today | Uploaded by: ${currentUser.name}</text><rect x="40" y="140" width="520" height="180" rx="8" fill="%231e293b"/><text x="60" y="235" fill="%2338bdf8" font-family="sans-serif" font-size="14" font-weight="bold">${docName}</text><text x="40" y="355" fill="%2322c55e" font-family="monospace" font-size="12">STATUS: DIGITALLY VERIFIED AND ENCRYPTED (ABDM COMPLIANT)</text></svg>`;

    addMedicalDocument({
      patientId: patientObj.id,
      patientName: patientObj.name,
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

  const handleDownloadDoc = (doc: MedicalDocument) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = `${doc.patientName}_${doc.type}_${doc.documentName.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded: ${doc.documentName}`, 'success');
  };

  // Counts by category
  const ctCount = medicalDocuments.filter((d) => d.type === 'CT Scan').length;
  const mriCount = medicalDocuments.filter((d) => d.type === 'MRI').length;
  const xrayCount = medicalDocuments.filter((d) => d.type === 'X-Ray').length;
  const bloodCount = medicalDocuments.filter((d) => d.type === 'Blood Test').length;
  const rxCount = medicalDocuments.filter((d) => d.type === 'Prescription').length;
  const labCount = medicalDocuments.filter((d) => d.type === 'Lab Report').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Stats Header */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-bold mb-2">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Diagnostic Radiology &amp; Electronic Medical Records (EMR)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Medical Documents &amp; Patient Records
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Central clinical repository for CT Scans, MRIs, X-Rays, Blood Tests, Doctor Prescriptions, and Laboratory Reports across Andhra Pradesh.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Medical Document</span>
          </button>
        </div>

        {/* Quick Category Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800">
          <div
            onClick={() => setSelectedType(selectedType === 'CT Scan' ? 'All' : 'CT Scan')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              selectedType === 'CT Scan' ? 'bg-cyan-950 border-cyan-500' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-[11px] font-bold text-slate-400">CT Scans</p>
            <p className="text-xl font-black text-cyan-400 mt-0.5">{ctCount}</p>
          </div>

          <div
            onClick={() => setSelectedType(selectedType === 'MRI' ? 'All' : 'MRI')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              selectedType === 'MRI' ? 'bg-purple-950 border-purple-500' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-[11px] font-bold text-slate-400">MRI Scans</p>
            <p className="text-xl font-black text-purple-400 mt-0.5">{mriCount}</p>
          </div>

          <div
            onClick={() => setSelectedType(selectedType === 'X-Ray' ? 'All' : 'X-Ray')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              selectedType === 'X-Ray' ? 'bg-sky-950 border-sky-500' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-[11px] font-bold text-slate-400">X-Rays</p>
            <p className="text-xl font-black text-sky-400 mt-0.5">{xrayCount}</p>
          </div>

          <div
            onClick={() => setSelectedType(selectedType === 'Blood Test' ? 'All' : 'Blood Test')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              selectedType === 'Blood Test' ? 'bg-rose-950 border-rose-500' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-[11px] font-bold text-slate-400">Blood Tests</p>
            <p className="text-xl font-black text-rose-400 mt-0.5">{bloodCount}</p>
          </div>

          <div
            onClick={() => setSelectedType(selectedType === 'Prescription' ? 'All' : 'Prescription')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              selectedType === 'Prescription' ? 'bg-teal-950 border-teal-500' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-[11px] font-bold text-slate-400">Prescriptions</p>
            <p className="text-xl font-black text-teal-400 mt-0.5">{rxCount}</p>
          </div>

          <div
            onClick={() => setSelectedType(selectedType === 'Lab Report' ? 'All' : 'Lab Report')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              selectedType === 'Lab Report' ? 'bg-emerald-950 border-emerald-500' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-[11px] font-bold text-slate-400">Lab Reports</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">{labCount}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document name, patient name, or notes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Filter by Category */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="All">All Types ({medicalDocuments.length})</option>
            <option value="CT Scan">CT Scan</option>
            <option value="MRI">MRI</option>
            <option value="X-Ray">X-Ray</option>
            <option value="Blood Test">Blood Test</option>
            <option value="Prescription">Prescription</option>
            <option value="Lab Report">Lab Report</option>
            <option value="Other medical documents">Other Documents</option>
          </select>

          {/* Filter by Patient */}
          <select
            value={selectedPatientFilter}
            onChange={(e) => setSelectedPatientFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="All">All Patients ({patients.length})</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No medical documents found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try clearing search filters or upload a new CT scan, MRI, X-Ray, blood test, or prescription.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload First Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-slate-700 p-5 shadow-xl backdrop-blur-sm flex flex-col justify-between gap-4 group transition-all"
            >
              <div className="space-y-3">
                {/* Visual Thumbnail / Scan Preview */}
                <div
                  onClick={() => setViewingDoc(doc)}
                  className="relative w-full aspect-16/10 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer group-hover:border-teal-500/50 transition-colors flex items-center justify-center"
                >
                  <img
                    src={doc.fileUrl}
                    alt={doc.documentName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                    <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xl">
                      <Eye className="w-4 h-4" />
                      <span>Inspect Document</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-100 line-clamp-1">
                      {doc.documentName}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        docTypeBadgeColor[doc.type] || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {doc.type}
                    </span>
                  </div>

                  {/* Patient Link */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <User className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <button
                      onClick={() => {
                        setSelectedPatientId(doc.patientId);
                        setCurrentView('patient_profile');
                      }}
                      className="text-xs font-bold text-teal-300 hover:text-teal-200 hover:underline truncate"
                    >
                      {doc.patientName} ({doc.patientId})
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-1">
                    <span>Uploaded: {doc.uploadDate}</span>
                    <span>•</span>
                    <span>Size: {doc.fileSize}</span>
                  </div>

                  {doc.notes && (
                    <p className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-xl mt-2.5 border border-slate-800/80 line-clamp-2">
                      {doc.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: View, Download, Delete */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                  By: {doc.uploadedBy}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingDoc(doc)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-300 border border-slate-700 hover:border-teal-500/50 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                    title="View Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownloadDoc(doc)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMedicalDocument(doc.id)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer"
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
                  <p className="text-xs text-slate-400">Digital Health Repository (ABDM Compliant)</p>
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
              {/* Select Patient */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Target Patient <span className="text-rose-400">*</span>
                </label>
                <select
                  value={targetPatientId}
                  onChange={(e) => setTargetPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y, {p.gender}) — {p.village} [{p.id}]
                    </option>
                  ))}
                </select>
              </div>

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
                  placeholder="e.g. Chest CT Scan (Axial 1.0mm) or Complete Blood Count"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              {/* File Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Upload File / Image
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors">
                  <input
                    type="file"
                    id="medDocFileInput"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="medDocFileInput" className="cursor-pointer block space-y-2">
                    <Scan className="w-8 h-8 text-teal-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-200">
                      Click to choose scan file or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Accepts clinical images, DICOM exports &amp; diagnostic PDFs
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

              {/* Originating Facility */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Originating Health Facility
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
                  Clinical Impression / Notes
                </label>
                <textarea
                  rows={2}
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  placeholder="Doctor or Radiologist findings..."
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
                  <span>Upload Document</span>
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
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      docTypeBadgeColor[viewingDoc.type]
                    }`}
                  >
                    {viewingDoc.type}
                  </span>
                  <span className="text-sm font-black text-white">{viewingDoc.documentName}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Patient: <strong className="text-slate-200">{viewingDoc.patientName}</strong> • Uploaded {viewingDoc.uploadDate} by {viewingDoc.uploadedBy}
                </p>
              </div>

              {/* Viewer Tools */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewerZoom((z) => Math.min(z + 0.25, 2.5))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewerZoom((z) => Math.max(z - 0.25, 0.75))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 cursor-pointer"
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
                ABDM Compliant Clinical Document • {viewingDoc.fileSize}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
