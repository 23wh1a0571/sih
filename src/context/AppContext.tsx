import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Language,
  Patient,
  Referral,
  Facility,
  FollowUp,
  AppNotification,
  ReferralStatus,
  ConsultationNotes,
  AuthUser,
  ActiveView,
  MedicalDocument,
  UserAccount,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_REFERRALS,
  INITIAL_FACILITIES,
  INITIAL_FOLLOW_UPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEDICAL_DOCUMENTS,
  INITIAL_ACCOUNTS,
} from '../data/mockData';

export type { ActiveView };

export const DEFAULT_PROFILES: Record<Role, AuthUser> = {
  asha: {
    id: 'USR-ASHA-001',
    name: 'Sai Mikkil Reddy',
    role: 'asha',
    designation: 'ASHA Frontline Worker',
    facility: 'Venkatapuram Sub-Centre, Kurnool',
    abhaId: '91-4820-9921-1044',
    phone: '+91 98480 23145',
    email: 'sai.asha@kurnoolhealth.gov.in',
  },
  doctor: {
    id: 'USR-DOC-014',
    name: 'Dr. Vikram Rathore',
    role: 'doctor',
    designation: 'Senior Physician & Specialist (MD)',
    facility: 'District Hospital Kurnool (General Medicine)',
    abhaId: '91-8841-2290-7712',
    phone: '+91 94401 22890',
    email: 'dr.vikram@kurnoolhealth.gov.in',
  },
  phc: {
    id: 'USR-PHC-003',
    name: 'Dr. K. S. Rao',
    role: 'phc',
    designation: 'Primary Health Medical Officer (MBBS)',
    facility: 'PHC Kurnool Rural',
    abhaId: '91-7712-4411-8809',
    phone: '+91 98480 33412',
    email: 'dr.ksrao@kurnoolhealth.gov.in',
  },
  admin: {
    id: 'USR-ADM-001',
    name: 'S. K. Verma, IAS',
    role: 'admin',
    designation: 'District Health Officer & Collectorate Liaison',
    facility: 'District Health Command Center, Kurnool',
    abhaId: '91-1100-3344-9988',
    phone: '+91 94400 11001',
    email: 'dho.kurnool@nic.in',
  },
};

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: AuthUser;
  isAuthenticated: boolean;
  accounts: UserAccount[];
  signUp: (accountData: { name: string; emailOrPhone: string; password?: string; role: Role; facility?: string }) => void;
  login: (options: { role: Role; username?: string; method: 'credentials' | 'otp' | 'persona' }) => void;
  logout: () => void;
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  isSyncing: boolean;
  pendingSyncCount: number;
  syncOfflineRecords: () => void;
  patients: Patient[];
  referrals: Referral[];
  facilities: Facility[];
  followUps: FollowUp[];
  notifications: AppNotification[];
  medicalDocuments: MedicalDocument[];
  addMedicalDocument: (doc: Omit<MedicalDocument, 'id' | 'uploadDate'>) => MedicalDocument;
  deleteMedicalDocument: (id: string) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedReferralId: string;
  setSelectedReferralId: (id: string) => void;
  selectedFacilityId: string | null;
  setSelectedFacilityId: (id: string | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  addPatient: (patientData: Partial<Patient>) => Patient;
  updatePatient: (id: string, updatedData: Partial<Patient>) => void;
  createReferral: (referralData: Partial<Referral>) => Referral;
  updateReferralStatus: (id: string, status: ReferralStatus, consultation?: ConsultationNotes) => void;
  completeFollowUp: (id: string, notes?: string) => void;
  selectedPatient: Patient;
  selectedReferral: Referral | undefined;
  syncedOfflineCount: number;
  demoTourActive: boolean;
  setDemoTourActive: (val: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('asha');
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    try {
      const saved = localStorage.getItem('swasthya_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore */
    }
    return DEFAULT_PROFILES['asha'];
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('swasthya_is_auth');
      if (saved === 'false') return false;
    } catch {
      /* ignore */
    }
    return true;
  });
  const [currentView, setCurrentViewState] = useState<ActiveView>(() => {
    try {
      const savedAuth = localStorage.getItem('swasthya_is_auth');
      if (savedAuth === 'false') return 'login';
    } catch {
      /* ignore */
    }
    return 'landing';
  });
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(3);
  const [syncedOfflineCount, setSyncedOfflineCount] = useState<number>(86);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PID-2026-8891');
  const [selectedReferralId, setSelectedReferralId] = useState<string>('REF-2026-00142');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('swasthya_language');
      if (saved === 'en' || saved === 'te' || saved === 'hi') return saved;
    } catch {
      /* ignore */
    }
    return 'en';
  });
  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [demoTourActive, setDemoTourActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  // Registered Accounts state with localStorage recovery
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('swasthya_accounts');
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore */
    }
    return INITIAL_ACCOUNTS;
  });

  // Medical Documents state with localStorage recovery
  const [medicalDocuments, setMedicalDocuments] = useState<MedicalDocument[]>(() => {
    try {
      const saved = localStorage.getItem('swasthya_medical_documents');
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore */
    }
    return INITIAL_MEDICAL_DOCUMENTS;
  });

  // Entities state with localStorage recovery
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('swasthya_patients');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_PATIENTS;
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem('swasthya_referrals');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_REFERRALS;
  });

  const [facilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [followUps, setFollowUps] = useState<FollowUp[]>(INITIAL_FOLLOW_UPS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Save to localStorage when entities change
  useEffect(() => {
    localStorage.setItem('swasthya_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('swasthya_medical_documents', JSON.stringify(medicalDocuments));
  }, [medicalDocuments]);

  useEffect(() => {
    localStorage.setItem('swasthya_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('swasthya_referrals', JSON.stringify(referrals));
  }, [referrals]);

  // Apply high contrast & font size to DOM
  useEffect(() => {
    const body = document.body;
    if (highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    body.classList.remove('text-size-large', 'text-size-xlarge');
    if (fontSize === 'large') body.classList.add('text-size-large');
    if (fontSize === 'xlarge') body.classList.add('text-size-xlarge');
  }, [highContrast, fontSize]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    // Find matching account or fallback to default
    const existing = accounts.find((a) => a.role === newRole);
    const profile: AuthUser = existing
      ? {
          id: existing.id,
          name: existing.name,
          role: existing.role,
          designation: existing.designation,
          facility: existing.facility,
          abhaId: existing.abhaId || '91-4820-9921-1044',
          phone: existing.phone || '+91 98480 23145',
          email: existing.email || existing.emailOrPhone,
        }
      : DEFAULT_PROFILES[newRole];

    setCurrentUser(profile);
    localStorage.setItem('swasthya_auth_user', JSON.stringify(profile));

    if (newRole === 'asha') {
      setCurrentViewState('asha_dashboard');
    } else if (newRole === 'doctor') {
      setCurrentViewState('doctor_dashboard');
    } else if (newRole === 'phc') {
      setCurrentViewState('asha_dashboard');
    } else if (newRole === 'admin') {
      setCurrentViewState('quality_dashboard');
    }
    showToast(`Switched active role to: ${newRole.toUpperCase()} (${profile.name})`, 'info');
  };

  const signUp = (accountData: {
    name: string;
    emailOrPhone: string;
    password?: string;
    role: Role;
    facility?: string;
  }) => {
    const newId = `USR-ACC-${Date.now().toString().slice(-4)}`;
    const designations: Record<Role, string> = {
      asha: 'ASHA Frontline Worker',
      doctor: 'Senior Physician & Specialist (MD)',
      phc: 'Primary Health Medical Officer (MBBS)',
      admin: 'District Health Officer',
    };
    const defaultFacilities: Record<Role, string> = {
      asha: 'Venkatapuram Sub-Centre, Kurnool',
      doctor: 'District Hospital Kurnool (General Medicine)',
      phc: 'PHC Kurnool Rural',
      admin: 'District Health Command Center, Kurnool',
    };

    const newAccount: UserAccount = {
      id: newId,
      name: accountData.name.trim(),
      emailOrPhone: accountData.emailOrPhone.trim(),
      password: accountData.password,
      role: accountData.role,
      designation: designations[accountData.role],
      facility: accountData.facility || defaultFacilities[accountData.role],
      createdAt: new Date().toISOString(),
      phone: accountData.emailOrPhone.includes('@') ? '+91 98480 23145' : accountData.emailOrPhone,
      email: accountData.emailOrPhone.includes('@')
        ? accountData.emailOrPhone
        : `${accountData.name.toLowerCase().replace(/\s+/g, '.')}@swasthyasetu.gov.in`,
    };

    setAccounts((prev) => [newAccount, ...prev]);

    const authProfile: AuthUser = {
      id: newAccount.id,
      name: newAccount.name,
      role: newAccount.role,
      designation: newAccount.designation,
      facility: newAccount.facility,
      phone: newAccount.phone || '+91 98480 23145',
      email: newAccount.email,
      abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-1044`,
    };

    setRoleState(newAccount.role);
    setCurrentUser(authProfile);
    setIsAuthenticated(true);
    localStorage.setItem('swasthya_auth_user', JSON.stringify(authProfile));
    localStorage.setItem('swasthya_is_auth', 'true');

    if (newAccount.role === 'asha') {
      setCurrentViewState('asha_dashboard');
    } else if (newAccount.role === 'doctor') {
      setCurrentViewState('doctor_dashboard');
    } else if (newAccount.role === 'phc') {
      setCurrentViewState('asha_dashboard');
    } else if (newAccount.role === 'admin') {
      setCurrentViewState('quality_dashboard');
    }

    showToast(`Welcome, ${newAccount.name} 👋! Account created successfully.`, 'success');
  };

  const login = ({
    role: targetRole,
    username,
  }: {
    role: Role;
    username?: string;
    method: 'credentials' | 'otp' | 'persona';
  }) => {
    setRoleState(targetRole);
    let profile: AuthUser;

    if (username && username.trim()) {
      // Check if matches an existing registered account
      const matched = accounts.find(
        (a) =>
          a.name.toLowerCase() === username.trim().toLowerCase() ||
          a.emailOrPhone.toLowerCase() === username.trim().toLowerCase()
      );
      if (matched) {
        profile = {
          id: matched.id,
          name: matched.name,
          role: matched.role,
          designation: matched.designation,
          facility: matched.facility,
          phone: matched.phone || '+91 98480 23145',
          email: matched.email || matched.emailOrPhone,
          abhaId: matched.abhaId || '91-4820-9921-1044',
        };
      } else {
        profile = { ...DEFAULT_PROFILES[targetRole], name: username.trim() };
      }
    } else {
      profile = { ...DEFAULT_PROFILES[targetRole] };
    }

    setCurrentUser(profile);
    setIsAuthenticated(true);
    localStorage.setItem('swasthya_auth_user', JSON.stringify(profile));
    localStorage.setItem('swasthya_is_auth', 'true');

    if (targetRole === 'asha') {
      setCurrentViewState('asha_dashboard');
    } else if (targetRole === 'doctor') {
      setCurrentViewState('doctor_dashboard');
    } else if (targetRole === 'phc') {
      setCurrentViewState('asha_dashboard');
    } else if (targetRole === 'admin') {
      setCurrentViewState('quality_dashboard');
    }

    showToast(`Welcome, ${profile.name} 👋! Logged in as ${profile.designation}.`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('swasthya_is_auth', 'false');
    setCurrentViewState('login');
    showToast('Signed out of SwasthyaSetu AI session.', 'info');
  };

  const setCurrentView = (view: ActiveView) => {
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('swasthya_language', lang);
    } catch {
      /* ignore */
    }
    const names = { en: 'English', te: 'తెలుగు (Telugu)', hi: 'हिन्दी (Hindi)' };
    showToast(`Interface language changed to ${names[lang]}`, 'info');
  };

  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSizeState(size);
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    showToast(val ? 'High contrast mode enabled' : 'Standard contrast mode restored', 'info');
  };

  const toggleOfflineMode = () => {
    if (!isOfflineMode) {
      // Switching to offline
      setIsOfflineMode(true);
      showToast('OFFLINE MODE: Internet connection unavailable. Data will be saved locally.', 'warning');
    } else {
      // Switching back to online -> trigger automatic sync
      setIsOfflineMode(false);
      syncOfflineRecords();
    }
  };

  const syncOfflineRecords = () => {
    if (pendingSyncCount === 0) {
      showToast('All patient and referral records are already synchronized.', 'info');
      return;
    }
    setIsSyncing(true);
    showToast('Synchronizing offline records to District Health Cloud...', 'info');

    setTimeout(() => {
      setIsSyncing(false);
      const count = pendingSyncCount;
      setSyncedOfflineCount((prev) => prev + count);
      setPendingSyncCount(0);

      // Mark all pending patients as synced
      setPatients((prev) =>
        prev.map((p) => (p.syncStatus === 'pending_sync' ? { ...p, syncStatus: 'synced' } : p))
      );

      // Add sync notification
      const newNotif: AppNotification = {
        id: `notif-sync-${Date.now()}`,
        title: 'Offline Records Synchronized',
        message: `✓ ${count} records synchronized successfully with District Health Cloud.`,
        time: 'Just now',
        read: false,
        type: 'sync',
        priority: 'medium',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      showToast(`✓ ${count} records synchronized successfully.`, 'success');
    }, 1800);
  };

  const addPatient = (patientData: Partial<Patient>): Patient => {
    const newId = `PID-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const isOffline = isOfflineMode;

    const newPatient: Patient = {
      id: newId,
      name: patientData.name || 'Anonymous Patient',
      age: patientData.age || 40,
      gender: patientData.gender || 'Male',
      phone: patientData.phone || '+91 98000 00000',
      village: patientData.village || 'Venkatapuram',
      address: patientData.address || 'Venkatapuram Village, Kurnool Dist.',
      preferredLanguage: patientData.preferredLanguage || language,
      emergencyContact: patientData.emergencyContact || {
        name: 'Family Member',
        relation: 'Relative',
        phone: '+91 98000 00001',
      },
      symptoms: patientData.symptoms || ['Fever'],
      symptomsDescription: patientData.symptomsDescription || 'Reported via frontline registration',
      duration: patientData.duration || '3 days',
      existingConditions: patientData.existingConditions || [],
      currentMedication: patientData.currentMedication || 'None',
      allergies: patientData.allergies || 'None reported',
      vitals: patientData.vitals || {
        temperature: 101.5,
        bloodPressure: '126/80',
        heartRate: 84,
        spo2: 97,
      },
      riskLevel: patientData.riskLevel || 'Moderate',
      suggestedAction:
        patientData.suggestedAction || 'Recommend evaluation at the Primary Health Centre.',
      missingInfo: patientData.missingInfo || ['Chronic medication record'],
      createdAt: new Date().toISOString(),
      syncStatus: isOffline ? 'pending_sync' : 'synced',
      registeredBy: `${currentUser.name} (${currentUser.designation || 'Frontline Worker'})`,
      timeline: [
        {
          date: 'Today',
          title: 'Frontline Patient Registration',
          description: `Registered by ${currentUser.name}. Symptoms: ${(patientData.symptoms || ['Fever']).join(', ')}.`,
          facility: currentUser.facility || 'Venkatapuram Sub-Centre',
          performedBy: currentUser.name,
          type: 'registration',
        },
      ],
      labReports: [],
      coordinates: patientData.coordinates || { lat: 15.7200, lng: 78.0100 },
    };

    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newId);

    if (isOffline) {
      setPendingSyncCount((prev) => prev + 1);
      showToast('Patient saved securely. Will sync when connectivity is restored.', 'warning');
    } else {
      showToast(`Patient ${newPatient.name} registered and synced successfully.`, 'success');
    }

    return newPatient;
  };

  const updatePatient = (id: string, updatedData: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated: Patient = {
            ...p,
            ...updatedData,
            timeline: [
              {
                date: 'Today',
                title: 'Patient Profile Updated',
                description: `Record updated by ${currentUser.name}.`,
                facility: currentUser.facility || 'Venkatapuram Sub-Centre',
                performedBy: currentUser.name,
                type: 'registration',
              },
              ...p.timeline,
            ],
          };
          showToast(`Patient profile for ${updated.name} updated successfully.`, 'success');
          return updated;
        }
        return p;
      })
    );
  };

  const addMedicalDocument = (doc: Omit<MedicalDocument, 'id' | 'uploadDate'>): MedicalDocument => {
    const newDoc: MedicalDocument = {
      ...doc,
      id: `DOC-2026-${Math.floor(100 + Math.random() * 900)}`,
      uploadDate:
        'Today, ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      uploadedBy: doc.uploadedBy || currentUser.name,
    };
    setMedicalDocuments((prev) => [newDoc, ...prev]);
    showToast(`Document "${newDoc.documentName}" uploaded successfully.`, 'success');
    return newDoc;
  };

  const deleteMedicalDocument = (id: string) => {
    setMedicalDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast('Medical document removed from patient records.', 'info');
  };

  const createReferral = (referralData: Partial<Referral>): Referral => {
    const newId = `REF-2026-00${Math.floor(143 + Math.random() * 50)}`;
    const newRef: Referral = {
      id: newId,
      patientId: referralData.patientId || selectedPatientId,
      patientName: referralData.patientName || 'Ramesh Kumar',
      patientAge: referralData.patientAge || 54,
      patientGender: referralData.patientGender || 'Male',
      fromFacility: referralData.fromFacility || 'PHC Kurnool Rural',
      toFacility: referralData.toFacility || 'District Hospital Kurnool',
      priority: referralData.priority || 'Priority',
      reason: referralData.reason || 'Persistent pyrexia and headache requiring specialist examination.',
      clinicalNotes: referralData.clinicalNotes || 'Frontline triage recommends senior physician consultation.',
      aiSummary:
        referralData.aiSummary ||
        'Patient presents with fever for 3 days accompanied by headache and vomiting. Vitals recorded: Temp 102°F, BP 128/82, SpO2 97%. Reason: Further clinical evaluation.',
      createdAt: 'Today, Just now',
      status: 'Pending',
      journey: [
        {
          stage: 'SUB-CENTRE',
          facilityName: 'Venkatapuram Sub-Centre',
          status: 'completed',
          timestamp: 'Today, 09:00 AM',
        },
        {
          stage: 'PHC',
          facilityName: referralData.fromFacility || 'PHC Kurnool Rural',
          status: 'completed',
          timestamp: 'Today, 10:30 AM',
        },
        {
          stage: 'SPECIALIST',
          facilityName: referralData.toFacility || 'District Hospital Kurnool',
          status: 'current',
          timestamp: 'Today, 11:00 AM',
        },
        {
          stage: 'DISTRICT HOSPITAL',
          facilityName: 'Inpatient Evaluation',
          status: 'pending',
        },
      ],
    };

    setReferrals((prev) => [newRef, ...prev]);
    setSelectedReferralId(newId);

    if (isOfflineMode) {
      setPendingSyncCount((prev) => prev + 1);
      showToast(`Referral ${newId} queued locally. Will sync when online.`, 'warning');
    } else {
      showToast(`Referral ${newId} created successfully.`, 'success');
    }

    return newRef;
  };

  const updateReferralStatus = (
    id: string,
    status: ReferralStatus,
    consultation?: ConsultationNotes
  ) => {
    setReferrals((prev) =>
      prev.map((ref) => {
        if (ref.id === id) {
          const updatedJourney = ref.journey.map((step) => {
            if (status === 'Completed') {
              return { ...step, status: 'completed' as const };
            }
            if (status === 'In Consultation' && step.stage === 'SPECIALIST') {
              return { ...step, status: 'current' as const };
            }
            return step;
          });

          return {
            ...ref,
            status,
            completedAt: status === 'Completed' ? 'Today, Just now' : ref.completedAt,
            consultation: consultation || ref.consultation,
            journey: updatedJourney,
          };
        }
        return ref;
      })
    );

    if (status === 'Completed') {
      showToast(`Referral ${id} completed. Follow-up task initiated.`, 'success');
    } else {
      showToast(`Referral ${id} status updated to ${status}.`, 'info');
    }
  };

  const completeFollowUp = (id: string, notes?: string) => {
    setFollowUps((prev) =>
      prev.map((fu) =>
        fu.id === id
          ? {
              ...fu,
              status: 'Completed',
              completedAt: 'Today, Just now',
              notes: notes || 'Vitals checked. Patient stabilized.',
            }
          : fu
      )
    );
    showToast('Follow-up marked as completed.', 'success');
  };

  // Demo Tour Navigation
  const nextDemoStep = () => {
    const next = demoStep + 1;
    if (next <= 16) {
      setDemoStep(next);
      executeTourStep(next);
    }
  };

  const prevDemoStep = () => {
    const prev = demoStep - 1;
    if (prev >= 1) {
      setDemoStep(prev);
      executeTourStep(prev);
    }
  };

  const executeTourStep = (step: number) => {
    switch (step) {
      case 1: // Start Landing Page
        setCurrentViewState('landing');
        break;
      case 2: // Login as ASHA
        setRoleState('asha');
        setCurrentViewState('login');
        break;
      case 3: // ASHA Dashboard
        setRoleState('asha');
        setCurrentViewState('asha_dashboard');
        break;
      case 4: // Register Ramesh Kumar
        setRoleState('asha');
        setCurrentViewState('register_patient');
        break;
      case 5: // Select Telugu & Voice Input
        setRoleState('asha');
        setLanguageState('te');
        setCurrentViewState('register_patient');
        break;
      case 6: // AI Extracts symptoms
        setRoleState('asha');
        setCurrentViewState('register_patient');
        break;
      case 7: // AI Triage
        setRoleState('asha');
        setSelectedPatientId('PID-2026-8891');
        setCurrentViewState('ai_triage');
        break;
      case 8: // Moderate Risk & PHC recommendation
        setRoleState('asha');
        setCurrentViewState('ai_triage');
        break;
      case 9: // Turn Offline Mode ON
        setIsOfflineMode(true);
        showToast('Offline Mode enabled for demonstration', 'warning');
        break;
      case 10: // Save patient offline -> show pending sync
        setCurrentViewState('asha_dashboard');
        break;
      case 11: // Turn Online -> show 3 records synchronized
        setIsOfflineMode(false);
        syncOfflineRecords();
        break;
      case 12: // Create Smart Referral REF-2026-00142
        setRoleState('asha');
        setSelectedPatientId('PID-2026-8891');
        setCurrentViewState('smart_referral');
        break;
      case 13: // Doctor Dashboard
        setRoleState('doctor');
        setCurrentViewState('doctor_dashboard');
        break;
      case 14: // Doctor opens referral & AI Brief
        setRoleState('doctor');
        setSelectedReferralId('REF-2026-00142');
        setCurrentViewState('teleconsultation');
        break;
      case 15: // Teleconsultation & Doctor Notes & Completion
        setRoleState('doctor');
        setCurrentViewState('teleconsultation');
        break;
      case 16: // District Administrator Command Center
        setRoleState('admin');
        setCurrentViewState('quality_dashboard');
        break;
      default:
        break;
    }
  };

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0] || INITIAL_PATIENTS[0];

  const selectedReferral = referrals.find((r) => r.id === selectedReferralId) || referrals[0];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        isAuthenticated,
        accounts,
        signUp,
        login,
        logout,
        currentView,
        setCurrentView,
        isOfflineMode,
        toggleOfflineMode,
        isSyncing,
        pendingSyncCount,
        syncOfflineRecords,
        patients,
        referrals,
        facilities,
        followUps,
        notifications,
        medicalDocuments,
        addMedicalDocument,
        deleteMedicalDocument,
        selectedPatientId,
        setSelectedPatientId,
        selectedReferralId,
        setSelectedReferralId,
        selectedFacilityId,
        setSelectedFacilityId,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        voiceSpeed,
        setVoiceSpeed,
        toasts,
        showToast,
        removeToast,
        addPatient,
        updatePatient,
        createReferral,
        updateReferralStatus,
        completeFollowUp,
        selectedPatient,
        selectedReferral,
        syncedOfflineCount,
        demoTourActive,
        setDemoTourActive,
        demoStep,
        setDemoStep,
        nextDemoStep,
        prevDemoStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
