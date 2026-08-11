import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Navbar - Primary navigation component with responsive behavior
 * Hindi-first navigation with warm paper aesthetic
 * Desktop: Full horizontal navigation links
 * Mobile: Hamburger menu with expandable navigation
 */
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
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

  const navLinks = [
    { to: '/', label: 'मुखपृष्ठ' },
    { to: '/poems', label: 'कविताएँ' },
    { to: '/stories', label: 'कहानियाँ' },
    { to: '/about', label: 'लेखिका' },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ 
        backgroundColor: 'var(--color-paper-light)',
        borderColor: 'var(--color-border)'
      }}
    >
      <nav className="container-content">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand / Logo */}
          <NavLink 
            to="/" 
            className="font-literary text-xl md:text-2xl font-bold transition-colors"
            style={{ color: 'var(--color-maroon)' }}
            onClick={closeMobileMenu}
          >
            प्रतिमा
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-body text-base font-medium transition-colors ${
                    isActive
                      ? ''
                      : ''
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-maroon)' : 'var(--color-ink-soft)',
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.color = 'var(--color-maroon)';
                  }
                }}
                onMouseLeave={(e) => {
                  const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--color-ink-soft)';
                  }
                }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md transition-colors"
            style={{ color: 'var(--color-ink-soft)' }}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'मेनू बंद करें' : 'मेनू खोलें'}
            aria-controls="mobile-menu"
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
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ borderTopColor: 'var(--color-border)' }}
        >
          <div 
            className="py-4 space-y-1"
            style={{ borderTop: isMobileMenuOpen ? '1px solid var(--color-border)' : 'none' }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg font-body text-lg font-medium transition-colors"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-maroon)' : 'var(--color-ink-soft)',
                  backgroundColor: isActive ? 'var(--color-paper-deep)' : 'transparent',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
