import { useState, useEffect, useMemo } from 'react';
import { StoryCard } from '../components/content';
import { PublicLoadingState, PublicErrorState, PublicEmptyState } from '../components/common';
import { getPublishedStories } from '../services/storyService';
import { listCategories } from '../services/categoryService';
import { isSupabaseConfigured } from '../lib/supabase';
import { ServiceErrorCode } from '../services/serviceErrors';

/**
 * StoriesPage - Listing page for all published stories
 * Editorial composition with the collection as focus
 * Features client-side search and server-side category filtering
 * 
 * Connected to Supabase for published stories with proper loading, empty, and error states.
 */
export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Check if Supabase is configured
  const supabaseReady = isSupabaseConfigured();

  // Load categories on mount
  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      if (!supabaseReady) return;

      try {
        const data = await listCategories({ type: 'story' });
        if (mounted) {
          setCategories(data || []);
        }
      } catch (err) {
        // Categories are optional - don't fail the page if they can't load
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [supabaseReady]);

  // Load stories (with category filter when selected)
  useEffect(() => {
    let mounted = true;

    const loadStories = async () => {
      if (!supabaseReady) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Load stories with optional category filter
        const data = await getPublishedStories({ 
          limit: 50,
          categoryId: selectedCategoryId || undefined
        });
        if (mounted) {
          setStories(data || []);
        }
      } catch (err) {
        console.error('Error loading stories:', err);
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStories();

    return () => {
      mounted = false;
    };
  }, [supabaseReady, retryCount, selectedCategoryId]);

  // Client-side search filtering
  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) {
      return stories;
    }

    const query = searchQuery.trim().toLowerCase();
    return stories.filter(story => {
      const titleMatch = story.title?.toLowerCase().includes(query);
      const excerptMatch = story.excerpt?.toLowerCase().includes(query);
      const contentMatch = story.content?.toLowerCase().includes(query);
      return titleMatch || excerptMatch || contentMatch;
    });
  }, [stories, searchQuery]);

  // Retry handler
  const handleRetry = () => setRetryCount(c => c + 1);

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategoryId !== '';

  // Render content based on state
  const renderContent = () => {
    if (!supabaseReady) {
      return (
        <PublicEmptyState 
          title="कहानियाँ जल्द आ रही हैं"
          message="अभी सिस्टम कॉन्फ़िगर हो रहा है।"
          showHomeLink={true}
        />
      );
    }

    if (loading) {
      return <PublicLoadingState message="कहानियाँ लोड हो रही हैं..." />;
    }

    if (error) {
      const isNotConfigured = error.code === ServiceErrorCode.NOT_CONFIGURED;
      return (
        <PublicErrorState
          title={isNotConfigured ? 'सिस्टम कॉन्फ़िगर नहीं है' : 'कहानियाँ लोड नहीं हो सकीं'}
          message={isNotConfigured ? 'कृपया बाद में पुनः प्रयास करें।' : 'कृपया पुनः प्रयास करें।'}
          onRetry={!isNotConfigured ? handleRetry : undefined}
          showHomeLink={true}
        />
      );
    }

    // No stories at all (no filters active)
    if (stories.length === 0 && !hasActiveFilters) {
      return (
        <PublicEmptyState 
          title="अभी कोई कहानी नहीं है"
          message="नई कहानियाँ जल्द ही यहाँ प्रकाशित होंगी।"
          showHomeLink={true}
        />
      );
    }

    // No results after filtering
    if (filteredStories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
          <div className="mb-6" aria-hidden="true">
            <span 
              className="font-literary text-5xl"
              style={{ color: 'var(--color-border)', opacity: 0.5 }}
            >
              ✧
            </span>
          </div>
          <h3 
            className="font-literary text-xl md:text-2xl font-semibold mb-3"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            कोई परिणाम नहीं मिला
          </h3>
          <p 
            className="font-body text-base max-w-md mb-6"
            style={{ color: 'var(--color-muted)' }}
          >
            आपकी खोज से मेल खाती कोई कहानी नहीं मिली।
          </p>
          <button
            onClick={handleResetFilters}
            className="font-body text-sm font-medium transition-colors"
            style={{ color: 'var(--color-maroon)' }}
          >
            फ़िल्टर हटाएँ →
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Stories Grid - Collection with breathing room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {filteredStories.map((story) => (
            <StoryCard 
              key={story.id}
              slug={story.slug}
              title={story.title}
              excerpt={story.excerpt}
              readingTime={story.reading_time}
              coverUrl={story.cover_url}
              category={story.category}
            />
          ))}
        </div>

        {/* Load More - placeholder for future pagination */}
        {filteredStories.length >= 50 && (
          <div className="text-center mt-16 md:mt-20">
            <button
              disabled
              className="px-8 py-3 rounded-md font-body text-base transition-colors"
              style={{ 
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-muted)'
              }}
            >
              और कहानियाँ देखें
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container-content">
        {/* Page Header - Editorial style */}
        <header className="text-center mb-16 md:mb-20">
          <h1 
            className="font-literary text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-ink)' }}
          >
            कहानियाँ
          </h1>
          <p 
            className="font-literary text-lg md:text-xl italic devanagari-safe"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            कुछ कहानियाँ पढ़ी नहीं जातीं, महसूस की जाती हैं।
          </p>
          
          {/* Subtle decorative divider */}
          <div 
            className="flex items-center justify-center gap-3 mt-8"
            aria-hidden="true"
          >
            <span 
              className="w-12 h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--color-gold))' }}
            />
            <span 
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: 'var(--color-gold)', opacity: 0.6 }}
            />
            <span 
              className="w-12 h-px"
              style={{ background: 'linear-gradient(to left, transparent, var(--color-gold))' }}
            />
          </div>
        </header>

        {/* Search/Filter UI - Functional search and category filter */}
        <div className="max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">कहानियाँ खोजें</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="कहानियाँ खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md font-body text-base"
                  style={{ 
                    backgroundColor: 'var(--color-paper-light)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-ink)'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs transition-colors"
                    style={{ color: 'var(--color-muted)' }}
                    aria-label="खोज साफ़ करें"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <label htmlFor="category" className="sr-only">श्रेणी चुनें</label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md font-body text-base appearance-none cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--color-paper-light)',
                  border: '1px solid var(--color-border)',
                  color: selectedCategoryId ? 'var(--color-ink)' : 'var(--color-muted)'
                }}
              >
                <option value="">सभी श्रेणियाँ</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
}
