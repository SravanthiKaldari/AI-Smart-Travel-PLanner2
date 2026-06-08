import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Backpack, Shirt, Smartphone, Heart, MapPin, Sparkles, Lightbulb, ChevronDown, ChevronUp, Glasses } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
  uvIndex: number;
}

interface PackingCategory {
  name: string;
  icon: string;
  items: string[];
}

interface PackingSuggestionsProps {
  destination: string;
  destinationType: string;
  weather: WeatherDay[];
  tripDays: number;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'shirt':
      return <Shirt className="h-4 w-4" />;
    case 'sunglasses':
      return <Glasses className="h-4 w-4" />;
    case 'smartphone':
      return <Smartphone className="h-4 w-4" />;
    case 'first-aid':
      return <Heart className="h-4 w-4" />;
    case 'map-pin':
      return <MapPin className="h-4 w-4" />;
    default:
      return <Backpack className="h-4 w-4" />;
  }
};

const PackingSuggestions = ({ destination, destinationType, weather, tripDays }: PackingSuggestionsProps) => {
  const [categories, setCategories] = useState<PackingCategory[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (weather.length === 0) {
      toast({
        title: 'Weather data needed',
        description: 'Please wait for weather data to load first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('packing-suggestions', {
        body: {
          destination,
          destinationType,
          weather,
          tripDays,
        },
      });

      if (funcError) {
        throw new Error(funcError.message);
      }

      if (data.success) {
        setCategories(data.categories || []);
        setTips(data.tips || []);
        setHasGenerated(true);
        // Expand first category by default
        if (data.categories?.length > 0) {
          setExpandedCategories(new Set([data.categories[0].name]));
        }
      } else {
        setError(data.error || 'Failed to generate suggestions');
        toast({
          title: 'Error',
          description: data.error || 'Failed to generate packing suggestions',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Packing suggestions error:', err);
      setError('Unable to generate packing suggestions');
      toast({
        title: 'Error',
        description: 'Failed to generate packing suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (item: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const packedItems = checkedItems.size;

  if (!hasGenerated) {
    return (
      <Card className="bg-gradient-card border-none">
        <CardContent className="p-6 text-center">
          <Backpack className="h-12 w-12 mx-auto mb-3 text-primary" />
          <h4 className="font-semibold mb-2">AI Packing Assistant</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Get personalized packing suggestions based on weather and destination
          </p>
          <Button 
            onClick={generateSuggestions} 
            disabled={isLoading || weather.length === 0}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Packing List
              </>
            )}
          </Button>
          {weather.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Loading weather data...
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-card border-none">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={generateSuggestions} variant="outline" size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Backpack className="h-5 w-5 text-primary" />
            Packing List
          </CardTitle>
          <Badge variant="secondary">
            {packedItems}/{totalItems} packed
          </Badge>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${totalItems > 0 ? (packedItems / totalItems) * 100 : 0}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Categories */}
        {categories.map((category) => (
          <div key={category.name} className="border border-border/50 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-primary">{getIcon(category.icon)}</span>
                <span className="font-medium text-sm">{category.name}</span>
                <Badge variant="outline" className="text-xs">
                  {category.items.filter(item => checkedItems.has(item)).length}/{category.items.length}
                </Badge>
              </div>
              {expandedCategories.has(category.name) ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedCategories.has(category.name) && (
              <div className="p-3 space-y-2">
                {category.items.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 p-1 rounded"
                  >
                    <Checkbox
                      checked={checkedItems.has(item)}
                      onCheckedChange={() => toggleItem(item)}
                    />
                    <span className={checkedItems.has(item) ? 'line-through text-muted-foreground' : ''}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Tips */}
        {tips.length > 0 && (
          <div className="bg-primary/5 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Pro Tips</span>
            </div>
            <ul className="space-y-1">
              {tips.map((tip, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Regenerate button */}
        <Button 
          onClick={generateSuggestions} 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? 'Regenerating...' : 'Regenerate List'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PackingSuggestions;