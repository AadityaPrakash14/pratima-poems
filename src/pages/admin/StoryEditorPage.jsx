import { useParams, Link } from 'react-router-dom';
import { SecondaryButton } from '../../components/common';

/**
 * StoryEditorPage - Create/Edit story page
 * 
 * Phase 3B: Placeholder with basic structure
 * Phase 3G: Will add actual form and CRUD functionality
 * 
 * Routes:
 * - /admin/stories/new (create)
 * - /admin/stories/:id/edit (edit)
 */
export default function StoryEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <Link 
          to="/admin/stories"
          className="inline-flex items-center gap-1 font-body text-sm mb-4 transition-colors"
          style={{ color: 'var(--color-maroon)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          कहानियों पर वापस
        </Link>
        <h1 
          className="font-literary text-2xl md:text-3xl font-bold mb-1"
          style={{ color: 'var(--color-ink)' }}
        >
          {isEditing ? 'कहानी संपादित करें' : 'नई कहानी'}
        </h1>
        <p 
          className="font-body text-sm"
          style={{ color: 'var(--color-muted)' }}
        >
          {isEditing 
            ? `कहानी ID: ${id}` 
            : 'एक नई कहानी बनाएँ'
          }
        </p>
      </div>

      {/* Placeholder Content */}
      <div 
        className="p-8 rounded-lg border"
        style={{ 
          backgroundColor: 'var(--color-paper-light)',
          borderColor: 'var(--color-border)'
        }}
      >
        <p 
          className="font-body mb-6"
          style={{ color: 'var(--color-muted)' }}
        >
          यहाँ कहानी एडिटर फ़ॉर्म होगा। (Phase 3G में implement होगा)
        </p>

        {/* Placeholder form fields indication */}
        <div className="space-y-4 mb-6">
          <PlaceholderField label="शीर्षक (Title)" />
          <PlaceholderField label="Slug" />
          <PlaceholderField label="पाठ (Content)" tall />
          <PlaceholderField label="उपशीर्षक (Subtitle)" />
          <PlaceholderField label="सारांश (Excerpt)" />
          <PlaceholderField label="कवर चित्र (Cover Image)" />
          <PlaceholderField label="श्रेणी (Category)" />
          <PlaceholderField label="लिखने की तिथि (Written Date)" />
          <PlaceholderField label="पढ़ने का समय (Reading Time)" />
          <PlaceholderField label="मुखपृष्ठ पर दिखाएँ (Featured)" />
        </div>

        {/* Placeholder Actions */}
        <div className="flex gap-3">
          <SecondaryButton to="/admin/stories">
            रद्द करें
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

/**
 * PlaceholderField - Visual placeholder for form fields
 */
function PlaceholderField({ label, tall = false }) {
  return (
    <div>
      <span 
        className="block font-body text-sm mb-1"
        style={{ color: 'var(--color-ink-soft)' }}
      >
        {label}
      </span>
      <div 
        className={`rounded-md border ${tall ? 'h-32' : 'h-10'}`}
        style={{ 
          backgroundColor: 'var(--color-paper)',
          borderColor: 'var(--color-border)'
        }}
      />
    </div>
  );
}
