/**
 * LiteraryQuote - Quote display component
 * Displays a literary quote with author attribution
 */
export default function LiteraryQuote({ 
  quote, 
  author = 'प्रतिमा',
  className = '' 
}) {
  return (
    <section 
      className={`py-16 md:py-24 ${className}`}
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="container-reading text-center">
        {/* Quote mark decoration */}
        <div 
          className="font-literary text-6xl md:text-7xl leading-none mb-4"
          style={{ color: 'var(--color-gold)' }}
          aria-hidden="true"
        >
          "
        </div>
        
        {/* Quote text */}
        <blockquote>
          <p 
            className="font-literary text-xl md:text-2xl lg:text-3xl italic leading-relaxed mb-6"
            style={{ color: 'var(--color-ink)' }}
          >
            {quote}
          </p>
          
          {/* Attribution */}
          <footer>
            <cite 
              className="font-literary text-base md:text-lg not-italic"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              — {author}
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
