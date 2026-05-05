'use client';

import { useState } from 'react';
import { MarkdownRenderer, type Heading } from '@/components/markdown-renderer';
import { TableOfContents } from '@/components/table-of-contents';

interface ArticleBodyProps {
  content: string;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  return (
    <div className="flex gap-12">
      <div className="min-w-0 flex-1">
        {headings.length > 0 && (
          <div className="mb-8 lg:hidden">
            <TableOfContents headings={headings} />
          </div>
        )}
        <MarkdownRenderer content={content} onHeadingsExtracted={setHeadings} />
      </div>
      {headings.length > 0 && (
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      )}
    </div>
  );
}
