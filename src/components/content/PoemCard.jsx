import { Link } from 'react-router-dom';

/**
 * PoemCard - Card component for poem listings
 * Designed as elegant literary collection cards
 * Features warm paper surface, generous whitespace, literary feel
 * No engagement features (likes/comments) at this stage
 */
export default function PoemCard({ 
  id,
  title, 
  excerpt, 
  readingTime,
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
        <div className="flex items-center justify-between">
          {readingTime && (
            <span 
              className="font-body text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              {readingTime} मिनट पढ़ने का समय
            </span>
          )}
          
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
  if (isPlaceholder || !id) {
    return cardContent;
  }

  // Wrap in link for real content
  return (
    <Link 
      to={`/poems/${id}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
      style={{ '--tw-ring-color': 'var(--color-maroon)' }}
    >
      {cardContent}
    </Link>
  );
}
