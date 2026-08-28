import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Client Portal | Authorized Court Tracking Access',
  robots: { index: false, follow: false },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 98610 00000';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-900 font-sans antialiased">
      {/* ─── Top Chamber Client Banner ───────────────────────────────────────── */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-xs">
        <div className="container-xl py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link href="/client/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-sm bg-black text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs group-hover:scale-105 transition-transform">
                ⚖
              </div>
              <div>
                <div className="font-serif font-bold text-black text-sm sm:text-base leading-tight">
                  {siteName}
                </div>
                <div className="text-[0.65rem] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="pulse-dot" />
                  <span>Authorized Client Case Portal</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold font-mono transition-colors border border-neutral-200"
              title="Direct Chambers Hotline"
            >
              <span>📞</span>
              <span>{phone}</span>
            </a>
            <Link
              href="/"
              className="text-xs uppercase tracking-wider text-neutral-600 hover:text-black font-bold transition-colors py-1.5 px-3 rounded hover:bg-neutral-100"
            >
              ← Main Site
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Client Workspace Viewport ───────────────────────────────────────── */}
      <main className="flex-1 py-6 sm:py-8">
        {children}
      </main>

      {/* ─── Client Security Footer ──────────────────────────────────────────── */}
      <footer className="bg-white border-t border-neutral-200 py-6 text-center">
        <div className="container-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>Protected by End-to-End Encrypted Attorney-Client Protocols</span>
          </div>
          <div>
            <span>Official Chambers of {siteName}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
