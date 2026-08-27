import { useState, useEffect } from 'react';
import { PoemCard } from '../components/content';
import { PublicLoadingState, PublicErrorState, PublicEmptyState } from '../components/common';
import { getPublishedPoems } from '../services/poemService';
import { isSupabaseConfigured } from '../lib/supabase';
import { ServiceErrorCode } from '../services/serviceErrors';

/**
 * PoemsPage - Listing page for all published poems
 * Editorial composition with the collection as focus
 * Search/filter UI is understated and currently disabled
 * 
 * Now connected to Supabase for published poems with proper loading, empty, and error states.
 */
export default function PoemsPage() {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Supabase is configured
  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    const loadPoems = async () => {
      if (!supabaseReady) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Load more poems for listing page (up to 50)
        const data = await getPublishedPoems({ limit: 50 });
        if (mounted) {
          setPoems(data || []);
        }
      } catch (err) {
        console.error('Error loading poems:', err);
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPoems();

    return () => {
      mounted = false;
    };
  }, [supabaseReady, retryCount]);

  // Retry handler
  const handleRetry = () => setRetryCount(c => c + 1);

  // Render content based on state
  const renderContent = () => {
    if (!supabaseReady) {
      return (
        <PublicEmptyState 
          title="कविताएँ जल्द आ रही हैं"
          message="अभी सिस्टम कॉन्फ़िगर हो रहा है।"
          showHomeLink={true}
        />
      );
    }

    if (loading) {
      return <PublicLoadingState message="कविताएँ लोड हो रही हैं..." />;
    }

    if (error) {
      const isNotConfigured = error.code === ServiceErrorCode.NOT_CONFIGURED;
      return (
        <PublicErrorState
          title={isNotConfigured ? 'सिस्टम कॉन्फ़िगर नहीं है' : 'कविताएँ लोड नहीं हो सकीं'}
          message={isNotConfigured ? 'कृपया बाद में पुनः प्रयास करें।' : 'कृपया पुनः प्रयास करें।'}
          onRetry={!isNotConfigured ? handleRetry : undefined}
          showHomeLink={true}
        />
      );
    }

    if (poems.length === 0) {
      return (
        <PublicEmptyState 
          title="अभी कोई कविता नहीं है"
          message="नई कविताएँ जल्द ही यहाँ प्रकाशित होंगी।"
          showHomeLink={true}
        />
      );
    }

    return (
      <>
        {/* Poems Grid - Collection with breathing room */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {poems.map((poem) => (
            <PoemCard 
              key={poem.id}
              slug={poem.slug}
              title={poem.title}
              excerpt={poem.excerpt}
              readingTime={poem.reading_time}
              category={poem.category}
            />
          ))}
        </div>

        {/* Load More - placeholder for future pagination */}
        {poems.length >= 50 && (
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
              और कविताएँ देखें
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
            कविताएँ
          </h1>
          <p 
            className="font-literary text-lg md:text-xl italic devanagari-safe"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            शब्दों में संजोए हुए अनुभव...
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

        {/* Search/Filter UI - Understated, disabled for now */}
        <div className="max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input Placeholder */}
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">कविताएँ खोजें</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="कविताएँ खोजें..."
                  disabled
                  className="w-full px-4 py-2.5 rounded-md font-body text-base"
                  style={{ 
                    backgroundColor: 'var(--color-paper-light)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-ink)'
                  }}
                />
                <span 
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs"
                  style={{ color: 'var(--color-muted)' }}
                >
                  जल्द
                </span>
              </div>
            </div>

            {/* Category Filter Placeholder */}
            <div className="sm:w-40">
              <label htmlFor="category" className="sr-only">श्रेणी चुनें</label>
              <select
                id="category"
                disabled
                className="w-full px-4 py-2.5 rounded-md font-body text-base appearance-none"
                style={{ 
                  backgroundColor: 'var(--color-paper-light)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-muted)'
                }}
              >
                <option>श्रेणी</option>
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
