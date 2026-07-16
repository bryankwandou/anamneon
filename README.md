# Anamneon

**Riwayat penyakit pasien yang dikunci di Solana — bisa dibuktikan asli dalam hitungan detik, tanpa satu byte data medis pun bocor ke publik.**

Live: https://anamneon.vercel.app
Jaringan: Solana Devnet
Repo: https://github.com/bryankwandou/anamneon

---

## Tim

| Peran | Nama |
|---|---|
| Pemilik ide & konsep | **Denzel Joshua Yasin** |
| PIC / eksekusi — Superteam Campus Club, Universitas Atma Jaya Makassar | **Vincentius Bryan Kwandou** |

## Latar belakang

Rekam medis di Indonesia tersebar antar fasilitas kesehatan. Pasien yang pindah kota praktis memulai riwayatnya dari nol; surat keterangan sehat dan klaim asuransi bergantung pada dokumen yang bisa diedit siapa pun yang memegang berkasnya; dan selama data hanya hidup di satu server, tidak ada cara membuktikan sebuah riwayat belum pernah diubah sejak pertama dicatat.

Anamneon (dari *anamnesis* — penggalian riwayat penyakit pasien, tahap pertama setiap pemeriksaan medis) menyelesaikan bagian yang paling sulit: **bukti keaslian**.

## Arsitektur: sidik jari di rantai, isi tetap rahasia

Data medis tidak pernah ditaruh mentah di blockchain — itu melanggar privasi dan tidak bisa dihapus. Alurnya:

1. **Catat** — fasilitas kesehatan mengisi entri riwayat (keluhan, diagnosa, tindakan, resep).
2. **Kunci** — entri dienkripsi AES-256-GCM dan disimpan di Neon Postgres; sidik jari SHA-256 dihitung dari isi kanoniknya.
3. **Tanam di Solana** — sidik jari dikirim sebagai transaksi Memo (`ANAMNEON:v1:<hash>`) di devnet, ditandatangani wallet penerbit. Biaya penerbitan dibayar **SOL atau USDC devnet** dalam transaksi yang sama.
4. **Buktikan kapan saja** — halaman verifikasi menghitung ulang sidik jari dari isi terenkripsi dan mencocokkannya dengan transaksi di rantai. Ubah satu huruf saja, hash tidak akan cocok lagi.

## Fitur yang berjalan

- Penerbitan entri riwayat dengan anchoring on-chain (Memo program, devnet)
- Pembayaran biaya penerbitan: 0.001 SOL atau 0.01 USDC devnet (mint Circle `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`)
- Timeline rekam jejak per wallet pasien dengan status verifikasi per entri
- Verifikasi publik: recompute hash + cek transaksi devnet, lengkap dengan link explorer
- Ringkasan anamnesis otomatis untuk dokter (Groq, llama-3.3-70b) dari riwayat yang sudah ter-anchor
- Konsol operator untuk registrasi rumah sakit / klinik / puskesmas / lab beserta wallet penandatangannya

## Stack

- Next.js 15 (App Router, Turbopack) + Tailwind CSS 4 + Framer Motion
- @solana/web3.js + wallet-adapter (Phantom, Solflare) + @solana/spl-token
- Neon Postgres (driver serverless)
- Groq API untuk ringkasan klinis
- Vercel untuk hosting

## Menjalankan lokal

```bash
cd web
npm install
cp .env.example .env.local   # isi nilainya
npm run dev
```

Variabel lingkungan (`web/.env.example`):

| Nama | Fungsi |
|---|---|
| `DATABASE_URL` | koneksi Neon Postgres |
| `ENCRYPTION_KEY` | passphrase enkripsi isi rekord (AES-256-GCM) |
| `GROQ_API_KEY` | ringkasan anamnesis |
| `NEXT_PUBLIC_RPC_URL` | opsional, default `https://api.devnet.solana.com` |

Setelah deploy pertama, panggil `GET /api/db/init` sekali untuk membuat skema.

## Cara membuktikan sendiri

1. Buka https://anamneon.vercel.app, hubungkan Phantom/Solflare (jaringan devnet, SOL dari https://faucet.solana.com).
2. Buat satu entri di halaman Rekam Jejak, pilih bayar SOL atau USDC.
3. Salin ID rekord, buka halaman Verifikasi, tempel — sistem menunjukkan hash yang dihitung ulang, status kecocokan database, status ditemukan di rantai, dan link transaksinya di explorer.solana.com (cluster devnet).

## Bukti on-chain (devnet, bisa dicek siapa pun)

| Alur | Transaksi |
|---|---|
| Anchor + fee SOL | [`Pe5dkskcWirCQqpp5xfD6jfMMdUJM2UhHyw2pQECLVdJffmXeK3oCuTpZn1zSJNux5EAnWizfDKRP65REJ2Kj2f`](https://explorer.solana.com/tx/Pe5dkskcWirCQqpp5xfD6jfMMdUJM2UhHyw2pQECLVdJffmXeK3oCuTpZn1zSJNux5EAnWizfDKRP65REJ2Kj2f?cluster=devnet) — slot 476642611 |
| Anchor + fee USDC | [`3ssXWXFpLh9KJBiox8kdZGWdfkTEitrx9b3HSkTzZHjaJBeNFBtidmVZEkp34qgW5ixirQscStoLXexeoHMFbTax`](https://explorer.solana.com/tx/3ssXWXFpLh9KJBiox8kdZGWdfkTEitrx9b3HSkTzZHjaJBeNFBtidmVZEkp34qgW5ixirQscStoLXexeoHMFbTax?cluster=devnet) — slot 476642930 |

Kedua transaksi membawa memo `ANAMNEON:v1:<sha256>` persis seperti yang dikirim aplikasi.

## Batasan yang jujur

Ini MVP hackathon di devnet: identitas fasilitas belum diverifikasi lembaga resmi, kontrol akses baru sebatas kepemilikan wallet, dan ringkasan mesin adalah alat bantu — bukan pengganti penilaian klinis. Arah selanjutnya: izin baca berbasis token, tanda tangan ganda pasien-fasilitas, dan integrasi standar FHIR.
