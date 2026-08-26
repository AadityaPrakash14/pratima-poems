/**
 * Service Layer Error Handling
 * 
 * Provides consistent error types and messages for all service operations.
 * UI components can use error.code to determine appropriate user feedback.
 * 
 * SECURITY NOTE:
 * - Never expose raw database errors to users
 * - Log detailed errors for debugging, return user-friendly messages
 */

/**
 * Service error codes
 * UI components can switch on these to show appropriate messages
 */
export const ServiceErrorCode = {
  // Configuration
  NOT_CONFIGURED: 'NOT_CONFIGURED',
  
  // Authentication/Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_SLUG: 'DUPLICATE_SLUG',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  
  // Data
  NOT_FOUND: 'NOT_FOUND',
  
  // Network/Server
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  
  // Storage
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  DELETE_FAILED: 'DELETE_FAILED',
  
  // Unknown
  UNKNOWN: 'UNKNOWN',
};

/**
 * User-friendly error messages in Hindi
 */
export const ServiceErrorMessages = {
  [ServiceErrorCode.NOT_CONFIGURED]: 'Supabase कॉन्फ़िगर नहीं है।',
  [ServiceErrorCode.UNAUTHORIZED]: 'कृपया पहले लॉगिन करें।',
  [ServiceErrorCode.FORBIDDEN]: 'आपके पास यह कार्य करने की अनुमति नहीं है।',
  [ServiceErrorCode.VALIDATION_ERROR]: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
  [ServiceErrorCode.DUPLICATE_SLUG]: 'यह slug पहले से उपयोग में है। कृपया दूसरा चुनें।',
  [ServiceErrorCode.INVALID_FILE_TYPE]: 'इस प्रकार की फ़ाइल की अनुमति नहीं है।',
  [ServiceErrorCode.FILE_TOO_LARGE]: 'फ़ाइल बहुत बड़ी है।',
  [ServiceErrorCode.NOT_FOUND]: 'अनुरोधित आइटम नहीं मिला।',
  [ServiceErrorCode.NETWORK_ERROR]: 'कनेक्शन में समस्या है। कृपया पुनः प्रयास करें।',
  [ServiceErrorCode.SERVER_ERROR]: 'सर्वर में समस्या है। कृपया बाद में प्रयास करें।',
  [ServiceErrorCode.UPLOAD_FAILED]: 'फ़ाइल अपलोड नहीं हो सकी। कृपया पुनः प्रयास करें।',
  [ServiceErrorCode.DELETE_FAILED]: 'फ़ाइल हटाई नहीं जा सकी।',
  [ServiceErrorCode.UNKNOWN]: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
};

/**
 * Custom error class for service layer
 */
export class ServiceError extends Error {
  /**
   * @param {string} code - Error code from ServiceErrorCode
   * @param {string} [message] - Optional custom message (defaults to Hindi message)
   * @param {Error} [cause] - Original error for debugging
   */
  constructor(code, message, cause) {
    super(message || ServiceErrorMessages[code] || ServiceErrorMessages[ServiceErrorCode.UNKNOWN]);
    this.name = 'ServiceError';
    this.code = code;
    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * Map Supabase/PostgreSQL errors to ServiceError
 * @param {object} error - Supabase error object
 * @returns {ServiceError}
 */
export function mapSupabaseError(error) {
  // Log for debugging (won't show to user)
  console.error('Supabase error:', error);

  // Handle specific PostgreSQL error codes
  if (error.code === '23505') {
    // Unique violation
    if (error.message?.includes('slug')) {
      return new ServiceError(ServiceErrorCode.DUPLICATE_SLUG, undefined, error);
    }
    return new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'यह मान पहले से मौजूद है।', error);
  }

  if (error.code === '23503') {
    // Foreign key violation
    return new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'संदर्भित आइटम मौजूद नहीं है।', error);
  }

  if (error.code === '42501' || error.message?.includes('RLS') || error.message?.includes('policy')) {
    // RLS policy violation
    return new ServiceError(ServiceErrorCode.FORBIDDEN, undefined, error);
  }

  if (error.code === 'PGRST116') {
    // No rows returned (single() failed)
    return new ServiceError(ServiceErrorCode.NOT_FOUND, undefined, error);
  }

  // Network errors
  if (error.message?.includes('network') || error.message?.includes('fetch') || error.name === 'TypeError') {
    return new ServiceError(ServiceErrorCode.NETWORK_ERROR, undefined, error);
  }

  // Authentication errors
  if (error.message?.includes('JWT') || error.message?.includes('token') || error.status === 401) {
    return new ServiceError(ServiceErrorCode.UNAUTHORIZED, undefined, error);
  }

  // Server errors
  if (error.status >= 500) {
    return new ServiceError(ServiceErrorCode.SERVER_ERROR, undefined, error);
  }

  // Default to unknown
  return new ServiceError(ServiceErrorCode.UNKNOWN, undefined, error);
}

/**
 * Wrap async service function with consistent error handling
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function that throws ServiceError
 */
export function withErrorHandling(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw mapSupabaseError(error);
    }
  };
}
