'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  category?: { name: string };
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    content: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
    seoTitle: '',
    metaDesc: '',
  });

  const fetchArticles = async () => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setArticles(d.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          shortDesc: formData.shortDesc || undefined,
          content: formData.content,
          status: formData.status,
          seoTitle: formData.seoTitle || formData.title,
          metaDesc: formData.metaDesc || formData.shortDesc || undefined,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({
          title: '',
          shortDesc: '',
          content: '',
          status: 'PUBLISHED',
          seoTitle: '',
          metaDesc: '',
        });
        setNotice('Legal article published successfully!');
        fetchArticles();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to publish article');
      }
    } catch {
      alert('Error creating article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;
    const endpoint = currentStatus === 'PUBLISHED' ? 'unpublish' : 'publish';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotice(`Article status updated to ${endpoint === 'publish' ? 'PUBLISHED' : 'DRAFT'}`);
        fetchArticles();
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotice('Article archived.');
        fetchArticles();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {notice && (
        <div className="p-3.5 px-6 rounded bg-black text-white text-xs font-semibold flex items-center justify-between shadow-md">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice(null)} className="text-neutral-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-black text-white flex items-center justify-center font-bold text-lg shadow-xs">
            📝
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-black">Articles & Legal Insights CMS</h1>
            <p className="text-xs text-neutral-500">
              Publish SEO-optimized legal articles, court analyses, and client advisories
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          id="btn-write-article"
          className="btn-primary text-xs tracking-wider uppercase py-2.5 px-5"
        >
          + Write New Article
        </button>
      </div>

      {/* ─── Articles Table ─────────────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden bg-white border border-neutral-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-800">
            <thead className="bg-neutral-100 text-[0.7rem] uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
              <tr>
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Published Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {articles.length > 0 ? (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 max-w-md">
                      <div className="font-bold text-black text-sm">{art.title}</div>
                      {art.shortDesc && (
                        <div className="text-[0.7rem] text-neutral-500 line-clamp-1 mt-0.5">
                          {art.shortDesc}
                        </div>
                      )}
                      <div className="text-[0.65rem] font-mono text-neutral-400 mt-1">
                        /articles/{art.slug}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-neutral-700">
                      {art.category?.name || 'Legal Commentary'}
                    </td>
                    <td className="p-4 text-neutral-500 font-medium">
                      {new Date(art.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(art.id, art.status)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          art.status === 'PUBLISHED'
                            ? 'bg-black text-white'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                        title="Click to toggle publish"
                      >
                        <span>{art.status === 'PUBLISHED' ? '🌐' : '📝'}</span>
                        <span>{art.status}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/articles/${art.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 font-bold text-black hover:underline px-2.5 py-1 rounded bg-neutral-100 border border-neutral-300 text-[0.7rem]"
                      >
                        👁️ Live View
                      </Link>
                      <button
                        onClick={() => handleDelete(art.id, art.title)}
                        className="text-red-600 hover:text-red-800 font-bold px-2 py-1"
                        title="Archive article"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-neutral-500 text-xs">
                    {loading ? 'Loading articles...' : 'No articles published yet. Click "+ Write New Article" to start.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal: Write New Article ───────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="glass-card bg-white p-8 w-full max-w-2xl space-y-4 border border-black shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-black">Compose Legal Article</h2>
                <p className="text-xs text-neutral-500">Publish high-ranking legal resources & analysis</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="form-label text-xs">Article Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Understanding Anticipatory Bail Procedures in the High Court of Orissa"
                  className="form-input text-xs py-2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label text-xs">Short Summary / Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="Key takeaways or introduction snippet for cards and search snippets..."
                  className="form-input text-xs py-2 resize-none"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label text-xs">Article Content (Markdown supported) *</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write the legal article content, statutory citations, court judgments, and practical advice..."
                  className="form-input text-xs py-2 font-mono"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Publish Status</label>
                  <select
                    className="form-input text-xs py-2 bg-white"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="PUBLISHED">Published (Live immediately)</option>
                    <option value="DRAFT">Draft (Save privately)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">SEO Meta Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="Custom page title tag"
                    className="form-input text-xs py-2"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-5"
                >
                  {submitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
