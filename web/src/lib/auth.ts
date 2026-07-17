import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";

const SESSION_COOKIE = "anamneon_session";
const SESSION_DAYS = 7;

// scrypt with per-user random salt; format: salt:hash (hex)
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export type SessionUser = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000).toISOString();
  const sql = db();
  await sql`
    INSERT INTO anamneon_sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expires})`;
  return token;
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const sql = db();
  const rows = await sql`
    SELECT u.id, u.username, u.email, u.role
    FROM anamneon_sessions s
    JOIN anamneon_users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > now()`;
  if (rows.length === 0) return null;
  return rows[0] as SessionUser;
}

export function validUsername(u: string) {
  return /^[a-zA-Z0-9_.-]{3,32}$/.test(u);
}

export function validEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
}

export function validPassword(p: string) {
  return p.length >= 10 && p.length <= 128;
}
