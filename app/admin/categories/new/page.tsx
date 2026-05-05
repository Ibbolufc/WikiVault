'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const iconOptions = ['BookOpen', 'CreditCard', 'Gamepad2', 'Shield', 'Wrench', 'FileText', 'HelpCircle', 'Server'];

function slugify(str: string) { return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').trim(); }

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [sortOrder, setSortOrder] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!slugManual) setSlug(slugify(name)); }, [name, slugManual]);

  async function handleSave() {
    if (!name.trim()) { toast.error('Name is required'); return; }
    if (!slug.trim()) { toast.error('Slug is required'); return; }
    setSaving(true);
    const res = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug, description, icon, sort_order: sortOrder ? Number(sortOrder) : null }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { toast.error(data.error ?? 'Failed to create category'); setSaving(false); return; }
    toast.success('Category created');
    router.push('/admin/categories');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3"><Link href="/admin/categories"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link><div><h1 className="text-2xl font-bold tracking-tight">New Category</h1><p className="text-muted-foreground">Add a new section to your knowledgebase.</p></div></div>
      <div className="rounded-lg border bg-card p-6 space-y-5">
        <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Getting Started" /></div>
        <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugManual(true); }} placeholder="getting-started" /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short category description..." /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Icon</Label><Select value={icon} onValueChange={setIcon}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder="1" /></div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Category</Button>
      </div>
    </div>
  );
}
