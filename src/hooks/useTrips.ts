import { useState, useEffect, useCallback } from 'react';
import { TripService } from '../services/tripService';
import type { Trip } from '../types/database';

export interface UseTripsResult {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  refreshTrips: () => Promise<void>;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  removeTrip: (tripId: string) => void;
}

export const useTrips = (): UseTripsResult => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { trips: userTrips, error: tripError } = await TripService.getUserTrips();
      
      if (tripError) {
        setError(tripError);
      } else {
        setTrips(userTrips);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los viajes');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTrip = useCallback((trip: Trip) => {
    setTrips(prev => [trip, ...prev]);
  }, []);

  const updateTrip = useCallback((tripId: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, ...updates } : trip
    ));
  }, []);

  const removeTrip = useCallback((tripId: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
  }, []);

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  return {
    trips,
    loading,
    error,
    refreshTrips,
    addTrip,
    updateTrip,
    removeTrip,
  };
};