'use client';
import { useState } from 'react';

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

interface ECourtsLiveModalProps {
  report: ECourtsCaseReport | null;
  caseId?: string;
  onClose: () => void;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
}

export default function ECourtsLiveModal({
  report,
  caseId,
  onClose,
  onRefresh,
  refreshing = false,
}: ECourtsLiveModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<
    'details' | 'parties' | 'proceedings' | 'judgment'
  >('details');
  const [selectedDailyStatus, setSelectedDailyStatus] = useState<
    ECourtsCaseReport['caseHistoryAllDays'][0] | null
  >(null);

  if (!report) return null;

  const copyCNR = () => {
    if (report?.cnrNumber) {
      navigator.clipboard.writeText(report.cnrNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const petitionerTitle = report.petitioners.map((p) => p.name).join(', ') || 'Petitioner';
  const respondentTitle = report.respondents.map((r) => r.name).join(', ') || 'Respondent';
  const caseTitleVs = `${petitionerTitle} versus ${respondentTitle}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="glass-card bg-white w-full max-w-4xl border border-black shadow-2xl rounded-lg max-h-[92vh] flex flex-col overflow-hidden text-neutral-900">
        {/* ─── Top Government Scraper Header ───────────────────────────────── */}
        <div className="p-5 sm:p-6 bg-black text-white flex items-start justify-between gap-4 flex-shrink-0">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest bg-white/20 text-amber-300 px-2.5 py-0.5 rounded font-mono">
                🏛️ Official eCourts Live Sync
              </span>
              <span className="text-[0.65rem] text-neutral-300 font-mono">
                Source: services.ecourts.gov.in
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white truncate">
                {report.courtDetails.courtName}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={copyCNR}
                className="font-mono text-xs font-bold bg-white text-black px-2.5 py-1 rounded hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5"
                title="Click to copy 16-digit Government CNR"
              >
                <span>CNR: {report.cnrNumber}</span>
                <span>{copied ? '✓ Copied' : '📋'}</span>
              </button>

              <span className="text-[0.7rem] text-neutral-300">
                Synced: {new Date(report.scrapedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })},{' '}
                {new Date(report.scrapedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className="px-3 py-1.5 rounded bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                <span>{refreshing ? 'Syncing...' : 'Refresh Status'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-sm"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ─── Section Navigation Chips ─────────────────────────────────────── */}
        <div className="flex border-b border-neutral-200 px-6 gap-6 bg-neutral-50 text-xs font-bold uppercase tracking-wider overflow-x-auto flex-shrink-0">
          <button
            onClick={() => {
              setActiveSection('details');
              setSelectedDailyStatus(null);
            }}
            className={`py-3.5 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
              activeSection === 'details' && !selectedDailyStatus
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            🏛️ Case Particulars & Status
          </button>
          <button
            onClick={() => {
              setActiveSection('parties');
              setSelectedDailyStatus(null);
            }}
            className={`py-3.5 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
              activeSection === 'parties' && !selectedDailyStatus
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            👥 Parties & Advocates ({report.petitioners.length + report.respondents.length})
          </button>
          <button
            onClick={() => {
              setActiveSection('proceedings');
              setSelectedDailyStatus(null);
            }}
            className={`py-3.5 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
              activeSection === 'proceedings' || selectedDailyStatus
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            📅 Date-by-Date Case History ({report.caseHistoryAllDays.length} Hearings)
          </button>
          {report.finalJudgementPdf && (
            <button
              onClick={() => {
                setActiveSection('judgment');
                setSelectedDailyStatus(null);
              }}
              className={`py-3.5 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                activeSection === 'judgment' && !selectedDailyStatus
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              📄 Final Order & Judgment
            </button>
          )}
        </div>

        {/* ─── Modal Scrollable Body ────────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* ────── DAILY STATUS DRILLDOWN VIEW (MATCHING OFFICIAL SCREENSHOT) ────── */}
          {selectedDailyStatus ? (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <button
                  onClick={() => setSelectedDailyStatus(null)}
                  className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>← Back to All Dates</span>
                </button>

                <span className="font-mono text-xs text-neutral-500 font-semibold">
                  Business Date: {selectedDailyStatus.businessDate}
                </span>
              </div>

              {/* Exact Daily Status Sheet matching eCourts Screenshot */}
              <div className="p-6 sm:p-8 rounded border border-neutral-300 bg-white shadow-xs space-y-5">
                <div className="text-center space-y-1">
                  <h3 className="font-serif text-lg font-bold text-black">Daily Status</h3>
                  <div className="text-xs text-neutral-700 font-semibold">{report.courtDetails.courtName}</div>
                  <div className="text-xs text-neutral-600">
                    In the court of : <span className="font-bold text-black">{selectedDailyStatus.judge}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-black pt-1">
                    CNR Number : {report.cnrNumber}
                  </div>
                  <div className="text-xs font-mono font-semibold text-neutral-800">
                    Case Number :{report.courtDetails.caseType}/{report.courtDetails.registrationNumber}
                  </div>
                  <div className="text-xs font-bold text-black pt-1">
                    {caseTitleVs}
                  </div>
                  <div className="text-xs font-semibold text-neutral-700">
                    Date : {selectedDailyStatus.businessDate}
                  </div>
                </div>

                <div className="border-t border-neutral-300 pt-5 space-y-3 font-sans text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-semibold text-neutral-700">Presentee</span>
                    <span className="col-span-2 text-neutral-900 font-medium">
                      : {selectedDailyStatus.presentee || 'State APP, Accused with Counsel'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-semibold text-neutral-700">Business</span>
                    <span className="col-span-2 text-neutral-900 font-bold">
                      : {selectedDailyStatus.business || selectedDailyStatus.purposeOfHearing}
                    </span>
                  </div>

                  {selectedDailyStatus.natureOfDisposal && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-semibold text-neutral-700">Nature of Disposal</span>
                      <span className="col-span-2 text-neutral-900 font-bold uppercase">
                        : {selectedDailyStatus.natureOfDisposal}
                      </span>
                    </div>
                  )}

                  {selectedDailyStatus.disposalDate && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-semibold text-neutral-700">Disposal Date</span>
                      <span className="col-span-2 text-neutral-900 font-semibold">
                        : {selectedDailyStatus.disposalDate}
                      </span>
                    </div>
                  )}

                  {selectedDailyStatus.hearingDate && selectedDailyStatus.hearingDate !== '-' && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-semibold text-neutral-700">Next Hearing Date</span>
                      <span className="col-span-2 text-neutral-900 font-bold">
                        : 📅 {selectedDailyStatus.hearingDate}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200">
                    <span className="font-semibold text-neutral-700">Proceeding Notes</span>
                    <span className="col-span-2 text-neutral-800 leading-relaxed bg-neutral-50 p-3 rounded border border-neutral-200">
                      {selectedDailyStatus.proceedingNotes}
                    </span>
                  </div>
                </div>

                <div className="pt-6 text-right text-xs font-semibold text-neutral-700">
                  {selectedDailyStatus.judge}
                </div>
              </div>
            </div>
          ) : null}

          {/* ────── SECTION 1: DETAILS & STATUS ────── */}
          {activeSection === 'details' && !selectedDailyStatus && (
            <div className="space-y-6">
              {/* Registration Table */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                  <span>📋</span>
                  <span>1. Case Details & Registration Particulars</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded border border-neutral-200">
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Case Type</span>
                    <span className="font-bold text-black text-xs">{report.courtDetails.caseType}</span>
                  </div>
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Filing Date</span>
                    <span className="font-semibold text-black">{report.courtDetails.filingDate}</span>
                  </div>
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Filing Number</span>
                    <span className="font-mono font-semibold text-black">{report.courtDetails.filingNumber}</span>
                  </div>
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Registration Number</span>
                    <span className="font-mono font-bold text-black">{report.courtDetails.registrationNumber}</span>
                  </div>
                </div>
              </div>

              {/* Status & Decision Card */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                  <span>⚖️</span>
                  <span>2. Live Case Status & Disposition</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-50 p-4 rounded border border-neutral-200">
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Case Status</span>
                    <span className="status-badge status-won text-[0.7rem] mt-1">
                      {report.caseStatus.caseStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Sub Stage</span>
                    <span className="font-semibold text-black">{report.caseStatus.subStage}</span>
                  </div>
                  {report.caseStatus.natureOfDisposal && (
                    <div>
                      <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Nature of Disposal</span>
                      <span className="font-semibold text-black font-bold text-emerald-800">{report.caseStatus.natureOfDisposal}</span>
                    </div>
                  )}
                  {report.caseStatus.decisionDate && (
                    <div>
                      <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Decision Date</span>
                      <span className="font-bold text-black">📅 {report.caseStatus.decisionDate}</span>
                    </div>
                  )}
                  {report.caseStatus.nextHearingDate && (
                    <div>
                      <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Next Hearing Date</span>
                      <span className="font-bold text-black">📅 {report.caseStatus.nextHearingDate}</span>
                    </div>
                  )}
                  <div className="sm:col-span-3 pt-2 border-t border-neutral-200">
                    <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Court Number & Presiding Judge</span>
                    <span className="font-bold text-black text-xs">{report.caseStatus.courtNumberAndJudge}</span>
                  </div>
                </div>
              </div>

              {/* FIR Details (if present) */}
              {report.firDetails && (
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                    <span>🚔</span>
                    <span>3. Police Station & FIR Details</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-50 p-4 rounded border border-neutral-200">
                    <div>
                      <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Police Station</span>
                      <span className="font-bold text-black">{report.firDetails.policeStation}</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">FIR Number</span>
                      <span className="font-mono font-bold text-black">{report.firDetails.firNumber}</span>
                    </div>
                    <div>
                      <span className="text-[0.65rem] uppercase font-bold text-neutral-400 block">Year</span>
                      <span className="font-mono font-semibold text-black">{report.firDetails.year}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Statutory Acts & Sections */}
              {report.acts && report.acts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                    <span>📜</span>
                    <span>4. Statutory Acts & Sections</span>
                  </h3>
                  <div className="bg-neutral-50 p-3.5 rounded border border-neutral-200 divide-y divide-neutral-200">
                    {report.acts.map((a, i) => (
                      <div key={i} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between">
                        <span className="font-bold text-black">{a.act}</span>
                        <span className="font-mono text-neutral-600 bg-white px-2 py-0.5 rounded border border-neutral-200">{a.section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ────── SECTION 2: PARTIES & ADVOCATES ────── */}
          {activeSection === 'parties' && !selectedDailyStatus && (
            <div className="space-y-6">
              {/* Petitioners */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                  <span>👥</span>
                  <span>Petitioner and Advocate ({report.petitioners.length})</span>
                </h3>
                <div className="bg-neutral-50 rounded border border-neutral-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-100 uppercase text-[0.65rem] font-bold text-neutral-600 border-b border-neutral-200">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Petitioner / Complainant Name</th>
                        <th className="p-3">Legal Advocate / Counsel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {report.petitioners.map((p, i) => (
                        <tr key={i} className="hover:bg-white">
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
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                  <span>🛡️</span>
                  <span>Respondent and Advocate ({report.respondents.length})</span>
                </h3>
                <div className="bg-neutral-50 rounded border border-neutral-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-100 uppercase text-[0.65rem] font-bold text-neutral-600 border-b border-neutral-200">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Respondent / Accused Name</th>
                        <th className="p-3">Legal Advocate / Counsel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {report.respondents.map((r, i) => (
                        <tr key={i} className="hover:bg-white">
                          <td className="p-3 font-mono font-bold text-neutral-500">{r.id || i + 1}</td>
                          <td className="p-3 font-bold text-black">{r.name}</td>
                          <td className="p-3 font-medium text-neutral-700">
                            {r.advocate ? `⚖️ ${r.advocate}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ────── SECTION 3: DATE-BY-DATE PROCEEDINGS (MATCHING SCREENSHOT 1) ────── */}
          {activeSection === 'proceedings' && !selectedDailyStatus && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                  <span>📅</span>
                  <span>Case History ({report.caseHistoryAllDays.length} Listed Hearing Dates)</span>
                </h3>
                <span className="text-[0.7rem] text-blue-600 font-semibold">
                  💡 Click any blue date link to view its Daily Status & Proceeding Record
                </span>
              </div>

              <div className="bg-white rounded border border-neutral-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#e8f3d6] text-neutral-900 font-serif font-bold text-[0.75rem] border-b border-neutral-300">
                    <tr>
                      <th className="p-3.5">Judge</th>
                      <th className="p-3.5">Business on Date</th>
                      <th className="p-3.5">Hearing Date</th>
                      <th className="p-3.5">Purpose of Hearing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {report.caseHistoryAllDays.map((h, i) => (
                      <tr key={i} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3 text-neutral-700 font-medium max-w-[180px] truncate">
                          {h.judge}
                        </td>
                        <td className="p-3 font-bold">
                          <button
                            onClick={() => setSelectedDailyStatus(h)}
                            className="text-blue-700 hover:text-blue-900 hover:underline font-mono text-xs cursor-pointer font-bold inline-flex items-center gap-1"
                            title="Click to open Daily Status Sheet"
                          >
                            <span>{h.businessDate}</span>
                            <span className="text-[0.65rem]">↗</span>
                          </button>
                        </td>
                        <td className="p-3 font-mono font-medium text-neutral-800">
                          {h.hearingDate && h.hearingDate !== '-' ? h.hearingDate : <span className="status-badge status-won text-[0.65rem]">Disposed</span>}
                        </td>
                        <td className="p-3 font-medium text-neutral-900">
                          <span className={`px-2 py-0.5 rounded text-[0.7rem] font-semibold ${
                            h.purposeOfHearing.toLowerCase().includes('disposed')
                              ? 'bg-emerald-100 text-emerald-900 font-bold'
                              : h.purposeOfHearing.toLowerCase().includes('warrant')
                              ? 'bg-red-100 text-red-800'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {h.purposeOfHearing}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ────── SECTION 4: JUDGMENT / ORDER PDF ────── */}
          {activeSection === 'judgment' && !selectedDailyStatus && report.finalJudgementPdf && (
            <div className="space-y-6">
              <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-4">
                  <div>
                    <span className="status-badge status-won text-[0.65rem] mb-2">CERTIFIED COURT ORDER / JUDGMENT</span>
                    <h3 className="font-serif text-lg font-bold text-black">
                      {report.finalJudgementPdf.orderDetails}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Issued by {report.finalJudgementPdf.courtName} (Presiding Officer: {report.finalJudgementPdf.presidingJudge})
                    </p>
                  </div>

                  <a
                    href={
                      caseId
                        ? `${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/judgment-download?token=${
                            typeof window !== 'undefined'
                              ? sessionStorage.getItem('admin_access_token') || sessionStorage.getItem('client_access_token') || ''
                              : ''
                          }`
                        : report.finalJudgementPdf.pdfUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 inline-flex items-center gap-2 flex-shrink-0"
                  >
                    <span>📄</span>
                    <span>Download Copy of Order</span>
                  </a>
                </div>

                {report.finalJudgementPdf.decreeSummary && (
                  <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-1">
                    <span className="text-[0.65rem] uppercase font-bold text-neutral-400">Award & Decree Summary</span>
                    <p className="text-xs text-neutral-800 font-medium">{report.finalJudgementPdf.decreeSummary}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer ────────────────────────────────────────────────────────── */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-[0.7rem] text-neutral-500 flex-shrink-0">
          <span>Official Data synchronized via eCourts India Citizen Services API / Scraper</span>
          <button
            onClick={onClose}
            className="btn-outline text-[0.7rem] py-1.5 px-4 bg-white"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
