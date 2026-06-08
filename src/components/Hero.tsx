import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-travel.jpg';

const Hero = () => {
  const scrollToPlanner = () => {
    const element = document.getElementById('planner');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful travel destination with beaches and mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center text-white py-32">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Travel Planning</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Perfect Trip
            <br />
            <span className="text-accent">Starts Here</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Get personalized destination recommendations, cost breakdowns, and day-wise itineraries
            based on your budget, interests, and schedule.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={scrollToPlanner}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6"
            >
              Start Planning
            </Button>
            <Button
              onClick={() => {
                const element = document.getElementById('about');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <MapPin className="h-8 w-8 mb-4 mx-auto text-accent" />
              <h3 className="font-semibold text-lg mb-2">Smart Destinations</h3>
              <p className="text-sm text-white/80">AI recommends the best places within your budget</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <Calendar className="h-8 w-8 mb-4 mx-auto text-accent" />
              <h3 className="font-semibold text-lg mb-2">Custom Itinerary</h3>
              <p className="text-sm text-white/80">Day-wise plans tailored to your preferences</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <Sparkles className="h-8 w-8 mb-4 mx-auto text-accent" />
              <h3 className="font-semibold text-lg mb-2">Cost Breakdown</h3>
              <p className="text-sm text-white/80">Transparent pricing for travel, stay, and food</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
