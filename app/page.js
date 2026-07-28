import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import FeaturedServices from '@/components/landing/FeaturedServices';
import HowItWorks from '@/components/landing/HowItWorks';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import FeaturedDestinations from '@/components/landing/FeaturedDestinations';
import FeaturedRiders from '@/components/landing/FeaturedRiders';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import AppPromotion from '@/components/landing/AppPromotion';
import FaqSection from '@/components/landing/FaqSection';
import NewsletterSection from '@/components/landing/NewsletterSection';

export const metadata = {
  title: 'RideWave — Premium Ride Sharing & Intercity Travel',
  description:
    'Book safe, affordable rides with verified drivers or earn money sharing your car or bike. Real-time GPS tracking, instant booking, and 24/7 support.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Landing Content */}
      <main className="grow">
        {/* 1. Hero Section & Glassmorphism Search */}
        <HeroSection />

        {/* 2. Scroll-Animated Statistics Counters */}
        <StatsSection />

        {/* 3. Featured Mobility Services */}
        <FeaturedServices />

        {/* 4. How RideWave Works (3 Steps) */}
        <HowItWorks />

        {/* 5. Why Choose RideWave (10 Core Features + Telemetry Mockup) */}
        <WhyChooseUs />

        {/* 6. Featured Routes & Destinations */}
        <FeaturedDestinations />

        {/* 7. Top Verified Drivers & Captains */}
        <FeaturedRiders />

        {/* 8. Testimonials Slider */}
        <TestimonialsSection />

        {/* 9. Mobile App Download Promotion */}
        <AppPromotion />

        {/* 10. Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* 11. Newsletter Subscription Box */}
        <NewsletterSection />
      </main>

      {/* Production Footer */}
      <Footer />
    </div>
  );
}
