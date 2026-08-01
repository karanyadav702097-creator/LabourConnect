import { createClient } from '@supabase/supabase-js';

// Environment variables are fetched from Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// We create the client even if keys are missing to avoid top-level crashes.
// The App component will handle the UI state if these are empty.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
