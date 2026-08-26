import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInAsAdmin,
  signOut as authSignOut,
  getSession,
  checkIsAdmin,
  onAuthStateChange,
} from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

/**
 * Authentication Context
 * 
 * Provides authentication state and methods to the entire application.
 * Manages:
 * - Current user and session
 * - Admin status verification
 * - Loading states during auth checks
 * - Auth state change subscriptions
 * 
 * SECURITY NOTE:
 * - Admin status is verified via profiles table
 * - Frontend checks are for UX only
 * - Database RLS is the authoritative security boundary
 */

const AuthContext = createContext(null);

/**
 * Auth state shape
 * @typedef {Object} AuthState
 * @property {object|null} user - Supabase auth user object
 * @property {object|null} session - Current session with tokens
 * @property {boolean} isAdmin - Whether user has admin role in profiles
 * @property {boolean} loading - Initial auth check in progress
 * @property {boolean} isConfigured - Whether Supabase is configured
 */

// Determine if Supabase is configured at module load time (not in state)
const supabaseConfigured = isSupabaseConfigured();

export function AuthProvider({ children }) {
  // Set initial loading state based on whether Supabase is configured
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(supabaseConfigured);

  /**
   * Verify admin status for a user
   */
  const verifyAdminStatus = useCallback(async (userId) => {
    if (!userId) {
      setIsAdmin(false);
      return false;
    }
    
    const adminStatus = await checkIsAdmin(userId);
    setIsAdmin(adminStatus);
    return adminStatus;
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    // Skip if Supabase is not configured
    if (!supabaseConfigured) {
      return;
    }

    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get existing session
        const { session: currentSession } = await getSession();
        
        if (!mounted) return;

        if (currentSession?.user) {
          setUser(currentSession.user);
          setSession(currentSession);
          await verifyAdminStatus(currentSession.user.id);
        } else {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(newSession?.user ?? null);
        setSession(newSession);
        if (newSession?.user) {
          await verifyAdminStatus(newSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [verifyAdminStatus]);

  /**
   * Sign in with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{isAdmin: boolean}>}
   * @throws {Error} With Hindi error message
   */
  const signIn = useCallback(async (email, password) => {
    const { user: authUser, session: authSession, isAdmin: adminStatus } = await signInAsAdmin(email, password);
    
    setUser(authUser);
    setSession(authSession);
    setIsAdmin(adminStatus);
    
    return { isAdmin: adminStatus };
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  }, []);

  const value = {
    user,
    session,
    isAdmin,
    loading,
    isConfigured: supabaseConfigured,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * @returns {AuthState & {signIn: function, signOut: function}}
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
