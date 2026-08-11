import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components/navigation';

/**
 * MainLayout - Wrapper component providing consistent page structure
 * Uses warm paper background with proper spacing for fixed navbar
 */
export default function MainLayout() {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content Area - pt-16 md:pt-20 accounts for fixed navbar height */}
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
