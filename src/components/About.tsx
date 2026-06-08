import { Card, CardContent } from '@/components/ui/card';
import { Brain, Target, Zap, Shield } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Our advanced algorithms analyze your preferences, budget, and interests to suggest the most suitable destinations.',
    },
    {
      icon: Target,
      title: 'Personalized Recommendations',
      description: 'Every suggestion is tailored to your unique travel style, ensuring you get the perfect trip within your budget.',
    },
    {
      icon: Zap,
      title: 'Instant Planning',
      description: 'Get comprehensive travel plans with cost breakdowns and itineraries in seconds, not hours.',
    },
    {
      icon: Shield,
      title: 'Budget-Friendly',
      description: 'We ensure all recommendations stay within your specified budget while maximizing your travel experience.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About TravelAI</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            We leverage artificial intelligence to transform how you plan your travels. Our platform analyzes thousands
            of data points to deliver personalized destination recommendations, accurate cost estimates, and detailed
            itineraries that match your preferences perfectly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-none"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-primary p-3 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="shadow-card bg-gradient-primary text-primary-foreground border-none">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div>
                  <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Enter Details</h4>
                  <p className="text-sm text-primary-foreground/90">
                    Share your budget, travel duration, and interests
                  </p>
                </div>
                <div>
                  <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">AI Analysis</h4>
                  <p className="text-sm text-primary-foreground/90">
                    Our AI processes your inputs and finds perfect matches
                  </p>
                </div>
                <div>
                  <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Get Results</h4>
                  <p className="text-sm text-primary-foreground/90">
                    Receive detailed recommendations and itineraries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
