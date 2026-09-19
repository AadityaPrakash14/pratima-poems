import { Link } from 'react-router-dom';

/**
 * PublicErrorState - Error state for public pages
 * User-friendly error message with retry option
 */
export default function PublicErrorState({ 
  title = 'कुछ गलत हो गया',
  message = 'कृपया पुनः प्रयास करें।',
  onRetry,
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
          style={{ color: 'var(--color-muted)', opacity: 0.4 }}
        >
          ○
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

      <div className="flex flex-col sm:flex-row gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 rounded-md font-body text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--color-maroon)',
              color: 'var(--color-paper-light)'
            }}
          >
            पुनः प्रयास करें
          </button>
        )}
        
        {showHomeLink && (
          <Link
            to="/"
            className="px-6 py-2 rounded-md font-body text-sm font-medium transition-colors"
            style={{ 
              border: '1px solid var(--color-border)',
              color: 'var(--color-ink-soft)'
            }}
          >
            मुखपृष्ठ पर जाएँ
          </Link>
        )}
      </div>
    </div>
  );
}
