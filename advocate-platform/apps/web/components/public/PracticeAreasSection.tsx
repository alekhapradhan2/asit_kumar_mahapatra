'use client';
import { useState } from 'react';
import Link from 'next/link';

const practiceAreas = [
  {
    id: 'criminal',
    title: 'Criminal Law Defense',
    slug: 'criminal-law',
    desc: 'Regular & Anticipatory Bail under BNSS/CrPC, trial defense, FIR quashing under Sec 482 / 528, and High Court criminal appeals.',
    badge: 'BNSS & BNS Specialization',
    svgPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    procedures: ['Anticipatory Bail Applications', 'FIR Quashing Petitions', 'Trial Cross-Examination', 'High Court Appeals'],
  },
  {
    id: 'property',
    title: 'Property & Real Estate',
    slug: 'property-law',
    desc: 'Title declaration, possession recovery, boundary disputes, partition of ancestral property, and RERA builder litigation.',
    badge: '30-Yr Title Search & Suits',
    svgPath: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4',
    procedures: ['Declaration of Title & Possession', 'RERA Builder Dispute Complaints', 'Demolition Stay Injunctions', 'Title Verification Reports'],
  },
  {
    id: 'family',
    title: 'Family & Matrimonial',
    slug: 'family-law',
    desc: 'Mutual consent & contested divorce, child custody, maintenance under Sec 125, domestic violence defense, and amicable settlement.',
    badge: 'Matrimonial & Custody',
    svgPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    procedures: ['Mutual Consent Divorce (Waiver of Cooling)', 'Child Custody Petitions', 'Maintenance & Alimony Claims', 'Domestic Violence Defense'],
  },
  {
    id: 'consumer',
    title: 'Consumer Protection',
    slug: 'consumer-law',
    desc: 'Deficiency of service claims, insurance repudiation, banking fraud, medical negligence, and NCDRC/SCDRC representation.',
    badge: 'Consumer Protection Act 2019',
    svgPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    procedures: ['NCDRC & State Commission Matters', 'Builder Delay Compensation', 'Banking & Insurance Repudiation', 'Execution of Decrees'],
  },
  {
    id: 'civil',
    title: 'Civil & Commercial Litigation',
    slug: 'civil-law',
    desc: 'Order 37 summary recovery suits, breach of contract damages, temporary & permanent injunctions, and execution of decrees.',
    badge: 'Commercial Litigation',
    svgPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    procedures: ['Order XXXVII Summary Recovery Suits', 'Specific Performance Petitions', 'Temporary Injunctions (Order 39)', 'Civil First & Second Appeals'],
  },
  {
    id: 'cyber',
    title: 'Cyber Law & Digital Evidence',
    slug: 'cyber-law',
    desc: 'Online financial fraud, IT Act Section 66 violations, data privacy breaches, and Sec 65B electronic evidence certification.',
    badge: 'IT Act & Digital Evidence',
    svgPath: 'M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z',
    procedures: ['Sec 66 IT Act Defense & Complaints', 'Sec 65B Certificate Audit', 'Digital Privacy & Defamation', 'E-Commerce Dispute Advisory'],
  },
];

export function PracticeAreasSection() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredAreas = activeTab === 'all'
    ? practiceAreas
    : practiceAreas.filter(a => a.slug === activeTab);

  return (
    <section className="section-py relative border-b border-neutral-200 bg-transparent" id="practice-areas">
      <div className="container-xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="section-label justify-center">Chambers Jurisdictions</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 tracking-tight">
            Specialized Practice Areas
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Statutory acumen, rigorous procedural preparation, and decisive representation across Trial Courts, High Courts, and Appellate Tribunals.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono transition-all ${
                activeTab === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white/80 border border-neutral-300 text-neutral-700 hover:border-black'
              }`}
            >
              All Jurisdictions
            </button>
            {practiceAreas.map((area) => (
              <button
                key={area.slug}
                onClick={() => setActiveTab(area.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono transition-all ${
                  activeTab === area.slug
                    ? 'bg-black text-white'
                    : 'bg-white/80 border border-neutral-300 text-neutral-700 hover:border-black'
                }`}
              >
                {area.title}
              </button>
            ))}
          </div>
        </div>

        {/* Practice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => (
            <div
              key={area.slug}
              className="p-7 rounded-xl bg-white/90 backdrop-blur-xs border border-neutral-200 shadow-xs flex flex-col justify-between group hover:border-black transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-11 h-11 rounded-lg bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-200">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={area.svgPath} />
                    </svg>
                  </div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-700 px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono">
                    {area.badge}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-black mb-2 group-hover:underline transition-all">
                  {area.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  {area.desc}
                </p>

                {/* Key Procedures Tags */}
                <div className="space-y-1.5 border-t border-neutral-100 pt-4 mb-6">
                  <div className="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500 font-mono mb-2">
                    Core Court Procedures
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {area.procedures.map((p, i) => (
                      <span key={i} className="text-[0.7rem] px-2 py-0.5 rounded bg-neutral-50 border border-neutral-200 text-neutral-700 font-medium">
                        • {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-black text-xs font-bold uppercase tracking-wider">
                <Link
                  href={`/practice-areas/${area.slug}`}
                  className="hover:underline flex items-center gap-1.5 font-bold"
                >
                  <span>View Details</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  href={`/contact?area=${area.slug}`}
                  className="text-[0.7rem] px-3 py-1 bg-black text-white rounded hover:bg-neutral-800 transition-colors"
                >
                  Inquire Brief
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/practice-areas"
            id="all-practice-areas-btn"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full border border-neutral-300 hover:border-black hover:bg-neutral-50 transition-colors shadow-xs"
          >
            Explore All Practice Jurisdictions
          </Link>
        </div>
      </div>
    </section>
  );
}
