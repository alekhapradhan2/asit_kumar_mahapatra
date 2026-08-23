import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ContactCTA } from '@/components/public/ContactCTA';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

export const metadata: Metadata = {
  title: `Practice Jurisdictions & Legal Defense — ${siteName}`,
  description: `Explore specialized practice areas including Criminal Defense (BNSS/CrPC), Property Law, Matrimonial & Family Disputes, Consumer Protection, and Civil Litigation.`,
};

export const practiceAreasList = [
  {
    slug: 'criminal-law',
    icon: '⚔️',
    title: 'Criminal Law Defense',
    summary: 'Comprehensive criminal trial and appellate defense across Sessions Courts, High Courts, and Special Benches.',
    badge: 'BNSS / BNS / CrPC',
    details: [
      'Regular & Anticipatory Bail Applications (Sec 438 CrPC / Sec 482 BNSS)',
      'Trial Defense in Sessions & Special CBI/ED/Vigilance Courts',
      'FIR Quashing Petitions under Section 482 CrPC / Section 528 BNSS',
      'High Court Criminal Appeals & Revision Petitions against Conviction',
      'White-Collar Crime, Financial Fraud & Cheating Allegations',
    ],
  },
  {
    slug: 'family-law',
    icon: '👨‍👩‍👧',
    title: 'Family & Matrimonial Law',
    summary: 'Sensitive, strategic counsel in divorce, child custody, alimony, and inheritance settlements.',
    badge: 'Matrimonial & Custody',
    details: [
      'Mutual Consent & Contested Divorce Proceedings',
      'Child Custody, Guardianship, & Visitation Injunctions',
      'Maintenance & Alimony Claims under Sec 125 CrPC and Personal Laws',
      'Protection of Women from Domestic Violence Act (PWDVA) Defense & Petitions',
      'Partition & Succession of Ancestral Properties',
    ],
  },
  {
    slug: 'property-law',
    icon: '🏠',
    title: 'Real Estate & Property Litigation',
    summary: 'Protection of real estate title, land acquisition, encroachment injunctions, and RERA disputes.',
    badge: 'Title & Encroachment',
    details: [
      'Declaration of Title, Ownership & Recovery of Possession',
      'RERA Litigation against Builders for Delays and Structural Defects',
      'Injunctions against Illegal Encroachment and Demolition',
      'Comprehensive 30-Year Property Due Diligence & Search Reports',
      'Commercial Lease & Landlord-Tenant Eviction Suits',
    ],
  },
  {
    slug: 'consumer-law',
    icon: '🛒',
    title: 'Consumer Protection & Redressal',
    summary: 'Advocacy for aggrieved consumers before District, State, and National Consumer Commissions (NCDRC).',
    badge: 'CPA 2019 / NCDRC',
    details: [
      'Deficiency in Service Claims against Airlines, Banks & Insurance Co.',
      'Builder Delay, Non-Handover & Refund Execution Petitions',
      'Medical Negligence & Hospital Liability Claims',
      'Product Liability & Unfair Trade Practices Litigations',
      'Appeals and Revisions before State Commission & NCDRC',
    ],
  },
  {
    slug: 'civil-law',
    icon: '📜',
    title: 'Civil & Commercial Law',
    summary: 'Commercial contracts, money recovery suits, declaratory relief, and injunction proceedings.',
    badge: 'Commercial & Recovery',
    details: [
      'Order XXXVII Summary Recovery Suits for Liquidated Dues',
      'Specific Performance of Contracts & Commercial Agreements',
      'Temporary & Permanent Injunction Petitions under Order 39 CPC',
      'Arbitration & Execution of Civil Court Decrees',
      'Civil First & Second Appeals before High Court',
    ],
  },
  {
    slug: 'cyber-law',
    icon: '💻',
    title: 'Cyber Law & Digital Evidence',
    summary: 'Digital privacy, online financial fraud litigation, IT Act compliance, and electronic evidence.',
    badge: 'IT Act & Sec 65B',
    details: [
      'Financial Cyber Fraud & Phishing Complaints / Defense',
      'Data Theft & Unauthorized Access under Sec 66 IT Act',
      'Digital Defamation & Online Harassment Petitions',
      'Admissibility & Forensic Certification of Electronic Evidence (Sec 65B)',
      'Intermediary Liability & E-Commerce Disputes',
    ],
  },
];

export default function PracticeAreasPage() {
  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-grow pt-28 pb-16">
          <section className="container-xl py-12 text-center max-w-4xl mx-auto">
            <div className="section-label justify-center">Chambers Expertise</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight">
              Practice Jurisdictions
            </h1>
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Strategic counsel and decisive representation across key areas of Indian jurisprudence and statutory mandates.
            </p>
          </section>

          <section className="container-xl py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {practiceAreasList.map((area) => (
                <div
                  key={area.slug}
                  className="court-card-stark p-8 flex flex-col justify-between group rounded-xs bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="w-14 h-14 rounded-xs bg-black text-white flex items-center justify-center text-3xl">
                        {area.icon}
                      </div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-black font-mono px-2.5 py-1 rounded-xs bg-neutral-100 border border-neutral-300">
                        {area.badge}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-black mb-3 group-hover:underline transition-all">
                      {area.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                      {area.summary}
                    </p>

                    <div className="border-t border-neutral-200 pt-4 mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3 font-mono">
                        Key Statutory Matters
                      </h3>
                      <ul className="space-y-2">
                        {area.details.map((d, i) => (
                          <li key={i} className="text-xs text-neutral-700 flex items-start gap-2 leading-relaxed">
                            <span className="text-black font-bold mt-0.5">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="btn-outline text-xs justify-center py-3 mt-4 w-full text-center shadow-[3px_3px_0px_#000000]"
                  >
                    Explore Practice & Key Procedures →
                  </Link>
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
