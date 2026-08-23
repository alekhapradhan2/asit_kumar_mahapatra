'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const updateSourceLabels: Record<string, { label: string; color: string; icon: string }> = {
  OFFICIAL_COURT_DATA: { label: 'Official Court Data', color: '#4ade80', icon: '🏛️' },
  ADVOCATE_UPDATE: { label: 'Advocate Update', color: '#f6c234', icon: '👨‍⚖️' },
  ADMIN_UPDATE: { label: 'Administrative Update', color: '#60a5fa', icon: '📋' },
  SYSTEM_SYNC: { label: 'System Sync', color: '#c084fc', icon: '🔄' },
};

const statusColors: Record<string, string> = {
  WON: 'status-won', FILED: 'status-filed', REGISTERED: 'status-filed',
  HEARING_SCHEDULED: 'status-hearing', CONSULTATION: 'status-pending',
  DOCUMENTS_PENDING: 'status-pending', AWAITING_JUDGMENT: 'status-hearing',
  ARCHIVED: 'status-closed', CLOSED: 'status-closed', LOST: 'status-urgent',
};

function formatStatus(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.caseId as string;
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('client_access_token');
    if (!token) { router.replace('/client/login'); return; }

    const fetchCase = async () => {
      try {
        const [caseRes, timelineRes, hearingsRes, verdictRes] = await Promise.allSettled([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/timeline`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/hearings`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/verdict`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (caseRes.status === 'fulfilled' && caseRes.value.ok) {
          const data = await caseRes.value.json();
          const timeline = timelineRes.status === 'fulfilled' && timelineRes.value.ok
            ? (await timelineRes.value.json()).data : [];
          const hearings = hearingsRes.status === 'fulfilled' && hearingsRes.value.ok
            ? (await hearingsRes.value.json()).data : [];
          const verdict = verdictRes.status === 'fulfilled' && verdictRes.value.ok
            ? (await verdictRes.value.json()).data : null;

          setCaseData({ ...data.data, timeline, hearings, verdict });
        } else {
          setError('Case not found or access denied.');
        }
      } catch {
        setError('Failed to load case details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId, router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="container-xl py-8 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <p className="text-slate-400">{error}</p>
      <Link href="/client/dashboard" className="btn-outline mt-6 inline-flex">← Back to Dashboard</Link>
    </div>
  );

  if (!caseData) return null;

  return (
    <div className="container-xl py-8 max-w-4xl">
      {/* Back */}
      <Link href="/client/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
        ← Back to Dashboard
      </Link>

      {/* Case Header */}
      <div className="glass-card p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`status-badge ${statusColors[caseData.currentStatus] || 'status-pending'}`}>
                {formatStatus(caseData.currentStatus)}
              </span>
              <span className="text-xs text-slate-500 font-mono">{caseData.internalCaseId}</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">{caseData.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
          {[
            { label: 'Practice Area', value: caseData.practiceArea, icon: '⚖️' },
            { label: 'Case Type', value: caseData.caseType, icon: '📋' },
            { label: 'Court', value: caseData.courtName || 'TBD', icon: '🏛️' },
            { label: 'Case Number', value: caseData.caseNumber || 'Pending', icon: '🔢' },
            { label: 'CNR Number', value: caseData.cnrNumber || 'Pending', icon: '📌' },
            { label: 'Next Hearing', value: caseData.nextHearingDate ? new Date(caseData.nextHearingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : 'Not scheduled', icon: '📅' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 uppercase tracking-wide">{item.icon} {item.label}</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verdict (if case closed) */}
      {caseData.verdict && (
        <div className="glass-card p-8 mb-6 border-yellow-400/20" style={{ borderColor: 'rgba(246,194,52,0.2)' }}>
          <h2 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">
            🏆 Case Outcome
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <span className={`status-badge ${caseData.verdict.outcome === 'WON' ? 'status-won' : 'status-closed'}`}>
              {caseData.verdict.outcome}
            </span>
            {caseData.verdict.verdictDate && (
              <span className="text-sm text-slate-400">
                {new Date(caseData.verdict.verdictDate).toLocaleDateString('en-IN')}
              </span>
            )}
          </div>
          {caseData.verdict.clientSummary && (
            <p className="text-slate-300 text-sm leading-relaxed">{caseData.verdict.clientSummary}</p>
          )}
        </div>
      )}

      {/* Case Timeline */}
      <div className="glass-card p-8 mb-6">
        <h2 className="font-serif text-xl font-bold text-white mb-8">Case Timeline</h2>
        {caseData.timeline?.length ? (
          <div className="space-y-0">
            {caseData.timeline.map((entry: any, i: number) => {
              const sourceInfo = updateSourceLabels[entry.source] || { label: entry.source, color: '#94a3b8', icon: '📝' };
              const isLast = i === caseData.timeline.length - 1;

              return (
                <div key={entry.id} className="flex gap-4">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className={`timeline-dot ${i === 0 ? 'active' : ''}`} />
                    {!isLast && <div className="timeline-line flex-1 my-1" style={{ minHeight: '2rem' }} />}
                  </div>

                  {/* Content */}
                  <div className={`pb-8 ${isLast ? 'pb-0' : ''} flex-1 min-w-0`}>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {/* Source badge - CRITICAL: clearly labels official vs advocate data */}
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: `${sourceInfo.color}18`,
                          border: `1px solid ${sourceInfo.color}30`,
                          color: sourceInfo.color,
                        }}
                      >
                        {sourceInfo.icon} {sourceInfo.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{entry.title}</h3>
                    {entry.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">{entry.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">No timeline entries yet.</p>
        )}
      </div>

      {/* Hearings */}
      {caseData.hearings?.length > 0 && (
        <div className="glass-card p-8">
          <h2 className="font-serif text-xl font-bold text-white mb-6">Hearing History</h2>
          <div className="space-y-4">
            {caseData.hearings.map((hearing: any) => (
              <div key={hearing.id} className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-white">
                      📅 {new Date(hearing.hearingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    {hearing.purpose && <div className="text-xs text-slate-400 mt-1">{hearing.purpose}</div>}
                    {hearing.result && <div className="text-xs text-emerald-400 mt-1">Result: {hearing.result}</div>}
                  </div>
                  {hearing.nextDate && (
                    <div className="text-xs text-yellow-400 text-right flex-shrink-0">
                      Next: {new Date(hearing.nextDate).toLocaleDateString('en-IN')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
