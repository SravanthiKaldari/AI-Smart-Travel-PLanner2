import { useState } from 'react';
import { Plane, Train, Bus, Clock, IndianRupee, Zap, Leaf, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { TravelRecommendation, TransportOption } from '@/lib/travelData';

interface TransportComparisonProps {
  recommendations: TravelRecommendation[];
  startCity: string;
}

const TransportComparison = ({ recommendations, startCity }: TransportComparisonProps) => {
  const [selectedType, setSelectedType] = useState<'all' | 'train' | 'flight' | 'bus'>('all');

  const getIcon = (type: TransportOption['type']) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-4 w-4" />;
      case 'train':
        return <Train className="h-4 w-4" />;
      case 'bus':
        return <Bus className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: TransportOption['type']) => {
    switch (type) {
      case 'flight':
        return 'text-blue-600 dark:text-blue-400';
      case 'train':
        return 'text-orange-600 dark:text-orange-400';
      case 'bus':
        return 'text-green-600 dark:text-green-400';
    }
  };

  const getTypeBg = (type: TransportOption['type']) => {
    switch (type) {
      case 'flight':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'train':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'bus':
        return 'bg-green-500/10 border-green-500/20';
    }
  };

  // Get cheapest and fastest across all destinations
  const allOptions = recommendations.flatMap(rec => 
    rec.transportOptions.map(opt => ({ ...opt, destination: rec.destination }))
  );
  
  const cheapestOverall = [...allOptions].sort((a, b) => a.price - b.price)[0];
  const fastestFlight = allOptions
    .filter(o => o.type === 'flight')
    .sort((a, b) => {
      const durationA = parseInt(a.duration) || 0;
      const durationB = parseInt(b.duration) || 0;
      return durationA - durationB;
    })[0];

  const filterOptions = (options: TransportOption[]) => {
    if (selectedType === 'all') return options;
    return options.filter(o => o.type === selectedType);
  };

  // Find best option for each destination per category
  const getBestOptions = (rec: TravelRecommendation) => {
    const options = rec.transportOptions;
    return {
      cheapest: [...options].sort((a, b) => a.price - b.price)[0],
      fastest: options.find(o => o.isFastest) || options[0],
      bestTrain: options.filter(o => o.type === 'train').sort((a, b) => a.price - b.price)[0],
      bestFlight: options.filter(o => o.type === 'flight').sort((a, b) => a.price - b.price)[0],
      bestBus: options.filter(o => o.type === 'bus').sort((a, b) => a.price - b.price)[0],
    };
  };

  return (
    <Card className="mt-8 shadow-card bg-gradient-card border-none animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Train className="h-5 w-5 text-primary" />
          Transport Comparison
          <Badge variant="secondary" className="ml-2">
            From {startCity}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Best Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cheapestOverall && (
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-green-600 dark:text-green-400">Most Budget Friendly</p>
                  <p className="text-sm font-bold">{cheapestOverall.destination}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {getIcon(cheapestOverall.type)}
                  <span className="text-sm">{cheapestOverall.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400 flex items-center gap-0.5">
                    <IndianRupee className="h-4 w-4" />
                    {cheapestOverall.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground">{cheapestOverall.duration}</p>
                </div>
              </div>
            </div>
          )}
          {fastestFlight && (
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Fastest Route</p>
                  <p className="text-sm font-bold">{fastestFlight.destination}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  <span className="text-sm">{fastestFlight.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                    <Clock className="h-4 w-4" />
                    {fastestFlight.duration}
                  </p>
                  <p className="text-xs text-muted-foreground">₹{fastestFlight.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="trains">
              <Train className="h-3 w-3 mr-1" />
              Trains
            </TabsTrigger>
            <TabsTrigger value="flights">
              <Plane className="h-3 w-3 mr-1" />
              Flights
            </TabsTrigger>
            <TabsTrigger value="buses">
              <Bus className="h-3 w-3 mr-1" />
              Buses
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="mt-4">
            <ScrollArea className="w-full">
              <div className="min-w-[600px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Destination</th>
                      <th className="text-center p-3 font-semibold text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Leaf className="h-3 w-3 text-green-500" />
                          Cheapest
                        </div>
                      </th>
                      <th className="text-center p-3 font-semibold text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="h-3 w-3 text-blue-500" />
                          Fastest
                        </div>
                      </th>
                      <th className="text-center p-3 font-semibold text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Train className="h-3 w-3 text-orange-500" />
                          Best Train
                        </div>
                      </th>
                      <th className="text-center p-3 font-semibold text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Plane className="h-3 w-3 text-blue-500" />
                          Best Flight
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.map((rec, idx) => {
                      const best = getBestOptions(rec);
                      return (
                        <tr key={rec.destination} className={idx % 2 === 0 ? 'bg-muted/30' : ''}>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="font-medium">{rec.destination}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {best.cheapest && (
                              <div className="inline-flex flex-col items-center">
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                  ₹{best.cheapest.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  {getIcon(best.cheapest.type)}
                                  {best.cheapest.duration}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {best.fastest && (
                              <div className="inline-flex flex-col items-center">
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                  {best.fastest.duration}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  ₹{best.fastest.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {best.bestTrain ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                  ₹{best.bestTrain.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {best.bestTrain.duration}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">N/A</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {best.bestFlight ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                  ₹{best.bestFlight.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {best.bestFlight.duration}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">N/A</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>

          {/* Trains Tab */}
          <TabsContent value="trains" className="mt-4">
            <div className="grid gap-4">
              {recommendations.map(rec => {
                const trains = rec.transportOptions.filter(o => o.type === 'train');
                if (trains.length === 0) return null;
                
                return (
                  <div key={rec.destination} className="border border-border/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{rec.destination}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">{trains.length} trains</Badge>
                    </div>
                    <div className="grid gap-2">
                      {trains.slice(0, 3).map((train, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg ${getTypeBg('train')}`}
                        >
                          <div className="flex items-center gap-3">
                            <Train className={`h-4 w-4 ${getTypeColor('train')}`} />
                            <div>
                              <p className="font-medium text-sm">{train.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {train.departureTime} → {train.arrivalTime}
                                {train.class && <span className="ml-2">• {train.class}</span>}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {train.duration}
                            </div>
                            <div className="font-bold text-orange-600 dark:text-orange-400">
                              ₹{train.price.toLocaleString('en-IN')}
                            </div>
                            {train.isBudgetFriendly && (
                              <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-0 text-[10px]">
                                <Leaf className="h-2.5 w-2.5 mr-1" />
                                Best
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Flights Tab */}
          <TabsContent value="flights" className="mt-4">
            <div className="grid gap-4">
              {recommendations.map(rec => {
                const flights = rec.transportOptions.filter(o => o.type === 'flight');
                if (flights.length === 0) return null;
                
                return (
                  <div key={rec.destination} className="border border-border/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{rec.destination}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">{flights.length} flights</Badge>
                    </div>
                    <div className="grid gap-2">
                      {flights.map((flight, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg ${getTypeBg('flight')}`}
                        >
                          <div className="flex items-center gap-3">
                            <Plane className={`h-4 w-4 ${getTypeColor('flight')}`} />
                            <div>
                              <p className="font-medium text-sm">{flight.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {flight.departureTime} → {flight.arrivalTime}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {flight.duration}
                            </div>
                            <div className="font-bold text-blue-600 dark:text-blue-400">
                              ₹{flight.price.toLocaleString('en-IN')}
                            </div>
                            {flight.isFastest && (
                              <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0 text-[10px]">
                                <Zap className="h-2.5 w-2.5 mr-1" />
                                Fast
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Buses Tab */}
          <TabsContent value="buses" className="mt-4">
            <div className="grid gap-4">
              {recommendations.map(rec => {
                const buses = rec.transportOptions.filter(o => o.type === 'bus');
                if (buses.length === 0) return null;
                
                return (
                  <div key={rec.destination} className="border border-border/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{rec.destination}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">{buses.length} buses</Badge>
                    </div>
                    <div className="grid gap-2">
                      {buses.map((bus, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg ${getTypeBg('bus')}`}
                        >
                          <div className="flex items-center gap-3">
                            <Bus className={`h-4 w-4 ${getTypeColor('bus')}`} />
                            <div>
                              <p className="font-medium text-sm">{bus.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {bus.departureTime} → {bus.arrivalTime}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {bus.duration}
                            </div>
                            <div className="font-bold text-green-600 dark:text-green-400">
                              ₹{bus.price.toLocaleString('en-IN')}
                            </div>
                            {bus.isBudgetFriendly && (
                              <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-0 text-[10px]">
                                <Leaf className="h-2.5 w-2.5 mr-1" />
                                Value
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-[10px] text-muted-foreground text-center italic">
          * All prices are indicative and subject to availability. Book early for best rates.
        </p>
      </CardContent>
    </Card>
  );
};

export default TransportComparison;
