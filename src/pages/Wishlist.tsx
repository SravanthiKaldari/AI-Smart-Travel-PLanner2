import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { usePageTracker } from '@/hooks/useActivityTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plane, 
  Heart, 
  MapPin,
  Calendar,
  DollarSign,
  Trash2,
  LogOut,
  ArrowLeft,
  Navigation,
  User,
  Compass,
  Users
} from 'lucide-react';

interface WishlistItem {
  id: string;
  destination_name: string;
  estimated_budget: number | null;
  best_season: string | null;
  best_month: string | null;
  image_url: string | null;
  highlights: string[] | null;
  created_at: string;
}

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  usePageTracker('Wishlist');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setWishlist(data || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast({
          title: 'Error',
          description: 'Failed to load wishlist. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoadingWishlist(false);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user, toast]);

  const handleRemoveFromWishlist = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setWishlist(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Removed from wishlist',
        description: 'Destination has been removed from your wishlist.',
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove from wishlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartTracking = (item: WishlistItem) => {
    navigate('/tracking', { state: { selectedWishlistItem: item } });
  };

  const handleStartTrip = (item: WishlistItem) => {
    navigate('/trip-execution', { state: { wishlistItem: item } });
  };

  const handleCreateGroup = async (item: WishlistItem) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('travel_groups')
        .insert({
          destination_name: item.destination_name,
          wishlist_id: item.id,
          creator_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;

      // Add creator as admin member
      await supabase.from('group_members').insert({
        group_id: data.id,
        user_id: user.id,
        role: 'admin',
      });

      toast({ title: 'Group created!', description: 'Share the invite link with friends.' });
      navigate(`/group/${data.id}`);
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create group', variant: 'destructive' });
    }
  };

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
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/wishlist" className="text-foreground font-medium">Wishlist</Link>
            <Link to="/my-groups" className="text-muted-foreground hover:text-foreground transition-colors">Groups</Link>
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
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8 text-destructive" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-2">Your saved travel destinations</p>
          </div>
        </div>

        {loadingWishlist ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring destinations and add them to your wishlist!
              </p>
              <Button asChild>
                <Link to="/dashboard">Explore Destinations</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-card-hover transition-shadow">
                {item.image_url && (
                  <div className="relative h-48">
                    <img
                      src={item.image_url}
                      alt={item.destination_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-foreground">{item.destination_name}</h3>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-4 space-y-4">
                  {!item.image_url && (
                    <h3 className="text-xl font-bold">{item.destination_name}</h3>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    {item.estimated_budget && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>₹{item.estimated_budget.toLocaleString()}</span>
                      </div>
                    )}
                    {item.best_season && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{item.best_season}</span>
                      </div>
                    )}
                  </div>
                  
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.highlights.slice(0, 3).map((highlight, index) => (
                        <span
                          key={index}
                          className="text-xs bg-muted px-2 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStartTrip(item)}
                    >
                      <Compass className="w-4 h-4 mr-2" />
                      Start Trip
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreateGroup(item)}
                      title="Create Group Trip"
                    >
                      <Users className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartTracking(item)}
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={deletingId === item.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
