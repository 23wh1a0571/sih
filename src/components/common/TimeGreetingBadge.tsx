import React from 'react';
import { useTimeGreeting } from '../../hooks/useTimeGreeting';
import { useTranslation } from '../../hooks/useTranslation';
import { Sunrise, Sun, Sunset, Moon, Clock } from 'lucide-react';

interface TimeGreetingBadgeProps {
  variant?: 'compact' | 'full' | 'navbar' | 'dashboard';
  showSeconds?: boolean;
  className?: string;
  userName?: string;
}

export const TimeGreetingBadge: React.FC<TimeGreetingBadgeProps> = ({
  variant = 'compact',
  showSeconds = false,
  className = '',
  userName,
}) => {
  const {
    timeString,
    timeWithSeconds,
    dateString,
    period,
    textColor,
    badgeBg,
    badgeBorder,
  } = useTimeGreeting();

  const { t } = useTranslation();

  const getTranslatedGreeting = () => {
    switch (period) {
      case 'morning':
        return t('greeting_morning');
      case 'afternoon':
        return t('greeting_afternoon');
      case 'evening':
        return t('greeting_evening');
      case 'night':
        return t('greeting_night');
    }
  };

  const getTranslatedShift = () => {
    switch (period) {
      case 'morning':
        return t('shift_morning');
      case 'afternoon':
        return t('shift_afternoon');
      case 'evening':
        return t('shift_evening');
      case 'night':
        return t('shift_night');
    }
  };

  const greeting = getTranslatedGreeting();
  const shiftLabel = getTranslatedShift();

  const getPeriodIcon = () => {
    switch (period) {
      case 'morning':
        return <Sunrise className="w-3.5 h-3.5 text-amber-400 animate-pulse" />;
      case 'afternoon':
        return <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />;
      case 'evening':
        return <Sunset className="w-3.5 h-3.5 text-orange-400" />;
      case 'night':
        return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  if (variant === 'navbar') {
    return (
      <div
        className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-800/80 backdrop-blur-md border-slate-700 shadow-inner text-xs font-medium text-slate-200 select-none ${className}`}
        title={`Live Clinical Clock • ${greeting} • ${shiftLabel}`}
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-slate-900 border border-slate-700">
          {getPeriodIcon()}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-100">{greeting}</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-[11px] font-bold text-teal-400">
            {showSeconds ? timeWithSeconds : timeString}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div
        className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border backdrop-blur-md shadow-md ${badgeBg} ${badgeBorder} ${className}`}
      >
        <div className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center border border-white/10">
          {getPeriodIcon()}
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${textColor}`}>
              {userName ? `${greeting}, ${userName}` : greeting}
            </span>
            <span className="text-white/30 text-[10px]">|</span>
            <span className="text-[11px] font-mono font-semibold text-white">
              {showSeconds ? timeWithSeconds : timeString}
            </span>
          </div>
          <p className="text-[10px] text-white/70 font-medium leading-none">
            {dateString} • {shiftLabel}
          </p>
        </div>
      </div>
    );
  }

  // Full / Default Variant
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-900/90 border-slate-700 text-xs ${className}`}
    >
      {getPeriodIcon()}
      <span className={`font-semibold ${textColor}`}>{greeting}</span>
      <span className="text-slate-600">|</span>
      <Clock className="w-3 h-3 text-slate-400" />
      <span className="font-mono font-bold text-teal-300">
        {showSeconds ? timeWithSeconds : timeString}
      </span>
    </div>
  );
};
