import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MemberLocation, haversineDistance } from '@/hooks/useGroupTravel';
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Props {
  locations: Record<string, MemberLocation>;
  memberNames: Record<string, string>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const GroupMap = ({ locations, memberNames }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const circlesRef = useRef<Record<string, L.Circle>>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const myMarkerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const colorMapRef = useRef<Record<string, string>>({});
  let colorIndex = 0;

  const getColor = (userId: string) => {
    if (!colorMapRef.current[userId]) {
      colorMapRef.current[userId] = COLORS[colorIndex % COLORS.length];
      colorIndex++;
    }
    return colorMapRef.current[userId];
  };

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add attribution in corner
    L.control.attribution({ position: 'bottomright' }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // "Find Me" - locate current user on map
  const handleFindMe = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const latlng: L.LatLngExpression = [latitude, longitude];
        setMyLocation({ lat: latitude, lng: longitude });

        if (myMarkerRef.current) {
          myMarkerRef.current.setLatLng(latlng);
        } else {
          const icon = L.divIcon({
            className: 'my-location-marker',
            html: `<div style="position:relative;">
              <div style="width:20px;height:20px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(66,133,244,0.5);"></div>
              <div style="position:absolute;top:-2px;left:-2px;width:24px;height:24px;border-radius:50%;border:2px solid #4285F4;animation:ping 1.5s infinite;opacity:0.4;"></div>
            </div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          myMarkerRef.current = L.marker(latlng, { icon, zIndexOffset: 1000 })
            .addTo(mapRef.current!)
            .bindPopup(`<b>📍 You are here</b><br/>Accuracy: ${Math.round(accuracy)}m`);
        }

        // Add accuracy circle
        L.circle(latlng, {
          radius: accuracy,
          color: '#4285F4',
          fillColor: '#4285F4',
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(mapRef.current!);

        mapRef.current!.setView(latlng, 16, { animate: true });
      },
      (err) => console.error('Geolocation error:', err),
      { enableHighAccuracy: true }
    );
  };

  // Update member markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const entries = Object.entries(locations);

    // Calculate group center
    let centerLat = 0, centerLon = 0;
    entries.forEach(([, loc]) => { centerLat += loc.latitude; centerLon += loc.longitude; });
    if (entries.length > 0) {
      centerLat /= entries.length;
      centerLon /= entries.length;
    }

    entries.forEach(([userId, loc]) => {
      const name = memberNames[userId] || 'Member';
      const dist = haversineDistance(loc.latitude, loc.longitude, centerLat, centerLon);
      const isFar = dist > 1;
      const color = getColor(userId);

      const icon = L.divIcon({
        className: 'custom-member-marker',
        html: `<div style="display:flex;flex-direction:column;align-items:center;">
          <div style="background:${isFar ? '#ef4444' : color};color:white;padding:5px 10px;border-radius:16px;font-size:12px;white-space:nowrap;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">
            👤 ${name}${isFar ? ' ⚠️' : ''}
          </div>
          <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${isFar ? '#ef4444' : color};margin-top:-1px;"></div>
          <div style="width:8px;height:8px;background:${isFar ? '#ef4444' : color};border-radius:50%;margin-top:2px;box-shadow:0 0 6px ${isFar ? '#ef4444' : color};"></div>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [50, 55],
      });

      const popupContent = `
        <div style="min-width:160px;">
          <b>${name}</b><br/>
          <span style="font-size:12px;color:#666;">
            📍 ${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}<br/>
            ${isFar 
              ? `⚠️ <span style="color:#ef4444;font-weight:600;">${dist.toFixed(2)}km from group</span>` 
              : `✅ ${dist.toFixed(2)}km from group center`
            }<br/>
            🕐 ${new Date(loc.created_at).toLocaleTimeString()}
          </span>
        </div>
      `;

      if (markersRef.current[userId]) {
        markersRef.current[userId].setLatLng([loc.latitude, loc.longitude]).setIcon(icon);
        markersRef.current[userId].setPopupContent(popupContent);
      } else {
        markersRef.current[userId] = L.marker([loc.latitude, loc.longitude], { icon })
          .addTo(map)
          .bindPopup(popupContent);
      }

      // Accuracy circle for each member
      if (circlesRef.current[userId]) {
        circlesRef.current[userId].setLatLng([loc.latitude, loc.longitude]);
      } else {
        circlesRef.current[userId] = L.circle([loc.latitude, loc.longitude], {
          radius: 50,
          color: color,
          fillColor: color,
          fillOpacity: 0.08,
          weight: 1,
          dashArray: '4',
        }).addTo(map);
      }
    });

    // Draw connecting polyline between all members
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }
    if (entries.length > 1) {
      const points: L.LatLngExpression[] = entries.map(([, l]) => [l.latitude, l.longitude]);
      polylineRef.current = L.polyline(points, {
        color: '#6366f1',
        weight: 2,
        opacity: 0.4,
        dashArray: '8 6',
      }).addTo(map);
    }

    // Fit bounds
    if (entries.length > 0) {
      const allPoints: L.LatLngExpression[] = entries.map(([, l]) => [l.latitude, l.longitude]);
      if (myLocation) allPoints.push([myLocation.lat, myLocation.lng]);
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [locations, memberNames]);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-[450px] rounded-xl overflow-hidden border border-border" />
      {/* Find Me button */}
      <Button
        size="sm"
        variant="default"
        className="absolute top-3 right-3 z-[1000] shadow-lg"
        onClick={handleFindMe}
      >
        <LocateFixed className="w-4 h-4 mr-1" /> Find Me
      </Button>
      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-2 text-xs space-y-1 border border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#4285F4] border-2 border-white" />
          <span>Your location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <span>Member (near group)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span>Member (far away ⚠️)</span>
        </div>
      </div>
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default GroupMap;
