import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/landing/HeroSection';
import TrustBenefits from '@/components/landing/TrustBenefits';
import HowItWorks from '@/components/landing/HowItWorks';
import VehicleCategories from '@/components/landing/VehicleCategories';
import DriverCta from '@/components/landing/DriverCta';
import FaqSection from '@/components/landing/FaqSection';
import PublicCta from '@/components/landing/PublicCta';

export const metadata = {
  title: 'RideWave — Premium Ride Booking & Shared Mobility',
  description:
    'Experience comfortable rides with verified drivers. Real-time GPS tracking, transparent seat pricing, and scheduled journeys on RideWave.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#102F28] text-[#242824] dark:text-[#F8F6F0] flex flex-col font-sans selection:bg-[#173F35] selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Public Content */}
      <main className="grow">
        {/* 1. Hero Section & Quick Ride Booking Panel */}
        <HeroSection />

        {/* 2. Trust and Service Benefits */}
        <TrustBenefits />

        {/* 3. How RideWave Works (3 Steps) */}
        <HowItWorks />

        {/* 4. Supported Vehicle Categories */}
        <VehicleCategories />

        {/* 5. Driver Community & Onboarding Callout */}
        <DriverCta />

        {/* 6. Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* 7. Public Closing Call to Action */}
        <PublicCta />
      </main>

      {/* Production Footer */}
      <Footer />
    </div>
  );
}
