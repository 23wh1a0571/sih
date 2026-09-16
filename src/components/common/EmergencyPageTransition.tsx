import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

interface EmergencyPageTransitionProps {
  children: React.ReactNode;
}

export const EmergencyPageTransition: React.FC<EmergencyPageTransitionProps> = ({ children }) => {
  const { currentView } = useApp();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayView, setDisplayView] = useState(currentView);

  useEffect(() => {
    if (currentView !== displayView) {
      setIsTransitioning(true);
      setDisplayView(currentView);

      // Fast, non-blocking 300ms emergency strobe flash transition
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentView, displayView]);

  return (
    <div className="relative w-full">
      {/* Top Emergency Ambulance Strobe Light Bar during page transitions */}
      {isTransitioning && (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1.5 overflow-hidden flex">
          {/* Left Red Strobe Flash */}
          <div className="flex-1 bg-gradient-to-r from-rose-600 via-rose-500 to-transparent animate-strobe-red shadow-lg shadow-rose-500/80" />
          {/* Center Beacon Flare */}
          <div className="w-16 bg-white blur-xs animate-ping" />
          {/* Right Blue Strobe Flash */}
          <div className="flex-1 bg-gradient-to-l from-blue-600 via-blue-500 to-transparent animate-strobe-blue shadow-lg shadow-blue-500/80" />

          {/* Top Ambient Glow Sweep */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/20 via-blue-500/20 to-transparent h-16 pointer-events-none blur-md animate-emergency-halo" />
        </div>
      )}

      {/* Page Content Container with Smooth Inward Fade */}
      <div
        key={displayView}
        className="w-full animate-in fade-in-80 slide-in-from-bottom-2 duration-200 transition-opacity"
      >
        {children}
      </div>
    </div>
  );
};
