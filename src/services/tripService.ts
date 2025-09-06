/* eslint-disable */
/* @ts-nocheck */
import { supabase } from '../lib/supabase';
import type { Trip } from '../types/database';

export interface CreateTripData {
  title: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  currency: string;
  collaboratorEmails?: string[];
}

export class TripService {
  static async createTrip(
    data: CreateTripData
  ): Promise<{ trip: Trip; error?: string }> {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Create the trip
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          destination: data.destination,
          start_date: data.start_date,
          end_date: data.end_date,
          budget: data.budget,
          currency: data.currency || 'EUR',
          status: 'planning',
        })
        .select()
        .single();

      if (tripError) {
        throw tripError;
      }

      // Add owner as collaborator
      const { error: ownerCollabError } = await supabase
        .from('trip_collaborators')
        .insert({
          trip_id: trip.id,
          user_id: user.id,
          role: 'owner',
          joined_at: new Date().toISOString(),
        });

      if (ownerCollabError) {
        console.error('Error adding owner as collaborator:', ownerCollabError);
      }

      // If there are collaborator emails, invite them
      if (data.collaboratorEmails && data.collaboratorEmails.length > 0) {
        const collaboratorPromises = data.collaboratorEmails.map(
          async (email) => {
            // First, check if user exists in auth.users by their email
            // Note: This is a simplified approach. In production, you might want to
            // handle invitations differently (send email invites, etc.)

            // For now, we'll just create placeholder entries
            // In a real app, you'd send email invitations and handle the signup flow
            return this.inviteCollaboratorByEmail(trip.id, email);
          }
        );

        await Promise.allSettled(collaboratorPromises);
      }

      return { trip };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error creating trip:', error);
      return {
        trip: {} as Trip,
        error: error.message || 'Error al crear el viaje',
      };
    }
  }

  static async getUserTrips(): Promise<{ trips: Trip[]; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data: trips, error } = await supabase
        .from('trips')
        .select(
          `
          *,
          trip_collaborators!inner(
            role
          )
        `
        )
        .or(`user_id.eq.${user.id},trip_collaborators.user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { trips: trips || [] };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      return {
        trips: [],
        error: error.message || 'Error al obtener los viajes',
      };
    }
  }

  static async getTripById(
    tripId: string
  ): Promise<{ trip: Trip | null; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data: trip, error } = await supabase
        .from('trips')
        .select(
          `
          *,
          trip_collaborators(
            id,
            user_id,
            role,
            invited_at,
            joined_at
          )
        `
        )
        .eq('id', tripId)
        .single();

      if (error) {
        throw error;
      }

      // Check if user has access to this trip
      const hasAccess =
        trip.user_id === user.id ||
        trip.trip_collaborators?.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (collab: any) => collab.user_id === user.id
        );

      if (!hasAccess) {
        throw new Error('No tienes acceso a este viaje');
      }

      return { trip };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching trip:', error);
      return {
        trip: null,
        error: error.message || 'Error al obtener el viaje',
      };
    }
  }

  private static async inviteCollaboratorByEmail(
    tripId: string,
    email: string
  ) {
    try {
      // This is a simplified version. In a real app, you'd:
      // 1. Check if user exists in your system
      // 2. If not, send an invitation email
      // 3. Create a pending invitation record
      // 4. Handle the signup/invitation acceptance flow

      // For now, we'll just log the invitation
      console.log(`Invitation would be sent to ${email} for trip ${tripId}`);

      // You could create a pending invitations table and record
      // Or integrate with an email service like SendGrid, Resend, etc.

      return { success: true };
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      return { success: false, error };
    }
  }
}
