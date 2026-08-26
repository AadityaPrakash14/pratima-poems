import { useState, useEffect, useCallback } from 'react';

/**
 * SlugInput - Slug input component with auto-generation from title
 * 
 * Features:
 * - Auto-generate slug from title (transliterated)
 * - Allow manual editing/override
 * - Don't overwrite manually edited slugs when title changes
 * - Validate slug format (lowercase, numbers, hyphens)
 * - Check uniqueness via provided callback
 * - Hindi UI labels
 * 
 * Props:
 * - label: string - Input label
 * - name: string - Input name
 * - value: string - Current slug value
 * - onChange: (value: string) => void - Slug change handler
 * - title: string - Title to generate slug from
 * - onCheckAvailability: (slug: string) => Promise<boolean> - Slug availability checker
 * - error: string - External error message
 * - required: boolean
 * - disabled: boolean
 * - helpText: string
 * - excludeId: string - ID to exclude when checking uniqueness (for edits)
 */
export default function SlugInput({
  label = 'Slug',
  name = 'slug',
  value,
  onChange,
  title = '',
  onCheckAvailability,
  error: externalError,
  required = false,
  disabled = false,
  helpText = 'URL में उपयोग होगा (केवल lowercase अक्षर, संख्याएँ, हाइफ़न)',
  className = '',
}) {
  // Track if user has manually edited the slug
  // Initialize to true if value already exists (editing mode) to prevent auto-overwrite
  const [isManuallyEdited, setIsManuallyEdited] = useState(() => Boolean(value));
  const [checking, setChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');

  // Generate slug from Hindi/English title
  const generateSlug = useCallback((text) => {
    if (!text) return '';
    
    // Convert to lowercase, replace spaces with hyphens
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '')  // Remove non-alphanumeric except hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
  }, []);

  // Auto-generate slug when title changes (if not manually edited)
  useEffect(() => {
    if (!isManuallyEdited && title) {
      const newSlug = generateSlug(title);
      if (newSlug !== value) {
        onChange?.(newSlug);
      }
    }
  }, [title, isManuallyEdited, generateSlug, onChange, value]);

  // Handle manual input
  const handleChange = (e) => {
    const newValue = e.target.value.toLowerCase();
    setIsManuallyEdited(true);
    setAvailabilityError('');
    onChange?.(newValue);
  };

  // Handle blur - validate format and check availability
  const handleBlur = async () => {
    if (!value?.trim()) return;

    // Validate format
    if (!/^[a-z0-9-]+$/.test(value)) {
      setAvailabilityError('Slug में केवल lowercase अक्षर, संख्याएँ और हाइफ़न हो सकते हैं।');
      return;
    }

    // Check availability if callback provided
    if (onCheckAvailability) {
      setChecking(true);
      try {
        const isAvailable = await onCheckAvailability(value);
        if (!isAvailable) {
          setAvailabilityError('यह slug पहले से उपयोग में है।');
        } else {
          setAvailabilityError('');
        }
      } catch (err) {
        console.error('Slug check failed:', err);
        setAvailabilityError('Slug जाँच में त्रुटि।');
      } finally {
        setChecking(false);
      }
    }
  };

  // Reset to auto-generation
  const handleReset = () => {
    setIsManuallyEdited(false);
    setAvailabilityError('');
    const newSlug = generateSlug(title);
    onChange?.(newSlug);
  };

  // Combine errors
  const displayError = externalError || availabilityError;

  const inputId = `admin-input-${name}`;

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

      {/* Input with indicator/reset */}
      <div className="relative">
        <input
          type="text"
          id={inputId}
          name={name}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="jaise-mera-slug"
          required={required}
          disabled={disabled}
          aria-invalid={displayError ? 'true' : undefined}
          className="w-full px-3 py-2 pr-20 rounded-md border font-body text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{ 
            backgroundColor: disabled ? 'var(--color-paper-deep)' : 'var(--color-paper)',
            borderColor: displayError ? '#B91C1C' : 'var(--color-border)',
            color: disabled ? 'var(--color-muted)' : 'var(--color-ink)',
          }}
        />

        {/* Status indicators */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
          {/* Checking spinner */}
          {checking && (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              style={{ color: 'var(--color-muted)' }}
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
          )}

          {/* Reset to auto button (if manually edited) */}
          {isManuallyEdited && !disabled && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs px-1.5 py-0.5 rounded transition-colors"
              style={{ 
                backgroundColor: 'var(--color-paper-deep)',
                color: 'var(--color-muted)',
              }}
              title="स्वचालित slug पर वापस जाएँ"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Help text */}
      {helpText && !displayError && (
        <p 
          className="font-body text-xs"
          style={{ color: 'var(--color-muted)' }}
        >
          {helpText}
        </p>
      )}

      {/* Error message */}
      {displayError && (
        <p 
          className="font-body text-xs"
          style={{ color: '#B91C1C' }}
          role="alert"
        >
          {displayError}
        </p>
      )}
    </div>
  );
}
