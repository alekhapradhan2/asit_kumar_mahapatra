'use client';
import Link from 'next/link';

export default function AdminActivityLogsPage() {
  const sampleLogs = [
    { action: 'CLIENT_CREATED', resource: 'Client: CLIENT-B82F19', time: 'Just now', ip: '127.0.0.1' },
    { action: 'CASE_STATUS_UPDATED', resource: 'Case: CASE-7A9B1C', time: '10 mins ago', ip: '127.0.0.1' },
    { action: 'OFFICIAL_SYNC_INITIATED', resource: 'Provider: MANUAL', time: '1 hour ago', ip: '127.0.0.1' },
    { action: 'SUPER_ADMIN_LOGIN', resource: 'User: admin@example.com', time: '2 hours ago', ip: '127.0.0.1' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link href="/admin/dashboard" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-bold mb-2 inline-flex items-center gap-1.5 transition-colors">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-9 h-9 rounded-sm bg-black text-white flex items-center justify-center font-bold text-sm">
              🔍
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-black">Immutable Audit Trail</h1>
              <p className="text-xs text-neutral-500">Security event logging, authorization audits, and case mutation history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden bg-white border border-neutral-200 shadow-sm">
        <table className="w-full text-left text-sm text-neutral-800">
          <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
            <tr>
              <th className="p-4">Action Event</th>
              <th className="p-4">Resource Details</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Origin IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-xs">
            {sampleLogs.map((log, i) => (
              <tr key={i} className="hover:bg-neutral-50/80 transition-colors">
                <td className="p-4 font-mono font-bold text-black">
                  <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 font-semibold text-black">{log.resource}</td>
                <td className="p-4 text-neutral-500">{log.time}</td>
                <td className="p-4 font-mono text-neutral-600">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
