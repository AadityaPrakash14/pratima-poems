import { useState, useRef, useCallback } from 'react';

/**
 * AdminFileUpload - File upload component for admin forms
 * 
 * Features:
 * - File picker button
 * - Drag and drop support
 * - File type validation
 * - File size validation
 * - Upload progress UI
 * - Error state
 * - Preview for images
 * - Hindi labels
 * 
 * Note: This component handles UI only.
 * Actual upload logic should be handled by the parent component.
 * 
 * Props:
 * - label: string - Upload area label
 * - name: string - Input name
 * - accept: string - Accepted file types (e.g., "image/jpeg,image/png")
 * - maxSize: number - Maximum file size in bytes
 * - maxSizeLabel: string - Human-readable max size (e.g., "5MB")
 * - value: File | null - Currently selected file
 * - onChange: (file: File | null) => void - File selection handler
 * - onUpload: (file: File) => Promise<void> - Optional upload handler
 * - currentPreviewUrl: string - URL of existing file (for edit mode)
 * - error: string - Error message
 * - uploading: boolean - Upload in progress
 * - uploadProgress: number - Upload progress (0-100)
 * - helpText: string - Assistance text
 * - disabled: boolean
 */
export default function AdminFileUpload({
  label = 'फ़ाइल चुनें',
  name,
  accept = 'image/*',
  maxSize,
  maxSizeLabel = '5MB',
  value,
  onChange,
  onUpload,
  currentPreviewUrl,
  error,
  uploading = false,
  uploadProgress = 0,
  helpText,
  disabled = false,
  className = '',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);

  // Combine errors
  const displayError = error || localError;

  // Validate file
  const validateFile = useCallback((file) => {
    setLocalError('');

    // Check file type
    if (accept && accept !== '*') {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', '/'));
        }
        return fileType === type;
      });

      if (!isValidType) {
        setLocalError('इस प्रकार की फ़ाइल की अनुमति नहीं है।');
        return false;
      }
    }

    // Check file size
    if (maxSize && file.size > maxSize) {
      setLocalError(`फ़ाइल ${maxSizeLabel} से बड़ी नहीं होनी चाहिए।`);
      return false;
    }

    return true;
  }, [accept, maxSize, maxSizeLabel]);

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    
    if (validateFile(file)) {
      onChange?.(file);
      // Auto-upload if handler provided
      if (onUpload) {
        onUpload(file);
      }
    }
  }, [validateFile, onChange, onUpload]);

  // Handle input change
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Handle click to open file picker
  const handleClick = () => {
    if (!disabled && !uploading) {
      inputRef.current?.click();
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || uploading) return;

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Remove selected file
  const handleRemove = (e) => {
    e.stopPropagation();
    setLocalError('');
    onChange?.(null);
  };

  // Determine preview URL
  const previewUrl = value 
    ? URL.createObjectURL(value) 
    : currentPreviewUrl;
  
  const isImage = value?.type?.startsWith('image/') || 
    (currentPreviewUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(currentPreviewUrl));

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled || uploading}
        className="sr-only"
        aria-describedby={displayError ? `${name}-error` : undefined}
      />

      {/* Upload area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative rounded-lg border-2 border-dashed
          transition-colors cursor-pointer
          ${disabled || uploading ? 'cursor-not-allowed opacity-60' : ''}
        `}
        style={{ 
          borderColor: isDragging 
            ? 'var(--color-maroon)' 
            : displayError 
              ? '#B91C1C' 
              : 'var(--color-border)',
          backgroundColor: isDragging 
            ? 'rgba(111, 29, 42, 0.05)' 
            : 'var(--color-paper)',
        }}
      >
        {/* Preview or Upload prompt */}
        {previewUrl && isImage ? (
          <div className="relative p-4">
            <img 
              src={previewUrl}
              alt="Preview"
              className="max-h-48 mx-auto rounded-md object-contain"
            />
            {/* Remove button */}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 rounded-full transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-paper)',
                  color: 'var(--color-muted)',
                }}
                aria-label="फ़ाइल हटाएँ"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {/* File name */}
            {value && (
              <p 
                className="mt-2 text-center font-body text-xs truncate"
                style={{ color: 'var(--color-muted)' }}
              >
                {value.name}
              </p>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            {/* Upload icon */}
            <svg 
              className="mx-auto h-12 w-12 mb-3"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={1}
              style={{ color: 'var(--color-muted)' }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" 
              />
            </svg>

            {/* Label */}
            <p 
              className="font-body text-sm font-medium mb-1"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              {label}
            </p>

            {/* Instructions */}
            <p 
              className="font-body text-xs"
              style={{ color: 'var(--color-muted)' }}
            >
              खींचकर छोड़ें या क्लिक करें
            </p>

            {/* File constraints */}
            {maxSizeLabel && (
              <p 
                className="font-body text-xs mt-1"
                style={{ color: 'var(--color-muted)' }}
              >
                अधिकतम आकार: {maxSizeLabel}
              </p>
            )}
          </div>
        )}

        {/* Upload progress overlay */}
        {uploading && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center rounded-lg"
            style={{ backgroundColor: 'rgba(237, 230, 219, 0.9)' }}
          >
            {/* Progress spinner */}
            <svg
              className="w-8 h-8 animate-spin mb-2"
              fill="none"
              viewBox="0 0 24 24"
              style={{ color: 'var(--color-maroon)' }}
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

            {/* Progress percentage */}
            {uploadProgress > 0 && (
              <p 
                className="font-body text-sm font-medium"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                {Math.round(uploadProgress)}%
              </p>
            )}

            <p 
              className="font-body text-xs mt-1"
              style={{ color: 'var(--color-muted)' }}
            >
              अपलोड हो रहा है...
            </p>
          </div>
        )}
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
          id={`${name}-error`}
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
