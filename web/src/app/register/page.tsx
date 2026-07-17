"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FadeUp } from "@/components/motion";
import { useLang } from "@/lib/i18n";

export default function RegisterPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (j.ok) router.push("/patients");
      else setError(j.error || t("pendaftaran gagal", "registration failed"));
    } catch {
      setError(t("pendaftaran gagal, coba lagi", "registration failed, try again"));
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent";

  return (
    <div className="mx-auto max-w-md px-5 py-16" key={lang}>
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-accent">
          {t("Buat akun", "Create account")}
        </p>
        <h1 className="font-display mt-2 text-3xl">
          {t("Daftar ke Anamneon", "Join Anamneon")}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {t(
            "Akun dipakai untuk mengakses direktori pasien. Password disimpan sebagai hash scrypt dengan salt acak — tidak pernah dalam bentuk aslinya.",
            "An account grants access to the patient directory. Passwords are stored as scrypt hashes with random salts — never in their original form."
          )}
        </p>
      </FadeUp>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
            Username
          </label>
          <input
            required
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            className={input}
            autoComplete="username"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={input}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
            Password
          </label>
          <input
            required
            type="password"
            minLength={10}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className={input}
            autoComplete="new-password"
          />
          <p className="mt-1 text-[11px] text-muted">
            {t("Minimal 10 karakter.", "At least 10 characters.")}
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
            {t("Konfirmasi password", "Confirm password")}
          </label>
          <input
            required
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            className={input}
            autoComplete="new-password"
          />
        </div>
        <label className="flex items-start gap-3 text-xs leading-relaxed text-muted">
          <input
            type="checkbox"
            required
            checked={form.acceptTerms}
            onChange={(e) => setForm((f) => ({ ...f, acceptTerms: e.target.checked }))}
            className="mt-0.5 h-4 w-4 accent-[#2dd4bf]"
          />
          <span>
            {t(
              "Saya menyetujui syarat & ketentuan serta kebijakan privasi: data pasien yang tampil hanya identitas umum dari dataset demo sintetis; riwayat medis tetap terenkripsi dan tidak pernah dibuka tanpa izin pemiliknya.",
              "I agree to the terms & privacy policy: patient data shown is general identity only, drawn from a synthetic demo dataset; medical histories stay encrypted and are never opened without their owner's consent."
            )}
          </span>
        </label>
        {error && (
          <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {busy ? t("Mendaftarkan...", "Creating account...") : t("Daftar", "Sign up")}
        </button>
        <p className="text-center text-xs text-muted">
          {t("Sudah punya akun?", "Already have an account?")}{" "}
          <Link href="/login" className="text-accent-2 hover:underline">
            {t("Masuk", "Log in")}
          </Link>
        </p>
      </form>
    </div>
  );
}
