'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/lib/settings';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const presetColors = ['#6d5dfc', '#2563eb', '#7c3aed', '#0891b2', '#059669', '#dc2626'];

export default function SettingsPage() {
  const { settings, refreshSettings } = useSettings();
  const [siteName, setSiteName] = useState(settings.site_name);
  const [siteDescription, setSiteDescription] = useState(settings.site_description);
  const [logoText, setLogoText] = useState(settings.logo_text);
  const [footerText, setFooterText] = useState(settings.footer_text);
  const [themeColor, setThemeColor] = useState(settings.theme_color);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSiteName(settings.site_name);
    setSiteDescription(settings.site_description);
    setLogoText(settings.logo_text);
    setFooterText(settings.footer_text);
    setThemeColor(settings.theme_color);
  }, [settings]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_name: siteName.trim() || 'WikiVault',
        site_description: siteDescription.trim() || 'Your self-hosted home for guides, docs and support articles.',
        logo_text: logoText.trim().slice(0, 4) || 'WV',
        footer_text: footerText.trim() || 'WikiVault — free, self-hosted knowledge management.',
        theme_color: themeColor.trim() || '#6d5dfc',
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { toast.error(data.error ?? 'Failed to save settings'); setSaving(false); return; }
    await refreshSettings();
    toast.success('Settings saved');
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Customise the public WikiVault branding.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>General</CardTitle><CardDescription>These details are shown on the public knowledgebase.</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label>Site Name</Label><Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="WikiVault" /></div>
          <div className="space-y-2"><Label>Site Description</Label><Textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} placeholder="Your self-hosted home for guides, docs and support articles." /></div>
          <div className="space-y-2"><Label>Footer Text</Label><Input value={footerText} onChange={(e) => setFooterText(e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Adjust the short logo text and accent colour.</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2"><Label>Logo Text</Label><Input value={logoText} onChange={(e) => setLogoText(e.target.value.slice(0, 4))} placeholder="WV" /></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">{logoText || 'WV'}</div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label>Theme Colour</Label>
            <div className="flex flex-wrap gap-3">
              {presetColors.map((color) => (
                <button key={color} type="button" onClick={() => setThemeColor(color)} className="h-9 w-9 rounded-lg border-2 transition-transform hover:scale-110" style={{ backgroundColor: color, borderColor: themeColor === color ? 'hsl(var(--foreground))' : 'transparent' }} title={color} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3"><Label className="shrink-0">Custom Color</Label><input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="h-9 w-16 cursor-pointer rounded border bg-transparent" /><Input value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-32 font-mono text-sm" placeholder="#6d5dfc" /></div>
        </CardContent>
      </Card>
    </div>
  );
}
