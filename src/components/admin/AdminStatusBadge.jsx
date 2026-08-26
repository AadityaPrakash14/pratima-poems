/**
 * AdminStatusBadge - Status indicator badge for content items
 * 
 * Displays content status with appropriate color coding:
 * - draft (ड्राफ़्ट) - Gray
 * - published (प्रकाशित) - Green
 * - archived (संग्रहित) - Orange/Amber
 * 
 * Props:
 * - status: 'draft' | 'published' | 'archived' (required)
 * - size: 'sm' | 'md' - Badge size
 */
export default function AdminStatusBadge({
  status,
  size = 'md',
  className = '',
}) {
  // Status configuration
  const statusConfig = {
    draft: {
      label: 'ड्राफ़्ट',
      backgroundColor: 'var(--color-paper-deep)',
      color: 'var(--color-muted)',
      dotColor: 'var(--color-muted)',
    },
    published: {
      label: 'प्रकाशित',
      backgroundColor: 'rgba(22, 163, 74, 0.1)', // green-600 with opacity
      color: '#15803D', // green-700
      dotColor: '#22C55E', // green-500
    },
    archived: {
      label: 'संग्रहित',
      backgroundColor: 'rgba(245, 158, 11, 0.1)', // amber-500 with opacity
      color: '#B45309', // amber-700
      dotColor: '#F59E0B', // amber-500
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-body font-medium rounded-full
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={{
        backgroundColor: config.backgroundColor,
        color: config.color,
      }}
    >
      {/* Status dot */}
      <span 
        className={`rounded-full ${dotSizes[size]}`}
        style={{ backgroundColor: config.dotColor }}
        aria-hidden="true"
      />
      {/* Status label */}
      <span>{config.label}</span>
    </span>
  );
}
