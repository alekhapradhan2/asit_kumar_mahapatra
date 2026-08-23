'use client';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTimeMinutes: number;
  publishedAt: string;
  summary: string;
}

const defaultArticles: Article[] = [
  {
    id: '1',
    title: 'Understanding the New Criminal Laws: Key Changes in BNSS and BNS 2023',
    slug: 'understanding-bnss-bns-2023',
    category: 'Criminal Law',
    readTimeMinutes: 6,
    publishedAt: '2024-07-01',
    summary: 'A detailed legal analysis of bail provisions, police custody limits, and trial timelines under the newly enacted Bharatiya Nagarik Suraksha Sanhita.',
  },
  {
    id: '2',
    title: 'How to Protect Your Property: 30-Year Chain of Title and RERA Remedies',
    slug: 'protect-property-title-rera',
    category: 'Property Law',
    readTimeMinutes: 5,
    publishedAt: '2024-06-15',
    summary: 'Essential legal diligence for real estate buyers in Odisha — checking mutation records, revenue encumbrances, and filing against defaulting builders.',
  },
  {
    id: '3',
    title: 'Mutual Consent Divorce Procedure in India: Statutory Timelines & Waiver',
    slug: 'mutual-consent-divorce-timelines',
    category: 'Family Law',
    readTimeMinutes: 4,
    publishedAt: '2024-05-20',
    summary: 'A step-by-step guide to filing Section 13B petitions, permanent alimony drafting, and Supreme Court rulings on waiving the 6-month cooling period.',
  },
];

export function FeaturedArticles({ articles }: { articles?: Article[] }) {
  const displayArticles = (articles && articles.length > 0) ? articles : defaultArticles;

  return (
    <section className="section-py relative border-b border-neutral-200 bg-transparent" id="articles">
      <div className="container-xl relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="section-label">Legal Knowledge Base</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight">
              Recent Articles & Legal Insights
            </h2>
          </div>
          <Link
            href="/articles"
            id="all-articles-btn"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-neutral-300 hover:border-black text-xs font-bold uppercase tracking-wider text-black bg-white/90 hover:bg-white transition-colors"
          >
            <span>Read Legal Library</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayArticles.map((article) => (
            <article
              key={article.id}
              className="p-7 rounded-xl bg-white/90 backdrop-blur-xs border border-neutral-200 shadow-xs flex flex-col justify-between group hover:border-black transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-[0.68rem] text-neutral-500 mb-4 font-mono">
                  <span className="font-bold uppercase tracking-wider text-black px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                    {article.category}
                  </span>
                  <span>{article.readTimeMinutes} min read</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-black mb-3 group-hover:underline transition-all">
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>{new Date(article.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <Link
                  href={`/articles/${article.slug}`}
                  className="font-bold text-black hover:underline uppercase tracking-wider inline-flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
