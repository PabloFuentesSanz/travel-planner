import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Euro, Settings } from 'lucide-react';
import { Button } from '../ui';
import { TripService } from '../../services/tripService';
import type { Trip } from '../../types/database';

const TripDetailsPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDuration = () => {
    if (!trip.start_date || !trip.end_date) return '';
    
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return 'Planificando';
      case 'confirmed': return 'Confirmado';
      case 'ongoing': return 'En curso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--gray-50))]">
      {/* Header */}
      <div className="bg-white border-b border-[rgb(var(--gray-200))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-[rgb(var(--gray-300))]"
              >
                <ArrowLeft size={18} />
                Volver
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-[rgb(var(--black))]">
                  {trip.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                    {getStatusText(trip.status)}
                  </span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm">
              <Settings size={18} />
              Configurar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))]">
              <h2 className="text-lg font-semibold text-[rgb(var(--black))] mb-4">
                Información del Viaje
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[rgb(var(--coral))]/10 rounded-lg">
                    <MapPin size={20} className="text-[rgb(var(--coral))]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[rgb(var(--black))]">Destino</h3>
                    <p className="text-[rgb(var(--gray-300))]">{trip.destination || 'No especificado'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[rgb(var(--coral))]/10 rounded-lg">
                    <Calendar size={20} className="text-[rgb(var(--coral))]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[rgb(var(--black))]">Duración</h3>
                    <p className="text-[rgb(var(--gray-300))]">{getDuration()}</p>
                  </div>
                </div>

                {trip.budget && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[rgb(var(--coral))]/10 rounded-lg">
                      <Euro size={20} className="text-[rgb(var(--coral))]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[rgb(var(--black))]">Presupuesto</h3>
                      <p className="text-[rgb(var(--gray-300))]">
                        {trip.budget} {trip.currency}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {trip.description && (
                <div className="mt-6 pt-6 border-t border-[rgb(var(--gray-200))]">
                  <h3 className="font-medium text-[rgb(var(--black))] mb-2">Descripción</h3>
                  <p className="text-[rgb(var(--gray-300))]">{trip.description}</p>
                </div>
              )}
            </div>

            {/* Coming Soon Section */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-[rgb(var(--gray-200))]">
              <div className="text-center">
                <div className="w-16 h-16 bg-[rgb(var(--coral))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={32} className="text-[rgb(var(--coral))]" />
                </div>
                <h3 className="text-xl font-semibold text-[rgb(var(--black))] mb-2">
                  ¡Más funciones próximamente!
                </h3>
                <p className="text-[rgb(var(--gray-300))] max-w-md mx-auto">
                  Pronto podrás agregar actividades, gestionar gastos, subir documentos y mucho más.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fechas */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))]">
              <h3 className="font-semibold text-[rgb(var(--black))] mb-4">Fechas</h3>
              
              {trip.start_date && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-[rgb(var(--gray-300))]">Inicio</p>
                  <p className="text-[rgb(var(--black))] capitalize">{formatDate(trip.start_date)}</p>
                </div>
              )}
              
              {trip.end_date && (
                <div>
                  <p className="text-sm font-medium text-[rgb(var(--gray-300))]">Fin</p>
                  <p className="text-[rgb(var(--black))] capitalize">{formatDate(trip.end_date)}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))]">
              <h3 className="font-semibold text-[rgb(var(--black))] mb-4">Acciones Rápidas</h3>
              
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" disabled>
                  <Calendar size={16} />
                  Añadir Actividad
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start" disabled>
                  <Euro size={16} />
                  Registrar Gasto
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start" disabled>
                  <Users size={16} />
                  Invitar Personas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;