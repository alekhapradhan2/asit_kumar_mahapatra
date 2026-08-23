'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/clients', icon: '👥', label: 'Clients' },
  { href: '/admin/cases', icon: '📁', label: 'Cases' },
  { href: '/admin/articles', icon: '📝', label: 'Articles' },
  { href: '/admin/success-stories', icon: '🏆', label: 'Success Stories' },
  { href: '/admin/documents', icon: '📄', label: 'Documents' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
  { href: '/admin/activity-logs', icon: '🔍', label: 'Activity Logs' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ clients: 0, cases: 0, articles: 0 });
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_access_token');
    const storedUser = sessionStorage.getItem('admin_user');
    if (!token || !storedUser) { router.replace('/admin/login'); return; }
    setUser(JSON.parse(storedUser));

    const headers = { Authorization: `Bearer ${token}` };

    Promise.allSettled([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients?limit=5`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases?limit=5&sortBy=updatedAt&sortOrder=desc`, { headers }),
    ]).then(async ([clientsRes, casesRes]) => {
      if (clientsRes.status === 'fulfilled' && clientsRes.value.ok) {
        const d = await clientsRes.value.json();
        setClients(d.data || []);
        setStats((s) => ({ ...s, clients: d.pagination?.total || 0 }));
      }
      if (casesRes.status === 'fulfilled' && casesRes.value.ok) {
        const d = await casesRes.value.json();
        setCases(d.data || []);
        setStats((s) => ({ ...s, cases: d.pagination?.total || 0 }));
      }
    }).finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => { sessionStorage.clear(); router.replace('/admin/login'); };

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-neutral-200 bg-white">
        <div className="p-5 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center font-serif font-bold text-white bg-black text-xs">
              ⚖
            </div>
            <div>
              <div className="text-sm font-bold text-black">{process.env.NEXT_PUBLIC_SITE_NAME || '[FIRM_NAME]'}</div>
              <div className="text-[0.65rem] uppercase tracking-widest text-neutral-500 font-bold">Admin Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-neutral-200">
          <button onClick={handleLogout} id="admin-logout-btn"
            className="flex items-center gap-3 px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all w-full">
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-neutral-200 px-8 py-4 flex items-center justify-between bg-white">
          <div>
            <h1 className="font-serif text-xl font-bold text-black">Dashboard</h1>
            <p className="text-xs text-neutral-500">Welcome back, {user?.email}</p>
          </div>
          <Link href="/admin/clients" id="new-client-btn" className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5">
            + Manage Clients
          </Link>
        </header>

        <main className="flex-1 p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Total Clients', value: stats.clients, icon: '👥' },
              { label: 'Total Cases', value: stats.cases, icon: '📁' },
              { label: 'Published Articles', value: stats.articles, icon: '📝' },
              { label: 'Active Cases', value: cases.filter(c => !c.isArchived).length, icon: '⚖️' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <div className="text-right">
                    <div className="font-serif text-3xl font-bold text-black">{stat.value}</div>
                  </div>
                </div>
                <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Cases */}
            <div className="glass-card p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif font-bold text-black">Recent Cases</h2>
                <Link href="/admin/cases" className="text-xs uppercase tracking-wider font-bold text-black hover:underline">View all →</Link>
              </div>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14" />)}</div>
              ) : cases.length ? (
                <div className="space-y-3">
                  {cases.slice(0, 5).map((c) => (
                    <Link key={c.id} href={`/admin/cases`} id={`admin-case-${c.id}`}
                      className="flex items-center justify-between p-3 rounded-sm hover:bg-neutral-50 border border-neutral-100 transition-all group">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-black truncate group-hover:underline">{c.title}</div>
                        <div className="text-xs text-neutral-500 flex gap-2 mt-0.5 font-medium">
                          <span>{c.client?.fullName}</span>
                          <span>•</span>
                          <span className="font-mono">{c.internalCaseId}</span>
                        </div>
                      </div>
                      <span className="status-badge status-won flex-shrink-0 ml-3">
                        {c.currentStatus.replace(/_/g, ' ')}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500 text-center py-8">No cases registered yet.</p>
              )}
            </div>

            {/* Recent Clients */}
            <div className="glass-card p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif font-bold text-black">Recent Clients</h2>
                <Link href="/admin/clients" className="text-xs uppercase tracking-wider font-bold text-black hover:underline">View all →</Link>
              </div>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14" />)}</div>
              ) : clients.length ? (
                <div className="space-y-3">
                  {clients.slice(0, 5).map((client) => (
                    <Link key={client.id} href={`/admin/clients`} id={`admin-client-${client.id}`}
                      className="flex items-center gap-3 p-3 rounded-sm hover:bg-neutral-50 border border-neutral-100 transition-all group">
                      <div className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs flex-shrink-0 bg-neutral-100 text-black border border-neutral-300">
                        {client.fullName?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-black group-hover:underline">{client.fullName}</div>
                        <div className="text-xs text-neutral-500 font-mono">{client.clientId}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${client.isActive ? 'bg-black' : 'bg-neutral-300'}`} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500 text-center py-8">No clients registered yet.</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6 bg-white border border-neutral-200">
            <h2 className="font-serif font-bold text-black mb-5">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Client Directory', href: '/admin/clients', icon: '👤' },
                { label: 'Case Records', href: '/admin/cases', icon: '📁' },
                { label: 'Articles CMS', href: '/admin/articles', icon: '✍️' },
                { label: 'Success Stories', href: '/admin/success-stories', icon: '🏆' },
              ].map((action) => (
                <Link key={action.href} href={action.href} id={`quick-action-${action.label.toLowerCase().replace(' ', '-')}`}
                  className="flex flex-col items-center gap-2 p-5 rounded-sm text-center border border-neutral-200 hover:border-black transition-all bg-neutral-50 hover:bg-white">
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-xs uppercase tracking-wider font-bold text-neutral-800">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
