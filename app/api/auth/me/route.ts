import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';

export async function GET() {
  const user = getSessionUser();
  return NextResponse.json({ user, isAdmin: Boolean(user) });
}
