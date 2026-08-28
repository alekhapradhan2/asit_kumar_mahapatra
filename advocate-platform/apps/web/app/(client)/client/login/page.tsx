'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';
import Link from 'next/link';

export default function ClientLoginPage() {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/client/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ clientId: clientId.toUpperCase().trim(), password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed. Please check your credentials.');
        return;
      }

      if (data.data?.accessToken) {
        sessionStorage.setItem('client_access_token', data.data.accessToken);
        sessionStorage.setItem('client_user', JSON.stringify(data.data.user));
        document.cookie = `client_token=${data.data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
      }

      router.push('/client/dashboard');
    } catch {
      setError('Connection error. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackgroundEffects />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 relative z-10 bg-transparent">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-md relative overflow-hidden">
            {/* Icon */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-black text-white shadow-xs">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
                </svg>
              </div>
              <h1 className="font-serif text-2xl font-bold text-black mb-1">
                Client Case Portal
              </h1>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold font-mono">
                Authorized Court Tracking Access
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" id="client-login-form">
              {error && (
                <div
                  className="p-3.5 rounded-lg text-xs text-red-700 font-medium bg-red-50 border border-red-200"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="clientId" className="form-label">
                  Client ID *
                </label>
                <input
                  id="clientId"
                  type="text"
                  className="form-input font-mono"
                  placeholder="CLIENT-XXXXXX"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value.toUpperCase())}
                  required
                  autoComplete="username"
                  maxLength={20}
                />
                <p className="mt-1.5 text-xs text-neutral-500 font-medium">
                  Your Client ID was issued by the Advocate's office upon engagement.
                </p>
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="Enter your confidential password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center py-3.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-xs"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In to Case Portal →'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 text-center space-y-2">
              <p className="text-xs text-neutral-500">
                Don't have your login credentials? Contact the Advocate's office.
              </p>
              <p className="text-xs text-neutral-700 font-mono font-semibold">
                Protected by End-to-End Encrypted Protocols
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-neutral-600 hover:text-black font-semibold hover:underline">
              ← Return to Main Chambers Website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
