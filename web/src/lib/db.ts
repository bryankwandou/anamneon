import { neon } from "@neondatabase/serverless";

export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function initSchema() {
  const sql = db();
  await sql`CREATE TABLE IF NOT EXISTS anamneon_hubs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT '',
    kind TEXT NOT NULL DEFAULT 'clinic',
    signer_wallet TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS anamneon_records (
    id TEXT PRIMARY KEY,
    patient_wallet TEXT NOT NULL,
    hub_name TEXT NOT NULL DEFAULT '',
    payload_enc TEXT NOT NULL,
    payload_iv TEXT NOT NULL,
    payload_tag TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    diagnosis_label TEXT NOT NULL DEFAULT '',
    visit_date DATE,
    anchor_sig TEXT,
    anchor_slot BIGINT,
    pay_mode TEXT NOT NULL DEFAULT 'sol',
    pay_sig TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS anamneon_records_wallet_idx ON anamneon_records (patient_wallet)`;
}
