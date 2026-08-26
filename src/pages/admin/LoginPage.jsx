import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PrimaryButton } from '../../components/common';

/**
 * LoginPage - Admin authentication page
 * 
 * Features:
 * - Email/password login form
 * - Hindi labels and error messages
 * - Loading state during authentication
 * - Redirects to intended destination after login
 * 
 * Route: /admin/login
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      // Successful login - navigate to intended destination
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show configuration warning if Supabase is not set up
  if (!isConfigured) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: 'var(--color-paper)' }}
      >
        <div 
          className="w-full max-w-md p-8 rounded-lg border"
          style={{ 
            backgroundColor: 'var(--color-paper-light)',
            borderColor: 'var(--color-border)'
          }}
        >
          <div className="text-center">
            <h1 
              className="font-literary text-2xl font-bold mb-4"
              style={{ color: 'var(--color-maroon)' }}
            >
              प्रतिमा Admin
            </h1>
            <p 
              className="font-body"
              style={{ color: 'var(--color-muted)' }}
            >
              Supabase कॉन्फ़िगर नहीं है। कृपया .env.local फ़ाइल में VITE_SUPABASE_URL और VITE_SUPABASE_PUBLISHABLE_KEY सेट करें।
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-lg border"
        style={{ 
          backgroundColor: 'var(--color-paper-light)',
          borderColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="font-literary text-2xl md:text-3xl font-bold mb-2"
            style={{ color: 'var(--color-maroon)' }}
          >
            प्रतिमा Admin
          </h1>
          <p 
            className="font-body text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            एडमिन पोर्टल में लॉगिन करें
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block font-body text-sm font-medium mb-2"
              style={{ color: 'var(--color-ink)' }}
            >
              ईमेल
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg border font-body text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ 
                backgroundColor: 'var(--color-paper)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink)',
              }}
              placeholder="admin@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block font-body text-sm font-medium mb-2"
              style={{ color: 'var(--color-ink)' }}
            >
              पासवर्ड
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg border font-body text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ 
                backgroundColor: 'var(--color-paper)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink)',
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className="p-3 rounded-lg font-body text-sm"
              style={{ 
                backgroundColor: 'rgba(111, 29, 42, 0.1)',
                color: 'var(--color-maroon)'
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg 
                  className="animate-spin h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
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
                लॉगिन हो रहा है...
              </span>
            ) : (
              'लॉगिन करें'
            )}
          </PrimaryButton>
        </form>

        {/* Back to Site Link */}
        <div className="mt-6 text-center">
          <a 
            href="#/"
            className="font-body text-sm transition-colors"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-maroon)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-muted)'}
          >
            ← साइट पर वापस जाएँ
          </a>
        </div>
      </div>
    </div>
  );
}
