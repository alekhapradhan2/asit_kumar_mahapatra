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
    <div className="p-8 space-y-6">
      <div>
        <Link href="/admin/dashboard" className="text-xs text-yellow-400 hover:text-yellow-300 font-medium mb-1 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="font-serif text-2xl font-bold text-white">Immutable Audit Trail</h1>
        <p className="text-xs text-slate-400">Security event logging, authorization audits, and case mutation history</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider border-b border-white/8">
            <tr>
              <th className="p-4">Action Event</th>
              <th className="p-4">Resource Details</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Origin IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6 text-xs">
            {sampleLogs.map((log, i) => (
              <tr key={i} className="hover:bg-white/3">
                <td className="p-4 font-mono font-semibold text-yellow-400">{log.action}</td>
                <td className="p-4 text-white">{log.resource}</td>
                <td className="p-4 text-slate-400">{log.time}</td>
                <td className="p-4 font-mono text-slate-500">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
