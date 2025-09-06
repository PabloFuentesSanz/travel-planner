import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { Trip } from '../../types/database';

interface TripCardProps {
  trip: Trip;
}

const TripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startMonth = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const endMonth = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    
    return `${startMonth} - ${endMonth}`;
  };

  const getStatusBadge = (status: Trip['status']) => {
    const statusConfig = {
      planning: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Planificando' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmado' },
      ongoing: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En curso' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completado' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleClick = () => {
    navigate(`/trip/${trip.id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-[rgb(var(--gray-200))] hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      {/* Trip Image */}
      <div className="aspect-video w-full rounded-t-xl overflow-hidden bg-[rgb(var(--gray-50))] relative">
        {trip.cover_image_url ? (
          <img
            src={trip.cover_image_url}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[rgb(var(--coral))]/10 to-[rgb(var(--coral))]/20">
            <MapPin size={48} className="text-[rgb(var(--coral))]/50" />
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge(trip.status)}
        </div>
      </div>

      {/* Trip Content */}
      <div className="p-4">
        {/* Trip Title */}
        <h4 className="text-lg font-semibold text-[rgb(var(--black))] mb-2 group-hover:text-[rgb(var(--coral))] transition-colors">
          {trip.title}
        </h4>

        {/* Trip Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* User Avatar - Owner for now */}
            <div className="flex -space-x-1">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Owner"
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[rgb(var(--coral))] border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {(user?.user_metadata?.full_name || user?.email || '?')[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1 text-sm text-[rgb(var(--gray-300))]">
            <Calendar size={14} />
            <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
          </div>
        </div>

        {/* Destination */}
        {trip.destination && (
          <div className="mt-2 flex items-center gap-1 text-sm text-[rgb(var(--gray-300))]">
            <MapPin size={14} />
            <span>{trip.destination}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCard;