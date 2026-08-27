import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ManuscriptPage, 
  LiteraryHeader, 
  PoemBody, 
  EndingMark,
  ReadingNavigation 
} from '../components/reading';
import { PublicLoadingState, PublicErrorState } from '../components/common';
import { getPublishedPoemBySlug } from '../services/poemService';
import { isSupabaseConfigured } from '../lib/supabase';
import { ServiceErrorCode } from '../services/serviceErrors';

/**
 * PoemDetailPage - Individual poem reading page
 * Designed to feel like reading from an old literary manuscript
 * "मैं उनकी पुरानी डायरी का एक पन्ना पढ़ रहा हूँ।"
 * 
 * Features:
 * - Warm manuscript paper surface
 * - Large, comfortable Devanagari typography
 * - Poetry-specific formatting (line breaks, stanzas)
 * - Subtle literary decorations
 * - Distraction-free reading
 * 
 * Now connected to Supabase for poem content by slug.
 */
export default function PoemDetailPage() {
  const { id: slug } = useParams(); // Route param is :id but we use it as slug
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Supabase is configured
  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    const loadPoem = async () => {
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
        const data = await getPublishedPoemBySlug(slug);
        if (mounted) {
          setPoem(data);
        }
      } catch (err) {
        console.error('Error loading poem:', err);
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPoem();

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
            to="/poems" 
            className="reading-back-link"
          >
            ← सभी कविताएँ
          </Link>
          <PublicLoadingState message="कविता लोड हो रही है..." />
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
            to="/poems" 
            className="reading-back-link"
          >
            ← सभी कविताएँ
          </Link>
          <PublicErrorState
            title={isNotFound ? 'कविता नहीं मिली' : isNotConfigured ? 'सिस्टम कॉन्फ़िगर नहीं है' : 'कविता लोड नहीं हो सकी'}
            message={isNotFound ? 'शायद यह रचना किसी और पन्ने पर है।' : isNotConfigured ? 'कृपया बाद में पुनः प्रयास करें।' : 'कृपया पुनः प्रयास करें।'}
            onRetry={!isNotFound && !isNotConfigured ? handleRetry : undefined}
            showHomeLink={true}
          />
        </div>
      </div>
    );
  }

  // Render poem content
  if (!poem) {
    return (
      <div className="reading-page">
        <div className="container-content">
          <Link 
            to="/poems" 
            className="reading-back-link"
          >
            ← सभी कविताएँ
          </Link>
          <PublicErrorState
            title="कविता नहीं मिली"
            message="शायद यह रचना किसी और पन्ने पर है।"
            showHomeLink={true}
          />
        </div>
      </div>
    );
  }

  const formattedDate = formatDate(poem.written_date);

  return (
    <div className="reading-page">
      <div className="container-content">
        {/* Back navigation */}
        <Link 
          to="/poems" 
          className="reading-back-link"
        >
          ← सभी कविताएँ
        </Link>

        {/* Manuscript Paper Surface */}
        <ManuscriptPage>
          {/* Literary Header */}
          <LiteraryHeader 
            type="कविता"
            title={poem.title}
            subtitle={poem.subtitle}
            author="प्रतिमा"
          />

          {/* Metadata - Category, Date, Reading Time */}
          {(poem.category?.name || formattedDate || poem.reading_time) && (
            <div 
              className="flex flex-wrap items-center justify-center gap-4 mb-8 -mt-4"
              style={{ color: 'var(--color-muted)' }}
            >
              {poem.category?.name && (
                <span className="font-body text-sm">
                  {poem.category.name}
                </span>
              )}
              {poem.category?.name && (formattedDate || poem.reading_time) && (
                <span aria-hidden="true">•</span>
              )}
              {formattedDate && (
                <span className="font-body text-sm">
                  {formattedDate}
                </span>
              )}
              {formattedDate && poem.reading_time && (
                <span aria-hidden="true">•</span>
              )}
              {poem.reading_time && (
                <span className="font-body text-sm">
                  {poem.reading_time} मिनट पढ़ने का समय
                </span>
              )}
            </div>
          )}

          {/* Poem Content */}
          <PoemBody 
            content={poem.content}
            isPlaceholder={false}
          />

          {/* Ending Mark */}
          <EndingMark />

          {/* Manuscript Link (if available) */}
          {poem.manuscript_url && (
            <div className="text-center mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <a
                href={poem.manuscript_url}
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
        <ReadingNavigation type="poem" />
      </div>
    </div>
  );
}
