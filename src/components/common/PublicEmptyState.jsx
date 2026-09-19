import { Link } from 'react-router-dom';

/**
 * PublicEmptyState - Empty state for public content listings
 * Graceful, literary-themed message when no content is available
 */
export default function PublicEmptyState({ 
  title = 'अभी कोई रचना नहीं है',
  message = 'जल्द ही नई रचनाएँ यहाँ उपलब्ध होंगी।',
  showHomeLink = true,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 md:py-24 text-center ${className}`}>
      {/* Decorative element */}
      <div 
        className="mb-6"
        aria-hidden="true"
      >
        <span 
          className="font-literary text-5xl"
          style={{ color: 'var(--color-border)', opacity: 0.5 }}
        >
          ✧
        </span>
      </div>
      
      <h3 
        className="font-literary text-xl md:text-2xl font-semibold mb-3"
        style={{ color: 'var(--color-ink-soft)' }}
      >
        {title}
      </h3>
      
      <p 
        className="font-body text-base max-w-md mb-6"
        style={{ color: 'var(--color-muted)' }}
      >
        {message}
      </p>

      {showHomeLink && (
        <Link
          to="/"
          className="font-body text-sm font-medium transition-colors"
          style={{ color: 'var(--color-maroon)' }}
        >
          मुखपृष्ठ पर वापस जाएँ →
        </Link>
      )}
    </div>
  );
}
