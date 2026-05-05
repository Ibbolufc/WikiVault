import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function GET() {
  try {
    requireAdmin();
    return NextResponse.json(getStats());
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
}
