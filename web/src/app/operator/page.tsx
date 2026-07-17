"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/motion";
import { shortAddr } from "@/lib/solana";
import { useLang } from "@/lib/i18n";
import { HOSPITALS, DIRECTORY_NOTE_ID, DIRECTORY_NOTE_EN } from "@/data/hospitals";

type Hub = {
  id: number;
  name: string;
  city: string;
  kind: string;
  signer_wallet: string;
  created_at: string;
};

export default function OperatorPage() {
  const { publicKey } = useWallet();
  const { t, lang } = useLang();
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [form, setForm] = useState({ name: "", city: "", kind: "hospital" });
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const KINDS = [
    ["hospital", t("Rumah sakit", "Hospital")],
    ["clinic", t("Klinik", "Clinic")],
    ["puskesmas", t("Puskesmas", "Community health center")],
    ["lab", t("Laboratorium", "Laboratory")],
  ] as const;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HOSPITALS.slice(0, 12);
    return HOSPITALS.filter(
      (h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

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
        setMsg(t(`${j.hub.name} terdaftar.`, `${j.hub.name} registered.`));
        setForm({ name: "", city: "", kind: "hospital" });
        load();
      } else setError(j.error || t("gagal mendaftar", "registration failed"));
    } catch {
      setError(t("gagal mendaftar fasilitas", "failed to register the facility"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14" key={lang}>
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-accent">
          {t("Konsol operator", "Operator console")}
        </p>
        <h1 className="font-display mt-2 text-3xl md:text-4xl">
          {t("Daftarkan fasilitas kesehatan", "Register a health facility")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {t(
            "Cari fasilitasmu di direktori resmi, atau isi manual kalau belum tercantum. Setiap fasilitas punya wallet penandatangan sendiri sehingga entri riwayat bisa dilacak balik ke penerbitnya.",
            "Find your facility in the official directory, or fill it in manually if it is not listed. Each facility has its own signing wallet so every record entry can be traced back to its issuer."
          )}
        </p>
      </FadeUp>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-muted">
            {t("Direktori fasilitas Indonesia", "Indonesian facility directory")} ({HOSPITALS.length}+)
          </p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Cari nama RS atau kota...", "Search hospital name or city...")}
            className="mb-3 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
            {filtered.map((h, i) => (
              <motion.button
                key={h.name}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setForm({ name: h.name, city: h.city, kind: h.kind })}
                className={
                  form.name === h.name
                    ? "flex w-full items-center justify-between rounded-xl border border-accent bg-accent/10 px-4 py-3 text-left"
                    : "flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-left transition-colors hover:border-accent/40"
                }
              >
                <span>
                  <span className="block text-sm">{h.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">{h.city}</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted">
                  {KINDS.find(([v]) => v === h.kind)?.[1]}
                </span>
              </motion.button>
            ))}
            {filtered.length === 0 && (
              <p className="rounded-xl border border-dashed border-line p-4 text-xs text-muted">
                {t(
                  "Tidak ketemu — isi manual di formulir sebelah.",
                  "Not found — fill it in manually on the form."
                )}
              </p>
            )}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            {t(DIRECTORY_NOTE_ID, DIRECTORY_NOTE_EN)}
          </p>
        </div>

        <div className="space-y-8">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
                {t("Nama fasilitas", "Facility name")}
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
                {t("Kota", "City")}
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
                {t("Jenis", "Type")}
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
              {t("Wallet penandatangan", "Signing wallet")}:{" "}
              {publicKey ? (
                <span className="font-mono text-foreground">
                  {shortAddr(publicKey.toBase58(), 6)}
                </span>
              ) : (
                t("hubungkan wallet dulu", "connect a wallet first")
              )}
            </div>
            {msg && <p className="text-sm text-accent">{msg}</p>}
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={!publicKey || busy}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {busy
                ? t("Mendaftarkan...", "Registering...")
                : t("Daftarkan fasilitas", "Register facility")}
            </button>
          </form>

          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-muted">
              {t("Terdaftar di jaringan", "Registered on the network")} ({hubs.length})
            </p>
            <div className="max-h-[240px] space-y-3 overflow-y-auto pr-1">
              {hubs.length === 0 && (
                <p className="rounded-xl border border-dashed border-line p-5 text-sm text-muted">
                  {t("Belum ada fasilitas terdaftar.", "No facilities registered yet.")}
                </p>
              )}
              {hubs.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-semibold">{h.name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {h.city || "-"} · {KINDS.find(([v]) => v === h.kind)?.[1] ?? h.kind}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-muted">{shortAddr(h.signer_wallet)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
