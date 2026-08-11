import { Link } from 'react-router-dom';

/**
 * AuthorIntro - Homepage author introduction section
 * Contains portrait placeholder, name, and short introduction
 */
export default function AuthorIntro() {
  return (
    <section 
      className="py-16 md:py-24"
      style={{ backgroundColor: 'var(--color-paper-deep)' }}
    >
      <div className="container-content">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Portrait Placeholder */}
            <div className="flex-shrink-0">
              <div 
                className="w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center border-2"
                style={{ 
                  backgroundColor: 'var(--color-paper-light)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <span 
                  className="font-body text-sm"
                  style={{ color: 'var(--color-muted)' }}
                >
                  [चित्र]
                </span>
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
              
              {/* Introduction - Placeholder text clearly marked */}
              <p 
                className="font-body text-base md:text-lg leading-relaxed mb-6"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                <em style={{ color: 'var(--color-muted)' }}>
                  [लेखिका का परिचय यहाँ आएगा। यह प्लेसहोल्डर टेक्स्ट है।]
                </em>
              </p>
              
              {/* Link to full author page */}
              <Link
                to="/about"
                className="inline-flex items-center font-body text-sm font-medium transition-colors"
                style={{ color: 'var(--color-maroon)' }}
              >
                और जानें →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
