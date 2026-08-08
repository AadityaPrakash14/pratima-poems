import { useParams } from 'react-router-dom';

/**
 * PoemDetailPage - Individual poem display page
 * Will be fully implemented in Task 14.4
 */
export default function PoemDetailPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Poem Detail</h1>
      <p>Viewing poem: {id}</p>
    </div>
  );
}
