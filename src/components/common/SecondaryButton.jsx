import { Link } from 'react-router-dom';

/**
 * SecondaryButton - Secondary action button with transparent/paper background
 * Warm border with ink text
 */
export default function SecondaryButton({ 
  children, 
  to, 
  href,
  onClick, 
  type = 'button',
  disabled = false,
  className = '',
  ...props 
}) {
  const baseStyles = {
    backgroundColor: 'transparent',
    color: disabled ? 'var(--color-muted)' : 'var(--color-ink)',
    borderColor: disabled ? 'var(--color-muted)' : 'var(--color-border)',
  };

  const baseClasses = `
    inline-flex items-center justify-center
    px-6 py-3
    font-body text-base font-medium
    rounded-lg
    border
    transition-colors duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    ${disabled ? 'cursor-not-allowed opacity-70' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.currentTarget.style.borderColor = 'var(--color-maroon)';
      e.currentTarget.style.color = 'var(--color-maroon)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      e.currentTarget.style.borderColor = 'var(--color-border)';
      e.currentTarget.style.color = 'var(--color-ink)';
    }
  };

  // Render as React Router Link
  if (to) {
    return (
      <Link
        to={to}
        className={baseClasses}
        style={baseStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Render as external link
  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        style={baseStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}
