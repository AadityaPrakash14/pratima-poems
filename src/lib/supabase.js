import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client initialization
 * 
 * Environment variables:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_PUBLISHABLE_KEY: Your Supabase anonymous/publishable key
 * 
 * IMPORTANT: Never use the service role key in client-side code.
 * The publishable key is safe to expose as Row Level Security (RLS) 
 * policies protect your data.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Check if a URL is a valid HTTP/HTTPS URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid HTTP/HTTPS URL
 */
function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Check if environment variables are properly configured
const isConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey.length > 20;

// Validate environment variables
if (!isConfigured) {
  console.warn(
    'Supabase environment variables are not set or invalid. ' +
    'Please create a .env.local file with valid VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY. ' +
    'Supabase features will be disabled.'
  );
}

/**
 * Supabase client instance
 * Will be null if environment variables are not configured properly
 */
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Check if Supabase is configured and available
 * @returns {boolean} True if Supabase client is initialized
 */
export const isSupabaseConfigured = () => supabase !== null;

export default supabase;
