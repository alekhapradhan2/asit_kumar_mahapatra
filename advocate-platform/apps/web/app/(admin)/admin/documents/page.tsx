'use client';
import Link from 'next/link';

export default function AdminDocumentsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <Link href="/admin/dashboard" className="text-xs text-yellow-400 hover:text-yellow-300 font-medium mb-1 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="font-serif text-2xl font-bold text-white">Document Management</h1>
        <p className="text-xs text-slate-400">Secure legal documents storage with role-based visibility controls</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="font-semibold text-white text-sm mb-1">Admin Only</h3>
          <p className="text-xs text-slate-400">Internal work products, legal strategies, and confidential notes.</p>
        </div>
        <div className="glass-card p-6">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-semibold text-white text-sm mb-1">Internal Team</h3>
          <p className="text-xs text-slate-400">Draft pleadings, research memos, and colleague annotations.</p>
        </div>
        <div className="glass-card p-6">
          <div className="text-3xl mb-2">🌐</div>
          <h3 className="font-semibold text-white text-sm mb-1">Client Visible</h3>
          <p className="text-xs text-slate-400">Filed petitions, hearing orders, and certified judgment copies.</p>
        </div>
      </div>

      <div className="glass-card p-8 text-center text-xs text-slate-500">
        All documents are served via 10-minute expiring signed URLs. Public access is strictly forbidden.
      </div>
    </div>
  );
}
