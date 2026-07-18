"use client";

import { useEffect } from "react";
import { captureUtmFromLocation } from "@/lib/utm";

/** Persists UTM / yclid from the landing URL for the visit. */
export function UtmCapture() {
  useEffect(() => {
    captureUtmFromLocation();
  }, []);

  return null;
}
