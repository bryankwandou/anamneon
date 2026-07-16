"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const WalletButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (m) => m.WalletMultiButton
    ),
  { ssr: false }
);

const links = [
  { href: "/app", label: "Rekam Jejak" },
  { href: "/verify", label: "Verifikasi" },
  { href: "/operator", label: "Operator" },
  { href: "/about", label: "Tentang" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-lg tracking-tight">Anamneon</span>
          <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted">
            devnet
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm text-muted transition-colors hover:text-foreground",
                pathname?.startsWith(l.href) && "text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <WalletButton />
      </div>
    </motion.header>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      fill="none"
      aria-hidden
    >
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" stroke="#2dd4bf" strokeWidth="1.6" />
      <path
        d="M6 19 L11 19 L13.2 12.5 L16 23 L18.4 15.5 L20 19 L26 19"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="19" r="1.8" fill="#2dd4bf" />
    </svg>
  );
}
