import { Link } from 'react-router-dom';

/**
 * ReadingNavigation - Navigation for reading pages
 * Simple, understated navigation back to the collection
 * Prev/Next navigation will be enabled when content is connected
 * 
 * Props:
 * - type: 'poem' | 'story' - Determines labels and links
 */
export default function ReadingNavigation({ type = 'poem' }) {
  const config = {
    poem: {
      backLink: '/poems',
      backLabel: '← सभी कविताएँ',
    },
    story: {
      backLink: '/stories',
      backLabel: '← सभी कहानियाँ',
    },
  };

  const { backLink, backLabel } = config[type];

  return (
    <nav 
      className="reading-navigation"
      aria-label={type === 'poem' ? 'कविता नेविगेशन' : 'कहानी नेविगेशन'}
    >
      <Link
        to={backLink}
        className="reading-navigation__link reading-navigation__link--center"
        style={{ color: 'var(--color-maroon)' }}
      >
        {backLabel}
      </Link>
    </nav>
  );
}
