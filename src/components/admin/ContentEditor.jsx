/**
 * ContentEditor - Large textarea for Hindi poem/story content
 * 
 * Features:
 * - Preserve line breaks for poetry formatting
 * - Large, comfortable editing area
 * - Character count
 * - Hindi-friendly font and line height
 * - Accessible with proper aria attributes
 * - Presentational only - no Supabase calls
 * 
 * Props:
 * - label: string - Input label
 * - name: string - Input name
 * - value: string - Content value
 * - onChange: (e) => void - Change handler
 * - placeholder: string
 * - helpText: string
 * - error: string
 * - required: boolean
 * - disabled: boolean
 * - rows: number - Visible rows (default: 16)
 * - maxLength: number - Optional character limit
 * - showCharCount: boolean - Show character counter
 */
export default function ContentEditor({
  label = 'पाठ',
  name = 'content',
  value,
  onChange,
  placeholder = 'कविता या कहानी का पाठ यहाँ लिखें...',
  helpText = 'पंक्तियों के बीच की जगह संरक्षित रहेगी।',
  error,
  required = false,
  disabled = false,
  rows = 16,
  maxLength,
  showCharCount = true,
  className = '',
}) {
  const textareaId = `content-editor-${name}`;
  const helpTextId = helpText ? `${textareaId}-help` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [helpTextId, errorId].filter(Boolean).join(' ') || undefined;

  // Calculate stats
  const charCount = value?.length || 0;
  const lineCount = value ? value.split('\n').length : 0;

  // Handle change while preserving line breaks
  const handleChange = (e) => {
    onChange?.(e);
  };

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
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className="w-full px-4 py-3 rounded-md border font-literary text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ 
          backgroundColor: disabled ? 'var(--color-paper-deep)' : 'var(--color-paper)',
          borderColor: error ? '#B91C1C' : 'var(--color-border)',
          color: disabled ? 'var(--color-muted)' : 'var(--color-ink)',
          resize: 'vertical',
          // Hindi literary content styling
          lineHeight: '2',
          letterSpacing: '0.01em',
          minHeight: '300px',
          // Preserve whitespace for poetry formatting
          whiteSpace: 'pre-wrap',
        }}
      />

      {/* Footer row with stats and error */}
      <div className="flex justify-between items-start gap-4">
        {/* Help text or error */}
        <div className="flex-1">
          {error ? (
            <p 
              id={errorId}
              className="font-body text-xs"
              style={{ color: '#B91C1C' }}
              role="alert"
            >
              {error}
            </p>
          ) : helpText ? (
            <p 
              id={helpTextId}
              className="font-body text-xs"
              style={{ color: 'var(--color-muted)' }}
            >
              {helpText}
            </p>
          ) : null}
        </div>

        {/* Character/line count */}
        {showCharCount && (
          <div 
            className="flex items-center gap-3 font-body text-xs flex-shrink-0"
            style={{ color: 'var(--color-muted)' }}
          >
            <span>{lineCount} पंक्तियाँ</span>
            <span>•</span>
            <span 
              style={{ 
                color: maxLength && charCount > maxLength * 0.9 
                  ? '#B91C1C' 
                  : 'var(--color-muted)' 
              }}
            >
              {charCount.toLocaleString('hi-IN')} अक्षर
              {maxLength && ` / ${maxLength.toLocaleString('hi-IN')}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
