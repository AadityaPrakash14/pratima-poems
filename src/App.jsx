import { HashRouter, Routes, Route } from 'react-router-dom';
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
 */
function App() {
  return (
    <HashRouter>
      <Routes>
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
      </Routes>
    </HashRouter>
  );
}

export default App;
