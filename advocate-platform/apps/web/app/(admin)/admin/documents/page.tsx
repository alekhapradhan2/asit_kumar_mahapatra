'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDocType, setUploadDocType] = useState('PETITION');
  const [uploadClientId, setUploadClientId] = useState('');
  const [uploadIsClientVisible, setUploadIsClientVisible] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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

  const fetchDocuments = async () => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedClientId) params.append('clientId', selectedClientId);
      if (selectedVisibility) params.append('visibility', selectedVisibility);
      if (search) params.append('search', search);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setDocuments(d.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [selectedClientId, selectedVisibility, search]);

  const handleToggleVisibility = async (docId: string, currentVis: string) => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    const newVis = currentVis === 'CLIENT_VISIBLE' ? 'ADMIN_ONLY' : 'CLIENT_VISIBLE';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ visibility: newVis }),
      });
      if (res.ok) {
        setNotice(`Visibility updated: ${newVis === 'CLIENT_VISIBLE' ? 'Visible to Client' : 'Admin Only (Hidden)'}`);
        fetchDocuments();
      }
    } catch {
      // ignore
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle || uploadFile.name);
      formData.append('docType', uploadDocType);
      if (uploadClientId) formData.append('clientId', uploadClientId);
      formData.append('visibility', uploadIsClientVisible ? 'CLIENT_VISIBLE' : 'ADMIN_ONLY');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadTitle('');
        setUploadClientId('');
        setNotice('Document uploaded successfully.');
        fetchDocuments();
      }
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  const getDownloadUrl = (docId: string) => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_access_token') : '';
    return `${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}/download?token=${token || ''}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8 space-y-6">
      {notice && (
        <div className="p-3 px-6 rounded bg-black text-white text-xs font-semibold flex items-center justify-between">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice(null)} className="text-neutral-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-bold mb-2 inline-flex items-center gap-1.5 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-9 h-9 rounded-sm bg-black text-white flex items-center justify-center font-bold text-sm">
              📄
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-black">Central Document Repository</h1>
              <p className="text-xs text-neutral-500">
                Manage court orders, petitions, and client documents with real-time visibility toggles
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary text-xs tracking-wider uppercase py-2.5 px-5"
        >
          + Upload Document
        </button>
      </div>

      {/* Visibility Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-black text-white flex items-center justify-center text-lg flex-shrink-0">
            🌐
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-black">Client Visible</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Documents marked visible are instantly accessible for the associated client to view & download in their Client Portal.
            </p>
          </div>
        </div>
        <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-neutral-100 text-black border border-neutral-300 flex items-center justify-center text-lg flex-shrink-0">
            🔒
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-black">Admin Only (Internal)</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Confidential firm work product, internal research notes, and draft strategies. Completely hidden from the client.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            className="form-input text-xs py-2 bg-neutral-50"
            placeholder="Search documents by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            className="form-input text-xs py-2 bg-white"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">-- All Clients --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.clientId})
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-48">
          <select
            className="form-input text-xs py-2 bg-white"
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value)}
          >
            <option value="">-- All Visibility --</option>
            <option value="CLIENT_VISIBLE">Visible to Client</option>
            <option value="ADMIN_ONLY">Admin Only (Hidden)</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="glass-card bg-white border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-neutral-800">
          <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
            <tr>
              <th className="p-3.5">Document Title</th>
              <th className="p-3.5">Client</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Uploaded By</th>
              <th className="p-3.5">Uploaded Date</th>
              <th className="p-3.5">Client Visibility</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {documents.length > 0 ? (
              documents.map((doc) => {
                const isClientUploader = doc.uploadedBy?.role === 'CLIENT';
                const isVisible = doc.visibility === 'CLIENT_VISIBLE';

                return (
                  <tr key={doc.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-black flex items-center gap-2">
                      <span className="text-base">📄</span>
                      <span>{doc.title}</span>
                    </td>
                    <td className="p-3.5">
                      {doc.client ? (
                        <Link
                          href={`/admin/clients/${doc.client.id}`}
                          className="font-semibold text-black hover:underline"
                        >
                          {doc.client.fullName}
                        </Link>
                      ) : (
                        <span className="text-neutral-400">Firm Wide</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-neutral-100 px-2 py-0.5 rounded text-[0.7rem] font-bold border border-neutral-200 text-neutral-700">
                        {doc.docType?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase ${
                          isClientUploader
                            ? 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                            : 'bg-black text-white'
                        }`}
                      >
                        {isClientUploader ? '👤 Client' : '⚖️ Firm'}
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-500">
                      {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5">
                      {isClientUploader ? (
                        <span className="text-[0.7rem] font-bold text-neutral-700">
                          🌐 Client Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleVisibility(doc.id, doc.visibility)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                            isVisible
                              ? 'bg-black text-white border-black hover:bg-neutral-800'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:border-black'
                          }`}
                          title="Click to toggle client visibility"
                        >
                          <span>{isVisible ? '🌐' : '🔒'}</span>
                          <span>{isVisible ? 'Visible to Client' : 'Admin Only (Hidden)'}</span>
                        </button>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <a
                        href={getDownloadUrl(doc.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-black hover:underline px-2.5 py-1 rounded bg-neutral-100 border border-neutral-300 hover:border-black"
                      >
                        ⬇️ Download
                      </a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-neutral-500 text-xs">
                  {loading ? 'Loading documents...' : 'No documents found matching filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card bg-white p-8 w-full max-w-lg space-y-4 border border-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-black">Upload Legal Document</h2>
                <p className="text-xs text-neutral-500">Store and optionally share with client portal</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="form-label text-xs">Select File *</label>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setUploadFile(f);
                      if (!uploadTitle) setUploadTitle(f.name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  className="form-input text-xs py-2 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white"
                />
              </div>

              <div>
                <label className="form-label text-xs">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified Copy of Order"
                  className="form-input text-xs py-2"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Document Type</label>
                  <select
                    className="form-input text-xs py-2 bg-white"
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                  >
                    <option value="PETITION">Petition / Plaint</option>
                    <option value="COURT_ORDER">Court Order / Stay</option>
                    <option value="JUDGMENT">Final Judgment</option>
                    <option value="AFFIDAVIT">Affidavit</option>
                    <option value="NOTICE">Legal Notice</option>
                    <option value="EVIDENCE">Evidence / Annexure</option>
                    <option value="HEARING_DOCUMENT">Hearing Transcript</option>
                    <option value="OTHER">Other Legal Document</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs">Associated Client</label>
                  <select
                    className="form-input text-xs py-2 bg-white"
                    value={uploadClientId}
                    onChange={(e) => setUploadClientId(e.target.value)}
                  >
                    <option value="">-- General / Firm Wide --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.clientId})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* VISIBILITY TOGGLE */}
              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-xs text-black block">Make Visible to Client in Portal</label>
                    <p className="text-[0.7rem] text-neutral-500">
                      When enabled, client can view and download this in their Client Portal.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={uploadIsClientVisible}
                    onChange={(e) => setUploadIsClientVisible(e.target.checked)}
                    className="w-5 h-5 accent-black cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="btn-primary text-xs py-2 px-5"
                >
                  {uploading ? 'Uploading...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
