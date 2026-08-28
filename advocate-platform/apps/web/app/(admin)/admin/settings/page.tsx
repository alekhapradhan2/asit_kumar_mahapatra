'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra',
    tagline: 'High Court & District Court Legal Practice',
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'advocate.asitmahapatra@gmail.com',
    contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 98610 00000',
    officeAddress: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || 'High Court Bar Association & Chamber Complex, Cuttack / Bhubaneswar, Odisha',
    workingHours: 'Mon–Sat: 10:00 AM – 7:00 PM',
    primaryColor: '#000000',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8 space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link href="/admin/dashboard" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-bold mb-2 inline-flex items-center gap-1.5 transition-colors">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-9 h-9 rounded-sm bg-black text-white flex items-center justify-center font-bold text-sm">
              ⚙️
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-black">Firm & Portal Settings</h1>
              <p className="text-xs text-neutral-500">Configure firm name, contact details, address, and branding dynamically</p>
            </div>
          </div>
        </div>
      </div>

      {saved && (
        <div className="p-3 px-4 rounded text-xs font-semibold text-black bg-neutral-100 border border-neutral-300">
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-8 space-y-6 bg-white border border-neutral-200 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-black border-b border-neutral-100 pb-3">Branding & Identity</h2>

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

        <h2 className="font-serif text-lg font-bold text-black border-b border-neutral-100 pb-3 pt-4">Contact Information</h2>

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

        <div className="flex justify-end pt-4 border-t border-neutral-200">
          <button type="submit" className="btn-primary text-xs uppercase tracking-wider py-2.5 px-6">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
