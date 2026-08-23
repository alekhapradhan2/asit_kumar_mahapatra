'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CaseDTO {
  id: string;
  internalCaseId: string;
  title: string;
  caseType: string;
  practiceArea: string;
  courtName?: string;
  currentStatus: string;
  nextHearingDate?: string;
  priority: string;
  updatedAt: string;
}

interface DocumentDTO {
  id: string;
  title: string;
  docType: string;
  category?: string;
  caseId?: string;
  case?: { id: string; internalCaseId: string; title: string };
  fileKey: string;
  mimeType: string;
  sizeBytes: number;
  visibility: string;
  uploadedAt: string;
  uploadedBy?: {
    id: string;
    role: string;
    email: string;
  };
}

interface MessageDTO {
  id: string;
  senderId: string;
  senderRole: string;
  subject?: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    role: string;
    email: string;
  };
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

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'cases' | 'documents' | 'messages' | 'profile'>('cases');
  const [cases, setCases] = useState<CaseDTO[]>([]);
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Document upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDocType, setUploadDocType] = useState('CLIENT_DOCUMENT');
  const [uploadCaseId, setUploadCaseId] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  // Message state
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const fetchDashboardData = async () => {
    const storedUser = sessionStorage.getItem('client_user');
    const token = sessionStorage.getItem('client_access_token');

    if (!storedUser || !token) {
      router.replace('/client/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const headers = { Authorization: `Bearer ${token}` };

    try {
      setLoading(true);
      const [casesRes, docsRes, msgsRes] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, { headers }),
      ]);

      if (casesRes.status === 'fulfilled' && casesRes.value.ok) {
        const d = await casesRes.value.json();
        setCases(d.data || []);
      }
      if (docsRes.status === 'fulfilled' && docsRes.value.ok) {
        const d = await docsRes.value.json();
        setDocuments(d.data || []);
      }
      if (msgsRes.status === 'fulfilled' && msgsRes.value.ok) {
        const d = await msgsRes.value.json();
        setMessages(d.data || []);
      }
    } catch {
      setError('Failed to load portal data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.replace('/client/login');
  };

  // Client uploads document to advocate
  const handleClientUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    const token = sessionStorage.getItem('client_access_token');
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle || uploadFile.name);
      formData.append('docType', uploadDocType);
      if (uploadCaseId) formData.append('caseId', uploadCaseId);
      if (uploadDescription) formData.append('description', uploadDescription);
      formData.append('visibility', 'CLIENT_VISIBLE');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadTitle('');
        setUploadDescription('');
        setUploadCaseId('');
        setNotice('Document uploaded successfully. It is now accessible to the Advocate/Firm.');
        fetchDashboardData();
      } else {
        const d = await res.json();
        setError(d.message || 'Upload failed');
      }
    } catch {
      setError('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  // Client sends message to advocate
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgContent.trim()) return;

    setSendingMsg(true);
    const token = sessionStorage.getItem('client_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: msgSubject || undefined,
          content: msgContent,
          isClientVisible: true,
        }),
      });

      if (res.ok) {
        setMsgSubject('');
        setMsgContent('');
        setNotice('Message sent successfully to Advocate & Super Admin.');
        fetchDashboardData();
      } else {
        const d = await res.json();
        setError(d.message || 'Failed to send message');
      }
    } catch {
      setError('Error sending message');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-neutral-300 border-t-black rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-xs uppercase tracking-widest font-bold">
            Loading Client Case Portal...
          </p>
        </div>
      </div>
    );
  }

  // Filter documents: firm documents (visible) vs client's own uploads
  const firmDocs = documents.filter((d) => d.uploadedBy?.role !== 'CLIENT');
  const myUploads = documents.filter((d) => d.uploadedBy?.role === 'CLIENT');

  return (
    <div className="container-xl py-8 space-y-6">
      {/* Notice Banner */}
      {notice && (
        <div className="p-3.5 px-6 rounded bg-black text-white text-xs font-semibold flex items-center justify-between shadow-md">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice(null)} className="text-neutral-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 px-6 rounded bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-700 text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Welcome Header */}
      <div className="glass-card p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-sm bg-black text-white flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0">
            {user?.fullName ? user.fullName.charAt(0) : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold bg-neutral-100 px-2.5 py-0.5 rounded border border-neutral-300 text-black">
                {user?.clientId}
              </span>
              <span className="status-badge status-won text-[0.65rem]">VERIFIED CLIENT</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-black">
              Welcome, {user?.fullName || 'Client'}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Secure portal for managing your legal cases, court documents, and advocate communications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            id="btn-client-quick-upload"
            className="btn-primary text-xs uppercase tracking-wider py-2 px-4 inline-flex items-center gap-1.5"
          >
            <span>📤</span>
            <span>Upload Document</span>
          </button>
          <button
            onClick={handleLogout}
            id="logout-btn"
            className="btn-outline text-xs uppercase tracking-wider py-2 px-4"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 gap-8 text-xs font-bold uppercase tracking-wider overflow-x-auto bg-white px-6 rounded-t border-t border-x">
        <button
          onClick={() => setActiveTab('cases')}
          className={`py-4 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'cases'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <span>📁 My Cases</span>
          <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-[0.65rem] border border-neutral-200">
            {cases.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`py-4 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'documents'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <span>📄 Legal Documents</span>
          <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-[0.65rem] border border-neutral-200">
            {documents.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`py-4 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'messages'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <span>💬 Communications</span>
          <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-[0.65rem] border border-neutral-200">
            {messages.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          👤 My Profile
        </button>
      </div>

      {/* ──────── TAB 1: CASES ──────── */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-black">Your Legal Matters & Cases</h2>
            <span className="text-xs text-neutral-500 font-semibold">{cases.length} Registered Case{cases.length !== 1 ? 's' : ''}</span>
          </div>

          {cases.length === 0 ? (
            <div className="glass-card p-12 text-center bg-white border border-neutral-200">
              <div className="text-5xl mb-4">📁</div>
              <h3 className="font-serif text-xl font-bold text-black mb-2">No Cases Registered Yet</h3>
              <p className="text-neutral-500 text-xs max-w-md mx-auto">
                Your cases will appear here once registered by your advocate. You can also message your advocate or upload required documents.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cases.map((c) => (
                <Link
                  key={c.id}
                  href={`/client/cases/${c.id}`}
                  id={`case-card-${c.id}`}
                  className="glass-card p-6 bg-white border border-neutral-200 shadow-sm flex flex-col justify-between group hover:border-black transition-all"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className={`status-badge ${statusColors[c.currentStatus] || 'status-pending'}`}>
                        {formatStatus(c.currentStatus)}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-500">{c.internalCaseId}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-black group-hover:underline">
                      {c.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-neutral-600">
                      <span>📋 {c.practiceArea}</span>
                      {c.courtName && <span>🏛️ {c.courtName}</span>}
                    </div>
                    {c.nextHearingDate && (
                      <div className="mt-3 p-2.5 rounded bg-neutral-100 border border-neutral-200 text-xs font-semibold text-black">
                        📅 Next Hearing Scheduled:{' '}
                        {new Date(c.nextHearingDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3 mt-4 text-xs font-bold uppercase tracking-wider text-black">
                    <span>View Case Details & Timeline</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────── TAB 2: DOCUMENTS ──────── */}
      {activeTab === 'documents' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-black">Legal Documents & Filings</h2>
              <p className="text-xs text-neutral-500">
                Access court orders and petitions shared by your advocate, and upload case documents
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              id="btn-doc-upload-modal"
              className="btn-primary text-xs uppercase tracking-wider py-2 px-5 inline-flex items-center gap-1.5"
            >
              <span>📤</span>
              <span>+ Upload Document to Advocate</span>
            </button>
          </div>

          {/* Section 1: Documents from Advocate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-black flex items-center gap-2">
                <span>⚖️</span>
                <span>Documents Shared by Advocate / Firm</span>
              </h3>
              <span className="text-xs text-neutral-500 font-semibold">{firmDocs.length} Document{firmDocs.length !== 1 ? 's' : ''}</span>
            </div>

            {firmDocs.length > 0 ? (
              <div className="glass-card bg-white border border-neutral-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs text-neutral-800">
                  <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
                    <tr>
                      <th className="p-3.5">Document Title</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Linked Case</th>
                      <th className="p-3.5">Date Shared</th>
                      <th className="p-3.5 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {firmDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3.5 font-bold text-black flex items-center gap-2">
                          <span className="text-base">📄</span>
                          <span>{doc.title}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-neutral-100 px-2 py-0.5 rounded text-[0.7rem] font-bold text-neutral-700 border border-neutral-200">
                            {doc.docType?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[0.7rem] text-neutral-600">
                          {doc.case ? `${doc.case.internalCaseId} (${doc.case.title})` : 'General / Matter'}
                        </td>
                        <td className="p-3.5 text-neutral-500">
                          {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-3.5 text-right">
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/download`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-black bg-neutral-100 hover:bg-black hover:text-white px-3 py-1.5 rounded transition-all border border-neutral-300 hover:border-black text-[0.7rem] uppercase tracking-wider"
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
              <div className="glass-card p-6 bg-white border border-neutral-200 text-center text-xs text-neutral-400">
                No documents shared by your advocate yet.
              </div>
            )}
          </div>

          {/* Section 2: My Uploads */}
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-black flex items-center gap-2">
                <span>👤</span>
                <span>My Uploaded Documents</span>
              </h3>
              <span className="text-xs text-neutral-500 font-semibold">{myUploads.length} Document{myUploads.length !== 1 ? 's' : ''}</span>
            </div>

            {myUploads.length > 0 ? (
              <div className="glass-card bg-white border border-neutral-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs text-neutral-800">
                  <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
                    <tr>
                      <th className="p-3.5">Document Title</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Linked Case</th>
                      <th className="p-3.5">Uploaded Date</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {myUploads.map((doc) => (
                      <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3.5 font-bold text-black flex items-center gap-2">
                          <span className="text-base">📄</span>
                          <span>{doc.title}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-neutral-100 px-2 py-0.5 rounded text-[0.7rem] font-bold text-neutral-700 border border-neutral-200">
                            {doc.docType?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[0.7rem] text-neutral-600">
                          {doc.case ? `${doc.case.internalCaseId} (${doc.case.title})` : 'General / Matter'}
                        </td>
                        <td className="p-3.5 text-neutral-500">
                          {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-3.5 text-right">
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/download`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-black hover:underline px-2.5 py-1 rounded bg-neutral-100 border border-neutral-300 text-[0.7rem]"
                          >
                            ⬇️ View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass-card p-8 bg-white border border-neutral-200 text-center text-xs text-neutral-400 space-y-2">
                <p>You have not uploaded any documents yet.</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn-primary text-xs uppercase tracking-wider py-1.5 px-4"
                >
                  + Upload Document Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────── TAB 3: MESSAGES ──────── */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 pb-3">
            <h2 className="font-serif text-lg font-bold text-black">Direct Advocate Communications</h2>
            <p className="text-xs text-neutral-500">
              Send questions or updates directly to your legal team and view replies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Composer */}
            <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4 h-fit">
              <h3 className="font-serif font-bold text-base text-black flex items-center gap-2">
                <span>✍️</span>
                <span>Send Message to Advocate</span>
              </h3>

              <form onSubmit={handleSendMessage} className="space-y-3">
                <div>
                  <label className="form-label text-xs">Subject (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Document clarification / Query"
                    className="form-input text-xs py-2"
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your question, inquiry, or update..."
                    className="form-input text-xs py-2 resize-none"
                    value={msgContent}
                    onChange={(e) => setMsgContent(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingMsg || !msgContent.trim()}
                  className="btn-primary w-full text-xs uppercase tracking-wider py-2.5 justify-center"
                >
                  {sendingMsg ? 'Sending...' : '📤 Send Message'}
                </button>
              </form>
            </div>

            {/* Feed */}
            <div className="lg:col-span-2 glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-black border-b border-neutral-100 pb-3">
                Message History ({messages.length})
              </h3>

              {messages.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {messages.map((msg) => {
                    const isFromMe = msg.sender?.role === 'CLIENT' || msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`p-4 rounded border transition-all ${
                          isFromMe
                            ? 'bg-neutral-50 border-neutral-200 ml-4'
                            : 'bg-white border-black mr-4 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black">
                              {isFromMe ? '👤 You (Client)' : '⚖️ Super Admin / Advocate'}
                            </span>
                            <span
                              className={`text-[0.65rem] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                isFromMe ? 'bg-neutral-200 text-neutral-700' : 'bg-black text-white'
                              }`}
                            >
                              {isFromMe ? 'Sent by You' : 'Advocate Reply'}
                            </span>
                          </div>
                          <span className="text-[0.7rem] text-neutral-400">
                            {new Date(msg.createdAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {msg.subject && <h4 className="font-bold text-xs text-black mb-1">📌 {msg.subject}</h4>}
                        <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">{msg.content}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
                  <div className="text-3xl">💬</div>
                  <p>No messages sent or received yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────── TAB 4: PROFILE ──────── */}
      {activeTab === 'profile' && (
        <div className="glass-card p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm space-y-6 max-w-2xl">
          <h2 className="font-serif font-bold text-xl text-black border-b border-neutral-100 pb-3">
            Registered Account & Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                Client ID
              </span>
              <span className="font-mono font-bold text-black text-sm bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                {user?.clientId}
              </span>
            </div>
            <div>
              <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                Full Name
              </span>
              <span className="font-bold text-black text-sm">{user?.fullName}</span>
            </div>
            <div>
              <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                Email Address
              </span>
              <span className="text-neutral-800 font-semibold">{user?.email}</span>
            </div>
            <div>
              <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                Role
              </span>
              <span className="status-badge status-won text-[0.65rem]">CLIENT</span>
            </div>
          </div>

          <div className="p-4 rounded bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
            💡 If you need to update your registered email address, mobile number, or residential address, please contact our office or message your advocate via the Communications tab.
          </div>
        </div>
      )}

      {/* ──────── MODAL: CLIENT UPLOAD DOCUMENT ──────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card bg-white p-8 w-full max-w-lg space-y-4 border border-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-black">Upload Document to Advocate</h2>
                <p className="text-xs text-neutral-500">Submit ID proofs, agreements, evidence, or records</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleClientUpload} className="space-y-4">
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
                  placeholder="e.g. Identity Proof / Revenue Record"
                  className="form-input text-xs py-2"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Document Category</label>
                  <select
                    className="form-input text-xs py-2 bg-white"
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                  >
                    <option value="CLIENT_DOCUMENT">Client Document / ID</option>
                    <option value="EVIDENCE">Evidence / Record</option>
                    <option value="AFFIDAVIT">Affidavit / Declaration</option>
                    <option value="OTHER">Other Matter Document</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs">Associated Case (Optional)</label>
                  <select
                    className="form-input text-xs py-2 bg-white"
                    value={uploadCaseId}
                    onChange={(e) => setUploadCaseId(e.target.value)}
                  >
                    <option value="">-- General Matter Document --</option>
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.internalCaseId} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Description / Remarks (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Notes for the advocate about this document..."
                  className="form-input text-xs py-2 resize-none"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-[0.7rem] text-neutral-600">
                🔒 Uploaded documents are encrypted and instantly delivered to your Advocate in their Admin Portal.
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
                  {uploading ? 'Uploading...' : 'Submit to Advocate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
