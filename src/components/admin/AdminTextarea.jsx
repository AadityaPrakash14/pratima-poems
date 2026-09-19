/**
 * AdminTextarea - Multi-line text input for admin forms
 * 
 * Features:
 * - Suitable for Hindi literary content
 * - Preserves line breaks and formatting
 * - Label with required indicator
 * - Help text
 * - Validation error display
 * - Resizable
 * - Accessible with proper aria attributes
 * 
 * Props:
 * - label: string (required) - Input label
 * - name: string (required) - Input name/id
 * - value: string - Controlled value
 * - onChange: function - Change handler
 * - placeholder: string
 * - helpText: string - Assistance text below input
 * - error: string - Validation error message
 * - required: boolean
 * - disabled: boolean
 * - rows: number - Initial visible rows
 * - maxLength: number
 * - resize: 'none' | 'vertical' | 'horizontal' | 'both'
 */
export default function AdminTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  helpText,
  error,
  required = false,
  disabled = false,
  rows = 6,
  maxLength,
  resize = 'vertical',
  className = '',
  ...props
}) {
  const textareaId = `admin-textarea-${name}`;
  const helpTextId = helpText ? `${textareaId}-help` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [helpTextId, errorId].filter(Boolean).join(' ') || undefined;

  // Resize CSS value
  const resizeValue = {
    none: 'none',
    vertical: 'vertical',
    horizontal: 'horizontal',
    both: 'both',
  }[resize] || 'vertical';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      <label 
        htmlFor={textareaId}
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

      {/* Textarea */}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className="w-full px-3 py-2 rounded-md border font-body text-sm leading-relaxed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ 
          backgroundColor: disabled ? 'var(--color-paper-deep)' : 'var(--color-paper)',
          borderColor: error ? '#B91C1C' : 'var(--color-border)',
          color: disabled ? 'var(--color-muted)' : 'var(--color-ink)',
          resize: resizeValue,
          // Support Hindi literary content with proper line height
          lineHeight: '1.8',
        }}
        {...props}
      />

      {/* Character Count (if maxLength specified) */}
      {maxLength && (
        <div className="flex justify-between items-center">
          {/* Help Text or spacer */}
          {helpText && !error ? (
            <p 
              id={helpTextId}
              className="font-body text-xs"
              style={{ color: 'var(--color-muted)' }}
            >
              {helpText}
            </p>
          ) : (
            <span />
          )}
          <span 
            className="font-body text-xs"
            style={{ 
              color: (value?.length || 0) > maxLength * 0.9 
                ? '#B91C1C' 
                : 'var(--color-muted)' 
            }}
          >
            {value?.length || 0} / {maxLength}
          </span>
        </div>
      )}

      {/* Help Text (when no maxLength) */}
      {helpText && !error && !maxLength && (
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
