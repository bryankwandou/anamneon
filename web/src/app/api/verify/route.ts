import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";
import { db } from "@/lib/db";
import { decryptJson, contentHash } from "@/lib/crypto";
import { DEVNET_RPC, MEMO_PREFIX, explorerTx } from "@/lib/solana";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")?.trim();
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "id rekord wajib diisi" },
        { status: 400 }
      );
    }

    const sql = db();
    const rows = await sql`
      SELECT id, payload_enc, payload_iv, payload_tag, content_hash,
             diagnosis_label, hub_name, visit_date, anchor_sig, anchor_slot, status
      FROM anamneon_records WHERE id = ${id}`;
    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "rekord tidak ditemukan" },
        { status: 404 }
      );
    }
    const r = rows[0];

    // 1) Recompute the fingerprint from the stored (encrypted) payload
    const payload = decryptJson<Record<string, unknown>>(
      r.payload_enc,
      r.payload_iv,
      r.payload_tag
    );
    const recomputed = contentHash(payload);
    const hashMatchesDb = recomputed === r.content_hash;

    // 2) Confirm the fingerprint really sits on Solana devnet
    let onChain = false;
    let slot: number | null = null;
    if (r.anchor_sig) {
      const conn = new Connection(DEVNET_RPC, "confirmed");
      const tx = await conn.getTransaction(r.anchor_sig, {
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      });
      if (tx) {
        slot = tx.slot;
        const logs = tx.meta?.logMessages?.join("\n") ?? "";
        onChain = logs.includes(MEMO_PREFIX + recomputed);
      }
    }

    return NextResponse.json({
      ok: true,
      verified: hashMatchesDb && onChain,
      detail: {
        id: r.id,
        diagnosisLabel: r.diagnosis_label,
        hubName: r.hub_name,
        visitDate: r.visit_date,
        recomputedHash: recomputed,
        storedHash: r.content_hash,
        hashMatchesDb,
        onChain,
        anchorSig: r.anchor_sig,
        anchorSlot: slot ?? r.anchor_slot,
        explorer: r.anchor_sig ? explorerTx(r.anchor_sig) : null,
        status: r.status,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "verify failed" },
      { status: 500 }
    );
  }
}
