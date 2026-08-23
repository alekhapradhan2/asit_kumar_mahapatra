'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || '[FIRM_NAME]',
    tagline: 'Expert Legal Counsel You Can Trust',
    contactEmail: 'contact@example.com',
    contactPhone: '+91 XXXXX XXXXX',
    officeAddress: '[Office Address], [City], [State] - [PIN]',
    workingHours: 'Mon–Sat: 10:00 AM – 6:00 PM',
    primaryColor: '#1a365d',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/dashboard" className="text-xs text-yellow-400 hover:text-yellow-300 font-medium mb-1 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="font-serif text-2xl font-bold text-white">White-Label & Site Settings</h1>
        <p className="text-xs text-slate-400">Configure firm name, contact details, address, and branding dynamically</p>
      </div>

      {saved && (
        <div className="p-4 rounded-lg text-sm text-emerald-400 border border-emerald-400/30 bg-emerald-400/10">
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-8 space-y-6">
        <h2 className="font-serif text-lg font-bold text-white border-b border-white/8 pb-3">Branding & Identity</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="form-label text-xs">Advocate / Firm Name</label>
            <input
              type="text"
              className="form-input text-sm"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label text-xs">Primary Brand Color (Hex)</label>
            <input
              type="text"
              className="form-input text-sm font-mono"
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="form-label text-xs">Firm Tagline</label>
          <input
            type="text"
            className="form-input text-sm"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />
        </div>

        <h2 className="font-serif text-lg font-bold text-white border-b border-white/8 pb-3 pt-4">Contact Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="form-label text-xs">Official Email</label>
            <input
              type="email"
              className="form-input text-sm"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label text-xs">Official Phone</label>
            <input
              type="tel"
              className="form-input text-sm"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="form-label text-xs">Office Address</label>
          <textarea
            rows={2}
            className="form-input text-sm resize-none"
            value={settings.officeAddress}
            onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-white/8">
          <button type="submit" className="btn-primary text-sm py-2.5 px-6">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
