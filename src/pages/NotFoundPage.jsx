import { Link } from 'react-router-dom';

/**
 * NotFoundPage - 404 error page
 * Will be fully implemented in Task 14.7
 */
export default function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
}
