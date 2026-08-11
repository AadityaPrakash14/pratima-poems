import { Link } from 'react-router-dom';

/**
 * PoemCard - Card component for poem listings
 * Displays title, excerpt, and reading time
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
      className={`
        p-6 rounded-lg border transition-all duration-200
        ${!isPlaceholder ? 'hover:shadow-md' : ''}
        ${className}
      `}
      style={{ 
        backgroundColor: 'var(--color-paper-light)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Title */}
      <h3 
        className="font-literary text-xl md:text-2xl font-semibold mb-3 line-clamp-2"
        style={{ color: 'var(--color-ink)' }}
      >
        {title}
      </h3>
      
      {/* Excerpt */}
      <p 
        className="font-body text-base leading-relaxed mb-4 line-clamp-3"
        style={{ color: 'var(--color-ink-soft)' }}
      >
        {excerpt}
      </p>
      
      {/* Metadata */}
      <div className="flex items-center gap-4">
        {readingTime && (
          <span 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            {readingTime} मिनट पढ़ने का समय
          </span>
        )}
      </div>

      {/* Placeholder indicator */}
      {isPlaceholder && (
        <p 
          className="mt-4 font-body text-xs italic"
          style={{ color: 'var(--color-muted)' }}
        >
          [यह प्लेसहोल्डर कार्ड है]
        </p>
      )}
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
