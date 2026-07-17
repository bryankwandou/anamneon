"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Buffer } from "buffer";
import {
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { FadeUp } from "@/components/motion";
import { useLang } from "@/lib/i18n";
import { HOSPITALS } from "@/data/hospitals";
import {
  MEMO_PROGRAM_ID,
  MEMO_PREFIX,
  TREASURY,
  USDC_DEV_MINT,
  RECORD_FEE_SOL,
  RECORD_FEE_USDC,
  explorerTx,
} from "@/lib/solana";

type Hub = { id: number; name: string; city: string };

export default function RecordPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { t } = useLang();

  const [hubs, setHubs] = useState<Hub[]>([]);
  const [form, setForm] = useState({
    hubName: "",
    visitDate: new Date().toISOString().slice(0, 10),
    complaint: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
  });
  const [payMode, setPayMode] = useState<"sol" | "usdc">("sol");
  const [step, setStep] = useState<"form" | "signing" | "confirming" | "done">("form");
  const [sig, setSig] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/hubs")
      .then((r) => r.json())
      .then((j) => j.ok && setHubs(j.hubs))
      .catch(() => {});
  }, []);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!publicKey) return;
    setError("");
    setStep("signing");
    try {
      // 1) Store the encrypted record, get back its fingerprint
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientWallet: publicKey.toBase58(),
          payMode,
          ...form,
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "gagal menyimpan rekord");
      const { id, hash } = j as { id: string; hash: string };

      // 2) One transaction: issuance fee (SOL or USDC) + memo carrying the hash
      const tx = new Transaction();
      if (payMode === "sol") {
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: TREASURY,
            lamports: Math.round(RECORD_FEE_SOL * LAMPORTS_PER_SOL),
          })
        );
      } else {
        const from = getAssociatedTokenAddressSync(USDC_DEV_MINT, publicKey);
        const to = getAssociatedTokenAddressSync(USDC_DEV_MINT, TREASURY);
        tx.add(
          createAssociatedTokenAccountIdempotentInstruction(
            publicKey,
            to,
            TREASURY,
            USDC_DEV_MINT
          ),
          createTransferInstruction(
            from,
            to,
            publicKey,
            Math.round(RECORD_FEE_USDC * 1_000_000)
          )
        );
      }
      tx.add(
        new TransactionInstruction({
          programId: MEMO_PROGRAM_ID,
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
          data: Buffer.from(MEMO_PREFIX + hash, "utf8"),
        })
      );

      const signature = await sendTransaction(tx, connection);
      setSig(signature);
      setStep("confirming");
      const latest = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature, ...latest }, "confirmed");

      // 3) Tell the server to verify the memo and mark the record anchored
      const res2 = await fetch("/api/records/anchor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, signature, paySig: signature }),
      });
      const j2 = await res2.json();
      if (!j2.ok) throw new Error(j2.error || "gagal mengunci rekord");
      setStep("done");
      setTimeout(() => router.push("/app"), 2600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "transaksi gagal");
      setStep("form");
    }
  }

  if (!publicKey) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-28 text-center">
        <h1 className="font-display text-3xl">Hubungkan wallet dulu</h1>
        <p className="mt-3 text-sm text-muted">
          Entri riwayat ditandatangani wallet-mu sendiri di devnet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-accent">
          {t("Entri baru", "New entry")}
        </p>
        <h1 className="font-display mt-2 text-3xl md:text-4xl">
          {t("Catat satu kunjungan", "Record one visit")}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {t(
            "Isinya dienkripsi sebelum disimpan. Yang naik ke Solana hanya sidik jari SHA-256-nya, dibawa transaksi memo yang kamu tanda tangani sendiri.",
            "The content is encrypted before storage. Only its SHA-256 fingerprint goes to Solana, carried by a memo transaction you sign yourself."
          )}
        </p>
      </FadeUp>

      {step === "done" ? (
        <div className="mt-10 rounded-2xl border border-accent/40 bg-surface p-8 text-center">
          <p className="font-display text-2xl text-accent">Terkunci di devnet.</p>
          <a
            href={explorerTx(sig)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block break-all font-mono text-xs text-accent-2 hover:underline"
          >
            {sig}
          </a>
          <p className="mt-4 text-sm text-muted">Mengalihkan ke rekam jejak...</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-10 space-y-5">
          <Field label="Fasilitas kesehatan">
            <input
              list="hubs"
              value={form.hubName}
              onChange={(e) => set("hubName", e.target.value)}
              placeholder="RS / klinik / puskesmas"
              className="input"
            />
            <datalist id="hubs">
              {hubs.map((h) => (
                <option key={`hub-${h.id}`} value={h.name}>{h.city}</option>
              ))}
              {HOSPITALS.map((h) => (
                <option key={h.name} value={h.name}>{h.city}</option>
              ))}
            </datalist>
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Tanggal kunjungan" required>
              <input
                type="date"
                required
                value={form.visitDate}
                onChange={(e) => set("visitDate", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Diagnosa" required>
              <input
                required
                value={form.diagnosis}
                onChange={(e) => set("diagnosis", e.target.value)}
                placeholder="mis. Demam berdarah dengue"
                className="input"
              />
            </Field>
          </div>
          <Field label="Keluhan utama">
            <input
              value={form.complaint}
              onChange={(e) => set("complaint", e.target.value)}
              placeholder="apa yang dirasakan pasien"
              className="input"
            />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Tindakan">
              <input
                value={form.treatment}
                onChange={(e) => set("treatment", e.target.value)}
                placeholder="mis. rawat inap 3 hari"
                className="input"
              />
            </Field>
            <Field label="Resep">
              <input
                value={form.prescription}
                onChange={(e) => set("prescription", e.target.value)}
                placeholder="obat yang diberikan"
                className="input"
              />
            </Field>
          </div>
          <Field label="Catatan tambahan">
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              className="input resize-none"
            />
          </Field>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted">
              Biaya penerbitan
            </p>
            <div className="flex gap-3">
              {(
                [
                  ["sol", `${RECORD_FEE_SOL} SOL`],
                  ["usdc", `${RECORD_FEE_USDC} USDC (devnet)`],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPayMode(mode)}
                  className={
                    payMode === mode
                      ? "rounded-full border border-accent bg-accent/15 px-5 py-2 text-sm text-accent"
                      : "rounded-full border border-line bg-surface px-5 py-2 text-sm text-muted hover:border-accent/40"
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={step !== "form"}
              className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {step === "signing"
                ? t("Menunggu tanda tangan...", "Waiting for signature...")
                : step === "confirming"
                ? t("Menunggu konfirmasi devnet...", "Waiting for devnet confirmation...")
                : t("Enkripsi, bayar, dan kunci di Solana", "Encrypt, pay, and seal on Solana")}
            </button>
            <Link href="/app" className="text-sm text-muted hover:text-foreground">
              Batal
            </Link>
          </div>
        </form>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--line);
          background: var(--surface);
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: var(--accent);
        }
        .input::placeholder {
          color: var(--muted);
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </label>
  );
}
