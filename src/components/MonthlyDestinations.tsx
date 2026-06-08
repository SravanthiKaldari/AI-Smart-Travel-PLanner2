import { useState, useCallback, useEffect } from 'react';
import { MapPin, Calendar, IndianRupee, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';

interface MonthlyPlace {
  name: string;
  tagline: string;
  imageUrl: string;
  budget: string;
  reason: string;
  category: string;
}

const monthlyData: Record<number, MonthlyPlace[]> = {
  0: [ // January
    { name: 'Jaipur', tagline: 'Pink City in pleasant winter', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', budget: '₹8,000–12,000', reason: 'Cool weather, Kite Festival', category: 'Heritage' },
    { name: 'Rann of Kutch', tagline: 'White desert under starry skies', imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600', budget: '₹10,000–18,000', reason: 'Rann Utsav festival', category: 'Cultural' },
    { name: 'Goa', tagline: 'Sun, sand & carnival vibes', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', budget: '₹10,000–15,000', reason: 'Peak beach season', category: 'Beach' },
    { name: 'Alleppey', tagline: 'Houseboat on backwaters', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', budget: '₹8,000–14,000', reason: 'Perfect backwater weather', category: 'Nature' },
    { name: 'Auli', tagline: 'Snowy ski paradise', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹12,000–20,000', reason: 'Skiing season', category: 'Adventure' },
    { name: 'Andaman', tagline: 'Tropical island escape', imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', budget: '₹25,000–40,000', reason: 'Clear waters, ideal diving', category: 'Beach' },
  ],
  1: [ // February
    { name: 'Agra', tagline: 'Taj Mahal in spring light', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', budget: '₹6,000–10,000', reason: 'Taj Mahotsav festival', category: 'Heritage' },
    { name: 'Goa', tagline: 'Carnival season celebrations', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', budget: '₹10,000–15,000', reason: 'Goa Carnival', category: 'Beach' },
    { name: 'Khajuraho', tagline: 'Ancient temple art', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600', budget: '₹7,000–12,000', reason: 'Dance Festival', category: 'Heritage' },
    { name: 'Jaisalmer', tagline: 'Golden City desert adventure', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', budget: '₹9,000–15,000', reason: 'Desert Festival', category: 'Adventure' },
    { name: 'Coorg', tagline: 'Coffee country in bloom', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', budget: '₹8,000–13,000', reason: 'Pleasant weather, coffee blossom', category: 'Nature' },
    { name: 'Udaipur', tagline: 'City of Lakes romance', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', budget: '₹8,000–14,000', reason: 'Perfect weather for lakes', category: 'Heritage' },
  ],
  2: [ // March
    { name: 'Varanasi', tagline: 'Holi on the ghats', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600', budget: '₹6,000–10,000', reason: 'Holi festival celebrations', category: 'Cultural' },
    { name: 'Darjeeling', tagline: 'Spring blooms & tea gardens', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹10,000–16,000', reason: 'Rhododendron blooms', category: 'Nature' },
    { name: 'Hampi', tagline: 'Ancient ruins in golden light', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600', budget: '₹5,000–10,000', reason: 'Last cool month to explore', category: 'Heritage' },
    { name: 'Pondicherry', tagline: 'French charm by the sea', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', budget: '₹7,000–12,000', reason: 'Pleasant coastal weather', category: 'Beach' },
    { name: 'Kaziranga', tagline: 'Spot the one-horned rhino', imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', budget: '₹12,000–18,000', reason: 'Safari season begins', category: 'Wildlife' },
    { name: 'Shimla', tagline: 'Queen of Hills awakens', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹10,000–16,000', reason: 'Spring weather, fewer crowds', category: 'Hills' },
  ],
  3: [ // April
    { name: 'Munnar', tagline: 'Lush green tea paradise', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', budget: '₹8,000–14,000', reason: 'Neelakurinji preparations', category: 'Nature' },
    { name: 'Ooty', tagline: 'Summer in the Nilgiris', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹8,000–13,000', reason: 'Perfect hill station weather', category: 'Hills' },
    { name: 'Sikkim', tagline: 'Rhododendron wonderland', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹15,000–22,000', reason: 'Flower festival season', category: 'Nature' },
    { name: 'Kodaikanal', tagline: 'Princess of hill stations', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹7,000–12,000', reason: 'Summer escape', category: 'Hills' },
    { name: 'Wayanad', tagline: 'Kerala\'s green crown', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', budget: '₹7,000–12,000', reason: 'Waterfalls at full flow', category: 'Nature' },
    { name: 'Manali', tagline: 'Adventure in the mountains', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹12,000–20,000', reason: 'Summer season begins', category: 'Adventure' },
  ],
  4: [ // May
    { name: 'Shimla', tagline: 'Cool hill station escape', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹12,000–18,000', reason: 'Peak summer retreat', category: 'Hills' },
    { name: 'Manali', tagline: 'Snow-capped adventure hub', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹14,000–22,000', reason: 'Rohtang Pass opens', category: 'Adventure' },
    { name: 'Ladakh', tagline: 'Land of high passes', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹25,000–40,000', reason: 'Season opening', category: 'Adventure' },
    { name: 'Darjeeling', tagline: 'Tea garden summer bliss', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹10,000–16,000', reason: 'Clear Kanchenjunga views', category: 'Hills' },
    { name: 'Mussoorie', tagline: 'Queen of the Hills', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹10,000–16,000', reason: 'Summer escape from heat', category: 'Hills' },
    { name: 'Pahalgam', tagline: 'Valley of shepherds', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹15,000–25,000', reason: 'Amarnath Yatra preparation', category: 'Nature' },
  ],
  5: [ // June
    { name: 'Leh-Ladakh', tagline: 'Ultimate road trip awaits', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹25,000–40,000', reason: 'Best biking season', category: 'Adventure' },
    { name: 'Spiti Valley', tagline: 'Middle land moonscape', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹15,000–25,000', reason: 'Roads fully open', category: 'Adventure' },
    { name: 'Coorg', tagline: 'Monsoon magic begins', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', budget: '₹7,000–12,000', reason: 'Early monsoon lush greenery', category: 'Nature' },
    { name: 'Valley of Flowers', tagline: 'Trek to alpine meadows', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹12,000–18,000', reason: 'Trek season starts', category: 'Adventure' },
    { name: 'Srinagar', tagline: 'Paradise on earth', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹15,000–25,000', reason: 'Summer in Kashmir', category: 'Nature' },
    { name: 'Nainital', tagline: 'Lake city charm', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹8,000–14,000', reason: 'Pre-monsoon beauty', category: 'Hills' },
  ],
  6: [ // July
    { name: 'Ladakh', tagline: 'Pangong Lake in summer', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹25,000–40,000', reason: 'Peak summer season', category: 'Adventure' },
    { name: 'Coorg', tagline: 'Monsoon coffee country', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', budget: '₹6,000–10,000', reason: 'Offseason deals, lush green', category: 'Nature' },
    { name: 'Meghalaya', tagline: 'Wettest place on earth', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', budget: '₹12,000–20,000', reason: 'Living root bridges in rain', category: 'Nature' },
    { name: 'Udaipur', tagline: 'Lakes filled to the brim', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', budget: '₹7,000–12,000', reason: 'Monsoon romance', category: 'Heritage' },
    { name: 'Goa', tagline: 'Offseason coastal charm', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', budget: '₹5,000–10,000', reason: 'Budget-friendly monsoon', category: 'Beach' },
    { name: 'Lonavala', tagline: 'Monsoon waterfalls', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', budget: '₹4,000–8,000', reason: 'Waterfalls come alive', category: 'Nature' },
  ],
  7: [ // August
    { name: 'Valley of Flowers', tagline: 'Alpine blooms at peak', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹12,000–18,000', reason: 'Full bloom season', category: 'Nature' },
    { name: 'Spiti Valley', tagline: 'Rain shadow serenity', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹15,000–25,000', reason: 'No monsoon here', category: 'Adventure' },
    { name: 'Munnar', tagline: 'Monsoon tea country', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', budget: '₹6,000–10,000', reason: 'Misty landscapes, offseason', category: 'Nature' },
    { name: 'Tirthan Valley', tagline: 'Hidden Himalayan gem', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹8,000–14,000', reason: 'River trout fishing', category: 'Nature' },
    { name: 'Cherrapunji', tagline: 'Rainfall capital magic', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', budget: '₹10,000–16,000', reason: 'Peak monsoon spectacle', category: 'Nature' },
    { name: 'Ladakh', tagline: 'Last call before winter', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹25,000–40,000', reason: 'Monastery festivals', category: 'Adventure' },
  ],
  8: [ // September
    { name: 'Rishikesh', tagline: 'Rafting season returns', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹8,000–14,000', reason: 'River rafting season opens', category: 'Adventure' },
    { name: 'Udaipur', tagline: 'Post-monsoon glow', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', budget: '₹8,000–14,000', reason: 'Full lakes, green hills', category: 'Heritage' },
    { name: 'Coorg', tagline: 'Post-monsoon paradise', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600', budget: '₹7,000–12,000', reason: 'Lush green, waterfalls', category: 'Nature' },
    { name: 'Agra', tagline: 'Taj in monsoon glory', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', budget: '₹6,000–10,000', reason: 'Fewer crowds, good weather', category: 'Heritage' },
    { name: 'Sikkim', tagline: 'Post-monsoon clarity', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹14,000–22,000', reason: 'Clear mountain views return', category: 'Nature' },
    { name: 'Jim Corbett', tagline: 'Wildlife awakens', imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', budget: '₹12,000–18,000', reason: 'Park reopens post-monsoon', category: 'Wildlife' },
  ],
  9: [ // October
    { name: 'Jaipur', tagline: 'Festival season in Pink City', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', budget: '₹8,000–12,000', reason: 'Dussehra celebrations', category: 'Heritage' },
    { name: 'Varanasi', tagline: 'Diwali on the Ganges', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600', budget: '₹6,000–10,000', reason: 'Dev Deepavali preparations', category: 'Cultural' },
    { name: 'Goa', tagline: 'Beach season kicks off', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', budget: '₹8,000–14,000', reason: 'Tourist season begins', category: 'Beach' },
    { name: 'Jim Corbett', tagline: 'Tiger spotting prime time', imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600', budget: '₹14,000–20,000', reason: 'Best safari sightings', category: 'Wildlife' },
    { name: 'Munnar', tagline: 'Post-monsoon paradise', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', budget: '₹8,000–14,000', reason: 'Clear views, cool weather', category: 'Nature' },
    { name: 'Darjeeling', tagline: 'Autumn in the hills', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹10,000–16,000', reason: 'Clear skies, tea harvest', category: 'Hills' },
  ],
  10: [ // November
    { name: 'Goa', tagline: 'Peak season paradise', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', budget: '₹10,000–16,000', reason: 'Sunburn Festival, perfect weather', category: 'Beach' },
    { name: 'Rajasthan', tagline: 'Desert in perfect weather', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', budget: '₹10,000–18,000', reason: 'Pushkar Camel Fair', category: 'Cultural' },
    { name: 'Hampi', tagline: 'Ruins in golden light', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600', budget: '₹5,000–9,000', reason: 'Hampi Festival', category: 'Heritage' },
    { name: 'Andaman', tagline: 'Island hopping bliss', imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', budget: '₹25,000–40,000', reason: 'Diving season begins', category: 'Beach' },
    { name: 'Rann of Kutch', tagline: 'White desert magic', imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600', budget: '₹10,000–18,000', reason: 'Rann Utsav begins', category: 'Cultural' },
    { name: 'Varanasi', tagline: 'Dev Deepavali spectacle', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600', budget: '₹6,000–10,000', reason: 'Millions of diyas on ghats', category: 'Cultural' },
  ],
  11: [ // December
    { name: 'Goa', tagline: 'New Year beach bash', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', budget: '₹12,000–20,000', reason: 'Christmas & NYE parties', category: 'Beach' },
    { name: 'Jaipur', tagline: 'Winter heritage walk', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', budget: '₹8,000–12,000', reason: 'Literature Festival prep', category: 'Heritage' },
    { name: 'Manali', tagline: 'Fresh snowfall magic', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47a4f7d3a4a3?w=600', budget: '₹14,000–22,000', reason: 'First snowfall season', category: 'Hills' },
    { name: 'Alleppey', tagline: 'Warm winter on water', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', budget: '₹8,000–14,000', reason: 'Perfect houseboat weather', category: 'Nature' },
    { name: 'Andaman', tagline: 'Winter tropical escape', imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', budget: '₹25,000–40,000', reason: 'Peak diving & snorkeling', category: 'Beach' },
    { name: 'Rishikesh', tagline: 'Yoga & adventure in winter', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', budget: '₹8,000–14,000', reason: 'Rafting + spiritual retreats', category: 'Adventure' },
  ],
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const categoryColors: Record<string, string> = {
  Beach: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  Heritage: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  Nature: 'bg-green-500/10 text-green-700 dark:text-green-300',
  Adventure: 'bg-red-500/10 text-red-700 dark:text-red-300',
  Hills: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  Cultural: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  Wildlife: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
};

const MonthlyDestinations = () => {
  const currentMonth = new Date().getMonth();
  const places = monthlyData[currentMonth] || monthlyData[0];
  const monthName = monthNames[currentMonth];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollSnaps = emblaApi?.scrollSnapList() || [];

  return (
    <section className="py-20 px-4 bg-muted/30" id="monthly-picks">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Updated for {monthName}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Top 6 Places to Visit in <span className="text-gradient">{monthName}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked destinations perfect for this time of year — ideal weather, festivals, and unforgettable experiences
          </p>
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-card hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-card hidden md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {places.map((place, i) => (
                <div key={place.name} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 min-w-0">
                  <Card className="overflow-hidden group/card hover:-translate-y-1 transition-all duration-300 shadow-card hover:shadow-card-hover border-none bg-gradient-card h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={place.imageUrl}
                        alt={`${place.name} travel destination`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={categoryColors[place.category] || 'bg-muted text-muted-foreground'}>
                          {place.category}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary text-primary-foreground font-bold">
                          #{i + 1}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-bold text-xl">{place.name}</h3>
                        <p className="text-white/80 text-sm">{place.tagline}</p>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span className="font-semibold text-foreground">{place.budget}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{monthName}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{place.reason}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? 'w-6 bg-primary' : 'w-2 bg-primary/30'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyDestinations;
