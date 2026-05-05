import { NextResponse } from 'next/server';
import { searchArticles } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  return NextResponse.json(searchArticles(q));
}
