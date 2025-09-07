import { useState, useEffect, useRef } from 'react';
import { Navigation, RefreshCw } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';
import {
  GeocodingService,
  type Coordinates,
} from '../../services/geocodingService';
import type { Trip } from '../../types/database';

interface MapViewProps {
  trip: Trip;
}

// Initialize Google Maps loader
const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places'],
});

const MapView = ({ trip }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>(() =>
    GeocodingService.getDefaultCoordinates(trip.destination)
  );
  const [loading, setLoading] = useState(false);
  const [geocodedPlace, setGeocodedPlace] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        await loader.load();
        
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: coordinates.latitude, lng: coordinates.longitude },
            zoom: 10,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }],
              },
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          googleMapRef.current = map;

          // Add marker
          const marker = new google.maps.Marker({
            position: { lat: coordinates.latitude, lng: coordinates.longitude },
            map: map,
            title: trip.destination || 'Destino',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#FF6B6B',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 12,
            },
          });

          markerRef.current = marker;

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="color: #333; font-family: system-ui;">
                <p style="margin: 0; font-weight: 500;">${trip.destination || 'Destino'}</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${trip.title}</p>
                ${geocodedPlace && geocodedPlace !== trip.destination ? 
                  `<p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">📍 ${geocodedPlace}</p>` : 
                  ''
                }
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (googleMapRef.current && markerRef.current) {
      const newPosition = { lat: coordinates.latitude, lng: coordinates.longitude };
      markerRef.current.setPosition(newPosition);
      googleMapRef.current.panTo(newPosition);
    }
  }, [coordinates]);

  // Geocode destination on mount or when destination changes
  useEffect(() => {
    const geocodeDestination = async () => {
      if (!trip.destination) return;

      setLoading(true);
      const result = await GeocodingService.geocodeDestination(
        trip.destination
      );

      if (result) {
        setCoordinates(result.coordinates);
        setGeocodedPlace(result.placeName);

        // Animate to new coordinates if map is loaded
        if (googleMapRef.current) {
          googleMapRef.current.panTo({
            lat: result.coordinates.latitude,
            lng: result.coordinates.longitude,
          });
          googleMapRef.current.setZoom(12);
        }
      }
      setLoading(false);
    };

    if (mapLoaded) {
      geocodeDestination();
    }
  }, [trip.destination, mapLoaded]);

  const handleRecenterMap = () => {
    if (googleMapRef.current) {
      googleMapRef.current.panTo({
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      });
      googleMapRef.current.setZoom(12);
    }
  };

  return (
    <div className="w-full h-full relative border-l border-[rgb(var(--gray-200))]">
      {/* Google Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* Custom Controls */}
      <div className="absolute top-4 right-3 space-y-2 z-[1000]">
        <button
          onClick={handleRecenterMap}
          disabled={loading}
          className="bg-white rounded-lg p-3 shadow-sm border border-[rgb(var(--gray-200))] hover:shadow-md transition-shadow disabled:opacity-50"
          title="Recentrar mapa"
        >
          {loading ? (
            <RefreshCw
              size={20}
              className="text-[rgb(var(--coral))] animate-spin"
            />
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
            <RefreshCw
              size={20}
              className="text-[rgb(var(--coral))] animate-spin"
            />
          </div>
        </div>
      )}

      {/* Map Attribution */}
      <div className="absolute bottom-2 right-2 bg-white/90 rounded px-2 py-1 text-xs text-[rgb(var(--gray-300))] z-[1000]">
        Powered by Google Maps
      </div>
    </div>
  );
};

export default MapView;
