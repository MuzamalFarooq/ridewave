import HelpPageClient from '@/components/help/HelpPageClient';

export const metadata = {
  title: 'Frequently Asked Questions (FAQ) — RideWave',
  description:
    'Explore verified answers to frequently asked questions about booking rides, driver registration, real-time tracking, payments, and safety on RideWave.',
  openGraph: {
    title: 'RideWave FAQs — Questions & Answers',
    description:
      'Everything you need to know about booking rides, driver standards, fares, and safety on RideWave.',
    url: 'https://ridewave.muzamal.site/faq',
    siteName: 'RideWave',
  },
};

export default function FaqPage() {
  return <HelpPageClient />;
}
