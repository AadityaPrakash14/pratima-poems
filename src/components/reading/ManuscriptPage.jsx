/**
 * ManuscriptPage - The paper/parchment surface for reading literary content
 * Creates the feeling of an old manuscript page with subtle texture
 * Used by both PoemDetailPage and StoryDetailPage
 */
export default function ManuscriptPage({ children, className = '' }) {
  return (
    <div 
      className={`manuscript-reading-surface ${className}`}
    >
      {/* Corner decorations */}
      <div className="manuscript-corner manuscript-corner--top-left" aria-hidden="true" />
      <div className="manuscript-corner manuscript-corner--top-right" aria-hidden="true" />
      <div className="manuscript-corner manuscript-corner--bottom-left" aria-hidden="true" />
      <div className="manuscript-corner manuscript-corner--bottom-right" aria-hidden="true" />
      
      {/* Content */}
      <div className="manuscript-inner">
        {children}
      </div>
    </div>
  );
}
