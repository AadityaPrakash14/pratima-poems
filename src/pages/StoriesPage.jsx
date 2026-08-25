import { StoryCard } from '../components/content';

/**
 * StoriesPage - Listing page for all stories
 * Editorial composition with the collection as focus
 * Search/filter UI is understated
 */
export default function StoriesPage() {
  // Placeholder story data - clearly marked as not real content
  const placeholderStories = [
    {
      id: null,
      title: '[कहानी का शीर्षक]',
      excerpt: '[यहाँ कहानी का संक्षिप्त अंश आएगा। यह प्लेसहोल्डर टेक्स्ट है और लेखिका की वास्तविक रचना नहीं है।]',
      readingTime: 10,
      isPlaceholder: true
    },
    {
      id: null,
      title: '[कहानी का शीर्षक]',
      excerpt: '[यहाँ कहानी का संक्षिप्त अंश आएगा। यह प्लेसहोल्डर टेक्स्ट है और लेखिका की वास्तविक रचना नहीं है।]',
      readingTime: 15,
      isPlaceholder: true
    },
    {
      id: null,
      title: '[कहानी का शीर्षक]',
      excerpt: '[यहाँ कहानी का संक्षिप्त अंश आएगा। यह प्लेसहोल्डर टेक्स्ट है और लेखिका की वास्तविक रचना नहीं है।]',
      readingTime: 12,
      isPlaceholder: true
    },
    {
      id: null,
      title: '[कहानी का शीर्षक]',
      excerpt: '[यहाँ कहानी का संक्षिप्त अंश आएगा। यह प्लेसहोल्डर टेक्स्ट है और लेखिका की वास्तविक रचना नहीं है।]',
      readingTime: 8,
      isPlaceholder: true
    },
  ];

  return (
    <div className="py-16 md:py-24">
      <div className="container-content">
        {/* Page Header - Editorial style */}
        <header className="text-center mb-16 md:mb-20">
          <h1 
            className="font-literary text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-ink)' }}
          >
            कहानियाँ
          </h1>
          <p 
            className="font-literary text-lg md:text-xl italic devanagari-safe"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            कुछ कहानियाँ पढ़ी नहीं जातीं, महसूस की जाती हैं।
          </p>
          
          {/* Subtle decorative divider */}
          <div 
            className="flex items-center justify-center gap-3 mt-8"
            aria-hidden="true"
          >
            <span 
              className="w-12 h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--color-gold))' }}
            />
            <span 
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: 'var(--color-gold)', opacity: 0.6 }}
            />
            <span 
              className="w-12 h-px"
              style={{ background: 'linear-gradient(to left, transparent, var(--color-gold))' }}
            />
          </div>
        </header>

        {/* Search/Filter UI - Understated, not dominant */}
        <div className="max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input Placeholder */}
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">कहानियाँ खोजें</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="कहानियाँ खोजें..."
                  disabled
                  className="w-full px-4 py-2.5 rounded-md font-body text-base"
                  style={{ 
                    backgroundColor: 'var(--color-paper-light)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-ink)'
                  }}
                />
                <span 
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs"
                  style={{ color: 'var(--color-muted)' }}
                >
                  जल्द
                </span>
              </div>
            </div>

            {/* Category Filter Placeholder */}
            <div className="sm:w-40">
              <label htmlFor="category" className="sr-only">श्रेणी चुनें</label>
              <select
                id="category"
                disabled
                className="w-full px-4 py-2.5 rounded-md font-body text-base appearance-none"
                style={{ 
                  backgroundColor: 'var(--color-paper-light)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-muted)'
                }}
              >
                <option>श्रेणी</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stories Grid - Collection with breathing room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {placeholderStories.map((story, index) => (
            <StoryCard 
              key={index}
              {...story}
            />
          ))}
        </div>

        {/* Load More Placeholder */}
        <div className="text-center mt-16 md:mt-20">
          <button
            disabled
            className="px-8 py-3 rounded-md font-body text-base transition-colors"
            style={{ 
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted)'
            }}
          >
            और कहानियाँ देखें
          </button>
        </div>
      </div>
    </div>
  );
}
