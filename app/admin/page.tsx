'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, FolderOpen, PencilLine, CheckCircle2 } from 'lucide-react';

interface RecentArticle { id: string; title: string; slug: string; status: string; updated_at: string }
interface Stats { totalArticles: number; publishedArticles: number; draftArticles: number; totalCategories: number; recentArticles: RecentArticle[] }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const statCards = stats ? [
    { label: 'Total Articles', value: stats.totalArticles, icon: FileText },
    { label: 'Published', value: stats.publishedArticles, icon: CheckCircle2 },
    { label: 'Drafts', value: stats.draftArticles, icon: PencilLine },
    { label: 'Categories', value: stats.totalCategories, icon: FolderOpen },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage WikiVault articles, categories and settings.</p>
      </div>

      {!stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recently Updated</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats ? (
            <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : stats.recentArticles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No articles yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentArticles.map((article) => (
                <Link key={article.id} href={`/admin/articles/edit/${article.id}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-xs text-muted-foreground">Updated {new Date(article.updated_at).toLocaleString()}</p>
                  </div>
                  <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>{article.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
