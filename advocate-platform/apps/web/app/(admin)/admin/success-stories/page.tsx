'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StoryItem {
  id: string;
  title: string;
  slug: string;
  shortSummary?: string;
  practiceArea: string;
  result: string;
  isAnonymous: boolean;
  clientDisplay?: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
}

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    practiceArea: 'High Court Litigation',
    result: 'Favorable Judgment / Bail Granted',
    shortSummary: '',
    fullStory: '',
    isAnonymous: true,
    clientDisplay: 'Confidential Corporate Client / Individual',
  });

  const fetchStories = async () => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/success-stories?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setStories(d.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/success-stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const created = await res.json();
        // Immediately publish if needed
        if (created.data?.id) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/success-stories/${created.data.id}/publish`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        setShowModal(false);
        setFormData({
          title: '',
          practiceArea: 'High Court Litigation',
          result: 'Favorable Judgment / Bail Granted',
          shortSummary: '',
          fullStory: '',
          isAnonymous: true,
          clientDisplay: 'Confidential Corporate Client / Individual',
        });
        setNotice('Success story published!');
        fetchStories();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to create story');
      }
    } catch {
      alert('Error creating success story');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (id: string) => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/success-stories/${id}/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotice('Success story is now live.');
        fetchStories();
      }
    } catch {
      // ignore
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
            🏆
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-black">Success Stories & Track Record CMS</h1>
            <p className="text-xs text-neutral-500">
              Publish anonymized favorable judgments and legal outcomes while strictly protecting client confidentiality
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          id="btn-add-story"
          className="btn-primary text-xs tracking-wider uppercase py-2.5 px-5"
        >
          + Add Success Record
        </button>
      </div>

      {/* ─── Stories Table ─────────────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden bg-white border border-neutral-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-800">
            <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
              <tr>
                <th className="p-4">Case Outcome Title</th>
                <th className="p-4">Practice Area</th>
                <th className="p-4">Favorable Outcome</th>
                <th className="p-4">Anonymity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {stories.length > 0 ? (
                stories.map((st) => (
                  <tr key={st.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 max-w-sm">
                      <div className="font-bold text-black text-sm">{st.title}</div>
                      {st.shortSummary && (
                        <div className="text-[0.7rem] text-neutral-500 line-clamp-1 mt-0.5">
                          {st.shortSummary}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-neutral-700">{st.practiceArea}</td>
                    <td className="p-4">
                      <span className="status-badge status-won text-[0.65rem]">
                        {st.result}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[0.7rem] font-mono text-neutral-600">
                        {st.isAnonymous ? '🔒 Anonymized' : '👤 Disclosed'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase ${
                          st.status === 'PUBLISHED' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {st.status !== 'PUBLISHED' && (
                        <button
                          onClick={() => handlePublish(st.id)}
                          className="inline-flex items-center gap-1 font-bold text-black bg-neutral-100 hover:bg-black hover:text-white px-2.5 py-1 rounded transition-all border border-neutral-300 text-[0.7rem]"
                        >
                          Publish Now
                        </button>
                      )}
                      <Link
                        href={`/success-stories/${st.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 font-bold text-black hover:underline px-2.5 py-1 rounded bg-neutral-100 border border-neutral-300 text-[0.7rem]"
                      >
                        👁️ View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500 text-xs">
                    {loading ? 'Loading success records...' : 'No success records found. Click "+ Add Success Record" to post a milestone.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal: Add Success Story ───────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="glass-card bg-white p-8 w-full max-w-2xl space-y-4 border border-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-black">Record Favorable Case Outcome</h2>
                <p className="text-xs text-neutral-500">Add an anonymized milestone to the firm's track record</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="form-label text-xs">Milestone Title / Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quashing of Criminal FIR in Property Title Matter before High Court"
                  className="form-input text-xs py-2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Practice Area</label>
                  <select
                    className="form-input text-xs py-2 bg-white"
                    value={formData.practiceArea}
                    onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
                  >
                    <option value="High Court Litigation">High Court Litigation</option>
                    <option value="Criminal Defense">Criminal Defense & Bail</option>
                    <option value="Property & Land Disputes">Property & Land Disputes</option>
                    <option value="Constitutional Law">Constitutional Writs</option>
                    <option value="Family Law">Family & Matrimonial</option>
                    <option value="Commercial Arbitration">Commercial Arbitration</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Outcome Result</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FIR Quashed / Interim Stay Granted"
                    className="form-input text-xs py-2"
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Short Summary</label>
                <textarea
                  rows={2}
                  placeholder="Overview of legal challenges faced and strategy executed..."
                  className="form-input text-xs py-2 resize-none"
                  value={formData.shortSummary}
                  onChange={(e) => setFormData({ ...formData, shortSummary: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label text-xs">Detailed Case Narrative *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detailed breakdown of arguments advanced, case citations, and final court judgment..."
                  className="form-input text-xs py-2 font-mono"
                  value={formData.fullStory}
                  onChange={(e) => setFormData({ ...formData, fullStory: e.target.value })}
                />
              </div>

              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-xs text-black block">Preserve Client Anonymity</label>
                    <p className="text-[0.7rem] text-neutral-500">
                      Anonymizes identifying names to comply with legal ethics and confidentiality standards.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    className="w-5 h-5 accent-black cursor-pointer"
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
                  {submitting ? 'Recording...' : 'Publish Success Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
