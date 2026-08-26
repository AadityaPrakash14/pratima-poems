import { PrimaryButton } from '../../components/common';

/**
 * PoemsListPage - Admin poems listing page
 * 
 * Phase 3B: Placeholder with basic structure
 * Phase 3F: Will add actual CRUD functionality
 * 
 * Route: /admin/poems
 */
export default function PoemsListPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 
            className="font-literary text-2xl md:text-3xl font-bold mb-1"
            style={{ color: 'var(--color-ink)' }}
          >
            कविताएँ
          </h1>
          <p 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            सभी कविताओं का प्रबंधन करें
          </p>
        </div>
        <PrimaryButton to="/admin/poems/new">
          + नई कविता
        </PrimaryButton>
      </div>

      {/* Placeholder Content */}
      <div 
        className="p-8 rounded-lg border text-center"
        style={{ 
          backgroundColor: 'var(--color-paper-light)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div 
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-paper-deep)' }}
        >
          <svg 
            className="w-8 h-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={1.5}
            style={{ color: 'var(--color-muted)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h2 
          className="font-literary text-lg font-semibold mb-2"
          style={{ color: 'var(--color-ink)' }}
        >
          कविताओं की सूची
        </h2>
        <p 
          className="font-body mb-4"
          style={{ color: 'var(--color-muted)' }}
        >
          यहाँ कविताओं की सूची दिखाई जाएगी। (Phase 3F में implement होगा)
        </p>
        <p 
          className="font-body text-sm"
          style={{ color: 'var(--color-muted)' }}
        >
          फ़िल्टर, खोज, और CRUD फ़ंक्शनैलिटी जोड़ी जाएगी।
        </p>
      </div>
    </div>
  );
}
