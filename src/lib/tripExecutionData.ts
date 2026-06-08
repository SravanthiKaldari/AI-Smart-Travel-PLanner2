// Static data for trip execution - stations, hotels, restaurants, nearby spots per destination

export interface TransportSchedule {
  number: string;
  name: string;
  departure: string;
  arrival: string;
  duration: string;
  availableDays: string[];
  fare: string;
  type?: string; // e.g. 'Superfast', 'Express', 'Non-stop', 'AC Sleeper'
}

export interface NearbyStation {
  name: string;
  type: 'railway' | 'airport' | 'bus_stand';
  distance: string;
  city: string;
  code?: string;
  schedules?: TransportSchedule[];
}

export interface HotelRecommendation {
  name: string;
  rating: number;
  priceRange: string;
  type: 'budget' | 'mid-range' | 'luxury';
  amenities: string[];
  location: string;
}

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  specialty: string;
  location: string;
}

export interface NearbyAttraction {
  name: string;
  distance: string;
  type: string;
  description: string;
}

export interface TravelGuideline {
  step: number;
  title: string;
  description: string;
  icon: 'start' | 'travel' | 'arrive' | 'checkin' | 'explore';
}

export interface DestinationExecutionData {
  stations: NearbyStation[];
  hotels: HotelRecommendation[];
  restaurants: RestaurantRecommendation[];
  nearbyAttractions: NearbyAttraction[];
  guidelines: TravelGuideline[];
}

const destinationData: Record<string, DestinationExecutionData> = {
  'Goa': {
    stations: [
      {
        name: 'Dabolim Airport (GOI)', type: 'airport', distance: '30 km from Panaji', city: 'Goa', code: 'GOI',
        schedules: [
          { number: '6E-2045', name: 'IndiGo', departure: '06:15', arrival: '08:30', duration: '2h 15m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹3,500–6,200', type: 'Non-stop' },
          { number: 'AI-883', name: 'Air India', departure: '10:40', arrival: '13:00', duration: '2h 20m', availableDays: ['Mon', 'Wed', 'Fri', 'Sun'], fare: '₹4,200–8,500', type: 'Non-stop' },
          { number: 'SG-8169', name: 'SpiceJet', departure: '14:30', arrival: '16:50', duration: '2h 20m', availableDays: ['Tue', 'Thu', 'Sat'], fare: '₹3,200–5,800', type: 'Non-stop' },
          { number: 'UK-835', name: 'Vistara', departure: '19:00', arrival: '21:15', duration: '2h 15m', availableDays: ['Mon', 'Wed', 'Fri'], fare: '₹4,800–9,000', type: 'Non-stop' },
        ],
      },
      {
        name: 'Madgaon Junction', type: 'railway', distance: '35 km from Panaji', city: 'Margao', code: 'MAO',
        schedules: [
          { number: '12133', name: 'Mumbai CSMT – Madgaon SF Express', departure: '23:05', arrival: '11:15', duration: '12h 10m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹450–1,800', type: 'Superfast' },
          { number: '10103', name: 'Mandovi Express', departure: '07:10', arrival: '19:25', duration: '12h 15m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹400–1,600', type: 'Express' },
          { number: '12779', name: 'Goa Express (Vasco)', departure: '15:00', arrival: '05:40+1', duration: '14h 40m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹500–2,100', type: 'Superfast' },
          { number: '12431', name: 'Rajdhani Express (Trivandrum)', departure: '11:30', arrival: '06:30+1', duration: '19h', availableDays: ['Wed', 'Sat'], fare: '₹1,800–4,500', type: 'Rajdhani' },
        ],
      },
      {
        name: 'Thivim Railway Station', type: 'railway', distance: '20 km from Panaji', city: 'Thivim', code: 'THVM',
        schedules: [
          { number: '12133', name: 'Mumbai CSMT – Madgaon SF Express', departure: '22:30', arrival: '10:40', duration: '12h 10m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹450–1,800', type: 'Superfast' },
          { number: '10103', name: 'Mandovi Express', departure: '06:40', arrival: '18:50', duration: '12h 10m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹400–1,600', type: 'Express' },
        ],
      },
      {
        name: 'Kadamba Bus Stand', type: 'bus_stand', distance: '2 km from Panaji', city: 'Panaji', code: 'KBS',
        schedules: [
          { number: 'KTC-GOA-01', name: 'KSRTC Airavat Club Class', departure: '18:00', arrival: '06:30', duration: '12h 30m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹1,200–1,800', type: 'AC Sleeper' },
          { number: 'KTC-GOA-02', name: 'Paulo Travels Volvo', departure: '19:30', arrival: '07:00', duration: '11h 30m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹900–1,500', type: 'AC Semi-Sleeper' },
          { number: 'KTC-GOA-03', name: 'Neeta Travels Non-AC', departure: '20:00', arrival: '08:00', duration: '12h', availableDays: ['Mon', 'Wed', 'Fri'], fare: '₹500–800', type: 'Non-AC Sleeper' },
          { number: 'KTC-GOA-04', name: 'RedBus Express AC', departure: '21:30', arrival: '09:30', duration: '12h', availableDays: ['Mon', 'Tue', 'Thu', 'Sat'], fare: '₹700–1,100', type: 'AC Seater' },
        ],
      },
    ],
    hotels: [
      { name: 'Taj Fort Aguada Resort', rating: 4.8, priceRange: '₹8,000-15,000/night', type: 'luxury', amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant'], location: 'Sinquerim' },
      { name: 'Country Inn & Suites', rating: 4.3, priceRange: '₹3,500-6,000/night', type: 'mid-range', amenities: ['Pool', 'WiFi', 'Breakfast', 'Gym'], location: 'Candolim' },
      { name: 'OYO Rooms Calangute', rating: 3.8, priceRange: '₹800-1,500/night', type: 'budget', amenities: ['WiFi', 'AC', 'Parking'], location: 'Calangute' },
    ],
    restaurants: [
      { name: 'Fisherman\'s Wharf', cuisine: 'Goan Seafood', rating: 4.6, priceRange: '₹800-1,500', specialty: 'Fish Thali & Prawn Curry', location: 'Cavelossim' },
      { name: 'Gunpowder', cuisine: 'South Indian', rating: 4.5, priceRange: '₹600-1,200', specialty: 'Kerala Parotta & Fish Curry', location: 'Assagao' },
      { name: 'Ritz Classic', cuisine: 'Goan', rating: 4.4, priceRange: '₹300-600', specialty: 'Pork Vindaloo', location: 'Panaji' },
    ],
    nearbyAttractions: [
      { name: 'Dudhsagar Falls', distance: '60 km', type: 'Waterfall', description: 'One of India\'s tallest waterfalls at 310m' },
      { name: 'Fort Aguada', distance: '15 km', type: 'Heritage', description: '17th-century Portuguese fort with lighthouse' },
      { name: 'Basilica of Bom Jesus', distance: '10 km', type: 'Heritage', description: 'UNESCO World Heritage Site, houses St. Francis Xavier\'s remains' },
      { name: 'Anjuna Flea Market', distance: '18 km', type: 'Shopping', description: 'Famous Wednesday flea market with souvenirs' },
    ],
    guidelines: [
      { step: 1, title: 'Start Your Journey', description: 'Head to the nearest station/airport from your location. Book tickets in advance for better prices.', icon: 'start' },
      { step: 2, title: 'Board Your Transport', description: 'Arrive at the station 30-60 minutes before departure. Keep your ID and tickets handy.', icon: 'travel' },
      { step: 3, title: 'Arrive at Destination', description: 'Reach Goa and take a pre-booked taxi or local transport to your hotel.', icon: 'arrive' },
      { step: 4, title: 'Hotel Check-In', description: 'Check into your hotel, freshen up, and plan your day\'s itinerary.', icon: 'checkin' },
      { step: 5, title: 'Explore & Enjoy', description: 'Visit beaches, try local food, and explore nearby attractions as per your itinerary.', icon: 'explore' },
    ],
  },
  'Shimla': {
    stations: [
      {
        name: 'Shimla Railway Station', type: 'railway', distance: 'City center', city: 'Shimla', code: 'SML',
        schedules: [
          { number: '52451', name: 'Kalka–Shimla Heritage Toy Train', departure: '05:20', arrival: '10:25', duration: '5h 05m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹30–700', type: 'Heritage' },
          { number: '52455', name: 'Shivalik Deluxe Express', departure: '05:50', arrival: '10:30', duration: '4h 40m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹300–600', type: 'Deluxe' },
          { number: '52453', name: 'Rail Motor Car', departure: '10:35', arrival: '15:20', duration: '4h 45m', availableDays: ['Mon', 'Wed', 'Fri', 'Sat'], fare: '₹250–500', type: 'Express' },
        ],
      },
      {
        name: 'Kalka Railway Station', type: 'railway', distance: '90 km (Toy train from here)', city: 'Kalka', code: 'KLK',
        schedules: [
          { number: '12011', name: 'Kalka Shatabdi Express', departure: '07:40', arrival: '11:40', duration: '4h', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], fare: '₹700–1,500', type: 'Shatabdi' },
          { number: '12005', name: 'Kalka–Delhi Shatabdi Express', departure: '17:55', arrival: '21:35', duration: '3h 40m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], fare: '₹700–1,500', type: 'Shatabdi' },
          { number: '14095', name: 'Himalayan Queen', departure: '05:50', arrival: '11:40', duration: '5h 50m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹150–600', type: 'Express' },
        ],
      },
      {
        name: 'Chandigarh Airport (IXC)', type: 'airport', distance: '115 km', city: 'Chandigarh', code: 'IXC',
        schedules: [
          { number: '6E-5312', name: 'IndiGo', departure: '07:00', arrival: '09:10', duration: '2h 10m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹3,000–5,500', type: 'Non-stop' },
          { number: 'AI-9621', name: 'Air India Regional', departure: '12:30', arrival: '14:40', duration: '2h 10m', availableDays: ['Mon', 'Wed', 'Fri'], fare: '₹3,800–7,000', type: 'Non-stop' },
          { number: 'SG-2967', name: 'SpiceJet', departure: '16:45', arrival: '18:55', duration: '2h 10m', availableDays: ['Tue', 'Thu', 'Sat', 'Sun'], fare: '₹2,800–5,200', type: 'Non-stop' },
        ],
      },
      {
        name: 'ISBT Shimla', type: 'bus_stand', distance: 'City center', city: 'Shimla', code: 'ISBT-SML',
        schedules: [
          { number: 'HRTC-SML-01', name: 'HRTC Volvo AC', departure: '20:30', arrival: '07:00', duration: '10h 30m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹800–1,200', type: 'AC Sleeper' },
          { number: 'HRTC-SML-02', name: 'HRTC Ordinary', departure: '06:00', arrival: '16:00', duration: '10h', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹350–500', type: 'Non-AC' },
          { number: 'HRTC-SML-03', name: 'HRTC Deluxe Semi-Sleeper', departure: '22:00', arrival: '08:30', duration: '10h 30m', availableDays: ['Mon', 'Wed', 'Fri', 'Sun'], fare: '₹600–900', type: 'Semi-Sleeper' },
        ],
      },
    ],
    hotels: [
      { name: 'The Oberoi Cecil', rating: 4.9, priceRange: '₹12,000-25,000/night', type: 'luxury', amenities: ['Heritage', 'Spa', 'Restaurant', 'Valley View'], location: 'Mall Road' },
      { name: 'Hotel Willow Banks', rating: 4.2, priceRange: '₹2,500-5,000/night', type: 'mid-range', amenities: ['WiFi', 'Restaurant', 'Room Service'], location: 'Mall Road' },
      { name: 'Hotel Dreamland', rating: 3.7, priceRange: '₹700-1,200/night', type: 'budget', amenities: ['WiFi', 'Hot Water', 'Parking'], location: 'Near Bus Stand' },
    ],
    restaurants: [
      { name: 'Cafe Simla Times', cuisine: 'Continental', rating: 4.5, priceRange: '₹500-1,000', specialty: 'Wood-fired Pizza & Coffee', location: 'Mall Road' },
      { name: 'Baljees Restaurant', cuisine: 'North Indian', rating: 4.3, priceRange: '₹300-700', specialty: 'Butter Chicken & Naan', location: 'The Ridge' },
      { name: 'Wake & Bake', cuisine: 'Cafe', rating: 4.4, priceRange: '₹200-500', specialty: 'Pancakes & Hot Chocolate', location: 'Mall Road' },
    ],
    nearbyAttractions: [
      { name: 'Kufri', distance: '16 km', type: 'Hill Station', description: 'Skiing, horse riding, and adventure sports' },
      { name: 'Chail', distance: '45 km', type: 'Hill Station', description: 'World\'s highest cricket ground' },
      { name: 'Naldehra', distance: '22 km', type: 'Nature', description: 'India\'s oldest golf course amid deodar forests' },
      { name: 'Mashobra', distance: '12 km', type: 'Nature', description: 'Peaceful village with apple orchards' },
    ],
    guidelines: [
      { step: 1, title: 'Start Your Journey', description: 'Head to the nearest railway station or airport. If flying, reach Chandigarh Airport.', icon: 'start' },
      { step: 2, title: 'Board Your Transport', description: 'Take the heritage Toy Train from Kalka for a scenic ride, or a bus from Chandigarh.', icon: 'travel' },
      { step: 3, title: 'Arrive in Shimla', description: 'Reach Shimla and hire a local taxi to your hotel. Roads are narrow - be prepared for traffic.', icon: 'arrive' },
      { step: 4, title: 'Hotel Check-In', description: 'Check in, wear warm clothes, and take a walk on Mall Road.', icon: 'checkin' },
      { step: 5, title: 'Explore & Enjoy', description: 'Visit The Ridge, Jakhoo Temple, and enjoy the colonial architecture.', icon: 'explore' },
    ],
  },
};

// Generate generic data for destinations not in the detailed list
const generateGenericData = (destinationName: string): DestinationExecutionData => ({
  stations: [
    {
      name: `${destinationName} Railway Station`, type: 'railway', distance: 'City center', city: destinationName, code: 'GEN',
      schedules: [
        { number: '12xxx', name: `${destinationName} Superfast Express`, departure: '06:30', arrival: '14:00', duration: '7h 30m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹350–1,400', type: 'Superfast' },
        { number: '11xxx', name: `${destinationName} Express`, departure: '20:15', arrival: '06:00+1', duration: '9h 45m', availableDays: ['Mon', 'Wed', 'Fri', 'Sun'], fare: '₹250–1,100', type: 'Express' },
        { number: '12xxx', name: `${destinationName} Mail`, departure: '15:30', arrival: '23:45', duration: '8h 15m', availableDays: ['Tue', 'Thu', 'Sat'], fare: '₹300–1,200', type: 'Mail/Express' },
      ],
    },
    {
      name: `Nearest Airport`, type: 'airport', distance: '30-50 km', city: destinationName,
      schedules: [
        { number: '6E-xxxx', name: 'IndiGo', departure: '07:30', arrival: '09:45', duration: '2h 15m', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹3,000–6,000', type: 'Non-stop' },
        { number: 'AI-xxx', name: 'Air India', departure: '13:00', arrival: '15:20', duration: '2h 20m', availableDays: ['Mon', 'Wed', 'Fri'], fare: '₹3,500–7,500', type: 'Non-stop' },
      ],
    },
    {
      name: `${destinationName} Bus Stand`, type: 'bus_stand', distance: 'City center', city: destinationName,
      schedules: [
        { number: 'STC-001', name: 'State Transport AC Sleeper', departure: '20:00', arrival: '06:00', duration: '10h', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹700–1,200', type: 'AC Sleeper' },
        { number: 'PVT-002', name: 'Private Volvo AC', departure: '21:30', arrival: '07:30', duration: '10h', availableDays: ['Mon', 'Wed', 'Fri', 'Sat'], fare: '₹800–1,500', type: 'AC Semi-Sleeper' },
        { number: 'STC-003', name: 'State Transport Ordinary', departure: '08:00', arrival: '18:00', duration: '10h', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fare: '₹300–500', type: 'Non-AC' },
      ],
    },
  ],
  hotels: [
    { name: `${destinationName} Grand Hotel`, rating: 4.5, priceRange: '₹5,000-12,000/night', type: 'luxury', amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], location: 'City Center' },
    { name: `Hotel ${destinationName} Inn`, rating: 4.0, priceRange: '₹2,000-4,000/night', type: 'mid-range', amenities: ['WiFi', 'AC', 'Breakfast', 'Parking'], location: 'Main Area' },
    { name: `Budget Stay ${destinationName}`, rating: 3.5, priceRange: '₹600-1,200/night', type: 'budget', amenities: ['WiFi', 'AC', 'Hot Water'], location: 'Near Bus Stand' },
  ],
  restaurants: [
    { name: `${destinationName} Kitchen`, cuisine: 'Local Cuisine', rating: 4.4, priceRange: '₹500-1,000', specialty: 'Local Specialties', location: 'Main Market' },
    { name: 'The Spice Garden', cuisine: 'Multi-cuisine', rating: 4.2, priceRange: '₹300-700', specialty: 'Thali & Biriyani', location: 'City Center' },
    { name: 'Street Food Corner', cuisine: 'Street Food', rating: 4.0, priceRange: '₹50-200', specialty: 'Local Street Food', location: 'Market Area' },
  ],
  nearbyAttractions: [
    { name: 'Local Heritage Site', distance: '5 km', type: 'Heritage', description: 'Historical monument worth exploring' },
    { name: 'Nature Park', distance: '10 km', type: 'Nature', description: 'Scenic park ideal for morning walks' },
    { name: 'Local Market', distance: '2 km', type: 'Shopping', description: 'Traditional market with local handicrafts' },
  ],
  guidelines: [
    { step: 1, title: 'Start Your Journey', description: 'Head to the nearest station/airport from your location.', icon: 'start' },
    { step: 2, title: 'Board Your Transport', description: 'Arrive early, keep tickets and ID ready.', icon: 'travel' },
    { step: 3, title: 'Arrive at Destination', description: `Reach ${destinationName} and take local transport to your hotel.`, icon: 'arrive' },
    { step: 4, title: 'Hotel Check-In', description: 'Check in, freshen up, and plan your itinerary.', icon: 'checkin' },
    { step: 5, title: 'Explore & Enjoy', description: 'Follow your planned itinerary and enjoy the experience!', icon: 'explore' },
  ],
});

export const getDestinationExecutionData = (destination: string): DestinationExecutionData => {
  return destinationData[destination] || generateGenericData(destination);
};
