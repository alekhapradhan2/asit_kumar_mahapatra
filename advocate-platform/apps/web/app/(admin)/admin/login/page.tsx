'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || '[FIRM_NAME]';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
        return;
      }

      if (data.data?.accessToken) {
        sessionStorage.setItem('admin_access_token', data.data.accessToken);
        sessionStorage.setItem('admin_user', JSON.stringify(data.data.user));
        document.cookie = `admin_token=${data.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50">
      <div className="w-full max-w-sm">
        <div className="glass-card p-10 bg-white">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-sm flex items-center justify-center text-xl mx-auto mb-4 bg-black text-white font-serif font-bold">
              ⚖
            </div>
            <h1 className="font-serif text-xl font-bold text-black mb-1">Admin Portal</h1>
            <p className="text-[0.7rem] uppercase tracking-widest text-neutral-500 font-bold">{siteName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="admin-login-form">
            {error && (
              <div className="p-3 rounded-lg text-xs text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                ⚠ {error}
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="form-label text-xs">Admin Email</label>
              <input id="admin-email" type="email" className="form-input" placeholder="admin@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>

            <div>
              <label htmlFor="admin-password" className="form-label text-xs">Password</label>
              <input id="admin-password" type="password" className="form-input" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>

            <button id="admin-login-btn" type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/8 text-center">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">← Back to Website</a>
          </div>
        </div>
      </div>
    </div>
  );
}
