import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/ScrollToTop';
import {
  HomePage,
  PoemsPage,
  StoriesPage,
  PoemDetailPage,
  StoryDetailPage,
  AboutPage,
  NotFoundPage,
} from './pages';

/**
 * App - Root application component with HashRouter for GitHub Pages compatibility
 * Uses hash routing (/#/path) to work correctly with static hosting
 * ScrollToTop ensures pages start at scroll position 0 on navigation
 */
function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* All routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          {/* Main pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/poems" element={<PoemsPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          
          {/* Detail pages with dynamic ID */}
          <Route path="/poems/:id" element={<PoemDetailPage />} />
          <Route path="/stories/:id" element={<StoryDetailPage />} />
          
          {/* About page */}
          <Route path="/about" element={<AboutPage />} />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
