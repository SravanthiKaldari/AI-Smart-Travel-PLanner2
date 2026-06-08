import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { usePageTracker } from '@/hooks/useActivityTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TravelPlanner from '@/components/TravelPlanner';
import { 
  Plane, 
  Heart, 
  MapPin, 
  User, 
  LogOut,
  Navigation,
  Train
} from 'lucide-react';

interface DashboardStats {
  wishlistCount: number;
  trackedTrips: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ wishlistCount: 0, trackedTrips: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  usePageTracker('Dashboard');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        const [wishlistResult, trackingResult] = await Promise.all([
          supabase.from('wishlists').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('transport_tracking').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
        ]);
        
        setStats({
          wishlistCount: wishlistResult.count || 0,
          trackedTrips: trackingResult.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Smart Travel</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-foreground font-medium">Dashboard</Link>
            <Link to="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">Wishlist</Link>
            <Link to="/tracking" className="text-muted-foreground hover:text-foreground transition-colors">Tracking</Link>
            <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile">
                <User className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">Plan your next adventure with AI-powered recommendations.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wishlist Items</CardTitle>
              <Heart className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{stats.wishlistCount}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                <Link to="/wishlist" className="hover:underline">View all →</Link>
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Tracking</CardTitle>
              <Navigation className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{stats.trackedTrips}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                <Link to="/tracking" className="hover:underline">Track now →</Link>
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transport Info</CardTitle>
              <Train className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Live</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link to="/tracking" className="hover:underline">Check status →</Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Travel Planner Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Plan Your Next Trip
            </CardTitle>
            <CardDescription>
              Enter your preferences and let our AI find the perfect destinations for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TravelPlanner />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
