import { useState, useCallback } from 'react';
import { AdminFileUpload } from './index';
import {
  uploadPoemManuscript,
  BUCKETS,
  ALLOWED_TYPES,
  SIZE_LIMITS,
  SIZE_LIMITS_READABLE,
  getAcceptString,
  getPublicUrl,
} from '../../services/storageService';

/**
 * ImageUploader - Manuscript image uploader using storageService
 * 
 * Features:
 * - Upload manuscript scans to the manuscripts bucket
 * - Use existing storageService (no direct Supabase calls)
 * - Validate file types and size
 * - Show upload/loading/error states
 * - Return storage path for manuscript_url
 * - Hindi UI labels
 * 
 * Props:
 * - label: string - Upload area label
 * - name: string - Input name
 * - slug: string - Poem/story slug for file naming (required for upload)
 * - value: string - Current manuscript_url (storage path or full URL)
 * - onChange: (url: string | null) => void - Called with storage path after upload
 * - error: string - External error message
 * - disabled: boolean
 * - helpText: string
 * - type: 'poem' | 'story' - Content type for storage path
 */
export default function ImageUploader({
  label = 'पांडुलिपि छवि',
  name = 'manuscript',
  slug,
  value,
  onChange,
  error: externalError,
  disabled = false,
  helpText,
  // type is reserved for future use (story manuscripts)
  // eslint-disable-next-line no-unused-vars
  type = 'poem',
  className = '',
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // Bucket configuration
  const bucket = BUCKETS.MANUSCRIPTS;
  const acceptString = getAcceptString(bucket);
  const maxSize = SIZE_LIMITS[bucket];
  const maxSizeLabel = SIZE_LIMITS_READABLE[bucket];

  // Get preview URL
  const getPreviewUrl = useCallback(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    if (value) {
      // If value is a full URL, use it directly
      if (value.startsWith('http')) {
        return value;
      }
      // If value is a storage path, generate public URL
      return getPublicUrl(bucket, value);
    }
    return null;
  }, [selectedFile, value, bucket]);

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadError('');
    
    // If file is null (removed), clear the value
    if (!file) {
      onChange?.(null);
      return;
    }
  };

  // Handle upload
  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    // Validate slug is provided
    if (!slug?.trim()) {
      setUploadError('कृपया पहले slug दर्ज करें।');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      // Simulate progress (actual upload doesn't provide progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 20, 80));
      }, 200);

      // Upload using storageService
      const result = await uploadPoemManuscript(file, slug);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Return the storage path (not the full URL)
      // The service returns { path, publicUrl }
      onChange?.(result.path);
      setSelectedFile(null);

      // Reset progress after a moment
      setTimeout(() => setUploadProgress(0), 500);
    } catch (err) {
      console.error('Manuscript upload failed:', err);
      setUploadError(err.message || 'अपलोड विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setUploading(false);
    }
  }, [slug, onChange]);

  // Handle remove
  const handleRemove = () => {
    setSelectedFile(null);
    setUploadError('');
    onChange?.(null);
  };

  // Generate help text with file type info
  const defaultHelpText = `${ALLOWED_TYPES[bucket]
    .map(t => t.split('/')[1].toUpperCase())
    .join(', ')} फ़ाइलें स्वीकृत। अधिकतम आकार: ${maxSizeLabel}`;

  // Combine errors
  const displayError = externalError || uploadError;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label 
        className="block font-body text-sm font-medium"
        style={{ color: 'var(--color-ink)' }}
      >
        {label}
      </label>

      {/* Use AdminFileUpload for the UI */}
      <AdminFileUpload
        name={name}
        accept={acceptString}
        maxSize={maxSize}
        maxSizeLabel={maxSizeLabel}
        value={selectedFile}
        onChange={handleFileSelect}
        onUpload={handleUpload}
        currentPreviewUrl={getPreviewUrl()}
        error={displayError}
        uploading={uploading}
        uploadProgress={uploadProgress}
        helpText={helpText || defaultHelpText}
        disabled={disabled}
      />

      {/* Show slug requirement warning */}
      {!slug?.trim() && !disabled && (
        <p 
          className="font-body text-xs"
          style={{ color: 'var(--color-muted)' }}
        >
          ℹ️ फ़ाइल अपलोड करने से पहले slug दर्ज करना आवश्यक है।
        </p>
      )}

      {/* Show current file path if exists */}
      {value && !uploading && (
        <div className="flex items-center justify-between gap-2">
          <code 
            className="flex-1 text-xs px-2 py-1 rounded truncate"
            style={{ 
              backgroundColor: 'var(--color-paper-deep)',
              color: 'var(--color-muted)'
            }}
            title={value}
          >
            {value}
          </code>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ 
                color: '#B91C1C',
                backgroundColor: 'rgba(185, 28, 28, 0.1)',
              }}
            >
              हटाएँ
            </button>
          )}
        </div>
      )}
    </div>
  );
}
