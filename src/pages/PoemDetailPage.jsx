import { useParams, Link } from 'react-router-dom';
import { OrnamentalDivider } from '../components/common';

/**
 * PoemDetailPage - Individual poem reading page
 * Designed to feel like reading from an old diary or manuscript
 * Features warm parchment background, narrow reading column, 
 * large Devanagari text, and ornamental decorations
 */
export default function PoemDetailPage() {
  const { id } = useParams();

  return (
    <div 
      className="py-8 md:py-12 min-h-screen"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="container-content">
        {/* Breadcrumb Navigation */}
        <nav 
          className="mb-8 max-w-3xl mx-auto"
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

        {/* Manuscript Page Container */}
        <div className="manuscript-page max-w-3xl mx-auto px-6 py-10 md:px-12 md:py-14">
          
          {/* Decorative top element */}
          <div className="flex justify-center mb-8" aria-hidden="true">
            <PageFlourish />
          </div>

          {/* Poem Title */}
          <header className="text-center mb-10">
            <h1 
              className="font-literary text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: 'var(--color-ink)' }}
            >
              [कविता का शीर्षक]
            </h1>
            
            {/* Ornamental line with diamond */}
            <div className="flex items-center justify-center gap-2" aria-hidden="true">
              <span 
                className="w-12 h-px"
                style={{ background: 'linear-gradient(to right, transparent, var(--color-gold))' }}
              />
              <span 
                className="w-2 h-2 rotate-45"
                style={{ backgroundColor: 'var(--color-gold)' }}
              />
              <span 
                className="w-12 h-px"
                style={{ background: 'linear-gradient(to left, transparent, var(--color-gold))' }}
              />
            </div>
          </header>

          {/* Poem Content Area */}
          <article className="mb-12">
            <div className="prose-poem text-center max-w-xl mx-auto">
              <p 
                className="italic leading-loose"
                style={{ color: 'var(--color-muted)' }}
              >
                [कविता का पूर्ण पाठ यहाँ प्रदर्शित होगा।]
              </p>
              <p 
                className="mt-10 italic"
                style={{ color: 'var(--color-muted)', fontSize: '1rem' }}
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
          <div className="text-center mb-10">
            <p 
              className="font-literary text-xl italic"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              — प्रतिमा
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-8">
            <OrnamentalDivider variant="line" />
          </div>

          {/* Metadata - styled like margin notes */}
          <div 
            className="flex flex-wrap justify-center gap-6 text-sm mb-10 py-4 border-y"
            style={{ 
              color: 'var(--color-muted)',
              borderColor: 'var(--color-border)'
            }}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon />
              [तारीख]
            </span>
            <span className="flex items-center gap-2">
              <TagIcon />
              [श्रेणी]
            </span>
            <span className="flex items-center gap-2">
              <ClockIcon />
              [पढ़ने का समय]
            </span>
          </div>

          {/* Engagement Section Placeholder */}
          <div 
            className="p-6 rounded-lg text-center mb-10"
            style={{ 
              backgroundColor: 'var(--color-paper)',
              border: '1px dashed var(--color-border)'
            }}
          >
            <p 
              className="font-body text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              [सराहना और प्रतिक्रिया अनुभाग जल्द आ रहा है।]
            </p>
          </div>

          {/* Decorative bottom element */}
          <div className="flex justify-center" aria-hidden="true">
            <PageFlourish inverted />
          </div>
        </div>

        {/* Previous/Next Navigation - outside manuscript page */}
        <nav 
          className="flex justify-between items-center pt-8 max-w-3xl mx-auto"
          aria-label="कविता नेविगेशन"
        >
          <button 
            className="font-body text-sm transition-colors hover:underline flex items-center gap-2"
            style={{ color: 'var(--color-maroon)' }}
            disabled
          >
            ← पिछली कविता
          </button>
          <Link
            to="/poems"
            className="font-body text-sm transition-colors hover:underline"
            style={{ color: 'var(--color-muted)' }}
          >
            सभी कविताएँ
          </Link>
          <button 
            className="font-body text-sm transition-colors hover:underline flex items-center gap-2"
            style={{ color: 'var(--color-maroon)' }}
            disabled
          >
            अगली कविता →
          </button>
        </nav>
      </div>
    </div>
  );
}

/* Decorative Components */

function PageFlourish({ inverted = false }) {
  return (
    <svg 
      width="80" 
      height="16" 
      viewBox="0 0 80 16" 
      fill="none"
      style={{ 
        color: 'var(--color-gold)',
        transform: inverted ? 'rotate(180deg)' : 'none',
        opacity: 0.5
      }}
    >
      <path 
        d="M40 2 C30 2, 25 8, 10 8 C5 8, 2 6, 0 8 M40 2 C50 2, 55 8, 70 8 C75 8, 78 6, 80 8"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="40" cy="8" r="2" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
