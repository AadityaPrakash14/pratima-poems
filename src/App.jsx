import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import {
  HomePage,
  PoemsPage,
  StoriesPage,
  PoemDetailPage,
  StoryDetailPage,
  AboutPage,
  NotFoundPage,
} from './pages';
import {
  LoginPage,
  DashboardPage,
  PoemsListPage,
  PoemEditorPage,
  StoriesListPage,
  StoryEditorPage,
  CategoriesPage,
} from './pages/admin';

/**
 * App - Root application component with HashRouter for GitHub Pages compatibility
 * Uses hash routing (/#/path) to work correctly with static hosting
 * ScrollToTop ensures pages start at scroll position 0 on navigation
 * 
 * Route Structure:
 * - Public routes: /, /poems, /stories, /about, etc. (MainLayout)
 * - Admin routes: /admin/* (AdminLayout, protected)
 */
function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            {/* Main pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/poems" element={<PoemsPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            
            {/* Detail pages with dynamic slug */}
            <Route path="/poems/:id" element={<PoemDetailPage />} />
            <Route path="/stories/:id" element={<StoryDetailPage />} />
            
            {/* About page */}
            <Route path="/about" element={<AboutPage />} />
            
            {/* Catch-all for 404 - public only */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin routes */}
          {/* Login page is outside ProtectedRoute (accessible when not logged in) */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              {/* Dashboard */}
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<DashboardPage />} />
              
              {/* Poems Management */}
              <Route path="/admin/poems" element={<PoemsListPage />} />
              <Route path="/admin/poems/new" element={<PoemEditorPage />} />
              <Route path="/admin/poems/:id/edit" element={<PoemEditorPage />} />
              
              {/* Stories Management */}
              <Route path="/admin/stories" element={<StoriesListPage />} />
              <Route path="/admin/stories/new" element={<StoryEditorPage />} />
              <Route path="/admin/stories/:id/edit" element={<StoryEditorPage />} />
              
              {/* Categories Management */}
              <Route path="/admin/categories" element={<CategoriesPage />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
