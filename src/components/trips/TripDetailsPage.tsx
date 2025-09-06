import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '../ui';
import { TripService } from '../../services/tripService';
import TripDetailsPanel from './TripDetailsPanel';
import MapView from '../map/MapView';
import type { Trip } from '../../types/database';

const TripDetailsPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTripUpdate = (updatedTrip: Trip) => {
    setTrip(updatedTrip);
  };

  useEffect(() => {
    if (!tripId) return;

    const fetchTrip = async () => {
      setLoading(true);
      const { trip: fetchedTrip, error: fetchError } = await TripService.getTripById(tripId);
      
      if (fetchError) {
        setError(fetchError);
      } else {
        setTrip(fetchedTrip);
      }
      
      setLoading(false);
    };

    fetchTrip();
  }, [tripId]);

  if (!tripId) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--gray-50))] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[rgb(var(--coral))] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[rgb(var(--gray-300))]">Cargando viaje...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[rgb(var(--gray-50))] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-[rgb(var(--black))] mb-2">
            {error || 'Viaje no encontrado'}
          </h2>
          <p className="text-[rgb(var(--gray-300))] mb-6">
            No pudimos cargar la información de este viaje.
          </p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header fijo */}
      <div className="bg-white border-b border-[rgb(var(--gray-200))] flex-shrink-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-[rgb(var(--gray-300))]"
            >
              <ArrowLeft size={18} />
              Volver
            </Button>
            
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-[rgb(var(--coral))]" />
              <h1 className="text-xl font-bold text-[rgb(var(--black))]">
                Ryoko
              </h1>
              <span className="text-[rgb(var(--gray-300))]">•</span>
              <span className="text-[rgb(var(--gray-300))]">
                {trip.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout dividido */}
      <div className="flex-1 flex min-h-0">
        {/* Panel de detalles - Lado izquierdo */}
        <div className="w-1/2 flex-shrink-0">
          <TripDetailsPanel trip={trip} onTripUpdate={handleTripUpdate} />
        </div>
        
        {/* Mapa - Lado derecho */}
        <div className="w-1/2 flex-shrink-0">
          <MapView trip={trip} />
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;