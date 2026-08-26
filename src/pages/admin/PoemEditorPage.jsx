import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  AdminPageHeader,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  SlugInput,
  ContentEditor,
  ImageUploader,
  AdminLoadingState,
  AdminErrorState,
  AdminConfirmDialog,
} from '../../components/admin';
import {
  getPoemById,
  createPoem,
  updatePoem,
  deletePoem,
  publishPoem,
  archivePoem,
  isSlugAvailable,
} from '../../services/poemService';
import { listCategories } from '../../services/categoryService';
import { ServiceErrorCode } from '../../services/serviceErrors';

/**
 * PoemEditorPage - Create/Edit poem page
 * 
 * Features:
 * - Create new poems (route: /admin/poems/new)
 * - Edit existing poems (route: /admin/poems/:id/edit)
 * - All CRUD through poemService
 * - Status transitions: save as draft, publish, archive
 * - Form validation with Hindi error messages
 * - Slug validation and uniqueness checking
 * - Preserve line breaks in content
 * - Manuscript image upload
 * - Hindi-first UI
 * 
 * Routes:
 * - /admin/poems/new (create)
 * - /admin/poems/:id/edit (edit)
 */
export default function PoemEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Page state
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    subtitle: '',
    excerpt: '',
    category_id: '',
    written_date: '',
    reading_time: '',
    featured: false,
    display_order: '',
    manuscript_url: '',
    status: 'draft',
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load poem data and categories
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load categories
        const categoriesData = await listCategories({ type: 'poem' });
        if (mounted) {
          setCategories(categoriesData);
        }

        // Load poem if editing
        if (isEditing && id) {
          const poemData = await getPoemById(id);
          if (mounted) {
            setFormData({
              title: poemData.title || '',
              slug: poemData.slug || '',
              content: poemData.content || '',
              subtitle: poemData.subtitle || '',
              excerpt: poemData.excerpt || '',
              category_id: poemData.category_id || '',
              written_date: poemData.written_date || '',
              reading_time: poemData.reading_time ?? '',
              featured: poemData.featured || false,
              display_order: poemData.display_order ?? '',
              manuscript_url: poemData.manuscript_url || '',
              status: poemData.status || 'draft',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        if (mounted) {
          setError(err.message || 'डेटा लोड नहीं हो सका।');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [id, isEditing]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle slug change (from SlugInput)
  const handleSlugChange = (value) => {
    setFormData(prev => ({ ...prev, slug: value }));
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: '' }));
    }
  };

  // Handle content change (from ContentEditor)
  const handleContentChange = (e) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };

  // Handle manuscript URL change (from ImageUploader)
  const handleManuscriptChange = (url) => {
    setFormData(prev => ({ ...prev, manuscript_url: url || '' }));
  };

  // Check slug availability (excluding current poem when editing)
  const checkSlugAvailability = useCallback(async (slug) => {
    try {
      return await isSlugAvailable(slug, isEditing ? id : undefined);
    } catch {
      return true; // Assume available on error
    }
  }, [isEditing, id]);

  // Validate form
  const validateForm = async () => {
    const newErrors = {};

    // Title required
    if (!formData.title.trim()) {
      newErrors.title = 'कविता का शीर्षक आवश्यक है।';
    }

    // Slug required and format
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug आवश्यक है।';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug में केवल lowercase अक्षर, संख्याएँ और हाइफ़न हो सकते हैं।';
    } else {
      // Check uniqueness
      const available = await checkSlugAvailability(formData.slug);
      if (!available) {
        newErrors.slug = 'यह slug पहले से उपयोग में है।';
      }
    }

    // Content required
    if (!formData.content.trim()) {
      newErrors.content = 'कविता का पाठ आवश्यक है।';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build poem data for API
  const buildPoemData = () => {
    return {
      title: formData.title.trim(),
      slug: formData.slug.trim().toLowerCase(),
      content: formData.content, // Preserve line breaks - don't trim
      subtitle: formData.subtitle.trim() || null,
      excerpt: formData.excerpt.trim() || null,
      category_id: formData.category_id || null,
      written_date: formData.written_date || null,
      reading_time: formData.reading_time !== '' 
        ? parseInt(formData.reading_time, 10) 
        : null,
      featured: formData.featured,
      display_order: formData.display_order !== '' 
        ? parseInt(formData.display_order, 10) 
        : null,
      manuscript_url: formData.manuscript_url || null,
    };
  };

  // Save as draft
  const handleSaveDraft = async () => {
    setSubmitError('');
    
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const poemData = buildPoemData();

      if (isEditing) {
        await updatePoem(id, poemData);
      } else {
        await createPoem(poemData);
      }

      navigate('/admin/poems');
    } catch (err) {
      console.error('Failed to save poem:', err);
      handleSubmitError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save and publish
  const handlePublish = async () => {
    setSubmitError('');
    
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const poemData = buildPoemData();

      let savedPoem;
      if (isEditing) {
        savedPoem = await updatePoem(id, poemData);
        if (savedPoem.status !== 'published') {
          await publishPoem(savedPoem.id);
        }
      } else {
        savedPoem = await createPoem(poemData);
        await publishPoem(savedPoem.id);
      }

      navigate('/admin/poems');
    } catch (err) {
      console.error('Failed to publish poem:', err);
      handleSubmitError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Archive poem
  const handleArchive = async () => {
    if (!isEditing || !id) return;

    setIsSubmitting(true);
    try {
      await archivePoem(id);
      navigate('/admin/poems');
    } catch (err) {
      console.error('Failed to archive poem:', err);
      handleSubmitError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete poem
  const handleDelete = async () => {
    if (!isEditing || !id) return;

    setIsDeleting(true);
    try {
      await deletePoem(id);
      navigate('/admin/poems');
    } catch (err) {
      console.error('Failed to delete poem:', err);
      setSubmitError(err.message || 'कविता हटाई नहीं जा सकी।');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Handle submit errors
  const handleSubmitError = (err) => {
    if (err.code === ServiceErrorCode.DUPLICATE_SLUG) {
      setErrors(prev => ({ ...prev, slug: 'यह slug पहले से उपयोग में है।' }));
    } else if (err.code === ServiceErrorCode.FORBIDDEN) {
      setSubmitError('आपके पास यह कार्य करने की अनुमति नहीं है।');
    } else if (err.code === ServiceErrorCode.VALIDATION_ERROR) {
      setSubmitError(err.message);
    } else {
      setSubmitError(err.message || 'कविता सहेजी नहीं जा सकी।');
    }
  };

  // Category options
  const categoryOptions = [
    { value: '', label: 'कोई श्रेणी नहीं' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name })),
  ];

  // Loading state
  if (loading) {
    return (
      <div>
        <BackLink />
        <AdminLoadingState message="लोड हो रहा है..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <BackLink />
        <AdminErrorState
          title="डेटा लोड नहीं हो सका"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <BackLink />

      {/* Page Header */}
      <AdminPageHeader
        title={isEditing ? 'कविता संपादित करें' : 'नई कविता'}
        description={isEditing ? `ID: ${id}` : 'एक नई कविता बनाएँ'}
      />

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div 
          className="rounded-lg border p-6 space-y-6"
          style={{ 
            backgroundColor: 'var(--color-paper-light)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Submit Error */}
          {submitError && (
            <div 
              className="p-4 rounded-md"
              style={{ 
                backgroundColor: 'rgba(185, 28, 28, 0.1)',
                color: '#B91C1C'
              }}
              role="alert"
            >
              {submitError}
            </div>
          )}

          {/* Basic Info Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <AdminInput
              label="शीर्षक"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="कविता का शीर्षक"
              required
              error={errors.title}
            />

            {/* Subtitle */}
            <AdminInput
              label="उपशीर्षक"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="वैकल्पिक उपशीर्षक"
              helpText="वैकल्पिक"
            />
          </div>

          {/* Slug */}
          <SlugInput
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleSlugChange}
            title={formData.title}
            onCheckAvailability={checkSlugAvailability}
            error={errors.slug}
            required
          />

          {/* Content */}
          <ContentEditor
            label="पाठ"
            name="content"
            value={formData.content}
            onChange={handleContentChange}
            placeholder="कविता का पूरा पाठ यहाँ लिखें...

हर पंक्ति के बीच
की जगह संरक्षित रहेगी।

जैसे इस कविता में है।"
            error={errors.content}
            required
            rows={16}
          />

          {/* Excerpt */}
          <AdminTextarea
            label="सारांश"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="कविता का संक्षिप्त सारांश (सूची में दिखेगा)"
            rows={3}
            helpText="वैकल्पिक - सूची पृष्ठ पर दिखाया जाएगा"
          />

          {/* Metadata Section */}
          <div 
            className="pt-6 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <h3 
              className="font-body text-sm font-medium mb-4"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              अतिरिक्त जानकारी
            </h3>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Category */}
              <AdminSelect
                label="श्रेणी"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                options={categoryOptions}
                helpText="वैकल्पिक"
              />

              {/* Written Date */}
              <AdminInput
                label="लिखने की तिथि"
                name="written_date"
                type="date"
                value={formData.written_date}
                onChange={handleChange}
                helpText="वैकल्पिक - मूल रचना तिथि"
              />

              {/* Reading Time */}
              <AdminInput
                label="पढ़ने का समय (मिनट)"
                name="reading_time"
                type="number"
                value={formData.reading_time}
                onChange={handleChange}
                placeholder="जैसे: 2"
                min="1"
                helpText="वैकल्पिक"
              />
            </div>
          </div>

          {/* Featured Section */}
          <div 
            className="pt-6 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <h3 
              className="font-body text-sm font-medium mb-4"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              मुखपृष्ठ सेटिंग्स
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Featured Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    borderColor: 'var(--color-border)',
                    accentColor: 'var(--color-maroon)',
                  }}
                />
                <span 
                  className="font-body text-sm"
                  style={{ color: 'var(--color-ink)' }}
                >
                  मुखपृष्ठ पर दिखाएँ
                </span>
              </label>

              {/* Display Order (only shown if featured) */}
              {formData.featured && (
                <AdminInput
                  label="क्रम संख्या"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleChange}
                  placeholder="जैसे: 1, 2, 3"
                  min="1"
                  helpText="छोटी संख्या पहले दिखेगी"
                />
              )}
            </div>
          </div>

          {/* Manuscript Upload Section */}
          <div 
            className="pt-6 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <h3 
              className="font-body text-sm font-medium mb-4"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              पांडुलिपि छवि
            </h3>

            <ImageUploader
              label="पांडुलिपि अपलोड करें"
              name="manuscript"
              slug={formData.slug}
              value={formData.manuscript_url}
              onChange={handleManuscriptChange}
              type="poem"
              helpText="मूल हस्तलिखित पांडुलिपि की स्कैन छवि (वैकल्पिक)"
            />
          </div>

          {/* Actions Section */}
          <div 
            className="pt-6 border-t flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Left side - delete button for existing poems */}
            <div>
              {isEditing && (
                <AdminButton
                  type="button"
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSubmitting}
                >
                  हटाएँ
                </AdminButton>
              )}
            </div>

            {/* Right side - save/publish actions */}
            <div className="flex flex-wrap gap-3 sm:justify-end">
              {/* Cancel */}
              <AdminButton
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/poems')}
                disabled={isSubmitting}
              >
                रद्द करें
              </AdminButton>

              {/* Archive (only for published poems) */}
              {isEditing && formData.status === 'published' && (
                <AdminButton
                  type="button"
                  variant="secondary"
                  onClick={handleArchive}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  संग्रहित करें
                </AdminButton>
              )}

              {/* Save as Draft */}
              <AdminButton
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isEditing ? 'सहेजें' : 'ड्राफ़्ट सहेजें'}
              </AdminButton>

              {/* Publish */}
              <AdminButton
                type="button"
                variant="primary"
                onClick={handlePublish}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {formData.status === 'published' ? 'अपडेट करें' : 'प्रकाशित करें'}
              </AdminButton>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="कविता हटाएँ?"
        message={`क्या आप "${formData.title}" कविता को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`}
        confirmLabel="हटाएँ"
        cancelLabel="रद्द करें"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

/**
 * Back link component
 */
function BackLink() {
  return (
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
  );
}
