import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NearbySpots from '@/components/NearbySpots';
import MonthlyDestinations from '@/components/MonthlyDestinations';
import TravelPlanner from '@/components/TravelPlanner';
import DiariesCTA from '@/components/DiariesCTA';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <NearbySpots />
      <MonthlyDestinations />
      <TravelPlanner />
      <DiariesCTA />
      <About />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
