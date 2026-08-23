import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ContactCTA } from '@/components/public/ContactCTA';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${formattedTitle} — ${siteName}`,
    description: `Read in-depth statutory analysis and guidance regarding ${formattedTitle}.`,
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formattedTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-grow pt-28 pb-16">
          <article className="container-xl py-12 max-w-4xl mx-auto">
            <Link
              href="/articles"
              className="text-xs text-black font-extrabold mb-6 inline-flex items-center gap-1.5 font-mono hover:underline"
            >
              <span>←</span>
              <span>Back to All Legal Articles</span>
            </Link>

            <div className="mb-8">
              <span className="text-xs font-extrabold text-neutral-600 uppercase tracking-widest block mb-3 font-mono">
                Statutory Guide & Legal Commentary
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight tracking-tight">
                {formattedTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 border-b-2 border-black pb-6 font-mono font-bold">
                <span className="text-black">Chambers of {siteName}</span>
                <span>•</span>
                <span>Updated August 2026</span>
                <span>•</span>
                <span>7 min read</span>
              </div>
            </div>

            <div className="court-card-stark p-8 sm:p-12 space-y-6 text-neutral-700 leading-relaxed text-base rounded-xs bg-white">
              <p className="text-lg text-black font-medium leading-relaxed">
                Navigating court procedures and statutory requirements in Indian jurisprudence requires an accurate understanding of the applicable procedural codes and recent High Court precedents.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black pt-4 border-t border-neutral-200">
                1. Statutory Framework & Competent Jurisdiction
              </h2>
              <p>
                Jurisdiction is demarcated by territorial bounds, pecuniary limits, and the specific subject matter under the relevant Code. Instituting proceedings in the competent forum is vital to avoid preliminary objections or rejection of plaints under Order VII Rule 11 of the CPC.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black pt-4 border-t border-neutral-200">
                2. Essential Documentary Chain & Evidentiary Standards
              </h2>
              <p>
                A resilient legal brief depends upon contemporaneous documentary proof, certified revenue records, properly attested affidavits, and full compliance with electronic evidence certification under Section 65B of the Indian Evidence Act / Bharatiya Sakshya Adhiniyam.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black pt-4 border-t border-neutral-200">
                3. Procedural Timelines & Statutory Limitation
              </h2>
              <p>
                Under the Limitation Act, 1963, strict statutory periods govern suits, appeals, and revision petitions. In exceptional delays, applications under Section 5 require establishing day-to-day sufficient cause with supporting documentary evidence.
              </p>

              <div className="p-6 rounded-xs border-2 border-black bg-neutral-50 mt-8 text-xs text-black leading-relaxed font-mono font-semibold">
                ⚖️ <strong>Legal Notice:</strong> The commentary provided above is strictly for educational and informational purposes. It does not create an advocate-client relationship. For advice on your specific legal situation, schedule a consultation with our chambers.
              </div>
            </div>
          </article>

          <ContactCTA />
        </main>
        <PublicFooter />
      </div>
    </>
  );
}
