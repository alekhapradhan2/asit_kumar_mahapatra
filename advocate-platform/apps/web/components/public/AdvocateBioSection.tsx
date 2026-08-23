'use client';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

export function AdvocateBioSection() {
  return (
    <section className="section-py relative border-b border-neutral-200 bg-transparent" id="about-counsel">
      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Court & Advocate Portrait Card */}

          
          <div className="lg:col-span-5">
            <div className="p-8 sm:p-10 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-sm relative overflow-hidden group">
              <div className="w-16 h-16 rounded-xl bg-black text-white flex items-center justify-center mb-6 shadow-xs">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
                </svg>
              </div>

              <div className="space-y-1.5 mb-6">
                <span className="text-[0.7rem] uppercase tracking-widest font-extrabold text-neutral-500 block font-mono">
                  Principal Legal Counsel
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-black">
                  {siteName}
                </h3>
                <p className="text-xs text-neutral-600 font-mono font-semibold">
                  Senior Counsel & Advocate • High Court & Supreme Court Practice
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-200 text-xs text-neutral-700">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                  <span><strong>Enrollment:</strong> Bar Council Certified Legal Practitioner</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                  <span><strong>Experience:</strong> 18+ Years Specialized Litigation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                  <span><strong>Specialization:</strong> Criminal Defense, Property, & Civil Appeals</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center py-3.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Consult Directly with Counsel
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Courtroom Creed & Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="section-label">Advocate Credo & Philosophy</div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight tracking-tight">
                Unrelenting Courtroom Defense Guided by Statutory Rigor
              </h2>
              <p className="text-neutral-700 text-sm sm:text-base leading-relaxed mb-4">
                In every legal contest, procedural precision and deep statutory preparation dictate the outcome. Our chambers adheres to rigorous preparation of plaints, forensic scrutiny of witness depositions, and persuasive oral arguments before the Bench.
              </p>
              <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                Combined with our proprietary digital case tracking system, clients receive total transparency into court listings, daily orders, and strategy milestones without ambiguity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Forensic Case Preparation',
                  desc: 'Every petition is built upon comprehensive examination of documentary evidence and precedent law.',
                  svgPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
                },
                {
                  title: '24/7 Digital Tracking',
                  desc: 'Secure portal access to your CNR status, hearing summaries, and authenticated court documents.',
                  svgPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
                },
                {
                  title: 'Constitutional Liberty',
                  desc: 'Fierce protection of fundamental rights in pre-arrest bail and habeas corpus matters.',
                  svgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                },
                {
                  title: 'Bar Council Compliance',
                  desc: 'Strict adherence to professional ethics, zero hidden fee structures, and transparent advice.',
                  svgPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl bg-white/90 border border-neutral-200 hover:border-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center mb-3 text-black">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.svgPath} />
                    </svg>
                  </div>
                  <h4 className="font-serif text-base font-bold text-black mb-1.5">{item.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
