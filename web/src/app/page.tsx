"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  TextReveal,
  FadeUp,
  Counter,
  Marquee,
  PulseLine,
  TiltCard,
  ParallaxDrift,
  GlowOrb,
} from "@/components/motion";
import { Link001 } from "@/components/ui/skiper-ui/skiper40";
import { useLang } from "@/lib/i18n";

const TX_SOL =
  "https://explorer.solana.com/tx/245HWh9D2tCmjByVm94nNLFkL1vcB4frGa5fsVX8RjxJ9vTyTYy17YtYmwCJHkGr1xEughHTzsFRLErqVMsdc1PD?cluster=devnet";
const TX_USDC =
  "https://explorer.solana.com/tx/3ssXWXFpLh9KJBiox8kdZGWdfkTEitrx9b3HSkTzZHjaJBeNFBtidmVZEkp34qgW5ixirQscStoLXexeoHMFbTax?cluster=devnet";

export default function Landing() {
  const { t, lang } = useLang();

  const problems = [
    {
      n: "01",
      t: t("Pindah kota, riwayat hilang", "Move cities, lose your history"),
      d: t(
        "Pasien yang berobat di tiga rumah sakit berbeda praktis punya tiga riwayat yang tidak saling kenal. Dokter baru mulai lagi dari nol, pemeriksaan diulang, biaya membengkak.",
        "A patient treated at three different hospitals effectively has three histories that never meet. Each new doctor starts from zero, tests get repeated, costs pile up."
      ),
    },
    {
      n: "02",
      t: t("Riwayat bisa dipalsukan", "Histories can be forged"),
      d: t(
        "Surat keterangan sehat, klaim asuransi, medical check-up kerja — semuanya bergantung pada dokumen yang bisa diedit siapa pun yang memegang berkasnya.",
        "Health certificates, insurance claims, pre-employment checkups — all rest on documents that anyone holding the file can edit."
      ),
    },
    {
      n: "03",
      t: t("Database terpusat bisa disunting diam-diam", "Central databases can be quietly rewritten"),
      d: t(
        "Selama data hanya hidup di satu server, tidak ada cara bagi pasien membuktikan riwayatnya belum pernah diubah sejak pertama dicatat.",
        "As long as the data lives on a single server, a patient has no way to prove their record has never been altered since it was first written."
      ),
    },
  ];

  const steps = [
    {
      s: t("Langkah 1", "Step 1"),
      t: t("Catat", "Record"),
      d: t(
        "Fasilitas kesehatan mengisi entri riwayat: keluhan, diagnosa, tindakan, resep.",
        "The health facility files an entry: complaint, diagnosis, treatment, prescription."
      ),
    },
    {
      s: t("Langkah 2", "Step 2"),
      t: t("Kunci", "Seal"),
      d: t(
        "Entri dienkripsi AES-256-GCM, lalu sidik jari SHA-256-nya dihitung dari isi aslinya.",
        "The entry is encrypted with AES-256-GCM, then its SHA-256 fingerprint is computed from the original content."
      ),
    },
    {
      s: t("Langkah 3", "Step 3"),
      t: t("Tanam di Solana", "Anchor on Solana"),
      d: t(
        "Sidik jari dikirim sebagai transaksi memo di devnet, ditandatangani wallet penerbit. Biayanya bisa dibayar SOL atau USDC.",
        "The fingerprint goes out as a memo transaction on devnet, signed by the issuer's wallet. The fee can be paid in SOL or USDC."
      ),
    },
    {
      s: t("Langkah 4", "Step 4"),
      t: t("Buktikan kapan saja", "Prove it anytime"),
      d: t(
        "Siapa pun yang diberi akses bisa menghitung ulang sidik jari dan mencocokkannya dengan transaksi di rantai.",
        "Anyone with access can recompute the fingerprint and match it against the on-chain transaction."
      ),
    },
  ];

  const audiences = [
    {
      t: t("Pasien", "Patients"),
      d: t(
        "Riwayatmu ikut ke mana pun kamu pindah. Kamu yang memegang kuncinya, bukan rumah sakit.",
        "Your history follows you wherever you go. You hold the key, not the hospital."
      ),
    },
    {
      t: t("Dokter & rumah sakit", "Doctors & hospitals"),
      d: t(
        "Anamnesis pasien baru tidak lagi mulai dari ingatan kosong. Riwayat lama terbukti asli, ringkasan klinisnya disiapkan mesin.",
        "Intake for a new patient no longer starts from a blank memory. Past records are provably genuine, with a machine-drafted clinical summary."
      ),
    },
    {
      t: t("Asuransi & pemberi kerja", "Insurers & employers"),
      d: t(
        "Klaim dan surat keterangan bisa dicek keasliannya langsung ke rantai, tanpa menelepon rumah sakit satu per satu.",
        "Claims and certificates can be checked against the chain directly, without calling hospitals one by one."
      ),
    },
  ];

  return (
    <div className="relative overflow-hidden" key={lang}>
      <GlowOrb className="left-[-10%] top-[-5%] h-[420px] w-[420px] bg-accent/20" />
      <GlowOrb className="right-[-12%] top-[30%] h-[480px] w-[480px] bg-accent-2/15" />

      {/* HERO */}
      <section className="grid-lines relative">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-24 md:pt-32">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-6 inline-block rounded-full border border-line bg-surface px-4 py-1.5 text-xs uppercase tracking-widest text-muted"
          >
            {t(
              "Berjalan di Solana Devnet — semua bukti bisa dicek sendiri",
              "Running on Solana Devnet — every claim is independently checkable"
            )}
          </motion.p>
          <h1 className="font-display max-w-4xl text-4xl leading-[1.08] tracking-tight md:text-7xl">
            <TextReveal text={t("Riwayat penyakit yang", "A medical history that")} />
            <br />
            <TextReveal
              text={t("tidak bisa dipalsukan.", "cannot be forged.")}
              className="text-accent"
              delay={0.35}
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-7 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
          >
            {t(
              "Setiap entri riwayat pasien dikunci sidik jarinya di blockchain Solana. Data medisnya sendiri tetap terenkripsi dan tidak pernah menyentuh jaringan publik. Hasilnya: dokter, rumah sakit, dan asuransi bisa membuktikan sebuah riwayat asli dalam hitungan detik — tanpa perlu saling percaya lebih dulu.",
              "Every patient record entry has its fingerprint sealed on the Solana blockchain. The medical data itself stays encrypted and never touches the public network. The result: doctors, hospitals, and insurers can prove a history is genuine in seconds — with no prior trust required."
            )}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              href="/demo"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85"
            >
              {t("Lihat demo alurnya", "Watch the flow demo")}
            </Link>
            <Link
              href="/app"
              className="rounded-full border border-line bg-surface px-6 py-3 text-sm text-foreground transition-colors hover:border-accent/50"
            >
              {t("Buka rekam jejak saya", "Open my records")}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.7 }}
            className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted"
          >
            <Link001 href={TX_SOL}>
              {t("Bukti transaksi SOL di devnet", "SOL transaction proof on devnet")}
            </Link001>
            <Link001 href={TX_USDC}>
              {t("Bukti transaksi USDC di devnet", "USDC transaction proof on devnet")}
            </Link001>
            <Link001 href="https://github.com/bryankwandou/anamneon">
              {t("Kode terbuka di GitHub", "Open source on GitHub")}
            </Link001>
          </motion.div>
          <ParallaxDrift distance={30} className="mt-14">
            <PulseLine className="h-16 w-full text-accent/70 md:h-20" />
          </ParallaxDrift>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-line bg-surface py-4">
        <Marquee duration={26} className="text-xs uppercase tracking-[0.25em] text-muted">
          {[
            t("Hash on-chain, data off-chain", "Hash on-chain, data off-chain"),
            t("Enkripsi AES-256-GCM", "AES-256-GCM encryption"),
            t("Memo program Solana", "Solana memo program"),
            t("Verifikasi tanpa izin pihak ketiga", "Verification without third-party permission"),
            t("Biaya penerbitan: SOL atau USDC", "Issuance fee: SOL or USDC"),
            t("Neon Postgres serverless", "Neon Postgres serverless"),
          ].map((txt) => (
            <span key={txt} className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {txt}
            </span>
          ))}
        </Marquee>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <FadeUp>
          <p className="text-xs uppercase tracking-widest text-accent">
            {t("Masalahnya nyata", "The problem is real")}
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl leading-tight md:text-5xl">
            {t(
              "Rekam medis kita tersebar, gampang hilang, dan gampang diubah.",
              "Our medical records are scattered, easy to lose, and easy to alter."
            )}
          </h2>
        </FadeUp>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {problems.map((c, i) => (
            <FadeUp key={c.n} delay={i * 0.12}>
              <TiltCard className="h-full rounded-2xl border border-line bg-surface p-7">
                <p className="font-mono text-xs text-accent">{c.n}</p>
                <h3 className="mt-3 text-lg font-semibold">{c.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.d}</p>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-line bg-surface/50">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <FadeUp>
            <p className="text-xs uppercase tracking-widest text-accent">
              {t("Cara kerjanya", "How it works")}
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl leading-tight md:text-5xl">
              {t(
                "Sidik jari di rantai, isi tetap rahasia.",
                "Fingerprint on the chain, content stays private."
              )}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              {t(
                "Kami tidak menaruh data medis di blockchain — itu melanggar privasi dan tidak bisa dihapus. Yang dikunci di Solana hanyalah sidik jari kriptografis (SHA-256) dari tiap entri. Isi lengkapnya dienkripsi dan disimpan terpisah. Ubah satu huruf saja pada rekord, sidik jarinya tidak akan cocok lagi dengan yang ada di rantai.",
                "We never put medical data on the blockchain — that violates privacy and can never be erased. What gets sealed on Solana is only the cryptographic fingerprint (SHA-256) of each entry. The full content is encrypted and stored separately. Change a single letter in the record and its fingerprint no longer matches the chain."
              )}
            </p>
          </FadeUp>
          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {steps.map((c, i) => (
              <FadeUp key={c.s} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-line bg-background p-6">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{c.s}</p>
                  <h3 className="mt-2 text-lg font-semibold text-accent">{c.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{c.d}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-8 rounded-3xl border border-line bg-surface p-10 md:grid-cols-4">
          {[
            { v: 256, s: "-bit", l: t("enkripsi isi rekord", "record content encryption") },
            { v: 2, s: t(" detik", " sec"), l: t("waktu verifikasi rata-rata", "average verification time") },
            { v: 0.001, s: " SOL", l: t("biaya penerbitan per entri", "issuance fee per entry"), d: 3 },
            { v: 100, s: "%", l: t("entri bisa diaudit publik", "entries publicly auditable") },
          ].map((m) => (
            <div key={m.l} className="text-center md:text-left">
              <p className="font-display text-4xl text-accent md:text-5xl">
                <Counter to={m.v} suffix={m.s} decimals={m.d ?? 0} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted">{m.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <FadeUp>
          <h2 className="font-display max-w-2xl text-3xl leading-tight md:text-5xl">
            {t(
              "Satu rantai, tiga pihak yang akhirnya bisa saling percaya.",
              "One chain, three parties who can finally trust each other."
            )}
          </h2>
        </FadeUp>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {audiences.map((c, i) => (
            <FadeUp key={c.t} delay={i * 0.12}>
              <TiltCard className="h-full rounded-2xl border border-line bg-surface p-7">
                <h3 className="text-lg font-semibold text-accent-2">{c.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.d}</p>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-24 text-center">
          <FadeUp>
            <PulseLine className="mx-auto mb-8 h-12 w-64 text-accent/60" />
            <h2 className="font-display mx-auto max-w-2xl text-3xl leading-tight md:text-5xl">
              {t(
                "Coba sekarang, semuanya berjalan di devnet.",
                "Try it now, everything runs on devnet."
              )}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:text-base">
              {t(
                "Hubungkan Phantom atau Solflare, terbitkan satu entri riwayat, lalu buktikan sendiri sidik jarinya ada di Solana.",
                "Connect Phantom or Solflare, issue one record entry, then prove for yourself that its fingerprint sits on Solana."
              )}
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/demo"
                className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85"
              >
                {t("Mulai dari demo", "Start with the demo")}
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-line bg-surface px-7 py-3.5 text-sm transition-colors hover:border-accent/50"
              >
                {t("Kenalan dengan timnya", "Meet the team")}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
