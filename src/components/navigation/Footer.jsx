import { NavLink } from 'react-router-dom';

/**
 * Footer - Site footer with navigation and literary statement
 * Quiet and minimal design following the warm paper aesthetic
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="border-t"
      style={{ 
        backgroundColor: 'var(--color-paper-deep)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="container-content py-12 md:py-16">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Brand */}
          <div>
            <NavLink 
              to="/" 
              className="font-literary text-xl font-bold transition-colors"
              style={{ color: 'var(--color-maroon)' }}
            >
              प्रतिमा
            </NavLink>
            <p 
              className="mt-1 font-literary text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              साहित्य संग्रह
            </p>
          </div>

          {/* Literary Statement */}
          <p 
            className="font-literary text-base italic max-w-md"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            शब्दों में संजोए हुए अनुभव...
          </p>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <NavLink
              to="/poems"
              className="font-body transition-colors"
              style={{ color: 'var(--color-ink-soft)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-maroon)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ink-soft)'}
            >
              कविताएँ
            </NavLink>
            <NavLink
              to="/stories"
              className="font-body transition-colors"
              style={{ color: 'var(--color-ink-soft)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-maroon)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ink-soft)'}
            >
              कहानियाँ
            </NavLink>
            <NavLink
              to="/about"
              className="font-body transition-colors"
              style={{ color: 'var(--color-ink-soft)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-maroon)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ink-soft)'}
            >
              लेखिका
            </NavLink>
          </nav>

          {/* Ornamental Divider */}
          <div 
            className="w-16 h-px"
            style={{ backgroundColor: 'var(--color-border)' }}
            aria-hidden="true"
          />

          {/* Copyright */}
          <p 
            className="text-sm font-body"
            style={{ color: 'var(--color-muted)' }}
          >
            © {currentYear} प्रतिमा
          </p>
        </div>
      </div>
    </footer>
  );
}
