/**
 * PoemBody - Renders poem content with proper poetic formatting
 * Preserves line breaks, stanza breaks, and intentional whitespace
 * Uses white-space: pre-line to maintain the poet's line structure
 * 
 * Props:
 * - content: string - The poem text with line breaks preserved
 * - isPlaceholder: boolean - If true, shows placeholder styling
 */
export default function PoemBody({ content, isPlaceholder = false }) {
  if (isPlaceholder) {
    return (
      <article className="poem-body poem-body--placeholder">
        <div className="poem-content">
          <p className="poem-placeholder-text">
            [कविता का पूर्ण पाठ यहाँ प्रदर्शित होगा।]
          </p>
          <p className="poem-placeholder-note">
            [यह प्लेसहोल्डर पृष्ठ है — वास्तविक कविता जल्द ही उपलब्ध होगी।]
          </p>
        </div>
      </article>
    );
  }

  // Split content by double newlines to identify stanzas
  const stanzas = content.split(/\n\s*\n/);

  return (
    <article className="poem-body">
      <div className="poem-content">
        {stanzas.map((stanza, index) => (
          <div key={index} className="poem-stanza">
            {/* Preserve line breaks within stanza */}
            {stanza.split('\n').map((line, lineIndex) => (
              <p key={lineIndex} className="poem-line">
                {line || '\u00A0'} {/* Non-breaking space for empty lines */}
              </p>
            ))}
          </div>
        ))}
      </div>
    </article>
  );
}
