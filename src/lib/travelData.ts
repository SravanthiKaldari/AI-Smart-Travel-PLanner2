export interface TransportOption {
  type: 'train' | 'flight' | 'bus';
  name: string;
  duration: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  class?: string;
  isBudgetFriendly?: boolean;
  isFastest?: boolean;
}

export interface TravelRecommendation {
  destination: string;
  totalCost: number;
  costBreakdown: {
    travel: number;
    stay: number;
    food: number;
    activities: number;
  };
  bestMonth: string;
  season: string;
  itinerary: string[];
  highlights: string[];
  imageUrl: string;
  coordinates: [number, number]; // [longitude, latitude]
  transportOptions: TransportOption[];
}

interface TravelInput {
  budget: number;
  days: number;
  interest: string;
  startCity?: string;
  destinationCity?: string;
  travelType?: 'solo' | 'group';
  travelers?: number;
}

// Transport routes from major cities
const transportRoutes: Record<string, Record<string, TransportOption[]>> = {
  'Delhi': {
    'Goa': [
      { type: 'flight', name: 'IndiGo 6E-2135', duration: '2h 35m', price: 4500, departureTime: '06:15', arrivalTime: '08:50', isFastest: true },
      { type: 'flight', name: 'SpiceJet SG-8721', duration: '2h 40m', price: 3800, departureTime: '14:30', arrivalTime: '17:10', isBudgetFriendly: true },
      { type: 'train', name: 'Goa Express (12779)', duration: '26h 15m', price: 650, departureTime: '15:00', arrivalTime: '17:15', class: 'Sleeper', isBudgetFriendly: true },
      { type: 'train', name: 'Rajdhani Express', duration: '23h 30m', price: 2100, departureTime: '11:25', arrivalTime: '10:55', class: '3AC' },
      { type: 'bus', name: 'Volvo AC Sleeper', duration: '28h', price: 1800, departureTime: '16:00', arrivalTime: '20:00' },
    ],
    'Shimla': [
      { type: 'train', name: 'Shatabdi Express', duration: '4h 30m', price: 750, departureTime: '07:40', arrivalTime: '12:10', class: 'CC', isFastest: true },
      { type: 'train', name: 'Kalka Mail', duration: '6h 25m', price: 350, departureTime: '21:30', arrivalTime: '03:55', class: 'Sleeper', isBudgetFriendly: true },
      { type: 'bus', name: 'HRTC Volvo', duration: '9h', price: 900, departureTime: '22:00', arrivalTime: '07:00' },
      { type: 'bus', name: 'Ordinary Bus', duration: '10h', price: 450, departureTime: '21:00', arrivalTime: '07:00', isBudgetFriendly: true },
    ],
    'Manali': [
      { type: 'flight', name: 'IndiGo to Kullu', duration: '1h 30m', price: 5500, departureTime: '08:00', arrivalTime: '09:30', isFastest: true },
      { type: 'bus', name: 'HPTDC Volvo', duration: '12h', price: 1400, departureTime: '17:00', arrivalTime: '05:00' },
      { type: 'bus', name: 'Private Volvo', duration: '13h', price: 1100, departureTime: '18:00', arrivalTime: '07:00', isBudgetFriendly: true },
    ],
    'Jaipur': [
      { type: 'train', name: 'Shatabdi Express', duration: '4h 30m', price: 850, departureTime: '06:05', arrivalTime: '10:35', class: 'CC', isFastest: true },
      { type: 'train', name: 'Ajmer Shatabdi', duration: '4h 45m', price: 755, departureTime: '06:15', arrivalTime: '11:00', class: 'CC' },
      { type: 'train', name: 'Double Decker', duration: '5h 15m', price: 450, departureTime: '07:55', arrivalTime: '13:10', class: 'CC', isBudgetFriendly: true },
      { type: 'bus', name: 'Volvo AC', duration: '5h 30m', price: 800, departureTime: '06:00', arrivalTime: '11:30' },
    ],
    'Varanasi': [
      { type: 'flight', name: 'IndiGo 6E-2231', duration: '1h 25m', price: 3500, departureTime: '07:00', arrivalTime: '08:25', isFastest: true },
      { type: 'train', name: 'Shiv Ganga Express', duration: '12h', price: 450, departureTime: '19:00', arrivalTime: '07:00', class: 'Sleeper', isBudgetFriendly: true },
      { type: 'train', name: 'Kashi Vishwanath', duration: '11h 30m', price: 1200, departureTime: '18:30', arrivalTime: '06:00', class: '3AC' },
    ],
    'Agra': [
      { type: 'train', name: 'Gatimaan Express', duration: '1h 40m', price: 755, departureTime: '08:10', arrivalTime: '09:50', class: 'CC', isFastest: true },
      { type: 'train', name: 'Shatabdi Express', duration: '2h', price: 550, departureTime: '06:15', arrivalTime: '08:15', class: 'CC' },
      { type: 'train', name: 'Intercity Express', duration: '2h 30m', price: 180, departureTime: '07:15', arrivalTime: '09:45', class: '2S', isBudgetFriendly: true },
      { type: 'bus', name: 'AC Bus', duration: '4h', price: 400, departureTime: '06:00', arrivalTime: '10:00' },
    ],
    'Rishikesh': [
      { type: 'train', name: 'Shatabdi Express', duration: '4h 20m', price: 650, departureTime: '06:50', arrivalTime: '11:10', class: 'CC', isFastest: true },
      { type: 'train', name: 'Jan Shatabdi', duration: '5h 30m', price: 350, departureTime: '06:15', arrivalTime: '11:45', class: 'CC', isBudgetFriendly: true },
      { type: 'bus', name: 'Volvo AC', duration: '6h', price: 500, departureTime: '22:00', arrivalTime: '04:00' },
    ],
    'Leh-Ladakh': [
      { type: 'flight', name: 'IndiGo to Leh', duration: '1h 20m', price: 6500, departureTime: '06:00', arrivalTime: '07:20', isFastest: true },
      { type: 'flight', name: 'Air India', duration: '1h 25m', price: 7200, departureTime: '07:30', arrivalTime: '08:55' },
      { type: 'bus', name: 'HPTDC Deluxe (2 days)', duration: '40h', price: 2800, departureTime: '04:00', arrivalTime: 'Day 3', isBudgetFriendly: true },
    ],
    'Jim Corbett': [
      { type: 'train', name: 'Ranikhet Express', duration: '5h 30m', price: 250, departureTime: '22:40', arrivalTime: '04:10', class: 'Sleeper', isBudgetFriendly: true },
      { type: 'train', name: 'Shatabdi Express', duration: '5h', price: 650, departureTime: '06:50', arrivalTime: '11:50', class: 'CC', isFastest: true },
      { type: 'bus', name: 'UTC Bus', duration: '6h', price: 350, departureTime: '21:00', arrivalTime: '03:00' },
    ],
  },
  'Mumbai': {
    'Goa': [
      { type: 'flight', name: 'IndiGo 6E-5012', duration: '1h 10m', price: 3200, departureTime: '07:00', arrivalTime: '08:10', isFastest: true },
      { type: 'flight', name: 'GoAir G8-702', duration: '1h 15m', price: 2800, departureTime: '16:00', arrivalTime: '17:15', isBudgetFriendly: true },
      { type: 'train', name: 'Konkan Kanya', duration: '12h', price: 450, departureTime: '23:00', arrivalTime: '11:00', class: 'Sleeper', isBudgetFriendly: true },
      { type: 'train', name: 'Mandovi Express', duration: '11h 30m', price: 1100, departureTime: '07:10', arrivalTime: '18:40', class: '3AC' },
      { type: 'bus', name: 'Neeta Volvo', duration: '10h', price: 1200, departureTime: '21:00', arrivalTime: '07:00' },
    ],
    'Jaipur': [
      { type: 'flight', name: 'SpiceJet', duration: '1h 45m', price: 3800, departureTime: '08:00', arrivalTime: '09:45', isFastest: true },
      { type: 'train', name: 'Jaipur SF Express', duration: '17h', price: 550, departureTime: '16:35', arrivalTime: '09:35', class: 'Sleeper', isBudgetFriendly: true },
      { type: 'train', name: 'Duronto Express', duration: '14h', price: 1450, departureTime: '17:20', arrivalTime: '07:20', class: '3AC' },
    ],
    'Munnar': [
      { type: 'flight', name: 'IndiGo to Kochi', duration: '1h 45m', price: 3500, departureTime: '06:30', arrivalTime: '08:15', isFastest: true },
      { type: 'train', name: 'Netravati Express', duration: '24h', price: 650, departureTime: '11:40', arrivalTime: '11:40', class: 'Sleeper', isBudgetFriendly: true },
      { type: 'bus', name: 'KSRTC Volvo', duration: '20h', price: 1500, departureTime: '15:00', arrivalTime: '11:00' },
    ],
    'Coorg': [
      { type: 'flight', name: 'IndiGo to Mangalore', duration: '1h 30m', price: 3200, departureTime: '10:00', arrivalTime: '11:30', isFastest: true },
      { type: 'train', name: 'Matsyagandha Exp', duration: '18h', price: 500, departureTime: '15:05', arrivalTime: '09:05', class: 'Sleeper', isBudgetFriendly: true },
      { type: 'bus', name: 'VRL Volvo', duration: '14h', price: 1100, departureTime: '19:00', arrivalTime: '09:00' },
    ],
  },
  'Bangalore': {
    'Goa': [
      { type: 'flight', name: 'IndiGo', duration: '1h 10m', price: 3000, departureTime: '07:15', arrivalTime: '08:25', isFastest: true },
      { type: 'train', name: 'Vasco Express', duration: '14h', price: 400, departureTime: '20:00', arrivalTime: '10:00', class: 'Sleeper', isBudgetFriendly: true },
      { type: 'bus', name: 'KSRTC Airavat', duration: '9h', price: 1000, departureTime: '22:00', arrivalTime: '07:00' },
    ],
    'Munnar': [
      { type: 'bus', name: 'KSRTC Volvo', duration: '7h', price: 800, departureTime: '22:00', arrivalTime: '05:00', isFastest: true },
      { type: 'bus', name: 'Private Bus', duration: '8h', price: 550, departureTime: '21:00', arrivalTime: '05:00', isBudgetFriendly: true },
    ],
    'Coorg': [
      { type: 'bus', name: 'KSRTC Airavat Club', duration: '5h 30m', price: 750, departureTime: '07:00', arrivalTime: '12:30', isFastest: true },
      { type: 'bus', name: 'KSRTC Ordinary', duration: '6h', price: 350, departureTime: '08:00', arrivalTime: '14:00', isBudgetFriendly: true },
    ],
    'Jaipur': [
      { type: 'flight', name: 'IndiGo', duration: '2h 15m', price: 4200, departureTime: '06:30', arrivalTime: '08:45', isFastest: true },
      { type: 'train', name: 'Sampark Kranti', duration: '32h', price: 750, departureTime: '06:15', arrivalTime: '14:15', class: 'Sleeper', isBudgetFriendly: true },
    ],
  },
};

// Default transport options for routes not explicitly defined
const generateDefaultTransport = (destination: string, basePrice: number): TransportOption[] => {
  const flightPrice = Math.round(basePrice * 0.3);
  const trainPrice = Math.round(basePrice * 0.08);
  const busPrice = Math.round(basePrice * 0.12);
  
  return [
    { type: 'flight', name: 'Direct Flight', duration: '2h', price: flightPrice, departureTime: '08:00', arrivalTime: '10:00', isFastest: true },
    { type: 'train', name: 'Express Train', duration: '12h', price: trainPrice, departureTime: '20:00', arrivalTime: '08:00', class: 'Sleeper', isBudgetFriendly: true },
    { type: 'train', name: 'Superfast Train', duration: '10h', price: trainPrice * 2.5, departureTime: '21:00', arrivalTime: '07:00', class: '3AC' },
    { type: 'bus', name: 'Volvo AC Bus', duration: '14h', price: busPrice, departureTime: '19:00', arrivalTime: '09:00' },
  ];
};

const destinations = {
  beaches: [
    {
      name: 'Goa',
      basePrice: 12000,
      coordinates: [73.8278, 15.2993] as [number, number],
      highlights: ['Beautiful beaches', 'Water sports', 'Nightlife', 'Portuguese heritage'],
      bestMonth: 'November-February',
      season: 'Winter',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
      itineraryTemplate: [
        'Arrival & Calangute Beach visit',
        'Baga Beach & water sports',
        'Fort Aguada & local markets',
        'Shopping & departure',
      ],
    },
    {
      name: 'Andaman Islands',
      basePrice: 35000,
      coordinates: [92.6586, 11.7401] as [number, number],
      highlights: ['Crystal clear waters', 'Coral reefs', 'Scuba diving', 'Island hopping'],
      bestMonth: 'October-May',
      season: 'Winter to Early Summer',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      itineraryTemplate: [
        'Port Blair arrival & Cellular Jail',
        'Havelock Island & Radhanagar Beach',
        'Scuba diving & snorkeling',
        'Neil Island & return',
      ],
    },
    {
      name: 'Puri',
      basePrice: 8000,
      coordinates: [85.8315, 19.8135] as [number, number],
      highlights: ['Golden beaches', 'Jagannath Temple', 'Beach activities', 'Local cuisine'],
      bestMonth: 'October-March',
      season: 'Winter',
      imageUrl: 'https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=800',
      itineraryTemplate: [
        'Arrival & beach exploration',
        'Jagannath Temple visit',
        'Konark Sun Temple day trip',
        'Beach activities & shopping',
      ],
    },
  ],
  hills: [
    {
      name: 'Shimla',
      basePrice: 15000,
      coordinates: [77.1734, 31.1048] as [number, number],
      highlights: ['Hill station charm', 'Colonial architecture', 'Toy train', 'Scenic views'],
      bestMonth: 'March-June',
      season: 'Summer',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      itineraryTemplate: [
        'Arrival & Mall Road exploration',
        'Kufri excursion & horse riding',
        'Jakhoo Temple & Ridge visit',
        'Shopping at Lakkar Bazaar',
      ],
    },
    {
      name: 'Manali',
      basePrice: 18000,
      coordinates: [77.1892, 32.2432] as [number, number],
      highlights: ['Adventure sports', 'Rohtang Pass', 'Solang Valley', 'Monasteries'],
      bestMonth: 'May-June, September-October',
      season: 'Summer & Autumn',
      imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=800',
      itineraryTemplate: [
        'Arrival & Hadimba Temple',
        'Solang Valley adventure activities',
        'Rohtang Pass excursion',
        'Old Manali & shopping',
      ],
    },
    {
      name: 'Darjeeling',
      basePrice: 14000,
      coordinates: [88.2636, 27.0410] as [number, number],
      highlights: ['Tea gardens', 'Toy train', 'Kanchenjunga views', 'Monasteries'],
      bestMonth: 'March-May',
      season: 'Spring',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      itineraryTemplate: [
        'Tiger Hill sunrise & Batasia Loop',
        'Tea garden tour & tasting',
        'Toy train ride',
        'Mall Road & local markets',
      ],
    },
  ],
  heritage: [
    {
      name: 'Jaipur',
      basePrice: 10000,
      coordinates: [75.7873, 26.9124] as [number, number],
      highlights: ['Pink City', 'Forts & palaces', 'Rajasthani culture', 'Handicrafts'],
      bestMonth: 'November-February',
      season: 'Winter',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
      itineraryTemplate: [
        'Amber Fort & Jal Mahal',
        'City Palace & Hawa Mahal',
        'Jantar Mantar & Albert Hall',
        'Local markets & shopping',
      ],
    },
    {
      name: 'Varanasi',
      basePrice: 9000,
      coordinates: [83.0047, 25.3176] as [number, number],
      highlights: ['Spiritual capital', 'Ganga Aarti', 'Ancient temples', 'Rich culture'],
      bestMonth: 'October-March',
      season: 'Winter',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
      itineraryTemplate: [
        'Ganga Aarti & boat ride',
        'Kashi Vishwanath Temple',
        'Sarnath Buddhist site',
        'Old city exploration',
      ],
    },
    {
      name: 'Agra',
      basePrice: 8000,
      coordinates: [78.0081, 27.1767] as [number, number],
      highlights: ['Taj Mahal', 'Agra Fort', 'Mughal architecture', 'Marble crafts'],
      bestMonth: 'October-March',
      season: 'Winter',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
      itineraryTemplate: [
        'Taj Mahal sunrise visit',
        'Agra Fort exploration',
        'Fatehpur Sikri day trip',
        'Local handicrafts shopping',
      ],
    },
  ],
  nature: [
    {
      name: 'Jim Corbett',
      basePrice: 16000,
      coordinates: [78.7640, 29.5308] as [number, number],
      highlights: ['Wildlife safari', 'Tiger reserve', 'Nature walks', 'Bird watching'],
      bestMonth: 'November-June',
      season: 'Winter to Summer',
      imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800',
      itineraryTemplate: [
        'Arrival & resort check-in',
        'Morning & evening safari',
        'Nature walk & bird watching',
        'Final safari & departure',
      ],
    },
    {
      name: 'Munnar',
      basePrice: 13000,
      coordinates: [77.0590, 10.0889] as [number, number],
      highlights: ['Tea plantations', 'Hill station', 'Scenic beauty', 'Eravikulam Park'],
      bestMonth: 'September-March',
      season: 'Post-Monsoon to Winter',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
      itineraryTemplate: [
        'Arrival & tea museum visit',
        'Eravikulam National Park',
        'Tea plantation tour',
        'Mattupetty Dam & shopping',
      ],
    },
    {
      name: 'Coorg',
      basePrice: 11000,
      coordinates: [75.7396, 12.3375] as [number, number],
      highlights: ['Coffee plantations', 'Waterfalls', 'Abbey Falls', 'Scenic landscapes'],
      bestMonth: 'October-March',
      season: 'Winter',
      imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800',
      itineraryTemplate: [
        'Arrival & Abbey Falls',
        'Coffee plantation tour',
        'Madikeri Fort & Raja Seat',
        'Dubare Elephant Camp',
      ],
    },
  ],
  adventure: [
    {
      name: 'Rishikesh',
      basePrice: 12000,
      coordinates: [78.2676, 30.0869] as [number, number],
      highlights: ['River rafting', 'Bungee jumping', 'Yoga capital', 'Ganga Aarti'],
      bestMonth: 'September-November, March-May',
      season: 'Autumn & Spring',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      itineraryTemplate: [
        'River rafting adventure',
        'Bungee jumping & flying fox',
        'Beatles Ashram & Laxman Jhula',
        'Ganga Aarti & departure',
      ],
    },
    {
      name: 'Leh-Ladakh',
      basePrice: 30000,
      coordinates: [77.5771, 34.1526] as [number, number],
      highlights: ['High altitude adventure', 'Mountain biking', 'Magnetic Hill', 'Pangong Lake'],
      bestMonth: 'June-September',
      season: 'Summer',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      itineraryTemplate: [
        'Arrival & acclimatization',
        'Nubra Valley via Khardung La',
        'Pangong Lake excursion',
        'Leh local sightseeing',
      ],
    },
    {
      name: 'Gulmarg',
      basePrice: 20000,
      coordinates: [74.3800, 34.0484] as [number, number],
      highlights: ['Skiing', 'Gondola ride', 'Snow activities', 'Mountain views'],
      bestMonth: 'December-March',
      season: 'Winter',
      imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=800',
      itineraryTemplate: [
        'Gondola ride & skiing',
        'Snow activities & snowboarding',
        'Gulmarg Golf Course',
        'Apharwat Peak visit',
      ],
    },
  ],
};

const normalizeCity = (city: string): string => {
  const normalized = city.trim().toLowerCase();
  if (normalized.includes('delhi') || normalized.includes('noida') || normalized.includes('gurgaon') || normalized.includes('gurugram')) {
    return 'Delhi';
  }
  if (normalized.includes('mumbai') || normalized.includes('bombay')) {
    return 'Mumbai';
  }
  if (normalized.includes('bangalore') || normalized.includes('bengaluru')) {
    return 'Bangalore';
  }
  if (normalized.includes('chennai') || normalized.includes('madras')) {
    return 'Chennai';
  }
  if (normalized.includes('kolkata') || normalized.includes('calcutta')) {
    return 'Kolkata';
  }
  if (normalized.includes('hyderabad')) {
    return 'Hyderabad';
  }
  // Capitalize first letter
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
};

export const generateRecommendations = ({ budget, days, interest, startCity = 'Delhi', destinationCity, travelType = 'solo', travelers = 1 }: TravelInput): TravelRecommendation[] => {
  const normalizedCity = normalizeCity(startCity);
  const isSpecificDestination = !!destinationCity;
  
  // If user specified a destination, search across ALL categories
  let filteredDestinations: typeof destinations.beaches;
  if (isSpecificDestination) {
    const normalizedDestination = destinationCity!.toLowerCase().trim();
    const allDestinations = Object.values(destinations).flat();
    const matchedDest = allDestinations.find(d => 
      d.name.toLowerCase() === normalizedDestination ||
      d.name.toLowerCase().includes(normalizedDestination) ||
      normalizedDestination.includes(d.name.toLowerCase())
    );
    filteredDestinations = matchedDest ? [matchedDest] : [];
  } else {
    filteredDestinations = destinations[interest as keyof typeof destinations] || destinations.beaches;
  }

  // If specific destination not found in our data, create a custom entry
  if (isSpecificDestination && filteredDestinations.length === 0) {
    filteredDestinations = [{
      name: destinationCity!.charAt(0).toUpperCase() + destinationCity!.slice(1).toLowerCase(),
      basePrice: Math.round(budget * 0.8 / (travelers || 1)),
      coordinates: [78.9629, 20.5937] as [number, number],
      highlights: ['Local sightseeing', 'Cultural experience', 'Local cuisine', 'Shopping'],
      bestMonth: 'October-March',
      season: 'Winter',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      itineraryTemplate: [
        'Arrival & local exploration',
        'Sightseeing & cultural visits',
        'Adventure & activities',
        'Shopping & departure',
      ],
    }];
  }
  
  const recommendations: TravelRecommendation[] = filteredDestinations
    .map((dest) => {
      // Get transport options for this route - only use defined routes, no defaults
      const cityRoutes = transportRoutes[normalizedCity];
      const hasDefinedRoutes = !!cityRoutes?.[dest.name];
      let transportOptions = hasDefinedRoutes 
        ? cityRoutes[dest.name] 
        : generateDefaultTransport(dest.name, dest.basePrice);
      
      // Sort by price to find budget-friendly options
      transportOptions = transportOptions.map(opt => ({
        ...opt,
        isBudgetFriendly: opt.isBudgetFriendly || false,
        isFastest: opt.isFastest || false,
      })).sort((a, b) => a.price - b.price);
      
      // Mark cheapest as budget-friendly if not already marked
      if (!transportOptions.some(o => o.isBudgetFriendly) && transportOptions.length > 0) {
        transportOptions[0].isBudgetFriendly = true;
      }

      const adjustedPrice = dest.basePrice * (days / 4);
      const cheapestTransport = transportOptions[0]?.price || Math.round(adjustedPrice * 0.25);
      
      const travelCost = cheapestTransport * 2; // Round trip
      const stayCost = Math.round((adjustedPrice - travelCost) * 0.50);
      const foodCost = Math.round((adjustedPrice - travelCost) * 0.30);
      const activitiesCost = Math.round((adjustedPrice - travelCost) * 0.20);
      
      // Adjust costs for group travel
      const groupMultiplier = travelType === 'group' ? travelers : 1;
      const perPersonDiscount = travelType === 'group' && travelers > 1 ? 0.85 : 1; // 15% group discount
      
      const totalCostPerPerson = Math.round((travelCost + stayCost + foodCost + activitiesCost) * perPersonDiscount);
      const totalCost = totalCostPerPerson * groupMultiplier;
      
      const itinerary = dest.itineraryTemplate.slice(0, days).map((item, index) => {
        return `Day ${index + 1}: ${item}`;
      });

      if (days > dest.itineraryTemplate.length) {
        for (let i = dest.itineraryTemplate.length; i < days; i++) {
          itinerary.push(`Day ${i + 1}: Leisure & local exploration`);
        }
      }

      return {
        destination: dest.name,
        totalCost,
        costBreakdown: {
          travel: Math.round(travelCost * perPersonDiscount * groupMultiplier),
          stay: Math.round(stayCost * perPersonDiscount * groupMultiplier),
          food: Math.round(foodCost * perPersonDiscount * groupMultiplier),
          activities: Math.round(activitiesCost * perPersonDiscount * groupMultiplier),
        },
        bestMonth: dest.bestMonth,
        season: dest.season,
        itinerary,
        highlights: dest.highlights,
        imageUrl: dest.imageUrl,
        coordinates: dest.coordinates,
        transportOptions,
      };
    })
    // Skip budget filter for specific destinations so the entered destination always shows
    .filter((rec) => isSpecificDestination || rec.totalCost <= budget * 1.1)
    .sort((a, b) => Math.abs(a.totalCost - budget) - Math.abs(b.totalCost - budget))
    .slice(0, isSpecificDestination ? 1 : 3);

  return recommendations;
};
