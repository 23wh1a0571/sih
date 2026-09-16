import React from 'react';
import { Activity, ShieldAlert, Sparkles, HeartPulse } from 'lucide-react';

interface AmbulanceLoaderProps {
  message?: string;
  subtext?: string;
  overlay?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showBackdrop?: boolean;
  onClose?: () => void;
}

export const AmbulanceLoader: React.FC<AmbulanceLoaderProps> = ({
  message = 'Processing Clinical Decision Support...',
  subtext = 'Connecting rural frontline workers to emergency healthcare network',
  overlay = false,
  size = 'md',
  showBackdrop = true,
  onClose,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const content = (
    <div className="relative flex flex-col items-center justify-center text-center p-6 select-none">
      {/* Dynamic Emergency Halo Pulse Glow */}
      <div className="absolute w-72 h-72 rounded-full animate-emergency-halo pointer-events-none -z-10 blur-2xl opacity-70" />

      {/* Ambulance Graphic Container */}
      <div className="relative flex flex-col items-center">
        {/* Blinking Emergency Rooftop Light Bar */}
        <div className="relative z-20 flex items-center justify-center gap-3 mb-[-6px]">
          {/* Left Red Strobe Beacon */}
          <div className="relative flex items-center justify-center">
            <div className="w-5 h-4 rounded-t-md bg-rose-600 animate-strobe-red shadow-lg shadow-rose-500/80 border border-rose-400" />
            <span className="absolute -top-3 w-10 h-10 rounded-full bg-rose-500/40 blur-sm animate-strobe-red pointer-events-none" />
          </div>

          {/* Center Siren Bracket */}
          <div className="w-4 h-2 rounded-xs bg-slate-700 shadow-inner" />

          {/* Right Blue Strobe Beacon */}
          <div className="relative flex items-center justify-center">
            <div className="w-5 h-4 rounded-t-md bg-blue-600 animate-strobe-blue shadow-lg shadow-blue-500/80 border border-blue-400" />
            <span className="absolute -top-3 w-10 h-10 rounded-full bg-blue-500/40 blur-sm animate-strobe-blue pointer-events-none" />
          </div>
        </div>

        {/* Ambulance Vehicle Vector SVG */}
        <div className="relative z-10 filter drop-shadow-xl">
          <svg
            className={`${isSm ? 'w-36 h-20' : isLg ? 'w-64 h-36' : 'w-48 h-28'} transition-all`}
            viewBox="0 0 240 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Front Headlight Beam */}
            <path
              d="M225 78 L260 65 L260 100 Z"
              fill="url(#headlight-beam)"
              opacity="0.6"
              className="animate-pulse"
            />

            {/* Ambulance Body */}
            <path
              d="M20 100 L20 38 C20 32 24 28 30 28 L145 28 C150 28 155 30 158 35 L182 62 C185 66 190 68 196 68 L220 68 C226 68 230 72 230 78 L230 100 C230 103 228 105 225 105 L20 105 C17 105 15 103 15 100 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Front Windshield Glass */}
            <path
              d="M152 35 L178 64 C180 66 183 67 186 67 L152 67 Z"
              fill="#38BDF8"
              opacity="0.85"
            />

            {/* Side Medical Cabin Window */}
            <rect
              x="38"
              y="38"
              width="45"
              height="26"
              rx="4"
              fill="#E0F2FE"
              stroke="#0F172A"
              strokeWidth="2.5"
            />

            <rect
              x="92"
              y="38"
              width="45"
              height="26"
              rx="4"
              fill="#E0F2FE"
              stroke="#0F172A"
              strokeWidth="2.5"
            />

            {/* Emergency Red Lifeline Stripe */}
            <path
              d="M16 78 L142 78 L152 70 L160 86 L168 74 L174 81 L180 78 L228 78"
              stroke="#DC2626"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Medical Red Cross Icon on Cabin */}
            <g transform="translate(60, 43) scale(0.7)">
              <rect x="7" y="1" width="6" height="18" fill="#DC2626" rx="1.5" />
              <rect x="1" y="7" width="18" height="6" fill="#DC2626" rx="1.5" />
            </g>

            {/* "108 / AMBULANCE" Sign */}
            <text
              x="100"
              y="56"
              fill="#DC2626"
              fontSize="12"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="1"
            >
              108
            </text>

            {/* Front Bumper & Headlight */}
            <rect x="225" y="75" width="6" height="12" rx="2" fill="#FBBF24" />
            <rect x="224" y="94" width="8" height="10" rx="2" fill="#64748B" />

            {/* Left Wheel Rim */}
            <g transform="translate(56, 105)">
              <circle cx="0" cy="0" r="19" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
              <circle cx="0" cy="0" r="10" fill="#94A3B8" />
              <circle cx="0" cy="0" r="4" fill="#F8FAFC" />
            </g>

            {/* Right Wheel Rim */}
            <g transform="translate(182, 105)">
              <circle cx="0" cy="0" r="19" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
              <circle cx="0" cy="0" r="10" fill="#94A3B8" />
              <circle cx="0" cy="0" r="4" fill="#F8FAFC" />
            </g>

            {/* Defs for Headlight Glow */}
            <defs>
              <linearGradient id="headlight-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Speed Dashed Road Vector */}
        <div className="w-56 sm:w-64 h-3 mt-1 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 240 12">
            <line
              x1="0"
              y1="6"
              x2="240"
              y2="6"
              stroke="#94A3B8"
              strokeWidth="3.5"
              strokeDasharray="14 10"
              className="animate-road-dash"
            />
          </svg>
        </div>
      </div>

      {/* Emergency Audio Pulse Soundwave Bars */}
      <div className="flex items-center gap-1 my-3">
        <span className="w-1 bg-rose-500 rounded-full animate-strobe-red h-4" />
        <span className="w-1 bg-rose-500 rounded-full animate-strobe-red h-6" />
        <span className="w-1 bg-blue-500 rounded-full animate-strobe-blue h-7" />
        <span className="w-1 bg-blue-500 rounded-full animate-strobe-blue h-5" />
        <span className="w-1 bg-rose-500 rounded-full animate-strobe-red h-3" />
      </div>

      {/* Loading Status Text & Details */}
      <div className="space-y-1.5 max-w-sm">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
            {message}
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {subtext}
        </p>
      </div>

      {/* Emergency Protocol Badge */}
      <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
        <span>National Rural Health Mission • Emergency Lifeline</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="mt-4 text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
        >
          Dismiss Animation
        </button>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 max-w-md w-full relative overflow-hidden">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 p-4 transition-all ${
        showBackdrop ? 'bg-white/90 shadow-sm backdrop-blur-xs' : ''
      }`}
    >
      {content}
    </div>
  );
};
