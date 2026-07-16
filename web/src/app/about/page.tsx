import { FadeUp, PulseLine } from "@/components/motion";

export const metadata = {
  title: "Tentang — Anamneon",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-accent">Tentang proyek</p>
        <h1 className="font-display mt-2 text-3xl leading-tight md:text-5xl">
          Anamneon lahir dari satu pertanyaan sederhana.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          Kalau uang bisa dibuktikan keasliannya di blockchain, kenapa riwayat
          kesehatan — hal yang jauh lebih penting bagi hidup seseorang — masih
          bergantung pada berkas yang gampang hilang dan gampang diedit?
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Nama Anamneon diambil dari anamnesis, tahap paling awal setiap
          pemeriksaan medis: dokter menggali riwayat penyakit pasien. Proyek ini
          membuat hasil penggalian itu punya bukti yang tidak bisa disunting
          diam-diam. Sidik jari tiap entri dikunci di Solana; isi lengkapnya
          tetap terenkripsi di luar rantai, karena data medis bukan konsumsi
          publik.
        </p>
      </FadeUp>

      <PulseLine className="my-12 h-10 w-full text-accent/40" />

      <FadeUp>
        <h2 className="font-display text-2xl">Tim</h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm font-semibold">Denzel Joshua Yasin</p>
            <p className="mt-1 text-sm text-muted">
              Pemilik ide dan konsep. Mahasiswa yang mengajukan gagasan memakai
              jejak blockchain untuk memeriksa riwayat penyakit pasien secara
              transparan tanpa mengorbankan privasi.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm font-semibold">Vincentius Bryan Kwandou</p>
            <p className="mt-1 text-sm text-muted">
              PIC Superteam Campus Club, Universitas Atma Jaya Makassar.
              Memfasilitasi dan mengeksekusi ide menjadi produk yang berjalan
              di Solana devnet.
            </p>
          </div>
        </div>
      </FadeUp>

      <FadeUp className="mt-12">
        <h2 className="font-display text-2xl">Yang berjalan hari ini</h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
          <li className="rounded-xl border border-line bg-surface px-5 py-4">
            Penerbitan entri riwayat: dienkripsi AES-256-GCM, disimpan di Neon
            Postgres, sidik jarinya ditanam ke Solana devnet lewat transaksi memo.
          </li>
          <li className="rounded-xl border border-line bg-surface px-5 py-4">
            Biaya penerbitan bisa dibayar SOL atau USDC devnet dalam satu
            transaksi yang sama.
          </li>
          <li className="rounded-xl border border-line bg-surface px-5 py-4">
            Verifikasi publik: siapa pun bisa menghitung ulang sidik jari dan
            mencocokkannya dengan rantai lewat halaman verifikasi.
          </li>
          <li className="rounded-xl border border-line bg-surface px-5 py-4">
            Ringkasan anamnesis otomatis untuk dokter, disusun model bahasa dari
            riwayat yang sudah terverifikasi.
          </li>
          <li className="rounded-xl border border-line bg-surface px-5 py-4">
            Konsol operator untuk mendaftarkan rumah sakit, klinik, puskesmas,
            dan laboratorium beserta wallet penandatangannya.
          </li>
        </ul>
      </FadeUp>
    </div>
  );
}
