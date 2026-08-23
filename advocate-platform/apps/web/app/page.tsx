import type { Metadata } from 'next';
import { publicApi } from '@/lib/api-client';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { HeroSection } from '@/components/public/HeroSection';
import { PracticeAreasSection } from '@/components/public/PracticeAreasSection';
import { FeaturedArticles } from '@/components/public/FeaturedArticles';
import { FeaturedStories } from '@/components/public/FeaturedStories';
import { AdvocateBioSection } from '@/components/public/AdvocateBioSection';
import { FAQSection } from '@/components/public/FAQSection';
import { ContactCTA } from '@/components/public/ContactCTA';
import { BackgroundEffects } from '@/components/public/BackgroundEffects';
import { StructuredData } from '@/components/shared/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  let siteConfig = null;
  try {
    const res = await publicApi.getSiteConfig();
    siteConfig = res.data;
  } catch { /* use defaults */ }

  const siteName = siteConfig?.siteName || process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

  return {
    title: siteConfig?.defaultSeoTitle || `${siteName} — High Court & Supreme Court Counsel`,
    description: siteConfig?.defaultMetaDesc || `${siteName} delivers strategic courtroom advocacy across Criminal, Property, Family, Consumer, and Civil jurisdictions.`,
    openGraph: {
      title: `${siteName} — Expert Legal Services & Court Advocacy`,
      description: `Decisive statutory legal counsel and transparent digital case tracking. Chambers of ${siteName}.`,
      type: 'website',
    },
  };
}

export default async function HomePage() {
  let articles: any[] = [];
  let stories: any[] = [];

  try {
    const [articlesRes, storiesRes] = await Promise.allSettled([
      publicApi.getArticles(1, 3),
      publicApi.getSuccessStories(1, 3),
    ]);
    if (articlesRes.status === 'fulfilled' && articlesRes.value?.data?.length > 0) {
      articles = articlesRes.value.data;
    }
    if (storiesRes.status === 'fulfilled' && storiesRes.value?.data?.length > 0) {
      stories = storiesRes.value.data;
    }
  } catch { /* render with rich default fallback data */ }

  const legalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    description: 'Strategic legal counsel and courtroom defense across Criminal, Family, Property, Consumer, and Civil Law in India.',
    serviceType: ['Criminal Law', 'Family Law', 'Property Law', 'Consumer Law', 'Civil Law', 'Cyber Law'],
    areaServed: { '@type': 'Country', name: 'India' },
  };

  return (
    <>
      <StructuredData data={legalServiceSchema} />
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-grow">
          <HeroSection />
          <PracticeAreasSection />
          <FeaturedStories stories={stories} />
          <AdvocateBioSection />
          <FeaturedArticles articles={articles} />
          <FAQSection />
          <ContactCTA />
        </main>
        <PublicFooter />
      </div>
    </>
  );
}
