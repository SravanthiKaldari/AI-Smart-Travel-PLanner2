import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Plane, 
  Navigation,
  Train,
  Bus,
  Car,
  Clock,
  MapPin,
  LogOut,
  ArrowLeft,
  User,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface WishlistItem {
  id: string;
  destination_name: string;
  estimated_budget: number | null;
  coordinates: { lat: number; lng: number } | null;
}

const parseCoordinates = (coords: unknown): { lat: number; lng: number } | null => {
  if (coords && typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
    return coords as { lat: number; lng: number };
  }
  return null;
};

interface TransportTracking {
  id: string;
  transport_type: string;
  status: string;
  estimated_arrival: string | null;
  route_overview: string | null;
  wishlist_id: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const Tracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [selectedWishlistId, setSelectedWishlistId] = useState<string>('');
  const [transportTracking, setTransportTracking] = useState<TransportTracking | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [trackingLocation, setTrackingLocation] = useState(false);
  const [creatingTransport, setCreatingTransport] = useState(false);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const destinationMarker = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Handle passed wishlist item from navigation
  useEffect(() => {
    const passedItem = location.state?.selectedWishlistItem;
    if (passedItem) {
      setSelectedWishlistId(passedItem.id);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('id, destination_name, estimated_budget, coordinates')
          .eq('user_id', user.id);
        
        if (error) throw error;
        const parsed = (data || []).map(item => ({
          ...item,
          coordinates: parseCoordinates(item.coordinates),
        }));
        setWishlistItems(parsed);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  useEffect(() => {
    const fetchTransportTracking = async () => {
      if (!user || !selectedWishlistId) {
        setTransportTracking(null);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('transport_tracking')
          .select('*')
          .eq('user_id', user.id)
          .eq('wishlist_id', selectedWishlistId)
          .maybeSingle();
        
        if (error) throw error;
        setTransportTracking(data);
      } catch (error) {
        console.error('Error fetching transport tracking:', error);
      }
    };

    fetchTransportTracking();
  }, [user, selectedWishlistId]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !selectedWishlistId) return;

    const selectedItem = wishlistItems.find(item => item.id === selectedWishlistId);
    const coords = selectedItem?.coordinates;
    
    // Initialize map with OpenStreetMap tiles
    const center: L.LatLngExpression = coords 
      ? [coords.lat, coords.lng] 
      : [20.5937, 78.9629]; // Default to India center (Leaflet uses [lat, lng])
    
    map.current = L.map(mapContainer.current).setView(center, coords ? 10 : 4);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add zoom control
    map.current.zoomControl.setPosition('topright');

    // Add destination marker if coordinates exist
    if (coords) {
      const destIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: #ef4444; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">📍</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
      
      destinationMarker.current = L.marker([coords.lat, coords.lng], { icon: destIcon })
        .bindPopup(selectedItem?.destination_name || 'Destination')
        .addTo(map.current);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [selectedWishlistId, wishlistItems]);

  // Update user marker and draw blue route line when location changes
  useEffect(() => {
    if (!map.current || !userLocation) return;

    const userIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="position:relative;">
        <div style="background: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(66,133,244,0.5);"></div>
        <div style="position:absolute;top:-2px;left:-2px;width:24px;height:24px;border-radius:50%;border:2px solid #4285F4;animation:routePing 1.5s infinite;opacity:0.4;"></div>
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    if (userMarker.current) {
      userMarker.current.setLatLng([userLocation.latitude, userLocation.longitude]);
    } else {
      userMarker.current = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon, zIndexOffset: 1000 })
        .bindPopup(`<b>📍 You are here</b><br/>Accuracy: ±${userLocation.accuracy.toFixed(0)}m`)
        .addTo(map.current);
    }

    // Accuracy circle
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setLatLng([userLocation.latitude, userLocation.longitude]);
      accuracyCircleRef.current.setRadius(userLocation.accuracy);
    } else {
      accuracyCircleRef.current = L.circle([userLocation.latitude, userLocation.longitude], {
        radius: userLocation.accuracy,
        color: '#4285F4',
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(map.current);
    }

    // Draw blue route line from user to destination
    const selectedItem = wishlistItems.find(item => item.id === selectedWishlistId);
    const destCoords = selectedItem?.coordinates;
    if (destCoords) {
      if (routeLineRef.current) {
        map.current.removeLayer(routeLineRef.current);
      }
      
      // Create a curved route with intermediate points for a more realistic path
      const userLatLng: L.LatLngExpression = [userLocation.latitude, userLocation.longitude];
      const destLatLng: L.LatLngExpression = [destCoords.lat, destCoords.lng];
      
      // Generate smooth curve points
      const points: L.LatLngExpression[] = [];
      const steps = 50;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = userLocation.latitude + (destCoords.lat - userLocation.latitude) * t;
        const lng = userLocation.longitude + (destCoords.lng - userLocation.longitude) * t;
        // Add slight curve
        const offset = Math.sin(t * Math.PI) * 0.5;
        points.push([lat + offset * 0.1, lng]);
      }

      routeLineRef.current = L.polyline(points, {
        color: '#4285F4',
        weight: 5,
        opacity: 0.8,
        smoothFactor: 1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map.current);

      // Add a dashed overlay for Google Maps effect
      L.polyline(points, {
        color: '#ffffff',
        weight: 2,
        opacity: 0.4,
        dashArray: '10 15',
        smoothFactor: 1,
      }).addTo(map.current);

      // Fit bounds to show both markers
      const bounds = L.latLngBounds([userLatLng, destLatLng]);
      map.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [userLocation, selectedWishlistId, wishlistItems]);

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation.',
        variant: 'destructive',
      });
      return;
    }

    setTrackingLocation(true);

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setUserLocation(newLocation);

        // Save to database
        if (user) {
          try {
            await supabase.from('user_locations').insert({
              user_id: user.id,
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
              accuracy: newLocation.accuracy,
            });
          } catch (error) {
            console.error('Error saving location:', error);
          }
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: 'Location error',
          description: 'Failed to get your location. Please enable location services.',
          variant: 'destructive',
        });
        setTrackingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  const createTransportTracking = async (transportType: string) => {
    if (!user || !selectedWishlistId) return;

    setCreatingTransport(true);
    try {
      const estimatedArrival = new Date();
      estimatedArrival.setHours(estimatedArrival.getHours() + Math.floor(Math.random() * 12) + 2);

      const { data, error } = await supabase
        .from('transport_tracking')
        .insert({
          user_id: user.id,
          wishlist_id: selectedWishlistId,
          transport_type: transportType,
          status: 'on_time',
          estimated_arrival: estimatedArrival.toISOString(),
          route_overview: `Direct route to ${wishlistItems.find(i => i.id === selectedWishlistId)?.destination_name}`,
        })
        .select()
        .single();

      if (error) throw error;

      setTransportTracking(data);
      toast({
        title: 'Transport tracking created',
        description: `${transportType} tracking has been set up for your trip.`,
      });
    } catch (error) {
      console.error('Error creating transport tracking:', error);
      toast({
        title: 'Error',
        description: 'Failed to create transport tracking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreatingTransport(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getTransportIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'train':
        return <Train className="w-5 h-5" />;
      case 'bus':
        return <Bus className="w-5 h-5" />;
      case 'flight':
        return <Plane className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_time':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'arrived':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
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
            <Link to="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">Wishlist</Link>
            <Link to="/tracking" className="text-foreground font-medium">Tracking</Link>
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Navigation className="w-8 h-8 text-primary" />
            Live Tracking
          </h1>
          <p className="text-muted-foreground mt-2">Track your location and transport for wishlist destinations</p>
        </div>

        {loadingData ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        ) : wishlistItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No destinations to track</h2>
              <p className="text-muted-foreground mb-6">
                Add destinations to your wishlist to start tracking.
              </p>
              <Button asChild>
                <Link to="/dashboard">Explore Destinations</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Destination Selection & Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Select Destination
                </CardTitle>
                <CardDescription>Choose a wishlist destination to track</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedWishlistId} onValueChange={setSelectedWishlistId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {wishlistItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.destination_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedWishlistId && (
                  <>
                    <div ref={mapContainer} className="h-64 rounded-lg overflow-hidden" />
                    <style>{`
                      @keyframes routePing {
                        0% { transform: scale(1); opacity: 0.4; }
                        100% { transform: scale(2.5); opacity: 0; }
                      }
                    `}</style>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={startLocationTracking}
                        disabled={trackingLocation}
                        className="flex-1"
                      >
                        {trackingLocation ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Tracking...
                          </>
                        ) : (
                          <>
                            <Navigation className="w-4 h-4 mr-2" />
                            Start Location Tracking
                          </>
                        )}
                      </Button>
                    </div>

                    {userLocation && (
                      <div className="p-3 bg-muted rounded-lg text-sm">
                        <p className="font-medium">Your Location:</p>
                        <p className="text-muted-foreground">
                          Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
                        </p>
                        <p className="text-muted-foreground">Accuracy: ±{userLocation.accuracy.toFixed(0)}m</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Transport Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Train className="w-5 h-5" />
                  Transport Tracking
                </CardTitle>
                <CardDescription>
                  {selectedWishlistId 
                    ? 'Set up and track your transport' 
                    : 'Select a destination first to set up transport tracking'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedWishlistId ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Train className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a destination to view transport options</p>
                  </div>
                ) : transportTracking ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransportIcon(transportTracking.transport_type)}
                        <div>
                          <p className="font-medium capitalize">{transportTracking.transport_type}</p>
                          <p className="text-sm text-muted-foreground">{transportTracking.route_overview}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transportTracking.status)}
                        <span className="text-sm capitalize">{transportTracking.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {transportTracking.estimated_arrival && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Estimated arrival: {new Date(transportTracking.estimated_arrival).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      No transport tracking set up. Choose your transport type:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {['Train', 'Bus', 'Flight', 'Car'].map((type) => (
                        <Button
                          key={type}
                          variant="outline"
                          onClick={() => createTransportTracking(type)}
                          disabled={creatingTransport}
                          className="flex items-center gap-2"
                        >
                          {getTransportIcon(type)}
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tracking;
