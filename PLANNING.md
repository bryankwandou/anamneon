# ANAMNEON — Mega Prompt Planning

## Identitas
- **Nama final:** Anamneon (dicek: repo `bryankwandou/anamneon` available, `anamneon.vercel.app` available)
- **Asal nama:** *Anamnesis* — istilah kedokteran untuk penggalian riwayat penyakit pasien — digabung *Neon*, database serverless yang menyimpan lapisan terenkripsi.
- **One-liner:** Rekam jejak riwayat penyakit pasien yang dikunci di Solana — dokter mana pun bisa memverifikasi keasliannya dalam hitungan detik, tanpa satu byte data medis pun bocor ke publik.
- **Pemilik ide & konsep:** Denzel Joshua Yasin
- **PIC pelaksana:** Vincentius Bryan Kwandou — Superteam Campus Club, Universitas Atma Jaya Makassar

## Masalah
1. Rekam medis pasien tersebar antar rumah sakit; pasien pindah kota, riwayatnya hilang.
2. Riwayat penyakit bisa dipalsukan (klaim asuransi, surat keterangan sehat, medical check-up kerja).
3. Sistem terpusat bisa diubah diam-diam oleh siapa pun yang pegang database.

## Solusi — arsitektur "hash on-chain, data off-chain"
Data medis TIDAK pernah ditaruh mentah di blockchain (privasi + hukum). Yang ditaruh:
- **SHA-256 hash** dari setiap entri riwayat penyakit → ditulis ke Solana devnet via Memo program, ditandatangani wallet fasilitas kesehatan.
- Data lengkap terenkripsi (AES-256-GCM) disimpan di Neon Postgres.
- Siapa pun dengan izin pasien bisa recompute hash dan mencocokkan dengan transaksi on-chain → bukti data tidak pernah diubah sejak dicatat.

## Fitur MVP (semua wajib jalan)
1. **Landing page** interaktif penuh animasi (Skiper UI + framer-motion), copy natural manusiawi, 0 emote, 0 kata AI-ish.
2. **Wallet connect** — Phantom/Solflare, Solana devnet.
3. **Catat riwayat** — form entri diagnosa → enkripsi → simpan Neon → hash → memo tx on-chain → tampilkan signature + link explorer.
4. **Timeline pasien** — riwayat kronologis dengan status verifikasi on-chain per entri.
5. **Verifikasi publik** — tempel ID rekord / signature, sistem recompute hash dan bandingkan dengan chain.
6. **AI ringkasan anamnesis** — Groq (llama) merangkum riwayat panjang jadi ringkasan klinis untuk dokter.
7. **Konsol operator** — registrasi fasilitas kesehatan (hub) baru + wallet penandatangannya.
8. **Opsi USDC devnet** — biaya penerbitan rekord bisa dibayar USDC devnet (SPL transfer) selain SOL.

## Stack
- Next.js 15 App Router + Tailwind + shadcn/ui + framer-motion + Skiper UI
- @solana/web3.js + wallet-adapter; Memo program untuk anchoring
- Neon Postgres (serverless driver) — tabel: hubs, patients, records, anchors
- Groq API — ringkasan anamnesis
- Deploy: Vercel (repo GitHub public `bryankwandou/anamneon`)

## Halaman
`/` landing · `/app` dashboard pasien · `/app/record` catat entri · `/verify` verifikasi publik · `/operator` konsol operator · `/about` tim & hackathon

## Bukti yang wajib ditunjukkan
- Signature transaksi devnet nyata + link explorer.solana.com?cluster=devnet
- Alur USDC devnet tersedia
- Build lolos, halaman live di anamneon.vercel.app

## Desain
- Tema klinis-modern: latar gelap biru-kehitaman, aksen cyan/teal (monitor vital), tipografi serif untuk display + sans untuk data.
- Referensi getdesign.md / silicon valley standard: banyak ruang napas, grid rapi, angka monospace.
- Animasi: hero text reveal, timeline pulse (EKG line), card hover depth, scroll-triggered sections, counter angka.
