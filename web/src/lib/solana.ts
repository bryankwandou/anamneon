import { PublicKey } from "@solana/web3.js";

export const DEVNET_RPC =
  process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

export const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

// Circle USDC mint on Solana devnet (6 decimals)
export const USDC_DEV_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

// Treasury that receives issuance fees (devnet)
export const TREASURY = new PublicKey(
  "5JTDJdfDHqu3TEHuBTATJF49G8i8YKy42riJG9KWFfSk"
);

export const MEMO_PREFIX = "ANAMNEON:v1:";

export const RECORD_FEE_SOL = 0.001;
export const RECORD_FEE_USDC = 0.01;

export function explorerTx(sig: string) {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}

export function shortAddr(a: string, n = 4) {
  return a.length > n * 2 + 3 ? `${a.slice(0, n)}...${a.slice(-n)}` : a;
}
