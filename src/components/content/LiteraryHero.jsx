import { PrimaryButton } from '../common';

/**
 * LiteraryHero - Homepage hero section
 * Establishes author identity with brand, subtitle, tagline, and CTA
 * Centered layout with generous whitespace and literary decorations
 * Designed to feel like opening an old, beautiful literary diary
 */
export default function LiteraryHero() {
  return (
    <section 
      className="min-h-[70vh] md:min-h-[80vh] flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      {/* Subtle decorative elements - positioned absolutely */}
      <QuillDecoration className="absolute top-16 left-8 md:left-16 w-12 h-16 md:w-16 md:h-20 opacity-[0.08] rotate-[-15deg]" />
      <BotanicalDecoration className="absolute bottom-20 right-8 md:right-16 w-16 h-20 md:w-20 md:h-24 opacity-[0.06]" />
      <InkwellDecoration className="absolute top-24 right-12 md:right-24 w-8 h-10 md:w-10 md:h-12 opacity-[0.07]" />

      <div className="container-hero text-center py-16 md:py-24 relative z-10">
        {/* Decorative top flourish */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <OrnamentalFlourish />
        </div>

        {/* Author Name - Primary Identity */}
        <h1 
          className="font-literary text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2"
          style={{ color: 'var(--color-ink)' }}
        >
          प्रतिमा
        </h1>
        
        {/* Subtitle */}
        <p 
          className="font-literary text-xl sm:text-2xl md:text-3xl font-medium mb-8 md:mb-10"
          style={{ color: 'var(--color-ink-soft)' }}
        >
          साहित्य संग्रह
        </p>

        {/* Ornamental divider with decorative ends */}
        <div className="flex items-center justify-center gap-3 mb-8 md:mb-10" aria-hidden="true">
          <span 
            className="w-8 h-px"
            style={{ background: 'linear-gradient(to right, transparent, var(--color-gold))' }}
          />
          <DiamondDot />
          <span 
            className="w-12 h-px"
            style={{ backgroundColor: 'var(--color-gold)' }}
          />
          <DiamondDot />
          <span 
            className="w-8 h-px"
            style={{ background: 'linear-gradient(to left, transparent, var(--color-gold))' }}
          />
        </div>
        
        {/* Tagline */}
        <p 
          className="font-literary text-lg sm:text-xl md:text-2xl italic max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed"
          style={{ color: 'var(--color-ink-soft)' }}
        >
          शब्द जो वर्षों तक डायरी में रहे,
          <br />
          अब एक नई यात्रा पर हैं।
        </p>
        
        {/* Primary CTA */}
        <PrimaryButton to="/poems">
          साहित्य पढ़ें
        </PrimaryButton>

        {/* Decorative bottom flourish */}
        <div className="flex justify-center mt-16 md:mt-20" aria-hidden="true">
          <OrnamentalFlourish inverted />
        </div>
      </div>
    </section>
  );
}

/* Decorative Components */

function OrnamentalFlourish({ inverted = false }) {
  return (
    <svg 
      width="120" 
      height="20" 
      viewBox="0 0 120 20" 
      fill="none"
      style={{ 
        color: 'var(--color-gold)',
        transform: inverted ? 'rotate(180deg)' : 'none',
        opacity: 0.6
      }}
    >
      <path 
        d="M60 4 C50 4, 45 10, 30 10 C20 10, 10 6, 0 10 M60 4 C70 4, 75 10, 90 10 C100 10, 110 6, 120 10"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="60" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

function DiamondDot() {
  return (
    <span 
      className="w-2 h-2 rotate-45"
      style={{ backgroundColor: 'var(--color-gold)' }}
    />
  );
}

function QuillDecoration({ className }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 40 60" 
      fill="none"
      style={{ color: 'var(--color-walnut)' }}
    >
      <path 
        d="M20 0 C25 15, 35 25, 38 40 C38 45, 35 50, 30 55 L25 60 L20 55 C18 50, 15 45, 15 40 C15 30, 18 20, 20 0"
        fill="currentColor"
      />
      <path 
        d="M20 15 L20 50"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
      />
    </svg>
  );
}

function BotanicalDecoration({ className }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 50 60" 
      fill="none"
      style={{ color: 'var(--color-sepia)' }}
    >
      {/* Simple leaf/branch motif */}
      <path 
        d="M25 60 L25 20 M25 20 C20 25, 10 20, 5 10 M25 20 C30 25, 40 20, 45 10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <ellipse cx="5" cy="8" rx="4" ry="6" fill="currentColor" opacity="0.5" />
      <ellipse cx="45" cy="8" rx="4" ry="6" fill="currentColor" opacity="0.5" />
      <ellipse cx="15" cy="25" rx="3" ry="5" fill="currentColor" opacity="0.4" transform="rotate(-30 15 25)" />
      <ellipse cx="35" cy="25" rx="3" ry="5" fill="currentColor" opacity="0.4" transform="rotate(30 35 25)" />
    </svg>
  );
}

function InkwellDecoration({ className }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 30 35" 
      fill="none"
      style={{ color: 'var(--color-walnut)' }}
    >
      {/* Simple inkwell shape */}
      <rect x="5" y="15" width="20" height="18" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="8" y="12" width="14" height="5" rx="1" fill="currentColor" />
      <ellipse cx="15" cy="15" rx="5" ry="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
