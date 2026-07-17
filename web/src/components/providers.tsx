"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { DEVNET_RPC } from "@/lib/solana";
import { LangProvider } from "@/lib/i18n";

import "@solana/wallet-adapter-react-ui/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={DEVNET_RPC}>
      <WalletProvider
        wallets={wallets}
        autoConnect={false}
        onError={(e) => console.warn("wallet:", e.message)}
      >
        <WalletModalProvider>
          <LangProvider>{children}</LangProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
