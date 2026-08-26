import { useParams, Link } from 'react-router-dom';
import { SecondaryButton } from '../../components/common';

/**
 * PoemEditorPage - Create/Edit poem page
 * 
 * Phase 3B: Placeholder with basic structure
 * Phase 3F: Will add actual form and CRUD functionality
 * 
 * Routes:
 * - /admin/poems/new (create)
 * - /admin/poems/:id/edit (edit)
 */
export default function PoemEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <Link 
          to="/admin/poems"
          className="inline-flex items-center gap-1 font-body text-sm mb-4 transition-colors"
          style={{ color: 'var(--color-maroon)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          कविताओं पर वापस
        </Link>
        <h1 
          className="font-literary text-2xl md:text-3xl font-bold mb-1"
          style={{ color: 'var(--color-ink)' }}
        >
          {isEditing ? 'कविता संपादित करें' : 'नई कविता'}
        </h1>
        <p 
          className="font-body text-sm"
          style={{ color: 'var(--color-muted)' }}
        >
          {isEditing 
            ? `कविता ID: ${id}` 
            : 'एक नई कविता बनाएँ'
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
          यहाँ कविता एडिटर फ़ॉर्म होगा। (Phase 3F में implement होगा)
        </p>

        {/* Placeholder form fields indication */}
        <div className="space-y-4 mb-6">
          <PlaceholderField label="शीर्षक (Title)" />
          <PlaceholderField label="Slug" />
          <PlaceholderField label="पाठ (Content)" tall />
          <PlaceholderField label="उपशीर्षक (Subtitle)" />
          <PlaceholderField label="सारांश (Excerpt)" />
          <PlaceholderField label="श्रेणी (Category)" />
          <PlaceholderField label="लिखने की तिथि (Written Date)" />
          <PlaceholderField label="पढ़ने का समय (Reading Time)" />
          <PlaceholderField label="मुखपृष्ठ पर दिखाएँ (Featured)" />
        </div>

        {/* Placeholder Actions */}
        <div className="flex gap-3">
          <SecondaryButton to="/admin/poems">
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
