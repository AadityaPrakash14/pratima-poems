import { useParams, Link } from 'react-router-dom';
import { OrnamentalDivider } from '../components/common';

/**
 * StoryDetailPage - Individual story reading page
 * Structural preparation for future reading experience
 * No Supabase engagement or manuscript functionality yet
 */
export default function StoryDetailPage() {
  const { id } = useParams();

  return (
    <div className="py-12 md:py-16">
      <div className="container-reading">
        {/* Breadcrumb Navigation */}
        <nav 
          className="mb-8"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-2 font-body text-sm">
            <li>
              <Link 
                to="/"
                style={{ color: 'var(--color-muted)' }}
                className="hover:underline"
              >
                मुखपृष्ठ
              </Link>
            </li>
            <li style={{ color: 'var(--color-muted)' }} aria-hidden="true">›</li>
            <li>
              <Link 
                to="/stories"
                style={{ color: 'var(--color-muted)' }}
                className="hover:underline"
              >
                कहानियाँ
              </Link>
            </li>
            <li style={{ color: 'var(--color-muted)' }} aria-hidden="true">›</li>
            <li style={{ color: 'var(--color-ink-soft)' }}>[कहानी]</li>
          </ol>
        </nav>

        {/* Story Title */}
        <header className="text-center mb-12">
          <h1 
            className="font-literary text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-ink)' }}
          >
            [कहानी का शीर्षक]
          </h1>
          
          {/* Ornamental line */}
          <div 
            className="w-16 h-px mx-auto"
            style={{ backgroundColor: 'var(--color-gold)' }}
            aria-hidden="true"
          />
        </header>

        {/* Cover Image Placeholder */}
        <div 
          className="aspect-[16/9] max-w-2xl mx-auto mb-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-paper-deep)' }}
        >
          <span 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            [कवर चित्र]
          </span>
        </div>

        {/* Story Content Placeholder */}
        <article className="mb-12">
          <div className="prose-story">
            <p 
              className="italic text-center"
              style={{ color: 'var(--color-muted)' }}
            >
              [कहानी का पूर्ण पाठ यहाँ प्रदर्शित होगा।]
            </p>
            <p 
              className="mt-8 italic text-center"
              style={{ color: 'var(--color-muted)' }}
            >
              [यह प्लेसहोल्डर पृष्ठ है।]
            </p>
            <p 
              className="mt-4 text-sm text-center"
              style={{ color: 'var(--color-muted)' }}
            >
              कहानी ID: {id}
            </p>
          </div>
        </article>

        {/* Author Attribution */}
        <div className="text-center mb-12">
          <p 
            className="font-literary text-xl"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            — प्रतिमा
          </p>
        </div>

        <OrnamentalDivider variant="line" />

        {/* Metadata Placeholder */}
        <div 
          className="flex flex-wrap justify-center gap-6 text-sm mb-12"
          style={{ color: 'var(--color-muted)' }}
        >
          <span>[पढ़ने का समय]</span>
          <span>[श्रेणी]</span>
          <span>[वर्ष]</span>
        </div>

        {/* Engagement Section Placeholder */}
        <div 
          className="p-6 rounded-lg border text-center mb-12"
          style={{ 
            backgroundColor: 'var(--color-paper-light)',
            borderColor: 'var(--color-border)'
          }}
        >
          <p 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            [सराहना और प्रतिक्रिया अनुभाग जल्द आ रहा है।]
          </p>
        </div>

        {/* Previous/Next Navigation Placeholder */}
        <nav 
          className="flex justify-between items-center pt-8 border-t"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="कहानी नेविगेशन"
        >
          <span 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            ← पिछली कहानी
          </span>
          <span 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            अगली कहानी →
          </span>
        </nav>
      </div>
    </div>
  );
}
