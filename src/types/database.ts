export interface Trip {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  currency: string;
  status: 'planning' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  cover_image_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripActivity {
  id: string;
  trip_id: string;
  title: string;
  description?: string;
  activity_type: 'accommodation' | 'transport' | 'activity' | 'restaurant' | 'general';
  start_datetime?: string;
  end_datetime?: string;
  location_name?: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  cost?: number;
  currency: string;
  booking_reference?: string;
  booking_url?: string;
  notes?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TripCollaborator {
  id: string;
  trip_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  invited_at: string;
  joined_at?: string;
}

export interface TripDocument {
  id: string;
  trip_id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  document_type: 'ticket' | 'reservation' | 'passport' | 'visa' | 'insurance' | 'general';
  uploaded_by?: string;
  created_at: string;
}

export interface TripExpense {
  id: string;
  trip_id: string;
  activity_id?: string;
  title: string;
  amount: number;
  currency: string;
  category: 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'general';
  paid_by?: string;
  date: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      trips: {
        Row: Trip;
        Insert: Omit<Trip, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      trip_activities: {
        Row: TripActivity;
        Insert: Omit<TripActivity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TripActivity, 'id' | 'trip_id' | 'created_at' | 'updated_at'>>;
      };
      trip_collaborators: {
        Row: TripCollaborator;
        Insert: Omit<TripCollaborator, 'id' | 'invited_at' | 'joined_at'>;
        Update: Partial<Omit<TripCollaborator, 'id' | 'trip_id' | 'user_id' | 'invited_at'>>;
      };
      trip_documents: {
        Row: TripDocument;
        Insert: Omit<TripDocument, 'id' | 'created_at'>;
        Update: Partial<Omit<TripDocument, 'id' | 'trip_id' | 'created_at'>>;
      };
      trip_expenses: {
        Row: TripExpense;
        Insert: Omit<TripExpense, 'id' | 'created_at'>;
        Update: Partial<Omit<TripExpense, 'id' | 'trip_id' | 'created_at'>>;
      };
    };
  };
}