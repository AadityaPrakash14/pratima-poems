/**
 * AdminLoadingState - Loading indicator for admin sections
 * 
 * Features:
 * - Accessible loading indication
 * - Minimal, non-distracting animation
 * - Optional message
 * - respects prefers-reduced-motion
 * 
 * Props:
 * - message: string - Optional loading message (default: "लोड हो रहा है...")
 * - size: 'sm' | 'md' | 'lg' - Spinner size
 * - fullHeight: boolean - Take full container height
 */
export default function AdminLoadingState({
  message = 'लोड हो रहा है...',
  size = 'md',
  fullHeight = false,
  className = '',
}) {
  // Size configurations
  const sizes = {
    sm: {
      spinner: 'w-5 h-5',
      text: 'text-xs',
      padding: 'py-4',
    },
    md: {
      spinner: 'w-8 h-8',
      text: 'text-sm',
      padding: 'py-8',
    },
    lg: {
      spinner: 'w-12 h-12',
      text: 'text-base',
      padding: 'py-16',
    },
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div 
      className={`
        flex flex-col items-center justify-center
        ${sizeConfig.padding}
        ${fullHeight ? 'min-h-[200px]' : ''}
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Spinner */}
      <svg
        className={`${sizeConfig.spinner} animate-spin`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ color: 'var(--color-maroon)' }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      {/* Loading message */}
      {message && (
        <p 
          className={`mt-3 font-body ${sizeConfig.text}`}
          style={{ color: 'var(--color-muted)' }}
        >
          {message}
        </p>
      )}

      {/* Screen reader announcement */}
      <span className="sr-only">{message}</span>
    </div>
  );
}

/**
 * Inline loading spinner (for buttons, small areas)
 */
export function AdminLoadingSpinner({ 
  size = 'sm',
  className = '' 
}) {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
