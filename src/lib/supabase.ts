import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          phone: string
          full_name: string | null
          avatar_url: string | null
          role: 'customer' | 'worker' | 'admin'
          language: string
          created_at: string
        }
        Insert: {
          id: string
          phone: string
          full_name?: string | null
          role: 'customer' | 'worker' | 'admin'
          language?: string
        }
      }
      workers: {
        Row: {
          id: string
          skills: string[]
          bio: string | null
          daily_rate: number | null
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
          average_rating: number
          is_available: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          worker_id: string
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
          scheduled_at: string
          total_price: number
          payment_status: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded'
          job_pin: string | null
        }
      }
    }
  }
}
