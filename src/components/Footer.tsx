import { Plane, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-gradient">TravelAI</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-destructive fill-destructive" />
            <span>by Team TravelAI</span>
          </div>

          <div className="text-sm text-muted-foreground">
            © {currentYear} TravelAI. All rights reserved.
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>AI-Powered Smart Travel Planner</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
