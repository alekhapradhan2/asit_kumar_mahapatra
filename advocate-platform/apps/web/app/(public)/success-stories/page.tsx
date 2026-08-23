import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ContactCTA } from '@/components/public/ContactCTA';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

export const metadata: Metadata = {
  title: `Landmark Case Outcomes & Success Stories — ${siteName}`,
  description: `Read anonymized case summaries, successful verdicts, and favorable court decrees obtained across criminal, civil, property, and consumer jurisdictions.`,
};

const sampleStories = [
  {
    id: '1',
    slug: 'acquittal-secured-in-commercial-cheating-allegations',
    title: 'Acquittal Secured in High-Value Commercial Cheating & Forgery Allegations',
    practiceArea: 'Criminal Defense',
    result: 'Full Acquittal',
    shortSummary: 'Successfully demonstrated through forensic accounting evidence that the dispute was purely civil and contractual, resulting in complete exoneration of the accused by the Sessions Court.',
    clientDisplay: 'Corporate Executive (Name Withheld)',
    court: 'Sessions Court / High Court',
  },
  {
    id: '2',
    slug: 'property-title-declaration-and-encroachment-removal',
    title: 'Declaration of Title & Mandatory Injunction against Illegal Encroachment',
    practiceArea: 'Property Litigation',
    result: 'Decreed in Favor',
    shortSummary: 'Established unbroken 40-year chain of title through revenue records, securing eviction of unlawful occupants and restoration of full possession.',
    clientDisplay: 'Senior Citizen Landowner',
    court: 'Civil Judge Senior Division',
  },
  {
    id: '3',
    slug: 'builder-delay-full-refund-with-interest-ncdrc',
    title: '100% Refund with Penal Interest against Builder in NCDRC Real Estate Delay',
    practiceArea: 'Consumer Law',
    result: 'Full Refund + 9% Interest',
    shortSummary: 'Held real estate developer accountable for a 4-year construction delay, securing comprehensive monetary refund and compensation for our client before NCDRC.',
    clientDisplay: 'Homebuyer Family',
    court: 'National Consumer Commission (NCDRC)',
  },
  {
    id: '4',
    slug: 'amicable-settlement-in-cross-border-custody-dispute',
    title: 'Amicable Matrimonial Resolution & Shared Guardianship Agreement',
    practiceArea: 'Family Law',
    result: 'Mutual Settlement',
    shortSummary: 'Facilitated comprehensive settlement agreement protecting financial maintenance and shared parenting rights without prolonged traumatic trial proceedings.',
    clientDisplay: 'Private Individual',
    court: 'Family Court & Mediation Centre',
  },
  {
    id: '5',
    slug: 'fir-quashing-under-section-482-commercial-dispute',
    title: 'FIR Quashed by High Court under Section 482 CrPC in Vexatious Business Dispute',
    practiceArea: 'High Court Criminal Defense',
    result: 'FIR Quashed',
    shortSummary: 'Established before the High Court that criminal proceedings were an abuse of court process intended to exert commercial pressure, securing complete quashing of charges.',
    clientDisplay: 'Technology Entrepreneur',
    court: 'High Court',
  },
  {
    id: '6',
    slug: 'stay-order-against-unlawful-demolition-municipal-corporation',
    title: 'Urgent Stay Order Secured against Unlawful Municipal Demolition Notice',
    practiceArea: 'Civil Writ Jurisdiction',
    result: 'Interim Stay Granted',
    shortSummary: 'Obtained same-day urgent ad-interim stay from the High Court showing non-service of statutory show-cause notice, protecting valuable commercial premises.',
    clientDisplay: 'Commercial Establishment Owner',
    court: 'High Court Writ Bench',
  },
];

export default function SuccessStoriesPage() {
  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-grow pt-28 pb-16">
          <section className="container-xl py-12 text-center max-w-4xl mx-auto">
            <div className="section-label justify-center">Courtroom Track Record</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight">
              Notable Case Outcomes & Judgments
            </h1>
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Selected case summaries highlighting our courtroom advocacy and negotiated resolutions. Client identities are protected to maintain statutory confidentiality.
            </p>
          </section>

          <section className="container-xl py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/success-stories/${story.slug}`}
                  className="court-card-stark p-8 flex flex-col justify-between group rounded-xs bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
                      <span className="text-[0.68rem] font-bold text-neutral-700 uppercase tracking-widest font-mono">
                        {story.practiceArea}
                      </span>
                      <span className="status-badge status-won font-mono text-[0.7rem] shadow-[2px_2px_0px_#000000]">
                        ✓ {story.result}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-black group-hover:underline transition-all mb-3 leading-snug">
                      {story.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                      {story.shortSummary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 text-xs text-neutral-500 font-mono">
                    <span>{story.court}</span>
                    <span className="text-black font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-sans">
                      <span>View Outcome</span>
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
