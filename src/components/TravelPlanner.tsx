import { useState } from 'react';
import { trackActivity } from '@/hooks/useActivityTracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, MapPin, Calendar, IndianRupee, Sparkles, Navigation, Users, User } from 'lucide-react';
import TravelResults from './TravelResults';
import { generateRecommendations } from '@/lib/travelData';
import type { TravelRecommendation } from '@/lib/travelData';

const TravelPlanner = () => {
  const [formData, setFormData] = useState({
    startCity: '',
    destinationCity: '',
    budget: '',
    days: '',
    interest: '',
    travelType: 'solo' as 'solo' | 'group',
    travelers: '2',
  });
  const [hasDestination, setHasDestination] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<TravelRecommendation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results = generateRecommendations({
      budget: parseInt(formData.budget),
      days: parseInt(formData.days),
      interest: formData.interest,
      startCity: formData.startCity,
      destinationCity: hasDestination ? formData.destinationCity : undefined,
      travelType: formData.travelType,
      travelers: formData.travelType === 'group' ? parseInt(formData.travelers) || 2 : 1,
    });

    setRecommendations(results);
    setIsLoading(false);

    // Track destination search
    const dest = hasDestination ? formData.destinationCity : results[0]?.destination;
    if (dest) {
      trackActivity('destination_search', 'Travel Planner', dest, {
        startCity: formData.startCity,
        budget: formData.budget,
        days: formData.days,
        interest: formData.interest,
        travelType: formData.travelType,
      });
    }
  };

  const isFormValid = formData.startCity && formData.budget && formData.days && (hasDestination ? formData.destinationCity : formData.interest);

  return (
    <section id="planner" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Planning</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan Your Perfect Trip</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter your preferences and let our AI recommend the best destinations and itineraries for you
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-card hover:shadow-card-hover transition-shadow bg-gradient-card border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Trip Details</CardTitle>
            <CardDescription>Fill in your travel preferences to get personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <Navigation className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">I have a destination in mind</p>
                    <p className="text-sm text-muted-foreground">
                      {hasDestination ? 'Enter your preferred destination' : 'Let AI suggest destinations based on your preferences'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={hasDestination}
                  onCheckedChange={setHasDestination}
                />
              </div>

              {/* Solo / Group Travel */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="font-medium">Travel Mode</p>
                </div>
                <RadioGroup
                  value={formData.travelType}
                  onValueChange={(value: 'solo' | 'group') => setFormData({ ...formData, travelType: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 flex-1 p-3 rounded-lg border border-border/50 has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5 transition-colors">
                    <RadioGroupItem value="solo" id="solo" />
                    <Label htmlFor="solo" className="flex items-center gap-2 cursor-pointer flex-1">
                      <User className="h-4 w-4" />
                      Solo Travel
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-1 p-3 rounded-lg border border-border/50 has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5 transition-colors">
                    <RadioGroupItem value="group" id="group" />
                    <Label htmlFor="group" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Users className="h-4 w-4" />
                      Group Travel
                    </Label>
                  </div>
                </RadioGroup>
                {formData.travelType === 'group' && (
                  <div className="mt-3">
                    <Label htmlFor="travelers" className="text-sm text-muted-foreground">Number of Travelers</Label>
                    <Input
                      id="travelers"
                      type="number"
                      placeholder="e.g., 4"
                      value={formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                      min="2"
                      max="20"
                      className="h-10 mt-1 max-w-[200px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Group travel includes a 15% discount on per-person costs</p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startCity" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Starting City
                  </Label>
                  <Input
                    id="startCity"
                    placeholder="e.g., Delhi, Mumbai, Bangalore"
                    value={formData.startCity}
                    onChange={(e) => setFormData({ ...formData, startCity: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>

                {hasDestination && (
                  <div className="space-y-2">
                    <Label htmlFor="destinationCity" className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-primary" />
                      Destination City
                    </Label>
                    <Input
                      id="destinationCity"
                      placeholder="e.g., Goa, Manali, Jaipur"
                      value={formData.destinationCity}
                      onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                      required={hasDestination}
                      className="h-12"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    Budget (₹)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 15000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    required
                    min="1000"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="days" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Number of Days
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    placeholder="e.g., 4"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    required
                    min="1"
                    max="30"
                    className="h-12"
                  />
                </div>

                {!hasDestination && (
                  <div className="space-y-2">
                    <Label htmlFor="interest" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Your Interests
                    </Label>
                    <Select value={formData.interest} onValueChange={(value) => setFormData({ ...formData, interest: value })}>
                      <SelectTrigger id="interest" className="h-12">
                        <SelectValue placeholder="Select your preference" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        <SelectItem value="beaches">Beaches</SelectItem>
                        <SelectItem value="hills">Hills & Mountains</SelectItem>
                        <SelectItem value="heritage">Heritage & Culture</SelectItem>
                        <SelectItem value="nature">Nature & Wildlife</SelectItem>
                        <SelectItem value="adventure">Adventure Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full h-12 text-lg bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Travel Plan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSearched && !isLoading && (
          <TravelResults 
            recommendations={recommendations} 
            startCity={formData.startCity}
            interest={formData.interest}
            tripDays={parseInt(formData.days) || 4}
          />
        )}
      </div>
    </section>
  );
};

export default TravelPlanner;
