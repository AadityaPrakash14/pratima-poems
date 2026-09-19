import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ServiceError, ServiceErrorCode } from './serviceErrors';

/**
 * Storage Service
 * 
 * Handles file uploads to Supabase Storage.
 * Manages cover images and manuscript scans.
 * 
 * SECURITY NOTE:
 * - Uses only the anon key
 * - RLS policies control access:
 *   - Public: can read all files in covers and manuscripts buckets
 *   - Admin: can upload, update, delete files
 * 
 * File naming conventions (per DATABASE_SCHEMA.md):
 * - covers/{story_slug}.{ext}
 * - manuscripts/poems/{poem_slug}.{ext}
 * - manuscripts/stories/{story_slug}.{ext}
 */

/**
 * Storage bucket configuration
 */
export const BUCKETS = {
  COVERS: 'covers',
  MANUSCRIPTS: 'manuscripts',
};

/**
 * Allowed file types per bucket
 */
export const ALLOWED_TYPES = {
  [BUCKETS.COVERS]: ['image/jpeg', 'image/png', 'image/webp'],
  [BUCKETS.MANUSCRIPTS]: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};

/**
 * File size limits per bucket (in bytes)
 */
export const SIZE_LIMITS = {
  [BUCKETS.COVERS]: 5 * 1024 * 1024,      // 5MB
  [BUCKETS.MANUSCRIPTS]: 10 * 1024 * 1024, // 10MB
};

/**
 * Human-readable size limits
 */
export const SIZE_LIMITS_READABLE = {
  [BUCKETS.COVERS]: '5MB',
  [BUCKETS.MANUSCRIPTS]: '10MB',
};

/**
 * Ensure Supabase is configured
 * @throws {ServiceError} If not configured
 */
function ensureConfigured() {
  if (!isSupabaseConfigured()) {
    throw new ServiceError(ServiceErrorCode.NOT_CONFIGURED);
  }
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {string} bucket - Target bucket
 * @throws {ServiceError} If validation fails
 */
function validateFile(file, bucket) {
  if (!file) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'फ़ाइल आवश्यक है।');
  }

  // Check file type
  const allowedTypes = ALLOWED_TYPES[bucket];
  if (!allowedTypes || !allowedTypes.includes(file.type)) {
    const allowedExt = allowedTypes
      ?.map(type => type.split('/')[1].toUpperCase())
      .join(', ');
    throw new ServiceError(
      ServiceErrorCode.INVALID_FILE_TYPE,
      `केवल ${allowedExt} फ़ाइलें अनुमत हैं।`
    );
  }

  // Check file size
  const sizeLimit = SIZE_LIMITS[bucket];
  if (sizeLimit && file.size > sizeLimit) {
    throw new ServiceError(
      ServiceErrorCode.FILE_TOO_LARGE,
      `फ़ाइल ${SIZE_LIMITS_READABLE[bucket]} से बड़ी नहीं होनी चाहिए।`
    );
  }
}

/**
 * Get file extension from mime type
 * @param {string} mimeType - MIME type
 * @returns {string} File extension
 */
function getExtension(mimeType) {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
  };
  return extensions[mimeType] || 'bin';
}

/**
 * Get public URL for a file
 * @param {string} bucket - Bucket name
 * @param {string} path - File path within bucket
 * @returns {string} Public URL
 */
export function getPublicUrl(bucket, path) {
  ensureConfigured();

  if (!bucket || !path) {
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
}

/**
 * Extract storage path from a full public URL
 * @param {string} url - Full public URL
 * @param {string} bucket - Expected bucket name
 * @returns {string|null} Storage path or null if not matching
 */
export function extractPathFromUrl(url, bucket) {
  if (!url || !bucket) {
    return null;
  }

  // URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
  const pattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`);
  const match = url.match(pattern);
  return match ? match[1] : null;
}

// ============================================
// COVER IMAGE OPERATIONS
// ============================================

/**
 * Upload a cover image for a story
 * @param {File} file - Image file
 * @param {string} storySlug - Story slug for naming
 * @returns {Promise<{path: string, publicUrl: string}>}
 */
export async function uploadCoverImage(file, storySlug) {
  ensureConfigured();

  if (!storySlug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Story slug आवश्यक है।');
  }

  validateFile(file, BUCKETS.COVERS);

  const extension = getExtension(file.type);
  const path = `${storySlug.trim().toLowerCase()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.COVERS)
    .upload(path, file, {
      upsert: true, // Replace if exists
      contentType: file.type,
    });

  if (error) {
    console.error('Cover upload error:', error);
    throw new ServiceError(ServiceErrorCode.UPLOAD_FAILED, undefined, error);
  }

  const publicUrl = getPublicUrl(BUCKETS.COVERS, data.path);

  return {
    path: data.path,
    publicUrl,
  };
}

/**
 * Delete a cover image
 * @param {string} pathOrUrl - Storage path or public URL
 * @returns {Promise<void>}
 */
export async function deleteCoverImage(pathOrUrl) {
  ensureConfigured();

  if (!pathOrUrl) {
    return; // Nothing to delete
  }

  // Extract path if full URL provided
  let path = pathOrUrl;
  if (pathOrUrl.startsWith('http')) {
    path = extractPathFromUrl(pathOrUrl, BUCKETS.COVERS);
    if (!path) {
      console.warn('Could not extract path from URL:', pathOrUrl);
      return;
    }
  }

  const { error } = await supabase.storage
    .from(BUCKETS.COVERS)
    .remove([path]);

  if (error) {
    console.error('Cover delete error:', error);
    throw new ServiceError(ServiceErrorCode.DELETE_FAILED, undefined, error);
  }
}

/**
 * Replace a cover image (delete old, upload new)
 * @param {File} file - New image file
 * @param {string} storySlug - Story slug for naming
 * @param {string} [oldUrl] - URL of old image to delete
 * @returns {Promise<{path: string, publicUrl: string}>}
 */
export async function replaceCoverImage(file, storySlug, oldUrl) {
  // Delete old image if different slug (in case slug changed)
  if (oldUrl) {
    const oldPath = extractPathFromUrl(oldUrl, BUCKETS.COVERS);
    const newPath = `${storySlug.trim().toLowerCase()}.${getExtension(file.type)}`;
    
    // Only delete if the paths are different (slug changed or extension changed)
    // If same path, upsert will handle it
    if (oldPath && oldPath !== newPath) {
      try {
        await deleteCoverImage(oldPath);
      } catch {
        // Ignore delete errors - proceed with upload
        console.warn('Could not delete old cover, proceeding with upload');
      }
    }
  }

  return uploadCoverImage(file, storySlug);
}

// ============================================
// MANUSCRIPT OPERATIONS
// ============================================

/**
 * Upload a manuscript image for a poem
 * @param {File} file - Image/PDF file
 * @param {string} poemSlug - Poem slug for naming
 * @returns {Promise<{path: string, publicUrl: string}>}
 */
export async function uploadPoemManuscript(file, poemSlug) {
  ensureConfigured();

  if (!poemSlug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Poem slug आवश्यक है।');
  }

  validateFile(file, BUCKETS.MANUSCRIPTS);

  const extension = getExtension(file.type);
  const path = `poems/${poemSlug.trim().toLowerCase()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.MANUSCRIPTS)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error('Poem manuscript upload error:', error);
    throw new ServiceError(ServiceErrorCode.UPLOAD_FAILED, undefined, error);
  }

  const publicUrl = getPublicUrl(BUCKETS.MANUSCRIPTS, data.path);

  return {
    path: data.path,
    publicUrl,
  };
}

/**
 * Upload a manuscript image for a story
 * @param {File} file - Image/PDF file
 * @param {string} storySlug - Story slug for naming
 * @returns {Promise<{path: string, publicUrl: string}>}
 */
export async function uploadStoryManuscript(file, storySlug) {
  ensureConfigured();

  if (!storySlug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Story slug आवश्यक है।');
  }

  validateFile(file, BUCKETS.MANUSCRIPTS);

  const extension = getExtension(file.type);
  const path = `stories/${storySlug.trim().toLowerCase()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.MANUSCRIPTS)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error('Story manuscript upload error:', error);
    throw new ServiceError(ServiceErrorCode.UPLOAD_FAILED, undefined, error);
  }

  const publicUrl = getPublicUrl(BUCKETS.MANUSCRIPTS, data.path);

  return {
    path: data.path,
    publicUrl,
  };
}

/**
 * Delete a manuscript file
 * @param {string} pathOrUrl - Storage path or public URL
 * @returns {Promise<void>}
 */
export async function deleteManuscript(pathOrUrl) {
  ensureConfigured();

  if (!pathOrUrl) {
    return;
  }

  let path = pathOrUrl;
  if (pathOrUrl.startsWith('http')) {
    path = extractPathFromUrl(pathOrUrl, BUCKETS.MANUSCRIPTS);
    if (!path) {
      console.warn('Could not extract path from URL:', pathOrUrl);
      return;
    }
  }

  const { error } = await supabase.storage
    .from(BUCKETS.MANUSCRIPTS)
    .remove([path]);

  if (error) {
    console.error('Manuscript delete error:', error);
    throw new ServiceError(ServiceErrorCode.DELETE_FAILED, undefined, error);
  }
}

/**
 * Replace a poem manuscript (delete old, upload new)
 * @param {File} file - New file
 * @param {string} poemSlug - Poem slug for naming
 * @param {string} [oldUrl] - URL of old file to delete
 * @returns {Promise<{path: string, publicUrl: string}>}
 */
export async function replacePoemManuscript(file, poemSlug, oldUrl) {
  if (oldUrl) {
    const oldPath = extractPathFromUrl(oldUrl, BUCKETS.MANUSCRIPTS);
    const newPath = `poems/${poemSlug.trim().toLowerCase()}.${getExtension(file.type)}`;
    
    if (oldPath && oldPath !== newPath) {
      try {
        await deleteManuscript(oldPath);
      } catch {
        console.warn('Could not delete old manuscript, proceeding with upload');
      }
    }
  }

  return uploadPoemManuscript(file, poemSlug);
}

/**
 * Replace a story manuscript (delete old, upload new)
 * @param {File} file - New file
 * @param {string} storySlug - Story slug for naming
 * @param {string} [oldUrl] - URL of old file to delete
 * @returns {Promise<{path: string, publicUrl: string}>}
 */
export async function replaceStoryManuscript(file, storySlug, oldUrl) {
  if (oldUrl) {
    const oldPath = extractPathFromUrl(oldUrl, BUCKETS.MANUSCRIPTS);
    const newPath = `stories/${storySlug.trim().toLowerCase()}.${getExtension(file.type)}`;
    
    if (oldPath && oldPath !== newPath) {
      try {
        await deleteManuscript(oldPath);
      } catch {
        console.warn('Could not delete old manuscript, proceeding with upload');
      }
    }
  }

  return uploadStoryManuscript(file, storySlug);
}

// ============================================
// UTILITIES
// ============================================

/**
 * Check if a file type is allowed for a bucket
 * @param {string} mimeType - File MIME type
 * @param {string} bucket - Target bucket
 * @returns {boolean}
 */
export function isFileTypeAllowed(mimeType, bucket) {
  const allowed = ALLOWED_TYPES[bucket];
  return allowed ? allowed.includes(mimeType) : false;
}

/**
 * Check if file size is within limit for a bucket
 * @param {number} size - File size in bytes
 * @param {string} bucket - Target bucket
 * @returns {boolean}
 */
export function isFileSizeAllowed(size, bucket) {
  const limit = SIZE_LIMITS[bucket];
  return limit ? size <= limit : true;
}

/**
 * Get allowed file types for a bucket (as accept string)
 * @param {string} bucket - Bucket name
 * @returns {string} Accept string for file input (e.g., "image/jpeg,image/png")
 */
export function getAcceptString(bucket) {
  const types = ALLOWED_TYPES[bucket];
  return types ? types.join(',') : '*';
}
