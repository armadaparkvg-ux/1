"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Phone, RotateCcw } from "lucide-react";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { useApply } from "@/components/messenger-apply";
import { CONTACTS } from "@/lib/constants";
import {
  type QuizAnswers,
  type QuizFormat,
  type QuizGoal,
  type QuizPriority,
  QUIZ_FORMATS,
  QUIZ_GOALS,
  QUIZ_PRIORITIES,
  buildQuizApplyMessage,
  resolveQuizResult,
} from "@/lib/quiz";
import {
  copyText,
  maxApplyUrl,
  openMessenger,
  telegramApplyUrl,
} from "@/lib/apply";
import { trackGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

function OptionButton({
  selected,
  label,
  hint,
  onClick,
}: {
  selected?: boolean;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
        "hover:border-accent/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        selected
          ? "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(245,158,11,0.25)]"
          : "border-border bg-surface/40"
      )}
    >
      <span className="block font-medium text-foreground">{label}</span>
      <span className="mt-1 block text-sm text-muted-foreground">{hint}</span>
    </button>
  );
}

export function TariffQuiz() {
  const { openApply } = useApply();
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => resolveQuizResult(answers), [answers]);
  const needsFormat =
    answers.goal === "connect" || answers.goal === "unsure";
  const maxSteps = !answers.goal
    ? 3
    : answers.goal === "delivery" ||
        answers.goal === "fgis" ||
        answers.goal === "osgop"
      ? 2
      : needsFormat
        ? answers.format === "labor" || answers.format === "help"
          ? 4
          : 3
        : 2;
  const progressStep =
    step === 1
      ? 1
      : step === 4 && !needsFormat
        ? 2
        : step === 4 && needsFormat && (answers.format === "self" || answers.format === "ip")
          ? 3
          : Math.min(step, maxSteps);

  const reset = () => {
    setAnswers({});
    setStep(1);
    setCopied(false);
  };

  const chooseGoal = (goal: QuizGoal) => {
    setAnswers({ goal });
    trackGoal("quiz_goal", { goal });
    if (
      goal === "fgis" ||
      goal === "osgop" ||
      goal === "delivery"
    ) {
      setStep(4);
    } else {
      setStep(2);
    }
  };

  const chooseFormat = (format: QuizFormat) => {
    setAnswers((prev) => ({ ...prev, format }));
    if (format === "self" || format === "ip") {
      setStep(4);
    } else {
      setStep(3);
    }
  };

  const choosePriority = (priority: QuizPriority) => {
    setAnswers((prev) => ({ ...prev, priority }));
    setStep(4);
  };

  const openTelegram = async () => {
    const message = buildQuizApplyMessage(result, answers);
    await copyText(message);
    openMessenger(telegramApplyUrl(message));
  };

  const openMax = async () => {
    const message = buildQuizApplyMessage(result, answers);
    const ok = await copyText(message);
    setCopied(ok);
    openMessenger(maxApplyUrl());
  };

  return (
    <section
      id="quiz"
      className="section-anchor relative py-12 sm:py-20 lg:py-24"
      aria-labelledby="quiz-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="quiz-heading"
            eyebrow="Шаг 5 · Если сомневаетесь"
            title="Квиз: такси, доставка или услуга"
            description="Сначала направление или услуга — затем формат парка. Подберём тариф и отправим заявку в мессенджер."
          />
        </FadeIn>

        <FadeIn delay={0.08} className="mt-10">
          <div className="rounded-2xl border border-border bg-[#0f1724]/80 p-5 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Шаг {progressStep} из {maxSteps}
              </p>
              {step !== 1 ? (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Начать заново
                </button>
              ) : null}
            </div>

            <div
              className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted"
              aria-hidden
            >
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{
                  width: `${(progressStep / maxSteps) * 100}%`,
                }}
              />
            </div>

            {step === 1 ? (
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Что нужно сделать?
                </h3>
                <div className="mt-4 grid gap-3">
                  {QUIZ_GOALS.map((item) => (
                    <OptionButton
                      key={item.id}
                      label={item.label}
                      hint={item.hint}
                      selected={answers.goal === item.id}
                      onClick={() => chooseGoal(item.id)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  В каком формате хотите работать?
                </h3>
                <div className="mt-4 grid gap-3">
                  {QUIZ_FORMATS.map((item) => (
                    <OptionButton
                      key={item.id}
                      label={item.label}
                      hint={item.hint}
                      selected={answers.format === item.id}
                      onClick={() => chooseFormat(item.id)}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-4"
                  onClick={() => setStep(1)}
                >
                  Назад
                </Button>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Что для вас важнее?
                </h3>
                <div className="mt-4 grid gap-3">
                  {QUIZ_PRIORITIES.map((item) => (
                    <OptionButton
                      key={item.id}
                      label={item.label}
                      hint={item.hint}
                      selected={answers.priority === item.id}
                      onClick={() => choosePriority(item.id)}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-4"
                  onClick={() => setStep(2)}
                >
                  Назад
                </Button>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-accent">
                  Ваш вариант
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-foreground text-balance">
                  {result.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {result.summary}
                </p>
                <ul className="mt-5 space-y-2">
                  {result.why.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {result.nextHref ? (
                  <div className="mt-6">
                    <Button asChild size="lg" shine className="w-full">
                      <Link
                        href={result.nextHref}
                        onClick={() => trackGoal("quiz_to_courier")}
                      >
                        {result.nextLabel ?? "Продолжить"}
                      </Link>
                    </Button>
                  </div>
                ) : null}

                {copied ? (
                  <p className="mt-4 text-sm text-emerald-400" role="status">
                    Текст скопирован — вставьте в чат MAX.
                  </p>
                ) : null}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    shine
                    onClick={openTelegram}
                  >
                    Написать в Telegram
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="emerald"
                    shine
                    onClick={openMax}
                  >
                    Сообщение в MAX
                  </Button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Button asChild size="lg" variant="secondary">
                    <a href={CONTACTS.phoneHref}>
                      <Phone className="h-4 w-4" aria-hidden />
                      Позвонить {CONTACTS.phoneDisplay}
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="ghost"
                    onClick={() => openApply(result.topic)}
                  >
                    Выбрать другой мессенджер
                  </Button>
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Оформление удалённо по всей России · {CONTACTS.hours}
                </p>
              </div>
            ) : null}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
