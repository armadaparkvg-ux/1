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

/** Единственное место с номером счётчика */
export const COUNTER_ID = 110811547;
/** @deprecated используйте COUNTER_ID */
export const METRIKA_ID = COUNTER_ID;

export type GoalName =
  | "click_classifier"
  | "scroll_50"
  | "sticky_shown"
  | "click_fleet_taxi"
  | "click_fleet_courier"
  | "click_fleet_form"
  | "click_courier_form"
  | "click_phone"
  | "directions_taxi"
  | "directions_delivery"
  | "directions_view"
  | "click_labor_apply"
  | "visit_fleet_go"
  | "visit_trudovoj"
  | "lead_messenger"
  | "quiz_goal"
  | "quiz_to_courier"
  | "quiz_finish";

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
  click_fleet_form: "click_fleet_form",
  click_fleet_taxi: "click_fleet_taxi",
  click_fleet_courier: "click_fleet_courier",
  click_courier_form: "click_courier_form",
  click_labor_apply: "click_labor_apply",
  visit_trudovoj: "visit_trudovoj",
  visit_fleet_go: "visit_fleet_go",
  click_classifier: "click_classifier",
  scroll_50: "scroll_50",
  sticky_shown: "sticky_shown",
} as const;

export type MetrikaGoal = keyof typeof METRIKA_GOALS | string;

export type FleetTrackParams = {
  channel: "taxi" | "courier";
  /** smz | ip | foot | auto | moto | cargo */
  type: string;
  /** link = новая вкладка Fleet; iframe = форма на сайте */
  action: "link" | "iframe";
  place?: "hero" | "card" | "sticky" | "footer";
};

type YmFn = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };

function ensureYm(): YmFn | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as Window & { ym?: YmFn };
  if (typeof w.ym !== "function") {
    const queue: YmFn = (...args: unknown[]) => {
      queue.a = queue.a || [];
      queue.a.push(args);
    };
    queue.a = [];
    queue.l = Date.now();
    w.ym = queue;
  }
  return w.ym;
}

function resolveGoalName(goal: MetrikaGoal): string {
  return typeof goal === "string" && goal in METRIKA_GOALS
    ? METRIKA_GOALS[goal as keyof typeof METRIKA_GOALS]
    : String(goal);
}

/**
 * Единый хелпер reachGoal с колбэком (для редиректа после visit_fleet_go).
 */
export function goal(
  name: GoalName | MetrikaGoal,
  params?: Record<string, unknown>,
  cb?: () => void
): void {
  if (typeof window === "undefined") {
    cb?.();
    return;
  }
  const ym = ensureYm();
  if (typeof ym !== "function") {
    cb?.();
    return;
  }
  try {
    ym(COUNTER_ID, "reachGoal", resolveGoalName(name), params, cb);
  } catch {
    cb?.();
  }
}

export function trackGoal(
  goalName: MetrikaGoal,
  params?: Record<string, string | number | boolean>
): void {
  goal(goalName, params);
}

function formatFromType(type: string): "smz" | "ip" | "labor" {
  if (type === "ip") return "ip";
  if (type === "labor") return "labor";
  return "smz";
}

/** Клик по авторегистрации Яндекс Fleet */
export function trackFleetRegistration(params: FleetTrackParams): void {
  const payload = {
    channel: params.channel,
    type: params.type,
    format: formatFromType(params.type),
    place: params.place ?? "card",
    action: params.action,
  };
  trackGoal("click_fleet_form", payload);
  if (params.channel === "taxi") {
    trackGoal("click_fleet_taxi", payload);
  } else {
    trackGoal("click_fleet_courier", payload);
    trackGoal("click_courier_form", payload);
  }
}
