import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  hashPassword,
  createSession,
  setSessionCookie,
  validUsername,
  validEmail,
  validPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, confirmPassword, acceptTerms } = await req.json();

    if (!validUsername(username ?? "")) {
      return NextResponse.json(
        { ok: false, error: "username 3-32 karakter, huruf/angka/._- saja" },
        { status: 400 }
      );
    }
    if (!validEmail(email ?? "")) {
      return NextResponse.json({ ok: false, error: "email tidak valid" }, { status: 400 });
    }
    if (!validPassword(password ?? "")) {
      return NextResponse.json(
        { ok: false, error: "password minimal 10 karakter" },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { ok: false, error: "konfirmasi password tidak sama" },
        { status: 400 }
      );
    }
    if (acceptTerms !== true) {
      return NextResponse.json(
        { ok: false, error: "syarat & ketentuan dan kebijakan privasi wajib disetujui" },
        { status: 400 }
      );
    }

    const sql = db();
    const dup = await sql`
      SELECT 1 FROM anamneon_users
      WHERE username = ${username} OR email = ${email} LIMIT 1`;
    if (dup.length > 0) {
      return NextResponse.json(
        { ok: false, error: "username atau email sudah terpakai" },
        { status: 409 }
      );
    }

    const rows = await sql`
      INSERT INTO anamneon_users (username, email, password_hash, accepted_terms_at)
      VALUES (${username}, ${email}, ${hashPassword(password)}, now())
      RETURNING id, username, email, role`;
    const user = rows[0];

    const token = await createSession(user.id as number);
    await setSessionCookie(token);

    return NextResponse.json({ ok: true, user });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "register failed" },
      { status: 500 }
    );
  }
}
