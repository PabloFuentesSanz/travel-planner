import { MapPin } from 'lucide-react';
import type { Trip } from '../../types/database';

interface MapViewProps {
  trip: Trip;
}

const MapView = ({ trip }: MapViewProps) => {
  // Por ahora es un placeholder, más adelante integraremos Google Maps o Mapbox
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative flex items-center justify-center border-l border-[rgb(var(--gray-200))]">
      {/* Placeholder Map */}
      <div className="text-center">
        <div className="w-16 h-16 bg-[rgb(var(--coral))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={32} className="text-[rgb(var(--coral))]" />
        </div>
        <h3 className="text-lg font-semibold text-[rgb(var(--black))] mb-2">
          Mapa Interactivo
        </h3>
        <p className="text-[rgb(var(--gray-300))] max-w-sm">
          {trip.destination ? 
            `Explorando ${trip.destination}` : 
            'Aquí aparecerá el mapa de tu destino'
          }
        </p>
        <p className="text-sm text-[rgb(var(--gray-300))] mt-4">
          🚧 Próximamente: Mapa interactivo con itinerario
        </p>
      </div>

      {/* Floating Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <button className="bg-white rounded-lg p-3 shadow-sm border border-[rgb(var(--gray-200))] hover:shadow-md transition-shadow">
          <MapPin size={20} className="text-[rgb(var(--coral))]" />
        </button>
      </div>

      {/* Destination Pin (if exists) */}
      {trip.destination && (
        <div className="absolute bottom-6 left-6 bg-white rounded-lg px-4 py-2 shadow-sm border border-[rgb(var(--gray-200))]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[rgb(var(--coral))] rounded-full"></div>
            <span className="text-sm font-medium text-[rgb(var(--black))]">
              {trip.destination}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;