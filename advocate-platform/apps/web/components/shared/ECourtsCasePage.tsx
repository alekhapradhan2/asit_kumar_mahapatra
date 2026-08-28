'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export interface ECourtsCaseReport {
  cnrNumber: string;
  scrapedAt: string;
  sourceUrl: string;
  courtDetails: {
    courtName: string;
    caseType: string;
    filingNumber: string;
    filingDate: string;
    registrationNumber: string;
    registrationDate: string;
    cnrNumber: string;
    state?: string;
    district?: string;
  };
  caseStatus: {
    firstHearingDate: string;
    decisionDate?: string;
    nextHearingDate?: string;
    caseStatus: string;
    subStage: string;
    natureOfDisposal?: string;
    courtNumberAndJudge: string;
  };
  firDetails?: {
    policeStation: string;
    firNumber: string;
    year: string;
  };
  petitioners: Array<{ id: number; name: string; advocate: string }>;
  respondents: Array<{ id: number; name: string; advocate?: string }>;
  acts: Array<{ act: string; section: string }>;
  caseHistoryAllDays: Array<{
    businessDate: string;
    judge: string;
    hearingDate: string;
    purposeOfHearing: string;
    proceedingNotes: string;
    presentee?: string;
    business?: string;
    natureOfDisposal?: string;
    disposalDate?: string;
  }>;
  finalJudgementPdf?: {
    orderNumber: string;
    orderDate: string;
    orderDetails: string;
    pdfUrl: string;
    presidingJudge: string;
    courtName: string;
    decreeSummary?: string;
    totalPages?: number;
  };
}

interface ECourtsCasePageProps {
  caseId: string;
  backUrl: string;
  backLabel: string;
  userRole: 'ADMIN' | 'CLIENT';
}

export default function ECourtsCasePage({
  caseId,
  backUrl,
  backLabel,
  userRole,
}: ECourtsCasePageProps) {
  const [report, setReport] = useState<ECourtsCaseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [selectedDailyStatus, setSelectedDailyStatus] = useState<
    ECourtsCaseReport['caseHistoryAllDays'][0] | null
  >(null);

  const fetchECourtsData = async () => {
    const token =
      userRole === 'ADMIN'
        ? sessionStorage.getItem('admin_access_token')
        : sessionStorage.getItem('client_access_token');

    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/ecourts-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const d = await res.json();
        setReport(d.data || null);
      } else {
        setError('Failed to load eCourts case ledger.');
      }
    } catch {
      setError('Connection error while fetching eCourts data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchECourtsData();
  }, [caseId, userRole]);

  const handleRefresh = async () => {
    const token =
      userRole === 'ADMIN'
        ? sessionStorage.getItem('admin_access_token')
        : sessionStorage.getItem('client_access_token');

    if (!token) return;

    setRefreshing(true);
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
          setReport(result.data.report);
        }
        setNotice('Case status and proceedings refreshed live from services.ecourts.gov.in');
        fetchECourtsData();
      } else {
        const d = await res.json();
        alert(d.message || 'eCourts sync failed');
      }
    } catch {
      alert('Error connecting to eCourts synchronization service');
    } finally {
      setRefreshing(false);
    }
  };

  const copyCNR = () => {
    if (report?.cnrNumber) {
      navigator.clipboard.writeText(report.cnrNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-neutral-300 border-t-black rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-xs uppercase tracking-widest font-bold">
            Synchronizing eCourts Case Ledger...
          </p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container-xl py-12 text-center space-y-4 max-w-xl mx-auto">
        <div className="text-5xl">🏛️</div>
        <h2 className="font-serif text-xl font-bold text-black">eCourts Ledger Unavailable</h2>
        <p className="text-neutral-600 text-xs leading-relaxed">
          {error || 'Unable to retrieve court ledger for this matter. Ensure a valid 16-digit CNR number is configured.'}
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link href={backUrl} className="btn-primary text-xs uppercase tracking-wider">
            {backLabel}
          </Link>
          <button onClick={handleRefresh} className="btn-outline text-xs uppercase tracking-wider">
            Retry Sync
          </button>
        </div>
      </div>
    );
  }

  const petitionerTitle = report.petitioners.map((p) => p.name).join(', ') || 'Petitioner';
  const respondentTitle = report.respondents.map((r) => r.name).join(', ') || 'Respondent';
  const caseTitleVs = `${petitionerTitle} versus ${respondentTitle}`;

  // Filter case history hearings
  const filteredHistory = report.caseHistoryAllDays.filter((h) => {
    if (!historySearch) return true;
    const term = historySearch.toLowerCase();
    return (
      h.businessDate.toLowerCase().includes(term) ||
      h.purposeOfHearing.toLowerCase().includes(term) ||
      h.judge.toLowerCase().includes(term) ||
      (h.hearingDate && h.hearingDate.toLowerCase().includes(term))
    );
  });

  return (
    <div className="container-xl space-y-6 page-transition max-w-6xl">
      {notice && (
        <div className="p-3.5 px-6 rounded bg-black text-white text-xs font-semibold flex items-center justify-between shadow-md">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice(null)} className="text-neutral-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* ─── Breadcrumb Navigation ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href={backUrl}
          className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-bold inline-flex items-center gap-1.5 transition-colors"
        >
          ← {backLabel}
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            id="btn-page-refresh-ecourts"
            className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
            <span>{refreshing ? 'Connecting to eCourts...' : 'Refresh Status from eCourts'}</span>
          </button>
        </div>
      </div>

      {/* ─── Top Master Court Banner ────────────────────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-neutral-200 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest bg-black text-amber-300 px-3 py-1 rounded font-mono">
                🏛️ Official eCourts Live Sync
              </span>
              <span className="status-badge status-won text-[0.65rem]">
                {report.caseStatus.caseStatus}
              </span>
              <button
                onClick={copyCNR}
                className="font-mono text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-black px-2.5 py-1 rounded border border-neutral-300 inline-flex items-center gap-1 transition-colors"
                title="Click to copy 16-digit CNR"
              >
                <span>CNR: {report.cnrNumber}</span>
                <span>{copied ? '✓ Copied' : '📋'}</span>
              </button>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">
              {report.courtDetails.courtName}
            </h1>

            <div className="text-xs font-semibold text-neutral-700">
              In the court of: <span className="font-bold text-black">{report.caseStatus.courtNumberAndJudge}</span>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-600 font-medium pt-1">
              <span>Case: <strong className="text-black">{report.courtDetails.caseType} No. {report.courtDetails.registrationNumber}</strong></span>
              <span>•</span>
              <span>Filing: <strong className="text-black">{report.courtDetails.filingNumber}</strong> ({report.courtDetails.filingDate})</span>
              <span>•</span>
              <span className="text-neutral-500">State: {report.courtDetails.state || 'India'}</span>
            </div>
          </div>

          <div className="p-5 rounded bg-neutral-50 border border-neutral-200 text-right flex-shrink-0 self-stretch lg:self-auto space-y-1">
            <div className="text-[0.65rem] uppercase tracking-widest text-neutral-500 font-bold">
              Final Outcome / Decision
            </div>
            <div className="font-serif text-xl font-bold text-black">
              {report.caseStatus.natureOfDisposal || report.caseStatus.caseStatus}
            </div>
            <div className="text-xs text-neutral-500 font-mono">
              {report.caseStatus.decisionDate ? `Date: ${report.caseStatus.decisionDate}` : 'Pending Adjudication'}
            </div>
          </div>
        </div>

        {/* ─── Cause Title & Parties Strip ─────────────────────────────────── */}
        <div className="p-4 rounded bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[0.65rem] uppercase font-bold text-neutral-400">Cause Title / Parties</div>
            <div className="font-bold text-sm text-black">{caseTitleVs}</div>
          </div>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/judgment-download?token=${
              typeof window !== 'undefined'
                ? userRole === 'ADMIN'
                  ? sessionStorage.getItem('admin_access_token') || ''
                  : sessionStorage.getItem('client_access_token') || ''
                : ''
            }`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-xs uppercase tracking-wider py-2 px-4 inline-flex items-center gap-1.5 flex-shrink-0"
          >
            <span>📄</span>
            <span>Download Copy of Order</span>
          </a>
        </div>
      </div>

      {/* ─── DAILY STATUS MODAL / DRILLDOWN SHEET ──────────────────────────── */}
      {selectedDailyStatus && (
        <div className="glass-card p-6 sm:p-8 bg-white border-2 border-black shadow-lg rounded-lg space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <button
              onClick={() => setSelectedDailyStatus(null)}
              className="px-4 py-1.5 rounded bg-black hover:bg-neutral-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>← Back to All Hearing Dates</span>
            </button>

            <span className="font-mono text-xs text-neutral-500 font-semibold">
              Inspection of Daily Proceeding: {selectedDailyStatus.businessDate}
            </span>
          </div>

          <div className="text-center space-y-1 border-b border-neutral-200 pb-5">
            <h2 className="font-serif text-2xl font-bold text-black">Daily Status</h2>
            <div className="text-xs text-neutral-700 font-semibold">{report.courtDetails.courtName}</div>
            <div className="text-xs text-neutral-600">
              In the court of: <span className="font-bold text-black">{selectedDailyStatus.judge}</span>
            </div>
            <div className="text-xs font-mono font-bold text-black pt-1">
              CNR Number: {report.cnrNumber}
            </div>
            <div className="text-xs font-mono font-semibold text-neutral-800">
              Case Number: {report.courtDetails.caseType}/{report.courtDetails.registrationNumber}
            </div>
            <div className="text-xs font-bold text-black pt-1">
              {caseTitleVs}
            </div>
            <div className="text-xs font-semibold text-neutral-700">
              Business Date: {selectedDailyStatus.businessDate}
            </div>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-bold text-neutral-700">Presentee</span>
              <span className="col-span-2 text-neutral-900 font-medium">
                : {selectedDailyStatus.presentee || 'State APP, Accused with Counsel'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="font-bold text-neutral-700">Business</span>
              <span className="col-span-2 text-neutral-900 font-bold">
                : {selectedDailyStatus.business || selectedDailyStatus.purposeOfHearing}
              </span>
            </div>

            {selectedDailyStatus.natureOfDisposal && (
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-neutral-700">Nature of Disposal</span>
                <span className="col-span-2 text-neutral-900 font-bold uppercase text-emerald-800">
                  : {selectedDailyStatus.natureOfDisposal}
                </span>
              </div>
            )}

            {selectedDailyStatus.disposalDate && (
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-neutral-700">Disposal Date</span>
                <span className="col-span-2 text-neutral-900 font-semibold">
                  : {selectedDailyStatus.disposalDate}
                </span>
              </div>
            )}

            {selectedDailyStatus.hearingDate && selectedDailyStatus.hearingDate !== '-' && (
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-neutral-700">Next Hearing Date Fixed</span>
                <span className="col-span-2 text-neutral-900 font-bold">
                  : 📅 {selectedDailyStatus.hearingDate}
                </span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-200">
              <span className="font-bold text-neutral-700">Full Proceeding Notes</span>
              <span className="col-span-2 text-neutral-800 leading-relaxed bg-neutral-50 p-4 rounded border border-neutral-200 text-xs">
                {selectedDailyStatus.proceedingNotes}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 text-right text-xs font-bold text-neutral-700">
            {selectedDailyStatus.judge}
          </div>
        </div>
      )}

      {/* ─── 4-Card Case Particulars Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Card 1: Registration Details */}
        <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm space-y-2">
          <h3 className="font-serif font-bold text-sm text-black flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <span>📋</span>
            <span>Registration Particulars</span>
          </h3>
          <div className="space-y-1.5">
            <div>
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Case Type</span>
              <span className="font-bold text-black">{report.courtDetails.caseType}</span>
            </div>
            <div>
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Filing No. & Date</span>
              <span className="font-mono text-black">{report.courtDetails.filingNumber} ({report.courtDetails.filingDate})</span>
            </div>
            <div>
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Registration No.</span>
              <span className="font-mono font-bold text-black">{report.courtDetails.registrationNumber}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Status & Stage */}
        <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm space-y-2">
          <h3 className="font-serif font-bold text-sm text-black flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <span>⚖️</span>
            <span>Status & Disposition</span>
          </h3>
          <div className="space-y-1.5">
            <div>
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">First Hearing</span>
              <span className="text-black font-medium">{report.caseStatus.firstHearingDate}</span>
            </div>
            <div>
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Decision / Next Date</span>
              <span className="font-bold text-black">{report.caseStatus.decisionDate || report.caseStatus.nextHearingDate || '—'}</span>
            </div>
            <div>
              <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Sub Stage</span>
              <span className="text-black font-semibold">{report.caseStatus.subStage}</span>
            </div>
          </div>
        </div>

        {/* Card 3: FIR Details */}
        <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm space-y-2">
          <h3 className="font-serif font-bold text-sm text-black flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <span>🚔</span>
            <span>FIR & Police Details</span>
          </h3>
          {report.firDetails ? (
            <div className="space-y-1.5">
              <div>
                <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Police Station</span>
                <span className="font-bold text-black">{report.firDetails.policeStation}</span>
              </div>
              <div>
                <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">FIR No. & Year</span>
                <span className="font-mono font-bold text-black">{report.firDetails.firNumber} / {report.firDetails.year}</span>
              </div>
            </div>
          ) : (
            <div className="text-neutral-400 italic py-2">No FIR particulars (Civil / Writ Matter)</div>
          )}
        </div>

        {/* Card 4: Acts & Sections */}
        <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm space-y-2">
          <h3 className="font-serif font-bold text-sm text-black flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <span>📜</span>
            <span>Statutory Acts & Sections</span>
          </h3>
          <div className="space-y-1.5">
            {report.acts && report.acts.length > 0 ? (
              report.acts.map((a, i) => (
                <div key={i} className="space-y-0.5">
                  <span className="font-bold text-black block">{a.act}</span>
                  <span className="font-mono text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded text-[0.7rem] inline-block border border-neutral-200">
                    Sec: {a.section}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-neutral-400 italic">General Statutes</span>
            )}
          </div>
        </div>
      </div>

      {/* ─── Parties & Advocates Table ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Petitioners */}
        <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-base text-black flex items-center gap-2 border-b border-neutral-100 pb-3">
            <span>👥</span>
            <span>Petitioner and Advocate ({report.petitioners.length})</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 uppercase text-[0.65rem] font-bold text-neutral-600 border-b border-neutral-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Petitioner / Complainant</th>
                  <th className="p-3">Advocate / Counsel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {report.petitioners.map((p, i) => (
                  <tr key={i} className="hover:bg-neutral-50">
                    <td className="p-3 font-mono font-bold text-neutral-500">{p.id || i + 1}</td>
                    <td className="p-3 font-bold text-black">{p.name}</td>
                    <td className="p-3 font-medium text-neutral-700">⚖️ {p.advocate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Respondents */}
        <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-base text-black flex items-center gap-2 border-b border-neutral-100 pb-3">
            <span>🛡️</span>
            <span>Respondent and Advocate ({report.respondents.length})</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 uppercase text-[0.65rem] font-bold text-neutral-600 border-b border-neutral-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Respondent / Accused</th>
                  <th className="p-3">Advocate / Counsel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {report.respondents.map((r, i) => (
                  <tr key={i} className="hover:bg-neutral-50">
                    <td className="p-3 font-mono font-bold text-neutral-500">{r.id || i + 1}</td>
                    <td className="p-3 font-bold text-black">{r.name}</td>
                    <td className="p-3 font-medium text-neutral-700">{r.advocate ? `⚖️ ${r.advocate}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Case History: All 35 Listed Hearing Dates ──────────────────────── */}
      <div className="glass-card p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-black flex items-center gap-2">
              <span>📅</span>
              <span>Case History ({report.caseHistoryAllDays.length} Listed Hearing Dates)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Click any blue &ldquo;Business on Date&rdquo; link to inspect the daily status sheet and court notes
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search date, purpose, or judge..."
              className="form-input pl-8 text-xs py-1.5 bg-neutral-50 border-neutral-200 focus:bg-white"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded border border-neutral-300 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#e8f3d6] text-neutral-900 font-serif font-bold text-[0.75rem] border-b border-neutral-300">
              <tr>
                <th className="p-3.5">Judge</th>
                <th className="p-3.5">Business on Date (Click for Status)</th>
                <th className="p-3.5">Hearing Date</th>
                <th className="p-3.5">Purpose of Hearing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((h, i) => (
                  <tr key={i} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 text-neutral-700 font-medium max-w-xs truncate">
                      {h.judge}
                    </td>
                    <td className="p-3 font-bold">
                      <button
                        onClick={() => {
                          setSelectedDailyStatus(h);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className="text-blue-700 hover:text-blue-900 hover:underline font-mono text-xs cursor-pointer font-bold inline-flex items-center gap-1"
                        title="Click to view Daily Status Sheet"
                      >
                        <span>{h.businessDate}</span>
                        <span className="text-[0.65rem]">↗</span>
                      </button>
                    </td>
                    <td className="p-3 font-mono font-medium text-neutral-800">
                      {h.hearingDate && h.hearingDate !== '-' ? (
                        h.hearingDate
                      ) : (
                        <span className="status-badge status-won text-[0.65rem]">Disposed</span>
                      )}
                    </td>
                    <td className="p-3 font-medium text-neutral-900">
                      <span
                        className={`px-2 py-0.5 rounded text-[0.7rem] font-semibold ${
                          h.purposeOfHearing.toLowerCase().includes('disposed')
                            ? 'bg-emerald-100 text-emerald-900 font-bold'
                            : h.purposeOfHearing.toLowerCase().includes('warrant')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {h.purposeOfHearing}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-400">
                    No hearings match &ldquo;{historySearch}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
