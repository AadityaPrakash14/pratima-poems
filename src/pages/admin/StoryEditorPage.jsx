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
  AdminFileUpload,
  AdminLoadingState,
  AdminErrorState,
  AdminConfirmDialog,
} from '../../components/admin';
import {
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  publishStory,
  archiveStory,
  isSlugAvailable,
} from '../../services/storyService';
import { listCategories } from '../../services/categoryService';
import {
  uploadCoverImage,
  replaceCoverImage,
  uploadStoryManuscript,
  replaceStoryManuscript,
  BUCKETS,
  ALLOWED_TYPES,
  SIZE_LIMITS,
  SIZE_LIMITS_READABLE,
  getAcceptString,
  getPublicUrl,
} from '../../services/storageService';
import { ServiceErrorCode } from '../../services/serviceErrors';

/**
 * StoryEditorPage - Create/Edit story page
 * 
 * Features:
 * - Create new stories (route: /admin/stories/new)
 * - Edit existing stories (route: /admin/stories/:id/edit)
 * - All CRUD through storyService
 * - Status transitions: save as draft, publish, archive
 * - Form validation with Hindi error messages
 * - Slug validation and uniqueness checking
 * - Preserve line breaks in content
 * - Cover image upload (via storageService)
 * - Manuscript image upload (via storageService)
 * - Hindi-first UI
 * 
 * Routes:
 * - /admin/stories/new (create)
 * - /admin/stories/:id/edit (edit)
 */
export default function StoryEditorPage() {
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
    cover_url: '',
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

  // Cover image upload state
  const [coverFile, setCoverFile] = useState(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [coverUploadError, setCoverUploadError] = useState('');

  // Manuscript upload state
  const [manuscriptFile, setManuscriptFile] = useState(null);
  const [manuscriptUploading, setManuscriptUploading] = useState(false);
  const [manuscriptUploadProgress, setManuscriptUploadProgress] = useState(0);
  const [manuscriptUploadError, setManuscriptUploadError] = useState('');

  // Load story data and categories
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load categories
        const categoriesData = await listCategories({ type: 'story' });
        if (mounted) {
          setCategories(categoriesData);
        }

        // Load story if editing
        if (isEditing && id) {
          const storyData = await getStoryById(id);
          if (mounted) {
            setFormData({
              title: storyData.title || '',
              slug: storyData.slug || '',
              content: storyData.content || '',
              subtitle: storyData.subtitle || '',
              excerpt: storyData.excerpt || '',
              cover_url: storyData.cover_url || '',
              category_id: storyData.category_id || '',
              written_date: storyData.written_date || '',
              reading_time: storyData.reading_time ?? '',
              featured: storyData.featured || false,
              display_order: storyData.display_order ?? '',
              manuscript_url: storyData.manuscript_url || '',
              status: storyData.status || 'draft',
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

  // Check slug availability (excluding current story when editing)
  const checkSlugAvailability = useCallback(async (slug) => {
    try {
      return await isSlugAvailable(slug, isEditing ? id : undefined);
    } catch {
      return true; // Assume available on error
    }
  }, [isEditing, id]);

  // ============================================
  // COVER IMAGE UPLOAD HANDLERS
  // ============================================

  const getCoverPreviewUrl = useCallback(() => {
    if (coverFile) {
      return URL.createObjectURL(coverFile);
    }
    if (formData.cover_url) {
      if (formData.cover_url.startsWith('http')) {
        return formData.cover_url;
      }
      return getPublicUrl(BUCKETS.COVERS, formData.cover_url);
    }
    return null;
  }, [coverFile, formData.cover_url]);

  const handleCoverFileSelect = (file) => {
    setCoverFile(file);
    setCoverUploadError('');
    
    if (!file) {
      setFormData(prev => ({ ...prev, cover_url: '' }));
    }
  };

  const handleCoverUpload = useCallback(async (file) => {
    if (!file) return;

    if (!formData.slug?.trim()) {
      setCoverUploadError('कृपया पहले slug दर्ज करें।');
      return;
    }

    setCoverUploading(true);
    setCoverUploadProgress(0);
    setCoverUploadError('');

    try {
      const progressInterval = setInterval(() => {
        setCoverUploadProgress(prev => Math.min(prev + 20, 80));
      }, 200);

      let result;
      if (formData.cover_url) {
        result = await replaceCoverImage(file, formData.slug, formData.cover_url);
      } else {
        result = await uploadCoverImage(file, formData.slug);
      }

      clearInterval(progressInterval);
      setCoverUploadProgress(100);

      setFormData(prev => ({ ...prev, cover_url: result.publicUrl }));
      setCoverFile(null);

      setTimeout(() => setCoverUploadProgress(0), 500);
    } catch (err) {
      console.error('Cover upload failed:', err);
      setCoverUploadError(err.message || 'अपलोड विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setCoverUploading(false);
    }
  }, [formData.slug, formData.cover_url]);

  const handleCoverRemove = () => {
    setCoverFile(null);
    setCoverUploadError('');
    setFormData(prev => ({ ...prev, cover_url: '' }));
  };

  // ============================================
  // MANUSCRIPT UPLOAD HANDLERS
  // ============================================

  const getManuscriptPreviewUrl = useCallback(() => {
    if (manuscriptFile) {
      return URL.createObjectURL(manuscriptFile);
    }
    if (formData.manuscript_url) {
      if (formData.manuscript_url.startsWith('http')) {
        return formData.manuscript_url;
      }
      return getPublicUrl(BUCKETS.MANUSCRIPTS, formData.manuscript_url);
    }
    return null;
  }, [manuscriptFile, formData.manuscript_url]);

  const handleManuscriptFileSelect = (file) => {
    setManuscriptFile(file);
    setManuscriptUploadError('');
    
    if (!file) {
      setFormData(prev => ({ ...prev, manuscript_url: '' }));
    }
  };

  const handleManuscriptUpload = useCallback(async (file) => {
    if (!file) return;

    if (!formData.slug?.trim()) {
      setManuscriptUploadError('कृपया पहले slug दर्ज करें।');
      return;
    }

    setManuscriptUploading(true);
    setManuscriptUploadProgress(0);
    setManuscriptUploadError('');

    try {
      const progressInterval = setInterval(() => {
        setManuscriptUploadProgress(prev => Math.min(prev + 20, 80));
      }, 200);

      let result;
      if (formData.manuscript_url) {
        result = await replaceStoryManuscript(file, formData.slug, formData.manuscript_url);
      } else {
        result = await uploadStoryManuscript(file, formData.slug);
      }

      clearInterval(progressInterval);
      setManuscriptUploadProgress(100);

      setFormData(prev => ({ ...prev, manuscript_url: result.publicUrl }));
      setManuscriptFile(null);

      setTimeout(() => setManuscriptUploadProgress(0), 500);
    } catch (err) {
      console.error('Manuscript upload failed:', err);
      setManuscriptUploadError(err.message || 'अपलोड विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setManuscriptUploading(false);
    }
  }, [formData.slug, formData.manuscript_url]);

  const handleManuscriptRemove = () => {
    setManuscriptFile(null);
    setManuscriptUploadError('');
    setFormData(prev => ({ ...prev, manuscript_url: '' }));
  };

  // Validate form
  const validateForm = async () => {
    const newErrors = {};

    // Title required
    if (!formData.title.trim()) {
      newErrors.title = 'कहानी का शीर्षक आवश्यक है।';
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
      newErrors.content = 'कहानी का पाठ आवश्यक है।';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build story data for API
  const buildStoryData = () => {
    return {
      title: formData.title.trim(),
      slug: formData.slug.trim().toLowerCase(),
      content: formData.content, // Preserve line breaks - don't trim
      subtitle: formData.subtitle.trim() || null,
      excerpt: formData.excerpt.trim() || null,
      cover_url: formData.cover_url || null,
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
      const storyData = buildStoryData();

      if (isEditing) {
        await updateStory(id, storyData);
      } else {
        await createStory(storyData);
      }

      navigate('/admin/stories');
    } catch (err) {
      console.error('Failed to save story:', err);
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
      const storyData = buildStoryData();

      let savedStory;
      if (isEditing) {
        savedStory = await updateStory(id, storyData);
        if (savedStory.status !== 'published') {
          await publishStory(savedStory.id);
        }
      } else {
        savedStory = await createStory(storyData);
        await publishStory(savedStory.id);
      }

      navigate('/admin/stories');
    } catch (err) {
      console.error('Failed to publish story:', err);
      handleSubmitError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Archive story
  const handleArchive = async () => {
    if (!isEditing || !id) return;

    setIsSubmitting(true);
    try {
      await archiveStory(id);
      navigate('/admin/stories');
    } catch (err) {
      console.error('Failed to archive story:', err);
      handleSubmitError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete story
  const handleDelete = async () => {
    if (!isEditing || !id) return;

    setIsDeleting(true);
    try {
      await deleteStory(id);
      navigate('/admin/stories');
    } catch (err) {
      console.error('Failed to delete story:', err);
      setSubmitError(err.message || 'कहानी हटाई नहीं जा सकी।');
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
      setSubmitError(err.message || 'कहानी सहेजी नहीं जा सकी।');
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

  // Bucket configurations for file uploads
  const coverBucket = BUCKETS.COVERS;
  const coverAcceptString = getAcceptString(coverBucket);
  const coverMaxSize = SIZE_LIMITS[coverBucket];
  const coverMaxSizeLabel = SIZE_LIMITS_READABLE[coverBucket];
  const coverAllowedTypes = ALLOWED_TYPES[coverBucket]
    .map(t => t.split('/')[1].toUpperCase())
    .join(', ');

  const manuscriptBucket = BUCKETS.MANUSCRIPTS;
  const manuscriptAcceptString = getAcceptString(manuscriptBucket);
  const manuscriptMaxSize = SIZE_LIMITS[manuscriptBucket];
  const manuscriptMaxSizeLabel = SIZE_LIMITS_READABLE[manuscriptBucket];
  const manuscriptAllowedTypes = ALLOWED_TYPES[manuscriptBucket]
    .map(t => t.split('/')[1].toUpperCase())
    .join(', ');

  return (
    <div>
      {/* Back link */}
      <BackLink />

      {/* Page Header */}
      <AdminPageHeader
        title={isEditing ? 'कहानी संपादित करें' : 'नई कहानी'}
        description={isEditing ? `ID: ${id}` : 'एक नई कहानी बनाएँ'}
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
              placeholder="कहानी का शीर्षक"
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
            placeholder="कहानी का पूरा पाठ यहाँ लिखें...

हर पंक्ति के बीच
की जगह संरक्षित रहेगी।"
            error={errors.content}
            required
            rows={20}
          />

          {/* Excerpt */}
          <AdminTextarea
            label="सारांश"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="कहानी का संक्षिप्त सारांश (सूची में दिखेगा)"
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
                placeholder="जैसे: 10"
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

          {/* Cover Image Upload Section */}
          <div 
            className="pt-6 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <h3 
              className="font-body text-sm font-medium mb-4"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              कवर चित्र
            </h3>

            <div className="space-y-2">
              <AdminFileUpload
                name="cover"
                accept={coverAcceptString}
                maxSize={coverMaxSize}
                maxSizeLabel={coverMaxSizeLabel}
                value={coverFile}
                onChange={handleCoverFileSelect}
                onUpload={handleCoverUpload}
                currentPreviewUrl={getCoverPreviewUrl()}
                error={coverUploadError}
                uploading={coverUploading}
                uploadProgress={coverUploadProgress}
                helpText={`${coverAllowedTypes} फ़ाइलें स्वीकृत। अधिकतम आकार: ${coverMaxSizeLabel}`}
              />

              {/* Slug requirement warning */}
              {!formData.slug?.trim() && (
                <p 
                  className="font-body text-xs"
                  style={{ color: 'var(--color-muted)' }}
                >
                  ℹ️ फ़ाइल अपलोड करने से पहले slug दर्ज करना आवश्यक है।
                </p>
              )}

              {/* Show current file path if exists */}
              {formData.cover_url && !coverUploading && (
                <div className="flex items-center justify-between gap-2">
                  <code 
                    className="flex-1 text-xs px-2 py-1 rounded truncate"
                    style={{ 
                      backgroundColor: 'var(--color-paper-deep)',
                      color: 'var(--color-muted)'
                    }}
                    title={formData.cover_url}
                  >
                    {formData.cover_url}
                  </code>
                  <button
                    type="button"
                    onClick={handleCoverRemove}
                    className="text-xs px-2 py-1 rounded transition-colors"
                    style={{ 
                      color: '#B91C1C',
                      backgroundColor: 'rgba(185, 28, 28, 0.1)',
                    }}
                  >
                    हटाएँ
                  </button>
                </div>
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

            <div className="space-y-2">
              <AdminFileUpload
                name="manuscript"
                accept={manuscriptAcceptString}
                maxSize={manuscriptMaxSize}
                maxSizeLabel={manuscriptMaxSizeLabel}
                value={manuscriptFile}
                onChange={handleManuscriptFileSelect}
                onUpload={handleManuscriptUpload}
                currentPreviewUrl={getManuscriptPreviewUrl()}
                error={manuscriptUploadError}
                uploading={manuscriptUploading}
                uploadProgress={manuscriptUploadProgress}
                helpText={`${manuscriptAllowedTypes} फ़ाइलें स्वीकृत। अधिकतम आकार: ${manuscriptMaxSizeLabel} (वैकल्पिक)`}
              />

              {/* Slug requirement warning */}
              {!formData.slug?.trim() && (
                <p 
                  className="font-body text-xs"
                  style={{ color: 'var(--color-muted)' }}
                >
                  ℹ️ फ़ाइल अपलोड करने से पहले slug दर्ज करना आवश्यक है।
                </p>
              )}

              {/* Show current file path if exists */}
              {formData.manuscript_url && !manuscriptUploading && (
                <div className="flex items-center justify-between gap-2">
                  <code 
                    className="flex-1 text-xs px-2 py-1 rounded truncate"
                    style={{ 
                      backgroundColor: 'var(--color-paper-deep)',
                      color: 'var(--color-muted)'
                    }}
                    title={formData.manuscript_url}
                  >
                    {formData.manuscript_url}
                  </code>
                  <button
                    type="button"
                    onClick={handleManuscriptRemove}
                    className="text-xs px-2 py-1 rounded transition-colors"
                    style={{ 
                      color: '#B91C1C',
                      backgroundColor: 'rgba(185, 28, 28, 0.1)',
                    }}
                  >
                    हटाएँ
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div 
            className="pt-6 border-t flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Left side - delete button for existing stories */}
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
                onClick={() => navigate('/admin/stories')}
                disabled={isSubmitting}
              >
                रद्द करें
              </AdminButton>

              {/* Archive (only for published stories) */}
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
        title="कहानी हटाएँ?"
        message={`क्या आप "${formData.title}" कहानी को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`}
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
      to="/admin/stories"
      className="inline-flex items-center gap-1 font-body text-sm mb-4 transition-colors"
      style={{ color: 'var(--color-maroon)' }}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      कहानियों पर वापस
    </Link>
  );
}
