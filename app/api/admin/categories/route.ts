import { NextResponse } from 'next/server';
import { createCategory, getCategories, getCategoriesWithCounts } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function GET(request: Request) {
  try {
    requireAdmin();
    const { searchParams } = new URL(request.url);
    if (searchParams.get('counts') === '1') return NextResponse.json(getCategoriesWithCounts(true));
    return NextResponse.json(getCategories());
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    requireAdmin();
    const body = await request.json();
    return NextResponse.json(createCategory(body), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create category.' }, { status: 400 });
  }
}
