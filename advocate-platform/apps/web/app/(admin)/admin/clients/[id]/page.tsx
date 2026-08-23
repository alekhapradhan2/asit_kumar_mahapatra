'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ClientDetail {
  id: string;
  clientId: string;
  fullName: string;
  email: string;
  mobile: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pinCode?: string | null;
  dateOfBirth?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    role: string;
    lastLoginAt?: string | null;
    isActive: boolean;
    createdAt: string;
  };
  cases?: any[];
  documents?: any[];
  messages?: any[];
  _count?: {
    cases: number;
    documents: number;
    messages: number;
  };
}

export default function AdminClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'documents' | 'messages'>('overview');

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  // Edit form
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    emergencyName: '',
    emergencyPhone: '',
  });

  // Upload form
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDocType, setUploadDocType] = useState('PETITION');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCaseId, setUploadCaseId] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadIsClientVisible, setUploadIsClientVisible] = useState(true);
  const [uploading, setUploading] = useState(false);

  // New Case form
  const [caseFormData, setCaseFormData] = useState({
    title: '',
    caseType: 'Civil Suit',
    practiceArea: 'Civil Litigation',
    courtName: 'High Court of Orissa',
    courtLocation: 'Cuttack',
    caseNumber: '',
    cnrNumber: '',
    priority: 'NORMAL',
    currentStatus: 'CONSULTATION',
    assignedAdvocate: 'Asit Kumar Mahapatra',
  });
  const [creatingCase, setCreatingCase] = useState(false);

  // Message form
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Status toggle / notifications
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchClientDetails = async () => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Client not found or access denied');
      }

      const data = await res.json();
      if (data.data) {
        setClient(data.data);
        setEditFormData({
          fullName: data.data.fullName || '',
          email: data.data.email || '',
          mobile: data.data.mobile || '',
          address: data.data.address || '',
          city: data.data.city || '',
          state: data.data.state || '',
          pinCode: data.data.pinCode || '',
          emergencyName: data.data.emergencyName || '',
          emergencyPhone: data.data.emergencyPhone || '',
        });
      }
    } catch {
      setActionNotice({ type: 'error', message: 'Failed to load client details' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  // Toggle client active status
  const handleToggleStatus = async () => {
    if (!client) return;
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !client.isActive }),
      });
      if (res.ok) {
        setActionNotice({
          type: 'success',
          message: `Client portal access ${!client.isActive ? 'activated' : 'disabled'} successfully`,
        });
        fetchClientDetails();
      }
    } catch {
      setActionNotice({ type: 'error', message: 'Failed to update client status' });
    }
  };

  // Handle edit client save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${client?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setShowEditModal(false);
        setActionNotice({ type: 'success', message: 'Client profile updated successfully' });
        fetchClientDetails();
      } else {
        const d = await res.json();
        setActionNotice({ type: 'error', message: d.message || 'Failed to update profile' });
      }
    } catch {
      setActionNotice({ type: 'error', message: 'Error saving client profile' });
    }
  };

  // Handle document upload
  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !client) return;

    setUploading(true);
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle || uploadFile.name);
      formData.append('docType', uploadDocType);
      formData.append('clientId', client.id);
      if (uploadCaseId) formData.append('caseId', uploadCaseId);
      if (uploadDescription) formData.append('description', uploadDescription);
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
        setUploadDescription('');
        setUploadCaseId('');
        setActionNotice({
          type: 'success',
          message: `Document uploaded ${uploadIsClientVisible ? '(Visible to Client in Portal)' : '(Admin-Only internal)'}`,
        });
        fetchClientDetails();
      } else {
        const d = await res.json();
        setActionNotice({ type: 'error', message: d.message || 'Upload failed' });
      }
    } catch {
      setActionNotice({ type: 'error', message: 'Document upload failed' });
    } finally {
      setUploading(false);
    }
  };

  // Handle document visibility toggle
  const handleToggleDocVisibility = async (docId: string, currentVisibility: string) => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    const newVisibility = currentVisibility === 'CLIENT_VISIBLE' ? 'ADMIN_ONLY' : 'CLIENT_VISIBLE';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ visibility: newVisibility }),
      });

      if (res.ok) {
        setActionNotice({
          type: 'success',
          message: `Document is now ${newVisibility === 'CLIENT_VISIBLE' ? 'Visible to Client' : 'Admin Only (Hidden from Client)'}`,
        });
        fetchClientDetails();
      }
    } catch {
      setActionNotice({ type: 'error', message: 'Failed to update visibility' });
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (docId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setActionNotice({ type: 'success', message: 'Document deleted successfully' });
        fetchClientDetails();
      }
    } catch {
      setActionNotice({ type: 'error', message: 'Failed to delete document' });
    }
  };

  // Handle create case
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    setCreatingCase(true);
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...caseFormData,
          clientId: client.id,
        }),
      });

      if (res.ok) {
        setShowNewCaseModal(false);
        setActionNotice({ type: 'success', message: 'New case created and linked to client' });
        setCaseFormData({
          title: '',
          caseType: 'Civil Suit',
          practiceArea: 'Civil Litigation',
          courtName: 'High Court of Orissa',
          courtLocation: 'Cuttack',
          caseNumber: '',
          cnrNumber: '',
          priority: 'NORMAL',
          currentStatus: 'CONSULTATION',
          assignedAdvocate: 'Asit Kumar Mahapatra',
        });
        fetchClientDetails();
      } else {
        const d = await res.json();
        setActionNotice({ type: 'error', message: d.message || 'Failed to create case' });
      }
    } catch {
      setActionNotice({ type: 'error', message: 'Failed to create case' });
    } finally {
      setCreatingCase(false);
    }
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !msgContent.trim()) return;

    setSendingMsg(true);
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientId: client.id,
          subject: msgSubject || undefined,
          content: msgContent,
          isClientVisible: true,
        }),
      });

      if (res.ok) {
        setMsgSubject('');
        setMsgContent('');
        setActionNotice({ type: 'success', message: 'Message delivered to client portal' });
        fetchClientDetails();
      } else {
        const d = await res.json();
        setActionNotice({ type: 'error', message: d.message || 'Failed to send message' });
      }
    } catch {
      setActionNotice({ type: 'error', message: 'Failed to send message' });
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-neutral-300 border-t-black rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
            Loading Client Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-neutral-50 p-8">
        <div className="glass-card max-w-xl mx-auto p-12 text-center bg-white border border-neutral-200">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-serif text-xl font-bold text-black mb-2">Client Not Found</h2>
          <p className="text-xs text-neutral-500 mb-6">The requested client record does not exist or has been removed.</p>
          <Link href="/admin/clients" className="btn-primary text-xs tracking-wider uppercase py-2 px-4">
            ← Return to Client Directory
          </Link>
        </div>
      </div>
    );
  }

  // Split documents into Client Uploaded vs Firm Uploaded
  const clientUploadedDocs = client.documents?.filter((d) => d.uploadedBy?.role === 'CLIENT') || [];
  const firmUploadedDocs = client.documents?.filter((d) => d.uploadedBy?.role !== 'CLIENT') || [];

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      {/* Top Banner Notice */}
      {actionNotice && (
        <div
          className={`p-3.5 px-8 text-xs font-semibold flex items-center justify-between transition-all ${
            actionNotice.type === 'success'
              ? 'bg-black text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          <span>{actionNotice.message}</span>
          <button onClick={() => setActionNotice(null)} className="text-xs opacity-70 hover:opacity-100">
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-xl py-6 space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/clients"
              className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              ← Back to Client Directory
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400">Portal Status:</span>
              <button
                onClick={handleToggleStatus}
                className={`status-badge transition-all cursor-pointer ${
                  client.isActive ? 'status-won' : 'status-pending'
                }`}
                title="Click to toggle client account active status"
              >
                ● {client.isActive ? 'Active (Portal Enabled)' : 'Disabled (Portal Locked)'}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-sm bg-black text-white flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0 shadow-md">
                {client.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">{client.fullName}</h1>
                  <span className="font-mono text-xs font-bold bg-neutral-100 px-2.5 py-1 rounded border border-neutral-300 text-black">
                    {client.clientId}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-neutral-600">
                  <a href={`mailto:${client.email}`} className="hover:underline flex items-center gap-1">
                    ✉️ {client.email}
                  </a>
                  <a href={`tel:${client.mobile}`} className="hover:underline flex items-center gap-1">
                    📞 {client.mobile}
                  </a>
                  {client.city && (
                    <span className="flex items-center gap-1">
                      📍 {client.city}, {client.state || 'India'}
                    </span>
                  )}
                  <span className="text-neutral-400">
                    Registered on {new Date(client.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowUploadModal(true)}
                id="btn-quick-upload-doc"
                className="btn-primary text-xs uppercase tracking-wider py-2 px-4 inline-flex items-center gap-1.5"
              >
                <span>📤</span>
                <span>Upload Document</span>
              </button>
              <button
                onClick={() => setShowNewCaseModal(true)}
                id="btn-quick-new-case"
                className="btn-outline text-xs uppercase tracking-wider py-2 px-4 inline-flex items-center gap-1.5"
              >
                <span>⚖️</span>
                <span>+ New Case</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('messages');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                id="btn-quick-message"
                className="btn-outline text-xs uppercase tracking-wider py-2 px-4 inline-flex items-center gap-1.5"
              >
                <span>💬</span>
                <span>Message</span>
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                id="btn-quick-edit-profile"
                className="btn-outline text-xs uppercase tracking-wider py-2 px-3 inline-flex items-center gap-1"
                title="Edit Client Info"
              >
                <span>✏️</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container-xl">
          <div className="flex border-b border-neutral-200 gap-8 text-xs font-bold uppercase tracking-wider overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              📊 Overview & Profile
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'cases'
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <span>📁 Cases</span>
              <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-[0.65rem] border border-neutral-200">
                {client.cases?.length ?? 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'documents'
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <span>📄 Documents Hub</span>
              <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-[0.65rem] border border-neutral-200">
                {client.documents?.length ?? 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'messages'
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <span>💬 Communications</span>
              <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-[0.65rem] border border-neutral-200">
                {client.messages?.length ?? 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-xl py-8">
        {/* ──────── TAB 1: OVERVIEW & PROFILE ──────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm">
                <div className="text-[0.7rem] uppercase tracking-wider text-neutral-500 font-bold mb-1">Total Cases</div>
                <div className="font-serif text-3xl font-bold text-black">{client.cases?.length || 0}</div>
                <div className="text-[0.7rem] text-neutral-400 mt-1">
                  {client.cases?.filter((c) => !c.isArchived).length || 0} active in court
                </div>
              </div>
              <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm">
                <div className="text-[0.7rem] uppercase tracking-wider text-neutral-500 font-bold mb-1">Client Uploads</div>
                <div className="font-serif text-3xl font-bold text-black">{clientUploadedDocs.length}</div>
                <div className="text-[0.7rem] text-neutral-400 mt-1">Uploaded by client in portal</div>
              </div>
              <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm">
                <div className="text-[0.7rem] uppercase tracking-wider text-neutral-500 font-bold mb-1">Firm Documents</div>
                <div className="font-serif text-3xl font-bold text-black">{firmUploadedDocs.length}</div>
                <div className="text-[0.7rem] text-neutral-400 mt-1">
                  {firmUploadedDocs.filter((d) => d.visibility === 'CLIENT_VISIBLE').length} visible to client
                </div>
              </div>
              <div className="glass-card p-5 bg-white border border-neutral-200 shadow-sm">
                <div className="text-[0.7rem] uppercase tracking-wider text-neutral-500 font-bold mb-1">Messages</div>
                <div className="font-serif text-3xl font-bold text-black">{client.messages?.length || 0}</div>
                <div className="text-[0.7rem] text-neutral-400 mt-1">Direct communication logs</div>
              </div>
            </div>

            {/* Profile and Contact Information Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h2 className="font-serif font-bold text-lg text-black flex items-center gap-2">
                    <span>👤</span>
                    <span>Client Profile Details</span>
                  </h2>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-xs uppercase tracking-wider font-bold text-black hover:underline"
                  >
                    Edit Info ✏️
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                      Full Legal Name
                    </span>
                    <span className="font-bold text-black text-sm">{client.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                      Client ID (System Unique)
                    </span>
                    <span className="font-mono font-bold text-black text-sm bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      {client.clientId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                      Email Address
                    </span>
                    <span className="text-black font-semibold">{client.email}</span>
                  </div>
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                      Mobile Number
                    </span>
                    <span className="text-black font-semibold font-mono">{client.mobile}</span>
                  </div>
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                      Residential / Office Address
                    </span>
                    <span className="text-neutral-700">{client.address || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                      City, State & PIN
                    </span>
                    <span className="text-neutral-700">
                      {client.city ? `${client.city}, ${client.state || ''} ${client.pinCode ? `- ${client.pinCode}` : ''}` : '—'}
                    </span>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="font-serif font-bold text-sm text-black mb-3">Emergency Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                        Emergency Contact Person
                      </span>
                      <span className="text-neutral-800 font-semibold">{client.emergencyName || 'Not configured'}</span>
                    </div>
                    <div>
                      <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                        Emergency Phone
                      </span>
                      <span className="text-neutral-800 font-mono font-semibold">{client.emergencyPhone || 'Not configured'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portal Security & Account Info */}
              <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
                <h2 className="font-serif font-bold text-lg text-black border-b border-neutral-100 pb-3">
                  🔐 Portal Account
                </h2>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-0.5">
                      Account Status
                    </span>
                    <span className={`status-badge ${client.isActive ? 'status-won' : 'status-pending'}`}>
                      {client.isActive ? 'ACTIVE' : 'LOCKED'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-0.5">
                      Last Portal Login
                    </span>
                    <span className="text-black font-medium">
                      {client.user?.lastLoginAt
                        ? new Date(client.user.lastLoginAt).toLocaleString('en-IN')
                        : 'Never logged in'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-bold text-neutral-400 block mb-0.5">
                      User Account ID
                    </span>
                    <span className="font-mono text-neutral-500 text-[0.7rem]">{client.user?.id}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <button
                    onClick={handleToggleStatus}
                    className="w-full text-xs font-bold uppercase tracking-wider py-2 px-3 rounded border border-neutral-300 hover:border-black transition-all bg-neutral-50 hover:bg-white text-black"
                  >
                    {client.isActive ? '🔒 Lock Client Portal Access' : '🔓 Unlock Client Portal Access'}
                  </button>
                  <p className="text-[0.65rem] text-neutral-400 text-center">
                    When unlocked, client can sign into client portal using their credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── TAB 2: CASES ──────── */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-black">Registered Cases for {client.fullName}</h2>
                <p className="text-xs text-neutral-500">Legal cases and matters associated with this client</p>
              </div>
              <button
                onClick={() => setShowNewCaseModal(true)}
                id="btn-tab-new-case"
                className="btn-primary text-xs uppercase tracking-wider py-2 px-4"
              >
                + Register New Case
              </button>
            </div>

            {client.cases && client.cases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.cases.map((c) => (
                  <div
                    key={c.id}
                    className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4 hover:border-black transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 text-black">
                            {c.internalCaseId}
                          </span>
                          <span className="status-badge status-won text-[0.65rem]">
                            {c.currentStatus?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-black">{c.title}</h3>
                      </div>
                      <span className="text-[0.7rem] uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 font-bold text-neutral-600">
                        {c.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-wider text-neutral-400 block">Court</span>
                        <span className="font-medium text-black">{c.courtName || 'Not assigned'}</span>
                      </div>
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-wider text-neutral-400 block">Practice Area</span>
                        <span className="font-medium text-black">{c.practiceArea}</span>
                      </div>
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-wider text-neutral-400 block">Case / CNR No.</span>
                        <span className="font-mono text-black">{c.caseNumber || c.cnrNumber || 'Pending'}</span>
                      </div>
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-wider text-neutral-400 block">Next Hearing</span>
                        <span className="font-semibold text-black">
                          {c.nextHearingDate
                            ? new Date(c.nextHearingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Not scheduled'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-neutral-100">
                      <Link
                        href={`/admin/cases`}
                        className="text-xs uppercase tracking-wider font-bold text-black hover:underline"
                      >
                        View Case Records →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center bg-white border border-neutral-200 space-y-3">
                <div className="text-4xl">📁</div>
                <h3 className="font-serif font-bold text-base text-black">No Cases Registered Yet</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Click &ldquo;+ Register New Case&rdquo; to create a case filing linked to {client.fullName}.
                </p>
                <button
                  onClick={() => setShowNewCaseModal(true)}
                  className="btn-primary text-xs uppercase tracking-wider py-2 px-4 mt-2 inline-block"
                >
                  + Register First Case
                </button>
              </div>
            )}
          </div>
        )}

        {/* ──────── TAB 3: DOCUMENTS (BIDIRECTIONAL DUAL SECTIONS) ──────── */}
        {activeTab === 'documents' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-black">Documents Hub</h2>
                <p className="text-xs text-neutral-500">
                  Manage files uploaded by the client and files uploaded by the advocate with role-based visibility controls
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                id="btn-tab-upload-doc"
                className="btn-primary text-xs uppercase tracking-wider py-2 px-5 inline-flex items-center gap-1.5"
              >
                <span>📤</span>
                <span>+ Upload Document for Client</span>
              </button>
            </div>

            {/* SECTION A: CLIENT UPLOADED DOCUMENTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                    👤
                  </span>
                  <h3 className="font-serif font-bold text-lg text-black">
                    Client Uploaded Documents
                  </h3>
                  <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-xs font-bold text-neutral-700 border border-neutral-200">
                    {clientUploadedDocs.length}
                  </span>
                </div>
                <span className="text-[0.7rem] text-neutral-500">
                  Files uploaded directly by {client.fullName} from their Client Portal
                </span>
              </div>

              {clientUploadedDocs.length > 0 ? (
                <div className="glass-card bg-white border border-neutral-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs text-neutral-800">
                    <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
                      <tr>
                        <th className="p-3.5">Document Title</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Linked Case</th>
                        <th className="p-3.5">Uploaded Date</th>
                        <th className="p-3.5">File Size</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {clientUploadedDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-black flex items-center gap-2">
                            <span className="text-base">📄</span>
                            <span>{doc.title}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded text-[0.7rem] font-bold border border-neutral-200 text-neutral-700">
                              {doc.docType?.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 text-neutral-600 font-mono text-[0.7rem]">
                            {doc.case ? `${doc.case.internalCaseId} (${doc.case.title})` : 'General / Direct'}
                          </td>
                          <td className="p-3.5 text-neutral-500">
                            {new Date(doc.uploadedAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3.5 text-neutral-500 font-mono">
                            {(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/download`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-black hover:underline px-2.5 py-1 rounded bg-neutral-100 border border-neutral-300 hover:border-black"
                            >
                              ⬇️ Download / View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card p-6 bg-white border border-neutral-200 text-center text-xs text-neutral-400">
                  Client has not uploaded any documents from their portal yet.
                </div>
              )}
            </div>

            {/* SECTION B: ADVOCATE / FIRM UPLOADED DOCUMENTS */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                    ⚖️
                  </span>
                  <h3 className="font-serif font-bold text-lg text-black">
                    Advocate & Firm Uploaded Documents
                  </h3>
                  <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-xs font-bold text-neutral-700 border border-neutral-200">
                    {firmUploadedDocs.length}
                  </span>
                </div>
                <span className="text-[0.7rem] text-neutral-500">
                  Toggle visibility switch to show or hide documents from the client&apos;s portal
                </span>
              </div>

              {firmUploadedDocs.length > 0 ? (
                <div className="glass-card bg-white border border-neutral-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs text-neutral-800">
                    <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
                      <tr>
                        <th className="p-3.5">Document Title</th>
                        <th className="p-3.5">Doc Type</th>
                        <th className="p-3.5">Linked Case</th>
                        <th className="p-3.5">Uploaded Date</th>
                        <th className="p-3.5">Client Visibility Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {firmUploadedDocs.map((doc) => {
                        const isVisible = doc.visibility === 'CLIENT_VISIBLE';
                        return (
                          <tr key={doc.id} className="hover:bg-neutral-50/80 transition-colors">
                            <td className="p-3.5 font-bold text-black flex items-center gap-2">
                              <span className="text-base">📄</span>
                              <span>{doc.title}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="bg-neutral-100 px-2 py-0.5 rounded text-[0.7rem] font-bold border border-neutral-200 text-neutral-700">
                                {doc.docType?.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="p-3.5 text-neutral-600 font-mono text-[0.7rem]">
                              {doc.case ? `${doc.case.internalCaseId} (${doc.case.title})` : 'General / Direct'}
                            </td>
                            <td className="p-3.5 text-neutral-500">
                              {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleDocVisibility(doc.id, doc.visibility)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                                  isVisible
                                    ? 'bg-black text-white border-black hover:bg-neutral-800'
                                    : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:border-black'
                                }`}
                                title="Click to toggle visibility in client portal"
                              >
                                <span>{isVisible ? '🌐' : '🔒'}</span>
                                <span>{isVisible ? 'Visible to Client' : 'Admin Only (Hidden)'}</span>
                              </button>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/download`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-black hover:underline px-2.5 py-1 rounded bg-neutral-100 border border-neutral-300 hover:border-black"
                              >
                                ⬇️ Download
                              </a>
                              <button
                                onClick={() => handleDeleteDocument(doc.id, doc.title)}
                                className="text-red-600 hover:text-red-800 font-bold px-2 py-1"
                                title="Delete document"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card p-8 bg-white border border-neutral-200 text-center text-xs text-neutral-400 space-y-2">
                  <p>No documents uploaded by firm for this client yet.</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary text-xs uppercase tracking-wider py-1.5 px-4"
                  >
                    + Upload First Document
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────── TAB 4: MESSAGES & COMMUNICATIONS ──────── */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-black">Communications & Inquiry Logs</h2>
                <p className="text-xs text-neutral-500">
                  Direct message feed between Super Admin / Advocate and {client.fullName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message Composer */}
              <div className="glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4 h-fit">
                <h3 className="font-serif font-bold text-base text-black flex items-center gap-2">
                  <span>✍️</span>
                  <span>Send Message to Client</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Messages appear instantly in the client&apos;s portal dashboard under their Communications tab.
                </p>

                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div>
                    <label className="form-label text-xs">Subject / Title (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Case hearing update / Document requested"
                      className="form-input text-xs py-2"
                      value={msgSubject}
                      onChange={(e) => setMsgSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Message Content *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Type your message, legal instruction, or update here..."
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
                    {sendingMsg ? 'Sending...' : '📤 Send to Client Portal'}
                  </button>
                </form>
              </div>

              {/* Message Feed */}
              <div className="lg:col-span-2 glass-card p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-base text-black border-b border-neutral-100 pb-3 flex items-center justify-between">
                  <span>Message History</span>
                  <span className="text-xs text-neutral-500 font-sans font-normal">
                    {client.messages?.length || 0} Total Messages
                  </span>
                </h3>

                {client.messages && client.messages.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {client.messages.map((msg) => {
                      const isFromClient = msg.sender?.role === 'CLIENT';
                      return (
                        <div
                          key={msg.id}
                          className={`p-4 rounded border transition-all ${
                            isFromClient
                              ? 'bg-neutral-50 border-neutral-200 ml-4'
                              : 'bg-white border-black mr-4 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-black">
                                {isFromClient ? `👤 ${client.fullName} (Client)` : '⚖️ Super Admin / Advocate'}
                              </span>
                              <span
                                className={`text-[0.65rem] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                  isFromClient
                                    ? 'bg-neutral-200 text-neutral-700'
                                    : 'bg-black text-white'
                                }`}
                              >
                                {isFromClient ? 'Client Portal' : 'Admin Portal'}
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

                          {msg.subject && (
                            <h4 className="font-bold text-xs text-black mb-1">
                              📌 {msg.subject}
                            </h4>
                          )}
                          <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs text-neutral-400 space-y-2">
                    <div className="text-3xl">💬</div>
                    <p>No messages exchanged yet with this client.</p>
                    <p className="text-neutral-400">
                      Use the composer on the left to initiate contact or post legal instructions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ──────── MODAL: EDIT CLIENT INFO ──────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card bg-white p-8 w-full max-w-lg space-y-4 border border-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="font-serif text-lg font-bold text-black">Edit Client Details</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="form-label text-xs">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input text-xs py-2"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Email *</label>
                  <input
                    type="email"
                    required
                    className="form-input text-xs py-2"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Mobile *</label>
                  <input
                    type="tel"
                    required
                    className="form-input text-xs py-2"
                    value={editFormData.mobile}
                    onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Address</label>
                <input
                  type="text"
                  className="form-input text-xs py-2"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="form-label text-xs">City</label>
                  <input
                    type="text"
                    className="form-input text-xs py-2"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">State</label>
                  <input
                    type="text"
                    className="form-input text-xs py-2"
                    value={editFormData.state}
                    onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">PIN Code</label>
                  <input
                    type="text"
                    className="form-input text-xs py-2"
                    value={editFormData.pinCode}
                    onChange={(e) => setEditFormData({ ...editFormData, pinCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="form-label text-xs">Emergency Contact</label>
                  <input
                    type="text"
                    className="form-input text-xs py-2"
                    value={editFormData.emergencyName}
                    onChange={(e) => setEditFormData({ ...editFormData, emergencyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Emergency Phone</label>
                  <input
                    type="tel"
                    className="form-input text-xs py-2"
                    value={editFormData.emergencyPhone}
                    onChange={(e) => setEditFormData({ ...editFormData, emergencyPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────── MODAL: UPLOAD DOCUMENT ──────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card bg-white p-8 w-full max-w-lg space-y-4 border border-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-black">Upload Document for {client.fullName}</h2>
                <p className="text-xs text-neutral-500">Attach court orders, petitions, judgments, or evidence</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4">
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
                  placeholder="e.g. Certified Copy of Interim Stay Order"
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
                    <option value="SETTLEMENT">Settlement Deed</option>
                    <option value="OTHER">Other Legal Document</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs">Link to Case (Optional)</label>
                  <select
                    className="form-input text-xs py-2 bg-white"
                    value={uploadCaseId}
                    onChange={(e) => setUploadCaseId(e.target.value)}
                  >
                    <option value="">-- Direct to Client (No Case) --</option>
                    {client.cases?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.internalCaseId} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Description / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Additional remarks or notes..."
                  className="form-input text-xs py-2 resize-none"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>

              {/* CLIENT VISIBILITY TOGGLE */}
              <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-xs text-black block">Make Visible to Client in Portal</label>
                    <p className="text-[0.7rem] text-neutral-500">
                      When enabled, {client.fullName} can view and download this document in their Client Portal.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="chk-visibility"
                    checked={uploadIsClientVisible}
                    onChange={(e) => setUploadIsClientVisible(e.target.checked)}
                    className="w-5 h-5 accent-black cursor-pointer"
                  />
                </div>
                <div className="text-[0.65rem] font-semibold text-neutral-600">
                  Status:{' '}
                  <span className={uploadIsClientVisible ? 'text-black font-bold' : 'text-neutral-500'}>
                    {uploadIsClientVisible ? '🌐 Visible to Client' : '🔒 Admin Only (Internal Secret)'}
                  </span>
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
                  {uploading ? 'Uploading...' : 'Upload & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────── MODAL: REGISTER NEW CASE ──────── */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card bg-white p-8 w-full max-w-lg space-y-4 border border-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-black">New Case for {client.fullName}</h2>
                <p className="text-xs text-neutral-500">Register new case matter in client portfolio</p>
              </div>
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="form-label text-xs">Case Title / Cause Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar vs. State of Odisha"
                  className="form-input text-xs py-2"
                  value={caseFormData.title}
                  onChange={(e) => setCaseFormData({ ...caseFormData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Case Type</label>
                  <input
                    type="text"
                    required
                    placeholder="Writ Petition / Civil Appeal"
                    className="form-input text-xs py-2"
                    value={caseFormData.caseType}
                    onChange={(e) => setCaseFormData({ ...caseFormData, caseType: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Practice Area</label>
                  <input
                    type="text"
                    required
                    placeholder="Civil Litigation / Criminal"
                    className="form-input text-xs py-2"
                    value={caseFormData.practiceArea}
                    onChange={(e) => setCaseFormData({ ...caseFormData, practiceArea: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Court Name</label>
                  <input
                    type="text"
                    placeholder="High Court of Orissa"
                    className="form-input text-xs py-2"
                    value={caseFormData.courtName}
                    onChange={(e) => setCaseFormData({ ...caseFormData, courtName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Court Location</label>
                  <input
                    type="text"
                    placeholder="Cuttack"
                    className="form-input text-xs py-2"
                    value={caseFormData.courtLocation}
                    onChange={(e) => setCaseFormData({ ...caseFormData, courtLocation: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Case Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="WP(C) 1234/2026"
                    className="form-input text-xs py-2 font-mono"
                    value={caseFormData.caseNumber}
                    onChange={(e) => setCaseFormData({ ...caseFormData, caseNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">CNR Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="ODHC010012342026"
                    className="form-input text-xs py-2 font-mono"
                    value={caseFormData.cnrNumber}
                    onChange={(e) => setCaseFormData({ ...caseFormData, cnrNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCase}
                  className="btn-primary text-xs py-2 px-5"
                >
                  {creatingCase ? 'Creating...' : 'Register Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
