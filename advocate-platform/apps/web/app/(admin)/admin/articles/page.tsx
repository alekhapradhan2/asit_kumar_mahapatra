'use client';
import Link from 'next/link';

export default function AdminArticlesPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/dashboard" className="text-xs text-yellow-400 hover:text-yellow-300 font-medium mb-1 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white">Articles & Blog CMS</h1>
          <p className="text-xs text-slate-400">Publish legal guides, manage categories, and edit SEO metadata</p>
        </div>
        <button className="btn-primary text-sm py-2.5 px-5">+ Write New Article</button>
      </div>

      <div className="glass-card p-12 text-center">
        <div className="text-5xl mb-4">✍️</div>
        <h2 className="font-serif text-xl font-bold text-white mb-2">Legal Knowledge CMS</h2>
        <p className="text-slate-400 text-xs max-w-md mx-auto mb-6">
          Publish SEO-friendly articles with canonical URLs, meta descriptions, and rich content blocks.
        </p>
        <Link href="/articles" className="btn-outline text-xs inline-flex">
          View Public Articles Directory →
        </Link>
      </div>
    </div>
  );
}
