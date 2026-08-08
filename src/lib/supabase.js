import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client initialization
 * 
 * Environment variables:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous (public) key
 * 
 * IMPORTANT: Never use the service role key in client-side code.
 * The anon key is safe to expose as Row Level Security (RLS) 
 * policies protect your data.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are not set. ' +
    'Please create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. ' +
    'Supabase features (likes, comments) will be disabled.'
  );
}

/**
 * Supabase client instance
 * Will be null if environment variables are not configured
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Check if Supabase is configured and available
 * @returns {boolean} True if Supabase client is initialized
 */
export const isSupabaseConfigured = () => supabase !== null;

export default supabase;
