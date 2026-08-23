'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiUrl } from '@/lib/config';

interface CaseDTO {
  id: string;
  internalCaseId: string;
  title: string;
  caseType: string;
  practiceArea: string;
  courtName?: string;
  currentStatus: string;
  nextHearingDate?: string;
  priority: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  WON: 'status-won',
  FILED: 'status-filed',
  REGISTERED: 'status-filed',
  HEARING_SCHEDULED: 'status-hearing',
  CONSULTATION: 'status-pending',
  DOCUMENTS_PENDING: 'status-pending',
  AWAITING_JUDGMENT: 'status-hearing',
  ARCHIVED: 'status-closed',
  CLOSED: 'status-closed',
  LOST: 'status-urgent',
};

function formatStatus(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<CaseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('client_user');
    const token = sessionStorage.getItem('client_access_token');

    if (!storedUser || !token) {
      router.replace('/client/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    // Fetch cases
    fetch(`${apiUrl}/cases`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          sessionStorage.clear();
          router.replace('/client/login');
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.data) setCases(data.data);
      })
      .catch(() => setError('Failed to load cases. Please refresh.'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.replace('/client/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading your cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl py-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">
            Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Client ID: <span className="font-mono text-yellow-400">{user?.clientId}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          id="logout-btn"
          className="text-sm text-slate-400 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-all hover:border-white/30"
        >
          Sign Out
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {/* Cases */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Your Cases</h2>
        <span className="text-sm text-slate-400">{cases.length} case{cases.length !== 1 ? 's' : ''}</span>
      </div>

      {cases.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-4">📁</div>
          <h3 className="font-serif text-xl font-bold text-white mb-2">No Cases Yet</h3>
          <p className="text-slate-400 text-sm">Your cases will appear here once added by the Advocate.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => (
            <Link
              key={c.id}
              href={`/client/cases/${c.id}`}
              id={`case-card-${c.id}`}
              className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 group hover:border-yellow-400/20"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`status-badge ${statusColors[c.currentStatus] || 'status-pending'}`}>
                    {formatStatus(c.currentStatus)}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{c.internalCaseId}</span>
                </div>
                <h3 className="font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">
                  {c.title}
                </h3>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
                  <span>📋 {c.practiceArea}</span>
                  {c.courtName && <span>🏛️ {c.courtName}</span>}
                  {c.nextHearingDate && (
                    <span className="text-yellow-400">
                      📅 Next: {new Date(c.nextHearingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium group-hover:translate-x-1 transition-transform flex-shrink-0">
                View Details
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
