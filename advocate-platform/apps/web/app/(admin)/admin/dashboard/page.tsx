'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  clients: number;
  cases: number;
  activeCases: number;
  hearingsThisWeek: number;
  documents: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    clients: 0,
    cases: 0,
    activeCases: 0,
    hearingsThisWeek: 0,
    documents: 0,
  });
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [upcomingHearings, setUpcomingHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_access_token');
    const storedUser = sessionStorage.getItem('admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({ email: 'Administrator' });
      }
    }

    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.allSettled([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients?limit=8`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases?limit=10&sortBy=updatedAt&sortOrder=desc`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents?limit=1`, { headers }),
    ])
      .then(async ([clientsRes, casesRes, docsRes]) => {
        let totalClients = 0;
        let totalCases = 0;
        let totalDocs = 0;
        let fetchedCases: any[] = [];
        let fetchedClients: any[] = [];

        if (clientsRes.status === 'fulfilled' && clientsRes.value.ok) {
          const d = await clientsRes.value.json();
          fetchedClients = d.data || [];
          totalClients = d.pagination?.total || fetchedClients.length;
          setClients(fetchedClients);
        }

        if (casesRes.status === 'fulfilled' && casesRes.value.ok) {
          const d = await casesRes.value.json();
          fetchedCases = d.data || [];
          totalCases = d.pagination?.total || fetchedCases.length;
          setCases(fetchedCases);

          // Calculate upcoming hearings
          const now = new Date();
          const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          const scheduled = fetchedCases
            .filter((c) => c.nextHearingDate && new Date(c.nextHearingDate) >= now)
            .sort(
              (a, b) =>
                new Date(a.nextHearingDate).getTime() -
                new Date(b.nextHearingDate).getTime()
            );

          setUpcomingHearings(scheduled);
        }

        if (docsRes.status === 'fulfilled' && docsRes.value.ok) {
          const d = await docsRes.value.json();
          totalDocs = d.pagination?.total || 0;
        }

        setStats({
          clients: totalClients,
          cases: totalCases,
          activeCases: fetchedCases.filter((c) => !c.isArchived && c.currentStatus !== 'WON' && c.currentStatus !== 'CLOSED').length,
          hearingsThisWeek: fetchedCases.filter(
            (c) =>
              c.nextHearingDate &&
              new Date(c.nextHearingDate) >= new Date() &&
              new Date(c.nextHearingDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          ).length,
          documents: totalDocs,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 page-transition">
      {/* ─── Top Welcome & Quick Actions Bar ───────────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
              Chambers Overview
            </span>
            <span className="status-badge status-won text-[0.65rem]">LIVE SYSTEM</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">
            Welcome back, {user?.email?.split('@')[0] || 'Advocate'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            Real-time management dashboard for court cases, client proceedings, legal document repository, and audit trails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            href="/admin/clients"
            id="btn-quick-new-client"
            className="btn-primary text-xs tracking-wider uppercase py-2.5 px-4 flex-1 md:flex-initial justify-center"
          >
            <span>👤</span>
            <span>+ New Client</span>
          </Link>
          <Link
            href="/admin/cases"
            id="btn-quick-new-case"
            className="btn-outline text-xs tracking-wider uppercase py-2.5 px-4 flex-1 md:flex-initial justify-center bg-white"
          >
            <span>📁</span>
            <span>+ Manage Cases</span>
          </Link>
          <Link
            href="/admin/documents"
            id="btn-quick-upload-doc"
            className="btn-outline text-xs tracking-wider uppercase py-2.5 px-4 flex-1 md:flex-initial justify-center bg-white"
          >
            <span>📤</span>
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* ─── Metric Stat Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            label: 'Total Registered Clients',
            value: stats.clients,
            icon: '👥',
            href: '/admin/clients',
            detail: 'Active client files',
          },
          {
            label: 'Total Matter Records',
            value: stats.cases,
            icon: '📁',
            href: '/admin/cases',
            detail: `${stats.activeCases} active in court`,
          },
          {
            label: 'Hearings (Next 7 Days)',
            value: stats.hearingsThisWeek,
            icon: '🏛️',
            href: '/admin/cases',
            detail: 'Scheduled court dates',
          },
          {
            label: 'Central Repository Docs',
            value: stats.documents,
            icon: '📄',
            href: '/admin/documents',
            detail: 'Orders & filings',
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="glass-card p-5 sm:p-6 bg-white border border-neutral-200 shadow-sm hover:border-black transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl sm:text-3xl p-2.5 rounded bg-neutral-100 border border-neutral-200 group-hover:bg-black group-hover:text-white transition-colors">
                {item.icon}
              </span>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-black">
                {loading ? '—' : item.value}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-black group-hover:underline">
                {item.label}
              </div>
              <div className="text-[0.7rem] text-neutral-500 font-medium mt-0.5">
                {item.detail}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ─── Upcoming Court Hearings Agenda ───────────────────────────────── */}
      <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <h2 className="font-serif text-lg font-bold text-black">
                Upcoming Court Hearings & Board Agenda
              </h2>
              <p className="text-xs text-neutral-500">
                Scheduled hearings across High Court & District Courts requiring counsel appearance
              </p>
            </div>
          </div>
          <Link
            href="/admin/cases"
            className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
          >
            View All Matters →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-neutral-100 animate-pulse h-24" />
            <div className="p-4 rounded bg-neutral-100 animate-pulse h-24" />
          </div>
        ) : upcomingHearings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingHearings.map((c) => {
              const hDate = new Date(c.nextHearingDate);
              const diffDays = Math.ceil(
                (hDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={c.id}
                  className="p-4 rounded border border-neutral-200 bg-neutral-50/60 hover:bg-white hover:border-black transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200">
                        {c.internalCaseId}
                      </span>
                      <span
                        className={`text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded ${
                          diffDays <= 2
                            ? 'bg-red-600 text-white'
                            : diffDays <= 5
                            ? 'bg-amber-500 text-white'
                            : 'bg-black text-white'
                        }`}
                      >
                        {diffDays <= 0
                          ? 'Today / Tomorrow'
                          : `In ${diffDays} Day${diffDays === 1 ? '' : 's'}`}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-black line-clamp-2">
                      {c.title}
                    </h3>
                    <div className="text-xs text-neutral-600 mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span>🏛️</span>
                        <span>{c.courtName || 'Court of Law'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <span>👤</span>
                        <span>{c.client?.fullName || 'Client'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-700">
                      📅 {hDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <Link
                      href={`/admin/cases`}
                      className="text-black hover:underline uppercase text-[0.7rem]"
                    >
                      Open Case →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-neutral-50 rounded border border-dashed border-neutral-300 text-xs text-neutral-500">
            No court hearings scheduled in the active database. Add next hearing dates when editing cases.
          </div>
        )}
      </div>

      {/* ─── Two-Column Section: Recent Cases & Recent Clients ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h2 className="font-serif font-bold text-base text-black flex items-center gap-2">
              <span>📁</span>
              <span>Recent Court Matters</span>
            </h2>
            <Link
              href="/admin/cases"
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
            >
              All Cases ({stats.cases}) →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
              ))}
            </div>
          ) : cases.length > 0 ? (
            <div className="space-y-2.5">
              {cases.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  href="/admin/cases"
                  className="flex items-center justify-between p-3 rounded hover:bg-neutral-50 border border-neutral-100 transition-all group"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-xs font-bold text-black truncate group-hover:underline">
                      {c.title}
                    </div>
                    <div className="text-[0.7rem] text-neutral-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono">{c.internalCaseId}</span>
                      <span>•</span>
                      <span>{c.client?.fullName || 'Client'}</span>
                      <span>•</span>
                      <span>{c.practiceArea || 'Law'}</span>
                    </div>
                  </div>
                  <span className="status-badge status-won text-[0.65rem] flex-shrink-0">
                    {c.currentStatus.replace(/_/g, ' ')}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400">
              No cases recorded yet. Click "+ Manage Cases" to register.
            </div>
          )}
        </div>

        {/* Recent Clients */}
        <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h2 className="font-serif font-bold text-base text-black flex items-center gap-2">
              <span>👥</span>
              <span>Client Directory Workspace</span>
            </h2>
            <Link
              href="/admin/clients"
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
            >
              All Clients ({stats.clients}) →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-neutral-100 rounded animate-pulse" />
              ))}
            </div>
          ) : clients.length > 0 ? (
            <div className="space-y-2.5">
              {clients.slice(0, 5).map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  className="flex items-center gap-3 p-3 rounded hover:bg-neutral-50 border border-neutral-100 transition-all group"
                >
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs flex-shrink-0 bg-neutral-100 text-black border border-neutral-300 font-serif">
                    {client.fullName?.charAt(0) || 'C'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-black group-hover:underline flex items-center gap-2">
                      <span>{client.fullName}</span>
                      <span className="text-[0.65rem] font-mono text-neutral-400 font-normal">
                        {client.clientId}
                      </span>
                    </div>
                    <div className="text-[0.7rem] text-neutral-500 truncate">
                      {client.email} {client.mobile ? `• ${client.mobile}` : ''}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-black bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      {client._count?.cases ?? 0} Cases
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400">
              No registered clients yet. Click "+ New Client" to add.
            </div>
          )}
        </div>
      </div>

      {/* ─── Chamber Quick Modules ─────────────────────────────────────────── */}
      <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
        <h2 className="font-serif font-bold text-base text-black">
          Chamber Administrative Portals
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Client Directory',
              detail: 'Profiles, cases & credentials',
              href: '/admin/clients',
              icon: '👤',
            },
            {
              label: 'Case Management',
              detail: 'Stages, CNRs & hearings',
              href: '/admin/cases',
              icon: '📁',
            },
            {
              label: 'Document Vault',
              detail: 'Court orders & client visibility',
              href: '/admin/documents',
              icon: '📄',
            },
            {
              label: 'Audit Trail',
              detail: 'Security & mutation logs',
              href: '/admin/activity-logs',
              icon: '🔍',
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-start p-4 rounded border border-neutral-200 hover:border-black transition-all bg-neutral-50/50 hover:bg-white space-y-1.5 group"
            >
              <span className="text-2xl">{action.icon}</span>
              <div className="font-bold text-xs uppercase tracking-wider text-black group-hover:underline">
                {action.label}
              </div>
              <div className="text-[0.7rem] text-neutral-500">
                {action.detail}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
