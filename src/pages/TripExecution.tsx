import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/useAuth';
import { usePageTracker, trackActivity } from '@/hooks/useActivityTracker';
import { getDestinationExecutionData, type DestinationExecutionData, type NearbyStation } from '@/lib/tripExecutionData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plane, Train, Bus, ArrowLeft, MapPin, Hotel, Utensils,
  Navigation, Star, CheckCircle2, Circle, ChevronRight,
  Compass, Package, LogOut, User, Clock, DollarSign, Wifi,
  Mountain, ShoppingBag, Landmark
} from 'lucide-react';

interface WishlistItem {
  id: string;
  destination_name: string;
  estimated_budget: number | null;
  best_season: string | null;
  best_month: string | null;
  image_url: string | null;
  highlights: string[] | null;
}

const transportIcons: Record<string, React.ReactNode> = {
  flight: <Plane className="w-5 h-5" />,
  train: <Train className="w-5 h-5" />,
  bus: <Bus className="w-5 h-5" />,
};

const attractionIcons: Record<string, React.ReactNode> = {
  Waterfall: <Mountain className="w-4 h-4" />,
  Heritage: <Landmark className="w-4 h-4" />,
  Shopping: <ShoppingBag className="w-4 h-4" />,
  Nature: <Mountain className="w-4 h-4" />,
  'Hill Station': <Mountain className="w-4 h-4" />,
};

const stepIcons: Record<string, React.ReactNode> = {
  start: <Navigation className="w-5 h-5" />,
  travel: <Train className="w-5 h-5" />,
  arrive: <MapPin className="w-5 h-5" />,
  checkin: <Hotel className="w-5 h-5" />,
  explore: <Compass className="w-5 h-5" />,
};

const stationTypeIcons: Record<string, React.ReactNode> = {
  railway: <Train className="w-4 h-4" />,
  airport: <Plane className="w-4 h-4" />,
  bus_stand: <Bus className="w-4 h-4" />,
};

const TripExecution = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  usePageTracker('TripExecution');

  const wishlistItem = location.state?.wishlistItem as WishlistItem | undefined;
  const [selectedTransport, setSelectedTransport] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [packingChecked, setPackingChecked] = useState<Record<string, boolean>>({});
  const [executionData, setExecutionData] = useState<DestinationExecutionData | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!wishlistItem) {
      navigate('/wishlist');
      return;
    }
    setExecutionData(getDestinationExecutionData(wishlistItem.destination_name));
    trackActivity('trip_execution_started', 'TripExecution', wishlistItem.destination_name);
  }, [wishlistItem, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const filteredStations = (stations: NearbyStation[]) => {
    if (!selectedTransport) return stations;
    const typeMap: Record<string, string> = { flight: 'airport', train: 'railway', bus: 'bus_stand' };
    return stations.filter(s => s.type === typeMap[selectedTransport]);
  };

  const packingItems = [
    'ID Proof & Tickets', 'Phone Charger & Power Bank', 'Comfortable Clothes', 'Medicines & First Aid',
    'Water Bottle', 'Snacks for Journey', 'Sunscreen & Sunglasses', 'Camera', 'Cash & Cards',
    'Toiletries & Towel', 'Rain Gear / Umbrella', 'Local Map / Offline Maps',
  ];

  const packingProgress = Math.round(
    (Object.values(packingChecked).filter(Boolean).length / packingItems.length) * 100
  );

  if (loading || !user || !wishlistItem || !executionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

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
            <Link to="/tracking" className="text-muted-foreground hover:text-foreground transition-colors">Tracking</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile"><User className="w-5 h-5" /></Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/wishlist')}>
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Wishlist
        </Button>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          {wishlistItem.image_url && (
            <img src={wishlistItem.image_url} alt={wishlistItem.destination_name} className="w-full h-64 object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Trip to {wishlistItem.destination_name}
            </h1>
            <div className="flex flex-wrap gap-3">
              {wishlistItem.estimated_budget && (
                <Badge variant="secondary" className="text-sm">
                  <DollarSign className="w-3 h-3 mr-1" />₹{wishlistItem.estimated_budget.toLocaleString()} Budget
                </Badge>
              )}
              {wishlistItem.best_season && (
                <Badge variant="outline" className="text-sm bg-background/80">
                  <Clock className="w-3 h-3 mr-1" />{wishlistItem.best_season}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {executionData.guidelines.map((g, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                currentStep === i
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > i
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep > i ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              {g.title}
            </button>
          ))}
        </div>

        {/* Current Step Details */}
        <Card className="mb-8 border-primary/30 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {stepIcons[executionData.guidelines[currentStep].icon]}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  Step {executionData.guidelines[currentStep].step}: {executionData.guidelines[currentStep].title}
                </h3>
                <p className="text-muted-foreground">{executionData.guidelines[currentStep].description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline" size="sm"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(p => p - 1)}
                >Previous</Button>
                <Button
                  size="sm"
                  disabled={currentStep === executionData.guidelines.length - 1}
                  onClick={() => setCurrentStep(p => p + 1)}
                >Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transport Preference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              How do you prefer to travel?
            </CardTitle>
            <CardDescription>Select your preferred mode of transport to see relevant stations near you</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedTransport} onValueChange={setSelectedTransport} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['flight', 'train', 'bus'] as const).map(mode => (
                <Label
                  key={mode}
                  htmlFor={mode}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedTransport === mode ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                  }`}
                >
                  <RadioGroupItem value={mode} id={mode} />
                  <div className="flex items-center gap-2">
                    {transportIcons[mode]}
                    <span className="font-medium capitalize">{mode === 'flight' ? 'Flight' : mode === 'train' ? 'Train' : 'Bus'}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Nearby Stations with Schedules */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Nearest Stations & Terminals
            </CardTitle>
            <CardDescription>
              {selectedTransport
                ? `Showing ${selectedTransport === 'flight' ? 'airports' : selectedTransport === 'train' ? 'railway stations' : 'bus stands'} near ${wishlistItem.destination_name}`
                : `All stations near ${wishlistItem.destination_name} — select a transport mode above to see schedules`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-3">
              {filteredStations(executionData.stations).map((station, i) => (
                <AccordionItem key={i} value={`station-${i}`} className="border rounded-xl overflow-hidden bg-muted/30">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {stationTypeIcons[station.type]}
                      </div>
                      <div>
                        <p className="font-medium">{station.name} {station.code && <span className="text-muted-foreground font-normal">({station.code})</span>}</p>
                        <p className="text-sm text-muted-foreground">{station.distance} • {station.city}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {station.schedules && station.schedules.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          Available {station.type === 'airport' ? 'Flights' : station.type === 'railway' ? 'Trains' : 'Buses'}:
                        </p>
                        {station.schedules.map((sched, j) => (
                          <div key={j} className="p-3 rounded-lg border border-border bg-background">
                            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="default" className="text-xs font-mono">{sched.number}</Badge>
                                <span className="font-semibold text-sm">{sched.name}</span>
                              </div>
                              {sched.type && <Badge variant="outline" className="text-xs">{sched.type}</Badge>}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Departure</p>
                                <p className="font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{sched.departure}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Arrival</p>
                                <p className="font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{sched.arrival}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Duration</p>
                                <p className="font-medium">{sched.duration}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Fare</p>
                                <p className="font-medium text-primary">{sched.fare}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-muted-foreground text-xs mb-1">Available Days:</p>
                              <div className="flex flex-wrap gap-1">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                  <span
                                    key={day}
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                      sched.availableDays.includes(day)
                                        ? 'bg-primary/15 text-primary border border-primary/30'
                                        : 'bg-muted text-muted-foreground line-through'
                                    }`}
                                  >
                                    {day}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No schedule data available for this station.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Hotels */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-primary" />
              Recommended Hotels
            </CardTitle>
            <CardDescription>Stay options in {wishlistItem.destination_name} for every budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {executionData.hotels.map((hotel, i) => (
                <div key={i} className="p-4 rounded-xl border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={hotel.type === 'luxury' ? 'default' : hotel.type === 'mid-range' ? 'secondary' : 'outline'} className="capitalize">
                      {hotel.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      {hotel.rating}
                    </div>
                  </div>
                  <h4 className="font-semibold mb-1">{hotel.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{hotel.location}</p>
                  <p className="text-sm font-medium text-primary mb-3">{hotel.priceRange}</p>
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.map((a, j) => (
                      <span key={j} className="text-xs bg-muted px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Restaurants */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary" />
              Where to Eat
            </CardTitle>
            <CardDescription>Top restaurants and local food spots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {executionData.restaurants.map((restaurant, i) => (
                <div key={i} className="p-4 rounded-xl border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{restaurant.cuisine}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      {restaurant.rating}
                    </div>
                  </div>
                  <h4 className="font-semibold mb-1">{restaurant.name}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{restaurant.location}</p>
                  <p className="text-sm text-primary mb-1">{restaurant.priceRange}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Must try:</span> {restaurant.specialty}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nearby Attractions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              Nearby Attractions
            </CardTitle>
            <CardDescription>Places to explore around {wishlistItem.destination_name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {executionData.nearbyAttractions.map((attraction, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    {attractionIcons[attraction.type] || <MapPin className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{attraction.name}</p>
                      <Badge variant="outline" className="text-xs">{attraction.distance}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{attraction.description}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">{attraction.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Packing Checklist */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Packing Checklist
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-3 mt-2">
                <Progress value={packingProgress} className="flex-1 h-2" />
                <span className="text-sm font-medium">{packingProgress}%</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {packingItems.map((item) => (
                <label
                  key={item}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    packingChecked[item] ? 'bg-primary/5 border-primary/30' : 'border-border hover:border-primary/20'
                  }`}
                >
                  <Checkbox
                    checked={packingChecked[item] || false}
                    onCheckedChange={(checked) =>
                      setPackingChecked(prev => ({ ...prev, [item]: !!checked }))
                    }
                  />
                  <span className={`text-sm ${packingChecked[item] ? 'line-through text-muted-foreground' : ''}`}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center pb-8">
          <Button size="lg" onClick={() => navigate('/tracking', { state: { selectedWishlistItem: wishlistItem } })}>
            <Navigation className="w-5 h-5 mr-2" />
            Start Live Tracking
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/wishlist')}>
            Back to Wishlist
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TripExecution;
