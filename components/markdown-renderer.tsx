'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Heading { id: string; text: string; level: number }

interface MarkdownRendererProps {
  content: string;
  onHeadingsExtracted?: (headings: Heading[]) => void;
  className?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, [text]);
  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} className="copy-button h-7 w-7" aria-label="Copy code" type="button">
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

function extractHeadingsFromMarkdown(content: string): Heading[] {
  const regex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    headings.push({ id, text, level });
  }
  return headings;
}

export function MarkdownRenderer({ content, onHeadingsExtracted, className }: MarkdownRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!onHeadingsExtracted) return;
    const headings = extractHeadingsFromMarkdown(content);
    if (headings.length > 0) onHeadingsExtracted(headings);
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mounted || !onHeadingsExtracted) return;
    const timer = setTimeout(() => {
      const el = document.getElementById('markdown-body');
      if (!el) return;
      const nodes = el.querySelectorAll('h1, h2, h3, h4');
      const headings: Heading[] = Array.from(nodes).map(n => ({
        id: n.id,
        text: n.textContent ?? '',
        level: parseInt(n.tagName[1], 10),
      }));
      if (headings.length > 0) onHeadingsExtracted(headings);
    }, 150);
    return () => clearTimeout(timer);
  }, [content, mounted, onHeadingsExtracted]);

  return (
    <div id="markdown-body" className={cn('prose-kb', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypeHighlight,
        ]}
        components={{
          pre: ({ children, ...props }) => {
            const codeEl = (props as any).node?.children?.[0];
            let codeText = '';
            if (codeEl && 'children' in codeEl) {
              const extractText = (node: unknown): string => {
                if (!node || typeof node !== 'object') return '';
                const n = node as Record<string, unknown>;
                if (n.type === 'text' && typeof n.value === 'string') return n.value;
                if (Array.isArray(n.children)) return (n.children as unknown[]).map(extractText).join('');
                return '';
              };
              codeText = extractText(codeEl);
            }
            return (
              <div className="code-block-wrapper">
                <CopyButton text={codeText} />
                <pre {...props}>{children}</pre>
              </div>
            );
          },
          a: ({ href, children, ...props }) => (
            <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined} {...props}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
