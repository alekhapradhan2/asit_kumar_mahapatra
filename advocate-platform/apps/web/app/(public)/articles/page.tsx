import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ContactCTA } from '@/components/public/ContactCTA';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

export const metadata: Metadata = {
  title: `Legal Articles & Jurisprudence Insights — ${siteName}`,
  description: `Read in-depth statutory commentaries on court procedures, consumer protection, property due diligence, and criminal defense in India.`,
};

const sampleArticles = [
  {
    id: '1',
    slug: 'how-to-file-consumer-complaint-guide',
    title: 'How to File a Consumer Complaint in India: A Step-by-Step Statutory Guide',
    shortDesc: 'A comprehensive walkthrough on pecuniary jurisdiction, court fees, statutory limitation periods, and drafting consumer complaints under the Consumer Protection Act, 2019.',
    category: { name: 'Consumer Law' },
    date: '2026-08-15',
    readTime: '6 min read',
  },
  {
    id: '2',
    slug: 'anticipatory-bail-grounds-procedure',
    title: 'Anticipatory Bail under Section 482 BNSS / Section 438 CrPC: Grounds & Principles',
    shortDesc: 'Key judicial precedents governing pre-arrest bail, the test of custodial interrogation necessity, and protective conditions imposed by Sessions and High Courts.',
    category: { name: 'Criminal Law' },
    date: '2026-08-10',
    readTime: '8 min read',
  },
  {
    id: '3',
    slug: 'property-title-verification-checklist',
    title: 'Essential Property Due Diligence Checklist Before Purchasing Real Estate',
    shortDesc: 'Verification of 30-year chain of title, encumbrance certificates, master plan zoning compliance, and RERA project approvals to avoid illegal encroachment.',
    category: { name: 'Property Law' },
    date: '2026-08-01',
    readTime: '7 min read',
  },
  {
    id: '4',
    slug: 'mutual-consent-divorce-cooling-period',
    title: 'Mutual Consent Divorce: Waiving the 6-Month Statutory Cooling Period',
    shortDesc: 'Analysis of Supreme Court guidelines under Amardeep Singh v. Harveen Kaur regarding the waiver of the statutory waiting period under Section 13B(2).',
    category: { name: 'Family Law' },
    date: '2026-07-22',
    readTime: '5 min read',
  },
  {
    id: '5',
    slug: 'order-37-cpc-summary-suit-recovery',
    title: 'Summary Suits under Order XXXVII CPC: Expedited Commercial Debt Recovery',
    shortDesc: 'Procedural rules for instituting summary suits for negotiable instruments and written contracts, summons for judgment, and conditional leave to defend.',
    category: { name: 'Civil Law' },
    date: '2026-07-15',
    readTime: '7 min read',
  },
  {
    id: '6',
    slug: 'section-65b-electronic-evidence-certificate',
    title: 'Section 65B Certificate & Electronic Evidence Admissibility under BSA',
    shortDesc: 'Essential legal requirements for proving WhatsApp chats, emails, CCTV footage, and call detail records before the trial court under statutory evidence rules.',
    category: { name: 'Cyber Law' },
    date: '2026-07-05',
    readTime: '6 min read',
  },
];

export default function ArticlesPage() {
  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-grow pt-28 pb-16">
          <section className="container-xl py-12 text-center max-w-4xl mx-auto">
            <div className="section-label justify-center">Chambers Knowledge Base</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight">
              Legal Articles & Insights
            </h1>
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              In-depth guides, case analyses, and procedural explanations authored by our legal team for citizens and litigants.
            </p>
          </section>

          <section className="container-xl py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/articles/${art.slug}`}
                  className="court-card-stark p-8 flex flex-col justify-between group rounded-xs bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
                      <span className="text-[0.68rem] font-extrabold text-white uppercase tracking-widest px-2.5 py-1 rounded-xs bg-black">
                        {art.category.name}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono font-medium">{art.readTime}</span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-black group-hover:underline transition-all mb-3 leading-snug">
                      {art.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                      {art.shortDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 text-xs text-neutral-500 font-mono">
                    <span>{new Date(art.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="text-black font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-sans">
                      <span>Read Article</span>
                      <span>→</span>
                    </span>
                  </div>
                </Link>
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
