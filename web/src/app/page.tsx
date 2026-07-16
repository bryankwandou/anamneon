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

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
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
            Berjalan di Solana Devnet — semua bukti bisa dicek sendiri
          </motion.p>
          <h1 className="font-display max-w-4xl text-4xl leading-[1.08] tracking-tight md:text-7xl">
            <TextReveal text="Riwayat penyakit yang" />
            <br />
            <TextReveal
              text="tidak bisa dipalsukan."
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
            Setiap entri riwayat pasien dikunci sidik jarinya di blockchain Solana.
            Data medisnya sendiri tetap terenkripsi dan tidak pernah menyentuh
            jaringan publik. Hasilnya: dokter, rumah sakit, dan asuransi bisa
            membuktikan sebuah riwayat asli dalam hitungan detik — tanpa perlu
            saling percaya lebih dulu.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              href="/app"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85"
            >
              Buka rekam jejak saya
            </Link>
            <Link
              href="/verify"
              className="rounded-full border border-line bg-surface px-6 py-3 text-sm text-foreground transition-colors hover:border-accent/50"
            >
              Verifikasi sebuah rekord
            </Link>
          </motion.div>
          <ParallaxDrift distance={30} className="mt-16">
            <PulseLine className="h-16 w-full text-accent/70 md:h-20" />
          </ParallaxDrift>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-line bg-surface py-4">
        <Marquee duration={26} className="text-xs uppercase tracking-[0.25em] text-muted">
          {[
            "Hash on-chain, data off-chain",
            "Enkripsi AES-256-GCM",
            "Memo program Solana",
            "Verifikasi tanpa izin pihak ketiga",
            "Biaya penerbitan: SOL atau USDC",
            "Neon Postgres serverless",
          ].map((t) => (
            <span key={t} className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {t}
            </span>
          ))}
        </Marquee>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <FadeUp>
          <p className="text-xs uppercase tracking-widest text-accent">Masalahnya nyata</p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl leading-tight md:text-5xl">
            Rekam medis kita tersebar, gampang hilang, dan gampang diubah.
          </h2>
        </FadeUp>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Pindah kota, riwayat hilang",
              d: "Pasien yang berobat di tiga rumah sakit berbeda praktis punya tiga riwayat yang tidak saling kenal. Dokter baru mulai lagi dari nol, pemeriksaan diulang, biaya membengkak.",
            },
            {
              n: "02",
              t: "Riwayat bisa dipalsukan",
              d: "Surat keterangan sehat, klaim asuransi, medical check-up kerja — semuanya bergantung pada dokumen yang bisa diedit siapa pun yang memegang berkasnya.",
            },
            {
              n: "03",
              t: "Database terpusat bisa disunting diam-diam",
              d: "Selama data hanya hidup di satu server, tidak ada cara bagi pasien membuktikan riwayatnya belum pernah diubah sejak pertama dicatat.",
            },
          ].map((c, i) => (
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
            <p className="text-xs uppercase tracking-widest text-accent">Cara kerjanya</p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl leading-tight md:text-5xl">
              Sidik jari di rantai, isi tetap rahasia.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              Kami tidak menaruh data medis di blockchain — itu melanggar privasi
              dan tidak bisa dihapus. Yang dikunci di Solana hanyalah sidik jari
              kriptografis (SHA-256) dari tiap entri. Isi lengkapnya dienkripsi
              dan disimpan terpisah. Ubah satu huruf saja pada rekord, sidik
              jarinya tidak akan cocok lagi dengan yang ada di rantai.
            </p>
          </FadeUp>
          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {[
              {
                s: "Langkah 1",
                t: "Catat",
                d: "Fasilitas kesehatan mengisi entri riwayat: keluhan, diagnosa, tindakan, resep.",
              },
              {
                s: "Langkah 2",
                t: "Kunci",
                d: "Entri dienkripsi AES-256-GCM, lalu sidik jari SHA-256-nya dihitung dari isi aslinya.",
              },
              {
                s: "Langkah 3",
                t: "Tanam di Solana",
                d: "Sidik jari dikirim sebagai transaksi memo di devnet, ditandatangani wallet penerbit. Biayanya bisa dibayar SOL atau USDC.",
              },
              {
                s: "Langkah 4",
                t: "Buktikan kapan saja",
                d: "Siapa pun yang diberi akses bisa menghitung ulang sidik jari dan mencocokkannya dengan transaksi di rantai.",
              },
            ].map((c, i) => (
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
            { v: 256, s: "-bit", l: "enkripsi isi rekord" },
            { v: 2, s: " detik", l: "waktu verifikasi rata-rata" },
            { v: 0.001, s: " SOL", l: "biaya penerbitan per entri", d: 3 },
            { v: 100, s: "%", l: "entri bisa diaudit publik" },
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
            Satu rantai, tiga pihak yang akhirnya bisa saling percaya.
          </h2>
        </FadeUp>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              t: "Pasien",
              d: "Riwayatmu ikut ke mana pun kamu pindah. Kamu yang memegang kuncinya, bukan rumah sakit.",
            },
            {
              t: "Dokter & rumah sakit",
              d: "Anamnesis pasien baru tidak lagi mulai dari ingatan kosong. Riwayat lama terbukti asli, ringkasan klinisnya disiapkan mesin.",
            },
            {
              t: "Asuransi & pemberi kerja",
              d: "Klaim dan surat keterangan bisa dicek keasliannya langsung ke rantai, tanpa menelepon rumah sakit satu per satu.",
            },
          ].map((c, i) => (
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
              Coba sekarang, semuanya berjalan di devnet.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:text-base">
              Hubungkan Phantom atau Solflare, terbitkan satu entri riwayat, lalu
              buktikan sendiri sidik jarinya ada di Solana.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/app"
                className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-[#04211d] transition-opacity hover:opacity-85"
              >
                Mulai dari rekam jejak
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-line bg-surface px-7 py-3.5 text-sm transition-colors hover:border-accent/50"
              >
                Kenalan dengan timnya
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
