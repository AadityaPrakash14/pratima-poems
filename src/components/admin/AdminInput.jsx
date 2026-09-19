/**
 * AdminInput - Text input component for admin forms
 * 
 * Features:
 * - Label with required indicator
 * - Help text
 * - Validation error display
 * - Accessible with proper aria attributes
 * - Hindi-first labels
 * 
 * Props:
 * - label: string (required) - Input label
 * - name: string (required) - Input name/id
 * - type: string - Input type (text, email, password, etc.)
 * - value: string - Controlled value
 * - onChange: function - Change handler
 * - placeholder: string
 * - helpText: string - Assistance text below input
 * - error: string - Validation error message
 * - required: boolean
 * - disabled: boolean
 * - autoComplete: string
 * - maxLength: number
 */
export default function AdminInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  helpText,
  error,
  required = false,
  disabled = false,
  autoComplete,
  maxLength,
  className = '',
  ...props
}) {
  const inputId = `admin-input-${name}`;
  const helpTextId = helpText ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helpTextId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      <label 
        htmlFor={inputId}
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

      {/* Input */}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className="w-full px-3 py-2 rounded-md border font-body text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ 
          backgroundColor: disabled ? 'var(--color-paper-deep)' : 'var(--color-paper)',
          borderColor: error ? '#B91C1C' : 'var(--color-border)',
          color: disabled ? 'var(--color-muted)' : 'var(--color-ink)',
        }}
        {...props}
      />

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
