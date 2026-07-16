import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";
import { db } from "@/lib/db";
import { DEVNET_RPC, MEMO_PREFIX } from "@/lib/solana";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { id, signature, paySig } = await req.json();
    if (!id || !signature) {
      return NextResponse.json(
        { ok: false, error: "id dan signature wajib diisi" },
        { status: 400 }
      );
    }

    const sql = db();
    const rows = await sql`
      SELECT content_hash FROM anamneon_records WHERE id = ${id}`;
    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "rekord tidak ditemukan" },
        { status: 404 }
      );
    }
    const expected = MEMO_PREFIX + rows[0].content_hash;

    // Pull the transaction from devnet and confirm the memo carries our hash
    const conn = new Connection(DEVNET_RPC, "confirmed");
    const tx = await conn.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });
    if (!tx) {
      return NextResponse.json(
        { ok: false, error: "transaksi belum ditemukan di devnet, coba lagi sebentar" },
        { status: 404 }
      );
    }
    const logs = tx.meta?.logMessages?.join("\n") ?? "";
    if (!logs.includes(expected)) {
      return NextResponse.json(
        { ok: false, error: "memo transaksi tidak memuat hash rekord ini" },
        { status: 400 }
      );
    }

    await sql`
      UPDATE anamneon_records
      SET anchor_sig = ${signature}, anchor_slot = ${tx.slot},
          pay_sig = ${paySig ?? null}, status = 'anchored'
      WHERE id = ${id}`;

    return NextResponse.json({ ok: true, slot: tx.slot });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "anchor failed" },
      { status: 500 }
    );
  }
}
