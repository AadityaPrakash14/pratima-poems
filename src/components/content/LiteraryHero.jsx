import { PrimaryButton } from '../common';

/**
 * LiteraryHero - Homepage hero section
 * Establishes author identity with brand, subtitle, tagline, and CTA
 * Centered layout with generous whitespace
 */
export default function LiteraryHero() {
  return (
    <section 
      className="min-h-[70vh] md:min-h-[80vh] flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="container-hero text-center py-16 md:py-24">
        {/* Author Name - Primary Identity */}
        <h1 
          className="font-literary text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2"
          style={{ color: 'var(--color-ink)' }}
        >
          प्रतिमा
        </h1>
        
        {/* Subtitle */}
        <p 
          className="font-literary text-xl sm:text-2xl md:text-3xl font-medium mb-8 md:mb-12"
          style={{ color: 'var(--color-ink-soft)' }}
        >
          साहित्य संग्रह
        </p>

        {/* Ornamental element */}
        <div 
          className="w-16 h-px mx-auto mb-8 md:mb-12"
          style={{ backgroundColor: 'var(--color-gold)' }}
          aria-hidden="true"
        />
        
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
      </div>
    </section>
  );
}
