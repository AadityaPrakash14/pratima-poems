/**
 * AdminEmptyState - Empty state display for admin lists
 * 
 * Features:
 * - Icon or visual element
 * - Message (Hindi)
 * - Optional action button
 * 
 * Props:
 * - icon: ReactNode - Optional icon/visual
 * - title: string - Main message
 * - description: string - Optional secondary message
 * - action: { label: string, onClick: function } - Optional action button
 */
export default function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      {/* Icon */}
      {icon ? (
        <div 
          className="w-16 h-16 mb-4 flex items-center justify-center"
          style={{ color: 'var(--color-muted)' }}
        >
          {icon}
        </div>
      ) : (
        <DefaultEmptyIcon className="w-16 h-16 mb-4" />
      )}

      {/* Title */}
      <h3 
        className="font-body text-base font-medium text-center mb-1"
        style={{ color: 'var(--color-ink-soft)' }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p 
          className="font-body text-sm text-center max-w-sm"
          style={{ color: 'var(--color-muted)' }}
        >
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 font-body text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ 
            backgroundColor: 'var(--color-maroon)',
            color: 'var(--color-paper-light)',
          }}
        >
          {action.icon && (
            <span className="w-4 h-4">{action.icon}</span>
          )}
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * Default empty state icon (folder/document)
 */
function DefaultEmptyIcon({ className }) {
  return (
    <svg 
      className={className}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1}
      style={{ color: 'var(--color-muted)' }}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" 
      />
    </svg>
  );
}
