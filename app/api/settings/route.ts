import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(request: Request) {
  try {
    requireAdmin();
    const body = await request.json();
    return NextResponse.json(updateSettings(body));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save settings.' }, { status: 401 });
  }
}
