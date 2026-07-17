import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Returns only general identity fields agreed for consensus display:
// name, gender, age, birth date, city, blood type, insurance.
// No diagnoses, no clinical notes — those stay encrypted per-record.
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "login dulu untuk mengakses data pasien" },
        { status: 401 }
      );
    }

    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
    const per = 25;
    const offset = (page - 1) * per;
    const sql = db();

    const like = `%${q}%`;
    const rows = q
      ? await sql`
          SELECT id, full_name, gender, birth_date, city, blood_type, insurance, insurance_no, dataset_source
          FROM anamneon_patients
          WHERE full_name ILIKE ${like} OR city ILIKE ${like}
          ORDER BY full_name ASC LIMIT ${per} OFFSET ${offset}`
      : await sql`
          SELECT id, full_name, gender, birth_date, city, blood_type, insurance, insurance_no, dataset_source
          FROM anamneon_patients
          ORDER BY full_name ASC LIMIT ${per} OFFSET ${offset}`;

    const countRows = q
      ? await sql`SELECT count(*)::int AS n FROM anamneon_patients WHERE full_name ILIKE ${like} OR city ILIKE ${like}`
      : await sql`SELECT count(*)::int AS n FROM anamneon_patients`;

    // Mask insurance numbers — general identity only, no full credentials
    const patients = rows.map((r) => ({
      ...r,
      insurance_no: String(r.insurance_no).replace(/.(?=.{4})/g, "*"),
    }));

    return NextResponse.json({
      ok: true,
      patients,
      total: countRows[0].n,
      page,
      perPage: per,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "query failed" },
      { status: 500 }
    );
  }
}
