'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ECourtsLiveModal, { ECourtsCaseReport } from '@/components/shared/ECourtsLiveModal';

interface CaseRecord {
  id: string;
  internalCaseId: string;
  title: string;
  caseType: string;
  practiceArea: string;
  courtName?: string;
  courtCaseNumber?: string;
  cnrNumber?: string;
  currentStatus: string;
  nextHearingDate?: string;
  priority: string;
  isArchived: boolean;
  client?: { id: string; fullName: string; clientId: string };
  updatedAt: string;
}

const statusOptions = [
  'CONSULTATION',
  'DOCUMENTS_PENDING',
  'FILED',
  'REGISTERED',
  'HEARING_SCHEDULED',
  'AWAITING_JUDGMENT',
  'WON',
  'LOST',
  'CLOSED',
  'ARCHIVED',
];

export default function AdminCasesPage() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  // eCourts modal & sync state
  const [selectedECourtsReport, setSelectedECourtsReport] = useState<ECourtsCaseReport | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(undefined);
  const [syncingCaseId, setSyncingCaseId] = useState<string | null>(null);

  // New Case Modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    practiceArea: 'High Court Litigation',
    caseType: 'Writ Petition (Civil)',
    courtName: 'High Court of Orissa, Cuttack',
    courtCaseNumber: '',
    cnrNumber: '',
    clientId: '',
    priority: 'HIGH',
    currentStatus: 'FILED',
    nextHearingDate: '',
    description: '',
  });

  // Stage Update Modal
  const [editingCase, setEditingCase] = useState<CaseRecord | null>(null);
  const [updatingStage, setUpdatingStage] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newNextHearing, setNewNextHearing] = useState('');

  const fetchCases = async () => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      params.append('limit', '100');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCases(data.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setClients(d.data || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchCases();
  }, [search, statusFilter]);

  const handleSyncECourts = async (caseId: string, cnr?: string) => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    setSyncingCaseId(caseId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/ecourts-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cnrNumber: cnr }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data?.report) {
          setSelectedECourtsReport(result.data.report);
          setSelectedCaseId(caseId);
        }
        setNotice('eCourts live status synchronized successfully!');
        fetchCases();
      } else {
        const d = await res.json();
        alert(d.message || 'Sync failed');
      }
    } catch {
      alert('Error connecting to eCourts synchronization service');
    } finally {
      setSyncingCaseId(null);
    }
  };

  const handleViewECourts = async (caseId: string) => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${caseId}/ecourts-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setSelectedECourtsReport(d.data);
        setSelectedCaseId(caseId);
      }
    } catch {
      alert('Failed to load eCourts ledger');
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) {
      alert('Please select a client for this case matter.');
      return;
    }

    setSubmitting(true);
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const payload: any = { ...formData };
      if (!payload.nextHearingDate) delete payload.nextHearingDate;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({
          title: '',
          practiceArea: 'High Court Litigation',
          caseType: 'Writ Petition (Civil)',
          courtName: 'High Court of Orissa, Cuttack',
          courtCaseNumber: '',
          cnrNumber: '',
          clientId: '',
          priority: 'HIGH',
          currentStatus: 'FILED',
          nextHearingDate: '',
          description: '',
        });
        setNotice('Case matter created successfully!');
        fetchCases();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to create case');
      }
    } catch {
      alert('Error connecting to server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCaseStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;

    setUpdatingStage(true);
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases/${editingCase.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentStatus: newStatus || editingCase.currentStatus,
          nextHearingDate: newNextHearing ? new Date(newNextHearing).toISOString() : editingCase.nextHearingDate,
        }),
      });

      if (res.ok) {
        setEditingCase(null);
        setNotice('Case status and hearing schedule updated.');
        fetchCases();
      } else {
        const d = await res.json();
        alert(d.message || 'Update failed');
      }
    } catch {
      alert('Connection error');
    } finally {
      setUpdatingStage(false);
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {notice && (
        <div className="p-3.5 px-6 rounded bg-black text-white text-xs font-semibold flex items-center justify-between shadow-md">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice(null)} className="text-neutral-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-black text-white flex items-center justify-center font-bold text-lg shadow-xs">
            📁
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-black">Case & Matter Management</h1>
            <p className="text-xs text-neutral-500">
              Track court proceedings, stages, next hearings, and 16-digit eCourts CNR sync across all courts
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          id="btn-add-new-case"
          className="btn-primary text-xs tracking-wider uppercase py-2.5 px-5"
        >
          + File / Register Case
        </button>
      </div>

      {/* ─── Filter Tabs & Search Bar ───────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider border-b border-neutral-200 pb-2">
          {[
            { id: 'ALL', label: 'All Matters' },
            { id: 'FILED', label: 'Filed / Active' },
            { id: 'HEARING_SCHEDULED', label: 'Hearings Scheduled' },
            { id: 'AWAITING_JUDGMENT', label: 'Awaiting Judgment' },
            { id: 'WON', label: 'Won / Favorable' },
            { id: 'CLOSED', label: 'Disposed / Closed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 bg-white border border-neutral-200 shadow-sm">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">🔍</span>
            <input
              type="text"
              className="form-input pl-10 text-xs py-2 bg-neutral-50 border-neutral-200 focus:bg-white"
              placeholder="Search by Case Title, CNR Number, Case Number, Court, or Client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-semibold px-2">
            <span>{cases.length} Match{cases.length === 1 ? '' : 'es'}</span>
          </div>
        </div>
      </div>

      {/* ─── Cases Table ────────────────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden bg-white border border-neutral-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-800">
            <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
              <tr>
                <th className="p-4">Matter ID</th>
                <th className="p-4">Case Title & Type</th>
                <th className="p-4">Client</th>
                <th className="p-4">Court & CNR (eCourts)</th>
                <th className="p-4">Next Hearing</th>
                <th className="p-4">Stage / Status</th>
                <th className="p-4 text-right">Actions & eCourts Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {cases.length > 0 ? (
                cases.map((c) => {
                  const isSyncing = syncingCaseId === c.id;
                  return (
                    <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-xs text-black">
                        <span className="bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
                          {c.internalCaseId}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-black text-xs line-clamp-1">{c.title}</div>
                        <div className="text-[0.7rem] text-neutral-500 mt-0.5 font-medium">
                          {c.caseType} • {c.practiceArea}
                        </div>
                      </td>
                      <td className="p-4">
                        {c.client ? (
                          <Link
                            href={`/admin/clients/${c.client.id}`}
                            className="font-bold text-black hover:underline"
                          >
                            {c.client.fullName}
                            <div className="text-[0.65rem] font-mono text-neutral-400 font-normal">
                              {c.client.clientId}
                            </div>
                          </Link>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-black font-medium">{c.courtName || 'Court of Law'}</div>
                        <div className="text-[0.7rem] font-mono text-neutral-500 flex items-center gap-1.5 mt-0.5">
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200 text-black font-bold">
                            {c.cnrNumber || 'No CNR'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {c.nextHearingDate ? (
                          <div className="font-bold text-black bg-neutral-100 px-2 py-1 rounded border border-neutral-200 inline-block text-[0.7rem]">
                            📅 {new Date(c.nextHearingDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Not Scheduled</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="status-badge status-won text-[0.65rem]">
                          {c.currentStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        {c.cnrNumber && (
                          <>
                            <button
                              onClick={() => handleSyncECourts(c.id, c.cnrNumber)}
                              disabled={isSyncing}
                              className="inline-flex items-center gap-1 font-bold text-black bg-neutral-100 hover:bg-black hover:text-white px-2 py-1 rounded transition-all border border-neutral-300 hover:border-black text-[0.65rem] uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                              title="Sync latest proceedings & orders from services.ecourts.gov.in"
                            >
                              <span className={isSyncing ? 'animate-spin' : ''}>🔄</span>
                              <span>{isSyncing ? 'Syncing...' : 'eCourts'}</span>
                            </button>

                            <Link
                              href={`/admin/cases/${c.id}/ecourts`}
                              className="inline-flex items-center gap-1 font-bold text-black bg-white hover:bg-neutral-100 px-2 py-1 rounded transition-all border border-neutral-300 text-[0.65rem] uppercase tracking-wider"
                              title="Open dedicated full-page eCourts case ledger"
                            >
                              🏛️ eCourts Page
                            </Link>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setEditingCase(c);
                            setNewStatus(c.currentStatus);
                            setNewNextHearing(
                              c.nextHearingDate ? new Date(c.nextHearingDate).toISOString().slice(0, 10) : ''
                            );
                          }}
                          className="inline-flex items-center gap-1 font-bold text-black bg-neutral-100 hover:bg-black hover:text-white px-2 py-1 rounded transition-all border border-neutral-300 hover:border-black text-[0.65rem] uppercase tracking-wider"
                        >
                          ⚙️ Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500 text-xs">
                    {loading ? 'Loading cases from database...' : 'No case records found matching filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal: Register New Case ───────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="glass-card bg-white p-8 w-full max-w-2xl space-y-5 border border-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-black">Register New Case Matter</h2>
                <p className="text-xs text-neutral-500">File a matter linked to a registered client with court particulars and 16-digit CNR</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="form-label text-xs">Case Matter Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asit Kumar vs State of Odisha & Ors."
                  className="form-input text-xs py-2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Associated Client *</label>
                  <select
                    required
                    className="form-input text-xs py-2 bg-white"
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  >
                    <option value="">-- Select Client --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.clientId})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Practice Area</label>
                  <select
                    className="form-input text-xs py-2 bg-white"
                    value={formData.practiceArea}
                    onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
                  >
                    <option value="High Court Litigation">High Court Litigation</option>
                    <option value="Criminal Law">Criminal Defense & Bail</option>
                    <option value="Family & Matrimonial">Family & Matrimonial Law</option>
                    <option value="Property & Land Disputes">Property & Land Disputes</option>
                    <option value="Civil & Commercial">Civil & Commercial Litigation</option>
                    <option value="Consumer Protection">Consumer Protection</option>
                    <option value="Constitutional Law">Constitutional / Writs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Court Forum</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High Court of Orissa, Cuttack"
                    className="form-input text-xs py-2"
                    value={formData.courtName}
                    onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Case Type</label>
                  <input
                    type="text"
                    placeholder="e.g. W.P.(C) / Criminal Appeal / CRLMC"
                    className="form-input text-xs py-2"
                    value={formData.caseType}
                    onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">CNR Number (16 Digits e-Courts)</label>
                  <input
                    type="text"
                    placeholder="e.g. TNTI160003232018 or JKAN010006382017"
                    className="form-input text-xs py-2 font-mono"
                    value={formData.cnrNumber}
                    onChange={(e) => setFormData({ ...formData, cnrNumber: e.target.value.toUpperCase() })}
                  />
                  <p className="text-[0.65rem] text-neutral-400 mt-1">
                    Used for 1-click live status sync with services.ecourts.gov.in
                  </p>
                </div>
                <div>
                  <label className="form-label text-xs">Court Case / Filing No.</label>
                  <input
                    type="text"
                    placeholder="e.g. WP(C) No. 1234/2026"
                    className="form-input text-xs py-2"
                    value={formData.courtCaseNumber}
                    onChange={(e) => setFormData({ ...formData, courtCaseNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Current Stage</label>
                  <select
                    className="form-input text-xs py-2 bg-white"
                    value={formData.currentStatus}
                    onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Next Hearing Date</label>
                  <input
                    type="date"
                    className="form-input text-xs py-2 bg-white"
                    value={formData.nextHearingDate}
                    onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-5"
                >
                  {submitting ? 'Registering...' : 'Register Case Matter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Update Stage & Next Hearing ─────────────────────────────── */}
      {editingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="glass-card bg-white p-8 w-full max-w-lg space-y-4 border border-black shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-black">Update Matter Stage</h2>
                <p className="text-xs text-neutral-500">{editingCase.title}</p>
              </div>
              <button
                onClick={() => setEditingCase(null)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCaseStage} className="space-y-4">
              <div>
                <label className="form-label text-xs">Matter Stage / Status</label>
                <select
                  className="form-input text-xs py-2 bg-white"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Next Hearing Date</label>
                <input
                  type="date"
                  className="form-input text-xs py-2 bg-white"
                  value={newNextHearing}
                  onChange={(e) => setNewNextHearing(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStage}
                  className="btn-primary text-xs py-2 px-5"
                >
                  {updatingStage ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Full eCourts Report ─────────────────────────────────────── */}
      {selectedECourtsReport && (
        <ECourtsLiveModal
          report={selectedECourtsReport}
          caseId={selectedCaseId}
          onClose={() => {
            setSelectedECourtsReport(null);
            setSelectedCaseId(undefined);
          }}
          onRefresh={selectedCaseId ? () => handleSyncECourts(selectedCaseId, selectedECourtsReport.cnrNumber) : undefined}
          refreshing={syncingCaseId === selectedCaseId}
        />
      )}
    </div>
  );
}
