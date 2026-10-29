import HelpPageClient from '@/components/help/HelpPageClient';

export const metadata = {
  title: 'Help & Support — RideWave Customer Care',
  description:
    'Get fast assistance with RideWave ride bookings, payments, driver standards, account security, and technical issues. Browse our knowledge base or submit a support request.',
  openGraph: {
    title: 'RideWave Help & Customer Support',
    description:
      'Find answers to common questions about booking rides, driver verification, fares, and safety on RideWave.',
    url: 'https://ridewave.muzamal.site/help',
    siteName: 'RideWave',
  },
};

export default function HelpPage() {
  return <HelpPageClient />;
}
