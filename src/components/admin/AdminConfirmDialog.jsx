import { useEffect, useRef, useCallback } from 'react';

/**
 * AdminConfirmDialog - Confirmation modal for destructive actions
 * 
 * Features:
 * - Confirmation message
 * - Cancel and Confirm buttons
 * - Danger variant for destructive actions
 * - Keyboard accessibility (Escape to close, Tab trapping)
 * - Focus management
 * - Backdrop click to close
 * 
 * Props:
 * - isOpen: boolean - Controls visibility
 * - onClose: function - Close handler
 * - onConfirm: function - Confirm action handler
 * - title: string - Dialog title
 * - message: string - Confirmation message
 * - confirmLabel: string - Confirm button label (default: "पुष्टि करें")
 * - cancelLabel: string - Cancel button label (default: "रद्द करें")
 * - variant: 'default' | 'danger' - Dialog variant
 * - loading: boolean - Loading state for confirm button
 */
export default function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'पुष्टि करें',
  cancelLabel = 'रद्द करें',
  variant = 'default',
  loading = false,
}) {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const confirmButtonRef = useRef(null);

  // Focus trap management
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    // Close on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    // Tab trap within dialog
    if (e.key === 'Tab') {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isOpen, onClose]);

  // Add event listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      // Focus the cancel button (safer default)
      setTimeout(() => cancelButtonRef.current?.focus(), 0);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Don't render if not open
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div 
        ref={dialogRef}
        className="relative w-full max-w-md rounded-lg shadow-lg overflow-hidden"
        style={{ 
          backgroundColor: 'var(--color-paper-light)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h2 
            id="confirm-dialog-title"
            className="font-body text-lg font-semibold"
            style={{ color: isDanger ? '#B91C1C' : 'var(--color-ink)' }}
          >
            {title}
          </h2>
        </div>

        {/* Message */}
        <div className="px-6 pb-6">
          <p 
            id="confirm-dialog-message"
            className="font-body text-sm"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div 
          className="px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3"
          style={{ backgroundColor: 'var(--color-paper-deep)' }}
        >
          {/* Cancel Button */}
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 font-body text-sm font-medium rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ 
              backgroundColor: 'transparent',
              color: 'var(--color-ink)',
              borderColor: 'var(--color-border)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = 'var(--color-maroon)';
                e.currentTarget.style.color = 'var(--color-maroon)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-ink)';
            }}
          >
            {cancelLabel}
          </button>

          {/* Confirm Button */}
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 font-body text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: isDanger ? '#B91C1C' : 'var(--color-maroon)',
              color: 'white',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg 
                  className="animate-spin h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
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
                <span>प्रतीक्षा करें...</span>
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
