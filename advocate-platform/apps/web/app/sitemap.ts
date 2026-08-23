import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/practice-areas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/success-stories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
  ];

  // Practice area pages
  const practiceAreaSlugs = [
    'criminal-law', 'family-law', 'property-law',
    'consumer-law', 'civil-law', 'cyber-law',
  ];
  const practiceAreaPages: MetadataRoute.Sitemap = practiceAreaSlugs.map((slug) => ({
    url: `${baseUrl}/practice-areas/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Dynamic article pages
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/public/articles?limit=100&page=1`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      articlePages = (data.data || []).map((article: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch { /* If API is down, just skip dynamic pages */ }

  // Dynamic success story pages
  let storyPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/public/success-stories?limit=100&page=1`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      storyPages = (data.data || []).map((story: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/success-stories/${story.slug}`,
        lastModified: story.updatedAt ? new Date(story.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch { /* skip */ }

  return [
    ...staticPages,
    ...practiceAreaPages,
    ...articlePages,
    ...storyPages,
    // NOTE: /admin/* and /client/* are intentionally excluded from sitemap
  ];
}
