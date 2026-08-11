import { Link } from 'react-router-dom';

/**
 * PrimaryButton - Main action button with maroon background
 * Can render as button or Link based on props
 */
export default function PrimaryButton({ 
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
    backgroundColor: disabled ? 'var(--color-muted)' : 'var(--color-maroon)',
    color: 'var(--color-paper-light)',
  };

  const baseClasses = `
    inline-flex items-center justify-center
    px-6 py-3
    font-body text-base font-medium
    rounded-lg
    transition-colors duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    ${disabled ? 'cursor-not-allowed opacity-70' : 'hover:opacity-90'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Render as React Router Link
  if (to) {
    return (
      <Link
        to={to}
        className={baseClasses}
        style={baseStyles}
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
      {...props}
    >
      {children}
    </button>
  );
}
