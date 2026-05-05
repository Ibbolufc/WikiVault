'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Heading } from './markdown-renderer';

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(sorted[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    if (headings[0]) setActiveId(headings[0].id);
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav aria-label="Table of contents" className={cn('space-y-1', className)}>
      <h4 className="mb-3 text-sm font-semibold text-foreground">On This Page</h4>
      <ul className="space-y-1 border-l border-border">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const indentLevel = heading.level - minLevel;
          return (
            <li key={heading.id}>
              <button
                onClick={() => handleClick(heading.id)}
                className={cn(
                  'block w-full border-l-2 py-1 text-left text-sm transition-colors',
                  indentLevel === 0 && 'pl-3',
                  indentLevel === 1 && 'pl-6',
                  indentLevel === 2 && 'pl-9',
                  indentLevel >= 3 && 'pl-12',
                  isActive
                    ? 'border-l-primary font-medium text-foreground'
                    : 'border-l-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
