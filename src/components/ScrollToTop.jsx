import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Resets scroll position on route change
 * 
 * HashRouter does not automatically scroll to top on navigation.
 * This component listens for location changes and scrolls to (0, 0).
 * This fixes issues where content appears clipped behind the fixed navbar
 * when navigating between pages.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
