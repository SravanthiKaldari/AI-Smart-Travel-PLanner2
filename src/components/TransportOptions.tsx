import { useState } from 'react';
import { Plane, Train, Bus, Clock, IndianRupee, Zap, Leaf, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TransportOption } from '@/lib/travelData';

interface TransportOptionsProps {
  options: TransportOption[];
  startCity: string;
  destination: string;
}

const TransportOptions = ({ options, startCity, destination }: TransportOptionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'train':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'bus':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
    }
  };

  const filteredOptions = selectedType === 'all' 
    ? options 
    : options.filter(o => o.type === selectedType);

  const displayedOptions = isExpanded ? filteredOptions : filteredOptions.slice(0, 3);

  const cheapestOption = [...options].sort((a, b) => a.price - b.price)[0];
  const fastestOption = options.find(o => o.isFastest) || options[0];

  const typeFilters = [
    { type: 'all' as const, label: 'All', count: options.length },
    { type: 'train' as const, label: 'Trains', count: options.filter(o => o.type === 'train').length },
    { type: 'flight' as const, label: 'Flights', count: options.filter(o => o.type === 'flight').length },
    { type: 'bus' as const, label: 'Buses', count: options.filter(o => o.type === 'bus').length },
  ].filter(f => f.count > 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
          <Train className="h-4 w-4 text-primary" />
          Travel Options from {startCity}
        </h4>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Budget Friendly</span>
          </div>
          <p className="text-sm font-bold">{cheapestOption?.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <IndianRupee className="h-3 w-3" />
            {cheapestOption?.price.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Fastest</span>
          </div>
          <p className="text-sm font-bold">{fastestOption?.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {fastestOption?.duration}
          </p>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {typeFilters.map(filter => (
          <button
            key={filter.type}
            onClick={() => setSelectedType(filter.type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedType === filter.type
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Options list */}
      <div className="space-y-2">
        {displayedOptions.map((option, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border transition-all hover:shadow-md ${
              option.isBudgetFriendly 
                ? 'bg-green-500/5 border-green-500/30' 
                : 'bg-card border-border/50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(option.type)}`}>
                  {getIcon(option.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{option.name}</p>
                    {option.isBudgetFriendly && (
                      <Badge variant="secondary" className="text-[10px] bg-green-500/20 text-green-700 dark:text-green-400 border-0">
                        <Leaf className="h-2.5 w-2.5 mr-1" />
                        Best Value
                      </Badge>
                    )}
                    {option.isFastest && (
                      <Badge variant="secondary" className="text-[10px] bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0">
                        <Zap className="h-2.5 w-2.5 mr-1" />
                        Fastest
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {option.duration}
                    </span>
                    <span>
                      {option.departureTime} → {option.arrivalTime}
                    </span>
                    {option.class && (
                      <Badge variant="outline" className="text-[10px] py-0">
                        {option.class}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary flex items-center gap-0.5">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {option.price.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-muted-foreground">per person</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse button */}
      {filteredOptions.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show {filteredOptions.length - 3} More Options
            </>
          )}
        </Button>
      )}

      {/* Price note */}
      <p className="text-[10px] text-muted-foreground text-center italic">
        * Prices are indicative and may vary. Book in advance for best rates.
      </p>
    </div>
  );
};

export default TransportOptions;
