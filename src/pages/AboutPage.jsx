import { SectionHeader, OrnamentalDivider } from '../components/common';

/**
 * AboutPage - Author biography and writing journey
 * Contains structural placeholders for content to be added later
 * No invented biographical facts about Pratima
 */
export default function AboutPage() {
  return (
    <div className="py-12 md:py-16">
      {/* Page Header */}
      <div className="container-content">
        <SectionHeader 
          title="लेखिका"
          centered
        />
      </div>

      {/* Author Profile Section */}
      <section className="py-8 md:py-12">
        <div className="container-reading">
          <div className="flex flex-col items-center text-center">
            {/* Portrait Placeholder */}
            <div 
              className="w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center border-2 mb-8"
              style={{ 
                backgroundColor: 'var(--color-paper-light)',
                borderColor: 'var(--color-border)'
              }}
            >
              <span 
                className="font-body text-sm"
                style={{ color: 'var(--color-muted)' }}
              >
                [चित्र]
              </span>
            </div>

            {/* Name */}
            <h2 
              className="font-literary text-4xl md:text-5xl font-bold mb-6"
              style={{ color: 'var(--color-ink)' }}
            >
              प्रतिमा
            </h2>

            {/* Biography Placeholder */}
            <div 
              className="prose-story max-w-2xl"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              <p className="italic" style={{ color: 'var(--color-muted)' }}>
                [लेखिका का विस्तृत परिचय यहाँ आएगा।]
              </p>
              <p className="italic mt-4" style={{ color: 'var(--color-muted)' }}>
                [यह प्लेसहोल्डर टेक्स्ट है। वास्तविक जीवनी और लेखन यात्रा का विवरण यहाँ जोड़ा जाएगा।]
              </p>
            </div>
          </div>
        </div>
      </section>

      <OrnamentalDivider variant="ornament" />

      {/* Writing Journey Section */}
      <section className="py-8 md:py-12">
        <div className="container-reading">
          <h3 
            className="font-literary text-2xl md:text-3xl font-semibold text-center mb-8"
            style={{ color: 'var(--color-ink)' }}
          >
            मेरी लेखन यात्रा
          </h3>

          {/* Journey Timeline Placeholder */}
          <div 
            className="p-8 rounded-lg border text-center"
            style={{ 
              backgroundColor: 'var(--color-paper-light)',
              borderColor: 'var(--color-border)'
            }}
          >
            <p 
              className="font-body text-base italic"
              style={{ color: 'var(--color-muted)' }}
            >
              [लेखन यात्रा की समयरेखा यहाँ आएगी।]
            </p>
            <p 
              className="font-body text-sm mt-4"
              style={{ color: 'var(--color-muted)' }}
            >
              [यह अनुभाग लेखिका की लेखन शुरुआत, प्रेरणा, और साहित्यिक यात्रा का विवरण प्रस्तुत करेगा।]
            </p>
          </div>
        </div>
      </section>

      <OrnamentalDivider variant="dots" />

      {/* Inspiration Section */}
      <section className="py-8 md:py-12">
        <div className="container-reading">
          <h3 
            className="font-literary text-2xl md:text-3xl font-semibold text-center mb-8"
            style={{ color: 'var(--color-ink)' }}
          >
            प्रेरणा
          </h3>

          {/* Inspiration Content Placeholder */}
          <div 
            className="p-8 rounded-lg border text-center"
            style={{ 
              backgroundColor: 'var(--color-paper-light)',
              borderColor: 'var(--color-border)'
            }}
          >
            <p 
              className="font-body text-base italic"
              style={{ color: 'var(--color-muted)' }}
            >
              [लेखिका की प्रेरणा के स्रोतों का विवरण यहाँ आएगा।]
            </p>
          </div>
        </div>
      </section>

      {/* Note about manuscript feature */}
      <section className="py-8 md:py-12">
        <div className="container-reading">
          <div 
            className="p-6 rounded-lg border text-center"
            style={{ 
              backgroundColor: 'var(--color-paper-deep)',
              borderColor: 'var(--color-border)'
            }}
          >
            <p 
              className="font-body text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              [मूल हस्तलिखित पृष्ठों का संग्रह जल्द ही उपलब्ध होगा।]
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
