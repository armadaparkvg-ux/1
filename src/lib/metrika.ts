/** Яндекс Метрика: цели для Директа и воронки */

declare global {
  interface Window {
    ym?: (
      id: number,
      method: string,
      ...args: unknown[]
    ) => void;
  }
}

export const METRIKA_ID = 110811547;

/** Имена целей — создать такие же в кабинете Метрики */
export const METRIKA_GOALS = {
  directions_view: "directions_view",
  directions_taxi: "directions_taxi",
  directions_delivery: "directions_delivery",
  quiz_goal: "quiz_goal",
  quiz_to_courier: "quiz_to_courier",
  quiz_finish: "quiz_finish",
  lead_messenger: "lead_messenger",
  click_phone: "click_phone",
  click_courier_form: "click_courier_form",
} as const;

export type MetrikaGoal = keyof typeof METRIKA_GOALS | string;

export function trackGoal(
  goal: MetrikaGoal,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  const name =
    typeof goal === "string" && goal in METRIKA_GOALS
      ? METRIKA_GOALS[goal as keyof typeof METRIKA_GOALS]
      : String(goal);
  try {
    window.ym?.(METRIKA_ID, "reachGoal", name, params);
  } catch {
    /* ignore */
  }
}
