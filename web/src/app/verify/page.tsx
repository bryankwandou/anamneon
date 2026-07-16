"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, PulseLine } from "@/components/motion";

type Detail = {
  id: string;
  diagnosisLabel: string;
  hubName: string;
  visitDate: string | null;
  recomputedHash: string;
  storedHash: string;
  hashMatchesDb: boolean;
  onChain: boolean;
  anchorSig: string | null;
  anchorSlot: number | null;
  explorer: string | null;
  status: string;
};

function VerifyInner() {
  const params = useSearchParams();
  const [id, setId] = useState(params.get("id") ?? "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ verified: boolean; detail: Detail } | null>(null);
  const [error, setError] = useState("");

  const run = useCallback(async (recordId: string) => {
    if (!recordId.trim()) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/verify?id=${encodeURIComponent(recordId.trim())}`);
      const j = await res.json();
      if (j.ok) setResult(j);
      else setError(j.error || "verifikasi gagal");
    } catch {
      setError("verifikasi gagal, coba lagi");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const q = params.get("id");
    if (q) run(q);
  }, [params, run]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-accent">Verifikasi publik</p>
        <h1 className="font-display mt-2 text-3xl md:text-4xl">
          Buktikan sebuah riwayat itu asli.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Tempel ID rekord. Sistem menghitung ulang sidik jari dari isi
          terenkripsi, lalu mencocokkannya dengan transaksi memo di Solana
          devnet. Dua-duanya harus cocok — kalau tidak, rekord itu pernah diubah.
        </p>
      </FadeUp>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(id);
        }}
        className="mt-8 flex gap-3"
      >
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID rekord, mis. 3f2a9c1e-..."
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {busy ? "Memeriksa..." : "Periksa"}
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={
              result.verified
                ? "mt-8 rounded-2xl border border-accent/50 bg-surface p-7"
                : "mt-8 rounded-2xl border border-danger/50 bg-surface p-7"
            }
          >
            <div className="flex items-center gap-4">
              <PulseLine
                className={
                  result.verified ? "h-8 w-28 text-accent" : "h-8 w-28 text-danger"
                }
              />
              <p
                className={
                  result.verified
                    ? "font-display text-2xl text-accent"
                    : "font-display text-2xl text-danger"
                }
              >
                {result.verified ? "Asli dan belum pernah diubah" : "Tidak terverifikasi"}
              </p>
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              <Row k="Diagnosa" v={result.detail.diagnosisLabel} />
              <Row k="Fasilitas" v={result.detail.hubName || "-"} />
              <Row k="Tanggal kunjungan" v={result.detail.visitDate?.slice(0, 10) || "-"} />
              <Row
                k="Sidik jari dihitung ulang"
                v={result.detail.recomputedHash}
                mono
              />
              <Row
                k="Cocok dengan database"
                v={result.detail.hashMatchesDb ? "ya" : "tidak"}
              />
              <Row
                k="Ditemukan di Solana devnet"
                v={result.detail.onChain ? "ya" : "tidak"}
              />
              {result.detail.anchorSlot && (
                <Row k="Slot" v={String(result.detail.anchorSlot)} mono />
              )}
              {result.detail.explorer && (
                <div className="flex flex-col gap-1 border-t border-line pt-3 md:flex-row md:justify-between">
                  <dt className="text-muted">Transaksi</dt>
                  <dd>
                    <a
                      href={result.detail.explorer}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all font-mono text-xs text-accent-2 hover:underline"
                    >
                      {result.detail.anchorSig}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-t border-line pt-3 md:flex-row md:justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className={mono ? "break-all font-mono text-xs" : ""}>{v}</dd>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}
