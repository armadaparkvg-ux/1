"use client";

import { useEffect, useRef } from "react";
import { goal } from "@/lib/metrika";

/** One-shot scroll_50 goal when user reaches ~50% of document height */
export function ScrollDepthTracker() {
  const fired = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (fired.current) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= 0.5) {
        fired.current = true;
        goal("scroll_50");
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
