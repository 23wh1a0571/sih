import { useState, useEffect } from 'react';

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeGreetingInfo {
  greeting: string;
  timeString: string;
  timeWithSeconds: string;
  dateString: string;
  period: TimePeriod;
  shiftLabel: string;
  accentGradient: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
}

export function getTimeGreetingInfo(now: Date = new Date()): TimeGreetingInfo {
  const hours = now.getHours();

  let period: TimePeriod;
  let greeting: string;
  let shiftLabel: string;
  let accentGradient: string;
  let textColor: string;
  let badgeBg: string;
  let badgeBorder: string;

  if (hours >= 5 && hours < 12) {
    period = 'morning';
    greeting = 'Good Morning';
    shiftLabel = 'Morning Health Roster';
    accentGradient = 'from-amber-500 to-orange-400';
    textColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/10';
    badgeBorder = 'border-amber-400/30';
  } else if (hours >= 12 && hours < 17) {
    period = 'afternoon';
    greeting = 'Good Afternoon';
    shiftLabel = 'Afternoon Clinical Shift';
    accentGradient = 'from-yellow-500 to-amber-500';
    textColor = 'text-yellow-400';
    badgeBg = 'bg-yellow-500/10';
    badgeBorder = 'border-yellow-400/30';
  } else if (hours >= 17 && hours < 21) {
    period = 'evening';
    greeting = 'Good Evening';
    shiftLabel = 'Evening Triage Shift';
    accentGradient = 'from-orange-500 to-rose-400';
    textColor = 'text-orange-400';
    badgeBg = 'bg-orange-500/10';
    badgeBorder = 'border-orange-400/30';
  } else {
    period = 'night';
    greeting = 'Good Night';
    shiftLabel = 'Night Emergency Duty';
    accentGradient = 'from-indigo-500 to-sky-400';
    textColor = 'text-indigo-300';
    badgeBg = 'bg-indigo-500/10';
    badgeBorder = 'border-indigo-400/30';
  }

  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const timeWithSeconds = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    greeting,
    timeString,
    timeWithSeconds,
    dateString,
    period,
    shiftLabel,
    accentGradient,
    textColor,
    badgeBg,
    badgeBorder,
  };
}

export function useTimeGreeting(): TimeGreetingInfo {
  const [timeInfo, setTimeInfo] = useState<TimeGreetingInfo>(() => getTimeGreetingInfo());

  useEffect(() => {
    // Tick every second to ensure live precision and instant period shift
    const interval = setInterval(() => {
      setTimeInfo(getTimeGreetingInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeInfo;
}
