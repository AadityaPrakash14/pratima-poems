import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AdminPageHeader, 
  AdminButton, 
  AdminStatusBadge, 
  AdminLoadingState, 
  AdminErrorState,
  AdminEmptyState 
} from '../../components/admin';
import { getPoemCounts, listPoems } from '../../services/poemService';
import { getStoryCounts, listStories } from '../../services/storyService';
import { ServiceError, ServiceErrorCode } from '../../services/serviceErrors';

/**
 * DashboardPage - Admin dashboard with statistics, recent activity, and quick actions
 * 
 * Phase 3H Implementation:
 * - Content statistics (poems and stories by status)
 * - Recent activity (recently updated content)
 * - Quick actions (create content shortcuts)
 * 
 * Route: /admin/dashboard
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  
  // State for statistics
  const [poemCounts, setPoemCounts] = useState(null);
  const [storyCounts, setStoryCounts] = useState(null);
  
  // State for recent activity
  const [recentPoems, setRecentPoems] = useState([]);
  const [recentStories, setRecentStories] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [poemCountsData, storyCountsData, recentPoemsData, recentStoriesData] = await Promise.all([
        getPoemCounts(),
        getStoryCounts(),
        listPoems({ limit: 5 }), // Already ordered by updated_at descending
        listStories({ limit: 5 }), // Already ordered by updated_at descending
      ]);

      setPoemCounts(poemCountsData);
      setStoryCounts(storyCountsData);
      setRecentPoems(recentPoemsData);
      setRecentStories(recentStoriesData);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      
      // Handle ServiceError for user-friendly messages
      if (err instanceof ServiceError) {
        if (err.code === ServiceErrorCode.NOT_CONFIGURED) {
          setError('Supabase कॉन्फ़िगर नहीं है।');
        } else if (err.code === ServiceErrorCode.NETWORK_ERROR) {
          setError('कनेक्शन में समस्या है। कृपया पुनः प्रयास करें।');
        } else {
          setError(err.message);
        }
      } else {
        setError('डेटा लोड करने में समस्या हुई।');
      }
    } finally {
      setLoading(false);
    }
  }

  // Quick action handlers
  const handleNewPoem = () => navigate('/admin/poems/new');
  const handleNewStory = () => navigate('/admin/stories/new');
  const handleManageCategories = () => navigate('/admin/categories');

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Dashboard"
          description="प्रतिमा एडमिन पोर्टल में आपका स्वागत है।"
        />
        <AdminLoadingState 
          message="डैशबोर्ड लोड हो रहा है..."
          size="lg"
          fullHeight
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <AdminPageHeader
          title="Dashboard"
          description="प्रतिमा एडमिन पोर्टल में आपका स्वागत है।"
        />
        <AdminErrorState
          title="डेटा लोड नहीं हो सका"
          message={error}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <AdminPageHeader
        title="Dashboard"
        description="प्रतिमा एडमिन पोर्टल में आपका स्वागत है।"
      />

      {/* ============================================ */}
      {/* SECTION 1: Content Statistics */}
      {/* ============================================ */}
      <section className="mb-8">
        <h2 
          className="font-literary text-lg font-semibold mb-4"
          style={{ color: 'var(--color-ink)' }}
        >
          सामग्री आँकड़े
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Poem Statistics Card */}
          <StatisticsCard
            title="कविताएँ"
            icon={<PoemIcon />}
            counts={poemCounts}
            linkTo="/admin/poems"
            onNavigate={() => navigate('/admin/poems')}
          />
          
          {/* Story Statistics Card */}
          <StatisticsCard
            title="कहानियाँ"
            icon={<StoryIcon />}
            counts={storyCounts}
            linkTo="/admin/stories"
            onNavigate={() => navigate('/admin/stories')}
          />
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: Quick Actions */}
      {/* ============================================ */}
      <section className="mb-8">
        <h2 
          className="font-literary text-lg font-semibold mb-4"
          style={{ color: 'var(--color-ink)' }}
        >
          त्वरित क्रियाएँ
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <AdminButton
            variant="primary"
            onClick={handleNewPoem}
            icon={<PlusIcon />}
          >
            नई कविता
          </AdminButton>
          
          <AdminButton
            variant="primary"
            onClick={handleNewStory}
            icon={<PlusIcon />}
          >
            नई कहानी
          </AdminButton>
          
          <AdminButton
            variant="secondary"
            onClick={handleManageCategories}
            icon={<CategoryIcon />}
          >
            श्रेणी जोड़ें
          </AdminButton>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: Recent Activity */}
      {/* ============================================ */}
      <section className="mb-8">
        <h2 
          className="font-literary text-lg font-semibold mb-4"
          style={{ color: 'var(--color-ink)' }}
        >
          हाल की गतिविधि
        </h2>
        
        <div 
          className="rounded-lg border overflow-hidden"
          style={{ 
            backgroundColor: 'var(--color-paper-light)',
            borderColor: 'var(--color-border)'
          }}
        >
          {/* Check if there's any recent activity */}
          {recentPoems.length === 0 && recentStories.length === 0 ? (
            <AdminEmptyState
              title="कोई हालिया गतिविधि नहीं"
              description="अभी तक कोई कविता या कहानी नहीं बनाई गई है।"
              action={{
                label: 'नई कविता बनाएँ',
                onClick: handleNewPoem,
              }}
            />
          ) : (
            <RecentActivityList
              poems={recentPoems}
              stories={recentStories}
              formatDate={formatDate}
              onNavigate={navigate}
            />
          )}
        </div>
      </section>

      {/* Auth Status */}
      <div 
        className="p-4 rounded-lg"
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
 * StatisticsCard - Card displaying content counts by status
 */
function StatisticsCard({ title, icon, counts, onNavigate }) {
  if (!counts) {
    return null;
  }

  return (
    <div 
      className="p-4 rounded-lg border cursor-pointer transition-all"
      style={{ 
        backgroundColor: 'var(--color-paper-light)',
        borderColor: 'var(--color-border)'
      }}
      onClick={onNavigate}
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
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate();
        }
      }}
    >
      {/* Header with icon and title */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(111, 29, 42, 0.1)' }}
        >
          <span style={{ color: 'var(--color-maroon)' }}>
            {icon}
          </span>
        </div>
        <div>
          <h3 
            className="font-literary text-base font-semibold"
            style={{ color: 'var(--color-ink)' }}
          >
            {title}
          </h3>
          <p 
            className="font-body text-xs"
            style={{ color: 'var(--color-muted)' }}
          >
            कुल: {counts.total}
          </p>
        </div>
      </div>

      {/* Status counts grid */}
      <div className="grid grid-cols-3 gap-2">
        <StatusCount 
          label="ड्राफ़्ट" 
          count={counts.draft} 
          color="var(--color-muted)"
        />
        <StatusCount 
          label="प्रकाशित" 
          count={counts.published} 
          color="#15803D"
        />
        <StatusCount 
          label="संग्रहित" 
          count={counts.archived} 
          color="#B45309"
        />
      </div>
    </div>
  );
}

/**
 * StatusCount - Individual status count display
 */
function StatusCount({ label, count, color }) {
  return (
    <div 
      className="p-2 rounded text-center"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <p 
        className="font-body text-lg font-semibold"
        style={{ color }}
      >
        {count}
      </p>
      <p 
        className="font-body text-xs"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </p>
    </div>
  );
}

/**
 * RecentActivityList - Combined list of recent poems and stories
 */
function RecentActivityList({ poems, stories, formatDate, onNavigate }) {
  // Combine and sort by updated_at
  const combinedActivity = [
    ...poems.map(p => ({ ...p, type: 'poem', typeLabel: 'कविता' })),
    ...stories.map(s => ({ ...s, type: 'story', typeLabel: 'कहानी' })),
  ].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  // Take top 10 (5 of each type max, but combined and re-sorted)
  const recentItems = combinedActivity.slice(0, 10);

  return (
    <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
      {recentItems.map((item) => (
        <li 
          key={`${item.type}-${item.id}`}
          className="p-4 hover:bg-opacity-50 transition-colors cursor-pointer"
          style={{ backgroundColor: 'transparent' }}
          onClick={() => {
            const path = item.type === 'poem' 
              ? `/admin/poems/${item.id}/edit`
              : `/admin/stories/${item.id}/edit`;
            onNavigate(path);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-paper)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title and type */}
            <div className="min-w-0 flex-1">
              <p 
                className="font-literary text-sm font-medium truncate"
                style={{ color: 'var(--color-ink)' }}
              >
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="font-body text-xs px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: item.type === 'poem' 
                      ? 'rgba(111, 29, 42, 0.1)' 
                      : 'rgba(59, 130, 246, 0.1)',
                    color: item.type === 'poem' 
                      ? 'var(--color-maroon)' 
                      : '#2563EB'
                  }}
                >
                  {item.typeLabel}
                </span>
                <span 
                  className="font-body text-xs"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {formatDate(item.updated_at)}
                </span>
              </div>
            </div>
            
            {/* Right: Status badge */}
            <AdminStatusBadge status={item.status} size="sm" />
          </div>
        </li>
      ))}
    </ul>
  );
}

// ============================================
// Icons
// ============================================

function PoemIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function StoryIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}
