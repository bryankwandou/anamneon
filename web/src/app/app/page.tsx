"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, PulseLine } from "@/components/motion";
import { explorerTx, shortAddr } from "@/lib/solana";
import { useLang } from "@/lib/i18n";

type Rec = {
  id: string;
  hub_name: string;
  diagnosis_label: string;
  visit_date: string | null;
  content_hash: string;
  anchor_sig: string | null;
  pay_mode: string;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const { publicKey } = useWallet();
  const { t } = useLang();
  const [records, setRecords] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/records?wallet=${publicKey.toBase58()}`);
      const j = await res.json();
      if (j.ok) setRecords(j.records);
      else setError(j.error || "gagal memuat");
    } catch {
      setError("gagal memuat rekord");
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    load();
  }, [load]);

  async function summarize() {
    if (!publicKey) return;
    setSummarizing(true);
    setSummary("");
    setError("");
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      });
      const j = await res.json();
      if (j.ok) setSummary(j.summary);
      else setError(j.error || "gagal merangkum");
    } catch {
      setError("gagal merangkum riwayat");
    } finally {
      setSummarizing(false);
    }
  }

  if (!publicKey) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-28 text-center">
        <PulseLine className="mx-auto mb-8 h-12 w-56 text-accent/60" />
        <h1 className="font-display text-3xl md:text-4xl">
          {t("Hubungkan wallet dulu", "Connect a wallet first")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted">
          {t(
            "Rekam jejakmu terikat ke alamat wallet. Pakai Phantom atau Solflare di jaringan devnet, lalu tombol di kanan atas.",
            "Your records are tied to a wallet address. Use Phantom or Solflare on devnet, then the button at the top right."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <FadeUp>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">
              {t("Rekam jejak", "Records")}
            </p>
            <h1 className="font-display mt-2 text-3xl md:text-4xl">
              {t("Riwayat milik", "History of")} {shortAddr(publicKey.toBase58())}
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={summarize}
              disabled={summarizing || records.length === 0}
              className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm transition-colors hover:border-accent/50 disabled:opacity-40"
            >
              {summarizing
                ? t("Merangkum...", "Summarizing...")
                : t("Ringkasan klinis", "Clinical summary")}
            </button>
            <Link
              href="/app/record"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85"
            >
              {t("Catat entri baru", "New entry")}
            </Link>
          </div>
        </div>
      </FadeUp>

      {error && (
        <p className="mt-6 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 overflow-hidden rounded-2xl border border-accent/30 bg-surface"
          >
            <div className="p-6">
              <p className="text-xs uppercase tracking-widest text-accent">
                Ringkasan anamnesis — disusun mesin, ditinjau dokter
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {summary}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10">
        {loading ? (
          <p className="text-sm text-muted">Memuat rekord...</p>
        ) : records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-12 text-center">
            <p className="text-sm text-muted">
              {t(
                "Belum ada entri. Mulai dari tombol Catat entri baru di atas — butuh sedikit SOL devnet dari faucet.solana.com.",
                "No entries yet. Start from the New entry button above — you need a little devnet SOL from faucet.solana.com."
              )}
            </p>
          </div>
        ) : (
          <ol className="relative space-y-4 border-l border-line pl-6">
            {records.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative rounded-2xl border border-line bg-surface p-5"
              >
                <span className="absolute -left-[31px] top-6 h-2.5 w-2.5 rounded-full bg-accent" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{r.diagnosis_label}</p>
                    <p className="mt-1 text-xs text-muted">
                      {r.visit_date?.slice(0, 10) || "-"} · {r.hub_name || "fasilitas tidak dicantumkan"} · bayar {r.pay_mode.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        r.status === "anchored"
                          ? "rounded-full bg-accent/15 px-3 py-1 text-xs text-accent"
                          : "rounded-full bg-surface-2 px-3 py-1 text-xs text-muted"
                      }
                    >
                      {r.status === "anchored"
                        ? t("Terkunci di rantai", "Sealed on-chain")
                        : t("Menunggu anchor", "Awaiting anchor")}
                    </span>
                    {r.anchor_sig && (
                      <a
                        href={explorerTx(r.anchor_sig)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-accent-2 underline-offset-4 hover:underline"
                      >
                        Lihat di explorer
                      </a>
                    )}
                  </div>
                </div>
                <p className="mt-3 break-all font-mono text-[11px] text-muted">
                  sidik jari: {r.content_hash}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  id: {r.id}{" "}
                  <Link href={`/verify?id=${r.id}`} className="text-accent-2 hover:underline">
                    verifikasi
                  </Link>
                </p>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
