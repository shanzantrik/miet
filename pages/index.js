import HeroSection from '../components/HeroSection';
import CTACountdown from '../components/CTACountdown';
import AboutSection from '../components/AboutSection';
import BrowseConsultantsSection from '../components/BrowseConsultantsSection';
import FeaturedProducts from '../components/FeaturedProducts';
import UpcomingEvents from '../components/UpcomingEvents';
import Partners from '../components/Partners';
import Testimonials from '../components/Testimonials';
import ConsultantOnboardingForm from '../components/ConsultantOnboardingForm';
import BlogSection from '../components/BlogSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <BrowseConsultantsSection />
      <CTACountdown />
      <FeaturedProducts />
      <UpcomingEvents />
      <Partners />
      <Testimonials />
      <ConsultantOnboardingForm />
      <BlogSection />
      <Footer />
    </>
  );
}
