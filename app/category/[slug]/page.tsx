import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getCategoryBySlug, getSettings } from '@/lib/db';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  const settings = getSettings();
  if (!category) return { title: 'Category Not Found' };
  return { title: `${category.name} — ${settings.site_name}`, description: category.description ?? undefined };
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();
  const articles = getArticles({ categoryId: category.id });

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <div className="border-b bg-muted/30 py-10">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={[{ label: 'Categories', href: '/categories' }, { label: category.name }]} className="mb-4" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
            {category.description && <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>}
          </div>
        </div>
        <div className="container mx-auto px-4 py-10">
          {articles.length === 0 ? (
            <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">No published articles in this category yet.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-sm">
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {article.featured && <Badge>Featured</Badge>}
                        {article.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {article.excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>}
                      <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> Updated {new Date(article.updated_at).toLocaleDateString('en-GB')}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
