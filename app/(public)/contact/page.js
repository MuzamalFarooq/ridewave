import HelpPageClient from '@/components/help/HelpPageClient';

export const metadata = {
  title: 'Contact Support — RideWave',
  description:
    'Need assistance with your RideWave journey or driver account? Contact our dedicated support team or browse our verified help articles.',
  openGraph: {
    title: 'Contact RideWave Customer Support',
    description:
      'Submit a support request, explore help articles, and resolve booking or payment inquiries on RideWave.',
    url: 'https://ridewave.muzamal.site/contact',
    siteName: 'RideWave',
  },
};

export default function ContactPage() {
  return <HelpPageClient />;
}
