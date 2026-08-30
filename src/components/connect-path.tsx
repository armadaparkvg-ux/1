import Link from "next/link";
import { HOW_TO_STEPS } from "@/lib/seo";

export function ConnectPath() {
  return (
    <section
      className="py-10 sm:py-14"
      aria-labelledby="connect-path-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Порядок
          </p>
          <h2
            id="connect-path-heading"
            className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl"
          >
            Как подключиться к парку
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Пять шагов по порядку: от знакомства с условиями до выхода в Яндекс
            Про. Регистрация самозанятого и ИП — на странице такси, трудовой —
            только через чат.
          </p>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {HOW_TO_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="premium-card rounded-2xl p-4 sm:p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                Шаг {index + 1}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-5 text-sm">
          <Link href="/taxi/" className="font-semibold text-accent hover:underline">
            Перейти к подключению такси
          </Link>
          {" · "}
          <Link href="/license/" className="font-semibold text-accent hover:underline">
            Оформить лицензию ФГИС
          </Link>
        </p>
      </div>
    </section>
  );
}
