import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { Role } from '../types';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Building2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Fingerprint,
  UserPlus,
  LogIn,
  KeyRound,
  MapPin,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, signUp, accounts, showToast, setCurrentView } = useApp();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'persona' | 'otp'>('login');

  // Sign In state
  const [identifier, setIdentifier] = useState('sai@swasthyasetu.gov.in');
  const [password, setPassword] = useState('swasthya@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('asha');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sign Up (Create Account) state
  const [signupName, setSignupName] = useState('');
  const [signupEmailOrPhone, setSignupEmailOrPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<Role>('asha');
  const [signupFacility, setSignupFacility] = useState('Venkatapuram Sub-Centre, Kurnool');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  // OTP state
  const [mobileNumber, setMobileNumber] = useState('9848023145');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['5', '4', '8', '2', '1', '9']);
  const [resendTimer, setResendTimer] = useState(0);

  // Persona list with verified healthcare roles
  const personas: Array<{
    id: Role;
    title: string;
    persona: string;
    location: string;
    idNumber: string;
    description: string;
    icon: any;
    color: string;
    badgeColor: string;
    btnClass: string;
    features: string[];
  }> = [
    {
      id: 'asha',
      title: 'ASHA / Frontline Health Worker',
      persona: 'Sai Mikkil Reddy',
      location: 'Venkatapuram Sub-Centre, Kurnool Block',
      idNumber: 'ASHA-KUR-9821',
      description: 'Conduct village health surveys, register patients via multilingual voice recognition, and triage with offline-first support.',
      icon: Users,
      color: 'border-teal-500/30 bg-teal-950/20 hover:border-teal-400',
      badgeColor: 'bg-teal-950/60 text-teal-300 border-teal-800',
      btnClass: 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/20',
      features: ['Multilingual Voice Input', 'Offline-First Local Storage', 'Frontline Triage Risk Scoring'],
    },
    {
      id: 'doctor',
      title: 'Doctor / Specialist Physician',
      persona: 'Dr. Vikram Rathore (MD)',
      location: 'District Hospital Kurnool (General Medicine)',
      idNumber: 'DOC-DH-1042',
      description: 'Review inbound smart referrals, consult via simulated WebRTC teleconsultation, and document doctor-entered treatment notes.',
      icon: Stethoscope,
      color: 'border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-400',
      badgeColor: 'bg-indigo-950/60 text-indigo-300 border-indigo-800',
      btnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20',
      features: ['AI Patient Clinical Brief', 'Real-Time WebRTC Teleconsultation', 'Prescription & Scans Review'],
    },
    {
      id: 'phc',
      title: 'PHC Medical Officer & Staff',
      persona: 'Dr. K. S. Rao (MBBS)',
      location: 'PHC Kurnool Rural',
      idNumber: 'PHC-MO-0038',
      description: 'Evaluate frontline referrals, review rapid diagnostic tests (Malaria/Dengue), and escalate cases to district hospital.',
      icon: Building2,
      color: 'border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400',
      badgeColor: 'bg-cyan-950/60 text-cyan-300 border-cyan-800',
      btnClass: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20',
      features: ['Intermediate Diagnostics Review', 'Smart Referral Escalation', 'Bed & OPD Routing'],
    },
    {
      id: 'admin',
      title: 'District Healthcare Administrator',
      persona: 'S. K. Verma, IAS',
      location: 'District Health Command Center, Kurnool',
      idNumber: 'ADM-DHO-0001',
      description: 'Oversee district referral load, bed occupancy, ambulance transit tracking, and maternal / febrile disease hotspots.',
      icon: ShieldAlert,
      color: 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400',
      badgeColor: 'bg-amber-950/60 text-amber-300 border-amber-800',
      btnClass: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20',
      features: ['Interactive GIS Andhra Pradesh Map', 'Ambulance Transit Fleet GPS', 'District Referral Analytics'],
    },
  ];

  // Submit via credentials (Sign In)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter both Email / Phone / Staff ID and Password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Check if matches registered accounts
      const matched = accounts.find(
        (a) =>
          a.emailOrPhone.toLowerCase() === identifier.trim().toLowerCase() ||
          a.name.toLowerCase() === identifier.trim().toLowerCase()
      );

      if (matched) {
        login({
          role: matched.role,
          username: matched.name,
          method: 'credentials',
        });
      } else {
        login({
          role: selectedRole,
          username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
          method: 'credentials',
        });
      }
    }, 600);
  };

  // Submit Sign Up (Create Account)
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim()) {
      setSignupError('Please enter your full name (e.g. Sai Mikkil Reddy).');
      return;
    }
    if (!signupEmailOrPhone.trim()) {
      setSignupError('Please enter a valid email or phone number.');
      return;
    }
    if (signupPassword.length < 4) {
      setSignupError('Password must be at least 4 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      signUp({
        name: signupName.trim(),
        emailOrPhone: signupEmailOrPhone.trim(),
        password: signupPassword,
        role: signupRole,
        facility: signupFacility,
      });
      setSignupSuccess(true);
    }, 600);
  };

  // Trigger simulated OTP
  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setResendTimer(30);
    showToast(`Simulation OTP sent to +91 ${mobileNumber}: 548219`, 'info');

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login({
        role: selectedRole,
        username: 'Sai Mikkil Reddy',
        method: 'otp',
      });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>National Emergency Rural Health Network • Andhra Pradesh Zone</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
          SwasthyaSetu <span className="text-teal-400">AI</span> Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Secure biometric &amp; role-based health gateway for ASHA workers, PHC Medical Officers, and District Specialists.
        </p>
      </div>

      {/* Tabs Header */}
      <div className="flex justify-center">
        <div className="flex flex-wrap items-center justify-center p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setSignupError('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md shadow-teal-500/30 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account / Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('persona');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'persona'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>One-Click Role Demo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('otp');
              setErrorMessage('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'otp'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>OTP Login</span>
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* TAB 1: SIGN IN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-100">Sign in to your account</h2>
              <p className="text-xs text-slate-400">
                Enter your credentials or pick from available profiles
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/80 border border-rose-600/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Clinical / Administrative Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['asha', 'doctor', 'phc', 'admin'] as Role[]).map((r) => {
                  const labels: Record<Role, string> = {
                    asha: 'ASHA / ANM',
                    doctor: 'Doctor / Specialist',
                    phc: 'PHC Officer',
                    admin: 'Administrator',
                  };
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => {
                        setSelectedRole(r);
                        if (r === 'asha') setIdentifier('sai@swasthyasetu.gov.in');
                        if (r === 'doctor') setIdentifier('dr.vikram@kurnoolhealth.gov.in');
                        if (r === 'phc') setIdentifier('dr.ksrao@kurnoolhealth.gov.in');
                        if (r === 'admin') setIdentifier('dho.kurnool@nic.in');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        selectedRole === r
                          ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {labels[r]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email / Identifier */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Email, Phone or Staff ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="sai@swasthyasetu.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-teal-400 cursor-pointer hover:underline">
                  Default: swasthya@2026
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Fast switch */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-teal-600 focus:ring-0"
                />
                <span>Keep session persistent</span>
              </label>

              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-teal-400 hover:underline font-semibold"
              >
                Need an account? Sign Up
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating with District Cloud...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Enter SwasthyaSetu Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: CREATE ACCOUNT / SIGN UP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="max-w-lg mx-auto space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-100">Create New Account</h2>
              <p className="text-xs text-slate-400">
                Register as a healthcare professional or frontline worker in Andhra Pradesh
              </p>
            </div>

            {signupError && (
              <div className="p-3 bg-rose-950/80 border border-rose-600/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{signupError}</span>
              </div>
            )}

            {signupSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Account created successfully! Welcome, {signupName}.</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Sai Mikkil Reddy"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            {/* Email or Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Email Address or Phone Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signupEmailOrPhone}
                  onChange={(e) => setSignupEmailOrPhone(e.target.value)}
                  placeholder="e.g. sai@example.com or +91 98480 23145"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Assign Role <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'asha' as Role, label: 'ASHA / Frontline Worker', desc: 'Village surveys, triage & follow-up' },
                  { id: 'doctor' as Role, label: 'Doctor / Specialist', desc: 'Referral consults & tele-review' },
                  { id: 'phc' as Role, label: 'PHC Medical Officer', desc: 'Primary care & rapid diagnostics' },
                  { id: 'admin' as Role, label: 'District Administrator', desc: 'Command center & GIS oversight' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setSignupRole(item.id);
                      if (item.id === 'asha') setSignupFacility('Venkatapuram Sub-Centre, Kurnool');
                      if (item.id === 'doctor') setSignupFacility('District Hospital Kurnool (General Medicine)');
                      if (item.id === 'phc') setSignupFacility('PHC Kurnool Rural');
                      if (item.id === 'admin') setSignupFacility('District Health Command Center, Kurnool');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      signupRole === item.id
                        ? 'bg-teal-950/80 border-teal-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <p className={`text-xs font-bold ${signupRole === item.id ? 'text-teal-300' : 'text-slate-200'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Facility / Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Assigned Health Facility / Area
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signupFacility}
                  onChange={(e) => setSignupFacility(e.target.value)}
                  placeholder="e.g. Venkatapuram Sub-Centre, Kurnool"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 4 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <span>Creating Account &amp; Logging In...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account &amp; Enter Dashboard</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-slate-400 hover:text-teal-300 underline"
              >
                Already have an account? Sign In here
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ONE-CLICK ROLE DEMO */}
        {activeTab === 'persona' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-100">Select Interactive Healthcare Role</h2>
              <p className="text-xs text-slate-400">
                Instantly evaluate SwasthyaSetu AI with pre-configured persona access
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personas.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${p.color}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2.5 bg-slate-900/90 rounded-xl shadow-xs border border-slate-800 text-slate-200">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${p.badgeColor}`}>
                          {p.idNumber}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-slate-100">{p.title}</h3>
                        <p className="text-xs font-bold text-teal-400">{p.persona}</p>
                        <p className="text-[11px] text-slate-400">{p.location}</p>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="space-y-1 pt-2 border-t border-slate-800/80">
                        {p.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          login({
                            role: p.id,
                            username: p.persona,
                            method: 'persona',
                          });
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${p.btnClass}`}
                      >
                        <span>Launch as {p.persona.split(' ')[0]}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: OTP AUTH */}
        {activeTab === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="max-w-md mx-auto space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-100">Frontline OTP Verification</h2>
              <p className="text-xs text-slate-400">
                Mobile authentication for ASHA workers in remote low-connectivity areas
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Mobile Number (India)
              </label>
              <div className="flex gap-2">
                <span className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="9848023145"
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={resendTimer > 0}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  {resendTimer > 0 ? `${resendTimer}s` : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-center gap-2">
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => {
                        const newOtp = [...otpValues];
                        newOtp[i] = e.target.value;
                        setOtpValues(newOtp);
                      }}
                      className="w-10 h-12 text-center text-lg font-black bg-slate-950 border border-slate-700 rounded-xl text-teal-400 focus:outline-none focus:border-teal-500"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-center text-slate-400">
                  Simulation code automatically filled: <span className="text-teal-400 font-bold">548219</span>
                </p>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP &amp; Continue as Sai Mikkil Reddy</span>
                </button>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Security & Offline Compliance Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-3">
          <div className="p-2 bg-teal-950/60 text-teal-400 rounded-xl border border-teal-800/60">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">ABDM &amp; FHIR Compliant</h4>
            <p className="text-[11px] text-slate-400">Encrypted token architecture</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-3">
          <div className="p-2 bg-indigo-950/60 text-indigo-400 rounded-xl border border-indigo-800/60">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Offline Authentication</h4>
            <p className="text-[11px] text-slate-400">Cached cryptographic keys</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-3">
          <div className="p-2 bg-amber-950/60 text-amber-400 rounded-xl border border-amber-800/60">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Dynamic User Sessions</h4>
            <p className="text-[11px] text-slate-400">Personalized greeting &amp; roster</p>
          </div>
        </div>
      </div>
    </div>
  );
};
