'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Category { id: string; name: string }
interface Article { id: string; title: string; slug: string; content: string; excerpt: string | null; category_id: string | null; status: string; featured: boolean; tags: string[] }

function slugify(str: string) {
  return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').trim();
}

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('none');
  const [status, setStatus] = useState('draft');
  const [featured, setFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    async function load() {
      const [articleRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/articles/${params.id}`, { cache: 'no-store' }),
        fetch('/api/admin/categories', { cache: 'no-store' }),
      ]);
      const article = await articleRes.json() as Article;
      const cats = await categoriesRes.json();
      if (!articleRes.ok) {
        toast.error('Article not found');
        router.push('/admin/articles');
        return;
      }
      setTitle(article.title);
      setSlug(article.slug);
      setContent(article.content);
      setExcerpt(article.excerpt ?? '');
      setCategoryId(article.category_id ?? 'none');
      setStatus(article.status);
      setFeatured(article.featured);
      setTagsInput((article.tags ?? []).join(', '));
      setCategories(Array.isArray(cats) ? cats : []);
      setLoading(false);
    }
    load();
  }, [params.id, router]);

  async function handleSave() {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!slug.trim()) { toast.error('Slug is required'); return; }
    setSaving(true);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const res = await fetch(`/api/admin/articles/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), slug: slugify(slug), content, excerpt: excerpt.trim() || null, category_id: categoryId === 'none' ? null : categoryId, status, featured, tags }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { toast.error(data.error ?? 'Failed to save article'); setSaving(false); return; }
    toast.success('Article saved');
    router.push('/admin/articles');
  }

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-xl font-bold">Edit Article</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setPreview(!preview)}><Eye className="h-4 w-4" />{preview ? 'Edit' : 'Preview'}</Button>
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save</Button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="border-b p-4">
            <Input placeholder="Article title" value={title} onChange={(e) => setTitle(e.target.value)} className="border-0 p-0 text-xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none" />
            <div className="mt-2 flex items-center gap-2"><span className="text-xs text-muted-foreground shrink-0">Slug:</span><Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className="h-6 border-0 border-b rounded-none px-0 text-xs text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none" /></div>
          </div>
          {preview ? <div className="overflow-y-auto p-6"><MarkdownRenderer content={content} /></div> : (
            <ResizablePanelGroup direction="horizontal" className="h-[calc(100%-80px)] min-h-[520px]">
              <ResizablePanel defaultSize={55} minSize={30}><Textarea value={content} onChange={(e) => setContent(e.target.value)} className="h-full w-full resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Write markdown here..." /></ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={45} minSize={25}><div className="h-full overflow-y-auto p-4"><MarkdownRenderer content={content} /></div></ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <h3 className="font-medium text-sm">Publishing</h3>
            <div className="space-y-2"><Label className="text-xs">Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label className="text-xs">Category</Label><Select value={categoryId} onValueChange={setCategoryId}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="None" /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex items-center justify-between"><Label className="text-xs">Featured</Label><Switch checked={featured} onCheckedChange={setFeatured} /></div>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <h3 className="font-medium text-sm">Metadata</h3>
            <div className="space-y-2"><Label className="text-xs">Excerpt</Label><Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short description..." className="text-xs resize-none h-20" /></div>
            <div className="space-y-2"><Label className="text-xs">Tags (comma separated)</Label><Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="tag1, tag2, tag3" className="h-8 text-xs" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
