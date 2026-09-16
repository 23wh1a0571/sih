import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, MobileBottomNav } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { DemoTourBar } from './components/common/DemoTourBar';
import { AiTourChatbot } from './components/common/AiTourChatbot';
import { AmbulanceLoader } from './components/common/AmbulanceLoader';
import { EmergencyPageTransition } from './components/common/EmergencyPageTransition';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { HealthcareMap } from './pages/HealthcareMap';
import { AshaDashboard } from './pages/AshaDashboard';
import { PatientRegistration } from './pages/PatientRegistration';
import { AiTriage } from './pages/AiTriage';
import { PatientProfile } from './pages/PatientProfile';
import { SmartReferral } from './pages/SmartReferral';
import { ReferralTracking } from './pages/ReferralTracking';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { Teleconsultation } from './pages/Teleconsultation';
import { FollowUpManagement } from './pages/FollowUpManagement';
import { DistrictQualityDashboard } from './pages/DistrictQualityDashboard';
import { NotificationsCenter } from './pages/NotificationsCenter';
import { SettingsPage } from './pages/SettingsPage';
import { MedicalDocuments } from './pages/MedicalDocuments';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, isSyncing, isAuthenticated } = useApp();

  const renderView = () => {
    // If not authenticated and not explicitly viewing the public landing page, force login page
    if (!isAuthenticated && currentView !== 'landing') {
      return <LoginPage />;
    }

    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'network_map':
        return <HealthcareMap />;
      case 'asha_dashboard':
        return <AshaDashboard />;
      case 'register_patient':
        return <PatientRegistration />;
      case 'ai_triage':
        return <AiTriage />;
      case 'patient_profile':
        return <PatientProfile />;
      case 'medical_documents':
        return <MedicalDocuments />;
      case 'smart_referral':
        return <SmartReferral />;
      case 'referral_tracking':
        return <ReferralTracking />;
      case 'doctor_dashboard':
        return <DoctorDashboard />;
      case 'teleconsultation':
        return <Teleconsultation />;
      case 'follow_ups':
        return <FollowUpManagement />;
      case 'quality_dashboard':
        return <DistrictQualityDashboard />;
      case 'notifications':
        return <NotificationsCenter />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  const isLanding = currentView === 'landing' || currentView === 'login' || !isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-rose-600 selection:text-white">
      {/* Top Emergency Navigation */}
      <Navbar />

      {/* Body Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar (Role-aware navigation on desktop) */}
        {!isLanding && <Sidebar />}

        {/* Main Content Area */}
        <main
          className={`flex-1 p-3 sm:p-5 lg:p-7 max-w-7xl mx-auto w-full transition-all pb-24 md:pb-16 overflow-x-hidden`}
        >
          <EmergencyPageTransition>{renderView()}</EmergencyPageTransition>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {!isLanding && <MobileBottomNav />}

      {/* SIH Interactive Demo Tour Floating Bar */}
      <DemoTourBar />

      {/* Emergency Ambulance Strobe Lights Loader during Cloud Sync */}
      {isSyncing && (
        <AmbulanceLoader
          overlay={true}
          message="Synchronizing with District Health Cloud..."
          subtext="Emergency clinical telemetry & offline records transmitting to Kurnool servers"
        />
      )}

      {/* Interactive AI Tour Guide Chatbot */}
      <AiTourChatbot />

      {/* Live System Toast Notifications */}
      <ToastContainer />

      {/* Accessible Emergency Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b16] py-5 text-center text-xs text-slate-400 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold text-white tracking-wide">SwasthyaSetu AI</span>
            <span className="text-slate-600">—</span>
            <span className="text-slate-300">National Emergency Rural Health Network (SIH26133)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="text-rose-400 font-semibold">108 Emergency Protocol Active</span>
            <span className="text-slate-700">•</span>
            <span>ABDM & FHIR Compliant</span>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setCurrentView('settings')}
              className="text-teal-400 hover:text-teal-300 hover:underline transition-colors"
            >
              Security & Compliance
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
