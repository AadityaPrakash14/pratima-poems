import { Link } from 'react-router-dom';

/**
 * SectionHeader - Reusable section heading with optional action link
 * Used for homepage sections and listing page headers
 */
export default function SectionHeader({ 
  title, 
  subtitle,
  actionLabel, 
  actionTo,
  centered = false,
  className = '' 
}) {
  return (
    <header 
      className={`mb-8 md:mb-12 ${centered ? 'text-center' : ''} ${className}`}
    >
      <div className={`flex flex-col ${centered ? 'items-center' : ''} gap-3`}>
        {/* Title with ornamental line */}
        <div className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}>
          <h2 
            className="font-literary text-2xl md:text-3xl font-semibold"
            style={{ color: 'var(--color-ink)' }}
          >
            {title}
          </h2>
        </div>
        
        {/* Ornamental line */}
        <div 
          className={`h-px ${centered ? 'w-16' : 'w-12'}`}
          style={{ backgroundColor: 'var(--color-gold)' }}
          aria-hidden="true"
        />

        {/* Subtitle if provided */}
        {subtitle && (
          <p 
            className="font-body text-base md:text-lg max-w-2xl"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            {subtitle}
          </p>
        )}

        {/* Action link if provided */}
        {actionLabel && actionTo && (
          <Link
            to={actionTo}
            className="font-body text-sm font-medium transition-colors mt-2"
            style={{ color: 'var(--color-maroon)' }}
          >
            {actionLabel} →
          </Link>
        )}
      </div>
    </header>
  );
}
