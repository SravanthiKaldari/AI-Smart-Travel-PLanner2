import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, IndianRupee, Sparkles, CheckCircle2, Heart, Train, Route, LayoutGrid, GitCompare, Cloud, ExternalLink } from 'lucide-react';
import type { TravelRecommendation } from '@/lib/travelData';
import TravelMap from './TravelMap';
import TransportOptions from './TransportOptions';
import TransportComparison from './TransportComparison';
import WeatherForecast from './WeatherForecast';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TravelResultsProps {
  recommendations: TravelRecommendation[];
  startCity?: string;
  interest?: string;
  tripDays?: number;
}

const TravelResults = ({ recommendations, startCity = 'Delhi', interest = 'travel', tripDays = 4 }: TravelResultsProps) => {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [savedDestinations, setSavedDestinations] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'cards' | 'compare'>('cards');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToWishlist = async (rec: TravelRecommendation) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Please sign in', description: 'Sign in to save destinations to your wishlist.', variant: 'destructive' });
      return;
    }
    
    const { error } = await supabase.from('wishlists').insert({
      user_id: user.id,
      destination_name: rec.destination,
      estimated_budget: rec.totalCost,
      best_season: rec.season,
      best_month: rec.bestMonth,
      coordinates: rec.coordinates,
      image_url: rec.imageUrl,
      highlights: rec.highlights,
    });
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to add to wishlist.', variant: 'destructive' });
    } else {
      setSavedDestinations(prev => new Set(prev).add(rec.destination));
      toast({ title: 'Added to wishlist!', description: `${rec.destination} has been saved.` });
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="mt-12 text-center animate-fade-in">
        <Card className="max-w-2xl mx-auto shadow-card bg-gradient-card">
          <CardContent className="py-12">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-2">No Destinations Found</h3>
            <p className="text-muted-foreground">
              We couldn't find destinations matching your budget and preferences. Try increasing your budget or changing your interests.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Your Personalized Recommendations</h3>
          <p className="text-muted-foreground">
            We found {recommendations.length} perfect destination{recommendations.length > 1 ? 's' : ''} for you from {startCity}
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 justify-center md:justify-end">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Cards
          </Button>
          <Button
            variant={viewMode === 'compare' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('compare')}
            className="gap-2"
          >
            <GitCompare className="h-4 w-4" />
            Compare Transport
          </Button>
        </div>
      </div>

      {/* Comparison View */}
      {viewMode === 'compare' && (
        <TransportComparison recommendations={recommendations} startCity={startCity} />
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((rec, index) => (
          <Card
            key={index}
            className="overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-none"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={rec.imageUrl}
                alt={`${rec.destination} travel destination`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-accent text-accent-foreground font-semibold">
                  Top Pick
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center gap-2 text-white">
                  <Route className="h-4 w-4" />
                  <span className="text-sm">{startCity} → {rec.destination}</span>
                </div>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="h-5 w-5 text-primary" />
                {rec.destination}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Total Cost */}
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Total</span>
                  <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                    <IndianRupee className="h-5 w-5" />
                    {rec.totalCost.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Tabs for different sections */}
              <Tabs defaultValue="transport" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-9">
                  <TabsTrigger value="transport" className="text-xs flex items-center gap-1">
                    <Train className="h-3 w-3" />
                    Travel
                  </TabsTrigger>
                  <TabsTrigger value="weather" className="text-xs flex items-center gap-1">
                    <Cloud className="h-3 w-3" />
                    Weather
                  </TabsTrigger>
                  <TabsTrigger value="costs" className="text-xs flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" />
                    Costs
                  </TabsTrigger>
                  <TabsTrigger value="itinerary" className="text-xs flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Plan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transport" className="mt-4">
                  <TransportOptions 
                    options={rec.transportOptions} 
                    startCity={startCity}
                    destination={rec.destination}
                  />
                </TabsContent>

                <TabsContent value="weather" className="mt-4">
                  <WeatherForecast 
                    destination={rec.destination}
                    coordinates={rec.coordinates}
                    destinationType={interest}
                    tripDays={tripDays}
                  />
                </TabsContent>

                <TabsContent value="costs" className="mt-4 space-y-4">
                  {/* Cost Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground">Cost Breakdown</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Travel', value: rec.costBreakdown.travel, color: 'bg-blue-500' },
                        { label: 'Stay', value: rec.costBreakdown.stay, color: 'bg-orange-500' },
                        { label: 'Food', value: rec.costBreakdown.food, color: 'bg-green-500' },
                        { label: 'Activities', value: rec.costBreakdown.activities, color: 'bg-purple-500' },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">₹{item.value.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.color} rounded-full transition-all duration-500`}
                              style={{ width: `${(item.value / rec.totalCost) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best Time */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Best Time to Visit</span>
                    </div>
                    <p className="font-medium">{rec.bestMonth}</p>
                    <p className="text-xs text-muted-foreground">{rec.season}</p>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-4 space-y-4">
                  {/* Highlights */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.highlights.slice(0, 4).map((highlight, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Itinerary - Clickable */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Suggested Itinerary</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {rec.itinerary.map((day, i) => {
                        // Extract place name from itinerary text (after "Day X:" or "Visit" etc.)
                        const placeMatch = day.match(/(?:Visit|Explore|Head to|Trip to|Go to|See|Check out)\s+(.+?)(?:\s*[-–,.]|$)/i);
                        const placeName = placeMatch?.[1]?.trim();
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              if (placeName) {
                                navigate(`/place/${encodeURIComponent(placeName)}`);
                              }
                            }}
                            className={`flex items-start gap-2 text-sm w-full text-left rounded-lg p-2 transition-colors ${
                              placeName ? 'hover:bg-primary/10 cursor-pointer group' : ''
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className={placeName ? 'group-hover:text-primary group-hover:underline underline-offset-2' : ''}>
                              {day}
                            </span>
                            {placeName && <ExternalLink className="h-3 w-3 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                <Button 
                  onClick={() => handleAddToWishlist(rec)}
                  variant={savedDestinations.has(rec.destination) ? "secondary" : "default"}
                  className="flex-1"
                  disabled={savedDestinations.has(rec.destination)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${savedDestinations.has(rec.destination) ? 'fill-current' : ''}`} />
                  {savedDestinations.has(rec.destination) ? 'Saved' : 'Add to Wishlist'}
                </Button>
                <Button 
                  onClick={() => setSelectedDestination(selectedDestination === rec.destination ? null : rec.destination)}
                  variant="outline"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>

              {selectedDestination === rec.destination && (
                <div className="mt-4 animate-fade-in">
                  <TravelMap recommendation={rec} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};

export default TravelResults;
