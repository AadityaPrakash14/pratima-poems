import { SectionHeader } from '../components/common';
import { StoryCard } from '../components/content';

/**
 * StoriesPage - Listing page for all stories
 * Includes search/filter UI placeholder (visual only, not functional)
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
    <div className="py-12 md:py-16">
      <div className="container-content">
        {/* Page Header */}
        <SectionHeader 
          title="कहानियाँ"
          subtitle="कुछ कहानियाँ पढ़ी नहीं जातीं, महसूस की जाती हैं।"
          centered
        />

        {/* Search/Filter UI - Visual placeholder only */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-12">
          {/* Search Input Placeholder */}
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">कहानियाँ खोजें</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="कहानियाँ खोजें..."
                disabled
                className="w-full px-4 py-3 rounded-lg border font-body text-base"
                style={{ 
                  backgroundColor: 'var(--color-paper-light)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-ink)'
                }}
              />
              <span 
                className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs"
                style={{ color: 'var(--color-muted)' }}
              >
                [जल्द आ रहा है]
              </span>
            </div>
          </div>

          {/* Category Filter Placeholder */}
          <div className="sm:w-48">
            <label htmlFor="category" className="sr-only">श्रेणी चुनें</label>
            <select
              id="category"
              disabled
              className="w-full px-4 py-3 rounded-lg border font-body text-base appearance-none"
              style={{ 
                backgroundColor: 'var(--color-paper-light)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-muted)'
              }}
            >
              <option>श्रेणी</option>
            </select>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {placeholderStories.map((story, index) => (
            <StoryCard 
              key={index}
              {...story}
            />
          ))}
        </div>

        {/* Load More Placeholder */}
        <div className="text-center mt-12">
          <button
            disabled
            className="px-6 py-3 rounded-lg border font-body text-base"
            style={{ 
              backgroundColor: 'transparent',
              borderColor: 'var(--color-border)',
              color: 'var(--color-muted)'
            }}
          >
            और कहानियाँ देखें [जल्द आ रहा है]
          </button>
        </div>
      </div>
    </div>
  );
}
