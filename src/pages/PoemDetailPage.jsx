import { useParams, Link } from 'react-router-dom';
import { OrnamentalDivider } from '../components/common';

/**
 * PoemDetailPage - Individual poem reading page
 * Structural preparation for future reading experience
 * No Supabase engagement or manuscript functionality yet
 */
export default function PoemDetailPage() {
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
                to="/poems"
                style={{ color: 'var(--color-muted)' }}
                className="hover:underline"
              >
                कविताएँ
              </Link>
            </li>
            <li style={{ color: 'var(--color-muted)' }} aria-hidden="true">›</li>
            <li style={{ color: 'var(--color-ink-soft)' }}>[कविता]</li>
          </ol>
        </nav>

        {/* Poem Title */}
        <header className="text-center mb-12">
          <h1 
            className="font-literary text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-ink)' }}
          >
            [कविता का शीर्षक]
          </h1>
          
          {/* Ornamental line */}
          <div 
            className="w-16 h-px mx-auto"
            style={{ backgroundColor: 'var(--color-gold)' }}
            aria-hidden="true"
          />
        </header>

        {/* Poem Content Placeholder */}
        <article className="mb-12">
          <div className="prose-poem text-center">
            <p 
              className="italic"
              style={{ color: 'var(--color-muted)' }}
            >
              [कविता का पूर्ण पाठ यहाँ प्रदर्शित होगा।]
            </p>
            <p 
              className="mt-8 italic"
              style={{ color: 'var(--color-muted)' }}
            >
              [यह प्लेसहोल्डर पृष्ठ है।]
            </p>
            <p 
              className="mt-4 text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              कविता ID: {id}
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
          <span>[तारीख]</span>
          <span>[श्रेणी]</span>
          <span>[पढ़ने का समय]</span>
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
          aria-label="कविता नेविगेशन"
        >
          <span 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            ← पिछली कविता
          </span>
          <span 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            अगली कविता →
          </span>
        </nav>
      </div>
    </div>
  );
}
