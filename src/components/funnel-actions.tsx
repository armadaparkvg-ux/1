"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactButtons } from "@/components/contact-buttons";
import { ApplyButton } from "@/components/messenger-apply";
import type { ApplyTopic } from "@/lib/apply";
import { trackFleetRegistration } from "@/lib/metrika";
import { cn } from "@/lib/utils";

type DualPathProps = {
  /** Fleet auto-registration URL (opens in new tab) */
  registerHref?: string;
  registerLabel?: string;
  /** Optional iframe form for on-page registration */
  iframeSrc?: string;
  iframeTitle?: string;
  /** Metrika: taxi | courier + type (smz, ip, foot…) */
  fleetTrack?: {
    channel: "taxi" | "courier";
    type: string;
  };
  /** Topic for park-support apply modal (labor / services) */
  applyTopic?: ApplyTopic;
  applyLabel?: string;
  className?: string;
  /** Hide the “или через поддержку” chats when apply modal is enough */
  chats?: boolean;
};

/**
 * Unified funnel ending: авторегистрация (shimmer) или поддержка парка (pulse chats).
 */
export function DualPathActions({
  registerHref,
  registerLabel = "Авторегистрация",
  iframeSrc,
  iframeTitle = "Форма регистрации",
  fleetTrack,
  applyTopic,
  applyLabel = "Оформить через поддержку парка",
  className,
  chats = true,
}: DualPathProps) {
  const [showForm, setShowForm] = useState(false);

  const track = (action: "link" | "iframe") => {
    if (!fleetTrack) return;
    trackFleetRegistration({
      channel: fleetTrack.channel,
      type: fleetTrack.type,
      action,
    });
  };

  return (
    <div className={cn("mt-6 flex flex-col gap-3", className)}>
      {registerHref ? (
        <Button asChild shine size="lg" className="w-full">
          <Link
            href={registerHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("link")}
          >
            {registerLabel}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      ) : null}

      {iframeSrc ? (
        showForm ? (
          <div className="overflow-hidden rounded-xl border border-border bg-background/40">
            <iframe
              title={iframeTitle}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              src={iframeSrc}
              className="h-[420px] w-full max-w-full sm:h-[500px]"
              loading="lazy"
            />
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            shine
            size="lg"
            className="w-full"
            onClick={() => {
              track("iframe");
              setShowForm(true);
            }}
          >
            Открыть форму на сайте
          </Button>
        )
      ) : null}

      {applyTopic ? (
        <ApplyButton topic={applyTopic} size="lg" className="w-full">
          {applyLabel}
        </ApplyButton>
      ) : null}

      {chats ? (
        <div className="pt-1">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {registerHref || applyTopic
              ? "или напишите в поддержку парка"
              : "Напишите в поддержку парка"}
          </p>
          <ContactButtons showLabels size="sm" className="justify-center" />
        </div>
      ) : null}
    </div>
  );
}
