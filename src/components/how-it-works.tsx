"use client";

import { FadeIn, SectionHeading } from "@/components/fade-in";
import { HOW_TO_STEPS } from "@/lib/seo";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="how-heading"
            eyebrow="Процесс"
            title="Как подключиться к Яндекс Такси через «Армаду»"
            description="Пять шагов от заявки до выхода на линию: оформление в таксопарке и активация аккаунта."
          />
        </FadeIn>

        <ol className="relative mt-14 space-y-0">
          <div
            className="absolute left-[19px] top-4 bottom-4 w-px bg-divider-glow sm:left-1/2 sm:-translate-x-px"
            aria-hidden
          />
          {HOW_TO_STEPS.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <FadeIn key={step.title} delay={index * 0.06}>
                <li className="relative grid gap-4 py-6 sm:grid-cols-2 sm:gap-10 sm:py-8">
                  <div
                    className={`flex items-start gap-4 sm:contents ${
                      isEven ? "" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`pl-12 sm:pl-0 ${
                        isEven
                          ? "sm:text-right sm:pr-12"
                          : "sm:col-start-2 sm:pl-12"
                      }`}
                    >
                      <p className="font-display text-sm font-semibold text-accent">
                        Шаг {index + 1}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {step.text}
                      </p>
                    </div>
                    <span className="absolute left-0 top-8 flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-surface text-sm font-bold text-accent shadow-glow-sm sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
                      {index + 1}
                    </span>
                    <div
                      className={
                        isEven
                          ? "hidden sm:block"
                          : "hidden sm:block sm:col-start-1 sm:row-start-1"
                      }
                    />
                  </div>
                </li>
              </FadeIn>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
