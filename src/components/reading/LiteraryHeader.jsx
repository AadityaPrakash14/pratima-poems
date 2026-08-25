/**
 * LiteraryHeader - Title section for reading pages
 * Shows content type label, title, and author attribution
 * Designed to feel like the heading of a personal manuscript page
 * Clean, elegant, centered composition
 */
export default function LiteraryHeader({ 
  type = 'कविता', // 'कविता' or 'कहानी'
  title,
  subtitle,
  author = 'प्रतिमा'
}) {
  return (
    <header className="literary-header">
      {/* Content type label */}
      <p className="literary-header__type">
        {type}
      </p>

      {/* Title */}
      <h1 className="literary-header__title">
        {title}
      </h1>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="literary-header__subtitle">
          {subtitle}
        </p>
      )}

      {/* Author attribution */}
      <p className="literary-header__author">
        — {author}
      </p>

      {/* Subtle divider */}
      <div className="literary-header__divider" aria-hidden="true">
        <span className="literary-header__line literary-header__line--left" />
        <span className="literary-header__diamond" />
        <span className="literary-header__line literary-header__line--right" />
      </div>
    </header>
  );
}
