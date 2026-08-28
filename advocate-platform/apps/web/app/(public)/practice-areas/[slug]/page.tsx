import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ContactCTA } from '@/components/public/ContactCTA';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

const practiceAreaMap: Record<string, {
  title: string;
  heroText: string;
  badge: string;
  iconSvg: React.ReactNode;
  sections: Array<{ heading: string; body: string }>;
  keyProcedures: string[];
}> = {
  'criminal-law': {
    title: 'Criminal Law Defense & Litigation',
    badge: 'BNSS / BNS / CrPC',
    heroText: 'Protecting your constitutional liberties and ensuring fair trial representation under the Bharatiya Nyaya Sanhita (BNS) / IPC and BNSS / CrPC.',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    sections: [
      {
        heading: 'Bail & Personal Liberty Protection',
        body: 'Securing anticipatory and regular bail requires strategic formulation of grounds showing lack of tampering risk, voluntary cooperation with investigating agencies, and absence of flight risk before Sessions Courts and the High Court.',
      },
      {
        heading: 'Trial Defense & Forensic Cross-Examination',
        body: 'Conducting relentless cross-examination of prosecution witnesses, challenging forensic audit reports, and establishing failure to comply with mandatory search and seizure procedures.',
      },
      {
        heading: 'FIR Quashing & High Court Criminal Revisions',
        body: 'Filing petitions under Section 482 CrPC / Section 528 BNSS before the High Court where complaints are malicious, civil disputes cloaked as criminal offences, or lack prima facie ingredients.',
      },
    ],
    keyProcedures: ['Anticipatory Bail (Sessions / High Court)', 'Regular Bail Applications', 'Cross Examination & Evidence Audit', 'FIR Quashing Petitions (Sec 482)', 'Criminal Appeals & Revisions'],
  },
  'family-law': {
    title: 'Family, Matrimonial & Custody Law',
    badge: 'Matrimonial & Custody',
    heroText: 'Empathetic counsel and resolute advocacy in matrimonial dissolution, child custody, and family property settlement.',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    sections: [
      {
        heading: 'Divorce Proceedings & Mediation',
        body: 'Handling contested divorce petitions on statutory grounds (cruelty, desertion) as well as expedited mutual consent divorce with waiver of the 6-month statutory cooling period.',
      },
      {
        heading: 'Child Custody & Guardianship',
        body: 'Prioritizing the paramount welfare of the child in disputed custody petitions, interim visitation arrangements, and cross-border parenting agreements.',
      },
      {
        heading: 'Maintenance & Financial Security',
        body: 'Filing and defending claims for interim and permanent alimony and maintenance under Section 125 CrPC / BNSS, Hindu Marriage Act, and Special Marriage Act.',
      },
    ],
    keyProcedures: ['Mutual Consent Divorce (First & Second Motion)', 'Contested Matrimonial Petitions', 'Child Custody & Visitation Injunctions', 'Domestic Violence Relief Applications', 'Ancestral Partition Suits'],
  },
  'property-law': {
    title: 'Real Estate & Property Dispute Litigation',
    badge: 'Title & Encroachment',
    heroText: 'Protecting title, resolving builder disputes, and defending property ownership across all civil jurisdictions.',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
      </svg>
    ),
    sections: [
      {
        heading: 'Title & Possession Suits',
        body: 'Representation in declaratory suits for ownership, recovery of physical possession from unlawful occupants, demarcation, and boundary disputes.',
      },
      {
        heading: 'RERA Disputes & Delay Penalties',
        body: 'Litigating builder delays in possession, non-registration of projects, and claiming 100% refund with penal interest before Real Estate Regulatory Authorities.',
      },
    ],
    keyProcedures: ['Declaration of Title & Recovery of Possession', 'RERA Complaints & Appeals', 'Temporary Stay & Injunction Petitions', 'Property Title Search & Due Diligence', 'Eviction Proceedings'],
  },
  'consumer-law': {
    title: 'Consumer Protection & Dispute Redressal',
    badge: 'CPA 2019 / NCDRC',
    heroText: 'Holding service providers, financial institutions, and developers accountable under the Consumer Protection Act, 2019.',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    sections: [
      {
        heading: 'Deficiency in Service Claims',
        body: 'Claims against banking fraud, wrongful insurance repudiation, airline cancellations, and substandard medical treatments.',
      },
      {
        heading: 'Product Liability & Builder Delays',
        body: 'Seeking monetary compensation and refund from manufacturers and real estate developers for defective deliverables or gross delay.',
      },
    ],
    keyProcedures: ['District Consumer Commission Complaints', 'State Consumer Commission Appeals', 'National Commission (NCDRC) Matters', 'Execution of Consumer Decrees'],
  },
  'civil-law': {
    title: 'Civil Litigation & Contract Enforcement',
    badge: 'Commercial & Recovery',
    heroText: 'Enforcing commercial contracts, recovering debts, and seeking declaratory and injunctive remedies in civil courts.',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    sections: [
      {
        heading: 'Summary Debt Recovery Suits',
        body: 'Summary suits under Order XXXVII CPC for liquidated demands, recovery of commercial dues, and breach of contract damages.',
      },
      {
        heading: 'Urgent Interim Injunctions',
        body: 'Obtaining urgent stay orders and temporary injunctions under Order XXXIX CPC to prevent irreparable harm or alteration of status quo.',
      },
    ],
    keyProcedures: ['Order 37 Summary Recovery Suits', 'Specific Performance Petitions', 'Temporary & Permanent Injunctions', 'Execution of Decrees'],
  },
  'cyber-law': {
    title: 'Cyber Crime Defense & Digital Privacy',
    badge: 'IT Act & Sec 65B',
    heroText: 'Navigating digital evidence, cyber fraud, unauthorized data access, and Information Technology Act litigation.',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    sections: [
      {
        heading: 'Cyber Fraud Defense & Recovery',
        body: 'Assisting victims of online banking theft and representing individuals wrongfully implicated in digital financial frauds.',
      },
      {
        heading: 'Electronic Evidence Admissibility',
        body: 'Evaluating chain of custody and statutory certificate compliance under Section 65B of the Indian Evidence Act / BSA.',
      },
    ],
    keyProcedures: ['Cyber Crime Police Grievances', 'Sec 66 IT Act Litigation', 'Electronic Evidence Audit', 'Data Privacy Advisory'],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const area = practiceAreaMap[slug];
  if (!area) return { title: `Practice Area — ${siteName}` };
  return {
    title: `${area.title} — ${siteName}`,
    description: area.heroText,
  };
}

export default async function PracticeAreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = practiceAreaMap[slug];
  if (!area) notFound();

  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        
        <main className="flex-grow pt-28 pb-16">
          {/* Header */}
          <section className="container-xl py-10 sm:py-14">
            <div className="max-w-4xl">
              <Link
                href="/practice-areas"
                className="text-xs text-neutral-600 hover:text-black font-semibold mb-6 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>←</span>
                <span>Back to All Practice Jurisdictions</span>
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
                  {area.iconSvg}
                </div>
                <span className="text-xs font-bold font-mono uppercase tracking-wider px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-neutral-800">
                  {area.badge}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-black mb-4 leading-tight tracking-tight">
                {area.title}
              </h1>

              <p className="text-neutral-700 text-sm sm:text-base leading-relaxed max-w-3xl">
                {area.heroText}
              </p>
            </div>
          </section>

          {/* Details */}
          <section className="container-xl pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Content Sections */}
              <div className="lg:col-span-8 space-y-6">
                {area.sections.map((sec, i) => (
                  <div key={i} className="p-7 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-2xs hover:border-neutral-400 transition-colors">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-black mb-3">
                      {sec.heading}
                    </h2>
                    <p className="text-neutral-700 text-sm leading-relaxed">
                      {sec.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-2xs">
                  <h3 className="font-serif text-base font-bold text-black mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Key Court Procedures</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {area.keyProcedures.map((proc, i) => (
                      <li key={i} className="text-xs text-neutral-700 flex items-start gap-2.5 leading-relaxed">
                        <svg className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{proc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-900 text-white text-center border border-neutral-800 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3 text-white">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-base font-bold text-white mb-2">Need Representation on this Matter?</h3>
                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">Schedule a confidential case review with Advocate Asit Kumar Mahapatra.</p>
                  <Link
                    href={`/contact?area=${slug}`}
                    className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all w-full"
                  >
                    <span>Request Consultation</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <ContactCTA />
        </main>

        <PublicFooter />
      </div>
    </>
  );
}
