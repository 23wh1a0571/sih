import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { Badge } from '../components/common/Badge';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  PhoneCall,
  Sparkles,
  AlertTriangle,
  FileText,
  Clock,
  User,
  Activity,
  Heart,
  Thermometer,
  Wind,
  CheckCircle2,
  Calendar,
  Pill,
  Plus,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Stethoscope,
  Volume2,
  Maximize2,
  Minimize2,
  Radio,
  Wifi,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const Teleconsultation: React.FC = () => {
  const {
    selectedReferral,
    selectedPatient,
    updateReferralStatus,
    setCurrentView,
    showToast,
    currentUser,
  } = useApp();
  const { t } = useTranslation();

  const [callActive, setCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [callDuration, setCallDuration] = useState(148); // in seconds
  const [callStatus, setCallStatus] = useState<'connected' | 'paused' | 'ended'>('connected');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Video element references
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Doctor entered clinical assessment state (NO AUTO PRESCRIPTIONS - strictly doctor entered)
  const [diagnosis, setDiagnosis] = useState('Acute Febrile Illness with Dehydration (Probable Viral Syndrome)');
  const [doctorNotes, setDoctorNotes] = useState(
    'Patient evaluated via tele-link. Hydration advised. Red flag signs (petechiae, bleeding, altered sensorium) explained to patient and frontline health worker. Recheck vitals daily.'
  );
  const [followUpDate, setFollowUpDate] = useState('2026-09-02');

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState([
    {
      medicine: 'Tab. Paracetamol',
      dosage: '650 mg',
      frequency: 'TDS (Thrice daily after food)',
      duration: '3 days',
    },
    {
      medicine: 'Tab. Ondansetron',
      dosage: '4 mg',
      frequency: 'SOS (Before food if vomiting occurs)',
      duration: '2 days',
    },
    {
      medicine: 'Oral Rehydration Salts (ORS)',
      dosage: '1 Sachet in 1 Litre boiled water',
      frequency: 'Sip frequently throughout day',
      duration: '4 days',
    },
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('Twice daily');
  const [newMedDuration, setNewMedDuration] = useState('5 days');

  // Request browser media stream (WebRTC)
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startMedia = async () => {
      try {
        // Request user media for video & audio
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true,
        });

        localStreamRef.current = stream;
        setHasCameraPermission(true);
        setMediaError(null);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        console.warn('Media devices error, falling back to simulated stream:', err);
        setHasCameraPermission(false);
        setMediaError(
          err.name === 'NotAllowedError'
            ? 'Camera/Microphone permission denied by browser. Simulated clinical stream active.'
            : 'No physical webcam detected. Simulated WebRTC link active.'
        );
      }
    };

    if (callActive) {
      startMedia();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    };
  }, [callActive]);

  // Handle Camera Toggle
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = cameraOn;
      });
    }
  }, [cameraOn]);

  // Handle Microphone Toggle
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  // Synthetic remote stream simulation on canvas (representing patient/doctor video)
  useEffect(() => {
    const canvas = remoteCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;
    const render = () => {
      tick += 0.04;
      const w = canvas.width;
      const h = canvas.height;

      // Dark clinical canvas background
      ctx.fillStyle = '#060c18';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // ECG waveform at the bottom
      ctx.beginPath();
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 2;
      for (let x = 0; x < w; x += 2) {
        const pulse = Math.sin((x * 0.05) - (tick * 4));
        const spike = Math.exp(-Math.pow(((x - ((tick * 80) % w)) / 15), 2)) * 35;
        const y = (h - 35) + (pulse * 4) - spike;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Vignette effect
      const grad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w / 1.5);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Timer simulation
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setCallActive(false);
    setCallStatus('ended');
    showToast('Video teleconsultation ended. Document clinical findings and sign prescription.', 'info');
  };

  const handleReconnect = () => {
    setCallActive(true);
    setCallStatus('connected');
    showToast('Reconnecting WebRTC consultation session...', 'info');
  };

  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    setPrescriptions((prev) => [
      ...prev,
      {
        medicine: newMedName,
        dosage: newMedDosage || 'Standard',
        frequency: newMedFreq,
        duration: newMedDuration,
      },
    ]);
    setNewMedName('');
    setNewMedDosage('');
  };

  const handleRemoveMedicine = (index: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinalizeConsultation = () => {
    if (!selectedReferral) return;

    const consultingDoctorName =
      currentUser.role === 'doctor'
        ? `${currentUser.name} (${currentUser.designation})`
        : 'Dr. Vikram Rathore (MD)';

    updateReferralStatus(selectedReferral.id, 'Completed', {
      doctorName: consultingDoctorName,
      consultationDate: 'Today',
      diagnosis,
      prescriptions,
      notes: doctorNotes,
      followUpDate,
    });

    handleEndCall();
    showToast('Teleconsultation completed. Digital prescription & follow-up task transmitted.', 'success');
    setCurrentView('referral_tracking');
  };

  // AI Patient Brief
  const doctorBrief = aiService.generateDoctorBrief(
    selectedPatient.name,
    selectedPatient.age,
    selectedPatient.symptoms,
    selectedPatient.duration || '3 days',
    selectedPatient.vitals,
    selectedPatient.existingConditions,
    selectedReferral?.reason || 'Persistent pyrexia'
  );

  const assignedWorkerName =
    selectedPatient.registeredBy ||
    (currentUser.role === 'asha'
      ? `${currentUser.name} (${currentUser.facility})`
      : 'Frontline ASHA Worker (Venkatapuram SC)');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Bar with Clinical Warning */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              {t('nav_teleconsultation', 'Telemedicine Suite')}
            </span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-slate-400 font-semibold font-mono">
              Referral ID: {selectedReferral?.id || 'REF-2026-00142'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
            <Video className="w-6 h-6 text-teal-400" />
            <span>Digital Specialist Teleconsultation</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {callActive ? (
            <Badge variant="emerald" size="md" dot>
              Call Active: {formatTime(callDuration)}
            </Badge>
          ) : (
            <Badge variant="rose" size="md">
              Call Disconnected
            </Badge>
          )}
          <button
            onClick={() => setCurrentView('referral_tracking')}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Exit Suite
          </button>
        </div>
      </div>

      {/* Main Split Screen: Video Call (Left) + Longitudinal Records (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Video Teleconsultation Feed (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative flex flex-col justify-between p-4 transition-all ${
              isFullscreen ? 'fixed inset-4 z-50 bg-black/95' : 'aspect-4/3'
            }`}
          >
            {/* Call Status Overlay */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs text-white shadow-md">
                <span
                  className={`w-2 h-2 rounded-full ${
                    callActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span className="font-bold">
                  {callActive ? 'Tele-Link Active' : 'Call Ended'}
                </span>
                <span className="text-slate-500">|</span>
                <span className="font-mono text-emerald-300">
                  {callActive ? formatTime(callDuration) : '00:00'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider bg-teal-950/80 border border-teal-500/40 text-teal-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>WebRTC P2P</span>
                </div>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Video Canvas / Streams Area */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {callActive ? (
                <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-[#080d1a] flex items-center justify-center">
                  {/* Remote Synthetic/Loopback Canvas Feed (Patient or Doctor) */}
                  <canvas
                    ref={remoteCanvasRef}
                    width={640}
                    height={480}
                    className="w-full h-full object-cover opacity-90"
                  />

                  {/* Remote Participant Avatar & Info */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-600/20 border-2 border-indigo-400/50 flex items-center justify-center text-white mb-2 shadow-lg shadow-indigo-500/10">
                      <Stethoscope className="w-10 h-10 text-teal-300 animate-pulse-gentle" />
                    </div>
                    <h4 className="text-sm font-bold text-white drop-shadow">
                      {currentUser.role === 'doctor'
                        ? selectedPatient.name
                        : 'Dr. Vikram Rathore, MD'}
                    </h4>
                    <p className="text-xs text-teal-300 drop-shadow flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-emerald-400" />
                      <span>
                        {currentUser.role === 'doctor'
                          ? `Venkatapuram Sub-Centre • ASHA: ${assignedWorkerName.split(' ')[0]}`
                          : 'Senior Physician • Kurnool District Hospital'}
                      </span>
                    </p>
                  </div>

                  {/* Local Video Stream PIP (User's real camera feed) */}
                  <div className="absolute bottom-16 right-4 w-32 sm:w-36 h-24 sm:h-28 bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col items-center justify-center">
                    {cameraOn ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
                        <VideoOff className="w-5 h-5 mb-1 text-rose-400" />
                        <span className="text-[9px] font-bold">Camera Off</span>
                      </div>
                    )}

                    {/* Local PIP Label */}
                    <div className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-xs rounded px-1.5 py-0.5 flex items-center justify-between text-[9px] text-white">
                      <span className="truncate font-semibold max-w-[80px]">
                        {currentUser.name} (You)
                      </span>
                      {isMuted && <MicOff className="w-2.5 h-2.5 text-rose-400 shrink-0" />}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 space-y-2 p-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-rose-400">
                    <PhoneOff className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white">Teleconsultation Finished</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Call duration: {formatTime(callDuration)}. Complete the prescription below to transmit to PHC.
                  </p>
                  <button
                    onClick={handleReconnect}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Reconnect Tele-Link</span>
                  </button>
                </div>
              )}
            </div>

            {/* In-Call Controls (Bottom Bar) */}
            <div className="z-10 flex items-center justify-center gap-2.5 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 self-center shadow-lg">
              {callActive ? (
                <>
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      showToast(isMuted ? 'Microphone unmuted' : 'Microphone muted', 'info');
                    }}
                    className={`p-3 rounded-xl transition-all cursor-pointer ${
                      isMuted
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                    title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      setCameraOn(!cameraOn);
                      showToast(cameraOn ? 'Camera disabled' : 'Camera enabled', 'info');
                    }}
                    className={`p-3 rounded-xl transition-all cursor-pointer ${
                      !cameraOn
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                    title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                  >
                    {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                    title="End Call"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReconnect}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Resume Tele-Link</span>
                </button>
              )}
            </div>
          </div>

          {/* Device / Stream Status Notice */}
          {mediaError && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{mediaError}</span>
            </div>
          )}

          {/* AI Patient Brief Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  AI Patient Brief for Physician
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Decision Support
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
              {doctorBrief.summary}
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-indigo-300 text-[11px] uppercase">
                AI Clinical Concern:
              </p>
              <p>{doctorBrief.clinicalConcern}</p>
            </div>

            {/* Mandatory AI Verification Disclaimer */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>AI-generated summary:</strong> Verify information before making clinical decisions.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Patient Clinical Dossier & Doctor Notes (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Patient Vitals & History Header */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedPatient.name}
                  <span className="text-xs text-slate-400 font-normal">
                    ({selectedPatient.age}y, {selectedPatient.gender})
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Village: {selectedPatient.village} • Phone: {selectedPatient.phone}
                </p>
              </div>
              <Badge variant="amber" size="sm" dot>
                {selectedPatient.riskLevel} Risk
              </Badge>
            </div>

            {/* Live Vital Parameters Display */}
            <div className="grid grid-cols-4 gap-2 text-center pt-3">
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50">
                <p className="text-[10px] uppercase font-bold text-rose-300">{t('vital_temp', 'Temp')}</p>
                <p className="text-base font-black text-rose-200">
                  {selectedPatient.vitals.temperature}°F
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50">
                <p className="text-[10px] uppercase font-bold text-indigo-300">{t('vital_bp', 'BP')}</p>
                <p className="text-base font-black text-indigo-200">
                  {selectedPatient.vitals.bloodPressure}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('vital_hr', 'Heart Rate')}</p>
                <p className="text-base font-black text-white">
                  {selectedPatient.vitals.heartRate} bpm
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/50">
                <p className="text-[10px] uppercase font-bold text-teal-300">{t('vital_spo2', 'SpO2')}</p>
                <p className="text-base font-black text-teal-200">
                  {selectedPatient.vitals.spo2}%
                </p>
              </div>
            </div>
          </div>

          {/* Consultation Notes Form */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm space-y-5">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Physician Consultation Record</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Must be documented and signed by the consulting doctor
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Manual Doctor Entry
              </span>
            </div>

            {/* Diagnosis Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Clinical Diagnosis / Assessment *
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-700 focus:border-indigo-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="e.g. Acute Febrile Illness with Dehydration"
              />
            </div>

            {/* Doctor Entered Prescriptions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Prescribed Medications</span>
                </label>
                <span className="text-[10px] text-slate-400 italic">
                  (Doctor entered - no AI auto-prescribing)
                </span>
              </div>

              {/* Prescription Items List */}
              <div className="space-y-2 mb-3">
                {prescriptions.map((rx, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <span className="font-extrabold text-white">{rx.medicine}</span>
                      <span className="text-slate-400 ml-1">({rx.dosage})</span>
                      <p className="text-slate-400 mt-0.5">
                        {rx.frequency} • <span className="font-semibold text-teal-400">{rx.duration}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded transition-colors cursor-pointer"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Medicine Mini-Form */}
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Medicine name"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="sm:col-span-2 text-xs p-2 rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 500mg)"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg py-2 transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Rx</span>
                </button>
              </div>
            </div>

            {/* Doctor Clinical Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Clinical Advice & Notes
              </label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-700 focus:border-indigo-500 bg-slate-950 text-white placeholder-slate-500 outline-none"
                placeholder="Specific guidance for patient and frontline ASHA worker..."
              />
            </div>

            {/* Follow-up Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Scheduled Follow-up Date *
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Assigned Frontline Worker
                </label>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-200">
                  {assignedWorkerName}
                </div>
              </div>
            </div>

            {/* Final Action Button */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleFinalizeConsultation}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-101 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Finalize Consultation & Complete Referral</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

