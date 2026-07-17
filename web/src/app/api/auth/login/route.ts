import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const sql = db();
    const rows = await sql`
      SELECT id, username, email, role, password_hash
      FROM anamneon_users
      WHERE username = ${username} OR email = ${username}
      LIMIT 1`;

    // Uniform error whether the user exists or not
    if (rows.length === 0 || !verifyPassword(password, rows[0].password_hash as string)) {
      return NextResponse.json(
        { ok: false, error: "username atau password salah" },
        { status: 401 }
      );
    }

    const user = rows[0];
    const token = await createSession(user.id as number);
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "login failed" },
      { status: 500 }
    );
  }
}
