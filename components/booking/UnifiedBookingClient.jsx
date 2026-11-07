'use client';

import { useState, useEffect } from 'react';
import { useBookingEngine } from './useBookingEngine';
import MobileBookingExperience from './MobileBookingExperience';
import DesktopBookingExperience from './DesktopBookingExperience';

export default function UnifiedBookingClient() {
  const engine = useBookingEngine();
  const [isDesktop, setIsDesktop] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const updateMatches = () => setIsDesktop(mq.matches);

    updateMatches();

    mq.addEventListener('change', updateMatches);
    return () => mq.removeEventListener('change', updateMatches);
  }, []);

  if (isDesktop === null) {
    return (
      <div className="w-full h-screen min-h-[600px] flex items-center justify-center bg-[#102F28] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#173F35] border border-[#C6A76B] flex items-center justify-center text-[#C6A76B] font-bold animate-pulse">
            RW
          </div>
          <p className="text-xs font-semibold text-slate-300 tracking-wide">Loading RideWave Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[100dvh]">
      {isDesktop ? (
        <DesktopBookingExperience engine={engine} />
      ) : (
        <MobileBookingExperience engine={engine} />
      )}
    </div>
  );
}
