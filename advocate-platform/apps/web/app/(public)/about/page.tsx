import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ContactCTA } from '@/components/public/ContactCTA';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';
const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 98610 00000';
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'advocate.asitmahapatra@gmail.com';

export const metadata: Metadata = {
  title: `About the Advocate & Chambers — ${siteName}`,
  description: `Learn about Advocate Asit Kumar Mahapatra's 18+ years of courtroom litigation, High Court practice, and client-first commitment.`,
};

const stats = [
  { value: '18+', label: 'Years Active Standing', sub: 'High Court & Sessions' },
  { value: '500+', label: 'Briefs & Litigations', sub: 'Trial & Appellate Matters' },
  { value: '6', label: 'Core Jurisdictions', sub: 'Criminal, Civil, RERA, Family' },
  { value: '100%', label: 'Privileged & Encrypted', sub: 'Section 126 BSA / Evidence Act' },
];

const pillars = [
  {
    num: '01',
    title: 'Statutory & Precedent Rigor',
    desc: 'Every petition, writ, and bail application is constructed upon deep legislative analysis of procedural codes (BNSS/CrPC, CPC) and binding Supreme Court precedent.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
  },
  {
    num: '02',
    title: 'Courtroom Advocacy & Oral Pleadings',
    desc: 'Persuasive, fearless representation before the Bench. Dissecting witness testimonies, cross-examination nuances, and challenging procedural irregularities.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    ),
  },
  {
    num: '03',
    title: 'Digital Transparency & Causelist Tracking',
    desc: 'Pioneering transparent legal services with our dedicated client portal—giving litigants 24/7 visibility into CNR updates, causelists, and authenticated orders.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    num: '04',
    title: 'Unwavering Ethics & Confidentiality',
    desc: 'Highest ethical standards with zero false guarantees, fully transparent fee schedules, and inviolable client-attorney confidentiality under Section 126.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
];

const workflow = [
  {
    step: '01',
    title: 'Preliminary Brief & Document Review',
    desc: 'Initial confidential evaluation of police records, FIRs, trial orders, plaints, or commercial contracts to determine statutory viability.',
  },
  {
    step: '02',
    title: 'Procedural Strategy & Legal Groundwork',
    desc: 'Isolating jurisdictional points, framing statutory defenses, drafting comprehensive petitions, and verifying precedent rulings.',
  },
  {
    step: '03',
    title: 'Bench Mentioning & Oral Advocacy',
    desc: 'Urgent listing before the Bench, interim relief argument (stay / bail), and dedicated representation through all trial and appellate stages.',
  },
  {
    step: '04',
    title: '24/7 Digital Tracking & Milestone Reporting',
    desc: 'Automated causelist monitoring, certified copy downloads, and prompt advisory memos delivered securely to your client portal.',
  },
];

export default function AboutPage() {
  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        
        <main className="flex-grow pt-28 pb-16">
          {/* Hero Header Section */}
          <section className="container-xl py-10 sm:py-16 text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-5 text-[0.72rem] font-semibold tracking-wide text-neutral-800 bg-white/90 border border-neutral-300 shadow-2xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span>Chambers Overview • High Court & Supreme Court Counsel</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight leading-[1.12]">
              Eighteen Years of Dedicated Courtroom Advocacy &{' '}
              <span className="italic font-normal font-serif text-neutral-600">
                Statutory Precision.
              </span>
            </h1>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-normal">
              Chambers of <strong className="text-black font-semibold">{siteName}</strong> delivers fearless trial defense, High Court appellate litigation, and transparent digital case tracking built on procedural excellence and intellectual rigor.
            </p>
          </section>

          {/* Quick Metrics Strip */}
          <section className="container-xl pb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {stats.map((st) => (
                <div
                  key={st.label}
                  className="p-5 rounded-2xl bg-white/95 border border-neutral-200 shadow-2xs hover:border-black hover:shadow-xs transition-all duration-200 text-center"
                >
                  <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-1">
                    {st.value}
                  </div>
                  <div className="text-xs font-bold text-neutral-800">{st.label}</div>
                  <div className="text-[0.68rem] text-neutral-500 font-mono mt-0.5">{st.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Profile & Judicial Philosophy Section */}
          <section className="container-xl py-10 border-t border-neutral-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              
              {/* Left Column: Senior Counsel Master Card */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="h-full flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-white/95 backdrop-blur-md border border-neutral-300/80 shadow-md relative overflow-hidden group hover:border-black transition-all duration-300">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-black" />

                  <div>
                    {/* Header Seal */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
                        </svg>
                      </div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full font-mono text-neutral-800">
                        Senior Standing
                      </span>
                    </div>

                    <div className="space-y-1 mb-6">
                      <span className="text-[0.68rem] uppercase tracking-widest font-extrabold text-neutral-500 font-mono block">
                        Principal Legal Counsel
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black tracking-tight">
                        {siteName}
                      </h2>
                      <p className="text-xs text-neutral-600 font-medium pt-0.5">
                        High Court & Supreme Court Legal Counsel
                      </p>
                    </div>

                    {/* Quotation */}
                    <blockquote className="border-l-2 border-black pl-3.5 my-5 italic text-xs sm:text-sm text-neutral-700 font-serif leading-relaxed">
                      “The practice of law is fundamentally an intellectual commitment to statutory truth, constitutional defense, and protecting client dignity.”
                    </blockquote>

                    {/* Credentials List */}
                    <div className="space-y-2.5 text-xs text-neutral-700 pt-2 border-t border-neutral-200">
                      <div className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-black shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Bar Council:</strong> Certified Legal Practitioner (All-India Standing)</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-black shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>High Court:</strong> Life Member, High Court Bar Association</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-black shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Jurisdictions:</strong> Criminal Defense, Property, Civil & Constitutional Writs</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-5 border-t border-neutral-200">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-xs group"
                    >
                      <span>Book Consultation with Counsel</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: In-Depth Narrative */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="section-label">Litigation Heritage & Experience</div>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 tracking-tight leading-snug">
                    A Tradition of Fearless Advocacy & Measured Legal Judgment
                  </h3>
                  
                  <div className="space-y-4 text-neutral-700 text-xs sm:text-sm leading-relaxed">
                    <p>
                      With over 18 years of continuous courtroom practice across the High Court, District & Sessions Courts, and Specialized Appellate Tribunals (such as RERA, NCDRC, and NCLT), Advocate Asit Kumar Mahapatra has represented individuals, families, and commercial entities in high-stakes legal contests.
                    </p>
                    <p>
                      Our approach to litigation is rooted in rigorous statutory dissection. Whether formulating an urgent bail petition under the Bharatiya Nagarik Suraksha Sanhita (BNSS), seeking a stay on unlawful property demolition, or filing a High Court writ petition under Article 226, we ensure that every procedural avenue and legal precedent is leveraged to protect our client's standing.
                    </p>
                    <p>
                      Recognizing that litigation can be emotionally taxing and opaque, our chambers was built on a dual foundation: uncompromising courtroom prowess combined with modern digital accessibility through our encrypted client case tracking portal.
                    </p>
                  </div>
                </div>

                {/* Statutory Principles Micro-Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-neutral-200">
                  <div className="p-4 rounded-xl bg-white/95 border border-neutral-200">
                    <h4 className="font-serif text-sm font-bold text-black mb-1">Trial Court Expertise</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Deep cross-examination mastery, witness deposition review, and trial management.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/95 border border-neutral-200">
                    <h4 className="font-serif text-sm font-bold text-black mb-1">High Court Appellate Practice</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      First appeals, revision petitions, section 482 FIR quashing, and constitutional writs.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* Core Practice Pillars */}
          <section className="container-xl py-12 border-t border-neutral-200">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <div className="section-label justify-center">Chamber Core Values</div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-3 tracking-tight">
                Foundational Principles of Our Practice
              </h2>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                The statutory and ethical commitments that guide every case undertaken by our chambers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pillars.map((p) => (
                <div
                  key={p.num}
                  className="p-6 rounded-2xl bg-white/95 border border-neutral-200 hover:border-black transition-all duration-300 hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 text-black flex items-center justify-center transition-transform group-hover:scale-110">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {p.icon}
                        </svg>
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-400 group-hover:text-black transition-colors">
                        {p.num}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-black mb-2 group-hover:text-neutral-900 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step Litigation Engagement Workflow */}
          <section className="container-xl py-12 border-t border-neutral-200">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <div className="section-label justify-center">Case Engagement Workflow</div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-3 tracking-tight">
                How Our Chambers Handles Your Legal Contest
              </h2>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                A structured, disciplined litigation lifecycle from initial briefing to final judicial disposition.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {workflow.map((item, idx) => (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl bg-white/95 border border-neutral-200 hover:border-black transition-all duration-200 relative group"
                >
                  <div className="text-2xl font-serif font-bold text-neutral-300 group-hover:text-black transition-colors mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-serif text-base font-bold text-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Full-width Call to Action */}
          <ContactCTA
            badge="Direct Chamber Consultation"
            title="Need Counsel on an Active or Upcoming Matter?"
            highlightedText="Schedule an In-Person or Digital Briefing"
            description="Contact the chambers of Advocate Asit Kumar Mahapatra for confidential assessment, urgent bail filings, or appellate strategy."
          />
        </main>

        <PublicFooter />
      </div>
    </>
  );
}
