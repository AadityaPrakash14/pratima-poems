import { PrimaryButton, SecondaryButton } from '../components/common';

/**
 * NotFoundPage - 404 error page
 * Hindi-first friendly error message with navigation options
 */
export default function NotFoundPage() {
  return (
    <div 
      className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <h1 
          className="font-literary text-8xl sm:text-9xl font-bold mb-4"
          style={{ color: 'var(--color-border)' }}
        >
          404
        </h1>

        {/* Error Message in Hindi */}
        <h2 
          className="font-literary text-2xl sm:text-3xl font-semibold mb-4"
          style={{ color: 'var(--color-ink)' }}
        >
          यह पृष्ठ नहीं मिला।
        </h2>
        
        <p 
          className="font-body text-base md:text-lg mb-8"
          style={{ color: 'var(--color-ink-soft)' }}
        >
          शायद यह रचना किसी और पन्ने पर है।
        </p>

        {/* Ornamental element */}
        <div 
          className="w-16 h-px mx-auto mb-8"
          style={{ backgroundColor: 'var(--color-gold)' }}
          aria-hidden="true"
        />

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <PrimaryButton to="/">
            मुखपृष्ठ पर जाएँ
          </PrimaryButton>
          <SecondaryButton to="/poems">
            कविताएँ पढ़ें
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
