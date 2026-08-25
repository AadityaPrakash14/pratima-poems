import { useParams, Link } from 'react-router-dom';
import { 
  ManuscriptPage, 
  LiteraryHeader, 
  PoemBody, 
  EndingMark,
  ReadingNavigation 
} from '../components/reading';

/**
 * PoemDetailPage - Individual poem reading page
 * Designed to feel like reading from an old literary manuscript
 * "मैं उनकी पुरानी डायरी का एक पन्ना पढ़ रहा हूँ।"
 * 
 * Features:
 * - Warm manuscript paper surface
 * - Large, comfortable Devanagari typography
 * - Poetry-specific formatting (line breaks, stanzas)
 * - Subtle literary decorations
 * - Distraction-free reading
 */
export default function PoemDetailPage() {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams(); // Will be used when connected to data source

  // Placeholder poem data - clearly marked as sample content
  const placeholderPoem = {
    title: '[कविता का शीर्षक]',
    subtitle: null,
    author: 'प्रतिमा',
    content: null,
    isPlaceholder: true,
  };

  // Sample poem structure for layout demonstration
  const samplePoemForDemo = `पहली पंक्ति यहाँ होगी
दूसरी पंक्ति यहाँ होगी
तीसरी पंक्ति यहाँ होगी

अगला पद यहाँ होगा
और उसकी पंक्तियाँ
यहाँ दिखेंगी

अंतिम पद
जो कविता को
पूर्ण करेगा`;

  return (
    <div className="reading-page">
      <div className="container-content">
        {/* Back navigation */}
        <Link 
          to="/poems" 
          className="reading-back-link"
        >
          ← सभी कविताएँ
        </Link>

        {/* Manuscript Paper Surface */}
        <ManuscriptPage>
          {/* Literary Header */}
          <LiteraryHeader 
            type="कविता"
            title={placeholderPoem.title}
            subtitle={placeholderPoem.subtitle}
            author={placeholderPoem.author}
          />

          {/* Poem Content */}
          <PoemBody 
            content={placeholderPoem.content || samplePoemForDemo}
            isPlaceholder={placeholderPoem.isPlaceholder}
          />

          {/* Ending Mark */}
          <EndingMark />
        </ManuscriptPage>

        {/* Navigation back to collection */}
        <ReadingNavigation type="poem" />
      </div>
    </div>
  );
}
