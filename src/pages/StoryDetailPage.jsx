import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ManuscriptPage, 
  LiteraryHeader, 
  StoryBody, 
  EndingMark,
  ReadingNavigation 
} from '../components/reading';
import { PublicLoadingState, PublicErrorState } from '../components/common';
import { getPublishedStoryBySlug } from '../services/storyService';
import { isSupabaseConfigured } from '../lib/supabase';
import { ServiceErrorCode } from '../services/serviceErrors';

/**
 * StoryDetailPage - Individual story reading page
 * Designed to feel like reading from an old literary manuscript
 * "मैं उनकी पुरानी डायरी का एक पन्ना पढ़ रहा हूँ।"
 * 
 * Features:
 * - Warm manuscript paper surface
 * - Comfortable prose formatting
 * - Generous paragraph spacing
 * - Distraction-free reading
 * 
 * Now connected to Supabase for story content by slug.
 */
export default function StoryDetailPage() {
  const { id: slug } = useParams(); // Route param is :id but we use it as slug
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Supabase is configured
  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    const loadStory = async () => {
      if (!supabaseReady) {
        setLoading(false);
        setError({ code: ServiceErrorCode.NOT_CONFIGURED });
        return;
      }

      if (!slug) {
        setLoading(false);
        setError({ code: ServiceErrorCode.NOT_FOUND });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getPublishedStoryBySlug(slug);
        if (mounted) {
          setStory(data);
        }
      } catch (err) {
        console.error('Error loading story:', err);
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStory();

    return () => {
      mounted = false;
    };
  }, [supabaseReady, slug, retryCount]);

  // Retry handler
  const handleRetry = () => setRetryCount(c => c + 1);

  // Format written date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="reading-page">
        <div className="container-content">
          <Link 
            to="/stories" 
            className="reading-back-link"
          >
            ← सभी कहानियाँ
          </Link>
          <PublicLoadingState message="कहानी लोड हो रही है..." />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    const isNotFound = error.code === ServiceErrorCode.NOT_FOUND;
    const isNotConfigured = error.code === ServiceErrorCode.NOT_CONFIGURED;

    return (
      <div className="reading-page">
        <div className="container-content">
          <Link 
            to="/stories" 
            className="reading-back-link"
          >
            ← सभी कहानियाँ
          </Link>
          <PublicErrorState
            title={isNotFound ? 'कहानी नहीं मिली' : isNotConfigured ? 'सिस्टम कॉन्फ़िगर नहीं है' : 'कहानी लोड नहीं हो सकी'}
            message={isNotFound ? 'शायद यह रचना किसी और पन्ने पर है।' : isNotConfigured ? 'कृपया बाद में पुनः प्रयास करें।' : 'कृपया पुनः प्रयास करें।'}
            onRetry={!isNotFound && !isNotConfigured ? handleRetry : undefined}
            showHomeLink={true}
          />
        </div>
      </div>
    );
  }

  // Render no story found
  if (!story) {
    return (
      <div className="reading-page">
        <div className="container-content">
          <Link 
            to="/stories" 
            className="reading-back-link"
          >
            ← सभी कहानियाँ
          </Link>
          <PublicErrorState
            title="कहानी नहीं मिली"
            message="शायद यह रचना किसी और पन्ने पर है।"
            showHomeLink={true}
          />
        </div>
      </div>
    );
  }

  const formattedDate = formatDate(story.written_date);

  return (
    <div className="reading-page">
      <div className="container-content">
        {/* Back navigation */}
        <Link 
          to="/stories" 
          className="reading-back-link"
        >
          ← सभी कहानियाँ
        </Link>

        {/* Cover Image (if available) */}
        {story.cover_url && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div 
              className="aspect-[16/9] rounded-lg overflow-hidden"
              style={{ 
                border: '1px solid var(--color-border-warm)',
                boxShadow: '0 4px 20px rgba(48, 42, 36, 0.08)'
              }}
            >
              <img 
                src={story.cover_url} 
                alt={`${story.title} का कवर चित्र`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Manuscript Paper Surface */}
        <ManuscriptPage>
          {/* Literary Header */}
          <LiteraryHeader 
            type="कहानी"
            title={story.title}
            subtitle={story.subtitle}
            author="प्रतिमा"
          />

          {/* Metadata - Category, Date, Reading Time */}
          {(story.category?.name || formattedDate || story.reading_time) && (
            <div 
              className="flex flex-wrap items-center justify-center gap-4 mb-8 -mt-4"
              style={{ color: 'var(--color-muted)' }}
            >
              {story.category?.name && (
                <span className="font-body text-sm">
                  {story.category.name}
                </span>
              )}
              {story.category?.name && (formattedDate || story.reading_time) && (
                <span aria-hidden="true">•</span>
              )}
              {formattedDate && (
                <span className="font-body text-sm">
                  {formattedDate}
                </span>
              )}
              {formattedDate && story.reading_time && (
                <span aria-hidden="true">•</span>
              )}
              {story.reading_time && (
                <span className="font-body text-sm">
                  {story.reading_time} मिनट पढ़ने का समय
                </span>
              )}
            </div>
          )}

          {/* Story Content */}
          <StoryBody 
            content={story.content}
            isPlaceholder={false}
          />

          {/* Ending Mark */}
          <EndingMark />

          {/* Manuscript Link (if available) */}
          {story.manuscript_url && (
            <div className="text-center mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <a
                href={story.manuscript_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-sm transition-colors"
                style={{ color: 'var(--color-maroon)' }}
              >
                <span>मूल हस्तलिखित पृष्ठ देखें</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          )}
        </ManuscriptPage>

        {/* Navigation back to collection */}
        <ReadingNavigation type="story" />
      </div>
    </div>
  );
}
