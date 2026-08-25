import { Link } from 'react-router-dom';

/**
 * StoryCard - Card component for story listings
 * Designed as elegant literary collection cards with cover image area
 * Features warm paper surface, generous whitespace, literary feel
 * No engagement features (likes/comments) at this stage
 */
export default function StoryCard({ 
  id,
  title, 
  excerpt, 
  readingTime,
  coverImage,
  isPlaceholder = false,
  className = '' 
}) {
  const cardContent = (
    <article 
      className={`manuscript-card overflow-hidden ${className}`}
    >
      {/* Cover Image Area */}
      <div 
        className="aspect-[16/10] flex items-center justify-center relative"
        style={{ backgroundColor: 'var(--color-paper-deep)' }}
      >
        {coverImage ? (
          <>
            <img 
              src={coverImage} 
              alt={`${title} का कवर चित्र`}
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay for aged look */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(237, 230, 219, 0.05), rgba(237, 230, 219, 0.15))'
              }}
              aria-hidden="true"
            />
          </>
        ) : (
          <div className="text-center py-8">
            <span 
              className="font-literary text-3xl block mb-2"
              style={{ color: 'var(--color-walnut)', opacity: 0.2 }}
              aria-hidden="true"
            >
              ❧
            </span>
            <span 
              className="font-body text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              कवर चित्र
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div 
        className="px-6 py-6 md:px-8 md:py-8"
        style={{ backgroundColor: 'var(--color-paper-light)' }}
      >
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
        
        {/* Excerpt */}
        <p 
          className="font-body text-base leading-relaxed mb-6 line-clamp-3"
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
      to={`/stories/${id}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
      style={{ '--tw-ring-color': 'var(--color-maroon)' }}
    >
      {cardContent}
    </Link>
  );
}
