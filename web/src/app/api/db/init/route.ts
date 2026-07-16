import { NextResponse } from "next/server";
import { initSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initSchema();
    return NextResponse.json({ ok: true, message: "Schema ready" });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "init failed" },
      { status: 500 }
    );
  }
}
