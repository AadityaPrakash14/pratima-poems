/**
 * DashboardPage - Admin dashboard
 * 
 * Phase 3B: Basic dashboard with welcome message
 * Phase 3H: Will add stats, recent activity, quick links
 * 
 * Route: /admin/dashboard
 */
export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 
          className="font-literary text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--color-ink)' }}
        >
          Dashboard
        </h1>
        <p 
          className="font-body"
          style={{ color: 'var(--color-muted)' }}
        >
          प्रतिमा एडमिन पोर्टल में आपका स्वागत है।
        </p>
      </div>

      {/* Dashboard Content Placeholder */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards - Placeholders for Phase 3H */}
        <DashboardCard
          title="कविताएँ"
          description="कविताओं की सूची और प्रबंधन"
          linkTo="/admin/poems"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          }
        />

        <DashboardCard
          title="कहानियाँ"
          description="कहानियों की सूची और प्रबंधन"
          linkTo="/admin/stories"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
        />

        <DashboardCard
          title="श्रेणियाँ"
          description="श्रेणियों का प्रबंधन"
          linkTo="/admin/categories"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
          }
        />
      </div>

      {/* Info Section */}
      <div 
        className="mt-8 p-6 rounded-lg border"
        style={{ 
          backgroundColor: 'var(--color-paper-light)',
          borderColor: 'var(--color-border)'
        }}
      >
        <h2 
          className="font-literary text-lg font-semibold mb-3"
          style={{ color: 'var(--color-ink)' }}
        >
          आगामी फ़ीचर्स
        </h2>
        <ul 
          className="font-body list-disc list-inside space-y-2"
          style={{ color: 'var(--color-muted)' }}
        >
          <li>कविताओं और कहानियों की संख्या (Phase 3H)</li>
          <li>हाल की गतिविधि (Phase 3H)</li>
          <li>त्वरित क्रियाएँ (Phase 3H)</li>
        </ul>
      </div>

      {/* Auth Status */}
      <div 
        className="mt-6 p-4 rounded-lg"
        style={{ backgroundColor: 'rgba(111, 29, 42, 0.05)' }}
      >
        <p 
          className="font-body text-sm"
          style={{ color: 'var(--color-maroon)' }}
        >
          ✓ आप सफलतापूर्वक एडमिन के रूप में लॉगिन हैं।
        </p>
      </div>
    </div>
  );
}

/**
 * DashboardCard - Reusable card component for dashboard
 */
function DashboardCard({ title, description, linkTo, icon }) {
  return (
    <a
      href={`#${linkTo}`}
      className="block p-6 rounded-lg border transition-all"
      style={{ 
        backgroundColor: 'var(--color-paper-light)',
        borderColor: 'var(--color-border)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-maroon)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div 
        className="mb-4"
        style={{ color: 'var(--color-maroon)' }}
      >
        {icon}
      </div>
      <h3 
        className="font-literary text-lg font-semibold mb-1"
        style={{ color: 'var(--color-ink)' }}
      >
        {title}
      </h3>
      <p 
        className="font-body text-sm"
        style={{ color: 'var(--color-muted)' }}
      >
        {description}
      </p>
    </a>
  );
}
