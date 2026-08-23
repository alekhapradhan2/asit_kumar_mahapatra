import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ContactCTA } from '@/components/public/ContactCTA';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

export const metadata: Metadata = {
  title: `About the Advocate & Chambers — ${siteName}`,
  description: `Learn about Advocate Asit Kumar Mahapatra's 18+ years of courtroom litigation, High Court practice, and client-first commitment.`,
};

export default function AboutPage() {
  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-grow pt-28 pb-16">
          {/* Header */}
          <section className="container-xl py-12 text-center max-w-4xl mx-auto">
            <div className="section-label justify-center">About The Advocate & Law Chambers</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight">
              Dedicated Courtroom Advocacy With Integrity & Precision
            </h1>
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Chambers of {siteName} is founded on deep statutory acumen, unyielding attorney-client confidentiality, and tireless courtroom representation.
            </p>
          </section>

          {/* Profile & Practice Bio */}
          <section className="container-xl py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 court-card-stark p-8 sm:p-10 rounded-xs bg-white relative overflow-hidden">
                <div className="w-16 h-16 rounded-xs bg-black text-white flex items-center justify-center text-3xl mb-6 font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
                  ⚖️
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black mb-4">
                  Advocate Profile & Judicial Philosophy
                </h2>
                <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                  With over 18 years of active practice across High Courts, District & Sessions Courts, and Specialized Appellate Tribunals, Advocate Asit Kumar Mahapatra provides strategic, multi-disciplinary legal counsel.
                </p>
                <p className="text-neutral-700 text-sm leading-relaxed mb-6">
                  Every brief is treated with intellectual rigor: isolating core statutory questions, reviewing documentary chains, and formulating persuasive oral pleadings before the Bench.
                </p>
                <div className="p-4 rounded-xs bg-neutral-100 border border-black text-xs text-black font-mono font-bold">
                  🏛️ Bar Council Certified Legal Practitioner • High Court Bar Association Member
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                {[
                  {
                    title: 'High Court & Trial Practice',
                    desc: 'Extensive litigation experience in regular & anticipatory bail, FIR quashing under Sec 482, complex civil appeals, and title disputes.',
                    icon: '🏛️',
                  },
                  {
                    title: 'Transparent Case Management',
                    desc: 'Proprietary client portal with real-time updates distinguishing official court causelists and orders from internal chamber strategy notes.',
                    icon: '📱',
                  },
                  {
                    title: 'Strict Confidentiality & Privilege',
                    desc: 'Unwavering adherence to Section 126 of the Evidence Act / BSA with encrypted digital infrastructure for all client files.',
                    icon: '🛡️',
                  },
                ].map((item) => (
                  <div key={item.title} className="court-card-stark p-6 flex gap-4 items-start rounded-xs bg-white">
                    <span className="text-3xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-black mb-1.5">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Core Principles */}
          <section className="container-xl py-12">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-black mb-3">Chamber Principles</h2>
              <p className="text-neutral-600 text-sm max-w-xl mx-auto">The pillars that define our daily practice of law.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Statutory Rigor', desc: 'Every case begins with thorough legislative analysis and deep precedent research before drafting.' },
                { label: 'Client Dignity & Empathy', desc: 'We treat every client with utmost respect, active listening, and total transparency on case merits.' },
                { label: 'Uncompromising Ethics', desc: 'Highest standard of legal ethics with zero false assurances or hidden commercial fee structures.' },
              ].map((p) => (
                <div key={p.label} className="court-card-stark p-8 text-center rounded-xs bg-white">
                  <h3 className="font-serif text-xl font-bold text-black mb-3">{p.label}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <ContactCTA />
        </main>
        <PublicFooter />
      </div>
    </>
  );
}
