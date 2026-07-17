"use client";

import { ApplyProvider } from "@/components/messenger-apply";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApplyProvider>{children}</ApplyProvider>;
}
