"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FadeUp } from "@/components/motion";
import { useLang } from "@/lib/i18n";

export default function LoginPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (j.ok) router.push("/patients");
      else setError(j.error || t("gagal masuk", "login failed"));
    } catch {
      setError(t("gagal masuk, coba lagi", "login failed, try again"));
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
          {t("Masuk", "Log in")}
        </p>
        <h1 className="font-display mt-2 text-3xl">
          {t("Selamat datang kembali", "Welcome back")}
        </h1>
      </FadeUp>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
            {t("Username atau email", "Username or email")}
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
            Password
          </label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className={input}
            autoComplete="current-password"
          />
        </div>
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
          {busy ? t("Memeriksa...", "Checking...") : t("Masuk", "Log in")}
        </button>
        <p className="text-center text-xs text-muted">
          {t("Belum punya akun?", "No account yet?")}{" "}
          <Link href="/register" className="text-accent-2 hover:underline">
            {t("Daftar", "Sign up")}
          </Link>
        </p>
      </form>
    </div>
  );
}
