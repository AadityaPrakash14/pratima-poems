import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ServiceError, ServiceErrorCode, mapSupabaseError } from './serviceErrors';

/**
 * Story Service
 * 
 * Handles all story-related operations for both public and admin use.
 * 
 * SECURITY NOTE:
 * - Uses only the anon key
 * - RLS policies control access:
 *   - Public (anon): can only read published stories
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
 * Common select fields for story listings (without full content)
 */
const LIST_SELECT = `
  id,
  title,
  slug,
  subtitle,
  excerpt,
  cover_url,
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
 * Get published stories for public listing
 * @param {object} options - Query options
 * @param {number} [options.limit=10] - Number of stories to fetch
 * @param {number} [options.offset=0] - Offset for pagination
 * @param {string} [options.categoryId] - Filter by category
 * @returns {Promise<Array>} Array of published stories
 */
export async function getPublishedStories({ limit = 10, offset = 0, categoryId } = {}) {
  ensureConfigured();

  let query = supabase
    .from('stories')
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
 * Get featured published stories for homepage
 * @param {number} [limit=3] - Number of featured stories
 * @returns {Promise<Array>} Array of featured stories
 */
export async function getFeaturedStories(limit = 3) {
  ensureConfigured();

  const { data, error } = await supabase
    .from('stories')
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
 * Get a published story by slug (public access)
 * @param {string} slug - Story slug
 * @returns {Promise<object>} Story with category
 */
export async function getPublishedStoryBySlug(slug) {
  ensureConfigured();

  if (!slug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Slug आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('stories')
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
 * List all stories for admin (includes drafts and archived)
 * @param {object} options - Query options
 * @param {number} [options.limit=50] - Number of stories to fetch
 * @param {number} [options.offset=0] - Offset for pagination
 * @param {string} [options.status] - Filter by status: 'draft', 'published', 'archived'
 * @param {string} [options.categoryId] - Filter by category
 * @param {boolean} [options.featuredOnly] - Show only featured
 * @returns {Promise<Array>} Array of stories
 */
export async function listStories({
  limit = 50,
  offset = 0,
  status,
  categoryId,
  featuredOnly
} = {}) {
  ensureConfigured();

  let query = supabase
    .from('stories')
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
 * Get a single story by ID (admin access)
 * @param {string} id - Story UUID
 * @returns {Promise<object>} Story with category
 */
export async function getStoryById(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Story ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('stories')
    .select(FULL_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Get a single story by slug (admin access - any status)
 * @param {string} slug - Story slug
 * @returns {Promise<object>} Story with category
 */
export async function getStoryBySlug(slug) {
  ensureConfigured();

  if (!slug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Slug आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('stories')
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
 * Create a new story
 * @param {object} storyData - Story data
 * @param {string} storyData.title - Hindi title (required)
 * @param {string} storyData.slug - URL-friendly slug (required)
 * @param {string} storyData.content - Full story text (required)
 * @param {string} [storyData.subtitle] - Secondary title
 * @param {string} [storyData.excerpt] - Short preview
 * @param {string} [storyData.cover_url] - Storage path to cover image
 * @param {string} [storyData.category_id] - Category UUID
 * @param {string} [storyData.written_date] - Original composition date (YYYY-MM-DD)
 * @param {number} [storyData.reading_time] - Estimated minutes to read
 * @param {boolean} [storyData.featured=false] - Display on homepage
 * @param {number} [storyData.display_order] - Sort order for featured
 * @param {string} [storyData.manuscript_url] - Storage path to manuscript
 * @returns {Promise<object>} Created story
 */
export async function createStory(storyData) {
  ensureConfigured();

  // Validate required fields
  const { title, slug, content } = storyData;

  if (!title?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'कहानी का शीर्षक आवश्यक है।');
  }

  if (!slug?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Slug आवश्यक है।');
  }

  if (!content?.trim()) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'कहानी का पाठ आवश्यक है।');
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new ServiceError(
      ServiceErrorCode.VALIDATION_ERROR,
      'Slug में केवल lowercase अक्षर, संख्याएँ और हाइफ़न हो सकते हैं।'
    );
  }

  const { data, error } = await supabase
    .from('stories')
    .insert({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      content: content.trim(),
      subtitle: storyData.subtitle?.trim() || null,
      excerpt: storyData.excerpt?.trim() || null,
      cover_url: storyData.cover_url || null,
      category_id: storyData.category_id || null,
      written_date: storyData.written_date || null,
      reading_time: storyData.reading_time ?? null,
      featured: storyData.featured ?? false,
      display_order: storyData.display_order ?? null,
      manuscript_url: storyData.manuscript_url || null,
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
 * Update an existing story
 * @param {string} id - Story UUID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated story
 */
export async function updateStory(id, updates) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Story ID आवश्यक है।');
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

  if (updates.cover_url !== undefined) {
    updateData.cover_url = updates.cover_url || null;
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
    .from('stories')
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
 * Delete a story
 * @param {string} id - Story UUID
 * @returns {Promise<void>}
 */
export async function deleteStory(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Story ID आवश्यक है।');
  }

  const { error } = await supabase
    .from('stories')
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
 * Publish a story (draft/archived → published)
 * Sets status to 'published' and updates published_at timestamp
 * @param {string} id - Story UUID
 * @returns {Promise<object>} Updated story
 */
export async function publishStory(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Story ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('stories')
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
 * Archive a story (any status → archived)
 * @param {string} id - Story UUID
 * @returns {Promise<object>} Updated story
 */
export async function archiveStory(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Story ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('stories')
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
 * Restore a story to draft status (archived → draft)
 * @param {string} id - Story UUID
 * @returns {Promise<object>} Updated story
 */
export async function restoreStoryToDraft(id) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Story ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('stories')
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
 * Restore an archived story directly to published
 * @param {string} id - Story UUID
 * @returns {Promise<object>} Updated story
 */
export async function restoreStoryToPublished(id) {
  return publishStory(id);
}

// ============================================
// FEATURED CONTENT
// ============================================

/**
 * Update featured status and display order
 * @param {string} id - Story UUID
 * @param {boolean} featured - Whether story is featured
 * @param {number|null} [displayOrder] - Sort order (lower = first)
 * @returns {Promise<object>} Updated story
 */
export async function updateFeaturedStatus(id, featured, displayOrder) {
  ensureConfigured();

  if (!id) {
    throw new ServiceError(ServiceErrorCode.VALIDATION_ERROR, 'Story ID आवश्यक है।');
  }

  const { data, error } = await supabase
    .from('stories')
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
 * @param {string} [excludeId] - Story ID to exclude (for updates)
 * @returns {Promise<boolean>} True if slug is available
 */
export async function isSlugAvailable(slug, excludeId) {
  ensureConfigured();

  if (!slug?.trim()) {
    return false;
  }

  let query = supabase
    .from('stories')
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
 * Get story counts by status
 * @returns {Promise<{draft: number, published: number, archived: number, total: number}>}
 */
export async function getStoryCounts() {
  ensureConfigured();

  const { data, error } = await supabase
    .from('stories')
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
    data.forEach(story => {
      counts[story.status]++;
      counts.total++;
    });
  }

  return counts;
}
