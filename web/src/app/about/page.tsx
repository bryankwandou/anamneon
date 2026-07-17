"use client";

import { FadeUp, PulseLine } from "@/components/motion";
import { useLang } from "@/lib/i18n";

export default function AboutPage() {
  const { t, lang } = useLang();

  const features = [
    t(
      "Penerbitan entri riwayat: dienkripsi AES-256-GCM, disimpan di Neon Postgres, sidik jarinya ditanam ke Solana devnet lewat transaksi memo.",
      "Record issuance: encrypted with AES-256-GCM, stored in Neon Postgres, fingerprint anchored to Solana devnet through a memo transaction."
    ),
    t(
      "Biaya penerbitan bisa dibayar SOL atau USDC devnet dalam satu transaksi yang sama.",
      "Issuance fees payable in SOL or devnet USDC within the same transaction."
    ),
    t(
      "Verifikasi publik: siapa pun bisa menghitung ulang sidik jari dan mencocokkannya dengan rantai lewat halaman verifikasi.",
      "Public verification: anyone can recompute the fingerprint and match it against the chain from the verify page."
    ),
    t(
      "Ringkasan anamnesis otomatis untuk dokter, disusun model bahasa dari riwayat yang sudah terverifikasi.",
      "Automatic intake summaries for doctors, drafted by a language model from already-verified history."
    ),
    t(
      "Konsol operator dengan direktori fasilitas kesehatan Indonesia yang nyata, untuk registrasi rumah sakit, klinik, puskesmas, dan laboratorium beserta wallet penandatangannya.",
      "An operator console with a real directory of Indonesian health facilities, registering hospitals, clinics, community health centers, and labs along with their signing wallets."
    ),
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-16" key={lang}>
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-accent">
          {t("Tentang proyek", "About the project")}
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight md:text-5xl">
          {t(
            "Anamneon lahir dari satu pertanyaan sederhana.",
            "Anamneon started with one simple question."
          )}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          {t(
            "Kalau uang bisa dibuktikan keasliannya di blockchain, kenapa riwayat kesehatan — hal yang jauh lebih penting bagi hidup seseorang — masih bergantung pada berkas yang gampang hilang dan gampang diedit?",
            "If money can be proven genuine on a blockchain, why does health history — something far more important to a person's life — still depend on files that are easy to lose and easy to edit?"
          )}
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {t(
            "Nama Anamneon diambil dari anamnesis, tahap paling awal setiap pemeriksaan medis: dokter menggali riwayat penyakit pasien. Proyek ini membuat hasil penggalian itu punya bukti yang tidak bisa disunting diam-diam. Sidik jari tiap entri dikunci di Solana; isi lengkapnya tetap terenkripsi di luar rantai, karena data medis bukan konsumsi publik.",
            "The name Anamneon comes from anamnesis, the first stage of every medical examination: the doctor working through the patient's history. This project gives that history evidence that cannot be quietly edited. Each entry's fingerprint is sealed on Solana; the full content stays encrypted off-chain, because medical data is not for public consumption."
          )}
        </p>
      </FadeUp>

      <PulseLine className="my-12 h-10 w-full text-accent/40" />

      <FadeUp>
        <h2 className="font-display text-2xl">{t("Tim", "Team")}</h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm font-semibold">Denzel Joshua Yasin</p>
            <p className="mt-1 text-sm text-muted">
              {t(
                "Pemilik ide dan konsep. Mahasiswa yang mengajukan gagasan memakai jejak blockchain untuk memeriksa riwayat penyakit pasien secara transparan tanpa mengorbankan privasi.",
                "Idea and concept owner. The student who proposed using blockchain trails to check patient medical history transparently without sacrificing privacy."
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm font-semibold">Vincentius Bryan Kwandou</p>
            <p className="mt-1 text-sm text-muted">
              {t(
                "PIC Superteam Campus Club, Universitas Atma Jaya Makassar. Memfasilitasi dan mengeksekusi ide menjadi produk yang berjalan di Solana devnet.",
                "PIC of the Superteam Campus Club, Atma Jaya University Makassar. Facilitates and executes the idea into a product running on Solana devnet."
              )}
            </p>
          </div>
        </div>
      </FadeUp>

      <FadeUp className="mt-12">
        <h2 className="font-display text-2xl">
          {t("Yang berjalan hari ini", "What runs today")}
        </h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
          {features.map((f) => (
            <li key={f} className="rounded-xl border border-line bg-surface px-5 py-4">
              {f}
            </li>
          ))}
        </ul>
      </FadeUp>
    </div>
  );
}
