// Seed: synthetic demo patient directory (clearly labeled) + max-progress account.
// Run from web/ so @neondatabase/serverless resolves. DATABASE_URL passed via env file.
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { randomBytes, scryptSync, randomInt } from "crypto";

const env = Object.fromEntries(
  readFileSync(new URL("./seed.env", import.meta.url), "utf8")
    .split(/\r?\n/).filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)])
);
const sql = neon(env.DATABASE_URL);

// Ensure tables exist (mirrors src/lib/db.ts initSchema)
await sql`CREATE TABLE IF NOT EXISTS anamneon_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  accepted_terms_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`;
await sql`CREATE TABLE IF NOT EXISTS anamneon_sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES anamneon_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`;
await sql`CREATE TABLE IF NOT EXISTS anamneon_patients (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  birth_date DATE NOT NULL,
  city TEXT NOT NULL,
  blood_type TEXT NOT NULL DEFAULT '',
  insurance TEXT NOT NULL DEFAULT '',
  insurance_no TEXT NOT NULL DEFAULT '',
  dataset_source TEXT NOT NULL DEFAULT 'synthetic-demo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS anamneon_patients_name_idx ON anamneon_patients (full_name)`;

// --- max-progress account (password never stored in plaintext) ---
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(env.ADMIN_PW, salt, 64).toString("hex");
const existing = await sql`SELECT id FROM anamneon_users WHERE username = ${env.ADMIN_USER}`;
if (existing.length === 0) {
  await sql`
    INSERT INTO anamneon_users (username, email, password_hash, role, accepted_terms_at)
    VALUES (${env.ADMIN_USER}, ${env.ADMIN_EMAIL}, ${salt + ":" + hash}, 'admin', now())`;
  console.log("admin account created:", env.ADMIN_USER);
} else {
  await sql`UPDATE anamneon_users SET password_hash = ${salt + ":" + hash}, role='admin' WHERE username = ${env.ADMIN_USER}`;
  console.log("admin account updated:", env.ADMIN_USER);
}

// --- synthetic patients, Indonesian name patterns ---
const first = ["Adi","Agus","Andi","Ayu","Bagus","Bayu","Citra","Dewi","Dian","Dimas","Eka","Fajar","Fitri","Gita","Hadi","Hana","Indah","Intan","Joko","Kartika","Lestari","Lukman","Maya","Mega","Nanda","Nia","Nur","Putra","Putri","Rahmat","Ratna","Rendi","Rina","Rizky","Sari","Satria","Sinta","Sri","Taufik","Tri","Wahyu","Widya","Yoga","Yuli","Yusuf","Zahra","Ahmad","Budi","Cahya","Dedi"];
const last = ["Pratama","Saputra","Wijaya","Santoso","Hidayat","Nugroho","Ramadhan","Setiawan","Kusuma","Maulana","Firmansyah","Gunawan","Hakim","Iskandar","Junaedi","Kurniawan","Lubis","Mahendra","Nasution","Oktaviani","Permata","Rahayu","Simanjuntak","Tanjung","Utami","Wibowo","Yulianti","Siregar","Halim","Salim","Latif","Marpaung","Pane","Sihombing","Manurung","Situmorang","Sitorus","Ambarita","Pasaribu","Daeng"];
const cities = ["Makassar","Jakarta Pusat","Jakarta Selatan","Surabaya","Bandung","Medan","Semarang","Yogyakarta","Palembang","Denpasar","Manado","Padang","Pekanbaru","Banjarmasin","Pontianak","Samarinda","Kupang","Ambon","Jayapura","Mataram","Kendari","Palu","Gorontalo","Malang","Surakarta","Bekasi","Tangerang","Depok","Bogor","Balikpapan"];
const blood = ["A","B","AB","O","A","O","B","O"];
const insurers = ["BPJS Kesehatan","BPJS Kesehatan","BPJS Kesehatan","Prudential","Allianz","AXA Mandiri","Manulife","BNI Life","Tanpa asuransi"];

const already = await sql`SELECT count(*)::int AS n FROM anamneon_patients`;
if (already[0].n >= 600) {
  console.log("patients already seeded:", already[0].n);
} else {
  const rows = [];
  const used = new Set();
  while (rows.length < 600) {
    const name = `${first[randomInt(first.length)]} ${first[randomInt(first.length)]} ${last[randomInt(last.length)]}`;
    if (used.has(name)) continue;
    used.add(name);
    const year = 1945 + randomInt(78); // 1945-2022
    const month = 1 + randomInt(12);
    const day = 1 + randomInt(28);
    const ins = insurers[randomInt(insurers.length)];
    rows.push({
      full_name: name,
      gender: Math.random() < 0.5 ? "L" : "P",
      birth_date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      city: cities[randomInt(cities.length)],
      blood_type: blood[randomInt(blood.length)],
      insurance: ins,
      insurance_no: ins === "Tanpa asuransi" ? "" : String(1000000000000 + randomInt(899999999999)),
      dataset_source: "synthetic-demo-v1 (pola dataset kesehatan publik, bukan orang nyata)",
    });
  }
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    await Promise.all(
      chunk.map(
        (p) => sql`
          INSERT INTO anamneon_patients
            (full_name, gender, birth_date, city, blood_type, insurance, insurance_no, dataset_source)
          VALUES
            (${p.full_name}, ${p.gender}, ${p.birth_date}, ${p.city}, ${p.blood_type}, ${p.insurance}, ${p.insurance_no}, ${p.dataset_source})`
      )
    );
    process.stdout.write(`seeded ${Math.min(i + 50, rows.length)}/600\r`);
  }
  console.log("\npatients seeded: 600");
}

const stats = await sql`SELECT count(*)::int AS patients FROM anamneon_patients`;
const users = await sql`SELECT count(*)::int AS users FROM anamneon_users`;
console.log("totals:", { patients: stats[0].patients, users: users[0].users });
