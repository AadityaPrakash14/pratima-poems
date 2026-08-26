/**
 * AdminButton - Versatile button component for admin UI
 * 
 * Variants:
 * - primary: Maroon background, light text (main actions)
 * - secondary: Border only, ink text (secondary actions)
 * - danger: Red/maroon for destructive actions
 * - ghost: No border, subtle hover (minimal emphasis)
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' | 'ghost'
 * - size: 'sm' | 'md' | 'lg'
 * - disabled: boolean
 * - loading: boolean
 * - icon: ReactNode - Optional leading icon
 * - iconPosition: 'left' | 'right'
 * - fullWidth: boolean
 * - type: 'button' | 'submit' | 'reset'
 */
export default function AdminButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  };

  // Icon sizes
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Variant styles
  const getVariantStyles = () => {
    if (isDisabled && variant !== 'ghost') {
      return {
        backgroundColor: 'var(--color-paper-deep)',
        color: 'var(--color-muted)',
        borderColor: 'var(--color-border)',
      };
    }

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-maroon)',
          color: 'var(--color-paper-light)',
          borderColor: 'var(--color-maroon)',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-ink)',
          borderColor: 'var(--color-border)',
        };
      case 'danger':
        return {
          backgroundColor: 'transparent',
          color: '#B91C1C', // Red-700
          borderColor: '#B91C1C',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: isDisabled ? 'var(--color-muted)' : 'var(--color-ink-soft)',
          borderColor: 'transparent',
        };
      default:
        return {};
    }
  };

  // Hover handlers for non-primary variants
  const handleMouseEnter = (e) => {
    if (isDisabled) return;
    
    switch (variant) {
      case 'secondary':
        e.currentTarget.style.borderColor = 'var(--color-maroon)';
        e.currentTarget.style.color = 'var(--color-maroon)';
        break;
      case 'danger':
        e.currentTarget.style.backgroundColor = '#B91C1C';
        e.currentTarget.style.color = 'white';
        break;
      case 'ghost':
        e.currentTarget.style.backgroundColor = 'var(--color-paper-deep)';
        break;
      default:
        break;
    }
  };

  const handleMouseLeave = (e) => {
    if (isDisabled) return;
    const styles = getVariantStyles();
    e.currentTarget.style.backgroundColor = styles.backgroundColor;
    e.currentTarget.style.color = styles.color;
    e.currentTarget.style.borderColor = styles.borderColor;
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-body font-medium
    rounded-md border
    transition-colors duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const renderIcon = (position) => {
    if (!icon || iconPosition !== position) return null;
    return (
      <span className={`flex-shrink-0 ${iconSizes[size]}`}>
        {icon}
      </span>
    );
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={baseClasses}
      style={getVariantStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner className={iconSizes[size]} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {renderIcon('left')}
          <span>{children}</span>
          {renderIcon('right')}
        </>
      )}
    </button>
  );
}

/**
 * Loading spinner component
 */
function LoadingSpinner({ className }) {
  return (
    <svg 
      className={`animate-spin ${className}`}
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
