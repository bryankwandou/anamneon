import Link from "next/link";
import { Logo } from "./nav";
import { Link001 } from "@/components/ui/skiper-ui/skiper40";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <Logo className="h-6 w-6" />
          <div>
            <p className="font-display text-sm">Anamneon</p>
            <p className="text-xs text-muted">
              Riwayat penyakit yang bisa dibuktikan, bukan sekadar dipercaya.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
          <Link href="/verify" className="hover:text-foreground">Verifikasi publik</Link>
          <Link001
            href="https://github.com/bryankwandou/anamneon"
            className="hover:text-foreground"
          >
            GitHub
          </Link001>
          <Link001
            href="https://explorer.solana.com/?cluster=devnet"
            className="hover:text-foreground"
          >
            Solana Devnet
          </Link001>
          <span>Ide: Denzel Joshua Yasin</span>
          <span>PIC: Vincentius Bryan Kwandou — SCC Unika Atma Jaya Makassar</span>
        </div>
      </div>
    </footer>
  );
}
