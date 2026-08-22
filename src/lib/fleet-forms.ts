import { FORMS } from "@/lib/constants";
import { COURIER_FORMS } from "@/lib/courier";

export type FleetChannel = "taxi" | "courier";

const TAXI_TYPES = {
  smz: FORMS.selfEmployed,
  self: FORMS.selfEmployed,
  ip: FORMS.ip,
} as const;

const COURIER_TYPES = {
  /** Быстрый старт СМЗ → форма пешего курьера по умолчанию */
  smz: COURIER_FORMS.foot,
  foot: COURIER_FORMS.foot,
  auto: COURIER_FORMS.auto,
  moto: COURIER_FORMS.moto,
  cargo: COURIER_FORMS.cargo,
} as const;

/** Resolve Yandex Fleet form URL by channel + type */
export function resolveFleetFormUrl(
  channel: string | null | undefined,
  type: string | null | undefined
): string | null {
  if (!channel || !type) return null;
  if (channel === "taxi") {
    return TAXI_TYPES[type as keyof typeof TAXI_TYPES] ?? null;
  }
  if (channel === "courier") {
    return COURIER_TYPES[type as keyof typeof COURIER_TYPES] ?? null;
  }
  return null;
}

/** Same-site path for Metrika URL goals + redirect to Fleet */
export function fleetGoPath(channel: FleetChannel, type: string): string {
  const q = new URLSearchParams({ channel, type });
  return `/go/fleet/?${q.toString()}`;
}
