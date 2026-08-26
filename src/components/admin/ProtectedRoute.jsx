import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute - Guards admin routes from unauthorized access
 * 
 * Behavior:
 * 1. While loading auth state → show loading spinner
 * 2. If not authenticated → redirect to /admin/login
 * 3. If authenticated but not admin → redirect to /admin/login
 * 4. If authenticated admin → render child routes
 * 
 * SECURITY NOTE:
 * This is a UX convenience only. The actual security is enforced
 * by Supabase RLS policies at the database level.
 */
export default function ProtectedRoute() {
  const { user, isAdmin, loading, isConfigured } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-paper)' }}
      >
        <div className="text-center">
          {/* Loading Spinner */}
          <div className="mb-4">
            <svg 
              className="animate-spin h-10 w-10 mx-auto"
              style={{ color: 'var(--color-maroon)' }}
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p 
            className="font-body text-base"
            style={{ color: 'var(--color-muted)' }}
          >
            लोड हो रहा है...
          </p>
        </div>
      </div>
    );
  }

  // If Supabase is not configured, redirect to login (which shows the config message)
  if (!isConfigured) {
    return <Navigate to="/admin/login" replace />;
  }

  // If not authenticated or not an admin, redirect to login
  // Save the current location so we can redirect back after login
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // User is authenticated and is an admin - render the protected content
  return <Outlet />;
}
