'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases?search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCases(data.data || []);
      }
    } catch { /* fail silently */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchCases();
  }, [search]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/dashboard" className="text-xs text-yellow-400 hover:text-yellow-300 font-medium mb-1 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white">Case Management</h1>
          <p className="text-xs text-slate-400">Track, update stages, add hearings, and manage verdicts</p>
        </div>
      </div>

      <div className="glass-card p-4 flex gap-4">
        <input
          type="text"
          className="form-input flex-1 text-sm py-2"
          placeholder="Search by Case Title, CNR Number, Case Number, or Client Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider border-b border-white/8">
            <tr>
              <th className="p-4">Case ID</th>
              <th className="p-4">Case Title</th>
              <th className="p-4">Client</th>
              <th className="p-4">Court</th>
              <th className="p-4">Next Hearing</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {cases.length > 0 ? (
              cases.map((c) => (
                <tr key={c.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-4 font-mono text-yellow-400 font-medium">{c.internalCaseId}</td>
                  <td className="p-4 font-semibold text-white">{c.title}</td>
                  <td className="p-4 text-xs text-slate-400">{c.client?.fullName || '—'}</td>
                  <td className="p-4 text-xs text-slate-400">{c.courtName || '—'}</td>
                  <td className="p-4 text-xs text-yellow-400">
                    {c.nextHearingDate ? new Date(c.nextHearingDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="p-4">
                    <span className="status-badge status-pending">
                      {c.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                  {loading ? 'Loading cases...' : 'No cases found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
