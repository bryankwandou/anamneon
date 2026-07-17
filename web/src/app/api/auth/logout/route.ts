import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { clearSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const jar = await cookies();
    const token = jar.get("anamneon_session")?.value;
    if (token) {
      const sql = db();
      await sql`DELETE FROM anamneon_sessions WHERE token = ${token}`;
    }
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "logout failed" },
      { status: 500 }
    );
  }
}
