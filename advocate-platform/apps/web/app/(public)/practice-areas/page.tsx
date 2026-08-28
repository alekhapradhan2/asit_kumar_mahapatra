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
    title: 'Criminal Law Defense',
    summary: 'Comprehensive criminal trial defense, regular & anticipatory bail, and High Court appellate advocacy.',
    badge: 'BNSS / BNS / CrPC',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
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
    title: 'Family & Matrimonial Law',
    summary: 'Sensitive, strategic counsel in divorce, child custody, alimony claims, and ancestral inheritance settlements.',
    badge: 'Matrimonial & Custody',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    details: [
      'Mutual Consent & Contested Divorce Proceedings',
      'Child Custody, Guardianship, & Visitation Injunctions',
      'Maintenance & Alimony Claims under Sec 125 CrPC and Personal Laws',
      'Protection of Women from Domestic Violence Act (PWDVA) Defense',
      'Partition & Succession of Ancestral Properties',
    ],
  },
  {
    slug: 'property-law',
    title: 'Real Estate & Property Litigation',
    summary: 'Protection of real estate title, land acquisition, encroachment stays, builder defaults, and RERA disputes.',
    badge: 'Title & Encroachment',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
      </svg>
    ),
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
    title: 'Consumer Protection & Redressal',
    summary: 'Advocacy for aggrieved consumers before District, State, and National Consumer Commissions (NCDRC).',
    badge: 'CPA 2019 / NCDRC',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
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
    title: 'Civil & Commercial Law',
    summary: 'Commercial contract enforcement, summary debt recovery suits, declaratory relief, and injunction proceedings.',
    badge: 'Commercial & Recovery',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
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
    title: 'Cyber Law & Digital Evidence',
    summary: 'Digital privacy, online financial fraud litigation, IT Act compliance, and electronic evidence admissibility.',
    badge: 'IT Act & Sec 65B',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
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
          {/* Header Section */}
          <section className="container-xl py-10 sm:py-16 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-4 text-[0.72rem] font-semibold tracking-wide text-neutral-800 bg-white/90 border border-neutral-300 shadow-2xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span>Chambers Jurisdictions • High Court & Trial Advocacy</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-black mb-5 tracking-tight leading-tight">
              Practice Jurisdictions &{' '}
              <span className="italic font-normal font-serif text-neutral-600">
                Statutory Defense.
              </span>
            </h1>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              Strategic trial defense, High Court appellate litigation, and measured statutory guidance across core areas of Indian jurisprudence.
            </p>
          </section>

          {/* Practice Areas Grid */}
          <section className="container-xl pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {practiceAreasList.map((area) => (
                <div
                  key={area.slug}
                  className="p-7 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-neutral-200 hover:border-black shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Icon Badge & Monospace Code Tag */}
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-2xs">
                        {area.iconSvg}
                      </div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider text-neutral-700 px-3 py-1 rounded-full bg-neutral-50 border border-neutral-200 font-mono">
                        {area.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-black mb-3 tracking-tight group-hover:underline underline-offset-4 transition-all">
                      {area.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                      {area.summary}
                    </p>

                    {/* Key Statutory Matters Checklist */}
                    <div className="border-t border-neutral-100 pt-4 mb-6">
                      <div className="text-[0.68rem] font-bold uppercase tracking-widest text-neutral-500 font-mono mb-3">
                        Key Statutory Matters
                      </div>
                      <ul className="space-y-2">
                        {area.details.map((d, i) => (
                          <li key={i} className="text-xs text-neutral-700 flex items-start gap-2.5 leading-relaxed">
                            <svg className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                    <Link
                      href={`/practice-areas/${area.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all group/btn shadow-xs"
                    >
                      <span>Explore Practice</span>
                      <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>

                    <Link
                      href={`/contact?area=${area.slug}`}
                      className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-black rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-200 transition-colors"
                    >
                      Inquire
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Full-width CTA Banner */}
          <ContactCTA
            badge="Case Assessment"
            title="Require Representation in Any of These Matters?"
            highlightedText="Schedule a Consultation with Counsel"
            description="Our chambers provides confidential case assessment, urgent stay and bail listings, and comprehensive trial defense."
          />
        </main>

        <PublicFooter />
      </div>
    </>
  );
}
