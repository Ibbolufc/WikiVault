import Link from 'next/link';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryIcon } from '@/lib/icons';
import { getCategoriesWithCounts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = getCategoriesWithCounts(false);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <div className="border-b bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Categories</h1>
            <p className="mt-2 text-muted-foreground">Browse all documentation sections.</p>
          </div>
        </div>
        <div className="container mx-auto grid gap-5 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.icon);
            return (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && <CardDescription>{category.description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.article_count} {category.article_count === 1 ? 'article' : 'articles'}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
