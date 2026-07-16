import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { encryptJson, contentHash } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const wallet = req.nextUrl.searchParams.get("wallet");
    if (!wallet) {
      return NextResponse.json(
        { ok: false, error: "wallet query wajib diisi" },
        { status: 400 }
      );
    }
    const sql = db();
    const rows = await sql`
      SELECT id, patient_wallet, hub_name, diagnosis_label, visit_date,
             content_hash, anchor_sig, anchor_slot, pay_mode, pay_sig, status, created_at
      FROM anamneon_records
      WHERE patient_wallet = ${wallet}
      ORDER BY visit_date DESC NULLS LAST, created_at DESC`;
    return NextResponse.json({ ok: true, records: rows });
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
    const {
      patientWallet,
      hubName = "",
      visitDate,
      complaint = "",
      diagnosis = "",
      treatment = "",
      prescription = "",
      notes = "",
      payMode = "sol",
    } = body;

    if (!patientWallet || !diagnosis || !visitDate) {
      return NextResponse.json(
        { ok: false, error: "patientWallet, diagnosis, dan visitDate wajib diisi" },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const payload = {
      id,
      patientWallet,
      hubName,
      visitDate,
      complaint,
      diagnosis,
      treatment,
      prescription,
      notes,
    };
    const hash = contentHash(payload);
    const { enc, iv, tag } = encryptJson(payload);

    const sql = db();
    await sql`
      INSERT INTO anamneon_records
        (id, patient_wallet, hub_name, payload_enc, payload_iv, payload_tag,
         content_hash, diagnosis_label, visit_date, pay_mode, status)
      VALUES
        (${id}, ${patientWallet}, ${hubName}, ${enc}, ${iv}, ${tag},
         ${hash}, ${diagnosis}, ${visitDate}, ${payMode}, 'pending')`;

    return NextResponse.json({ ok: true, id, hash });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "insert failed" },
      { status: 500 }
    );
  }
}
