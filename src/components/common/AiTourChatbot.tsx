import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTimeGreeting } from '../../hooks/useTimeGreeting';
import { AmbulanceLoader } from './AmbulanceLoader';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  MapPin,
  WifiOff,
  Video,
  BarChart3,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: any;
  };
  suggestedQueries?: string[];
}

export const AiTourChatbot: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    role,
    setRole,
    setDemoTourActive,
    demoStep,
    setDemoStep,
    toggleOfflineMode,
    isOfflineMode,
    showToast,
  } = useApp();

  const { greeting, timeString } = useTimeGreeting();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [showAmbulanceDemo, setShowAmbulanceDemo] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message with dynamic greeting based on time of day
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `${greeting}! I am **Aarogya AI**, your interactive website tour guide for **SwasthyaSetu AI**. I can walk you through the entire rural health continuity workflow, demonstrate offline-first sync, show teleconsultations, and navigate you anywhere on the platform. What would you like to explore first?`,
      timestamp: timeString,
      suggestedQueries: [
        '🚀 Start Full Guided Tour',
        '🩺 Explore ASHA Triage',
        '📡 Test Offline Sync',
        '🗺️ View District Healthcare Map',
        '👨‍⚕️ Specialist Teleconsultation',
        '🚑 See Ambulance Animation',
      ],
    },
  ]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Voice narration helper using Web Speech API
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks
      const clean = text.replace(/\*\*/g, '').replace(/#/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* ignore */
    }
  };

  const handleSend = (userText: string) => {
    const query = (userText || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI response with domain intelligence
    setTimeout(() => {
      const response = generateAiResponse(query);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
      speakText(response.text);
    }, 600);
  };

  const generateAiResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // 1. Ambulance lights animation request
    if (q.includes('ambulance') || q.includes('siren') || q.includes('loading') || q.includes('lights')) {
      setShowAmbulanceDemo(true);
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Here is the **Ambulance Emergency Strobe Lights animation**! It features dual-frequency high-intensity red and blue strobe beacons with speed lines and clinical dispatch indicator. You can test it anytime during emergency triage or syncing!`,
        timestamp: time,
        actionButton: {
          label: '🚑 Trigger Ambulance Lights Again',
          onClick: () => setShowAmbulanceDemo(true),
        },
        suggestedQueries: ['🩺 Explore ASHA Triage', '🗺️ View Healthcare Map', '🚀 Start Full Guided Tour'],
      };
    }

    // 2. Full Tour
    if (q.includes('start full') || q.includes('guided tour') || q.includes('full tour') || q.includes('walkthrough')) {
      setDemoTourActive(true);
      setDemoStep(1);
      setCurrentView('landing');
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Launching the **16-Step SIH Interactive Tour**! The floating presentation bar at the bottom will guide you through the entire rural healthcare continuum from village ASHA worker up to the District Collectorate command center.`,
        timestamp: time,
        actionButton: {
          label: 'Step 1: Go to Landing Page',
          onClick: () => {
            setDemoTourActive(true);
            setCurrentView('landing');
          },
        },
        suggestedQueries: ['Next Tour Step', '🩺 Explore ASHA Triage', '👨‍⚕️ Specialist Teleconsultation'],
      };
    }

    // 3. ASHA Frontline & Registration
    if (q.includes('asha') || q.includes('triage') || q.includes('register') || q.includes('patient') || q.includes('frontline')) {
      setRole('asha');
      setCurrentView('asha_dashboard');
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Navigating you to the **ASHA Frontline Worker Dashboard** (Sai Mikkil Reddy - Venkatapuram village). Here frontline workers record vital signs, record vernacular Telugu/Hindi symptoms, review AI triage scores, and manage offline village registers.`,
        timestamp: time,
        actionButton: {
          label: 'Open New Patient Registration',
          onClick: () => setCurrentView('register_patient'),
        },
        suggestedQueries: ['📡 Test Offline Sync', 'AI Symptom Extraction', 'Generate Smart Referral'],
      };
    }

    // 4. Offline mode & Sync
    if (q.includes('offline') || q.includes('sync') || q.includes('internet') || q.includes('network')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `**SwasthyaSetu AI is Offline-First**! In remote Indian villages without cellular signal, ASHA workers can still register patients, perform clinical assessments, and queue referrals locally. Once connection is detected, records synchronize automatically with District Health Cloud.`,
        timestamp: time,
        actionButton: {
          label: isOfflineMode ? 'Restore Online & Sync Cloud' : 'Simulate Offline Mode (Toggle)',
          onClick: () => toggleOfflineMode(),
        },
        suggestedQueries: ['🩺 Explore ASHA Triage', '🗺️ View Healthcare Map', '📊 District Quality Analytics'],
      };
    }

    // 5. Healthcare Map / GIS
    if (q.includes('map') || q.includes('gis') || q.includes('hospital') || q.includes('facility') || q.includes('network')) {
      setCurrentView('network_map');
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Opening the **District Healthcare GIS Map**! This visualizes the tiered rural care network across Kurnool District: Sub-Centres, Primary Health Centres (PHCs), Community Health Centres (CHCs), and District Hospital with real-time bed capacity and specialty coverage.`,
        timestamp: time,
        actionButton: {
          label: 'Explore Venkatapuram Sub-Centre',
          onClick: () => setCurrentView('network_map'),
        },
        suggestedQueries: ['👨‍⚕️ Specialist Teleconsultation', '📊 District Quality Analytics', '🚀 Start Full Guided Tour'],
      };
    }

    // 6. Doctor Dashboard / Teleconsultation
    if (q.includes('doctor') || q.includes('specialist') || q.includes('teleconsult') || q.includes('video') || q.includes('call') || q.includes('prescription')) {
      setRole('doctor');
      setCurrentView('doctor_dashboard');
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Switched to **Doctor / Specialist Portal** (Dr. Vikram Rathore, MD at District Hospital Kurnool). Doctors can review AI pre-consultation briefs, launch secure real-time video teleconsultations, and issue ABDM-compliant digital prescriptions.`,
        timestamp: time,
        actionButton: {
          label: 'Enter Teleconsultation Room',
          onClick: () => setCurrentView('teleconsultation'),
        },
        suggestedQueries: ['Review AI Patient Brief', '📊 District Quality Analytics', '🩺 Explore ASHA Triage'],
      };
    }

    // 7. District Command Center & Analytics
    if (q.includes('analytics') || q.includes('quality') || q.includes('district') || q.includes('admin') || q.includes('kpi') || q.includes('outbreak') || q.includes('epidemic')) {
      setRole('admin');
      setCurrentView('quality_dashboard');
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Welcome to the **District Command & Quality Analytics Center**! Health administrators monitor real-time triage distribution, referral completion rates, disease outbreak warning clusters (e.g. Dengue in Alur), and facility bed utilization.`,
        timestamp: time,
        actionButton: {
          label: 'View Outbreak Alerts',
          onClick: () => setCurrentView('quality_dashboard'),
        },
        suggestedQueries: ['🗺️ View Healthcare Map', '📡 Test Offline Sync', '🚀 Start Full Guided Tour'],
      };
    }

    // 8. ABDM & ABHA Identity
    if (q.includes('abdm') || q.includes('abha') || q.includes('privacy') || q.includes('security') || q.includes('compliance')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `SwasthyaSetu AI is strictly architected for **Ayushman Bharat Digital Mission (ABDM)** compliance:
• 14-digit ABHA Health IDs ensure seamless interoperability.
• Consent-driven FHIR / SNOMED-CT clinical records.
• Frontline offline encryption ensures patient privacy in tribal zones.`,
        timestamp: time,
        actionButton: {
          label: 'View Settings & Compliance Docs',
          onClick: () => setCurrentView('settings'),
        },
        suggestedQueries: ['🩺 Explore ASHA Triage', '👨‍⚕️ Specialist Teleconsultation', '🗺️ View Healthcare Map'],
      };
    }

    // Default Fallback
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `I understand! As your tour guide, I can directly take you to any part of SwasthyaSetu AI: Frontline ASHA triage, offline sync simulation, Doctor teleconsultation, GIS healthcare map, or the District Quality Command Center. Where shall we go?`,
      timestamp: time,
      suggestedQueries: [
        '🚀 Start Full Guided Tour',
        '🩺 Explore ASHA Triage',
        '📡 Test Offline Sync',
        '🗺️ View District Healthcare Map',
        '👨‍⚕️ Specialist Teleconsultation',
        '🚑 See Ambulance Animation',
      ],
    };
  };

  return (
    <>
      {/* Full-screen Ambulance Strobe Demo Overlay if triggered */}
      {showAmbulanceDemo && (
        <AmbulanceLoader
          overlay={true}
          message="Emergency Ambulance Strobe Lights Active"
          subtext="Simulating emergency frontline patient transfer to Kurnool District Hospital"
          onClose={() => setShowAmbulanceDemo(false)}
        />
      )}

      {/* Floating Chatbot Bubble Trigger */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-4">
          {/* Pulsing Hint Pill */}
          <div className="bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-teal-500/40 backdrop-blur-md flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-all"
            onClick={() => setIsOpen(true)}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Need a tour? Ask Aarogya AI!</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Main Floating Avatar Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-700 to-indigo-800 text-white shadow-xl shadow-teal-700/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-teal-300/40"
            title="Open SwasthyaSetu AI Tour Guide"
            aria-label="Open AI Tour Guide"
          >
            {/* Blinking Emergency Mini Beacon on top corner */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border border-white text-[8px] font-extrabold text-white items-center justify-center">
                AI
              </span>
            </span>

            <Bot className="w-7 h-7 text-teal-100 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Open Interactive Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-20 right-4 sm:bottom-6 sm:right-6 w-80 h-16 rounded-2xl shadow-2xl overflow-hidden'
              : 'bottom-20 right-3 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col'
          } bg-slate-900/95 backdrop-blur-xl animate-in zoom-in-95 duration-200 text-slate-100 shadow-black/80`}
        >
          {/* Chatbot Header */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md select-none border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-md border border-teal-300/30">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-tight">
                    Aarogya AI Guide
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30">
                    Emergency Tour
                  </span>
                </div>
                <p className="text-[11px] text-teal-200/80 font-medium">
                  {greeting} • Ready to guide you
                </p>
              </div>
            </div>

            {/* Header Action Icons */}
            <div className="flex items-center gap-1">
              {/* Ambulance Animation Trigger */}
              <button
                onClick={() => setShowAmbulanceDemo(true)}
                className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Test Ambulance Blinking Lights"
              >
                <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              </button>

              {/* Voice Readout Toggle */}
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  showToast(
                    !voiceEnabled ? 'Voice guide narration enabled' : 'Voice guide narration muted',
                    'info'
                  );
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  voiceEnabled ? 'text-teal-300 bg-white/20' : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={voiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice Narration'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Minimize / Maximize */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close AI Guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* When Minimized Bar */}
          {isMinimized ? (
            <div
              className="flex-1 flex items-center justify-between px-4 bg-slate-900 text-white cursor-pointer"
              onClick={() => setIsMinimized(false)}
            >
              <span className="text-xs font-semibold text-teal-300">
                Aarogya AI Tour is active • Click to expand
              </span>
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </div>
          ) : (
            <>
              {/* Chat Message Scrollable Container */}
              <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-[#070b16] text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    } animate-in fade-in duration-200`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-br-xs'
                          : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">
                        {msg.text.split('\n').map((line, idx) => (
                          <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>

                      {/* Optional Action Button */}
                      {msg.actionButton && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800">
                          <button
                            onClick={msg.actionButton.onClick}
                            className="flex items-center gap-1.5 w-full justify-center px-3 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-xs"
                          >
                            <span>{msg.actionButton.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                      {msg.timestamp}
                    </span>

                    {/* Suggested Next Queries Chips */}
                    {msg.suggestedQueries && msg.suggestedQueries.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                        {msg.suggestedQueries.map((query, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSend(query)}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 shadow-xs transition-all cursor-pointer"
                          >
                            {query}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 p-2 bg-slate-900 rounded-2xl border border-slate-800 w-20 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.3s]" />
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick Feature Navigation Row */}
              <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] select-none no-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  Quick Jump:
                </span>
                <button
                  onClick={() => {
                    setRole('asha');
                    setCurrentView('asha_dashboard');
                  }}
                  className="shrink-0 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium cursor-pointer"
                >
                  ASHA Portal
                </button>
                <button
                  onClick={() => setCurrentView('network_map')}
                  className="shrink-0 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium cursor-pointer"
                >
                  GIS Map
                </button>
                <button
                  onClick={() => {
                    setRole('doctor');
                    setCurrentView('doctor_dashboard');
                  }}
                  className="shrink-0 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium cursor-pointer"
                >
                  Doctor Teleconsult
                </button>
                <button
                  onClick={() => {
                    setRole('admin');
                    setCurrentView('quality_dashboard');
                  }}
                  className="shrink-0 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium cursor-pointer"
                >
                  Command Center
                </button>
                <button
                  onClick={() => setShowAmbulanceDemo(true)}
                  className="shrink-0 px-2 py-0.5 rounded-md bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/40 font-bold cursor-pointer"
                >
                  🚑 Ambulance
                </button>
              </div>

              {/* Input Box Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputQuery);
                }}
                className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask a question or request a tour..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-400 focus:bg-slate-950 transition-all text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="flex items-center justify-center w-8 h-8 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-teal-600/30 shrink-0 cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
