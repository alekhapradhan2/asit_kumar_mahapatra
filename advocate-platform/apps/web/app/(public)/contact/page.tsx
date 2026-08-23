'use client';
import { useState } from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    practiceArea: 'Criminal Law Defense',
    caseStage: 'Pre-filing / Inquiry',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 600);
  };

  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-grow pt-28 pb-16">
          {/* Header */}
          <section className="container-xl py-12 text-center max-w-4xl mx-auto">
            <div className="section-label justify-center">Chambers Consultation</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-4 tracking-tight">
              Contact {siteName}
            </h1>
            <p className="text-neutral-700 text-base sm:text-lg max-w-2xl mx-auto">
              Schedule a confidential preliminary consultation or submit details of your ongoing court proceedings.
            </p>
          </section>

          {/* Contact Grid */}
          <section className="container-xl py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Chambers Info */}
              <div className="lg:col-span-4 p-8 space-y-6 rounded-xl bg-white/95 border border-neutral-200 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
                  <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-black">Chambers Office</h2>
                    <span className="text-[0.65rem] uppercase tracking-widest text-neutral-500 font-mono font-bold">
                      High Court Practice
                    </span>
                  </div>
                </div>

                <div className="space-y-5 text-sm text-neutral-800">
                  <div className="flex items-start gap-3.5">
                    <svg className="w-4 h-4 text-black flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      <strong className="text-black block mb-0.5">Chambers Address</strong>
                      <span className="text-xs text-neutral-600 leading-relaxed block font-medium">
                        {process.env.NEXT_PUBLIC_OFFICE_ADDRESS || 'High Court Bar Association & Chamber Complex, Cuttack / Bhubaneswar, Odisha'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <svg className="w-4 h-4 text-black flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div>
                      <strong className="text-black block mb-0.5">Direct Chamber Line</strong>
                      <span className="text-xs text-neutral-600 font-mono block font-medium">
                        {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 98610 00000'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <svg className="w-4 h-4 text-black flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <div>
                      <strong className="text-black block mb-0.5">Official Email</strong>
                      <span className="text-xs text-neutral-600 font-mono block font-medium">
                        {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'advocate.asitmahapatra@gmail.com'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <svg className="w-4 h-4 text-black flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <div>
                      <strong className="text-black block mb-0.5">Chamber Hours</strong>
                      <span className="text-xs text-neutral-600 block font-medium">
                        Monday – Saturday: 10:00 AM – 7:30 PM (Prior Appointment Recommended)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-700 leading-relaxed font-mono">
                  <strong>Confidentiality Notice:</strong> In accordance with Section 126 of the Evidence Act / BSA, all information shared is protected under attorney-client privilege.
                </div>
              </div>

              {/* Consultation Form */}
              <div className="lg:col-span-8 p-8 sm:p-10 rounded-xl bg-white/95 border border-neutral-200 shadow-sm">
                {submitted ? (
                  <div className="text-center py-16 space-y-5 animate-fade-in-up">
                    <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl mx-auto font-bold">
                      ✓
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-black">
                      Consultation Request Received
                    </h3>
                    <p className="text-neutral-700 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you for contacting the chambers of {siteName}. Our litigation desk will review your submission and contact you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-300 hover:border-black text-xs font-bold uppercase tracking-wider text-black bg-white"
                    >
                      Submit Another Legal Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
                    <div className="border-b border-neutral-200 pb-4">
                      <h2 className="font-serif text-2xl font-bold text-black mb-1">
                        Request a Legal Consultation
                      </h2>
                      <p className="text-xs text-neutral-600">
                        Please provide basic details about your legal dispute or matter.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="fullName" className="form-label">Full Legal Name *</label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Rajesh Kumar Sharma"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="form-label">Mobile Number (WhatsApp) *</label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          className="form-input font-mono"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input
                          id="email"
                          type="email"
                          required
                          className="form-input font-mono"
                          placeholder="client@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="practiceArea" className="form-label">Legal Jurisdiction / Subject</label>
                        <select
                          id="practiceArea"
                          className="form-input bg-white text-black font-medium"
                          value={formData.practiceArea}
                          onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
                        >
                          <option value="Criminal Law Defense">Criminal Law Defense (Bail / Trial / FIR Quashing)</option>
                          <option value="Property & Real Estate">Property & Real Estate (Title / Possession / RERA)</option>
                          <option value="Family & Matrimonial">Family & Matrimonial (Divorce / Custody / Maintenance)</option>
                          <option value="Consumer Protection">Consumer Protection (Deficiency / NCDRC / SCDRC)</option>
                          <option value="Civil & Commercial">Civil & Commercial (Order 37 / Injunctions / Appeals)</option>
                          <option value="Cyber Law & Digital Fraud">Cyber Law & Digital Fraud</option>
                          <option value="Other Legal Matter">Other High Court / Tribunal Matter</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="form-label">Brief Summary of Facts / Case CNR Number *</label>
                      <textarea
                        id="message"
                        rows={4}
                        required
                        className="form-input resize-none"
                        placeholder="Please summarize the facts, court name, or CNR number if already instituted..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center py-4 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      {loading ? 'Submitting Consultation Request...' : 'Submit Confidential Consultation Request →'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>
        <PublicFooter />
      </div>
    </>
  );
}
