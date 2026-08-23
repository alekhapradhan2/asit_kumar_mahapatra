import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portal',
  robots: { index: false, follow: false },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col bg-white text-neutral-900"
    >
      {/* Client Portal Header */}
      <header className="border-b border-neutral-200 py-4 px-6 flex items-center justify-between bg-neutral-50">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center font-serif font-bold text-white text-xs bg-black"
          >
            ⚖
          </div>
          <div>
            <span className="font-serif font-bold text-black text-sm block leading-none">
              {process.env.NEXT_PUBLIC_SITE_NAME || '[FIRM_NAME]'}
            </span>
            <span className="text-[0.65rem] uppercase tracking-widest text-neutral-500 font-bold">Client Case Portal</span>
          </div>
        </div>
        <a href="/" className="text-xs uppercase tracking-wider text-neutral-600 hover:text-black font-semibold transition-colors">
          ← Return to Website
        </a>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-4 px-6 text-center">
        <p className="text-xs text-slate-600">
          Secure, encrypted client portal. For assistance, contact our office directly.
        </p>
      </footer>
    </div>
  );
}
