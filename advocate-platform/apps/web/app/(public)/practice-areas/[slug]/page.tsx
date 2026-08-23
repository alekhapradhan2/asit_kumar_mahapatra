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
  icon: string;
  heroText: string;
  sections: Array<{ heading: string; body: string }>;
  keyProcedures: string[];
}> = {
  'criminal-law': {
    title: 'Criminal Law Defense & Litigation',
    icon: '⚔️',
    heroText: 'Protecting your constitutional liberties and ensuring fair trial representation under the Bharatiya Nyaya Sanhita (BNS) / IPC and BNSS / CrPC.',
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
    icon: '👨‍👩‍👧',
    heroText: 'Empathetic counsel and resolute advocacy in matrimonial dissolution, child custody, and family property settlement.',
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
    icon: '🏠',
    heroText: 'Protecting title, resolving builder disputes, and defending property ownership across all civil jurisdictions.',
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
    icon: '🛒',
    heroText: 'Holding service providers, financial institutions, and developers accountable under the Consumer Protection Act, 2019.',
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
    icon: '📜',
    heroText: 'Enforcing commercial contracts, recovering debts, and seeking declaratory and injunctive remedies in civil courts.',
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
    icon: '💻',
    heroText: 'Navigating digital evidence, cyber fraud, unauthorized data access, and Information Technology Act litigation.',
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
          <section className="container-xl py-12">
            <div className="max-w-4xl">
              <Link
                href="/practice-areas"
                className="text-xs text-black font-extrabold mb-6 inline-flex items-center gap-1.5 font-mono hover:underline"
              >
                <span>←</span>
                <span>Back to All Practice Jurisdictions</span>
              </Link>

              <div className="w-16 h-16 rounded-xs bg-black text-white flex items-center justify-center text-4xl mb-6 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
                {area.icon}
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-black mb-6 leading-tight tracking-tight">
                {area.title}
              </h1>

              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl">
                {area.heroText}
              </p>
            </div>
          </section>

          <section className="container-xl py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                {area.sections.map((sec, i) => (
                  <div key={i} className="court-card-stark p-8 rounded-xs bg-white">
                    <h2 className="font-serif text-2xl font-bold text-black mb-3">
                      {sec.heading}
                    </h2>
                    <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                      {sec.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="court-card-stark p-6 rounded-xs bg-white">
                  <h3 className="font-serif text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <span>📋</span>
                    <span>Key Legal Procedures</span>
                  </h3>
                  <ul className="space-y-3">
                    {area.keyProcedures.map((proc, i) => (
                      <li key={i} className="text-xs sm:text-sm text-neutral-700 flex items-start gap-2.5 leading-relaxed">
                        <span className="text-black font-bold mt-0.5">•</span>
                        <span>{proc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="court-card-stark p-6 rounded-xs bg-neutral-50 text-center">
                  <div className="text-3xl mb-3">⚖️</div>
                  <h3 className="font-serif text-base font-bold text-black mb-2">Need Representation on this Matter?</h3>
                  <p className="text-xs text-neutral-600 mb-6">Schedule a confidential case review with Advocate Asit Kumar Mahapatra.</p>
                  <Link href="/contact" className="btn-primary text-xs justify-center w-full py-3.5 shadow-[3px_3px_0px_#000000]">
                    Request Consultation
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
