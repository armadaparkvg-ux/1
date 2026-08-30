"use client";

import { ApplyProvider } from "@/components/messenger-apply";
import { ContinueTracker } from "@/components/continue-path";
import { RegisterChooserProvider } from "@/components/register-chooser";
import { SiteAssistantProvider } from "@/components/site-assistant";
import { UtmCapture } from "@/components/utm-capture";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApplyProvider>
      <RegisterChooserProvider>
        <SiteAssistantProvider>
          <UtmCapture />
          <ContinueTracker />
          {children}
        </SiteAssistantProvider>
      </RegisterChooserProvider>
    </ApplyProvider>
  );
}
