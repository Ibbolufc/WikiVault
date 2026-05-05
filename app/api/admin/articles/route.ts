import { NextResponse } from 'next/server';
import { createArticle, getArticles } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function GET() {
  try {
    requireAdmin();
    return NextResponse.json(getArticles({ includeDrafts: true }));
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = requireAdmin();
    const body = await request.json();
    return NextResponse.json(createArticle({ ...body, author_name: body.author_name || user.email.split('@')[0] }), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create article.' }, { status: 400 });
  }
}
