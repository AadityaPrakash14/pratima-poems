import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ServiceError, ServiceErrorCode, mapSupabaseError } from './serviceErrors';

/**
 * Category Service
 * 
 * Handles all category-related operations.
 * Categories organize poems and stories by theme.
 * 
 * SECURITY NOTE:
 * - Uses only the anon key
 * - RLS policies control access:
 *   - Public: can read all categories
 *   - Admin: can create, update, delete
 */

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
 * List all categories
 * @param {object} options - Query options
 * @param {string} [options.type] - Filter by type: 'poem', 'story', 'both'
 * @returns {Promise<Array>} Array of categories
 */
export async function listCategories({ type } = {}) {
  ensureConfigured();

  let query = supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true });

  // Filter by type if specified
  if (type === 'poem') {
    query = query.in('type', ['poem', 'both']);
  } else if (type === 'story') {
    query = query.in('type', ['story', 'both']);
  }

  const { data, error } = await query;

  if (error) {
    throw mapSupabaseError(error);
  }

  return data || [];
}

/**
 * Get a single category by ID
 * @param {string} id - Category UUID
 * @returns {Promise<object>} Category object
 */
export async function getCategoryById(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Category ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Get a single category by slug
 * @param {string} slug - Category slug
 * @returns {Promise<object>} Category object
 */
export async function getCategoryBySlug(slug) {
  ensureConfigured();

  if (!slug) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Category slug आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Create a new category
 * @param {object} categoryData - Category data
 * @param {string} categoryData.name - Hindi category name (required)
 * @param {string} categoryData.slug - URL-friendly slug (required)
 * @param {string} categoryData.type - 'poem', 'story', or 'both' (required)
 * @param {string} [categoryData.description] - Optional description
 * @param {number} [categoryData.display_order] - Sort order
 * @returns {Promise<object>} Created category
 */
export async function createCategory(categoryData) {
  ensureConfigured();

  // Validate required fields
  const { name, slug, type } = categoryData;
  
  if (!name?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'श्रेणी का नाम आवश्यक है।');
  }
  
  if (!slug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Slug आवश्यक है।');
  }

  if (!['poem', 'story', 'both'].includes(type)) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'प्रकार poem, story, या both होना चाहिए।');
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new ServiceError(
      ServiceErrorCode.VALIDATION_ERROR, 
      'Slug में केवल lowercase अक्षर, संख्याएँ और हाइफ़न हो सकते हैं।'
    );
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      type,
      description: categoryData.description?.trim() || null,
      display_order: categoryData.display_order ?? null,
    })
    .select()
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Update an existing category
 * @param {string} id - Category UUID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated category
 */
export async function updateCategory(id, updates) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Category ID आवश्यक है।');
  }

  // Build update object with only provided fields
  const updateData = {};

  if (updates.name !== undefined) {
    if (!updates.name?.trim()) {
      throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'श्रेणी का नाम खाली नहीं हो सकता।');
    }
    updateData.name = updates.name.trim();
  }

  if (updates.slug !== undefined) {
    if (!updates.slug?.trim()) {
      throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Slug खाली नहीं हो सकता।');
    }
    if (!/^[a-z0-9-]+$/.test(updates.slug)) {
      throw new ServiceError(
        ServiceErrorCode.VALIDATION_ERROR,
        'Slug में केवल lowercase अक्षर, संख्याएँ और हाइफ़न हो सकते हैं।'
      );
    }
    updateData.slug = updates.slug.trim().toLowerCase();
  }

  if (updates.type !== undefined) {
    if (!['poem', 'story', 'both'].includes(updates.type)) {
      throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'प्रकार poem, story, या both होना चाहिए।');
    }
    updateData.type = updates.type;
  }

  if (updates.description !== undefined) {
    updateData.description = updates.description?.trim() || null;
  }

  if (updates.display_order !== undefined) {
    updateData.display_order = updates.display_order;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'कोई अपडेट नहीं दिया गया।');
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Delete a category
 * @param {string} id - Category UUID
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Category ID आवश्यक है।');
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    throw mapSupabaseError(error);
  }
}

/**
 * Check if a slug is available
 * @param {string} slug - Slug to check
 * @param {string} [excludeId] - Category ID to exclude (for updates)
 * @returns {Promise<boolean>} True if slug is available
 */
export async function isSlugAvailable(slug, excludeId) {
  ensureConfigured();

  if (!slug?.trim()) {
    return false;
  }

  let query = supabase
    .from('categories')
    .select('id')
    .eq('slug', slug.trim().toLowerCase());

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) {
    throw mapSupabaseError(error);
  }

  return !data || data.length === 0;
}
