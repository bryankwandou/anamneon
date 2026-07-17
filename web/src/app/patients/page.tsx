"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/motion";
import { useLang } from "@/lib/i18n";

type Patient = {
  id: number;
  full_name: string;
  gender: string;
  birth_date: string;
  city: string;
  blood_type: string;
  insurance: string;
  insurance_no: string;
  dataset_source: string;
};

type Me = { username: string } | null;

function age(birth: string) {
  const b = new Date(birth);
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--;
  return a;
}

export default function PatientsPage() {
  const { t, lang } = useLang();
  const [me, setMe] = useState<Me>(null);
  const [checked, setChecked] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => setMe(j.user))
      .finally(() => setChecked(true));
  }, []);

  const load = useCallback(async (query: string, p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(query)}&page=${p}`);
      const j = await res.json();
      if (j.ok) {
        setPatients(j.patients);
        setTotal(j.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (me) load(q, page);
  }, [me, q, page, load]);

  if (checked && !me) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-display text-3xl">
          {t("Khusus pengguna terdaftar", "Registered users only")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {t(
            "Direktori pasien hanya bisa diakses setelah masuk. Yang tampil pun hanya identitas umum — riwayat medis tetap terenkripsi.",
            "The patient directory requires login. Even then, only general identity is shown — medical histories stay encrypted."
          )}
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#04211d] hover:opacity-85"
          >
            {t("Masuk", "Log in")}
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-line bg-surface px-6 py-2.5 text-sm hover:border-accent/50"
          >
            {t("Daftar", "Sign up")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14" key={lang}>
      <FadeUp>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">
              {t("Direktori pasien", "Patient directory")}
            </p>
            <h1 className="font-display mt-2 text-3xl md:text-4xl">
              {total.toLocaleString()} {t("pasien terdaftar", "registered patients")}
            </h1>
          </div>
          {me && (
            <p className="text-xs text-muted">
              {t("Masuk sebagai", "Signed in as")}{" "}
              <span className="font-mono text-foreground">{me.username}</span>
            </p>
          )}
        </div>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted">
          {t(
            "Hanya identitas umum yang ditampilkan: nama, usia, tanggal lahir, kota, golongan darah, dan asuransi (nomor disamarkan). Riwayat medis tidak pernah tampil di sini — tiap entri tetap terenkripsi dan hanya terbuka lewat wallet pemiliknya. Data pasien di direktori ini adalah dataset demo sintetis yang dilabeli jelas, mengikuti pola dataset kesehatan publik, agar tidak ada data pribadi nyata yang tersentuh.",
            "Only general identity is shown: name, age, birth date, city, blood type, and insurance (numbers masked). Medical histories never appear here — each entry stays encrypted and opens only through its owner's wallet. Patients in this directory are a clearly-labeled synthetic demo dataset following public health-dataset patterns, so no real personal data is ever touched."
          )}
        </p>
      </FadeUp>

      <div className="mt-8">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder={t("Cari nama atau kota...", "Search name or city...")}
          className="w-full max-w-sm rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3">{t("Nama lengkap", "Full name")}</th>
              <th className="px-4 py-3">{t("Usia", "Age")}</th>
              <th className="px-4 py-3">{t("Tanggal lahir", "Birth date")}</th>
              <th className="px-4 py-3">{t("Kota", "City")}</th>
              <th className="px-4 py-3">{t("Gol. darah", "Blood")}</th>
              <th className="px-4 py-3">{t("Asuransi", "Insurance")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  {t("Memuat...", "Loading...")}
                </td>
              </tr>
            ) : (
              patients.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-line/50 last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{p.full_name}</td>
                  <td className="px-4 py-3">{age(p.birth_date)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.birth_date?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-muted">{p.city}</td>
                  <td className="px-4 py-3">{p.blood_type}</td>
                  <td className="px-4 py-3 text-muted">
                    {p.insurance}{" "}
                    <span className="font-mono text-xs">{p.insurance_no}</span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-muted">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-full border border-line bg-surface px-4 py-1.5 disabled:opacity-40"
        >
          {t("Sebelumnya", "Previous")}
        </button>
        <span>
          {t("Halaman", "Page")} {page} / {Math.max(1, Math.ceil(total / 25))}
        </span>
        <button
          disabled={page >= Math.ceil(total / 25)}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-full border border-line bg-surface px-4 py-1.5 disabled:opacity-40"
        >
          {t("Berikutnya", "Next")}
        </button>
      </div>
    </div>
  );
}
