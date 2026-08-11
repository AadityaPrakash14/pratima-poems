import { Link } from 'react-router-dom';

/**
 * PoemCard - Card component for poem listings
 * Designed to look like old manuscript pages from a diary
 * Features warm paper surface, subtle borders, and literary feel
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
      className={`manuscript-card p-6 md:p-8 ${className}`}
    >
      {/* Decorative top corner flourish */}
      <div 
        className="absolute top-3 right-3 w-6 h-6 opacity-20"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-gold)' }}>
          <path 
            d="M24 0 L24 8 C24 12, 20 16, 16 16 L8 16 C4 16, 0 12, 0 8"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* Title - with adequate vertical spacing for Devanagari text */}
      <h3 
        className="font-literary text-xl md:text-2xl font-semibold pt-2 pb-4 break-words relative"
        style={{ color: 'var(--color-ink)', lineHeight: 1.5 }}
      >
        {title}
      </h3>

      {/* Subtle divider under title */}
      <div 
        className="w-8 h-px mb-4"
        style={{ backgroundColor: 'var(--color-gold)', opacity: 0.5 }}
        aria-hidden="true"
      />
      
      {/* Excerpt - styled like handwritten diary entry */}
      <p 
        className="font-literary text-base leading-relaxed mb-5 line-clamp-4"
        style={{ color: 'var(--color-ink-soft)' }}
      >
        {excerpt}
      </p>
      
      {/* Metadata - positioned at bottom like margin notes */}
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

      {/* Decorative bottom corner */}
      <div 
        className="absolute bottom-3 left-3 w-6 h-6 opacity-20 rotate-180"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-gold)' }}>
          <path 
            d="M24 0 L24 8 C24 12, 20 16, 16 16 L8 16 C4 16, 0 12, 0 8"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
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
