import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminSidebar from '../components/admin/AdminSidebar';

/**
 * AdminLayout - Main layout wrapper for admin portal
 * 
 * Structure:
 * - Fixed AdminNavbar at top
 * - Fixed AdminSidebar on left (desktop) or overlay (mobile)
 * - Main content area with proper spacing for fixed elements
 * 
 * Responsive behavior:
 * - Desktop (lg+): Sidebar always visible, content shifted right
 * - Mobile: Sidebar hidden by default, toggle via hamburger menu
 */
export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  // Close mobile menu on route change
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setIsMobileMenuOpen(false);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      {/* Fixed Navbar */}
      <AdminNavbar 
        onMobileMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Sidebar */}
      <AdminSidebar 
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />

      {/* Main Content Area */}
      {/* pt-16: accounts for fixed navbar height (h-16) */}
      {/* lg:pl-64: accounts for sidebar width on desktop */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
