import { Link } from 'react-router-dom';

/**
 * PoemCard - Card component for poem listings
 * Designed as elegant literary collection cards
 * Features warm paper surface, generous whitespace, literary feel
 * No engagement features (likes/comments) at this stage
 * 
 * Props:
 * - slug: URL-friendly identifier for linking (required for real content)
 * - title: Poem title in Hindi
 * - excerpt: Short preview text
 * - readingTime: Estimated reading time in minutes (reading_time from DB)
 * - category: Category object with name (optional)
 * - isPlaceholder: If true, renders as non-clickable placeholder
 */
export default function PoemCard({ 
  slug,
  title, 
  excerpt, 
  readingTime,
  category,
  isPlaceholder = false,
  className = '' 
}) {
  const cardContent = (
    <article 
      className={`manuscript-card ${className}`}
      style={{ padding: 0 }}
    >
      {/* Optional decorative cover area - subtle paper variation */}
      <div 
        className="h-3"
        style={{ 
          backgroundColor: 'var(--color-paper-deep)',
          borderBottom: '1px solid var(--color-border)'
        }}
        aria-hidden="true"
      />

      {/* Main content area */}
      <div className="px-6 py-6 md:px-8 md:py-8">
        {/* Title - prominent, literary */}
        <h3 
          className="font-literary text-xl md:text-2xl font-semibold mb-4 break-words"
          style={{ 
            color: 'var(--color-ink)', 
            lineHeight: 1.5 
          }}
        >
          {title}
        </h3>
        
        {/* Excerpt - like a glimpse into the poem */}
        <p 
          className="font-literary text-base leading-relaxed mb-6 line-clamp-3"
          style={{ color: 'var(--color-ink-soft)' }}
        >
          {excerpt}
        </p>
        
        {/* Footer metadata - subtle, unobtrusive */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {category?.name && (
              <span 
                className="font-body text-xs px-2 py-0.5 rounded"
                style={{ 
                  backgroundColor: 'var(--color-paper-deep)',
                  color: 'var(--color-ink-soft)'
                }}
              >
                {category.name}
              </span>
            )}
            {readingTime && (
              <span 
                className="font-body text-sm"
                style={{ color: 'var(--color-muted)' }}
              >
                {readingTime} मिनट
              </span>
            )}
          </div>
          
          {/* Read more indicator */}
          {!isPlaceholder && (
            <span 
              className="font-body text-sm transition-colors"
              style={{ color: 'var(--color-maroon)' }}
            >
              पढ़ें →
            </span>
          )}
        </div>

        {/* Placeholder indicator */}
        {isPlaceholder && (
          <p 
            className="mt-4 font-body text-xs italic text-center"
            style={{ color: 'var(--color-muted)' }}
          >
            [यह प्लेसहोल्डर कार्ड है]
          </p>
        )}
      </div>
    </article>
  );

  // If placeholder, don't wrap in link
  if (isPlaceholder || !slug) {
    return cardContent;
  }

  // Wrap in link for real content - using slug for URL
  return (
    <Link 
      to={`/poems/${slug}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
      style={{ '--tw-ring-color': 'var(--color-maroon)' }}
    >
      {cardContent}
    </Link>
  );
}
