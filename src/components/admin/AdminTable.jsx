/**
 * AdminTable - Responsive data table for admin lists
 * 
 * Features:
 * - Responsive design (scrollable on mobile)
 * - Header row configuration
 * - Empty state support
 * - Loading state support
 * - Zebra striping option
 * 
 * Props:
 * - columns: Array<{ key: string, header: string, width?: string, align?: 'left'|'center'|'right' }>
 * - data: Array of row objects
 * - renderCell: (row, column) => ReactNode - Custom cell renderer
 * - loading: boolean
 * - emptyState: ReactNode - Custom empty state (or use AdminEmptyState)
 * - onRowClick: (row) => void - Optional row click handler
 * - striped: boolean - Zebra striping
 * - compact: boolean - Reduced padding
 */
export default function AdminTable({
  columns = [],
  data = [],
  renderCell,
  loading = false,
  emptyState,
  onRowClick,
  striped = false,
  compact = false,
  className = '',
}) {
  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';
  const headerPadding = compact ? 'px-3 py-2' : 'px-4 py-3';

  // Loading state
  if (loading) {
    return (
      <div className={`overflow-hidden rounded-lg border ${className}`} style={{ borderColor: 'var(--color-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-paper-deep)' }}>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`${headerPadding} text-left font-body text-xs font-medium uppercase tracking-wider`}
                    style={{ 
                      color: 'var(--color-muted)',
                      width: col.width,
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'var(--color-paper-light)' }}>
              {/* Loading skeleton rows */}
              {[...Array(5)].map((_, index) => (
                <tr 
                  key={index}
                  className="border-t"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cellPadding}>
                      <div 
                        className="h-4 rounded animate-pulse"
                        style={{ 
                          backgroundColor: 'var(--color-paper-deep)',
                          width: col.key === 'actions' ? '80px' : '70%',
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    if (emptyState) {
      return (
        <div className={`overflow-hidden rounded-lg border ${className}`} style={{ borderColor: 'var(--color-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-paper-deep)' }}>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`${headerPadding} text-left font-body text-xs font-medium uppercase tracking-wider`}
                      style={{ 
                        color: 'var(--color-muted)',
                        width: col.width,
                      }}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
          <div style={{ backgroundColor: 'var(--color-paper-light)' }}>
            {emptyState}
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`p-8 text-center rounded-lg border ${className}`}
        style={{ 
          backgroundColor: 'var(--color-paper-light)',
          borderColor: 'var(--color-border)',
        }}
      >
        <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>
          कोई डेटा नहीं है।
        </p>
      </div>
    );
  }

  // Table with data
  return (
    <div className={`overflow-hidden rounded-lg border ${className}`} style={{ borderColor: 'var(--color-border)' }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr style={{ backgroundColor: 'var(--color-paper-deep)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${headerPadding} font-body text-xs font-medium uppercase tracking-wider`}
                  style={{ 
                    color: 'var(--color-muted)',
                    width: col.width,
                    textAlign: col.align || 'left',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody style={{ backgroundColor: 'var(--color-paper-light)' }}>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`
                  border-t transition-colors
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                style={{ 
                  borderColor: 'var(--color-border)',
                  backgroundColor: striped && rowIndex % 2 === 1 
                    ? 'var(--color-paper)' 
                    : 'var(--color-paper-light)',
                }}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onMouseEnter={onRowClick ? (e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-paper-deep)';
                } : undefined}
                onMouseLeave={onRowClick ? (e) => {
                  e.currentTarget.style.backgroundColor = striped && rowIndex % 2 === 1 
                    ? 'var(--color-paper)' 
                    : 'var(--color-paper-light)';
                } : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${cellPadding} font-body text-sm`}
                    style={{ 
                      color: 'var(--color-ink)',
                      textAlign: col.align || 'left',
                    }}
                  >
                    {renderCell ? renderCell(row, col) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
