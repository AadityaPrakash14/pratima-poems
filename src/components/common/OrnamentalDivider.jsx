/**
 * OrnamentalDivider - Subtle section separator
 * Decorative element that doesn't convey essential meaning
 */
export default function OrnamentalDivider({ 
  variant = 'line', // 'line', 'dots', 'ornament'
  className = '' 
}) {
  if (variant === 'dots') {
    return (
      <div 
        className={`flex items-center justify-center gap-2 py-8 ${className}`}
        aria-hidden="true"
      >
        <span 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />
        <span 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />
        <span 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />
      </div>
    );
  }

  if (variant === 'ornament') {
    return (
      <div 
        className={`flex items-center justify-center gap-4 py-8 ${className}`}
        aria-hidden="true"
      >
        <span 
          className="w-12 h-px"
          style={{ backgroundColor: 'var(--color-border)' }}
        />
        <span 
          className="w-2 h-2 rotate-45"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />
        <span 
          className="w-12 h-px"
          style={{ backgroundColor: 'var(--color-border)' }}
        />
      </div>
    );
  }

  // Default: simple line
  return (
    <div 
      className={`flex justify-center py-8 ${className}`}
      aria-hidden="true"
    >
      <span 
        className="w-24 h-px"
        style={{ backgroundColor: 'var(--color-border)' }}
      />
    </div>
  );
}
