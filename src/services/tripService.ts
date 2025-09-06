/* eslint-disable @typescript-eslint/no-explicit-any */
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
        } as any)
        .select()
        .single();

      if (tripError || !trip) {
        throw tripError || new Error('No se pudo crear el viaje');
      }

      // Add owner as collaborator
      const { error: ownerCollabError } = await supabase
        .from('trip_collaborators')
        .insert({
          trip_id: (trip as any).id,
          user_id: user.id,
          role: 'owner',
          joined_at: new Date().toISOString(),
        } as any);

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
            return this.inviteCollaboratorByEmail((trip as any).id, email);
          }
        );

        await Promise.allSettled(collaboratorPromises);
      }

      return { trip: trip as Trip };
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
        .select('*')
        .eq('user_id', user.id)
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
        .select('*')
        .eq('id', tripId)
        .single();

      if (error || !trip) {
        throw error || new Error('Viaje no encontrado');
      }

      // Check if user has access to this trip (simplified - only owner for now)
      if ((trip as any).user_id !== user.id) {
        throw new Error('No tienes acceso a este viaje');
      }

      return { trip: trip as Trip };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching trip:', error);
      return {
        trip: null,
        error: error.message || 'Error al obtener el viaje',
      };
    }
  }

  static async updateTripCoverImage(
    tripId: string,
    file: File
  ): Promise<{ imageUrl?: string; error?: string }> {
    try {
      console.log('🔄 Starting image upload for trip:', tripId);
      console.log('📁 File info:', { name: file.name, size: file.size, type: file.type });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      console.log('👤 User authenticated:', user.id);

      // Check if bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'images');
      
      if (!bucketExists) {
        console.log('🪣 Creating images bucket...');
        const { error: bucketError } = await supabase.storage.createBucket('images', {
          public: true
        });
        if (bucketError) {
          console.error('❌ Error creating bucket:', bucketError);
        } else {
          console.log('✅ Bucket created successfully');
        }
      }

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `trip-covers/${tripId}/${Date.now()}.${fileExt}`;
      console.log('📝 Generated fileName:', fileName);

      // Upload image to Supabase Storage
      console.log('⬆️ Starting upload to Supabase Storage...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;
      console.log('🔗 Generated public URL:', imageUrl);

      // Update trip with new cover image URL
      console.log('💾 Updating trip in database...');
      const { error: updateError, data: updateData } = await supabase
        .from('trips')
        .update({ cover_image_url: imageUrl })
        .eq('id', tripId)
        .eq('user_id', user.id)
        .select();

      if (updateError) {
        console.error('❌ Database update error:', updateError);
        throw updateError;
      }

      console.log('✅ Database updated successfully:', updateData);

      return { imageUrl };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Error updating trip cover image:', error);
      return {
        error: error.message || 'Error al actualizar la imagen',
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
