'use client';

import { useBookingEngine } from './useBookingEngine';
import MobileBookingExperience from './MobileBookingExperience';
import DesktopBookingExperience from './DesktopBookingExperience';

export default function UnifiedBookingClient() {
  const engine = useBookingEngine();

  return (
    <div className="w-full h-full">
      {/* Mobile Experience (< 1024px): Map-first inDrive-inspired design */}
      <div className="block lg:hidden w-full h-full">
        <MobileBookingExperience engine={engine} />
      </div>

      {/* Desktop Experience (>= 1024px): Professional 3-Section Dashboard */}
      <div className="hidden lg:block w-full h-full">
        <DesktopBookingExperience engine={engine} />
      </div>
    </div>
  );
}
