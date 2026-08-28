'use client';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

const pillars = [
  {
    num: '01',
    title: 'Forensic Case Preparation',
    desc: 'Every plaint, writ, and defense memo is engineered upon comprehensive examination of documentary evidence, charge-sheets, and landmark precedent law.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
  {
    num: '02',
    title: '24/7 Digital Case Tracking',
    desc: 'Direct client portal integration with live CNR numbers, automated causelist alerts, interim bench orders, and authenticated judicial record summaries.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
  },
  {
    num: '03',
    title: 'Constitutional & Bail Advocacy',
    desc: 'Uncompromising defense of personal liberty, expedited anticipatory bail listings, statutory stay orders, and Article 226 High Court writ petitions.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    ),
  },
  {
    num: '04',
    title: 'Statutory Privilege & Ethics',
    desc: 'Absolute legal confidentiality guaranteed under Section 126 of the Evidence Act, with transparent fee structures and zero ambiguity in advice.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
];

export function AdvocateBioSection() {
  return (
    <section className="section-py relative border-b border-neutral-200 bg-transparent overflow-hidden" id="about-counsel">
      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* Left Column: Judicial Counsel Master Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-white/95 backdrop-blur-md border border-neutral-300/80 shadow-md relative overflow-hidden group hover:border-black transition-all duration-300">
              {/* Subtle architectural top accent */}
              <div className="absolute top-0 inset-x-0 h-1 bg-black" />
              
              <div>
                {/* Header & Seal */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
                    </svg>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-bold tracking-wider uppercase bg-neutral-100 text-neutral-800 border border-neutral-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    <span>Verified Advocate</span>
                  </div>
                </div>

                {/* Identity */}
                <div className="space-y-1 mb-6">
                  <span className="text-[0.68rem] uppercase tracking-widest font-extrabold text-neutral-500 font-mono block">
                    Principal Legal Counsel
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-black tracking-tight">
                    {siteName}
                  </h3>
                  <p className="text-xs text-neutral-600 font-medium pt-1">
                    Senior Advocate • High Court of Orissa & Supreme Court Practice
                  </p>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 gap-2.5 py-4 border-y border-neutral-200 mb-6 text-center">
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="font-serif text-xl sm:text-2xl font-bold text-black">18+</div>
                    <div className="text-[0.65rem] uppercase tracking-wider text-neutral-500 font-mono font-medium">Years Experience</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="font-serif text-xl sm:text-2xl font-bold text-black">High Court</div>
                    <div className="text-[0.65rem] uppercase tracking-wider text-neutral-500 font-mono font-medium">Primary Bench</div>
                  </div>
                </div>

                {/* Statutory Credentials */}
                <div className="space-y-2.5 text-xs text-neutral-700">
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
                    <span><strong>Memberships:</strong> High Court Bar Association (Life Member)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-black shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Core Practice:</strong> Criminal BNSS / Bail, Title & Civil Writs</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-5 border-t border-neutral-200">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-xs group/btn"
                >
                  <span>Consult Directly with Counsel</span>
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Courtroom Creed & 4-Pillar Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="section-label">Advocate Credo & Philosophy</div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 leading-[1.15] tracking-tight">
                Unrelenting Courtroom Defense{' '}
                <span className="italic font-normal font-serif text-neutral-600 block sm:inline">
                  Guided by Statutory Rigor.
                </span>
              </h2>

              {/* Judicial Ethos Statement */}
              <blockquote className="border-l-2 border-black pl-4 my-4 italic text-sm sm:text-base text-neutral-700 font-serif leading-relaxed">
                “In high-stakes litigation, courtroom victory is constructed through meticulous dissection of evidence, mastery of procedural codes, and fearless statutory advocacy.”
              </blockquote>

              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Combined with our proprietary digital case tracking system, clients receive total transparency into court listings, daily interim orders, and strategy milestones without ambiguity.
              </p>
            </div>

            {/* 4 Interactive Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {pillars.map((item) => (
                <div
                  key={item.num}
                  className="p-5 rounded-2xl bg-white/95 border border-neutral-200 hover:border-black transition-all duration-300 hover:shadow-md group/pillar flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-black transition-transform duration-300 group-hover/pillar:scale-110">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          {item.icon}
                        </svg>
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-400 group-hover/pillar:text-black transition-colors">
                        {item.num}
                      </span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-black mb-1.5 group-hover/pillar:text-neutral-900 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
