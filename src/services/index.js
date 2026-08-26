/**
 * Services Index
 * 
 * Centralized exports for all service modules.
 * Import services from this file for cleaner imports.
 * 
 * Usage:
 * import { poemService, storyService } from '@/services';
 * // or
 * import * as poemService from '@/services/poemService';
 */

// Re-export all services
export * as authService from './authService';
export * as poemService from './poemService';
export * as storyService from './storyService';
export * as categoryService from './categoryService';
export * as storageService from './storageService';

// Re-export error utilities
export { 
  ServiceError, 
  ServiceErrorCode, 
  ServiceErrorMessages,
  mapSupabaseError,
} from './serviceErrors';
