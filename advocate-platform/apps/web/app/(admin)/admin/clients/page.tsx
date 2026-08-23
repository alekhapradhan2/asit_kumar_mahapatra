'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiUrl } from '@/lib/config';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: 'Password@123',
    city: '',
    state: '',
  });

  const fetchClients = async () => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/clients?search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data.data || []);
      }
    } catch { /* fail silently in demo */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ fullName: '', email: '', mobile: '', password: 'Password@123', city: '', state: '' });
        fetchClients();
      }
    } catch { /* error handling */ }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/dashboard" className="text-xs text-yellow-400 hover:text-yellow-300 font-medium mb-1 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white">Client Management</h1>
          <p className="text-xs text-slate-400">View, onboard, and manage registered clients</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm py-2.5 px-5">
          + Register New Client
        </button>
      </div>

      {/* Filter / Search */}
      <div className="glass-card p-4 flex gap-4">
        <input
          type="text"
          className="form-input flex-1 text-sm py-2"
          placeholder="Search by Name, Client ID, Email, or Mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider border-b border-white/8">
            <tr>
              <th className="p-4">Client ID</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {clients.length > 0 ? (
              clients.map((c) => (
                <tr key={c.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-4 font-mono text-yellow-400 font-medium">{c.clientId}</td>
                  <td className="p-4 font-semibold text-white">{c.fullName}</td>
                  <td className="p-4 text-xs text-slate-400">{c.email}</td>
                  <td className="p-4 text-xs text-slate-400">{c.mobile}</td>
                  <td className="p-4 text-xs text-slate-400">{c.city ? `${c.city}, ${c.state}` : '—'}</td>
                  <td className="p-4">
                    <span className={`status-badge ${c.isActive ? 'status-won' : 'status-urgent'}`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                  {loading ? 'Loading clients...' : 'No clients found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-white">Register New Client</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="form-label text-xs">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input text-sm py-2"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Email *</label>
                  <input
                    type="email"
                    required
                    className="form-input text-sm py-2"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Mobile *</label>
                  <input
                    type="tel"
                    required
                    className="form-input text-sm py-2"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">City</label>
                  <input
                    type="text"
                    className="form-input text-sm py-2"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">State</label>
                  <input
                    type="text"
                    className="form-input text-sm py-2"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="form-label text-xs">Initial Temporary Password</label>
                <input
                  type="text"
                  className="form-input text-sm py-2 font-mono"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <span className="text-xs text-slate-500 block mt-1">Client will be prompted to reset upon first login</span>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-xs py-2 px-4">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">
                  Save & Generate Client ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
