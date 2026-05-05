import { NextResponse } from 'next/server';
import { deleteCategory, getCategoryById, updateCategory } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const category = getCategoryById(params.id);
    if (!category) return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const body = await request.json();
    return NextResponse.json(updateCategory(params.id, body));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update category.' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    deleteCategory(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete category.' }, { status: 400 });
  }
}
