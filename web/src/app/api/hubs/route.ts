import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = db();
    const rows = await sql`
      SELECT id, name, city, kind, signer_wallet, created_at
      FROM anamneon_hubs ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json({ ok: true, hubs: rows });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "query failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, city = "", kind = "clinic", signerWallet } = body;
    if (!name || !signerWallet) {
      return NextResponse.json(
        { ok: false, error: "name dan signerWallet wajib diisi" },
        { status: 400 }
      );
    }
    const sql = db();
    const rows = await sql`
      INSERT INTO anamneon_hubs (name, city, kind, signer_wallet)
      VALUES (${name}, ${city}, ${kind}, ${signerWallet})
      RETURNING id, name, city, kind, signer_wallet, created_at`;
    return NextResponse.json({ ok: true, hub: rows[0] });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "insert failed" },
      { status: 500 }
    );
  }
}
