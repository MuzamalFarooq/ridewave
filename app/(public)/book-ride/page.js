import { Suspense } from 'react';
import UnifiedBookingClient from '@/components/booking/UnifiedBookingClient';

export const metadata = {
  title: 'Book a Ride — RideWave',
  description:
    'Map-first inDrive-inspired ride booking on RideWave. Set pickup and drop-off, propose fair fares, and connect with verified drivers.',
  openGraph: {
    title: 'Book a Ride — RideWave Mobility',
    description: 'Map-first interactive ride booking.',
    url: 'https://ridewave.muzamal.site/book-ride',
    siteName: 'RideWave',
  },
};

export default function BookRidePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center bg-[#102F28] text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173F35] border border-[#C6A76B] flex items-center justify-center text-[#C6A76B] font-bold animate-pulse">
              RW
            </div>
            <p className="text-sm font-medium text-slate-300">Loading Map Experience...</p>
          </div>
        </div>
      }
    >
      <UnifiedBookingClient />
    </Suspense>
  );
}

