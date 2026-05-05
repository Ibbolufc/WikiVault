import { HomepageContent } from '@/components/homepage-content';
import { getArticles, getCategoriesWithCounts, getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const settings = getSettings();
  const categories = getCategoriesWithCounts(false);
  const featuredArticles = getArticles({ featured: true, limit: 6 });
  const recentArticles = getArticles({ limit: 8 });

  return (
    <HomepageContent
      settings={settings}
      categories={categories}
      featuredArticles={featuredArticles}
      recentArticles={recentArticles}
    />
  );
}
