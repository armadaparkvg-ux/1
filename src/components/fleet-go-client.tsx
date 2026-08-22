"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { resolveFleetFormUrl } from "@/lib/fleet-forms";
import { goal, trackFleetRegistration } from "@/lib/metrika";

type Status = "loading" | "redirecting" | "error";

function readParams() {
  if (typeof window === "undefined") {
    return { channel: "", type: "" };
  }
  const q = new URLSearchParams(window.location.search);
  return {
    channel: q.get("channel") ?? "",
    type: q.get("type") ?? "",
  };
}

/**
 * Intermediate page: Metrika sees /go/fleet/, then redirect to Yandex Fleet.
 * visit_fleet_go must fire BEFORE redirect (callback + 1200ms timeout).
 */
export function FleetGoClient() {
  const [status, setStatus] = useState<Status>("loading");
  const [manualUrl, setManualUrl] = useState<string | null>(null);
  const redirected = useRef(false);

  useEffect(() => {
    const { channel, type } = readParams();
    const url = resolveFleetFormUrl(channel, type);

    if (!url) {
      setStatus("error");
      return;
    }

    setManualUrl(url);
    setStatus("redirecting");

    const ch = channel === "taxi" ? "taxi" : "courier";
    trackFleetRegistration({
      channel: ch,
      type,
      action: "link",
      place: "card",
    });

    const go = () => {
      if (redirected.current) return;
      redirected.current = true;
      window.location.replace(url);
    };

    goal(
      "visit_fleet_go",
      { channel: ch, type, format: type === "ip" ? "ip" : "smz" },
      go
    );

    const t = window.setTimeout(go, 1200);
    return () => window.clearTimeout(t);
  }, []);

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg text-foreground">
          Ссылка авторегистрации недействительна.
        </p>
        <Link href="/delivery/" className="text-accent hover:underline">
          К доставке
        </Link>
        <Link href="/taxi/" className="text-accent hover:underline">
          К такси
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-lg text-foreground">
        Переходим к авторегистрации Яндекс…
      </p>
      <p className="text-sm text-muted-foreground">
        {manualUrl ? (
          <>
            Если переход не произошёл —{" "}
            <a
              href={manualUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              откройте форму вручную
            </a>
            .
          </>
        ) : (
          "Подождите секунду…"
        )}
      </p>
    </div>
  );
}
