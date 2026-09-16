import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role, Language } from '../../types';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  Languages,
  UserCheck,
  ChevronDown,
  Sparkles,
  Eye,
  Sliders,
  Check,
  Building2,
  Stethoscope,
  Users,
  ShieldAlert,
  MapPin,
  LogIn,
  LogOut,
  Share2,
} from 'lucide-react';
import { TimeGreetingBadge } from '../common/TimeGreetingBadge';
import { ShareModal } from '../common/ShareModal';
import { useTranslation } from '../../hooks/useTranslation';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    isAuthenticated,
    logout,
    currentView,
    isOfflineMode,
    toggleOfflineMode,
    isSyncing,
    pendingSyncCount,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    notifications,
    setCurrentView,
    setDemoTourActive,
  } = useApp();

  const { t, language, setLanguage } = useTranslation();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAccessMenu, setShowAccessMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<Role, { label: string; icon: any; color: string }> = {
    asha: { label: 'ASHA / ANM', icon: Users, color: 'text-teal-300 bg-teal-950/80 border-teal-500/40 hover:bg-teal-900/60' },
    doctor: { label: 'Doctor / Specialist', icon: Stethoscope, color: 'text-indigo-300 bg-indigo-950/80 border-indigo-500/40 hover:bg-indigo-900/60' },
    phc: { label: 'PHC Staff', icon: Building2, color: 'text-blue-300 bg-blue-950/80 border-blue-500/40 hover:bg-blue-900/60' },
    admin: { label: 'District Administrator', icon: ShieldAlert, color: 'text-amber-300 bg-amber-950/80 border-amber-500/40 hover:bg-amber-900/60' },
  };

  const CurrentRoleIcon = roleLabels[role].icon;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg shadow-black/30">
      {/* Offline Mode Banner when offline */}
      {isOfflineMode && (
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner animate-in fade-in">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>
              🔴 OFFLINE MODE: Internet connection unavailable. Data will be stored locally and synchronized automatically.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white/20 px-2 py-0.5 rounded text-white text-[11px] font-bold">
              Pending Sync: {pendingSyncCount} records
            </span>
            <button
              onClick={toggleOfflineMode}
              className="bg-white text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded text-xs font-bold transition-all shadow-xs"
            >
              Restore Online & Sync
            </button>
          </div>
        </div>
      )}

      {/* Syncing Banner */}
      {isSyncing && (
        <div className="bg-indigo-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-inner">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
          <span>Synchronizing offline records with District Health Cloud...</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform border border-teal-400/30">
              {/* Medical Cross & Bridge SVG */}
              <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-lg tracking-tight">
                  SwasthyaSetu <span className="text-teal-400">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
                  SIH26133
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 font-medium leading-none">
                {t('app_tagline')}
              </p>
            </div>
          </button>
        </div>

        {/* Dynamic Time & Greeting Pill */}
        <TimeGreetingBadge variant="navbar" showSeconds={true} />

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Offline / Online Simulation Toggle */}
          <button
            onClick={toggleOfflineMode}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isOfflineMode
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 hover:bg-rose-900/60'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60'
            }`}
            title="Toggle offline connectivity simulation"
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">{t('offline_status')}</span>
                {pendingSyncCount > 0 && (
                  <span className="bg-rose-600 text-white rounded-full px-1.5 py-0.2 text-[10px]">
                    {pendingSyncCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{t('online_status')}</span>
              </>
            )}
          </button>

          {/* District Healthcare GIS Map Navigation */}
          <button
            onClick={() => setCurrentView('network_map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentView === 'network_map'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/30'
                : 'bg-slate-800/90 text-teal-300 border border-slate-700 hover:bg-slate-750'
            }`}
            title="View District Healthcare GIS Map"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{t('nav_healthcare_map')}</span>
          </button>

          {/* SIH Demo Tour Launcher */}
          <button
            onClick={() => setDemoTourActive(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-500/40 hover:bg-amber-900/60 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('demo_tour')}</span>
          </button>

          {/* Share App Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-950/80 text-teal-300 border border-teal-500/40 hover:bg-teal-900/60 transition-all cursor-pointer shadow-sm"
            title="Share Website link and QR Code"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Share App</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowRoleMenu(false);
                setShowAccessMenu(false);
              }}
              className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700 bg-slate-800/90 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
              title="Change Language"
            >
              <Languages className="w-4 h-4 text-teal-400" />
              <span className="hidden sm:inline uppercase">{language}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  {t('change_language')}
                </div>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-800 flex items-center justify-between text-slate-200 cursor-pointer"
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-4 h-4 text-teal-400" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('te');
                    setShowLangMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-800 flex items-center justify-between text-slate-200 cursor-pointer"
                >
                  <span>తెలుగు (Telugu)</span>
                  {language === 'te' && <Check className="w-4 h-4 text-teal-400" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-800 flex items-center justify-between text-slate-200 cursor-pointer"
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'hi' && <Check className="w-4 h-4 text-teal-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowLangMenu(false);
                setShowAccessMenu(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${roleLabels[role].color}`}
            >
              <CurrentRoleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{roleLabels[role].label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  {t('switch_role')}
                </div>
                {(['asha', 'doctor', 'phc', 'admin'] as Role[]).map((r) => {
                  const ItemIcon = roleLabels[r].icon;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                        role === r ? 'text-teal-300 font-bold bg-teal-950/60' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ItemIcon className="w-4 h-4 text-slate-400" />
                        <span>{roleLabels[r].label}</span>
                      </div>
                      {role === r && <Check className="w-4 h-4 text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setCurrentView('notifications')}
            className="relative p-2 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Authentication Portal Link / User Profile */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-600 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title={`Logged in as ${currentUser?.name} (${currentUser?.designation})`}
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-400" />
              <span className="hidden sm:inline">{t('sign_out')}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-teal-600/30"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('login')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </header>
  );
};
