import { useParams, Link } from 'react-router-dom';
import { OrnamentalDivider } from '../components/common';

/**
 * StoryDetailPage - Individual story reading page
 * Designed to feel like reading from an old diary or manuscript
 * Features warm parchment background, comfortable reading width,
 * and ornamental decorations
 */
export default function StoryDetailPage() {
  const { id } = useParams();

  return (
    <div 
      className="py-8 md:py-12 min-h-screen"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="container-content">
        {/* Breadcrumb Navigation */}
        <nav 
          className="mb-8 max-w-4xl mx-auto"
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

        {/* Manuscript Page Container */}
        <div className="manuscript-page max-w-4xl mx-auto px-6 py-10 md:px-12 md:py-14">
          
          {/* Decorative top element */}
          <div className="flex justify-center mb-8" aria-hidden="true">
            <PageFlourish />
          </div>

          {/* Story Title */}
          <header className="text-center mb-10">
            <h1 
              className="font-literary text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: 'var(--color-ink)' }}
            >
              [कहानी का शीर्षक]
            </h1>
            
            {/* Ornamental line with diamond */}
            <div className="flex items-center justify-center gap-2" aria-hidden="true">
              <span 
                className="w-16 h-px"
                style={{ background: 'linear-gradient(to right, transparent, var(--color-gold))' }}
              />
              <span 
                className="w-2 h-2 rotate-45"
                style={{ backgroundColor: 'var(--color-gold)' }}
              />
              <span 
                className="w-16 h-px"
                style={{ background: 'linear-gradient(to left, transparent, var(--color-gold))' }}
              />
            </div>
          </header>

          {/* Cover Image Placeholder - styled like vintage photograph */}
          <div className="max-w-2xl mx-auto mb-12">
            <div 
              className="aspect-[16/9] rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{ 
                backgroundColor: 'var(--color-paper-deep)',
                border: '1px solid var(--color-border)'
              }}
            >
              {/* Decorative inner frame */}
              <div 
                className="absolute inset-3 border pointer-events-none"
                style={{ borderColor: 'rgba(212, 198, 179, 0.5)' }}
                aria-hidden="true"
              />
              
              <div className="text-center">
                <span 
                  className="font-literary text-3xl block mb-2 opacity-25"
                  style={{ color: 'var(--color-walnut)' }}
                  aria-hidden="true"
                >
                  ❦
                </span>
                <span 
                  className="font-body text-sm"
                  style={{ color: 'var(--color-muted)' }}
                >
                  [कवर चित्र]
                </span>
              </div>
            </div>
          </div>

          {/* Story Content Area */}
          <article className="mb-12">
            <div className="prose-story max-w-2xl mx-auto">
              <p 
                className="italic text-center leading-relaxed"
                style={{ color: 'var(--color-muted)' }}
              >
                [कहानी का पूर्ण पाठ यहाँ प्रदर्शित होगा।]
              </p>
              <p 
                className="mt-10 italic text-center"
                style={{ color: 'var(--color-muted)', fontSize: '1rem' }}
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
              <ClockIcon />
              [पढ़ने का समय]
            </span>
            <span className="flex items-center gap-2">
              <TagIcon />
              [श्रेणी]
            </span>
            <span className="flex items-center gap-2">
              <CalendarIcon />
              [वर्ष]
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
          className="flex justify-between items-center pt-8 max-w-4xl mx-auto"
          aria-label="कहानी नेविगेशन"
        >
          <button 
            className="font-body text-sm transition-colors hover:underline flex items-center gap-2"
            style={{ color: 'var(--color-maroon)' }}
            disabled
          >
            ← पिछली कहानी
          </button>
          <Link
            to="/stories"
            className="font-body text-sm transition-colors hover:underline"
            style={{ color: 'var(--color-muted)' }}
          >
            सभी कहानियाँ
          </Link>
          <button 
            className="font-body text-sm transition-colors hover:underline flex items-center gap-2"
            style={{ color: 'var(--color-maroon)' }}
            disabled
          >
            अगली कहानी →
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
      width="100" 
      height="16" 
      viewBox="0 0 100 16" 
      fill="none"
      style={{ 
        color: 'var(--color-gold)',
        transform: inverted ? 'rotate(180deg)' : 'none',
        opacity: 0.5
      }}
    >
      <path 
        d="M50 2 C38 2, 30 8, 12 8 C6 8, 2 6, 0 8 M50 2 C62 2, 70 8, 88 8 C94 8, 98 6, 100 8"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="50" cy="8" r="2" fill="currentColor" />
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
