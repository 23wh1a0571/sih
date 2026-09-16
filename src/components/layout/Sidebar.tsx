import React from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import { Role } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Activity,
  Send,
  Video,
  CalendarCheck,
  BarChart3,
  Building2,
  Bell,
  Settings,
  Globe,
  LogOut,
  Stethoscope,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Zap,
  FileText,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, currentView, setCurrentView, referrals, followUps, notifications, logout, currentUser } = useApp();
  const { t } = useTranslation();

  const pendingReferralsCount = referrals.filter((r) => r.status === 'Pending').length;
  const dueFollowUpsCount = followUps.filter((f) => f.status === 'Due').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SS';

  const profile = {
    name: currentUser?.name || 'Authorized User',
    title: currentUser?.designation || 'Health Personnel',
    location: currentUser?.facility || 'Kurnool District',
    initials: userInitials,
  };

  interface NavItem {
    id: ActiveView;
    label: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
  }

  const ashaNav: NavItem[] = [
    { id: 'asha_dashboard', label: t('nav_frontline_dashboard'), icon: LayoutDashboard },
    { id: 'network_map', label: t('nav_healthcare_map'), icon: MapPin },
    { id: 'register_patient', label: t('nav_register_patient'), icon: UserPlus },
    { id: 'ai_triage', label: t('nav_ai_triage'), icon: Activity },
    { id: 'smart_referral', label: t('nav_smart_referral'), icon: Send },
    { id: 'referral_tracking', label: t('nav_referral_tracking'), icon: Activity, badge: pendingReferralsCount, badgeColor: 'bg-amber-500' },
    { id: 'patient_profile', label: t('nav_patient_records'), icon: Users },
    { id: 'medical_documents', label: 'Medical Documents', icon: FileText },
    { id: 'follow_ups', label: t('nav_followups'), icon: CalendarCheck, badge: dueFollowUpsCount, badgeColor: 'bg-teal-500' },
  ];

  const doctorNav: NavItem[] = [
    { id: 'doctor_dashboard', label: t('nav_doctor_dashboard'), icon: LayoutDashboard },
    { id: 'network_map', label: t('nav_healthcare_map'), icon: MapPin },
    { id: 'teleconsultation', label: t('nav_teleconsultation'), icon: Video },
    { id: 'referral_tracking', label: t('nav_referral_tracking'), icon: Send, badge: pendingReferralsCount, badgeColor: 'bg-indigo-500' },
    { id: 'patient_profile', label: t('nav_patient_records'), icon: Users },
    { id: 'medical_documents', label: 'Medical Documents', icon: FileText },
    { id: 'follow_ups', label: t('nav_followups'), icon: CalendarCheck },
  ];

  const adminNav: NavItem[] = [
    { id: 'quality_dashboard', label: t('nav_command_center'), icon: BarChart3 },
    { id: 'network_map', label: t('nav_healthcare_map'), icon: MapPin },
    { id: 'referral_tracking', label: t('nav_referral_tracking'), icon: Send },
    { id: 'patient_profile', label: t('nav_patient_records'), icon: Users },
    { id: 'medical_documents', label: 'Medical Documents', icon: FileText },
    { id: 'follow_ups', label: t('nav_followups'), icon: CalendarCheck },
  ];

  const getRoleNav = (): NavItem[] => {
    switch (role) {
      case 'doctor':
        return doctorNav;
      case 'admin':
        return adminNav;
      case 'phc':
      case 'asha':
      default:
        return ashaNav;
    }
  };

  const navItems = getRoleNav();

  return (
    <aside className="w-64 bg-[#080d1a] border-r border-slate-800 hidden md:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] select-none">
      {/* Upper Section */}
      <div className="p-3.5 space-y-5">
        {/* Emergency Quick SOS Button */}
        <button
          onClick={() => setCurrentView('ai_triage')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-rose-600/30 hover:shadow-rose-500/50 hover:scale-102 transition-all cursor-pointer border border-rose-400/40 animate-pulse"
          title="Immediate Emergency ALS 108 Dispatch Protocol"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>{t('btn_emergency_sos')}</span>
        </button>

        {/* Role Overview Card */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-md border border-teal-400/30">
              {profile.initials}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{profile.name}</h4>
              <p className="text-[11px] text-teal-400 font-medium truncate">{profile.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{profile.location}</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {role.toUpperCase()} Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 ${
                      isActive ? 'bg-white/20' : item.badgeColor || 'bg-teal-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Global Overview Section */}
        <div className="space-y-1 pt-3 border-t border-slate-800">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('nav_dashboard')}
          </div>

          <button
            onClick={() => setCurrentView('landing')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-teal-600 text-white'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Public Overview</span>
          </button>

          <button
            onClick={() => setCurrentView('notifications')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'notifications'
                ? 'bg-teal-600 text-white'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-400" />
              <span>{t('nav_notifications')}</span>
            </div>
            {unreadNotifsCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'settings'
                ? 'bg-teal-600 text-white'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>{t('nav_settings')}</span>
          </button>
        </div>
      </div>

      {/* Lower Section (Status & Logout) */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Emergency Link:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              108 Active
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">ABDM FHIR:</span>
            <span className="font-bold text-teal-400">Encrypted</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 hover:border-rose-700 text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('sign_out')}</span>
        </button>
      </div>
    </aside>
  );
};

// Mobile Bottom Navigation Bar (Touch-friendly, fully responsive, dark emergency styling)
export const MobileBottomNav: React.FC = () => {
  const { role, currentView, setCurrentView } = useApp();
  const { t } = useTranslation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 px-1 py-1.5 flex items-center justify-around shadow-2xl backdrop-blur-md select-none">
      <button
        onClick={() => {
          if (role === 'doctor') setCurrentView('doctor_dashboard');
          else if (role === 'admin') setCurrentView('quality_dashboard');
          else setCurrentView('asha_dashboard');
        }}
        className={`flex flex-col items-center gap-1 py-1.5 px-2 text-[10px] font-semibold cursor-pointer transition-colors ${
          currentView === 'asha_dashboard' || currentView === 'doctor_dashboard' || currentView === 'quality_dashboard'
            ? 'text-teal-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>{t('nav_dashboard')}</span>
      </button>

      <button
        onClick={() => setCurrentView('network_map')}
        className={`flex flex-col items-center gap-1 py-1.5 px-2 text-[10px] font-semibold cursor-pointer transition-colors ${
          currentView === 'network_map' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <MapPin className="w-4 h-4" />
        <span>Map</span>
      </button>

      <button
        onClick={() => setCurrentView('register_patient')}
        className={`flex flex-col items-center gap-1 py-1.5 px-2 text-[10px] font-semibold cursor-pointer transition-colors ${
          currentView === 'register_patient' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <UserPlus className="w-4 h-4" />
        <span>Register</span>
      </button>

      <button
        onClick={() => setCurrentView('ai_triage')}
        className={`flex flex-col items-center gap-1 py-1.5 px-2 text-[10px] font-semibold cursor-pointer transition-colors ${
          currentView === 'ai_triage' ? 'text-rose-400 font-bold' : 'text-rose-500/80 hover:text-rose-400'
        }`}
      >
        <Activity className="w-4 h-4 animate-pulse" />
        <span>Triage</span>
      </button>

      <button
        onClick={() => setCurrentView('referral_tracking')}
        className={`flex flex-col items-center gap-1 py-1.5 px-2 text-[10px] font-semibold cursor-pointer transition-colors ${
          currentView === 'referral_tracking' || currentView === 'smart_referral'
            ? 'text-teal-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Send className="w-4 h-4" />
        <span>Referral</span>
      </button>

      <button
        onClick={() => setCurrentView('settings')}
        className={`flex flex-col items-center gap-1 py-1.5 px-2 text-[10px] font-semibold cursor-pointer transition-colors ${
          currentView === 'settings' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Settings className="w-4 h-4" />
        <span>More</span>
      </button>
    </nav>
  );
};
