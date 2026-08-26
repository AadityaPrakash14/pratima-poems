/**
 * AdminErrorState - Error display for admin sections
 * 
 * Features:
 * - User-friendly Hindi error message
 * - Optional retry action
 * - Error icon
 * 
 * Props:
 * - title: string - Error title (default: "कुछ गलत हो गया")
 * - message: string - Error message/description
 * - onRetry: function - Optional retry callback
 * - retryLabel: string - Retry button label (default: "पुनः प्रयास करें")
 */
export default function AdminErrorState({
  title = 'कुछ गलत हो गया',
  message,
  onRetry,
  retryLabel = 'पुनः प्रयास करें',
  className = '',
}) {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
      role="alert"
    >
      {/* Error Icon */}
      <div 
        className="w-16 h-16 mb-4 flex items-center justify-center rounded-full"
        style={{ backgroundColor: 'rgba(185, 28, 28, 0.1)' }}
      >
        <svg 
          className="w-8 h-8"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={1.5}
          style={{ color: '#B91C1C' }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
          />
        </svg>
      </div>

      {/* Error Title */}
      <h3 
        className="font-body text-base font-medium text-center mb-1"
        style={{ color: '#B91C1C' }}
      >
        {title}
      </h3>

      {/* Error Message */}
      {message && (
        <p 
          className="font-body text-sm text-center max-w-sm mb-4"
          style={{ color: 'var(--color-muted)' }}
        >
          {message}
        </p>
      )}

      {/* Retry Button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 font-body text-sm font-medium rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ 
            backgroundColor: 'transparent',
            color: 'var(--color-ink)',
            borderColor: 'var(--color-border)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-maroon)';
            e.currentTarget.style.color = 'var(--color-maroon)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-ink)';
          }}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" 
            />
          </svg>
          {retryLabel}
        </button>
      )}
    </div>
  );
}
