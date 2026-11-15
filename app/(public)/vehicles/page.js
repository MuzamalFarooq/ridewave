import VehicleCategories from '@/components/landing/VehicleCategories';
import DriverCta from '@/components/landing/DriverCta';
import PublicCta from '@/components/landing/PublicCta';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Vehicles & Fleet Options — RideWave',
  description:
    'Explore the RideWave fleet: Comfort Cars, Solo Bikes, Spacious Vans, and Group Buses. Certified vehicles for every distance and group size.',
  openGraph: {
    title: 'RideWave Vehicles & Fleet',
    description: 'Comfort Cars, Solo Bikes, Spacious Vans, and Group Buses for safe transit.',
    url: 'https://ridewave.muzamal.site/vehicles',
    siteName: 'RideWave',
  },
};

export default function VehiclesPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-gradient-to-b from-[#102F28] via-[#173F35] to-[#102F28] text-white overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6A76B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#102F28]/80 border border-[#23584B] text-xs font-semibold text-[#C6A76B] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fleet Categories</span>
          </div>
          <h1 className="font-outfit font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#F8F6F0] tracking-tight">
            Our Supported Vehicles
          </h1>
          <p className="text-base sm:text-lg text-[#DCE7DF] max-w-2xl mx-auto font-normal leading-relaxed">
            From agile solo motorbikes for city rush hours to spacious vans and luxury sedans for intercity highway journeys.
          </p>
        </div>
      </section>

      {/* Vehicle Categories Showcase */}
      <VehicleCategories />

      {/* Driver Onboarding Callout */}
      <DriverCta />

      {/* Public Closing CTA */}
      <PublicCta />
    </div>
  );
}
