import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Droplets, Thermometer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PackingSuggestions from './PackingSuggestions';

export interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
  uvIndex: number;
}

interface WeatherForecastProps {
  destination: string;
  coordinates: [number, number]; // [longitude, latitude]
  destinationType?: string;
  tripDays?: number;
}

const getWeatherIcon = (code: number) => {
  // WMO Weather interpretation codes
  if (code === 0) return <Sun className="h-6 w-6 text-yellow-500" />;
  if (code <= 3) return <Cloud className="h-6 w-6 text-muted-foreground" />;
  if (code <= 49) return <Cloud className="h-6 w-6 text-muted-foreground" />;
  if (code <= 69) return <CloudRain className="h-6 w-6 text-blue-500" />;
  if (code <= 79) return <CloudSnow className="h-6 w-6 text-blue-300" />;
  if (code <= 82) return <CloudRain className="h-6 w-6 text-blue-600" />;
  if (code <= 86) return <CloudSnow className="h-6 w-6 text-blue-200" />;
  if (code <= 99) return <CloudLightning className="h-6 w-6 text-yellow-600" />;
  return <Cloud className="h-6 w-6 text-muted-foreground" />;
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 59) return 'Drizzle';
  if (code <= 69) return 'Rain';
  if (code <= 79) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const WeatherForecast = ({ destination, coordinates, destinationType = 'travel', tripDays = 4 }: WeatherForecastProps) => {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: funcError } = await supabase.functions.invoke('weather-forecast', {
          body: {
            latitude: coordinates[1],
            longitude: coordinates[0],
            destination,
          },
        });

        if (funcError) {
          throw new Error(funcError.message);
        }

        if (data.success) {
          setForecast(data.forecast);
        } else {
          setError(data.error || 'Failed to fetch weather');
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to load weather forecast');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [destination, coordinates]);

  if (isLoading) {
    return (
      <Card className="bg-gradient-card border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-24 flex-shrink-0 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-card border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          7-Day Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {forecast.slice(0, 7).map((day, index) => (
            <div
              key={day.date}
              className={`flex-shrink-0 p-3 rounded-lg text-center min-w-[90px] transition-all ${
                index === 0 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {formatDate(day.date)}
              </p>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(day.weatherCode)}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {getWeatherDescription(day.weatherCode)}
              </p>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Thermometer className="h-3 w-3 text-destructive" />
                <span className="text-sm font-semibold">{Math.round(day.maxTemp)}°</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Thermometer className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-muted-foreground">{Math.round(day.minTemp)}°</span>
              </div>
              {day.precipitation > 0 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Droplets className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-500">{day.precipitation}mm</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Weather summary badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {forecast[0] && (
            <>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sun className="h-3 w-3" />
                UV Index: {Math.round(forecast[0].uvIndex)}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Thermometer className="h-3 w-3" />
                Avg: {Math.round((forecast[0].maxTemp + forecast[0].minTemp) / 2)}°C
              </Badge>
              {forecast.reduce((sum, d) => sum + d.precipitation, 0) > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  Weekly Rain: {Math.round(forecast.reduce((sum, d) => sum + d.precipitation, 0))}mm
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Packing Suggestions */}
        <div className="mt-4">
          <PackingSuggestions 
            destination={destination}
            destinationType={destinationType}
            weather={forecast}
            tripDays={tripDays}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;