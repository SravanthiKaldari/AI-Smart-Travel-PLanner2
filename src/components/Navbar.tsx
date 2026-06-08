import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Plane, LogIn, BookOpen, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
      setIsAdmin(!!data);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-card/95 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Plane className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">TravelAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('planner')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Plan Trip
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
            <Link
              to="/diaries"
              className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
            >
              <BookOpen className="h-4 w-4" />
              Diaries
            </Link>
            {isAdmin && (
              <Link
                to="/admin-portal"
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
            {isLoggedIn ? (
              <Button asChild className="bg-gradient-gold hover:opacity-90 transition-opacity">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild className="bg-gradient-gold hover:opacity-90 transition-opacity">
                <Link to="/auth"><LogIn className="w-4 h-4 mr-2" />Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-card rounded-lg mt-2 shadow-lg animate-fade-in">
            <div className="flex flex-col gap-4 px-4">
              <button
                onClick={() => scrollToSection('home')}
                className="text-foreground hover:text-primary transition-colors font-medium text-left py-2"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('planner')}
                className="text-foreground hover:text-primary transition-colors font-medium text-left py-2"
              >
                Plan Trip
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-foreground hover:text-primary transition-colors font-medium text-left py-2"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('team')}
                className="text-foreground hover:text-primary transition-colors font-medium text-left py-2"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-foreground hover:text-primary transition-colors font-medium text-left py-2"
              >
                Contact
              </button>
              <Link
                to="/diaries"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors font-medium text-left py-2 flex items-center gap-1"
              >
                <BookOpen className="h-4 w-4" />
                Diaries
              </Link>
              {isAdmin && (
                <Link
                  to="/admin-portal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground hover:text-primary transition-colors font-medium text-left py-2 flex items-center gap-1"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              )}
              {isLoggedIn ? (
                <Button asChild className="bg-gradient-gold hover:opacity-90 transition-opacity w-full">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                </Button>
              ) : (
                <Button asChild className="bg-gradient-gold hover:opacity-90 transition-opacity w-full">
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <LogIn className="w-4 h-4 mr-2" />Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
