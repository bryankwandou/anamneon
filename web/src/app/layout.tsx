import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Anamneon — riwayat penyakit yang tidak bisa dipalsukan",
  description:
    "Setiap entri riwayat penyakit pasien dikunci hash-nya di Solana. Dokter mana pun bisa memverifikasi keasliannya dalam hitungan detik, tanpa data medis bocor ke publik.",
  metadataBase: new URL("https://anamneon.vercel.app"),
  openGraph: {
    title: "Anamneon",
    description:
      "Riwayat penyakit pasien, dikunci di Solana. Terverifikasi, portabel, dan tetap privat.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
