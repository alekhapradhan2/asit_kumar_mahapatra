'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ECourtsLiveModal, { ECourtsCaseReport } from '@/components/shared/ECourtsLiveModal';

const stageSteps = [
  { id: 'CONSULTATION', label: 'Consultation & Review' },
  { id: 'FILED', label: 'Drafted & Filed' },
  { id: 'REGISTERED', label: 'Court Registered' },
  { id: 'HEARING_SCHEDULED', label: 'Hearings & Proceedings' },
  { id: 'AWAITING_JUDGMENT', label: 'Awaiting Judgment' },
  { id: 'WON', label: 'Verdict / Disposed' },
];

function getStageIndex(status: string) {
  switch (status) {
    case 'CONSULTATION':
    case 'DOCUMENTS_PENDING':
      return 0;
    case 'FILED':
      return 1;
    case 'REGISTERED':
      return 2;
    case 'HEARING_SCHEDULED':
      return 3;
    case 'AWAITING_JUDGMENT':
      return 4;
    case 'WON':
    case 'LOST':
    case 'CLOSED':
    case 'ARCHIVED':
      return 5;
    default:
      return 1;
  }
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

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.caseId as string;
  const [caseData, setCaseData] = useState<any>(null);
  const [ecourtsReport, setEcourtsReport] = useState<ECourtsCaseReport | null>(null);
  const [showECourtsModal, setShowECourtsModal] = useState(false);
  const [syncingECourts, setSyncingECourts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [copiedCNR, setCopiedCNR] = useState(false);

  const fetchCase = async () => {
    const token = sessionStorage.getItem('client_access_token');
    if (!token) {
      router.replace('/client/login');
      return;
    }

    try {
      setLoading(true);
      const [caseRes, timelineRes, hearingsRes, docsRes, ecourtsRes] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/timeline`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/hearings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents?caseId=${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/ecourts-data`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (caseRes.status === 'fulfilled' && caseRes.value.ok) {
        const data = await caseRes.value.json();
        const timeline =
          timelineRes.status === 'fulfilled' && timelineRes.value.ok
            ? (await timelineRes.value.json()).data
            : [];
        const hearings =
          hearingsRes.status === 'fulfilled' && hearingsRes.value.ok
            ? (await hearingsRes.value.json()).data
            : [];
        const docs =
          docsRes.status === 'fulfilled' && docsRes.value.ok
            ? (await docsRes.value.json()).data
            : [];

        if (ecourtsRes.status === 'fulfilled' && ecourtsRes.value.ok) {
          const eData = await ecourtsRes.value.json();
          setEcourtsReport(eData.data || null);
        }

        setCaseData({ ...data.data, timeline, hearings, documents: docs });
      } else {
        setError('Case matter not found or authorization expired.');
      }
    } catch {
      setError('Failed to load case details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId, router]);

  const handleSyncECourts = async () => {
    const token = sessionStorage.getItem('client_access_token');
    if (!token) return;

    setSyncingECourts(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/ecourts-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data?.report) {
          setEcourtsReport(result.data.report);
        }
        setNotice('Live status successfully synchronized from services.ecourts.gov.in');
        fetchCase();
      } else {
        const d = await res.json();
        alert(d.message || 'eCourts sync failed');
      }
    } catch {
      alert('Error connecting to eCourts synchronization service');
    } finally {
      setSyncingECourts(false);
    }
  };

  const copyCNR = (cnr: string) => {
    navigator.clipboard.writeText(cnr);
    setCopiedCNR(true);
    setTimeout(() => setCopiedCNR(false), 2000);
  };

  const getDownloadUrl = (docId: string) => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('client_access_token') : '';
    return `${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}/download?token=${token || ''}`;
  };

  if (loading && !caseData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-neutral-300 border-t-black rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-xs uppercase tracking-widest font-bold">
            Loading Court Matter Record...
          </p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="container-xl py-8 text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-neutral-600 text-sm font-semibold">{error || 'Matter record unavailable'}</p>
        <Link href="/client/dashboard" className="btn-primary text-xs uppercase tracking-wider inline-flex">
          ← Return to Portal Dashboard
        </Link>
      </div>
    );
  }

  const currentStageIdx = getStageIndex(caseData.currentStatus);

  return (
    <div className="container-xl space-y-8 page-transition max-w-5xl">
      {notice && (
        <div className="p-3.5 px-6 rounded bg-black text-white text-xs font-semibold flex items-center justify-between shadow-md">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice(null)} className="text-neutral-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* ─── Back Link ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/client/dashboard"
          className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-bold inline-flex items-center gap-1.5 transition-colors"
        >
          ← Back to All Matters
        </Link>

        <button
          onClick={handleSyncECourts}
          disabled={syncingECourts}
          className="btn-primary text-xs tracking-wider uppercase py-2 px-4 inline-flex items-center gap-2"
        >
          <span className={syncingECourts ? 'animate-spin' : ''}>🔄</span>
          <span>{syncingECourts ? 'Syncing eCourts...' : 'Refresh eCourts Status'}</span>
        </button>
      </div>

      {/* ─── Case Header Card ────────────────────────────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`status-badge ${statusColors[caseData.currentStatus] || 'status-pending'}`}>
                {formatStatus(caseData.currentStatus)}
              </span>
              <span className="font-mono text-xs font-bold bg-neutral-100 px-2.5 py-0.5 rounded border border-neutral-300 text-black">
                {caseData.internalCaseId}
              </span>
              {caseData.cnrNumber && (
                <button
                  onClick={() => copyCNR(caseData.cnrNumber)}
                  className="font-mono text-xs font-semibold bg-neutral-50 hover:bg-neutral-100 px-2.5 py-0.5 rounded border border-neutral-200 text-neutral-700 inline-flex items-center gap-1 transition-colors"
                  title="Click to copy 16-digit CNR"
                >
                  <span>CNR: {caseData.cnrNumber}</span>
                  <span>{copiedCNR ? '✓ Copied' : '📋'}</span>
                </button>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">
              {caseData.title}
            </h1>

            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-600 font-medium pt-1">
              <span>🏛️ {caseData.courtName || 'High Court of Orissa, Cuttack'}</span>
              <span>•</span>
              <span>📋 {caseData.practiceArea || 'Litigation'}</span>
              {caseData.courtCaseNumber && (
                <>
                  <span>•</span>
                  <span className="font-mono">Case No: {caseData.courtCaseNumber}</span>
                </>
              )}
            </div>
          </div>

          {caseData.nextHearingDate && (
            <div className="p-4 rounded bg-black text-white text-right flex-shrink-0 self-stretch md:self-auto">
              <div className="text-[0.65rem] uppercase tracking-widest text-amber-400 font-bold">
                Next Hearing Scheduled
              </div>
              <div className="font-serif text-lg font-bold text-white mt-0.5">
                📅 {new Date(caseData.nextHearingDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Visual Stage Progress Tracker ───────────────────────────────── */}
        <div className="space-y-3">
          <div className="text-[0.7rem] uppercase tracking-widest font-bold text-neutral-500">
            Case Matter Lifecycle Stage
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stageSteps.map((step, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded border text-center transition-all ${
                    isCurrent
                      ? 'bg-black text-white border-black shadow-sm font-bold'
                      : isPast
                      ? 'bg-neutral-100 text-black border-neutral-300 font-semibold'
                      : 'bg-white text-neutral-400 border-neutral-200'
                  }`}
                >
                  <div className="text-xs mb-1">
                    {isPast ? '✓' : isCurrent ? '⚡' : `${idx + 1}`}
                  </div>
                  <div className="text-[0.7rem] leading-tight">
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── eCourts Live Status Overview Banner ─────────────────────────────── */}
      <div className="p-6 rounded-lg bg-white border-2 border-black shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-black text-white flex items-center justify-center text-xl font-bold">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base text-black">
                  Official Government eCourts Case Status
                </h2>
                <span className="pulse-dot" />
              </div>
              <p className="text-[0.7rem] text-neutral-500 font-mono">
                {caseData.cnrNumber ? `CNR: ${caseData.cnrNumber}` : 'Government Case Ledger'} • services.ecourts.gov.in
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/client/cases/${caseId}/ecourts`}
              className="btn-primary text-xs uppercase tracking-wider py-2 px-4 inline-flex items-center gap-1.5"
            >
              <span>🏛️</span>
              <span>Open Dedicated eCourts Ledger Page →</span>
            </Link>
          </div>
        </div>

        {ecourtsReport ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div className="p-3 rounded bg-neutral-50 border border-neutral-200">
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Court Forum</span>
              <span className="font-bold text-black">{ecourtsReport.courtDetails.courtName}</span>
            </div>
            <div className="p-3 rounded bg-neutral-50 border border-neutral-200">
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Disposal / Stage</span>
              <span className="font-bold text-black">{ecourtsReport.caseStatus.subStage || ecourtsReport.caseStatus.caseStatus}</span>
            </div>
            <div className="p-3 rounded bg-neutral-50 border border-neutral-200">
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Registered Date</span>
              <span className="font-semibold text-black">{ecourtsReport.courtDetails.registrationDate}</span>
            </div>
            <div className="p-3 rounded bg-neutral-50 border border-neutral-200">
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Presiding Officer</span>
              <span className="font-semibold text-black truncate block">{ecourtsReport.caseStatus.courtNumberAndJudge}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-neutral-500 flex items-center justify-between py-2">
            <span>Click &ldquo;Refresh eCourts Status&rdquo; to fetch the latest filings, orders, and hearing dates from the court portal.</span>
          </div>
        )}
      </div>

      {/* ─── Two-Column Section: Timeline Events & Hearing History ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Events */}
        <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-black flex items-center gap-2 border-b border-neutral-200 pb-3">
            <span>📜</span>
            <span>Case Progression Timeline</span>
          </h2>

          {caseData.timeline && caseData.timeline.length > 0 ? (
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-neutral-200 pl-6">
              {caseData.timeline.map((evt: any) => (
                <div key={evt.id} className="relative space-y-1">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-black border-2 border-white" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-black">{evt.title}</span>
                    <span className="text-[0.65rem] text-neutral-400">
                      {new Date(evt.eventDate || evt.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {evt.description && (
                    <p className="text-xs text-neutral-600 leading-relaxed">{evt.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-neutral-400">
              Initial filings recorded. Proceedings will be updated following upcoming board hearings.
            </div>
          )}
        </div>

        {/* Hearing Schedule & History */}
        <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-black flex items-center gap-2 border-b border-neutral-200 pb-3">
            <span>🏛️</span>
            <span>Court Hearings & Proceedings</span>
          </h2>

          {caseData.hearings && caseData.hearings.length > 0 ? (
            <div className="space-y-3">
              {caseData.hearings.map((h: any) => (
                <div
                  key={h.id}
                  className="p-3.5 rounded border border-neutral-200 bg-neutral-50/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-black">
                      📅 {new Date(h.hearingDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="status-badge status-won text-[0.65rem]">
                      {h.purpose || 'Bench Hearing'}
                    </span>
                  </div>
                  {h.bench && (
                    <div className="text-[0.7rem] text-neutral-500 font-medium">
                      Bench: {h.bench}
                    </div>
                  )}
                  {h.notes && (
                    <p className="text-xs text-neutral-700 pt-1 border-t border-neutral-200/60">
                      {h.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-neutral-400 space-y-1">
              <p>Hearing dates will appear here once listed on the daily causelist of the court.</p>
              {caseData.nextHearingDate && (
                <p className="font-bold text-black pt-2">
                  Next Scheduled Date: {new Date(caseData.nextHearingDate).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Case Linked Documents ───────────────────────────────────────────── */}
      <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
        <h2 className="font-serif font-bold text-base text-black flex items-center gap-2 border-b border-neutral-200 pb-3">
          <span>📄</span>
          <span>Associated Court Orders, Petitions & Records</span>
        </h2>

        {caseData.documents && caseData.documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-800">
              <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
                <tr>
                  <th className="p-3">Document Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Uploaded Date</th>
                  <th className="p-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {caseData.documents.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-neutral-50">
                    <td className="p-3 font-bold text-black flex items-center gap-2">
                      <span>📄</span>
                      <span>{doc.title}</span>
                    </td>
                    <td className="p-3">
                      <span className="bg-neutral-100 px-2 py-0.5 rounded text-[0.7rem] font-bold text-neutral-700 border border-neutral-200">
                        {doc.docType?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-500">
                      {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={getDownloadUrl(doc.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-black bg-neutral-100 hover:bg-black hover:text-white px-3 py-1 rounded transition-all border border-neutral-300 text-[0.7rem] uppercase tracking-wider"
                      >
                        ⬇️ Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-neutral-400">
            No specific documents attached to this case matter yet.
          </div>
        )}
      </div>

      {/* ─── Full eCourts Report Modal ─────────────────────────────────────── */}
      {showECourtsModal && (
        <ECourtsLiveModal
          report={ecourtsReport}
          caseId={caseId}
          onClose={() => setShowECourtsModal(false)}
          onRefresh={handleSyncECourts}
          refreshing={syncingECourts}
        />
      )}
    </div>
  );
}
