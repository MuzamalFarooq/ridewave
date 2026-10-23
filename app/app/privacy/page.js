import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import PrivacyPolicyContent from '@/components/shared/PrivacyPolicyContent';

export const metadata = {
  title: 'Privacy Policy — RideWave Ride-Booking & Carpooling',
  description:
    'Read RideWave\'s official Privacy Policy. Learn how we collect, use, protect, and handle your personal data, Google OAuth information, GPS tracking, and ride history.',
  alternates: {
    canonical: 'https://ridewave.muzamal.site/app/privacy',
  },
  openGraph: {
    title: 'Privacy Policy — RideWave',
    description:
      'Transparency and trust at RideWave. Learn how we protect your personal information, Google user data, and location privacy.',
    url: 'https://ridewave.muzamal.site/app/privacy',
    siteName: 'RideWave',
  },
};

export default function AppPrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Navbar />
      <main className="flex-1">
        <PrivacyPolicyContent />
      </main>
      <Footer />
    </div>
  );
}
