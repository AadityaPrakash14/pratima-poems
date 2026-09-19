/**
 * AdminPageHeader - Page header for admin sections
 * 
 * Features:
 * - Page title (required)
 * - Optional description
 * - Optional primary action button
 * 
 * Props:
 * - title: string (required) - Page title in Hindi
 * - description: string - Optional description text
 * - action: { label: string, onClick: function, icon?: ReactNode } - Optional primary action
 */
export default function AdminPageHeader({ 
  title, 
  description,
  action,
  className = '' 
}) {
  return (
    <header className={`mb-6 md:mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title and Description */}
        <div>
          <h1 
            className="font-literary text-xl md:text-2xl font-semibold"
            style={{ color: 'var(--color-ink)' }}
          >
            {title}
          </h1>
          {description && (
            <p 
              className="mt-1 font-body text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Primary Action */}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-body text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ 
              backgroundColor: 'var(--color-maroon)',
              color: 'var(--color-paper-light)'
            }}
          >
            {action.icon && (
              <span className="w-4 h-4 flex-shrink-0">
                {action.icon}
              </span>
            )}
            {action.label}
          </button>
        )}
      </div>

      {/* Subtle divider */}
      <div 
        className="mt-4 h-px"
        style={{ backgroundColor: 'var(--color-border)' }}
      />
    </header>
  );
}
