import { Link } from 'react-router-dom';

/**
 * StoryCard - Card component for story listings
 * Designed to look like old manuscript pages with cover image area
 * Features warm paper surface, subtle borders, and literary feel
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
      {/* Cover Image / Placeholder - styled like an old photograph */}
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
                background: 'linear-gradient(to bottom, rgba(237, 230, 219, 0.1), rgba(237, 230, 219, 0.2))'
              }}
              aria-hidden="true"
            />
          </>
        ) : (
          <div className="text-center">
            <span 
              className="font-literary text-2xl block mb-2 opacity-30"
              style={{ color: 'var(--color-walnut)' }}
              aria-hidden="true"
            >
              ❧
            </span>
            <span 
              className="font-body text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              [कवर चित्र]
            </span>
          </div>
        )}

        {/* Decorative inner border on image area */}
        <div 
          className="absolute inset-3 border pointer-events-none"
          style={{ borderColor: 'rgba(212, 198, 179, 0.4)' }}
          aria-hidden="true"
        />
      </div>

      {/* Content - solid background to provide clean title area */}
      <div 
        className="p-6 md:p-8 relative"
        style={{ backgroundColor: 'var(--color-paper-light)' }}
      >
        {/* Decorative top flourish */}
        <div 
          className="absolute top-3 right-3 w-5 h-5 opacity-20"
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" fill="none" style={{ color: 'var(--color-gold)' }}>
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="10" cy="10" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* Title - with adequate vertical spacing for Devanagari text */}
        <h3 
          className="font-literary text-xl md:text-2xl font-semibold pt-2 pb-4 break-words"
          style={{ color: 'var(--color-ink)', lineHeight: 1.5 }}
        >
          {title}
        </h3>

        {/* Subtle divider */}
        <div 
          className="w-10 h-px mb-4"
          style={{ backgroundColor: 'var(--color-gold)', opacity: 0.5 }}
          aria-hidden="true"
        />
        
        {/* Excerpt */}
        <p 
          className="font-body text-base leading-relaxed mb-5 line-clamp-3"
          style={{ color: 'var(--color-ink-soft)' }}
        >
          {excerpt}
        </p>
        
        {/* Metadata */}
        <div 
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {readingTime && (
            <span 
              className="font-body text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              {readingTime} मिनट
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
