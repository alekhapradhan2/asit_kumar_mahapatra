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
    description: `Case outcome summary and legal strategy breakdown for ${formattedTitle}.`,
  };
}

export default async function SuccessStoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
              href="/success-stories"
              className="text-xs text-black font-extrabold mb-6 inline-flex items-center gap-1.5 font-mono hover:underline"
            >
              <span>←</span>
              <span>Back to All Case Outcomes</span>
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-extrabold text-neutral-600 uppercase tracking-widest font-mono">
                  Case Outcome Summary
                </span>
                <span className="status-badge status-won font-mono text-[0.7rem] shadow-[2px_2px_0px_#000000]">
                  ✓ Favorable Verdict Secured
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight tracking-tight">
                {formattedTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 border-b-2 border-black pb-6 font-mono font-bold">
                <span>Chambers of {siteName}</span>
                <span>•</span>
                <span>Client Identity Protected</span>
                <span>•</span>
                <span>High Court & Trial Practice</span>
              </div>
            </div>

            <div className="court-card-stark p-8 sm:p-12 space-y-6 text-neutral-700 leading-relaxed text-base rounded-xs bg-white">
              <h2 className="font-serif text-2xl font-bold text-black">
                Factual Background & Issues Involved
              </h2>
              <p>
                The client approached our chambers facing complex litigation involving disputed factual claims and substantial financial and reputational implications. Our litigation team conducted an exhaustive forensic audit of the evidence and identified key procedural flaws in the opposing claims.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black pt-4 border-t border-neutral-200">
                Chamber Legal Strategy & Court Advocacy
              </h2>
              <p>
                By isolating crucial statutory questions and establishing absence of maintainability under procedural law, our chambers filed comprehensive pleadings backed by landmark Supreme Court and High Court precedents, neutralizing the adversary's contentions during oral arguments.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black pt-4 border-t border-neutral-200">
                Final Judicial Relief & Outcome
              </h2>
              <p>
                The Court accepted our submissions, dismissing the adverse allegations in their entirety and granting complete legal relief in favor of our client.
              </p>

              <div className="p-6 rounded-xs border-2 border-black bg-neutral-50 mt-8 text-xs text-black leading-relaxed font-mono font-semibold">
                🔒 <strong>Bar Council Confidentiality Statement:</strong> In strict compliance with the Advocates Act and Bar Council of India rules, client names and identifiable details are withheld to preserve client confidentiality.
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
