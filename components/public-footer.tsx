'use client';

import Link from 'next/link';
import { useSettings } from '@/lib/settings';
import { Separator } from '@/components/ui/separator';

export function PublicFooter() {
  const { settings } = useSettings();
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">{settings.footer_text}</p>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link>
            <Link href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Categories</Link>
            <Link href="/admin" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Admin</Link>
          </nav>
        </div>
        <Separator className="my-6" />
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {settings.site_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
