import { useParams } from 'react-router-dom';

/**
 * StoryDetailPage - Individual story display page
 * Will be fully implemented in Task 14.5
 */
export default function StoryDetailPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Story Detail</h1>
      <p>Viewing story: {id}</p>
    </div>
  );
}
