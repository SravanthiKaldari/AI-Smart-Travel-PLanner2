import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, MapPin, Navigation, Plane, LogOut, User,
  Compass, Star, Clock, Camera, Utensils, Mountain,
  Landmark, ShoppingBag, Loader2, LocateFixed, ExternalLink
} from 'lucide-react';

interface PlaceInfo {
  name: string;
  description: string;
  specialities: string[];
  bestTimeToVisit: string;
  entryFee: string;
  timings: string;
  category: string;
  tips: string[];
  nearbyFood: string[];
  imageUrl: string;
  coordinates: [number, number];
}

// Comprehensive place database
const placeDatabase: Record<string, PlaceInfo> = {
  'Basilica of Bom Jesus': {
    name: 'Basilica of Bom Jesus',
    description: 'A UNESCO World Heritage Site, the Basilica of Bom Jesus is one of the oldest churches in Goa and the whole of India. Built in 1594, it holds the mortal remains of St. Francis Xavier, housed in a silver casket. The baroque architecture and intricately carved altars make this a must-visit landmark in Old Goa.',
    specialities: ['UNESCO World Heritage Site', 'Baroque Architecture', 'Tomb of St. Francis Xavier', 'Portuguese Colonial Era', '400+ Years Old'],
    bestTimeToVisit: 'November to February (Pleasant weather)',
    entryFee: 'Free Entry',
    timings: '9:00 AM – 6:30 PM (Mon-Sat), 10:00 AM – 6:30 PM (Sun)',
    category: 'Heritage',
    tips: ['Visit early morning to avoid crowds', 'Photography is restricted inside', 'Combine with Se Cathedral nearby', 'Dress modestly'],
    nearbyFood: ['Ritz Classic Restaurant (0.5 km)', 'Viva Panjim (2 km)', 'Kokni Kanteen (3 km)'],
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    coordinates: [73.9116, 15.5009],
  },
  'Dudhsagar Falls': {
    name: 'Dudhsagar Falls',
    description: 'Dudhsagar Falls, meaning "Sea of Milk," is a four-tiered waterfall located on the Mandovi River in the Bhagwan Mahavir Wildlife Sanctuary. At 310 meters, it is one of the tallest waterfalls in India. The falls are surrounded by lush deciduous forests and can be reached via a thrilling jeep safari through the jungle.',
    specialities: ['One of India\'s Tallest Waterfalls', '310 Meters Height', 'Bhagwan Mahavir Wildlife Sanctuary', 'Railway Track View', 'Jeep Safari Experience'],
    bestTimeToVisit: 'October to May (Best flow after monsoon)',
    entryFee: '₹400 (including jeep safari)',
    timings: '7:00 AM – 4:00 PM',
    category: 'Nature',
    tips: ['Book jeep safari in advance', 'Carry waterproof bags for electronics', 'Wear comfortable trekking shoes', 'Best water flow is Oct-Dec'],
    nearbyFood: ['Spice plantations offer lunch packages', 'Local dhabas near Collem railway station'],
    imageUrl: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800',
    coordinates: [74.3143, 15.3144],
  },
  'Fort Aguada': {
    name: 'Fort Aguada',
    description: 'Built in 1612 by the Portuguese, Fort Aguada is a well-preserved 17th-century Portuguese fort standing on Sinquerim Beach. The fort was a reference point for vessels coming from Europe and served as a freshwater source for passing ships. Its lighthouse, built in 1864, is one of the oldest of its kind in Asia.',
    specialities: ['17th Century Portuguese Fort', 'Ancient Lighthouse', 'Arabian Sea Panoramic Views', 'Sinquerim Beach Location', 'Architectural Heritage'],
    bestTimeToVisit: 'November to February',
    entryFee: 'Free Entry',
    timings: '8:30 AM – 5:30 PM',
    category: 'Heritage',
    tips: ['Visit during sunset for best views', 'Combine with Sinquerim Beach visit', 'Carry water — no shops inside the fort', 'Great photography spot'],
    nearbyFood: ['Britto\'s Bar & Restaurant (3 km)', 'Curlies Beach Shack (5 km)'],
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
    coordinates: [73.7734, 15.4921],
  },
  'Calangute Beach': {
    name: 'Calangute Beach',
    description: 'Known as the "Queen of Beaches," Calangute is the largest beach in North Goa. It stretches along the Arabian Sea coastline and is famous for its vibrant nightlife, water sports, and beachside shacks. It is one of the most popular tourist destinations in Goa, attracting visitors from all over the world.',
    specialities: ['Queen of Beaches', 'Water Sports Hub', 'Vibrant Nightlife', 'Beachside Shacks & Restaurants', 'Parasailing & Jet Skiing'],
    bestTimeToVisit: 'November to February',
    entryFee: 'Free',
    timings: 'Open 24 hours',
    category: 'Beach',
    tips: ['Avoid swimming during high tide', 'Negotiate prices for water sports', 'Visit Baga Beach nearby too', 'Sunsets are spectacular'],
    nearbyFood: ['Souza Lobo (on beach)', 'A Reverie (fine dining)', 'Infantaria (bakery)'],
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    coordinates: [73.7554, 15.5449],
  },
  'Shimla Ridge': {
    name: 'Shimla Ridge',
    description: 'The Ridge is a large open space in the heart of Shimla, offering stunning views of the surrounding mountains and valleys. It is the center of all cultural activities in Shimla and a popular meeting point. The Christ Church, one of the oldest churches in North India, stands at one end of the Ridge.',
    specialities: ['Heart of Shimla', 'Panoramic Mountain Views', 'Christ Church', 'Cultural Hub', 'Colonial Architecture'],
    bestTimeToVisit: 'March to June, December to January (Snow)',
    entryFee: 'Free',
    timings: 'Open 24 hours',
    category: 'Nature',
    tips: ['Visit during snowfall for magical views', 'Evening walk is a tradition', 'Street food vendors available', 'Book hotels nearby for convenience'],
    nearbyFood: ['Wake & Bake Café', 'Ashiana Restaurant', 'Indian Coffee House'],
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    coordinates: [77.1734, 31.1048],
  },
  'Mall Road Shimla': {
    name: 'Mall Road, Shimla',
    description: 'Mall Road is the main street and shopping hub of Shimla. Located along the Ridge, it is lined with shops, cafes, restaurants, and colonial-era buildings. No vehicles are allowed on the Mall Road, making it a perfect promenade. It offers views of the valley and is the lifeline of the city.',
    specialities: ['Vehicle-Free Promenade', 'Shopping Paradise', 'Colonial Buildings', 'Valley Views', 'Cafes & Restaurants'],
    bestTimeToVisit: 'Year-round (each season has its charm)',
    entryFee: 'Free',
    timings: 'Shops open 9 AM – 9 PM',
    category: 'Shopping',
    tips: ['Walk from one end to another for full experience', 'Try local woolens and handicrafts', 'Bargaining is expected', 'Evening lights are beautiful'],
    nearbyFood: ['Baljees Restaurant', 'Café Simla Times', 'Sita Ram & Sons (sweets)'],
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    coordinates: [77.1709, 31.1041],
  },
  'Kufri': {
    name: 'Kufri',
    description: 'Kufri is a small hill station 16 km from Shimla, known for its lush green surroundings, adventure activities, and the Himalayan Nature Park. In winter, it transforms into a snow-covered wonderland offering skiing and tobogganing. The Mahasu Peak in Kufri offers panoramic views of the Himalayan ranges.',
    specialities: ['Skiing in Winter', 'Himalayan Nature Park', 'Horse Riding', 'Mahasu Peak Views', 'Apple Orchards'],
    bestTimeToVisit: 'December to February (Snow), April to June (Pleasant)',
    entryFee: '₹50 (Nature Park)',
    timings: '9:00 AM – 5:00 PM',
    category: 'Adventure',
    tips: ['Carry warm clothes even in summer', 'Negotiate horse riding prices', 'Visit the zoo for Himalayan wildlife', 'Roads can be slippery in winter'],
    nearbyFood: ['Local dhabas with Himachali cuisine', 'Resort restaurants'],
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    coordinates: [77.2667, 31.0986],
  },
};

// Generate AI-style place info for unknown places
const generatePlaceInfo = (placeName: string): PlaceInfo => ({
  name: placeName,
  description: `${placeName} is a popular tourist destination known for its unique charm and cultural significance. Visitors from across the country and the world come to explore this beautiful location, which offers a perfect blend of natural beauty, historical importance, and local culture.`,
  specialities: ['Popular Tourist Spot', 'Cultural Significance', 'Photo Opportunities', 'Local Cuisine', 'Historical Value'],
  bestTimeToVisit: 'October to March (Pleasant Weather)',
  entryFee: 'Varies',
  timings: '6:00 AM – 6:00 PM',
  category: 'Attraction',
  tips: ['Carry water and snacks', 'Wear comfortable walking shoes', 'Check local weather before visiting', 'Respect local customs'],
  nearbyFood: ['Local restaurants and street food available nearby'],
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  coordinates: [78.9629, 20.5937],
});

const categoryIcons: Record<string, React.ReactNode> = {
  Heritage: <Landmark className="w-5 h-5" />,
  Nature: <Mountain className="w-5 h-5" />,
  Beach: <Compass className="w-5 h-5" />,
  Shopping: <ShoppingBag className="w-5 h-5" />,
  Adventure: <Mountain className="w-5 h-5" />,
  Attraction: <Star className="w-5 h-5" />,
};

const PlaceDetail = () => {
  const { placeName } = useParams<{ placeName: string }>();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [distance, setDistance] = useState<number | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const decodedName = decodeURIComponent(placeName || '');
  const place = placeDatabase[decodedName] || generatePlaceInfo(decodedName);

  useEffect(() => {
    setLoadingDistance(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        const R = 6371;
        const dLat = ((place.coordinates[1] - latitude) * Math.PI) / 180;
        const dLon = ((place.coordinates[0] - longitude) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 +
          Math.cos((latitude * Math.PI) / 180) * Math.cos((place.coordinates[1] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
        setDistance(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
        setLoadingDistance(false);
      },
      () => setLoadingDistance(false),
      { enableHighAccuracy: true }
    );
  }, [place.coordinates]);

  const openInMaps = () => {
    const url = userCoords
      ? `https://www.google.com/maps/dir/${userCoords.lat},${userCoords.lng}/${place.coordinates[1]},${place.coordinates[0]}`
      : `https://www.google.com/maps/search/?api=1&query=${place.coordinates[1]},${place.coordinates[0]}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Smart Travel</span>
          </Link>
          {user && (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile"><User className="w-5 h-5" /></Link>
              </Button>
              <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate('/'); }}>
                <LogOut className="w-4 h-4 mr-2" />Sign Out
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img src={place.imageUrl} alt={place.name} className="w-full h-72 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/90 text-primary-foreground">
                {categoryIcons[place.category] || <Star className="w-4 h-4" />}
                <span className="ml-1">{place.category}</span>
              </Badge>
              {distance !== null && (
                <Badge variant="secondary" className="gap-1">
                  <Navigation className="w-3 h-3" />
                  {distance < 1 ? `${(distance * 1000).toFixed(0)}m away` : `${distance.toFixed(1)} km away`}
                </Badge>
              )}
              {loadingDistance && (
                <Badge variant="outline" className="gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Calculating distance...
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{place.name}</h1>
          </div>
        </div>

        {/* Navigate Button */}
        <div className="flex gap-3 mb-8">
          <Button onClick={openInMaps} className="gap-2">
            <LocateFixed className="w-4 h-4" /> Navigate in Google Maps
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" /> About This Place
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{place.description}</p>
          </CardContent>
        </Card>

        {/* Specialities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" /> Specialities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {place.specialities.map((s, i) => (
                <Badge key={i} variant="secondary" className="text-sm py-1 px-3">{s}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Best Time to Visit</p>
                <p className="text-sm text-muted-foreground">{place.bestTimeToVisit}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Entry Fee</p>
                <p className="text-sm text-muted-foreground">{place.entryFee}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Timings</p>
                <p className="text-sm text-muted-foreground">{place.timings}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips & Food */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="w-5 h-5 text-primary" /> Travel Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {place.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Utensils className="w-5 h-5 text-primary" /> Nearby Food
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {place.nearbyFood.map((food, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    {food}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PlaceDetail;
