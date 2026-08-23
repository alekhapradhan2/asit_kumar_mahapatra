import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/practice-areas/',
          '/articles/',
          '/success-stories/',
          '/contact',
        ],
        disallow: [
          '/admin',
          '/admin/',
          '/client',
          '/client/',
          '/api/',
          '/_next/',
        ],
      },
      {
        // Block all bots from private areas explicitly
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
