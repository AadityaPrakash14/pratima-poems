import { PrimaryButton } from '../../components/common';

/**
 * StoriesListPage - Admin stories listing page
 * 
 * Phase 3B: Placeholder with basic structure
 * Phase 3G: Will add actual CRUD functionality
 * 
 * Route: /admin/stories
 */
export default function StoriesListPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 
            className="font-literary text-2xl md:text-3xl font-bold mb-1"
            style={{ color: 'var(--color-ink)' }}
          >
            कहानियाँ
          </h1>
          <p 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            सभी कहानियों का प्रबंधन करें
          </p>
        </div>
        <PrimaryButton to="/admin/stories/new">
          + नई कहानी
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2 
          className="font-literary text-lg font-semibold mb-2"
          style={{ color: 'var(--color-ink)' }}
        >
          कहानियों की सूची
        </h2>
        <p 
          className="font-body mb-4"
          style={{ color: 'var(--color-muted)' }}
        >
          यहाँ कहानियों की सूची दिखाई जाएगी। (Phase 3G में implement होगा)
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
