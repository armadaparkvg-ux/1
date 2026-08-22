"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CONTACTS } from "@/lib/constants";
import { resolveFleetFormUrl } from "@/lib/fleet-forms";
import { goal, trackFleetRegistration, trackGoal } from "@/lib/metrika";

type Status = "loading" | "redirecting" | "error";

const LABOR_SENTINEL = "__labor__";

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
 * type=labor → Telegram (отдельной Fleet-формы нет).
 */
export function FleetGoClient() {
  const [status, setStatus] = useState<Status>("loading");
  const [manualUrl, setManualUrl] = useState<string | null>(null);
  const [isLabor, setIsLabor] = useState(false);
  const redirected = useRef(false);

  useEffect(() => {
    const { channel, type } = readParams();
    const url = resolveFleetFormUrl(channel, type);

    if (!url) {
      setStatus("error");
      return;
    }

    const labor = url === LABOR_SENTINEL;
    const target = labor ? CONTACTS.telegram : url;
    setIsLabor(labor);
    setManualUrl(target);
    setStatus("redirecting");

    const go = () => {
      if (redirected.current) return;
      redirected.current = true;
      window.location.replace(target);
    };

    if (labor) {
      trackGoal("click_labor_apply", {
        place: "fleet_go",
        format: "labor",
        channel: "taxi",
      });
      goal(
        "visit_fleet_go",
        { channel: "taxi", type: "labor", format: "labor" },
        go
      );
    } else {
      const ch = channel === "taxi" ? "taxi" : "courier";
      trackFleetRegistration({
        channel: ch,
        type,
        action: "link",
        place: "card",
      });
      goal(
        "visit_fleet_go",
        {
          channel: ch,
          type,
          format: type === "ip" ? "ip" : type === "labor" ? "labor" : "smz",
        },
        go
      );
    }

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
        <Link href="/trudovoj-dogovor/" className="text-accent hover:underline">
          К трудовому договору
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-lg text-foreground">
        {isLabor
          ? "Переходим к оформлению трудового договора…"
          : "Переходим к авторегистрации Яндекс…"}
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
              {isLabor ? "откройте чат вручную" : "откройте форму вручную"}
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
