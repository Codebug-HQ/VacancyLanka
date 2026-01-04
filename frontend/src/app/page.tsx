
import HeroSlider from '@/components/home/HeroSlider';
import DestinationGrid from '@/components/home/DestinationGrid';
import PackagesGrid from '@/components/home/PackagesGrid';
import ActivitiesGrid from '@/components/home/ActivitiesGrid';
import VehiclesSection from '@/components/home/VehiclesSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/shared/Footer';
import Chatbot from '@/components/shared/Chatbot';

export default function Home() {
  return (
    <>
      <section id="hero">
        <HeroSlider />
      </section>
      <section id="vehicles" className="py-24 px-6 bg-white">
        <VehiclesSection />
      </section>
      <section id="packages" className="py-24 px-6 bg-gray-50">
        <PackagesGrid />
      </section>
      <section id="activities" className="py-24 px-6 bg-white">
        <ActivitiesGrid />
      </section>
      <section id="gallery" className="py-24 px-6 bg-gray-50">
        <DestinationGrid />
      </section>
      <section id="contact" className="py-24 px-6 bg-white overflow-hidden">
        <ContactSection />
      </section>

      <Chatbot />
      <Footer />
    </>
  );
}