import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase config:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING'
});

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: number;
          name: string;
          description: string;
          date: string; // ISO date string
          location: string;
          ticket_price: number;
          total_tickets: number;
          sold_tickets: number;
          vendor: string;
          event_type: 'Sport' | 'Concert' | 'Hackathon' | 'Conference' | 'Other';
          image_url: string | null;
          blockchain_event_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          date: string;
          location: string;
          ticket_price: number;
          total_tickets: number;
          sold_tickets?: number;
          vendor: string;
          event_type: 'Sport' | 'Concert' | 'Hackathon' | 'Conference' | 'Other';
          image_url?: string | null;
          blockchain_event_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          date?: string;
          location?: string;
          ticket_price?: number;
          total_tickets?: number;
          sold_tickets?: number;
          vendor?: string;
          event_type?: 'Sport' | 'Concert' | 'Hackathon' | 'Conference' | 'Other';
          image_url?: string | null;
          blockchain_event_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type SupabaseEvent = Database['public']['Tables']['events']['Row'];
export type SupabaseEventInsert = Database['public']['Tables']['events']['Insert'];
export type SupabaseEventUpdate = Database['public']['Tables']['events']['Update']; 