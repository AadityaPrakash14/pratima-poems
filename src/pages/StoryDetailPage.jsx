import { useParams, Link } from 'react-router-dom';
import { 
  ManuscriptPage, 
  LiteraryHeader, 
  StoryBody, 
  EndingMark,
  ReadingNavigation 
} from '../components/reading';

/**
 * StoryDetailPage - Individual story reading page
 * Designed to feel like reading from an old literary manuscript
 * "मैं उनकी पुरानी डायरी का एक पन्ना पढ़ रहा हूँ।"
 * 
 * Features:
 * - Warm manuscript paper surface
 * - Comfortable prose formatting
 * - Generous paragraph spacing
 * - Distraction-free reading
 */
export default function StoryDetailPage() {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams(); // Will be used when connected to data source

  // Placeholder story data - clearly marked as sample content
  const placeholderStory = {
    title: '[कहानी का शीर्षक]',
    subtitle: null,
    author: 'प्रतिमा',
    content: null,
    isPlaceholder: true,
  };

  // Sample story paragraphs for layout demonstration
  const sampleStoryForDemo = [
    'कहानी का पहला अनुच्छेद यहाँ होगा। यह प्लेसहोल्डर टेक्स्ट है जो दर्शाता है कि वास्तविक कहानी कैसे दिखेगी। टेक्स्ट की लंबाई और प्रवाह को समझने के लिए यह एक उदाहरण है।',
    'दूसरा अनुच्छेद कहानी को आगे बढ़ाएगा। प्रत्येक अनुच्छेद के बीच उचित दूरी रहेगी जिससे पढ़ने में आसानी हो। हिंदी साहित्य की परंपरा के अनुसार टेक्स्ट सुस्पष्ट और पठनीय होगा।',
    'तीसरा अनुच्छेद कहानी के मध्य भाग को दर्शाता है। पाठक इस बिंदु पर कहानी में पूरी तरह डूब चुका होगा। शब्दों का चयन और वाक्य संरचना सहज प्रवाह सुनिश्चित करती है।',
    'अंतिम अनुच्छेद कहानी को एक सार्थक निष्कर्ष तक पहुँचाएगा। एक अच्छी कहानी पाठक के मन में लंबे समय तक रहती है।'
  ];

  return (
    <div className="reading-page">
      <div className="container-content">
        {/* Back navigation */}
        <Link 
          to="/stories" 
          className="reading-back-link"
        >
          ← सभी कहानियाँ
        </Link>

        {/* Manuscript Paper Surface */}
        <ManuscriptPage>
          {/* Literary Header */}
          <LiteraryHeader 
            type="कहानी"
            title={placeholderStory.title}
            subtitle={placeholderStory.subtitle}
            author={placeholderStory.author}
          />

          {/* Story Content */}
          <StoryBody 
            content={placeholderStory.content || sampleStoryForDemo}
            isPlaceholder={placeholderStory.isPlaceholder}
          />

          {/* Ending Mark */}
          <EndingMark />
        </ManuscriptPage>

        {/* Navigation back to collection */}
        <ReadingNavigation type="story" />
      </div>
    </div>
  );
}
