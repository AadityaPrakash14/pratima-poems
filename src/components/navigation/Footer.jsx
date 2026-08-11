import { NavLink } from 'react-router-dom';

/**
 * Footer - Site footer styled like the closing page of a book
 * Quiet, minimal design with literary flourishes
 * Warm paper aesthetic with subtle decorations
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="book-closing">
      <div className="container-content py-14 md:py-20">
        <div className="flex flex-col items-center text-center gap-8">
          
          {/* Decorative top flourish */}
          <div className="flex items-center gap-4 mb-2" aria-hidden="true">
            <span 
              className="w-12 h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--color-border-warm))' }}
            />
            <BookEndIcon />
            <span 
              className="w-12 h-px"
              style={{ background: 'linear-gradient(to left, transparent, var(--color-border-warm))' }}
            />
          </div>

          {/* Brand */}
          <div>
            <NavLink 
              to="/" 
              className="font-literary text-2xl font-bold transition-colors inline-block"
              style={{ color: 'var(--color-maroon)' }}
            >
              प्रतिमा
            </NavLink>
            <p 
              className="mt-1 font-literary text-sm tracking-wider"
              style={{ color: 'var(--color-muted)' }}
            >
              साहित्य संग्रह
            </p>
          </div>

          {/* Literary Statement - like a closing thought */}
          <div className="max-w-sm">
            <p 
              className="font-literary text-lg italic leading-relaxed"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              शब्दों में संजोए हुए अनुभव...
            </p>
          </div>

          {/* Navigation Links - minimal, book index style */}
          <nav 
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm"
            aria-label="Footer navigation"
          >
            <NavLink
              to="/poems"
              className="font-body transition-colors relative group"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              कविताएँ
              <span 
                className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: 'var(--color-maroon)' }}
              />
            </NavLink>
            <NavLink
              to="/stories"
              className="font-body transition-colors relative group"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              कहानियाँ
              <span 
                className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: 'var(--color-maroon)' }}
              />
            </NavLink>
            <NavLink
              to="/about"
              className="font-body transition-colors relative group"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              लेखिका
              <span 
                className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: 'var(--color-maroon)' }}
              />
            </NavLink>
          </nav>

          {/* Decorative ornament */}
          <div className="flex items-center gap-3 my-2" aria-hidden="true">
            <span 
              className="w-6 h-px"
              style={{ backgroundColor: 'var(--color-gold)', opacity: 0.5 }}
            />
            <span 
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: 'var(--color-gold)', opacity: 0.6 }}
            />
            <span 
              className="w-6 h-px"
              style={{ backgroundColor: 'var(--color-gold)', opacity: 0.5 }}
            />
          </div>

          {/* Copyright - styled like a colophon */}
          <div className="space-y-2">
            <p 
              className="text-xs font-body tracking-wider uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              © {currentYear} प्रतिमा
            </p>
            <p 
              className="text-xs font-body italic"
              style={{ color: 'var(--color-muted)', opacity: 0.7 }}
            >
              सर्वाधिकार सुरक्षित
            </p>
          </div>

          {/* Final decorative element - like a book's ending mark */}
          <div 
            className="mt-4 font-literary text-xl opacity-30"
            style={{ color: 'var(--color-walnut)' }}
            aria-hidden="true"
          >
            ❧
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Book end decorative icon
 */
function BookEndIcon() {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none"
      style={{ color: 'var(--color-gold)', opacity: 0.5 }}
    >
      {/* Open book icon */}
      <path 
        d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" 
        stroke="currentColor" 
        strokeWidth="1.5"
        fill="none"
      />
      <path 
        d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" 
        stroke="currentColor" 
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
