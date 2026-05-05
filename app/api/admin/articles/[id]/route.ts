import { NextResponse } from 'next/server';
import { deleteArticle, getArticleById, updateArticle } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const article = getArticleById(params.id);
    if (!article) return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const body = await request.json();
    return NextResponse.json(updateArticle(params.id, body));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update article.' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    deleteArticle(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete article.' }, { status: 400 });
  }
}
