'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  href: string;
  icon: string;
  label: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/clients', icon: '👥', label: 'Clients' },
  { href: '/admin/cases', icon: '📁', label: 'Cases' },
  { href: '/admin/documents', icon: '📄', label: 'Documents' },
  { href: '/admin/articles', icon: '📝', label: 'Articles CMS' },
  { href: '/admin/success-stories', icon: '🏆', label: 'Success Stories' },
  { href: '/admin/activity-logs', icon: '🔍', label: 'Audit Trail' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role?: string } | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    const storedUser = sessionStorage.getItem('admin_user');
    const token = sessionStorage.getItem('admin_access_token');

    if (!token && typeof window !== 'undefined') {
      router.replace('/admin/login');
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({ email: 'admin@chambers.internal' });
      }
    }
  }, [pathname, isLoginPage, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Lax';
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900 font-sans antialiased">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Persistent Left Sidebar ────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Seal Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-sm bg-black text-white flex items-center justify-center font-serif text-base font-bold shadow-xs group-hover:scale-105 transition-transform">
              ⚖
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-black truncate max-w-[150px]">
                {siteName}
              </div>
              <div className="text-[0.65rem] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1.5">
                <span className="pulse-dot" />
                <span>Admin Console</span>
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-neutral-500 hover:text-black p-1 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-neutral-400">
            Chamber Management
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Session & Logout Footer */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded bg-white border border-neutral-200">
            <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold font-mono">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-black truncate">
                {user?.email || 'Administrator'}
              </div>
              <div className="text-[0.65rem] text-neutral-500 uppercase tracking-widest font-mono">
                {user?.role || 'SUPER_ADMIN'}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded bg-neutral-200 hover:bg-neutral-300 text-black text-[0.7rem] font-bold uppercase tracking-wider transition-colors"
              title="View Public Chambers Website"
            >
              <span>🌐</span>
              <span>Site</span>
            </Link>
            <button
              onClick={handleLogout}
              id="admin-sidebar-logout-btn"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded bg-neutral-900 hover:bg-red-700 text-white text-[0.7rem] font-bold uppercase tracking-wider transition-colors"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Shell ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded bg-neutral-100 text-black font-bold text-sm flex items-center gap-2"
          >
            <span>☰</span>
            <span className="text-xs uppercase tracking-wider">Menu</span>
          </button>
          <div className="text-xs font-serif font-bold text-black">
            {siteName}
          </div>
          <Link
            href="/admin/dashboard"
            className="w-7 h-7 rounded bg-black text-white flex items-center justify-center text-xs font-bold"
          >
            ⚖
          </Link>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
