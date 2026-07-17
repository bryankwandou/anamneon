"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, PulseLine } from "@/components/motion";
import { useLang } from "@/lib/i18n";

const DEMO_RECORD_ID = "5df21745-a4d2-494d-bb19-d70d4d70bb46";
const DEMO_TX =
  "245HWh9D2tCmjByVm94nNLFkL1vcB4frGa5fsVX8RjxJ9vTyTYy17YtYmwCJHkGr1xEughHTzsFRLErqVMsdc1PD";

type VerifyDetail = {
  recomputedHash: string;
  storedHash: string;
  hashMatchesDb: boolean;
  onChain: boolean;
  anchorSlot: number | null;
  explorer: string | null;
  diagnosisLabel: string;
  hubName: string;
  visitDate: string | null;
};

export default function DemoPage() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(0);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ verified: boolean; detail: VerifyDetail } | null>(null);
  const [error, setError] = useState("");

  const steps = [
    {
      title: t("Entri riwayat diisi", "A record entry is filed"),
      body: t(
        "Rumah sakit mencatat satu kunjungan nyata: pasien datang dengan demam tinggi tiga hari, didiagnosa demam berdarah dengue grade I, dirawat inap tiga hari. Entri ini sudah benar-benar dibuat di sistem ini — bukan tiruan tampilan.",
        "A hospital files one real visit: the patient arrives with a three-day high fever, is diagnosed with dengue fever grade I, and is hospitalized for three days. This entry was genuinely created in this system — not a mock screen."
      ),
      code: `POST /api/records\n{\n  "diagnosis": "Demam berdarah dengue grade I",\n  "visitDate": "2026-07-16",\n  "treatment": "rawat inap 3 hari, infus RL"\n}`,
    },
    {
      title: t("Isi dienkripsi, sidik jari dihitung", "Content encrypted, fingerprint computed"),
      body: t(
        "Sebelum disimpan, seluruh isi entri dienkripsi AES-256-GCM. Dari isi aslinya dihitung sidik jari SHA-256 — 64 karakter yang berubah total kalau satu huruf saja diedit.",
        "Before storage, the full entry is encrypted with AES-256-GCM. From the original content a SHA-256 fingerprint is computed — 64 characters that change completely if even one letter is edited."
      ),
      code: `sha256(entry) =\n7f0875a9d224f64257654960df5fb091\n1233136654d53d438e03182c70414964`,
    },
    {
      title: t("Sidik jari ditanam di Solana", "Fingerprint anchored on Solana"),
      body: t(
        "Sidik jari dikirim sebagai transaksi memo di Solana devnet, satu paket dengan biaya penerbitan 0.001 SOL. Transaksinya publik — klik dan lihat sendiri memo ANAMNEON:v1 di explorer.",
        "The fingerprint goes out as a memo transaction on Solana devnet, bundled with the 0.001 SOL issuance fee. The transaction is public — click through and see the ANAMNEON:v1 memo on the explorer yourself."
      ),
      code: `Memo: ANAMNEON:v1:7f0875a9...70414964\nSlot: 476645391`,
      link: {
        href: `https://explorer.solana.com/tx/${DEMO_TX}?cluster=devnet`,
        label: t("Buka transaksinya di explorer", "Open the transaction on the explorer"),
      },
    },
    {
      title: t("Verifikasi langsung, sekarang", "Verify it live, right now"),
      body: t(
        "Tombol di bawah memanggil API verifikasi sungguhan: server menghitung ulang sidik jari dari data terenkripsi, lalu menariknya dari devnet dan membandingkan keduanya di depan matamu.",
        "The button below calls the real verification API: the server recomputes the fingerprint from the encrypted data, then pulls the transaction from devnet and compares the two in front of you."
      ),
    },
  ];

  async function runVerify() {
    setChecking(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/verify?id=${DEMO_RECORD_ID}`);
      const j = await res.json();
      if (j.ok) setResult(j);
      else setError(j.error || "verification failed");
    } catch {
      setError(t("Gagal menghubungi server, coba lagi.", "Could not reach the server, try again."));
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14" key={lang}>
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-accent">
          {t("Demo alur lengkap", "Full workflow demo")}
        </p>
        <h1 className="font-display mt-2 text-3xl md:text-4xl">
          {t(
            "Empat langkah, semuanya sungguhan.",
            "Four steps, all of them real."
          )}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {t(
            "Demo ini tidak butuh wallet. Rekord yang dipakai benar-benar tersimpan terenkripsi di database dan sidik jarinya benar-benar ada di Solana devnet.",
            "This demo needs no wallet. The record used here is genuinely stored encrypted in the database, and its fingerprint genuinely sits on Solana devnet."
          )}
        </p>
      </FadeUp>

      <div className="mt-10 space-y-3">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={
              step === i
                ? "rounded-2xl border border-accent/50 bg-surface"
                : "rounded-2xl border border-line bg-surface/50"
            }
          >
            <button
              onClick={() => setStep(i)}
              className="flex w-full items-center gap-4 px-6 py-4 text-left"
            >
              <span
                className={
                  step >= i
                    ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-sm font-bold text-[#04211d]"
                    : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line font-mono text-sm text-muted"
                }
              >
                {i + 1}
              </span>
              <span className={step === i ? "font-semibold" : "text-muted"}>{s.title}</span>
            </button>
            <AnimatePresence initial={false}>
              {step === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 px-6 pb-6 pl-[72px]">
                    <p className="text-sm leading-relaxed text-muted">{s.body}</p>
                    {s.code && (
                      <pre className="overflow-x-auto rounded-xl border border-line bg-background p-4 font-mono text-xs leading-relaxed text-accent-2">
                        {s.code}
                      </pre>
                    )}
                    {s.link && (
                      <a
                        href={s.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-sm text-accent-2 underline-offset-4 hover:underline"
                      >
                        {s.link.label}
                      </a>
                    )}
                    {i === 3 && (
                      <div>
                        <button
                          onClick={runVerify}
                          disabled={checking}
                          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85 disabled:opacity-50"
                        >
                          {checking
                            ? t("Memeriksa ke devnet...", "Checking against devnet...")
                            : t("Jalankan verifikasi sungguhan", "Run the real verification")}
                        </button>
                        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
                        <AnimatePresence>
                          {result && (
                            <motion.div
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className={
                                result.verified
                                  ? "mt-4 rounded-xl border border-accent/50 bg-background p-5"
                                  : "mt-4 rounded-xl border border-danger/50 bg-background p-5"
                              }
                            >
                              <div className="flex items-center gap-3">
                                <PulseLine
                                  className={
                                    result.verified ? "h-6 w-20 text-accent" : "h-6 w-20 text-danger"
                                  }
                                />
                                <p
                                  className={
                                    result.verified
                                      ? "font-display text-lg text-accent"
                                      : "font-display text-lg text-danger"
                                  }
                                >
                                  {result.verified
                                    ? t("Asli dan belum pernah diubah", "Genuine and never altered")
                                    : t("Tidak terverifikasi", "Not verified")}
                                </p>
                              </div>
                              <dl className="mt-4 space-y-2 text-xs text-muted">
                                <div className="flex justify-between gap-4">
                                  <dt>{t("Cocok dengan database", "Matches database")}</dt>
                                  <dd className="text-foreground">
                                    {result.detail.hashMatchesDb ? t("ya", "yes") : t("tidak", "no")}
                                  </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt>{t("Ditemukan di devnet", "Found on devnet")}</dt>
                                  <dd className="text-foreground">
                                    {result.detail.onChain ? t("ya", "yes") : t("tidak", "no")}
                                  </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt>Slot</dt>
                                  <dd className="font-mono text-foreground">{result.detail.anchorSlot}</dd>
                                </div>
                                <div className="break-all font-mono text-[10px]">
                                  {result.detail.recomputedHash}
                                </div>
                              </dl>
                              {result.detail.explorer && (
                                <a
                                  href={result.detail.explorer}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 inline-block text-xs text-accent-2 underline-offset-4 hover:underline"
                                >
                                  {t("Lihat transaksinya di explorer", "See the transaction on the explorer")}
                                </a>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    {i < 3 && (
                      <button
                        onClick={() => setStep(i + 1)}
                        className="rounded-full border border-line bg-background px-5 py-2 text-sm text-foreground transition-colors hover:border-accent/50"
                      >
                        {t("Lanjut", "Next")}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <FadeUp className="mt-10 rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
        {t(
          "Mau mencoba alur penuhnya dengan wallet sendiri? Hubungkan Phantom atau Solflare di jaringan devnet, ambil SOL gratis dari faucet.solana.com, lalu terbitkan entrimu di halaman Rekam Jejak.",
          "Want the full flow with your own wallet? Connect Phantom or Solflare on devnet, grab free SOL from faucet.solana.com, then issue your own entry on the Records page."
        )}{" "}
        <Link href="/app" className="text-accent-2 hover:underline">
          {t("Buka Rekam Jejak", "Open Records")}
        </Link>
      </FadeUp>
    </div>
  );
}
