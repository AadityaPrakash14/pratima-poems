import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminNavbar - Top navigation bar for admin portal
 * 
 * Features:
 * - Pratima branding with admin indicator
 * - Current user email display
 * - Logout button
 * - Mobile menu toggle button
 * - Responsive design
 * 
 * Props:
 * - onMobileMenuToggle: Function to toggle mobile sidebar
 * - isMobileMenuOpen: Boolean indicating mobile menu state
 */
export default function AdminNavbar({ onMobileMenuToggle, isMobileMenuOpen }) {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // Navigation to /admin/login is handled by ProtectedRoute
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-40 border-b"
      style={{ 
        backgroundColor: 'var(--color-paper-light)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Left Section: Mobile Menu Button + Brand */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-md transition-colors"
            style={{ color: 'var(--color-ink-soft)' }}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'मेनू बंद करें' : 'मेनू खोलें'}
            aria-controls="admin-mobile-menu"
          >
            {isMobileMenuOpen ? (
              /* Close Icon (X) */
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              /* Hamburger Icon */
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Brand */}
          <Link 
            to="/admin/dashboard"
            className="font-literary text-xl font-bold flex items-center gap-2"
            style={{ color: 'var(--color-maroon)' }}
          >
            <span>प्रतिमा</span>
            <span 
              className="font-ui text-xs font-medium px-2 py-0.5 rounded"
              style={{ 
                backgroundColor: 'var(--color-paper-deep)',
                color: 'var(--color-ink-soft)'
              }}
            >
              Admin
            </span>
          </Link>
        </div>

        {/* Right Section: User Info + Logout */}
        <div className="flex items-center gap-3">
          {/* User Email - Hidden on mobile */}
          {user && (
            <span 
              className="font-body text-sm hidden md:inline truncate max-w-[200px]"
              style={{ color: 'var(--color-muted)' }}
              title={user.email}
            >
              {user.email}
            </span>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="font-body text-sm px-3 py-1.5 rounded-md border transition-colors"
            style={{ 
              color: 'var(--color-ink-soft)',
              borderColor: 'var(--color-border)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-maroon)';
              e.currentTarget.style.color = 'var(--color-maroon)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-ink-soft)';
            }}
          >
            लॉगआउट
          </button>
        </div>
      </div>
    </header>
  );
}
