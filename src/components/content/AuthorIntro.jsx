import { Link } from 'react-router-dom';

/**
 * AuthorIntro - Homepage author introduction section
 * Contains archival-style portrait placeholder, name, and short introduction
 * Portrait designed to look like an old photograph from a literary archive
 */
export default function AuthorIntro() {
  return (
    <section 
      className="py-16 md:py-24"
      style={{ backgroundColor: 'var(--color-paper-deep)' }}
    >
      <div className="container-content">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
            {/* Archival Portrait Placeholder - Rectangular, warm border, vintage feel */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Outer decorative frame */}
                <div 
                  className="absolute -inset-2 rounded-sm opacity-30"
                  style={{ 
                    border: '1px solid var(--color-gold)',
                  }}
                  aria-hidden="true"
                />
                
                {/* Main portrait frame */}
                <div 
                  className="archival-portrait w-44 h-56 md:w-52 md:h-64 rounded-sm flex items-center justify-center relative overflow-hidden"
                >
                  {/* Inner mat/border effect */}
                  <div 
                    className="absolute inset-2 border rounded-sm"
                    style={{ borderColor: 'var(--color-border)' }}
                    aria-hidden="true"
                  />
                  
                  {/* Placeholder content */}
                  <div className="text-center p-4">
                    <span 
                      className="font-literary text-3xl block mb-2"
                      style={{ color: 'var(--color-muted)' }}
                      aria-hidden="true"
                    >
                      ✧
                    </span>
                    <span 
                      className="font-body text-sm"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      [चित्र]
                    </span>
                  </div>

                  {/* Subtle vignette effect */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 50%, rgba(48, 42, 36, 0.08) 100%)'
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Photo corner decorations */}
                <PhotoCorner position="top-left" />
                <PhotoCorner position="top-right" />
                <PhotoCorner position="bottom-left" />
                <PhotoCorner position="bottom-right" />
              </div>
            </div>

            {/* Introduction Content */}
            <div className="text-center md:text-left">
              {/* Section Label */}
              <p 
                className="font-body text-sm uppercase tracking-wider mb-2"
                style={{ color: 'var(--color-muted)' }}
              >
                लेखिका
              </p>
              
              {/* Name */}
              <h2 
                className="font-literary text-3xl md:text-4xl font-bold mb-4"
                style={{ color: 'var(--color-ink)' }}
              >
                प्रतिमा
              </h2>

              {/* Decorative line */}
              <div 
                className="w-12 h-px mb-5 mx-auto md:mx-0"
                style={{ backgroundColor: 'var(--color-gold)' }}
                aria-hidden="true"
              />
              
              {/* Introduction - Placeholder text clearly marked */}
              <p 
                className="font-body text-base md:text-lg leading-relaxed mb-6 max-w-md"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                <em style={{ color: 'var(--color-muted)' }}>
                  [लेखिका का परिचय यहाँ आएगा। यह प्लेसहोल्डर टेक्स्ट है।]
                </em>
              </p>
              
              {/* Link to full author page */}
              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-body text-sm font-medium transition-colors group"
                style={{ color: 'var(--color-maroon)' }}
              >
                और जानें 
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Photo corner decoration - mimics old photo album corners
 */
function PhotoCorner({ position }) {
  const positionClasses = {
    'top-left': '-top-1 -left-1',
    'top-right': '-top-1 -right-1 rotate-90',
    'bottom-left': '-bottom-1 -left-1 -rotate-90',
    'bottom-right': '-bottom-1 -right-1 rotate-180',
  };

  return (
    <div 
      className={`absolute w-4 h-4 ${positionClasses[position]}`}
      aria-hidden="true"
    >
      <svg 
        viewBox="0 0 16 16" 
        fill="none"
        style={{ color: 'var(--color-gold)', opacity: 0.5 }}
      >
        <path 
          d="M0 0 L8 0 L0 8 Z" 
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
