'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: 'Password@123',
    city: 'Cuttack',
    state: 'Odisha',
    address: '',
    pinCode: '',
    emergencyName: '',
    emergencyPhone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchClients = async () => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients?search=${encodeURIComponent(search)}&limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setClients(data.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to register client');
      }

      setShowModal(false);
      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        password: 'Password@123',
        city: 'Cuttack',
        state: 'Odisha',
        address: '',
        pinCode: '',
        emergencyName: '',
        emergencyPhone: '',
      });
      fetchClients();
      if (json.data?.id) {
        router.push(`/admin/clients/${json.data.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-black text-white flex items-center justify-center font-bold text-lg shadow-xs">
            👥
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-black">Client Directory</h1>
            <p className="text-xs text-neutral-500">
              Manage client representation files, portal access credentials, and direct communications
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          id="btn-register-client"
          className="btn-primary text-xs tracking-wider uppercase py-2.5 px-5"
        >
          + Register New Client
        </button>
      </div>

      {/* ─── Filter / Search Bar ────────────────────────────────────────────── */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 bg-white border border-neutral-200 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">🔍</span>
          <input
            type="text"
            className="form-input pl-10 text-xs py-2 bg-neutral-50 border-neutral-200 focus:bg-white"
            placeholder="Search by Client Name, ID (CLIENT-XXXX), Email, or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-semibold px-2">
          <span>{clients.length} Client{clients.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* ─── Clients Table ─────────────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden bg-white border border-neutral-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-800">
            <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
              <tr>
                <th className="p-4">Client ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">Cases</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {clients.length > 0 ? (
                clients.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/admin/clients/${c.id}`)}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-mono font-bold text-xs text-black">
                      <span className="bg-neutral-100 px-2 py-1 rounded border border-neutral-200 group-hover:border-black transition-colors">
                        {c.clientId}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-black group-hover:underline flex items-center gap-2">
                        <span>{c.fullName}</span>
                      </div>
                      <div className="text-[0.7rem] text-neutral-400 mt-0.5">
                        Joined {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="text-neutral-800 font-medium">{c.email}</div>
                      <div className="text-neutral-500 font-mono text-[0.7rem] mt-0.5">{c.mobile || '—'}</div>
                    </td>
                    <td className="p-4 text-xs text-neutral-600">
                      {c.city ? `${c.city}, ${c.state || ''}` : '—'}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 border border-neutral-200 text-black">
                        {c._count?.cases ?? 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wider ${
                          c.isActive
                            ? 'bg-black text-white'
                            : 'bg-neutral-100 text-neutral-500 border border-neutral-300'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 font-bold text-black group-hover:underline text-xs">
                        Open Workspace →
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500 text-xs">
                    {loading ? 'Loading clients from database...' : 'No clients found matching query.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal: Register New Client ─────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="glass-card bg-white p-8 w-full max-w-lg space-y-4 border border-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-black">Register New Client</h2>
                <p className="text-xs text-neutral-500">Auto-generates secure Client ID and login credentials</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded text-xs text-red-700 bg-red-50 border border-red-200">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="form-label text-xs">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Senapati"
                  className="form-input text-xs py-2"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@example.com"
                    className="form-input text-xs py-2"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="form-input text-xs py-2 font-mono"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">City</label>
                  <input
                    type="text"
                    placeholder="Cuttack / Bhubaneswar"
                    className="form-input text-xs py-2"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">State</label>
                  <input
                    type="text"
                    placeholder="Odisha"
                    className="form-input text-xs py-2"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Initial Portal Password *</label>
                <input
                  type="text"
                  required
                  className="form-input text-xs py-2 font-mono bg-neutral-50"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <p className="text-[0.65rem] text-neutral-400 mt-1">
                  Client can use this password alongside their Client ID to log into the Case Portal.
                </p>
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
                  {submitting ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
