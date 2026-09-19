/**
 * AdminSelect - Dropdown select component for admin forms
 * 
 * Features:
 * - Label with required indicator
 * - Help text
 * - Validation error display
 * - Optional placeholder option
 * - Accessible with proper aria attributes
 * 
 * Props:
 * - label: string (required) - Select label
 * - name: string (required) - Select name/id
 * - value: string - Controlled value
 * - onChange: function - Change handler
 * - options: Array<{ value: string, label: string }> - Options list
 * - placeholder: string - Placeholder option text
 * - helpText: string - Assistance text below select
 * - error: string - Validation error message
 * - required: boolean
 * - disabled: boolean
 */
export default function AdminSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  helpText,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const selectId = `admin-select-${name}`;
  const helpTextId = helpText ? `${selectId}-help` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [helpTextId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      <label 
        htmlFor={selectId}
        className="block font-body text-sm font-medium"
        style={{ color: 'var(--color-ink)' }}
      >
        {label}
        {required && (
          <span 
            className="ml-1" 
            style={{ color: 'var(--color-maroon)' }}
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {/* Select wrapper for custom arrow */}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className="w-full px-3 py-2 pr-10 rounded-md border font-body text-sm appearance-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{ 
            backgroundColor: disabled ? 'var(--color-paper-deep)' : 'var(--color-paper)',
            borderColor: error ? '#B91C1C' : 'var(--color-border)',
            color: disabled ? 'var(--color-muted)' : (value ? 'var(--color-ink)' : 'var(--color-muted)'),
          }}
          {...props}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}

          {/* Options */}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          aria-hidden="true"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ color: 'var(--color-muted)' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </div>
      </div>

      {/* Help Text */}
      {helpText && !error && (
        <p 
          id={helpTextId}
          className="font-body text-xs"
          style={{ color: 'var(--color-muted)' }}
        >
          {helpText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p 
          id={errorId}
          className="font-body text-xs"
          style={{ color: '#B91C1C' }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
