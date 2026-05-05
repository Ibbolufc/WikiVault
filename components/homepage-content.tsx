'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCategoryIcon } from '@/lib/icons';
import { Search, ArrowRight, Clock, User, Star } from 'lucide-react';

interface SiteSettings { site_name: string; site_description: string; logo_text: string; footer_text: string }
interface CategoryWithCount { id: string; name: string; slug: string; description: string | null; icon: string | null; sort_order: number | null; article_count: number }
interface ArticleWithCategory { id: string; title: string; slug: string; excerpt: string | null; category_id: string | null; author_name: string | null; featured: boolean | null; created_at: string | null; updated_at: string | null; categories: { name: string; slug: string } | null }

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function HeroSection({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
      <div className="container relative mx-auto px-4 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">{settings.site_name}</h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100 sm:text-xl">{settings.site_description}</p>
        <form onSubmit={handleSearch} className="mx-auto flex max-w-xl items-center gap-2 rounded-xl bg-white/10 p-2 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-200" />
            <Input placeholder="Search for articles, guides, and more..." value={query} onChange={(e) => setQuery(e.target.value)} className="border-0 bg-white/20 pl-10 text-white placeholder:text-blue-200 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
          <Button type="submit" className="bg-white text-blue-700 hover:bg-blue-50">Search</Button>
        </form>
      </div>
    </section>
  );
}

function CategoryCards({ categories }: { categories: CategoryWithCount[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse by Category</h2>
          <p className="mt-1 text-muted-foreground">Explore our knowledge base organized by topic</p>
        </div>
        <Link href="/categories"><Button variant="ghost" className="gap-2">View all<ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.icon);
          return (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  {category.description && <CardDescription className="line-clamp-2">{category.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{category.article_count} {category.article_count === 1 ? 'article' : 'articles'}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedArticles({ articles }: { articles: ArticleWithCategory[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8"><div className="mb-1 flex items-center gap-2"><Star className="h-5 w-5 text-primary" /><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured Articles</h2></div><p className="mt-1 text-muted-foreground">Handpicked guides and important resources</p></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/article/${article.slug}`}>
              <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {article.categories && <Badge variant="secondary" className="text-xs">{article.categories.name}</Badge>}
                    <Badge className="text-xs">Featured</Badge>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {article.excerpt && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {article.author_name && <span className="flex items-center gap-1"><User className="h-3 w-3" />{article.author_name}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(article.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentArticles({ articles }: { articles: ArticleWithCategory[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Recently Updated</h2><p className="mt-1 text-muted-foreground">The latest changes and additions</p></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`}>
            <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="pb-3">
                {article.categories && <Badge variant="secondary" className="mb-2 w-fit text-xs">{article.categories.name}</Badge>}
                <CardTitle className="line-clamp-2 text-base transition-colors group-hover:text-primary">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {article.excerpt && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {article.author_name && <span className="flex items-center gap-1"><User className="h-3 w-3" />{article.author_name}</span>}
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(article.updated_at)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HomepageContent({ settings, categories, featuredArticles, recentArticles }: { settings: SiteSettings; categories: CategoryWithCount[]; featuredArticles: ArticleWithCategory[]; recentArticles: ArticleWithCategory[] }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <HeroSection settings={settings} />
        <CategoryCards categories={categories} />
        <FeaturedArticles articles={featuredArticles} />
        <RecentArticles articles={recentArticles} />
      </main>
      <PublicFooter />
    </div>
  );
}
