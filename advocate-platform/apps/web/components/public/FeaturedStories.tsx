'use client';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  slug: string;
  practiceArea: string;
  court: string;
  outcome: string;
  summary: string;
}

const defaultStories: Story[] = [
  {
    id: '1',
    title: 'Acquittal in Complex Criminal Conspiracy Case',
    slug: 'criminal-conspiracy-acquittal',
    practiceArea: 'Criminal Law Defense',
    court: 'High Court / Sessions Division',
    outcome: 'Full Acquittal & Discharge',
    summary: 'Successfully defended accused facing severe conspiracy and fraud charges by dismantling prosecution witness credibility and establishing fabricated digital evidence.',
  },
  {
    id: '2',
    title: 'Decree of Title & Possession for Ancestral Property',
    slug: 'ancestral-property-title-decree',
    practiceArea: 'Property & Real Estate',
    court: 'Senior Civil Court / High Court',
    outcome: 'Decreed in Favor with Costs',
    summary: 'Obtained complete declaration of ownership and recovery of possession in a 15-year long ancestral land dispute through 30-year revenue chain documentation.',
  },
  {
    id: '3',
    title: 'Full Builder Refund with 9% Interest for Homebuyer',
    slug: 'ncdrc-builder-delay-refund',
    practiceArea: 'Consumer Protection',
    court: 'National Consumer Commission (NCDRC)',
    outcome: '100% Refund + 9% Compounded Interest',
    summary: 'Represented aggrieved homebuyers against a major real estate developer for 6-year project delay, securing complete capital refund with interest and litigation costs.',
  },
];

export function FeaturedStories({ stories }: { stories?: Story[] }) {
  const displayStories = (stories && stories.length > 0) ? stories : defaultStories;

  return (
    <section
      className="section-py relative border-b border-neutral-200 bg-transparent"
      id="success-stories"
    >
      <div className="container-xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="section-label">Verified Case Precedents</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight">
              Notable Judicial Outcomes
            </h2>
          </div>
          <Link
            href="/success-stories"
            id="all-stories-btn"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-neutral-300 hover:border-black text-xs font-bold uppercase tracking-wider text-black bg-white/90 hover:bg-white transition-colors"
          >
            <span>View All Case Records</span>
            <span>→</span>
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayStories.map((story) => (
            <div
              key={story.id}
              className="p-7 rounded-xl bg-white/90 backdrop-blur-xs border border-neutral-200 shadow-xs flex flex-col justify-between group hover:border-black transition-all duration-200"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-neutral-600 px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono">
                    {story.practiceArea}
                  </span>
                  <span className="text-[0.62rem] font-mono text-neutral-500">
                    {story.court}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-neutral-900 text-white font-mono">
                    <span>•</span>
                    <span>{story.outcome}</span>
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-black mb-3 group-hover:underline transition-all">
                  {story.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  {story.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <Link
                  href={`/success-stories/${story.slug}`}
                  className="text-xs font-bold text-black hover:underline uppercase tracking-wider inline-flex items-center gap-1"
                >
                  <span>Read Case Precedent</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
