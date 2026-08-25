/**
 * StoryBody - Renders story content with prose formatting
 * Uses comfortable line length, generous paragraph spacing
 * Left-aligned text for natural reading rhythm
 * 
 * Props:
 * - content: string or array of paragraphs
 * - isPlaceholder: boolean - If true, shows placeholder styling
 */
export default function StoryBody({ content, isPlaceholder = false }) {
  if (isPlaceholder) {
    return (
      <article className="story-body story-body--placeholder">
        <div className="story-content">
          <p className="story-placeholder-text">
            [कहानी का पूर्ण पाठ यहाँ प्रदर्शित होगा।]
          </p>
          <p className="story-placeholder-note">
            [यह प्लेसहोल्डर पृष्ठ है — वास्तविक कहानी जल्द ही उपलब्ध होगी।]
          </p>
        </div>
      </article>
    );
  }

  // Handle both string and array content
  const paragraphs = Array.isArray(content) 
    ? content 
    : content.split(/\n\s*\n/);

  return (
    <article className="story-body">
      <div className="story-content">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="story-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
