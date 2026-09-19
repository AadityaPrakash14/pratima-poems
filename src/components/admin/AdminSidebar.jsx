import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminSidebar - Side navigation for admin portal
 * 
 * Features:
 * - Navigation links with active state highlighting
 * - Separator between main nav and utility links
 * - View site link
 * - Logout link (mobile only, desktop has it in navbar)
 * - Responsive: fixed on desktop, overlay on mobile
 * 
 * Props:
 * - isOpen: Boolean for mobile visibility
 * - onClose: Function to close mobile menu
 */
export default function AdminSidebar({ isOpen, onClose }) {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  // Navigation items
  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { to: '/admin/poems', label: 'कविताएँ', icon: PoemIcon },
    { to: '/admin/stories', label: 'कहानियाँ', icon: StoryIcon },
    { to: '/admin/categories', label: 'श्रेणियाँ', icon: CategoryIcon },
  ];

  // Shared link styles
  const getLinkStyles = (isActive) => ({
    backgroundColor: isActive ? 'var(--color-paper-deep)' : 'transparent',
    color: isActive ? 'var(--color-maroon)' : 'var(--color-ink-soft)',
    borderLeft: isActive ? '3px solid var(--color-maroon)' : '3px solid transparent',
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-mobile-menu"
        className={`
          fixed top-16 bottom-0 left-0 z-30
          w-64 overflow-y-auto
          border-r
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ 
          backgroundColor: 'var(--color-paper-light)',
          borderColor: 'var(--color-border)'
        }}
      >
        <nav className="flex flex-col h-full py-4">
          {/* Main Navigation */}
          <div className="flex-1 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md font-body text-sm transition-colors"
                style={({ isActive }) => getLinkStyles(isActive)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Separator */}
          <div 
            className="mx-4 my-4 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          />

          {/* Utility Links */}
          <div className="px-3 space-y-1">
            {/* View Site */}
            <a
              href="#/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md font-body text-sm transition-colors"
              style={{ 
                color: 'var(--color-ink-soft)',
                borderLeft: '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-paper-deep)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ExternalLinkIcon className="w-5 h-5 flex-shrink-0" />
              <span>साइट देखें</span>
            </a>

            {/* Logout - Visible on mobile (lg:hidden) */}
            <button
              onClick={handleLogout}
              className="lg:hidden w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-body text-sm transition-colors text-left"
              style={{ 
                color: 'var(--color-ink-soft)',
                borderLeft: '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-paper-deep)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogoutIcon className="w-5 h-5 flex-shrink-0" />
              <span>लॉगआउट</span>
            </button>
          </div>

          {/* Footer Attribution */}
          <div className="px-6 py-4 mt-auto">
            <p 
              className="font-body text-xs"
              style={{ color: 'var(--color-muted)' }}
            >
              प्रतिमा Admin Portal
            </p>
          </div>
        </nav>
      </aside>
    </>
  );
}

/* ============================================
   Icon Components
   Simple SVG icons for navigation items
   ============================================ */

function DashboardIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" 
      />
    </svg>
  );
}

function PoemIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" 
      />
    </svg>
  );
}

function StoryIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
      />
    </svg>
  );
}

function CategoryIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" 
      />
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M6 6h.008v.008H6V6z" 
      />
    </svg>
  );
}

function ExternalLinkIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" 
      />
    </svg>
  );
}

function LogoutIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" 
      />
    </svg>
  );
}
