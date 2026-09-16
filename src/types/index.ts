export type Role = 'asha' | 'doctor' | 'phc' | 'admin';

export type Language = 'en' | 'te' | 'hi';

export type Priority = 'Routine' | 'Priority' | 'Emergency';

export type ReferralStatus = 'Pending' | 'Accepted' | 'In Consultation' | 'Completed' | 'Cancelled';

export type FollowUpStatus = 'Due' | 'Completed' | 'Missed';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Emergency';

export interface Vitals {
  temperature: number; // in °F
  bloodPressure: string; // e.g. "128/82"
  heartRate: number; // bpm
  spo2: number; // percentage
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  facility: string;
  performedBy: string;
  type: 'registration' | 'triage' | 'consultation' | 'referral' | 'followup' | 'lab';
}

export interface LabReport {
  testName: string;
  date: string;
  result: string;
  status: 'Normal' | 'Abnormal' | 'Pending';
  notes: string;
}

export type MedicalDocumentType =
  | 'CT Scan'
  | 'MRI'
  | 'X-Ray'
  | 'Blood Test'
  | 'Prescription'
  | 'Lab Report'
  | 'Other medical documents';

export interface MedicalDocument {
  id: string;
  patientId: string;
  patientName: string;
  documentName: string;
  type: MedicalDocumentType;
  uploadDate: string;
  fileSize: string;
  fileUrl: string; // Base64 data URI or preview image URL
  notes?: string;
  facility?: string;
  uploadedBy: string;
}

export interface Patient {
  id: string; // e.g. "PID-2026-8891"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  village: string;
  address: string;
  preferredLanguage: Language;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  symptoms: string[];
  symptomsDescription: string;
  duration: string;
  existingConditions: string[];
  currentMedication: string;
  allergies: string;
  vitals: Vitals;
  riskLevel: RiskLevel;
  suggestedAction: string;
  missingInfo: string[];
  createdAt: string;
  syncStatus: 'synced' | 'pending_sync';
  registeredBy: string;
  timeline: TimelineEvent[];
  labReports: LabReport[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface ConsultationNotes {
  doctorName: string;
  consultationDate: string;
  diagnosis: string;
  prescriptions: PrescriptionItem[];
  notes: string;
  followUpDate: string;
}

export interface JourneyStep {
  stage: 'SUB-CENTRE' | 'PHC' | 'SPECIALIST' | 'DISTRICT HOSPITAL';
  facilityName: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
}

export interface Referral {
  id: string; // e.g. "REF-2026-00142"
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  fromFacility: string;
  toFacility: string;
  priority: Priority;
  reason: string;
  clinicalNotes: string;
  aiSummary: string;
  createdAt: string;
  status: ReferralStatus;
  completedAt?: string;
  journey: JourneyStep[];
  consultation?: ConsultationNotes;
  transitInfo?: TransitInfo;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  village: string;
  dueDate: string;
  reason: string;
  status: FollowUpStatus;
  assignedWorker: string;
  completedAt?: string;
  notes?: string;
}

export interface TransitInfo {
  ambulanceNumber: string;
  etaMinutes: number;
  speedKmH: number;
  driverContact: string;
  currentLocationName: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Facility {
  id: string;
  name: string;
  type: 'Sub-Centre' | 'PHC' | 'Specialist Centre' | 'District Hospital' | 'Community Health Centre';
  location: string;
  patientsCount: number;
  referralsCount: number;
  avgReferralHours: number;
  followUpRate: number; // percentage
  status: 'Excellent' | 'Good' | 'Needs Attention';
  staffWorkload: number; // percentage
  offlineSyncRate: number; // percentage
  attentionNotes: string[];
  coordinates?: {
    lat: number;
    lng: number;
    x: number; // percentage 0-100 for SVG grid
    y: number; // percentage 0-100 for SVG grid
  };
  bedAvailability?: {
    total: number;
    occupied: number;
    icuAvailable: number;
    emergencyAvailable: number;
  };
  ambulanceAvailable?: boolean;
  specialistsAvailable?: string[];
  contactPhone?: string;
}

export interface QualityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  severityTag: '🔴' | '🟠' | '🟡' | '🟢';
  title: string;
  description: string;
  facilityId?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'referral' | 'sync' | 'alert' | 'followup' | 'teleconsult';
  priority: 'high' | 'medium' | 'low';
}

export interface UserAccount {
  id: string;
  name: string;
  emailOrPhone: string;
  password?: string;
  role: Role;
  designation: string;
  facility: string;
  abhaId?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
  designation: string;
  facility: string;
  abhaId?: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export type ActiveView =
  | 'landing'
  | 'login'
  | 'asha_dashboard'
  | 'register_patient'
  | 'ai_triage'
  | 'patient_profile'
  | 'medical_documents'
  | 'smart_referral'
  | 'referral_tracking'
  | 'doctor_dashboard'
  | 'teleconsultation'
  | 'follow_ups'
  | 'quality_dashboard'
  | 'network_map'
  | 'notifications'
  | 'settings';


