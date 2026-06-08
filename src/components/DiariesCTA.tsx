import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, PenLine, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DiariesCTA = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Left: Decorative icons */}
          <div className="flex-shrink-0 relative w-48 h-48 hidden md:flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-10 animate-pulse-glow" />
            <BookOpen className="h-20 w-20 text-primary relative z-10" />
            <PenLine className="absolute top-2 right-2 h-8 w-8 text-accent" />
            <Camera className="absolute bottom-4 left-2 h-8 w-8 text-secondary" />
          </div>

          {/* Right: Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Wanderlust Chronicles
            </h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-lg">
              Share your travel photos, stories, and hidden gems with a community of fellow explorers. Your next adventure starts with someone else's story.
            </p>
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 gap-2 text-base">
              <Link to="/diaries">
                Explore Stories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiariesCTA;
