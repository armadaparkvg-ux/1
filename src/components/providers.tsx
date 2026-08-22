"use client";

import { ApplyProvider } from "@/components/messenger-apply";
import { RegisterChooserProvider } from "@/components/register-chooser";
import { UtmCapture } from "@/components/utm-capture";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApplyProvider>
      <RegisterChooserProvider>
        <UtmCapture />
        {children}
      </RegisterChooserProvider>
    </ApplyProvider>
  );
}
