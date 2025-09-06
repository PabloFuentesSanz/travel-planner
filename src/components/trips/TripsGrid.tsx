import TripCard from './TripCard';
import type { Trip } from '../../types/database';

interface TripsGridProps {
  trips: Trip[];
  loading?: boolean;
}

const TripsGrid = ({ trips, loading = false }: TripsGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loading Skeletons */}
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-[rgb(var(--gray-200))] animate-pulse"
          >
            <div className="aspect-video w-full rounded-t-xl bg-[rgb(var(--gray-100))]" />
            <div className="p-4">
              <div className="h-5 bg-[rgb(var(--gray-100))] rounded mb-3" />
              <div className="flex items-center justify-between">
                <div className="h-6 w-6 bg-[rgb(var(--gray-100))] rounded-full" />
                <div className="h-4 bg-[rgb(var(--gray-100))] rounded w-20" />
              </div>
              <div className="mt-2 h-4 bg-[rgb(var(--gray-100))] rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
};

export default TripsGrid;