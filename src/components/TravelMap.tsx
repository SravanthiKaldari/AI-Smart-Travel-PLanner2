import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import type { TravelRecommendation } from '@/lib/travelData';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface TravelMapProps {
  recommendation: TravelRecommendation;
}

const TravelMap = ({ recommendation }: TravelMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with OpenStreetMap tiles (free, no API key required)
    map.current = L.map(mapContainer.current).setView(
      [recommendation.coordinates[1], recommendation.coordinates[0]], // Leaflet uses [lat, lng]
      12
    );

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add zoom control
    map.current.zoomControl.setPosition('topright');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
    }

    // Create custom icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(217, 91%, 60%) 100%);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 3px solid white;
          cursor: pointer;
          font-size: 14px;
        ">
          📍
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    // Add marker for the destination (Leaflet uses [lat, lng])
    const latlng: L.LatLngExpression = [recommendation.coordinates[1], recommendation.coordinates[0]];
    
    marker.current = L.marker(latlng, { icon: customIcon })
      .addTo(map.current)
      .bindPopup(`
        <div style="padding: 8px; min-width: 150px;">
          <h3 style="font-weight: bold; margin-bottom: 4px; color: hsl(221, 83%, 53%);">${recommendation.destination}</h3>
          <p style="font-size: 14px; margin-bottom: 4px;">₹${recommendation.totalCost.toLocaleString('en-IN')}</p>
          <p style="font-size: 12px; color: #666;">Best: ${recommendation.bestMonth}</p>
        </div>
      `);

    // Fly to the destination
    map.current.flyTo(latlng, 12, {
      duration: 1.5,
    });
  }, [recommendation]);

  return (
    <Card className="shadow-card bg-gradient-card overflow-hidden">
      <CardContent className="p-0">
        <div ref={mapContainer} className="w-full h-[500px]" />
      </CardContent>
    </Card>
  );
};

export default TravelMap;
