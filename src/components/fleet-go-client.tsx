"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { resolveFleetFormUrl } from "@/lib/fleet-forms";
import { trackFleetRegistration } from "@/lib/metrika";

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

export function FleetGoClient() {
  const [{ channel, type }, setParams] = useState(readParams);
  const target = useMemo(
    () => resolveFleetFormUrl(channel, type),
    [channel, type]
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    setParams(readParams());
  }, []);

  useEffect(() => {
    if (!channel || !type) {
      setError(true);
      return;
    }
    const url = resolveFleetFormUrl(channel, type);
    if (!url) {
      setError(true);
      return;
    }

    const ch = channel === "taxi" ? "taxi" : "courier";
    trackFleetRegistration({
      channel: ch,
      type,
      action: "link",
    });

    // Give Metrika a tick to send the hit, then leave
    const t = window.setTimeout(() => {
      window.location.replace(url);
    }, 250);
    return () => window.clearTimeout(t);
  }, [channel, type]);

  if (error || !target) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg text-foreground">Ссылка авторегистрации недействительна.</p>
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
      <p className="text-lg text-foreground">Переходим к авторегистрации Яндекс…</p>
      <p className="text-sm text-muted-foreground">
        Если переход не произошёл —{" "}
        <a href={target} className="text-accent hover:underline">
          откройте форму вручную
        </a>
        .
      </p>
    </div>
  );
}
