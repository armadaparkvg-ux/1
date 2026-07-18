"use client";

import { ApplyProvider } from "@/components/messenger-apply";
import { UtmCapture } from "@/components/utm-capture";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApplyProvider>
      <UtmCapture />
      {children}
    </ApplyProvider>
  );
}
