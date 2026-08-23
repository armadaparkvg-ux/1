"use client";

import { useEffect } from "react";

/**
 * Legacy Direct / bookmark hashes from the old homepage funnel.
 * Redirects to the current destination pages while preserving UTM query.
 */
const HASH_REDIRECTS: Record<string, string> = {
  "#about": "/o-parke/",
  "#tariffs": "/taxi/#formats",
  "#tariff-self": "/taxi/#formats",
  "#tariff-ip": "/taxi/#formats",
  "#labor-contract": "/trudovoj-dogovor/",
  "#services": "/license/",
  "#compare": "/taxi/#formats",
  "#quiz": "/taxi/",
  "#apply": "/taxi/#formats",
  "#reviews": "/#max-channel",
  "#yandex-tariffs": "/taxi/#step-class",
  "#how-it-works": "/#directions",
};

export function LegacyHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    const target = HASH_REDIRECTS[hash];
    if (!target) return;

    const search = window.location.search;
    const [path, nextHash] = target.split("#");
    const url = `${path}${search}${nextHash ? `#${nextHash}` : ""}`;
    window.location.replace(url);
  }, []);

  return null;
}
