import { NextResponse } from 'next/server';
import { setSession, verifyAdminCredentials } from '@/lib/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? '');
  const password = String(body.password ?? '');

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const user = { email: email.trim().toLowerCase(), role: 'admin' as const };
  setSession(user);
  return NextResponse.json({ user, isAdmin: true });
}
