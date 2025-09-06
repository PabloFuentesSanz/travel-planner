import { Calendar, Users, Euro, MapPin, Settings } from 'lucide-react';
import { Button, ImageUploadButton } from '../ui';
import { TripService } from '../../services/tripService';
import { useImageUpload } from '../../hooks';
import type { Trip } from '../../types/database';

interface TripDetailsPanelProps {
  trip: Trip;
  onTripUpdate?: (updatedTrip: Trip) => void;
}

const TripDetailsPanel = ({ trip, onTripUpdate }: TripDetailsPanelProps) => {
  // Image upload hook
  const { uploading, error, uploadImage, clearError } = useImageUpload(
    (file: File) => TripService.updateTripCoverImage(trip.id, file)
  );

  const handleImageUpload = (file: File) => {
    console.log('🖼️ TripDetailsPanel: Starting image upload for file:', file.name);
    uploadImage(file, (imageUrl: string) => {
      console.log('🎉 TripDetailsPanel: Upload success, updating trip with URL:', imageUrl);
      // Update local trip state
      const updatedTrip = { ...trip, cover_image_url: imageUrl };
      console.log('📝 TripDetailsPanel: Updated trip object:', updatedTrip);
      onTripUpdate?.(updatedTrip);
    });
  };

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
    <div className="h-full bg-[rgb(var(--gray-50))] overflow-y-auto">
      {/* Hero Image Section */}
      <div className="relative h-80 bg-gradient-to-br from-[rgb(var(--coral))] to-[rgb(var(--coral-dark))] overflow-hidden">
        {/* Background Image */}
        {trip.cover_image_url ? (
          <>
            <img
              src={trip.cover_image_url}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--coral))] to-[rgb(var(--coral-dark))] opacity-90"></div>
        )}

        {/* Header Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          {/* Top Actions */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${getStatusColor(trip.status)} bg-white/90`}>
                {getStatusText(trip.status)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ImageUploadButton
                onFileSelect={handleImageUpload}
                loading={uploading}
                hasImage={!!trip.cover_image_url}
                size="sm"
                className="backdrop-blur-sm bg-white/90 hover:bg-white text-[rgb(var(--black))] border-white/20"
              />
              <Button 
                variant="secondary" 
                size="sm" 
                className="backdrop-blur-sm bg-white/90 hover:bg-white text-[rgb(var(--black))] border-white/20"
              >
                <Settings size={16} />
              </Button>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
              {trip.title}
            </h1>
            <div className="flex items-center gap-4 text-sm">
              {trip.destination && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {trip.destination}
                </div>
              )}
              {getDuration() && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {getDuration()}
                </div>
              )}
            </div>
            {trip.description && (
              <p className="text-white/90 text-sm mt-3 max-w-2xl drop-shadow">
                {trip.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-red-800 text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Información básica */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))]">
          <h2 className="text-lg font-semibold text-[rgb(var(--black))] mb-4">
            Información del Viaje
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[rgb(var(--coral))]/10 rounded-lg">
                <Calendar size={20} className="text-[rgb(var(--coral))]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-[rgb(var(--black))]">Fechas</h3>
                <div className="text-sm text-[rgb(var(--gray-300))]">
                  {trip.start_date && (
                    <p><span className="font-medium">Inicio:</span> {formatDate(trip.start_date)}</p>
                  )}
                  {trip.end_date && (
                    <p><span className="font-medium">Fin:</span> {formatDate(trip.end_date)}</p>
                  )}
                  {getDuration() && (
                    <p className="mt-1"><span className="font-medium">Duración:</span> {getDuration()}</p>
                  )}
                </div>
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
        </div>

        {/* Acciones Rápidas */}
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
            
            <Button variant="outline" size="sm" className="w-full justify-start" disabled>
              <MapPin size={16} />
              Ver en Mapa
            </Button>
          </div>
        </div>

        {/* Itinerario placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))]">
          <h3 className="font-semibold text-[rgb(var(--black))] mb-4">Itinerario</h3>
          
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[rgb(var(--coral))]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar size={24} className="text-[rgb(var(--coral))]" />
            </div>
            <p className="text-[rgb(var(--gray-300))] text-sm">
              Aquí aparecerá tu itinerario detallado
            </p>
          </div>
        </div>

        {/* Gastos placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))]">
          <h3 className="font-semibold text-[rgb(var(--black))] mb-4">Gastos</h3>
          
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[rgb(var(--coral))]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Euro size={24} className="text-[rgb(var(--coral))]" />
            </div>
            <p className="text-[rgb(var(--gray-300))] text-sm">
              Registra y controla tus gastos de viaje
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPanel;