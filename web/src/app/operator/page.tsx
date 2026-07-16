"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/motion";
import { shortAddr } from "@/lib/solana";

type Hub = {
  id: number;
  name: string;
  city: string;
  kind: string;
  signer_wallet: string;
  created_at: string;
};

const KINDS = [
  ["hospital", "Rumah sakit"],
  ["clinic", "Klinik"],
  ["puskesmas", "Puskesmas"],
  ["lab", "Laboratorium"],
] as const;

export default function OperatorPage() {
  const { publicKey } = useWallet();
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [form, setForm] = useState({ name: "", city: "", kind: "clinic" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const r = await fetch("/api/hubs");
      const j = await r.json();
      if (j.ok) setHubs(j.hubs);
    } catch {}
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!publicKey) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch("/api/hubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, signerWallet: publicKey.toBase58() }),
      });
      const j = await res.json();
      if (j.ok) {
        setMsg(`${j.hub.name} terdaftar.`);
        setForm({ name: "", city: "", kind: "clinic" });
        load();
      } else setError(j.error || "gagal mendaftar");
    } catch {
      setError("gagal mendaftar fasilitas");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-accent">Konsol operator</p>
        <h1 className="font-display mt-2 text-3xl md:text-4xl">
          Daftarkan fasilitas kesehatan
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Setiap fasilitas punya wallet penandatangan sendiri. Entri riwayat
          yang diterbitkan atas nama fasilitas itu bisa dilacak balik ke sini.
        </p>
      </FadeUp>

      <div className="mt-10 grid gap-8 md:grid-cols-5">
        <form onSubmit={submit} className="space-y-4 md:col-span-2">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
              Nama fasilitas
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="RSUD Labuang Baji"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
              Kota
            </label>
            <input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="Makassar"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
              Jenis
            </label>
            <div className="flex flex-wrap gap-2">
              {KINDS.map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, kind: v }))}
                  className={
                    form.kind === v
                      ? "rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-xs text-accent"
                      : "rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted hover:border-accent/40"
                  }
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface px-4 py-3 text-xs text-muted">
            Wallet penandatangan:{" "}
            {publicKey ? (
              <span className="font-mono text-foreground">
                {shortAddr(publicKey.toBase58(), 6)}
              </span>
            ) : (
              "hubungkan wallet dulu"
            )}
          </div>
          {msg && <p className="text-sm text-accent">{msg}</p>}
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={!publicKey || busy}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            {busy ? "Mendaftarkan..." : "Daftarkan fasilitas"}
          </button>
        </form>

        <div className="md:col-span-3">
          <p className="mb-3 text-xs uppercase tracking-widest text-muted">
            Fasilitas terdaftar ({hubs.length})
          </p>
          <div className="space-y-3">
            {hubs.length === 0 && (
              <p className="rounded-xl border border-dashed border-line p-6 text-sm text-muted">
                Belum ada fasilitas. Jadilah yang pertama.
              </p>
            )}
            {hubs.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold">{h.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {h.city || "-"} · {KINDS.find(([v]) => v === h.kind)?.[1] ?? h.kind}
                  </p>
                </div>
                <p className="font-mono text-xs text-muted">{shortAddr(h.signer_wallet)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
