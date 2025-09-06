import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Navigation, RefreshCw, Maximize2 } from 'lucide-react';
import L from 'leaflet';
import { GeocodingService, type Coordinates } from '../../services/geocodingService';
import type { Trip } from '../../types/database';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  trip: Trip;
}

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="w-8 h-8 bg-[${color}] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const MapView = ({ trip }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>(() => 
    GeocodingService.getDefaultCoordinates(trip.destination)
  );
  const [loading, setLoading] = useState(false);
  const [geocodedPlace, setGeocodedPlace] = useState<string>('');

  // Geocode destination on mount or when destination changes
  useEffect(() => {
    const geocodeDestination = async () => {
      if (!trip.destination) return;

      setLoading(true);
      const result = await GeocodingService.geocodeDestination(trip.destination);
      
      if (result) {
        setCoordinates(result.coordinates);
        setGeocodedPlace(result.placeName);
        
        // Fly to new coordinates if map is loaded
        if (mapRef.current) {
          mapRef.current.flyTo([result.coordinates.latitude, result.coordinates.longitude], 12, {
            duration: 2
          });
        }
      }
      setLoading(false);
    };

    geocodeDestination();
  }, [trip.destination]);

  const handleRecenterMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([coordinates.latitude, coordinates.longitude], 12, {
        duration: 1
      });
    }
  };

  return (
    <div className="w-full h-full relative border-l border-[rgb(var(--gray-200))]">
      {/* Map Container */}
      <MapContainer
        center={[coordinates.latitude, coordinates.longitude]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Destination Marker */}
        <Marker
          position={[coordinates.latitude, coordinates.longitude]}
          icon={createCustomIcon('rgb(var(--coral))')}
        >
          <Popup>
            <div className="text-center">
              <p className="font-medium text-[rgb(var(--black))]">
                {trip.destination || 'Destino'}
              </p>
              <p className="text-xs text-[rgb(var(--gray-300))] mt-1">
                {trip.title}
              </p>
              {geocodedPlace && geocodedPlace !== trip.destination && (
                <p className="text-xs text-[rgb(var(--gray-300))] mt-1">
                  📍 {geocodedPlace}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Custom Controls */}
      <div className="absolute top-4 right-3 space-y-2 z-[1000]">
        <button
          onClick={handleRecenterMap}
          disabled={loading}
          className="bg-white rounded-lg p-3 shadow-sm border border-[rgb(var(--gray-200))] hover:shadow-md transition-shadow disabled:opacity-50"
          title="Recentrar mapa"
        >
          {loading ? (
            <RefreshCw size={20} className="text-[rgb(var(--coral))] animate-spin" />
          ) : (
            <Navigation size={20} className="text-[rgb(var(--coral))]" />
          )}
        </button>
      </div>

      {/* Trip Info Overlay */}
      {trip.destination && (
        <div className="absolute bottom-6 left-6 bg-white rounded-lg px-4 py-3 shadow-sm border border-[rgb(var(--gray-200))] max-w-xs z-[1000]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[rgb(var(--coral))] rounded-full flex-shrink-0"></div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[rgb(var(--black))] truncate">
                {trip.destination}
              </p>

            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000]">
          <div className="bg-white rounded-lg p-3 shadow-lg border border-[rgb(var(--gray-200))]">
            <RefreshCw size={20} className="text-[rgb(var(--coral))] animate-spin" />
          </div>
        </div>
      )}

      {/* Map Attribution */}
      <div className="absolute bottom-2 right-2 bg-white/90 rounded px-2 py-1 text-xs text-[rgb(var(--gray-300))] z-[1000]">
        Powered by OpenStreetMap
      </div>
    </div>
  );
};

export default MapView;