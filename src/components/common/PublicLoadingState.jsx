/**
 * PublicLoadingState - Loading indicator for public pages
 * Subtle, literary-themed loading state that matches the site aesthetic
 */
export default function PublicLoadingState({ message = 'लोड हो रहा है...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24">
      {/* Animated literary ornament */}
      <div 
        className="animate-pulse mb-6"
        aria-hidden="true"
      >
        <span 
          className="font-literary text-4xl"
          style={{ color: 'var(--color-gold)', opacity: 0.6 }}
        >
          ❧
        </span>
      </div>
      
      <p 
        className="font-body text-base"
        style={{ color: 'var(--color-muted)' }}
      >
        {message}
      </p>
    </div>
  );
}
