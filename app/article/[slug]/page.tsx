import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticleBySlug, getArticles, getSettings } from '@/lib/db';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleBody } from './article-body';
import { Clock, User, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  const settings = getSettings();
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title} — ${settings.site_name}`,
    description: article.excerpt ?? undefined,
    openGraph: { title: article.title, description: article.excerpt ?? undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = article.category_id
    ? getArticles({ categoryId: article.category_id, limit: 5 }).filter((item) => item.id !== article.id).slice(0, 4)
    : [];
  const category = article.categories;

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <div className="border-b bg-muted/30 py-10">
          <div className="container mx-auto px-4">
            <Breadcrumbs
              items={[
                ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
                { label: article.title },
              ]}
              className="mb-4"
            />
            <div className="max-w-3xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {category && <Badge variant="secondary">{category.name}</Badge>}
                {article.featured && <Badge className="bg-primary">Featured</Badge>}
                {article.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="gap-1">
                    <Tag className="h-3 w-3" />{tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{article.title}</h1>
              {article.excerpt && <p className="mt-3 text-lg text-muted-foreground">{article.excerpt}</p>}
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                {article.author_name && <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{article.author_name}</span>}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Updated {new Date(article.updated_at).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <ArticleBody content={article.content} />
        </div>

        {related.length > 0 && (
          <div className="border-t bg-muted/30 py-12">
            <div className="container mx-auto px-4">
              <h2 className="mb-6 text-xl font-semibold">Related Articles</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((r) => (
                  <Link key={r.id} href={`/article/${r.slug}`}>
                    <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-2 text-base transition-colors group-hover:text-primary">{r.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {r.excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
