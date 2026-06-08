import { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2, LocateFixed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NearbySpot {
  name: string;
  category: string;
  distance: number;
  imageUrl: string;
  highlights: string[];
  coordinates: [number, number];
}

// Tourist spots across India - including smaller, lesser-known places
const touristSpots = [
  // Major landmarks
  { name: 'Taj Mahal, Agra', category: 'Heritage', coordinates: [78.0421, 27.1751] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', highlights: ['UNESCO World Heritage', 'Mughal Architecture'] },
  { name: 'Qutub Minar, Delhi', category: 'Heritage', coordinates: [77.1855, 28.5244] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Tallest Brick Minaret', 'Indo-Islamic Art'] },
  { name: 'India Gate, Delhi', category: 'Landmark', coordinates: [77.2295, 28.6129] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1597040663342-45b6ba68fa1e?w=600', highlights: ['War Memorial', 'Iconic Monument'] },
  { name: 'Red Fort, Delhi', category: 'Heritage', coordinates: [77.2410, 28.6562] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1585135497273-1a86d9d16e2a?w=600', highlights: ['Mughal Fortress', 'Sound & Light Show'] },
  { name: 'Lotus Temple, Delhi', category: 'Spiritual', coordinates: [77.2588, 28.5535] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1622451212437-09550e05a42e?w=600', highlights: ['Bahai House of Worship', 'Architectural Marvel'] },
  { name: 'Hawa Mahal, Jaipur', category: 'Heritage', coordinates: [75.8267, 26.9239] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', highlights: ['Palace of Winds', '953 Windows'] },
  { name: 'Gateway of India, Mumbai', category: 'Landmark', coordinates: [72.8347, 18.9220] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600', highlights: ['Colonial Monument', 'Harbor Views'] },
  { name: 'Charminar, Hyderabad', category: 'Heritage', coordinates: [78.4747, 17.3616] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=600', highlights: ['Iconic Monument', 'Laad Bazaar'] },
  
  // Smaller / lesser-known spots - Delhi NCR area
  { name: 'Hauz Khas Village, Delhi', category: 'Heritage', coordinates: [77.2050, 28.5494] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Medieval Tank', 'Art Galleries & Cafes'] },
  { name: 'Agrasen ki Baoli, Delhi', category: 'Heritage', coordinates: [77.2342, 28.6265] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Ancient Stepwell', '14th Century', 'Free Entry'] },
  { name: 'Lodhi Garden, Delhi', category: 'Nature', coordinates: [77.2196, 28.5931] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Mughal-era Tombs', 'Morning Walks', 'Bird Watching'] },
  { name: 'Chandni Chowk, Delhi', category: 'Heritage', coordinates: [77.2303, 28.6506] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Street Food Capital', 'Historic Market', 'Parantha Wali Gali'] },
  { name: 'Humayun\'s Tomb, Delhi', category: 'Heritage', coordinates: [77.2507, 28.5933] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['UNESCO Site', 'Mughal Gardens', 'Precursor to Taj Mahal'] },
  { name: 'Dilli Haat, Delhi', category: 'Shopping', coordinates: [77.2093, 28.5729] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Handicraft Market', 'State Food Stalls', '₹30 Entry'] },
  { name: 'Waste to Wonder Park, Delhi', category: 'Landmark', coordinates: [77.2483, 28.5918] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Recycled Art Wonders', 'Mini Eiffel Tower', 'Night Illumination'] },
  { name: 'Sunder Nursery, Delhi', category: 'Nature', coordinates: [77.2467, 28.5928] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Heritage Park', 'Bird Sanctuary', 'Mughal-era Monuments'] },
  { name: 'National Rail Museum, Delhi', category: 'Heritage', coordinates: [77.1782, 28.5855] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Vintage Locomotives', 'Toy Train Ride', 'Great for Kids'] },
  { name: 'Surajkund, Faridabad', category: 'Heritage', coordinates: [77.2873, 28.4626] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['10th Century Tank', 'Annual Crafts Mela', 'Nature Walk'] },
  { name: 'Kingdom of Dreams, Gurgaon', category: 'Entertainment', coordinates: [77.0649, 28.4669] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', highlights: ['Live Bollywood Shows', 'Culture Gully Food Court'] },
  
  // Smaller spots around Mumbai
  { name: 'Kanheri Caves, Mumbai', category: 'Heritage', coordinates: [72.9066, 19.2094] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600', highlights: ['Buddhist Rock-cut Caves', '1st Century BCE', 'Inside Sanjay Gandhi Park'] },
  { name: 'Bandra Fort, Mumbai', category: 'Heritage', coordinates: [72.8197, 19.0444] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600', highlights: ['Castella de Aguada', 'Sunset Point', 'Sea-facing'] },
  { name: 'Versova Beach, Mumbai', category: 'Beach', coordinates: [72.8120, 19.1336] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', highlights: ['Fisherman Village', 'Sunset Views', 'Quiet Beach'] },
  
  // Smaller spots around Bangalore
  { name: 'Nandi Hills, Bangalore', category: 'Nature', coordinates: [77.6835, 13.3702] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', highlights: ['Sunrise Point', 'Paragliding'] },
  { name: 'Lalbagh Botanical Garden, Bangalore', category: 'Nature', coordinates: [77.5855, 12.9507] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', highlights: ['240 Year Old Garden', 'Glass House', 'Flower Shows'] },
  { name: 'Cubbon Park, Bangalore', category: 'Nature', coordinates: [77.5946, 12.9763] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', highlights: ['Green Lung of City', 'Bandstand', 'Morning Joggers Paradise'] },
  { name: 'Bannerghatta Biological Park', category: 'Wildlife', coordinates: [77.5770, 12.8005] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', highlights: ['Safari Ride', 'Butterfly Park', 'Rescue Center'] },
  
  // Smaller spots around Hyderabad
  { name: 'Golconda Fort, Hyderabad', category: 'Heritage', coordinates: [78.4011, 17.3833] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=600', highlights: ['Medieval Fort', 'Acoustic Wonder'] },
  { name: 'Shilparamam, Hyderabad', category: 'Shopping', coordinates: [78.3828, 17.4504] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=600', highlights: ['Arts & Crafts Village', 'Handloom Shopping', 'Boating'] },
  { name: 'Durgam Cheruvu, Hyderabad', category: 'Nature', coordinates: [78.3817, 17.4323] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=600', highlights: ['Secret Lake', 'Cable Bridge', 'Evening Walks'] },
  { name: 'Nehru Zoological Park, Hyderabad', category: 'Wildlife', coordinates: [78.4519, 17.3479] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', highlights: ['Safari Park', 'Nocturnal Animals', 'Toy Train'] },
  
  // Smaller spots around Chennai
  { name: 'Mahabalipuram', category: 'Heritage', coordinates: [80.1991, 12.6269] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600', highlights: ['Shore Temple', 'Rock-cut Caves'] },
  { name: 'Besant Nagar Beach, Chennai', category: 'Beach', coordinates: [80.2706, 13.0002] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', highlights: ['Elliot\'s Beach', 'Peaceful & Clean', 'Ashtalakshmi Temple'] },
  { name: 'Dakshinachitra, Chennai', category: 'Heritage', coordinates: [80.2318, 12.7953] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600', highlights: ['Living History Museum', 'South Indian Culture', 'Traditional Craft Demos'] },
  
  // Smaller spots around Kolkata
  { name: 'Victoria Memorial, Kolkata', category: 'Heritage', coordinates: [88.3425, 22.5448] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600', highlights: ['British Architecture', 'Museum & Gardens'] },
  { name: 'Prinsep Ghat, Kolkata', category: 'Landmark', coordinates: [88.3331, 22.5569] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600', highlights: ['Riverside Promenade', 'Palladian Architecture', 'Evening Hangout'] },
  { name: 'Kumartuli, Kolkata', category: 'Heritage', coordinates: [88.3596, 22.5987] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600', highlights: ['Idol Making District', 'Clay Artisans', 'Cultural Heritage'] },
  
  // Smaller spots around Pune
  { name: 'Lonavala', category: 'Nature', coordinates: [73.4073, 18.7546] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', highlights: ['Hill Station', 'Karla Caves'] },
  { name: 'Sinhagad Fort, Pune', category: 'Heritage', coordinates: [73.7559, 18.3661] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', highlights: ['Maratha Fort', 'Trek Route', 'Pithla Bhakri at Top'] },
  { name: 'Shaniwar Wada, Pune', category: 'Heritage', coordinates: [73.8553, 18.5196] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', highlights: ['Peshwa Palace Ruins', 'Night Light Show', 'Historical Significance'] },
  
  // Smaller spots in Andhra Pradesh / Telangana
  { name: 'Araku Valley', category: 'Nature', coordinates: [82.8756, 18.3274] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', highlights: ['Coffee Plantations', 'Tribal Culture'] },
  { name: 'Borra Caves', category: 'Nature', coordinates: [83.0367, 18.2821] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', highlights: ['Million Year Old Caves', 'Stalactites'] },
  { name: 'RK Beach, Vizag', category: 'Beach', coordinates: [83.3265, 17.7177] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', highlights: ['Submarine Museum', 'Kailasagiri Hill'] },
  { name: 'Lepakshi Temple', category: 'Heritage', coordinates: [77.6067, 15.9833] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600', highlights: ['Hanging Pillar', 'Vijayanagara Art'] },
  { name: 'Belum Caves', category: 'Nature', coordinates: [78.1128, 15.1044] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', highlights: ['Underground Caves', 'Stalactite Formations'] },
  { name: 'Tirupati Balaji Temple', category: 'Spiritual', coordinates: [79.3470, 13.6833] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600', highlights: ['Richest Temple', 'Pilgrimage Site'] },
  { name: 'Srisailam Temple', category: 'Spiritual', coordinates: [78.8685, 15.8513] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600', highlights: ['Jyotirlinga', 'Nallamala Hills'] },
  
  // Smaller spots around Jaipur / Rajasthan
  { name: 'Amber Fort, Jaipur', category: 'Heritage', coordinates: [75.8513, 26.9855] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', highlights: ['Rajput Architecture', 'Elephant Rides'] },
  { name: 'Nahargarh Fort, Jaipur', category: 'Heritage', coordinates: [75.8152, 26.9383] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', highlights: ['City View at Sunset', 'Wax Museum', 'Cafe on Top'] },
  { name: 'Jal Mahal, Jaipur', category: 'Landmark', coordinates: [75.8462, 26.9530] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', highlights: ['Water Palace', 'Man Sagar Lake', 'Photo Spot'] },
  { name: 'Chand Baori, Abhaneri', category: 'Heritage', coordinates: [76.6069, 27.0071] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', highlights: ['3500 Steps', 'Deepest Stepwell', '9th Century'] },
  
  // Kerala small spots
  { name: 'Fort Kochi', category: 'Heritage', coordinates: [76.2437, 9.9639] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', highlights: ['Chinese Fishing Nets', 'Colonial Streets', 'Art Galleries'] },
  { name: 'Cherai Beach, Kochi', category: 'Beach', coordinates: [76.1807, 10.1419] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', highlights: ['Dolphin Spotting', 'Backwater Meets Sea', 'Quiet Beach'] },
  
  // Goa small spots
  { name: 'Fontainhas, Goa', category: 'Heritage', coordinates: [73.8570, 15.4963] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', highlights: ['Latin Quarter', 'Colorful Portuguese Houses', 'Art District'] },
  { name: 'Divar Island, Goa', category: 'Nature', coordinates: [73.8850, 15.5150] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', highlights: ['Ferry Ride', 'Untouched Village', 'Birdwatching'] },
  { name: 'Chapora Fort, Goa', category: 'Heritage', coordinates: [73.7397, 15.6102] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', highlights: ['Dil Chahta Hai Fame', 'Sunset Views', 'Vagator Beach Below'] },
  
  // UP / nearby Delhi
  { name: 'Fatehpur Sikri', category: 'Heritage', coordinates: [77.6607, 27.0942] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', highlights: ['Mughal Capital', 'Buland Darwaza', 'UNESCO Site'] },
  { name: 'Mathura-Vrindavan', category: 'Spiritual', coordinates: [77.6737, 27.4925] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600', highlights: ['Birthplace of Krishna', 'Holi Festival', 'Temple Town'] },

  // Himachal small spots
  { name: 'Mahabaleshwar', category: 'Nature', coordinates: [73.6477, 17.9307] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', highlights: ['Strawberry Farms', 'Viewpoints'] },
  { name: 'Kasol', category: 'Nature', coordinates: [77.3139, 32.0098] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', highlights: ['Mini Israel', 'Parvati Valley', 'Trekking Base'] },
  { name: 'Bir Billing', category: 'Adventure', coordinates: [76.7220, 31.8804] as [number, number], imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', highlights: ['Paragliding Capital', 'Tibetan Colony', 'Tea Gardens'] },
];

// Haversine formula: distance in km between two lat/lng points
const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const categoryColors: Record<string, string> = {
  Heritage: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  Nature: 'bg-green-500/10 text-green-700 dark:text-green-300',
  Spiritual: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  Beach: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  Wildlife: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  Landmark: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  Shopping: 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
  Entertainment: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  Adventure: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
};

const NearbySpots = () => {
  const [spots, setSpots] = useState<NearbySpot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);

  const findNearbySpots = (lat: number, lng: number) => {
    const nearby = touristSpots
      .map((spot) => ({
        ...spot,
        distance: getDistanceKm(lat, lng, spot.coordinates[1], spot.coordinates[0]),
      }))
      .filter((spot) => spot.distance <= 150)
      .sort((a, b) => a.distance - b.distance);

    setSpots(nearby);
    setLocationGranted(true);
    setLoading(false);
  };

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        findNearbySpots(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setError(
          err.code === 1
            ? 'Location access denied. Please enable it in your browser settings.'
            : 'Unable to determine your location. Please try again.'
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <LocateFixed className="h-4 w-4" />
            <span className="text-sm font-medium">Discover Nearby</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Tourist Spots Near You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the best tourist attractions within 150 km of your current location — including hidden gems and lesser-known spots.
          </p>
        </div>

        {!locationGranted && !loading && (
          <div className="text-center">
            <Button onClick={requestLocation} size="lg" className="gap-2">
              <Navigation className="h-5 w-5" />
              Enable Location to Discover
            </Button>
            {error && <p className="text-destructive mt-4 text-sm">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Finding spots near you…</span>
          </div>
        )}

        {locationGranted && spots.length === 0 && !loading && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No spots found within 100 km</h3>
            <p className="text-muted-foreground">Try exploring our monthly destinations instead!</p>
          </div>
        )}

        {spots.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {spots.map((spot) => (
              <Card
                key={spot.name}
                className="overflow-hidden hover:shadow-card-hover transition-all group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <Badge className={`absolute top-3 left-3 ${categoryColors[spot.category] || 'bg-muted text-muted-foreground'}`}>
                    {spot.category}
                  </Badge>
                  <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    {spot.distance.toFixed(1)} km
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    {spot.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {spot.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbySpots;
