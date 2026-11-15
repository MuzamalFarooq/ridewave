import HowItWorks from '@/components/landing/HowItWorks';
import TrustBenefits from '@/components/landing/TrustBenefits';
import PublicCta from '@/components/landing/PublicCta';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'How It Works — RideWave Smart Mobility',
  description:
    'Learn how RideWave simplifies intercity travel and ride sharing. Follow our 3-step process from booking to live GPS journey completion.',
  openGraph: {
    title: 'How RideWave Works',
    description: 'Seamless journey from seat selection to destination with verified drivers.',
    url: 'https://ridewave.muzamal.site/how-it-works',
    siteName: 'RideWave',
  },
};

export default function HowItWorksPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-gradient-to-b from-[#102F28] via-[#173F35] to-[#102F28] text-white overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6A76B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#102F28]/80 border border-[#23584B] text-xs font-semibold text-[#C6A76B] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effortless Travel Process</span>
          </div>
          <h1 className="font-outfit font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#F8F6F0] tracking-tight">
            How RideWave Works
          </h1>
          <p className="text-base sm:text-lg text-[#DCE7DF] max-w-2xl mx-auto font-normal leading-relaxed">
            Discover how easy it is to schedule, book, and enjoy comfortable shared rides with verified drivers across Pakistan.
          </p>
        </div>
      </section>

      {/* Core Steps */}
      <HowItWorks />

      {/* Trust & Safety Benefits */}
      <TrustBenefits />

      {/* Public Closing CTA */}
      <PublicCta />
    </div>
  );
}
