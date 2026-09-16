import React, { useState } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  QrCode,
  Globe,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  // The active public URL
  const publicUrl = 'https://3c6e58c821b0bc.lhr.life';
  const backupUrl = 'https://popular-tiger-45.loca.lt';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(publicUrl)}&bgcolor=0f172a&color=38bdf8`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Public link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SwasthyaSetu AI - Emergency Healthcare Platform',
          text: 'Explore SwasthyaSetu AI: Emergency rural healthcare continuity, 108 ambulance transit tracking, AI clinical triage, and multilingual referral network.',
          url: publicUrl,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopy();
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚨 *SwasthyaSetu AI* - Emergency Healthcare & Referral Network\n` +
      `Live mobile-accessible platform for Smart India Hackathon:\n\n` +
      `👉 Open directly: ${publicUrl}\n\n` +
      `✨ Features: Emergency Dark Theme, 108 Ambulance Strobe transitions, Telugu/Hindi localization, and ABDM Telemedicine.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-slate-100 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-950/80 text-teal-400 border border-teal-800">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-bold uppercase mb-1">
                <Globe className="w-3 h-3 text-teal-400" />
                <span>Live Public HTTPS Link</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">Share SwasthyaSetu AI</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice badge */}
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
          <Smartphone className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            Works on <strong>any smartphone, tablet, or PC</strong> over 4G/5G mobile data. No Wi-Fi required!
          </span>
        </div>

        {/* Primary URL box + Copy Button */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Direct Shareable URL
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-700">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-teal-300 font-mono font-medium select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/30"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* QR Code and Quick Share Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
          {/* QR Code Card */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-1.5 bg-slate-900 rounded-xl border border-slate-700">
              <img
                src={qrUrl}
                alt="Scan to open on Mobile"
                className="w-32 h-32 rounded-lg object-contain"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-teal-400" />
              <span>Scan with mobile phone camera</span>
            </p>
          </div>

          {/* Share Actions */}
          <div className="space-y-2.5">
            <button
              onClick={shareWhatsApp}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-teal-400" />
              <span>Mobile Share Sheet</span>
            </button>

            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              <span>Open in New Tab</span>
            </a>
          </div>
        </div>

        {/* Backup Tunnel Info */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Backup mirror: <code className="text-teal-400">{backupUrl}</code></span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">IP: 103.159.249.240</span>
        </div>
      </div>
    </div>
  );
};
