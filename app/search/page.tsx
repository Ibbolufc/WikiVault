'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Search } from 'lucide-react';

interface Article { id: string; title: string; slug: string; excerpt: string | null; updated_at: string; categories: { name: string; slug: string } | null }

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const router = useRouter();
  const [input, setInput] = useState(query);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInput(query);
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [query]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) router.push(`/search?q=${encodeURIComponent(input.trim())}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <div className="border-b bg-muted/30 py-10">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-2xl font-bold sm:text-3xl">Search</h1>
            <form onSubmit={handleSearch} className="flex max-w-xl gap-2">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search articles..." value={input} onChange={(e) => setInput(e.target.value)} className="pl-9" /></div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {query && <p className="mb-6 text-sm text-muted-foreground">{loading ? 'Searching…' : `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}</p>}
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="space-y-2 rounded-lg border p-4"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></div>)}</div>
          ) : results.length > 0 ? (
            <div className="space-y-4">{results.map((article) => <Link key={article.id} href={`/article/${article.slug}`}><div className="group rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"><div className="mb-1 flex items-center gap-2">{article.categories && <Badge variant="secondary" className="text-xs">{article.categories.name}</Badge>}</div><h3 className="font-semibold transition-colors group-hover:text-primary">{article.title}</h3>{article.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>}<p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{new Date(article.updated_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div></Link>)}</div>
          ) : query ? (
            <div className="py-16 text-center"><p className="text-muted-foreground">No articles found for &ldquo;{query}&rdquo;.</p><p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p></div>
          ) : (
            <div className="py-16 text-center text-muted-foreground">Enter a search term to find articles.</div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Search className="h-8 w-8 animate-pulse text-muted-foreground" /></div>}><SearchResults /></Suspense>;
}
