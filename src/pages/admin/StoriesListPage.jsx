import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminPageHeader,
  AdminTable,
  AdminStatusBadge,
  AdminSelect,
  AdminEmptyState,
  AdminLoadingState,
  AdminErrorState,
  AdminConfirmDialog,
} from '../../components/admin';
import {
  listStories,
  deleteStory,
  publishStory,
  archiveStory,
} from '../../services/storyService';
import { listCategories } from '../../services/categoryService';

/**
 * StoriesListPage - Admin stories listing page
 * 
 * Features:
 * - List all stories with status, category, featured, updated date
 * - Filter by status (all, draft, published, archived)
 * - Filter by category
 * - Edit, publish/archive, delete actions
 * - Hindi-first UI
 * 
 * Route: /admin/stories
 */
export default function StoriesListPage() {
  const navigate = useNavigate();

  // List state
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Action loading state
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Load stories and categories
  const loadData = useCallback(async () => {
    try {
      // Load stories with filters
      const storyOptions = {};
      if (statusFilter) {
        storyOptions.status = statusFilter;
      }
      if (categoryFilter) {
        storyOptions.categoryId = categoryFilter;
      }

      const [storiesData, categoriesData] = await Promise.all([
        listStories(storyOptions),
        listCategories({ type: 'story' }),
      ]);

      setStories(storiesData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Failed to load stories:', err);
      setError(err.message || 'कहानियाँ लोड नहीं हो सकीं।');
    }
  }, [statusFilter, categoryFilter]);

  // Initial load and reload on filter change
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const storyOptions = {};
        if (statusFilter) {
          storyOptions.status = statusFilter;
        }
        if (categoryFilter) {
          storyOptions.categoryId = categoryFilter;
        }

        const [storiesData, categoriesData] = await Promise.all([
          listStories(storyOptions),
          listCategories({ type: 'story' }),
        ]);

        if (mounted) {
          setStories(storiesData);
          setCategories(categoriesData);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load stories:', err);
        if (mounted) {
          setError(err.message || 'कहानियाँ लोड नहीं हो सकीं।');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [statusFilter, categoryFilter]);

  // Navigation handlers
  const handleNewStory = () => {
    navigate('/admin/stories/new');
  };

  const handleEditStory = (story) => {
    navigate(`/admin/stories/${story.id}/edit`);
  };

  // Status transition handlers
  const handlePublish = async (story, e) => {
    e?.stopPropagation();
    setActionLoadingId(story.id);
    try {
      const updated = await publishStory(story.id);
      setStories(prev => prev.map(s => s.id === story.id ? updated : s));
    } catch (err) {
      console.error('Failed to publish story:', err);
      alert(err.message || 'प्रकाशित नहीं हो सका।');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleArchive = async (story, e) => {
    e?.stopPropagation();
    setActionLoadingId(story.id);
    try {
      const updated = await archiveStory(story.id);
      setStories(prev => prev.map(s => s.id === story.id ? updated : s));
    } catch (err) {
      console.error('Failed to archive story:', err);
      alert(err.message || 'संग्रहित नहीं हो सका।');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete handlers
  const handleDeleteClick = (story, e) => {
    e?.stopPropagation();
    setDeleteTarget(story);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteStory(deleteTarget.id);
      setStories(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete story:', err);
      alert(err.message || 'कहानी हटाई नहीं जा सकी।');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  // Filter handlers
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Table columns
  const columns = [
    { key: 'title', header: 'शीर्षक', width: '30%' },
    { key: 'status', header: 'स्थिति', width: '12%' },
    { key: 'category', header: 'श्रेणी', width: '15%' },
    { key: 'featured', header: 'मुखपृष्ठ', width: '10%', align: 'center' },
    { key: 'updated', header: 'अपडेट', width: '15%' },
    { key: 'actions', header: 'क्रियाएँ', width: '18%', align: 'right' },
  ];

  // Render cell content
  const renderCell = (row, column) => {
    const isLoading = actionLoadingId === row.id;

    switch (column.key) {
      case 'title':
        return (
          <div>
            <span className="font-medium block" style={{ color: 'var(--color-ink)' }}>
              {row.title}
            </span>
            {row.subtitle && (
              <span 
                className="text-xs block truncate max-w-[200px]"
                style={{ color: 'var(--color-muted)' }}
              >
                {row.subtitle}
              </span>
            )}
          </div>
        );

      case 'status':
        return <AdminStatusBadge status={row.status} size="sm" />;

      case 'category':
        return (
          <span 
            className="text-sm"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            {row.category?.name || '—'}
          </span>
        );

      case 'featured':
        return row.featured ? (
          <span 
            className="inline-flex items-center justify-center w-5 h-5 rounded-full"
            style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)' }}
            title="मुखपृष्ठ पर"
          >
            <StarIcon className="w-3 h-3" style={{ color: '#15803D' }} />
          </span>
        ) : (
          <span style={{ color: 'var(--color-muted)' }}>—</span>
        );

      case 'updated':
        return (
          <span 
            className="text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            {formatDate(row.updated_at)}
          </span>
        );

      case 'actions':
        return (
          <div className="flex items-center justify-end gap-1">
            {/* Edit button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEditStory(row);
              }}
              className="p-1.5 rounded transition-colors"
              style={{ color: 'var(--color-ink-soft)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-maroon)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ink-soft)'}
              title="संपादित करें"
              disabled={isLoading}
            >
              <EditIcon className="w-4 h-4" />
            </button>

            {/* Publish button (for draft/archived) */}
            {row.status !== 'published' && (
              <button
                type="button"
                onClick={(e) => handlePublish(row, e)}
                className="p-1.5 rounded transition-colors"
                style={{ color: 'var(--color-ink-soft)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#15803D'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ink-soft)'}
                title="प्रकाशित करें"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="w-4 h-4" />
                ) : (
                  <PublishIcon className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Archive button (for published) */}
            {row.status === 'published' && (
              <button
                type="button"
                onClick={(e) => handleArchive(row, e)}
                className="p-1.5 rounded transition-colors"
                style={{ color: 'var(--color-ink-soft)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#B45309'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ink-soft)'}
                title="संग्रहित करें"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="w-4 h-4" />
                ) : (
                  <ArchiveIcon className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Delete button */}
            <button
              type="button"
              onClick={(e) => handleDeleteClick(row, e)}
              className="p-1.5 rounded transition-colors"
              style={{ color: 'var(--color-ink-soft)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#B91C1C'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ink-soft)'}
              title="हटाएँ"
              disabled={isLoading}
            >
              <DeleteIcon className="w-4 h-4" />
            </button>
          </div>
        );

      default:
        return row[column.key];
    }
  };

  // Status filter options
  const statusOptions = [
    { value: '', label: 'सभी स्थिति' },
    { value: 'draft', label: 'ड्राफ़्ट' },
    { value: 'published', label: 'प्रकाशित' },
    { value: 'archived', label: 'संग्रहित' },
  ];

  // Category filter options
  const categoryOptions = [
    { value: '', label: 'सभी श्रेणियाँ' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name })),
  ];

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return <AdminLoadingState message="कहानियाँ लोड हो रही हैं..." />;
    }

    if (error) {
      return (
        <AdminErrorState
          title="कहानियाँ लोड नहीं हो सकीं"
          message={error}
          onRetry={() => {
            setLoading(true);
            setError(null);
            loadData().finally(() => setLoading(false));
          }}
        />
      );
    }

    if (stories.length === 0) {
      // Check if filters are applied
      const hasFilters = statusFilter || categoryFilter;
      
      return (
        <AdminEmptyState
          icon={<StoryIcon className="w-full h-full" />}
          title={hasFilters ? 'कोई परिणाम नहीं' : 'कोई कहानी नहीं है'}
          description={
            hasFilters 
              ? 'चयनित फ़िल्टर के अनुसार कोई कहानी नहीं मिली। फ़िल्टर बदलकर देखें।'
              : 'अभी तक कोई कहानी नहीं बनाई गई है। नई कहानी बनाने के लिए "नई कहानी" बटन पर क्लिक करें।'
          }
          action={!hasFilters ? {
            label: 'नई कहानी बनाएँ',
            onClick: handleNewStory,
          } : undefined}
        />
      );
    }

    return (
      <AdminTable
        columns={columns}
        data={stories}
        renderCell={renderCell}
        onRowClick={handleEditStory}
      />
    );
  };

  return (
    <div>
      {/* Page Header */}
      <AdminPageHeader
        title="कहानियाँ"
        description="सभी कहानियों का प्रबंधन करें"
        action={{
          label: 'नई कहानी',
          onClick: handleNewStory,
          icon: <PlusIcon />,
        }}
      />

      {/* Filters */}
      <div 
        className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-lg"
        style={{ backgroundColor: 'var(--color-paper-light)' }}
      >
        <div className="w-full sm:w-48">
          <AdminSelect
            label=""
            name="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={statusOptions}
            placeholder="सभी स्थिति"
          />
        </div>
        <div className="w-full sm:w-48">
          <AdminSelect
            label=""
            name="categoryFilter"
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            options={categoryOptions}
            placeholder="सभी श्रेणियाँ"
          />
        </div>
        {/* Results count */}
        {!loading && !error && (
          <div 
            className="flex items-center ml-auto font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            {stories.length} कहान{stories.length !== 1 ? 'ियाँ' : 'ी'}
          </div>
        )}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="कहानी हटाएँ?"
        message={`क्या आप "${deleteTarget?.title}" कहानी को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`}
        confirmLabel="हटाएँ"
        cancelLabel="रद्द करें"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

/* ============================================
   Icon Components
   ============================================ */

function PlusIcon() {
  return (
    <svg 
      className="w-4 h-4" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
      />
    </svg>
  );
}

function DeleteIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
      />
    </svg>
  );
}

function PublishIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
}

function ArchiveIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" 
      />
    </svg>
  );
}

function StarIcon({ className, style }) {
  return (
    <svg 
      className={className} 
      style={style}
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StoryIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1}
      style={{ color: 'var(--color-muted)' }}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
      />
    </svg>
  );
}

function LoadingSpinner({ className }) {
  return (
    <svg 
      className={`animate-spin ${className}`}
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
