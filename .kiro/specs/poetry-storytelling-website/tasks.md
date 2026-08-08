# Implementation Plan: Poetry & Storytelling Website

## Overview

This implementation plan builds a personal poetry and storytelling website using React 18+ with Vite, featuring a dark-themed reading experience, Supabase-powered engagement systems (likes and comments), and static content management. The implementation follows a mobile-first approach with Tailwind CSS and ensures WCAG 2.1 AA accessibility compliance.

## Tasks

- [x] 1. Project Setup and Core Infrastructure
  - [x] 1.1 Initialize Vite project with React and configure Tailwind CSS
    - Create Vite React project with TypeScript support
    - Install and configure Tailwind CSS with dark theme configuration
    - Set up custom color palette for elegant dark theme
    - Configure PostCSS and autoprefixer
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 1.2 Set up project directory structure and core types
    - Create directory structure: components/, pages/, layouts/, services/, hooks/, utils/, lib/, data/
    - Define TypeScript interfaces for Poem, Story, Comment, and AboutData
    - Create ContentType union type ('poem' | 'story')
    - _Requirements: 15.3, 15.4, 17.1, 17.2, 17.3_

  - [x] 1.3 Configure React Router with hash routing
    - Install React Router v6
    - Set up HashRouter for GitHub Pages compatibility
    - Define routes for Home, Poems, Stories, PoemDetail, StoryDetail, About, and 404
    - _Requirements: 1.1, 1.2, 1.6, 18.2_

  - [x] 1.4 Initialize Supabase client and environment configuration
    - Install Supabase JS client
    - Create lib/supabase.js with client initialization
    - Set up .env.local for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
    - Add .env.local to .gitignore
    - _Requirements: 16.1, 16.2, 16.3_

- [ ] 2. Utility Functions and Core Logic
  - [ ] 2.1 Implement reading time calculator utility
    - Create utils/readingTime.js with calculateReadingTime function
    - Calculate based on 200 words per minute average
    - Return minimum 1 minute for short content
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ]* 2.2 Write property test for reading time calculation
    - **Property 1: Reading Time Calculation Correctness**
    - **Validates: Requirements 11.1, 11.2, 11.3**

  - [ ] 2.3 Implement date formatting utility
    - Create utils/formatDate.js with date formatting functions
    - Support ISO date string to readable format conversion
    - Handle invalid date inputs gracefully
    - _Requirements: 3.2, 4.2, 5.2, 6.2_

  - [ ] 2.4 Implement input sanitization utility
    - Create utils/sanitize.js with sanitize function
    - Remove script tags, event handlers, and javascript: URLs
    - Preserve safe HTML content
    - _Requirements: 10.9_

  - [ ]* 2.5 Write property test for input sanitization
    - **Property 6: Input Sanitization Prevents Script Injection**
    - **Validates: Requirements 10.9**

  - [ ] 2.6 Implement chronological sorting utility
    - Create utils/sorting.js with sortByDateDescending function
    - Sort content arrays by publicationDate or created_at
    - Handle missing date fields gracefully
    - _Requirements: 3.5, 4.5, 10.6_

  - [ ]* 2.7 Write property test for chronological sorting
    - **Property 2: Chronological Sorting Preserves Order Invariant**
    - **Validates: Requirements 3.5, 4.5, 10.6**

  - [ ] 2.8 Implement tag filtering utility
    - Create utils/filtering.js with filterByTags function
    - Filter content arrays by tag inclusion
    - Return subset of matching items
    - _Requirements: 20.5_

  - [ ]* 2.9 Write property test for tag filtering
    - **Property 8: Tag Filtering Returns Only Matching Content**
    - **Validates: Requirements 20.5**

  - [ ] 2.10 Implement comment validation utility
    - Create utils/validation.js with validateComment function
    - Reject empty or whitespace-only author name or comment text
    - Return validation result object with isValid and error message
    - _Requirements: 10.4, 10.5_

  - [ ]* 2.11 Write property test for comment validation
    - **Property 5: Comment Validation Rejects Invalid Input**
    - **Validates: Requirements 10.4, 10.5**

- [ ] 3. Checkpoint - Verify utility functions
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Static Content and Data Layer
  - [ ] 4.1 Create static data files for poems and stories
    - Create data/poems.js with sample poem data array
    - Create data/stories.js with sample story data array
    - Include required fields: id, title, content, author, publicationDate
    - Add optional fields: tags, excerpt, featured, status
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [ ]* 4.2 Write property test for content data structure validation
    - **Property 7: Content Data Structure Validation**
    - **Validates: Requirements 15.3, 15.4**

  - [ ] 4.3 Create about page static data
    - Create data/about.js with author bio, profile image, and social links
    - Define socialLinks array with platform, url, and icon fields
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 4.4 Implement ContentService for data operations
    - Create services/contentService.js
    - Implement getAllPoems, getPoemById, getFeaturedPoems
    - Implement getAllStories, getStoryById, getFeaturedStories
    - Implement filterByTags helper integration
    - _Requirements: 15.1, 15.2, 20.3, 20.5_

  - [ ]* 4.5 Write unit tests for ContentService
    - Test getAllPoems returns all poems
    - Test getPoemById returns correct poem or null
    - Test getFeaturedPoems returns only featured items
    - _Requirements: 15.1, 15.2_

- [ ] 5. Supabase Services Layer
  - [ ] 5.1 Implement LikeService with Supabase integration
    - Create services/likeService.js
    - Implement getLikeCount, incrementLike, decrementLike
    - Implement localStorage helpers: isLiked, setLiked
    - Handle Supabase connection errors gracefully
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ] 5.2 Implement CommentService with Supabase integration
    - Create services/commentService.js
    - Implement getComments with chronological sorting
    - Implement addComment with sanitization
    - Handle Supabase connection errors gracefully
    - _Requirements: 10.2, 10.3, 10.6, 10.8_

  - [ ]* 5.3 Write integration tests for Supabase services
    - Test getLikeCount returns number or fallback
    - Test getComments returns array sorted by date
    - Test error handling for connection failures
    - _Requirements: 9.6, 10.8_

- [ ] 6. Custom React Hooks
  - [ ] 6.1 Implement useContent hook
    - Create hooks/useContent.js
    - Manage loading, data, and error states
    - Support fetching single item or list by type
    - _Requirements: 20.1, 20.6_

  - [ ] 6.2 Implement useLikes hook
    - Create hooks/useLikes.js
    - Manage like count, isLiked state, and toggleLike action
    - Implement optimistic updates with rollback on failure
    - Sync with localStorage for persistence
    - _Requirements: 9.5, 9.7_

  - [ ] 6.3 Implement useComments hook
    - Create hooks/useComments.js
    - Manage comments array, loading state, and submission errors
    - Implement addComment with validation integration
    - _Requirements: 10.1, 10.8_

  - [ ] 6.4 Implement useReadingTime hook
    - Create hooks/useReadingTime.js
    - Calculate and memoize reading time for content
    - _Requirements: 11.4_

- [ ] 7. Checkpoint - Verify data layer and hooks
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Common UI Components
  - [ ] 8.1 Implement LoadingSpinner component
    - Create components/common/LoadingSpinner.jsx
    - Support size props: small, medium, large
    - Include optional loading message
    - Apply dark theme styling
    - _Requirements: 14.6_

  - [ ] 8.2 Implement EmptyState component
    - Create components/common/EmptyState.jsx
    - Accept title, message, and optional icon props
    - Apply consistent dark theme styling
    - _Requirements: 3.6, 4.6_

  - [ ] 8.3 Implement ErrorMessage component
    - Create components/common/ErrorMessage.jsx
    - Display error messages with retry option
    - Handle network and validation errors
    - _Requirements: 9.6, 10.8_

- [ ] 9. Navigation Components
  - [ ] 9.1 Implement Navbar component
    - Create components/navigation/Navbar.jsx
    - Display links to Home, Poems, Stories, About
    - Highlight active route with currentPath prop
    - Hide hamburger menu on desktop viewport
    - _Requirements: 1.1, 1.4, 1.5, 19.7_

  - [ ] 9.2 Implement MobileMenu component
    - Create components/navigation/MobileMenu.jsx
    - Animated slide-in menu for mobile
    - Close on navigation or outside click
    - Implement focus trapping for accessibility
    - _Requirements: 1.5, 19.3, 19.4_

  - [ ]* 9.3 Write unit tests for navigation components
    - Test Navbar renders all navigation links
    - Test MobileMenu opens and closes correctly
    - Test keyboard navigation support
    - _Requirements: 1.1, 1.5, 19.7_

- [ ] 10. Content Display Components
  - [ ] 10.1 Implement ContentCard component
    - Create components/content/ContentCard.jsx
    - Display title, excerpt, publication date, reading time
    - Handle click navigation to detail page
    - Apply responsive hover states
    - _Requirements: 3.2, 3.3, 4.2, 4.3_

  - [ ]* 10.2 Write property test for ContentCard rendering completeness
    - **Property 3: Content Card Rendering Completeness**
    - **Validates: Requirements 3.2, 4.2**

  - [ ] 10.3 Implement PoemContent component for formatted poem display
    - Create components/content/PoemContent.jsx
    - Preserve line breaks and stanza formatting
    - Convert newlines to appropriate HTML breaks
    - _Requirements: 5.4_

  - [ ]* 10.4 Write property test for poem formatting preservation
    - **Property 4: Poem Formatting Preservation**
    - **Validates: Requirements 5.4**

  - [ ] 10.5 Implement StoryContent component for long-form reading
    - Create components/content/StoryContent.jsx
    - Apply typography optimized for long-form reading
    - Support Markdown rendering if needed
    - Proper paragraph spacing
    - _Requirements: 6.4, 15.5_

- [ ] 11. Engagement Components
  - [ ] 11.1 Implement LikeButton component
    - Create components/engagement/LikeButton.jsx
    - Display like count and toggle state
    - Implement optimistic UI updates
    - Show disabled state when Supabase unavailable
    - Apply animated feedback on click
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6, 9.7_

  - [ ] 11.2 Implement CommentSection component
    - Create components/engagement/CommentSection.jsx
    - Display existing comments with author, text, timestamp
    - Include comment submission form
    - Implement validation with inline error messages
    - Preserve form data on submission failure
    - _Requirements: 10.1, 10.2, 10.4, 10.5, 10.7, 10.8_

  - [ ]* 11.3 Write unit tests for engagement components
    - Test LikeButton toggle behavior
    - Test CommentSection form validation
    - Test error state display
    - _Requirements: 9.1, 10.4, 10.5_

- [ ] 12. Layout Component
  - [ ] 12.1 Implement MainLayout component
    - Create layouts/MainLayout.jsx
    - Include Navbar header with mobile menu state
    - Provide main content area with consistent padding
    - Add footer section
    - _Requirements: 17.3, 12.4_

- [ ] 13. Checkpoint - Verify all components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Page Components
  - [ ] 14.1 Implement HomePage
    - Create pages/HomePage.jsx
    - Display hero section with site title and tagline
    - Show featured poems and stories using ContentCards
    - Link to individual content pages
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 14.2 Implement PoemsPage
    - Create pages/PoemsPage.jsx
    - Display all poems as ContentCard grid
    - Sort in reverse chronological order
    - Show empty state when no poems exist
    - Apply responsive column layout
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 13.3, 13.4, 13.5_

  - [ ] 14.3 Implement StoriesPage
    - Create pages/StoriesPage.jsx
    - Display all stories as ContentCard grid
    - Sort in reverse chronological order
    - Show empty state when no stories exist
    - Apply responsive column layout
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 13.3, 13.4, 13.5_

  - [ ] 14.4 Implement PoemDetailPage
    - Create pages/PoemDetailPage.jsx
    - Display full poem with PoemContent component
    - Show title, author, date, reading time
    - Include LikeButton and CommentSection
    - Redirect to 404 for non-existent poems
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ] 14.5 Implement StoryDetailPage
    - Create pages/StoryDetailPage.jsx
    - Display full story with StoryContent component
    - Show title, author, date, reading time
    - Include LikeButton and CommentSection
    - Handle non-existent and restricted stories appropriately
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ] 14.6 Implement AboutPage
    - Create pages/AboutPage.jsx
    - Display author bio, profile image, social links
    - Load content from static data file
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 14.7 Implement NotFoundPage
    - Create pages/NotFoundPage.jsx
    - Display friendly error message
    - Provide link to navigate home
    - Maintain dark theme styling
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 15. Application Entry and Routing
  - [ ] 15.1 Configure App.jsx with routes and layout
    - Create App.jsx with HashRouter configuration
    - Wrap routes in MainLayout
    - Define all page routes with catch-all for 404
    - _Requirements: 1.1, 1.2, 1.3, 1.6_

  - [ ] 15.2 Configure main.jsx entry point
    - Create main.jsx with React 18 createRoot
    - Import global styles and Tailwind
    - Render App component
    - _Requirements: 17.4_

  - [ ] 15.3 Create global styles in index.css
    - Import Tailwind base, components, utilities
    - Define custom CSS variables for theme colors
    - Add base typography styles
    - _Requirements: 12.1, 12.2, 12.3_

- [ ] 16. Responsive Design and Accessibility
  - [ ] 16.1 Configure Tailwind responsive breakpoints
    - Define mobile (320px-767px), tablet (768px-1023px), desktop (1024px+) breakpoints
    - Apply mobile-first media queries
    - _Requirements: 13.1, 13.2_

  - [ ] 16.2 Implement responsive grid layouts
    - Single column for mobile
    - Two columns for tablet
    - Three columns for desktop
    - _Requirements: 13.3, 13.4, 13.5_

  - [ ] 16.3 Add accessibility attributes
    - Add semantic HTML elements throughout
    - Include alt text for all images
    - Add ARIA labels for interactive elements
    - Ensure proper heading hierarchy
    - _Requirements: 19.1, 19.2, 19.5, 19.6_

  - [ ] 16.4 Implement keyboard navigation and focus management
    - Add visible focus indicators
    - Ensure tab order is logical
    - Support keyboard-only navigation
    - _Requirements: 19.3, 19.4, 19.7_

  - [ ]* 16.5 Write accessibility tests
    - Run axe-core accessibility audit
    - Test keyboard navigation
    - Verify focus management
    - _Requirements: 19.1, 19.2, 19.3, 19.4_

- [ ] 17. Performance Optimization
  - [ ] 17.1 Configure code splitting for routes
    - Use React.lazy for page components
    - Add Suspense boundaries with loading fallback
    - _Requirements: 14.3_

  - [ ] 17.2 Implement image lazy loading
    - Add loading="lazy" to images
    - Implement placeholder for images
    - _Requirements: 14.2_

  - [ ] 17.3 Configure Vite build optimization
    - Set up production build configuration
    - Configure asset caching headers
    - Optimize bundle size
    - _Requirements: 14.1, 14.4_

- [ ] 18. GitHub Pages Deployment Configuration
  - [ ] 18.1 Configure Vite for GitHub Pages deployment
    - Set base URL in vite.config.js
    - Configure output to dist directory
    - _Requirements: 18.1, 18.3_

  - [ ] 18.2 Create GitHub Actions deployment workflow
    - Create .github/workflows/deploy.yml
    - Configure build and deploy steps
    - Set up deployment to gh-pages branch
    - _Requirements: 18.3, 18.5_

- [ ] 19. Final Checkpoint - Complete verification
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Integration testing and final validation
  - [ ]* 20.1 Write integration tests for routing
    - Test navigation between all pages
    - Test 404 handling for invalid routes
    - Test browser back/forward navigation
    - _Requirements: 1.2, 1.3, 1.6_

  - [ ]* 20.2 Write integration tests for engagement features
    - Test like button with Supabase mock
    - Test comment submission flow
    - Test error handling scenarios
    - _Requirements: 9.1, 10.1_

  - [ ]* 20.3 Perform performance audit
    - Run Lighthouse performance audit
    - Verify 90+ performance score
    - Check load times on simulated 3G
    - _Requirements: 14.1, 14.5, 2.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses React 18+ with Vite, TypeScript/JavaScript, and Tailwind CSS as specified in the design
- Supabase integration requires setting up a Supabase project and running the SQL schema from the design document

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.3", "2.4", "2.6", "2.8", "2.10"] },
    { "id": 3, "tasks": ["2.2", "2.5", "2.7", "2.9", "2.11"] },
    { "id": 4, "tasks": ["4.1", "4.3"] },
    { "id": 5, "tasks": ["4.2", "4.4"] },
    { "id": 6, "tasks": ["4.5", "5.1", "5.2"] },
    { "id": 7, "tasks": ["5.3", "6.1", "6.2", "6.3", "6.4"] },
    { "id": 8, "tasks": ["8.1", "8.2", "8.3"] },
    { "id": 9, "tasks": ["9.1", "9.2"] },
    { "id": 10, "tasks": ["9.3", "10.1", "10.3", "10.5"] },
    { "id": 11, "tasks": ["10.2", "10.4", "11.1", "11.2"] },
    { "id": 12, "tasks": ["11.3", "12.1"] },
    { "id": 13, "tasks": ["14.1", "14.6", "14.7"] },
    { "id": 14, "tasks": ["14.2", "14.3"] },
    { "id": 15, "tasks": ["14.4", "14.5"] },
    { "id": 16, "tasks": ["15.1", "15.2", "15.3"] },
    { "id": 17, "tasks": ["16.1", "16.2", "16.3", "16.4"] },
    { "id": 18, "tasks": ["16.5", "17.1", "17.2", "17.3"] },
    { "id": 19, "tasks": ["18.1", "18.2"] },
    { "id": 20, "tasks": ["20.1", "20.2", "20.3"] }
  ]
}
```
