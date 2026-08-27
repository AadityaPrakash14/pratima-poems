import { useState, useEffect } from 'react';
import { LiteraryHero, AuthorIntro, LiteraryQuote, PoemCard, StoryCard } from '../components/content';
import { SectionHeader, OrnamentalDivider, PublicLoadingState, PublicErrorState, PublicEmptyState } from '../components/common';
import { getFeaturedPoems } from '../services/poemService';
import { getFeaturedStories } from '../services/storyService';
import { isSupabaseConfigured } from '../lib/supabase';
import { ServiceErrorCode } from '../services/serviceErrors';

/**
 * HomePage - Landing page following the approved structure:
 * Hero → Author Introduction → Featured Poems → Featured Stories → Literary Quote → Footer
 * 
 * Now connected to Supabase for featured content with proper loading, empty, and error states.
 */
export default function HomePage() {
  const [poems, setPoems] = useState([]);
  const [stories, setStories] = useState([]);
  const [poemsLoading, setPoemsLoading] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [poemsError, setPoemsError] = useState(null);
  const [storiesError, setStoriesError] = useState(null);
  const [retryPoemsCount, setRetryPoemsCount] = useState(0);
  const [retryStoriesCount, setRetryStoriesCount] = useState(0);

  // Check if Supabase is configured
  const supabaseReady = isSupabaseConfigured();

  // Load featured poems
  useEffect(() => {
    let mounted = true;

    const loadFeaturedPoems = async () => {
      if (!supabaseReady) {
        setPoemsLoading(false);
        return;
      }

      try {
        setPoemsLoading(true);
        setPoemsError(null);
        const data = await getFeaturedPoems(3);
        if (mounted) {
          setPoems(data || []);
        }
      } catch (err) {
        console.error('Error loading featured poems:', err);
        if (mounted) {
          setPoemsError(err);
        }
      } finally {
        if (mounted) {
          setPoemsLoading(false);
        }
      }
    };

    loadFeaturedPoems();

    return () => {
      mounted = false;
    };
  }, [supabaseReady, retryPoemsCount]);

  // Load featured stories
  useEffect(() => {
    let mounted = true;

    const loadFeaturedStories = async () => {
      if (!supabaseReady) {
        setStoriesLoading(false);
        return;
      }

      try {
        setStoriesLoading(true);
        setStoriesError(null);
        const data = await getFeaturedStories(3);
        if (mounted) {
          setStories(data || []);
        }
      } catch (err) {
        console.error('Error loading featured stories:', err);
        if (mounted) {
          setStoriesError(err);
        }
      } finally {
        if (mounted) {
          setStoriesLoading(false);
        }
      }
    };

    loadFeaturedStories();

    return () => {
      mounted = false;
    };
  }, [supabaseReady, retryStoriesCount]);

  // Retry handlers
  const handleRetryPoems = () => setRetryPoemsCount(c => c + 1);
  const handleRetryStories = () => setRetryStoriesCount(c => c + 1);

  // Render poems section content based on state
  const renderPoemsContent = () => {
    if (!supabaseReady) {
      return (
        <PublicEmptyState 
          title="कविताएँ जल्द आ रही हैं"
          message="अभी सिस्टम कॉन्फ़िगर हो रहा है।"
          showHomeLink={false}
        />
      );
    }

    if (poemsLoading) {
      return <PublicLoadingState message="कविताएँ लोड हो रही हैं..." />;
    }

    if (poemsError) {
      const isNotConfigured = poemsError.code === ServiceErrorCode.NOT_CONFIGURED;
      return (
        <PublicErrorState
          title={isNotConfigured ? 'सिस्टम कॉन्फ़िगर नहीं है' : 'कविताएँ लोड नहीं हो सकीं'}
          message={isNotConfigured ? 'कृपया बाद में पुनः प्रयास करें।' : 'कृपया पुनः प्रयास करें।'}
          onRetry={!isNotConfigured ? handleRetryPoems : undefined}
          showHomeLink={false}
        />
      );
    }

    if (poems.length === 0) {
      return (
        <PublicEmptyState 
          title="अभी कोई कविता नहीं है"
          message="नई कविताएँ जल्द ही यहाँ प्रकाशित होंगी।"
          showHomeLink={false}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    );
  };

  // Render stories section content based on state
  const renderStoriesContent = () => {
    if (!supabaseReady) {
      return (
        <PublicEmptyState 
          title="कहानियाँ जल्द आ रही हैं"
          message="अभी सिस्टम कॉन्फ़िगर हो रहा है।"
          showHomeLink={false}
        />
      );
    }

    if (storiesLoading) {
      return <PublicLoadingState message="कहानियाँ लोड हो रही हैं..." />;
    }

    if (storiesError) {
      const isNotConfigured = storiesError.code === ServiceErrorCode.NOT_CONFIGURED;
      return (
        <PublicErrorState
          title={isNotConfigured ? 'सिस्टम कॉन्फ़िगर नहीं है' : 'कहानियाँ लोड नहीं हो सकीं'}
          message={isNotConfigured ? 'कृपया बाद में पुनः प्रयास करें।' : 'कृपया पुनः प्रयास करें।'}
          onRetry={!isNotConfigured ? handleRetryStories : undefined}
          showHomeLink={false}
        />
      );
    }

    if (stories.length === 0) {
      return (
        <PublicEmptyState 
          title="अभी कोई कहानी नहीं है"
          message="नई कहानियाँ जल्द ही यहाँ प्रकाशित होंगी।"
          showHomeLink={false}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
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
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <LiteraryHero />

      {/* Author Introduction */}
      <AuthorIntro />

      {/* Featured Poems Section */}
      <section className="py-16 md:py-24">
        <div className="container-content">
          <SectionHeader 
            title="कविताएँ"
            subtitle="शब्दों में संजोए हुए अनुभव..."
            actionLabel="सभी कविताएँ"
            actionTo="/poems"
            centered
          />
          
          {renderPoemsContent()}
        </div>
      </section>

      <OrnamentalDivider variant="ornament" />

      {/* Featured Stories Section */}
      <section className="py-16 md:py-24">
        <div className="container-content">
          <SectionHeader 
            title="कहानियाँ"
            subtitle="कुछ कहानियाँ पढ़ी नहीं जातीं, महसूस की जाती हैं।"
            actionLabel="सभी कहानियाँ"
            actionTo="/stories"
            centered
          />
          
          {renderStoriesContent()}
        </div>
      </section>

      {/* Literary Quote */}
      <LiteraryQuote 
        quote="[यहाँ एक साहित्यिक उद्धरण आएगा। यह प्लेसहोल्डर टेक्स्ट है।]"
        author="प्रतिमा"
      />
    </div>
  );
}
