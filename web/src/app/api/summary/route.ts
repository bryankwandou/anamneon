import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from "@/lib/db";
import { decryptJson } from "@/lib/crypto";

export const dynamic = "force-dynamic";

type Payload = {
  visitDate: string;
  hubName: string;
  complaint: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
};

export async function POST(req: NextRequest) {
  try {
    const { wallet } = await req.json();
    if (!wallet) {
      return NextResponse.json(
        { ok: false, error: "wallet wajib diisi" },
        { status: 400 }
      );
    }
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "GROQ_API_KEY belum diset" },
        { status: 500 }
      );
    }

    const sql = db();
    const rows = await sql`
      SELECT payload_enc, payload_iv, payload_tag
      FROM anamneon_records
      WHERE patient_wallet = ${wallet} AND status = 'anchored'
      ORDER BY visit_date ASC NULLS LAST, created_at ASC
      LIMIT 50`;

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "belum ada rekord ter-anchor untuk wallet ini" },
        { status: 404 }
      );
    }

    const history = rows.map((r) => {
      const p = decryptJson<Payload>(r.payload_enc, r.payload_iv, r.payload_tag);
      return `- ${p.visitDate} di ${p.hubName || "fasilitas tidak dicantumkan"}: keluhan "${p.complaint}", diagnosa "${p.diagnosis}", tindakan "${p.treatment}", resep "${p.prescription}". Catatan: ${p.notes || "-"}`;
    });

    const groq = new Groq({ apiKey });
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content:
            "Kamu asisten anamnesis untuk dokter di Indonesia. Rangkum riwayat penyakit pasien menjadi ringkasan klinis yang padat: pola keluhan, diagnosa berulang, obat yang pernah diberikan, dan hal yang perlu diwaspadai dokter berikutnya. Tulis dalam bahasa Indonesia, tanpa emoji, maksimal 5 paragraf pendek. Ini alat bantu, bukan pengganti penilaian klinis.",
        },
        {
          role: "user",
          content: `Riwayat kronologis pasien:\n${history.join("\n")}`,
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      summary: chat.choices[0]?.message?.content ?? "",
      entries: rows.length,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "summary failed" },
      { status: 500 }
    );
  }
}
