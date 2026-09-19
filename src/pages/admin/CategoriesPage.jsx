import { useState, useEffect, useCallback } from 'react';
import {
  AdminPageHeader,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminTable,
  AdminEmptyState,
  AdminLoadingState,
  AdminErrorState,
  AdminConfirmDialog,
} from '../../components/admin';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  isSlugAvailable,
} from '../../services/categoryService';
import { ServiceErrorCode } from '../../services/serviceErrors';

/**
 * CategoriesPage - Admin categories management page
 * 
 * Features:
 * - List all categories with type indicator
 * - Create new category
 * - Edit existing category
 * - Delete category with confirmation
 * - Hindi-first UI
 * 
 * Route: /admin/categories
 */
export default function CategoriesPage() {
  // List state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load categories
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err.message || 'श्रेणियाँ लोड नहीं हो सकीं।');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listCategories();
        if (mounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        if (mounted) {
          setError(err.message || 'श्रेणियाँ लोड नहीं हो सकीं।');
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
  }, []);

  // Open form for new category
  const handleNewCategory = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  // Handle form save
  const handleSaveCategory = async (savedCategory) => {
    // Refresh the list after save
    if (editingCategory) {
      // Update in list
      setCategories(prev => 
        prev.map(c => c.id === savedCategory.id ? savedCategory : c)
      );
    } else {
      // Add to list
      setCategories(prev => [...prev, savedCategory]);
    }
    handleCloseForm();
  };

  // Open delete confirmation
  const handleDeleteClick = (category) => {
    setDeleteTarget(category);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      // Remove from list
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert(err.message || 'श्रेणी हटाई नहीं जा सकी।');
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  // Table columns
  const columns = [
    { key: 'name', header: 'नाम', width: '25%' },
    { key: 'slug', header: 'Slug', width: '20%' },
    { key: 'type', header: 'प्रकार', width: '15%' },
    { key: 'description', header: 'विवरण', width: '25%' },
    { key: 'actions', header: 'क्रियाएँ', width: '15%', align: 'right' },
  ];

  // Type label mapping
  const typeLabels = {
    poem: 'कविता',
    story: 'कहानी',
    both: 'दोनों',
  };

  // Render cell content
  const renderCell = (row, column) => {
    switch (column.key) {
      case 'name':
        return (
          <span className="font-medium" style={{ color: 'var(--color-ink)' }}>
            {row.name}
          </span>
        );
      case 'slug':
        return (
          <code 
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ 
              backgroundColor: 'var(--color-paper-deep)',
              color: 'var(--color-ink-soft)'
            }}
          >
            {row.slug}
          </code>
        );
      case 'type':
        return (
          <span 
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: 'var(--color-paper-deep)',
              color: 'var(--color-ink-soft)'
            }}
          >
            {typeLabels[row.type] || row.type}
          </span>
        );
      case 'description':
        return (
          <span 
            className="text-sm truncate block max-w-[200px]"
            style={{ color: 'var(--color-muted)' }}
            title={row.description || ''}
          >
            {row.description || '—'}
          </span>
        );
      case 'actions':
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEditCategory(row);
              }}
              className="p-1.5 rounded transition-colors"
              style={{ color: 'var(--color-ink-soft)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-maroon)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ink-soft)'}
              title="संपादित करें"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(row);
              }}
              className="p-1.5 rounded transition-colors"
              style={{ color: 'var(--color-ink-soft)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#B91C1C'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ink-soft)'}
              title="हटाएँ"
            >
              <DeleteIcon className="w-4 h-4" />
            </button>
          </div>
        );
      default:
        return row[column.key];
    }
  };

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return <AdminLoadingState message="श्रेणियाँ लोड हो रही हैं..." />;
    }

    if (error) {
      return (
        <AdminErrorState
          title="श्रेणियाँ लोड नहीं हो सकीं"
          message={error}
          onRetry={loadCategories}
        />
      );
    }

    if (categories.length === 0) {
      return (
        <AdminEmptyState
          icon={<CategoryIcon className="w-full h-full" />}
          title="कोई श्रेणी नहीं है"
          description="अभी तक कोई श्रेणी नहीं बनाई गई है। नई श्रेणी बनाने के लिए 'नई श्रेणी' बटन पर क्लिक करें।"
          action={{
            label: 'नई श्रेणी बनाएँ',
            onClick: handleNewCategory,
          }}
        />
      );
    }

    return (
      <AdminTable
        columns={columns}
        data={categories}
        renderCell={renderCell}
        onRowClick={handleEditCategory}
      />
    );
  };

  return (
    <div>
      {/* Page Header */}
      <AdminPageHeader
        title="श्रेणियाँ"
        description="कविताओं और कहानियों की श्रेणियाँ प्रबंधित करें"
        action={{
          label: 'नई श्रेणी',
          onClick: handleNewCategory,
          icon: <PlusIcon />,
        }}
      />

      {/* Content */}
      {renderContent()}

      {/* Category Form Modal */}
      {isFormOpen && (
        <CategoryFormModal
          category={editingCategory}
          onClose={handleCloseForm}
          onSave={handleSaveCategory}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="श्रेणी हटाएँ?"
        message={`क्या आप "${deleteTarget?.name}" श्रेणी को हटाना चाहते हैं? इस श्रेणी से जुड़ी कविताएँ और कहानियाँ बिना श्रेणी के रह जाएँगी।`}
        confirmLabel="हटाएँ"
        cancelLabel="रद्द करें"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

/**
 * CategoryFormModal - Modal form for creating/editing categories
 */
function CategoryFormModal({ category, onClose, onSave }) {
  const isEditing = !!category;

  // Form state
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    type: category?.type || 'both',
    description: category?.description || '',
    display_order: category?.display_order ?? '',
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Slug generation flag
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-generate slug from name (for new categories)
    if (name === 'name' && autoSlug) {
      const generatedSlug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }

    // If user manually edits slug, stop auto-generation
    if (name === 'slug') {
      setAutoSlug(false);
    }
  };

  // Generate slug from Hindi name (transliterate to basic latin)
  const generateSlug = (text) => {
    if (!text) return '';
    // Simple slug: lowercase, replace spaces with hyphens, remove non-alphanumeric
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Validate form
  const validateForm = async () => {
    const newErrors = {};

    // Name required
    if (!formData.name.trim()) {
      newErrors.name = 'श्रेणी का नाम आवश्यक है।';
    }

    // Slug required and format
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug आवश्यक है।';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug में केवल lowercase अक्षर, संख्याएँ और हाइफ़न हो सकते हैं।';
    } else {
      // Check slug uniqueness
      try {
        const available = await isSlugAvailable(formData.slug, category?.id);
        if (!available) {
          newErrors.slug = 'यह slug पहले से उपयोग में है।';
        }
      } catch (err) {
        console.error('Slug check failed:', err);
        newErrors.slug = 'Slug जाँच में त्रुटि।';
      }
    }

    // Type required
    if (!formData.type) {
      newErrors.type = 'प्रकार चुनें।';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validate
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase(),
        type: formData.type,
        description: formData.description.trim() || null,
        display_order: formData.display_order !== '' 
          ? parseInt(formData.display_order, 10) 
          : null,
      };

      let savedCategory;
      if (isEditing) {
        savedCategory = await updateCategory(category.id, categoryData);
      } else {
        savedCategory = await createCategory(categoryData);
      }

      onSave(savedCategory);
    } catch (err) {
      console.error('Failed to save category:', err);
      
      // Handle specific errors
      if (err.code === ServiceErrorCode.DUPLICATE_SLUG) {
        setErrors(prev => ({ ...prev, slug: 'यह slug पहले से उपयोग में है।' }));
      } else if (err.code === ServiceErrorCode.FORBIDDEN) {
        setSubmitError('आपके पास यह कार्य करने की अनुमति नहीं है।');
      } else {
        setSubmitError(err.message || 'श्रेणी सहेजी नहीं जा सकी।');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Type options
  const typeOptions = [
    { value: 'poem', label: 'केवल कविता' },
    { value: 'story', label: 'केवल कहानी' },
    { value: 'both', label: 'दोनों (कविता और कहानी)' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-lg rounded-lg shadow-lg overflow-hidden"
        style={{ backgroundColor: 'var(--color-paper-light)' }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 
            id="category-form-title"
            className="font-literary text-lg font-semibold"
            style={{ color: 'var(--color-ink)' }}
          >
            {isEditing ? 'श्रेणी संपादित करें' : 'नई श्रेणी'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--color-muted)' }}
            aria-label="बंद करें"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Name */}
            <AdminInput
              label="नाम"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="जैसे: प्रकृति, प्रेम, जीवन"
              required
              error={errors.name}
              helpText="श्रेणी का हिंदी नाम"
            />

            {/* Slug */}
            <AdminInput
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="जैसे: prakriti, prem, jeevan"
              required
              error={errors.slug}
              helpText="URL में उपयोग होगा (केवल lowercase अक्षर, संख्याएँ, हाइफ़न)"
            />

            {/* Type */}
            <AdminSelect
              label="प्रकार"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={typeOptions}
              required
              error={errors.type}
              helpText="यह श्रेणी किस प्रकार की सामग्री के लिए है"
            />

            {/* Description */}
            <AdminTextarea
              label="विवरण"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="इस श्रेणी का संक्षिप्त विवरण (वैकल्पिक)"
              rows={3}
              helpText="वैकल्पिक"
            />

            {/* Display Order */}
            <AdminInput
              label="क्रम संख्या"
              name="display_order"
              type="number"
              value={formData.display_order}
              onChange={handleChange}
              placeholder="जैसे: 1, 2, 3"
              helpText="छोटी संख्या पहले दिखेगी (वैकल्पिक)"
            />

            {/* Submit Error */}
            {submitError && (
              <div 
                className="p-3 rounded-md text-sm"
                style={{ 
                  backgroundColor: 'rgba(185, 28, 28, 0.1)',
                  color: '#B91C1C'
                }}
                role="alert"
              >
                {submitError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div 
            className="px-6 py-4 border-t flex justify-end gap-3"
            style={{ 
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-paper-deep)'
            }}
          >
            <AdminButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              रद्द करें
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              loading={isSubmitting}
            >
              {isEditing ? 'सहेजें' : 'बनाएँ'}
            </AdminButton>
          </div>
        </form>
      </div>
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

function CategoryIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={1}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" 
      />
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M6 6h.008v.008H6V6z" 
      />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
