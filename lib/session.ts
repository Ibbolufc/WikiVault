import 'server-only';

import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'wikivault_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SessionUser {
  email: string;
  role: 'admin';
}

function secret() {
  return process.env.SESSION_SECRET || 'change-this-session-secret-in-production';
}

function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

function timingSafeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function createToken(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function readToken(token?: string): SessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !timingSafeEqual(signature, sign(payload))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionUser & { exp: number };
    if (!parsed.exp || parsed.exp < Date.now() || parsed.role !== 'admin') return null;
    return { email: parsed.email, role: 'admin' };
  } catch {
    return null;
  }
}

export function getSessionUser(): SessionUser | null {
  return readToken(cookies().get(COOKIE_NAME)?.value);
}

export function requireAdmin(): SessionUser {
  const user = getSessionUser();
  if (!user) throw new Error('Unauthorised');
  return user;
}

export function setSession(user: SessionUser) {
  cookies().set(COOKIE_NAME, createToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSession() {
  cookies().set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function makePasswordHash(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `scrypt$${salt}$${hashPassword(password, salt)}`;
}

export function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) return false;

  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  if (configuredHash?.startsWith('scrypt$')) {
    const [, salt, expected] = configuredHash.split('$');
    return timingSafeEqual(hashPassword(password, salt), expected);
  }

  const fallbackPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return timingSafeEqual(password, fallbackPassword);
}
