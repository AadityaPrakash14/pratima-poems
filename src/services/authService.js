import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Authentication Service
 * 
 * Handles all authentication operations using Supabase Auth.
 * Uses email/password authentication only.
 * 
 * SECURITY NOTE:
 * - This service uses only the anon key (never service-role)
 * - Admin verification is done via profiles table query
 * - Database RLS is the authoritative security boundary
 */

/**
 * Error messages in Hindi (per AUTHENTICATION.md)
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'ईमेल या पासवर्ड गलत है।',
  NETWORK_ERROR: 'कनेक्शन में समस्या है। कृपया पुनः प्रयास करें।',
  UNKNOWN_ERROR: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
  NOT_ADMIN: 'आप एडमिन नहीं हैं।',
  SUPABASE_NOT_CONFIGURED: 'Supabase कॉन्फ़िगर नहीं है।',
};

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: object, session: object}>}
 * @throws {Error} With Hindi error message
 */
export async function signIn(email, password) {
  if (!isSupabaseConfigured()) {
    throw new Error(AUTH_ERRORS.SUPABASE_NOT_CONFIGURED);
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Map Supabase errors to Hindi messages
      if (error.message.includes('Invalid login credentials')) {
        const localizedError = new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
        localizedError.cause = error;
        throw localizedError;
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        const localizedError = new Error(AUTH_ERRORS.NETWORK_ERROR);
        localizedError.cause = error;
        throw localizedError;
      }
      const localizedError = new Error(AUTH_ERRORS.UNKNOWN_ERROR);
      localizedError.cause = error;
      throw localizedError;
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    // Re-throw if already a localized error
    if (Object.values(AUTH_ERRORS).includes(error.message)) {
      throw error;
    }
    // Check for network errors
    if (error.name === 'TypeError' || error.message.includes('network')) {
      const localizedError = new Error(AUTH_ERRORS.NETWORK_ERROR);
      localizedError.cause = error;
      throw localizedError;
    }
    const localizedError = new Error(AUTH_ERRORS.UNKNOWN_ERROR);
    localizedError.cause = error;
    throw localizedError;
  }
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export async function signOut() {
  if (!isSupabaseConfigured()) {
    return;
  }

  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Sign out error:', error);
    // Don't throw - signing out should always "succeed" from user perspective
  }
}

/**
 * Get the current session
 * @returns {Promise<{session: object|null}>}
 */
export async function getSession() {
  if (!isSupabaseConfigured()) {
    return { session: null };
  }

  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Get session error:', error);
    return { session: null };
  }

  return { session: data.session };
}

/**
 * Check if a user has admin role in the profiles table
 * This mirrors the is_admin() SQL function behavior
 * 
 * @param {string} userId - The user's UUID from auth.users
 * @returns {Promise<boolean>} True if user is an admin
 */
export async function checkIsAdmin(userId) {
  if (!isSupabaseConfigured() || !userId) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      // No profile found or other error - not an admin
      console.error('Admin check error:', error);
      return false;
    }

    return data?.role === 'admin';
  } catch (error) {
    console.error('Admin check exception:', error);
    return false;
  }
}

/**
 * Sign in with email and password, verifying admin status
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: object, session: object, isAdmin: boolean}>}
 * @throws {Error} With Hindi error message (including NOT_ADMIN if not admin)
 */
export async function signInAsAdmin(email, password) {
  // First authenticate
  const { user, session } = await signIn(email, password);
  
  // Then verify admin status
  const isAdmin = await checkIsAdmin(user.id);
  
  if (!isAdmin) {
    // User authenticated but not an admin - sign them out
    await signOut();
    const notAdminError = new Error(AUTH_ERRORS.NOT_ADMIN);
    throw notAdminError;
  }
  
  return { user, session, isAdmin };
}


/**
 * Subscribe to auth state changes
 * @param {function} callback - Called with (event, session) on auth changes
 * @returns {function} Unsubscribe function
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured()) {
    // Return no-op unsubscribe if not configured
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  
  return () => {
    subscription.unsubscribe();
  };
}
