import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ServiceError, ServiceErrorCode, mapSupabaseError } from './serviceErrors';

/**
 * Poem Service
 * 
 * Handles all poem-related operations for both public and admin use.
 * 
 * SECURITY NOTE:
 * - Uses only the anon key
 * - RLS policies control access:
 *   - Public (anon): can only read published poems
 *   - Admin (authenticated + is_admin): full CRUD access
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
 * Common select fields for poem listings (without full content)
 */
const LIST_SELECT = `
  id,
  title,
  slug,
  subtitle,
  excerpt,
  category_id,
  written_date,
  reading_time,
  status,
  featured,
  display_order,
  manuscript_url,
  created_at,
  updated_at,
  published_at
`;

/**
 * Full select with category join
 */
const FULL_SELECT = `
  *,
  category:categories(id, name, slug)
`;

// ============================================
// PUBLIC QUERIES
// ============================================

/**
 * Get published poems for public listing
 * @param {object} options - Query options
 * @param {number} [options.limit=10] - Number of poems to fetch
 * @param {number} [options.offset=0] - Offset for pagination
 * @param {string} [options.categoryId] - Filter by category
 * @returns {Promise<Array>} Array of published poems
 */
export async function getPublishedPoems({ limit = 10, offset = 0, categoryId } = {}) {
  ensureConfigured();

  let query = supabase
    .from('poems')
    .select(LIST_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw mapSupabaseError(error);
  }

  return data || [];
}

/**
 * Get featured published poems for homepage
 * @param {number} [limit=3] - Number of featured poems
 * @returns {Promise<Array>} Array of featured poems
 */
export async function getFeaturedPoems(limit = 3) {
  ensureConfigured();

  const { data, error } = await supabase
    .from('poems')
    .select(LIST_SELECT)
    .eq('status', 'published')
    .eq('featured', true)
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw mapSupabaseError(error);
  }

  return data || [];
}

/**
 * Get a published poem by slug (public access)
 * @param {string} slug - Poem slug
 * @returns {Promise<object>} Poem with category
 */
export async function getPublishedPoemBySlug(slug) {
  ensureConfigured();

  if (!slug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Slug आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('poems')
    .select(FULL_SELECT)
    .eq('slug', slug.trim())
    .eq('status', 'published')
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

// ============================================
// ADMIN QUERIES
// ============================================

/**
 * List all poems for admin (includes drafts and archived)
 * @param {object} options - Query options
 * @param {number} [options.limit=50] - Number of poems to fetch
 * @param {number} [options.offset=0] - Offset for pagination
 * @param {string} [options.status] - Filter by status: 'draft', 'published', 'archived'
 * @param {string} [options.categoryId] - Filter by category
 * @param {boolean} [options.featuredOnly] - Show only featured
 * @returns {Promise<Array>} Array of poems
 */
export async function listPoems({ 
  limit = 50, 
  offset = 0, 
  status, 
  categoryId,
  featuredOnly 
} = {}) {
  ensureConfigured();

  let query = supabase
    .from('poems')
    .select(`${LIST_SELECT}, category:categories(id, name, slug)`)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (featuredOnly) {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;

  if (error) {
    throw mapSupabaseError(error);
  }

  return data || [];
}

/**
 * Get a single poem by ID (admin access)
 * @param {string} id - Poem UUID
 * @returns {Promise<object>} Poem with category
 */
export async function getPoemById(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Poem ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('poems')
    .select(FULL_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Get a single poem by slug (admin access - any status)
 * @param {string} slug - Poem slug
 * @returns {Promise<object>} Poem with category
 */
export async function getPoemBySlug(slug) {
  ensureConfigured();

  if (!slug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Slug आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('poems')
    .select(FULL_SELECT)
    .eq('slug', slug.trim())
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

// ============================================
// ADMIN MUTATIONS
// ============================================

/**
 * Create a new poem
 * @param {object} poemData - Poem data
 * @param {string} poemData.title - Hindi title (required)
 * @param {string} poemData.slug - URL-friendly slug (required)
 * @param {string} poemData.content - Full poem text (required)
 * @param {string} [poemData.subtitle] - Secondary title
 * @param {string} [poemData.excerpt] - Short preview
 * @param {string} [poemData.category_id] - Category UUID
 * @param {string} [poemData.written_date] - Original composition date (YYYY-MM-DD)
 * @param {number} [poemData.reading_time] - Estimated minutes to read
 * @param {boolean} [poemData.featured=false] - Display on homepage
 * @param {number} [poemData.display_order] - Sort order for featured
 * @param {string} [poemData.manuscript_url] - Storage path to manuscript
 * @returns {Promise<object>} Created poem
 */
export async function createPoem(poemData) {
  ensureConfigured();

  // Validate required fields
  const { title, slug, content } = poemData;

  if (!title?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'कविता का शीर्षक आवश्यक है।');
  }

  if (!slug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Slug आवश्यक है।');
  }

  if (!content?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'कविता का पाठ आवश्यक है।');
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new ServiceError(
      ServiceErrorCode.VALIDATION_ERROR,
      'Slug में केवल lowercase अक्षर, संख्याएँ और हाइफ़न हो सकते हैं।'
    );
  }

  const { data, error } = await supabase
    .from('poems')
    .insert({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      content: content.trim(),
      subtitle: poemData.subtitle?.trim() || null,
      excerpt: poemData.excerpt?.trim() || null,
      category_id: poemData.category_id || null,
      written_date: poemData.written_date || null,
      reading_time: poemData.reading_time ?? null,
      featured: poemData.featured ?? false,
      display_order: poemData.display_order ?? null,
      manuscript_url: poemData.manuscript_url || null,
      status: 'draft', // Always create as draft
    })
    .select(FULL_SELECT)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Update an existing poem
 * @param {string} id - Poem UUID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated poem
 */
export async function updatePoem(id, updates) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Poem ID आवश्यक है।');
  }

  // Build update object
  const updateData = {};

  if (updates.title !== undefined) {
    if (!updates.title?.trim()) {
      throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'शीर्षक खाली नहीं हो सकता।');
    }
    updateData.title = updates.title.trim();
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

  if (updates.content !== undefined) {
    if (!updates.content?.trim()) {
      throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'पाठ खाली नहीं हो सकता।');
    }
    updateData.content = updates.content.trim();
  }

  if (updates.subtitle !== undefined) {
    updateData.subtitle = updates.subtitle?.trim() || null;
  }

  if (updates.excerpt !== undefined) {
    updateData.excerpt = updates.excerpt?.trim() || null;
  }

  if (updates.category_id !== undefined) {
    updateData.category_id = updates.category_id || null;
  }

  if (updates.written_date !== undefined) {
    updateData.written_date = updates.written_date || null;
  }

  if (updates.reading_time !== undefined) {
    updateData.reading_time = updates.reading_time ?? null;
  }

  if (updates.featured !== undefined) {
    updateData.featured = Boolean(updates.featured);
  }

  if (updates.display_order !== undefined) {
    updateData.display_order = updates.display_order ?? null;
  }

  if (updates.manuscript_url !== undefined) {
    updateData.manuscript_url = updates.manuscript_url || null;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'कोई अपडेट नहीं दिया गया।');
  }

  const { data, error } = await supabase
    .from('poems')
    .update(updateData)
    .eq('id', id)
    .select(FULL_SELECT)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Delete a poem
 * @param {string} id - Poem UUID
 * @returns {Promise<void>}
 */
export async function deletePoem(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Poem ID आवश्यक है।');
  }

  const { error } = await supabase
    .from('poems')
    .delete()
    .eq('id', id);

  if (error) {
    throw mapSupabaseError(error);
  }
}

// ============================================
// STATUS TRANSITIONS
// ============================================

/**
 * Publish a poem (draft/archived → published)
 * Sets status to 'published' and updates published_at timestamp
 * @param {string} id - Poem UUID
 * @returns {Promise<object>} Updated poem
 */
export async function publishPoem(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Poem ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('poems')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(FULL_SELECT)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Archive a poem (any status → archived)
 * @param {string} id - Poem UUID
 * @returns {Promise<object>} Updated poem
 */
export async function archivePoem(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Poem ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('poems')
    .update({ status: 'archived' })
    .eq('id', id)
    .select(FULL_SELECT)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Restore a poem to draft status (archived → draft)
 * @param {string} id - Poem UUID
 * @returns {Promise<object>} Updated poem
 */
export async function restorePoemToDraft(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Poem ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('poems')
    .update({ status: 'draft' })
    .eq('id', id)
    .select(FULL_SELECT)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Restore an archived poem directly to published
 * @param {string} id - Poem UUID
 * @returns {Promise<object>} Updated poem
 */
export async function restorePoemToPublished(id) {
  return publishPoem(id);
}

// ============================================
// FEATURED CONTENT
// ============================================

/**
 * Update featured status and display order
 * @param {string} id - Poem UUID
 * @param {boolean} featured - Whether poem is featured
 * @param {number|null} [displayOrder] - Sort order (lower = first)
 * @returns {Promise<object>} Updated poem
 */
export async function updateFeaturedStatus(id, featured, displayOrder) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Poem ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('poems')
    .update({
      featured: Boolean(featured),
      display_order: displayOrder ?? null,
    })
    .eq('id', id)
    .select(FULL_SELECT)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

// ============================================
// HELPERS
// ============================================

/**
 * Check if a slug is available
 * @param {string} slug - Slug to check
 * @param {string} [excludeId] - Poem ID to exclude (for updates)
 * @returns {Promise<boolean>} True if slug is available
 */
export async function isSlugAvailable(slug, excludeId) {
  ensureConfigured();

  if (!slug?.trim()) {
    return false;
  }

  let query = supabase
    .from('poems')
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

/**
 * Get poem counts by status
 * @returns {Promise<{draft: number, published: number, archived: number, total: number}>}
 */
export async function getPoemCounts() {
  ensureConfigured();

  const { data, error } = await supabase
    .from('poems')
    .select('status');

  if (error) {
    throw mapSupabaseError(error);
  }

  const counts = {
    draft: 0,
    published: 0,
    archived: 0,
    total: 0,
  };

  if (data) {
    data.forEach(poem => {
      counts[poem.status]++;
      counts.total++;
    });
  }

  return counts;
}
