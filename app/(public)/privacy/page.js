import PrivacyPolicyContent from '@/components/shared/PrivacyPolicyContent';

export const metadata = {
  title: 'Privacy Policy — RideWave Ride-Booking & Carpooling',
  description:
    'Read RideWave\'s official Privacy Policy. Learn how we collect, use, protect, and handle your personal data, Google OAuth information, GPS tracking, and ride history.',
  alternates: {
    canonical: 'https://ridewave.muzamal.site/app/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
