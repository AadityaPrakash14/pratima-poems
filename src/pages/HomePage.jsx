import { LiteraryHero, AuthorIntro, LiteraryQuote, PoemCard, StoryCard } from '../components/content';
import { SectionHeader, OrnamentalDivider } from '../components/common';

/**
 * HomePage - Landing page following the approved structure:
 * Hero → Author Introduction → Featured Poems → Featured Stories → Literary Quote → Footer
 */
export default function HomePage() {
  // Placeholder poem data - clearly marked as not real content
  const placeholderPoems = [
    {
      id: null,
      title: '[कविता का शीर्षक]',
      excerpt: '[यहाँ कविता का संक्षिप्त अंश आएगा। यह प्लेसहोल्डर टेक्स्ट है और लेखिका की वास्तविक रचना नहीं है।]',
      readingTime: 2,
      isPlaceholder: true
    },
    {
      id: null,
      title: '[कविता का शीर्षक]',
      excerpt: '[यहाँ कविता का संक्षिप्त अंश आएगा। यह प्लेसहोल्डर टेक्स्ट है और लेखिका की वास्तविक रचना नहीं है।]',
      readingTime: 3,
      isPlaceholder: true
    },
    {
      id: null,
      title: '[कविता का शीर्षक]',
      excerpt: '[यहाँ कविता का संक्षिप्त अंश आएगा। यह प्लेसहोल्डर टेक्स्ट है और लेखिका की वास्तविक रचना नहीं है।]',
      readingTime: 2,
      isPlaceholder: true
    },
  ];

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
  ];

  return (
    <div>
      {/* Hero Section */}
      <LiteraryHero />

      {/* Author Introduction */}
      <AuthorIntro />

      {/* Featured Poems Section */}
      <section className="py-16 md:py-24">
        <div className="container-content">
          <SectionHeader 
            title="कविताएँ"
            subtitle="शब्दों में संजोए हुए अनुभव..."
            actionLabel="सभी कविताएँ"
            actionTo="/poems"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderPoems.map((poem, index) => (
              <PoemCard 
                key={index}
                {...poem}
              />
            ))}
          </div>
        </div>
      </section>

      <OrnamentalDivider variant="ornament" />

      {/* Featured Stories Section */}
      <section className="py-16 md:py-24">
        <div className="container-content">
          <SectionHeader 
            title="कहानियाँ"
            subtitle="कुछ कहानियाँ पढ़ी नहीं जातीं, महसूस की जाती हैं।"
            actionLabel="सभी कहानियाँ"
            actionTo="/stories"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderStories.map((story, index) => (
              <StoryCard 
                key={index}
                {...story}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Literary Quote */}
      <LiteraryQuote 
        quote="[यहाँ एक साहित्यिक उद्धरण आएगा। यह प्लेसहोल्डर टेक्स्ट है।]"
        author="प्रतिमा"
      />
    </div>
  );
}
