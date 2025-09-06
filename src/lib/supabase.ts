import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lweskjeohexrlrmfwipf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZXNramVvaGV4cmxybWZ3aXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNzgzNTEsImV4cCI6MjA3Mjc1NDM1MX0.f61NM9yr7GEVtKkWVANceLM0oOqwj5H5gW4DGiVFr-I';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});