"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LABOR_OPTIONS } from "@/lib/constants";
import { leadSchema, type LeadFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";

const OPTION_VALUES = LABOR_OPTIONS.map((o) => o.value);

function normalizeOption(raw: string | null): LeadFormData["option"] | undefined {
  if (!raw) return undefined;
  const decoded = decodeURIComponent(raw);
  if (OPTION_VALUES.includes(decoded as LeadFormData["option"])) {
    return decoded as LeadFormData["option"];
  }
  if (decoded.includes("3%")) return "3% + 300₽";
  if (decoded.includes("5%")) return "5% + 100₽";
  if (decoded.includes("6%")) return "6% без списаний";
  return undefined;
}

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      telegram: "",
      city: "",
      car: "",
      option: undefined,
      comment: "",
      website: "",
    },
  });

  const selectedOption = watch("option");

  useEffect(() => {
    const applyFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = normalizeOption(params.get("option"));
      if (fromQuery) {
        setValue("option", fromQuery, { shouldValidate: true });
      }
    };

    const onSelectOption = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      const opt = normalizeOption(detail);
      if (opt) setValue("option", opt, { shouldValidate: true });
    };

    applyFromUrl();
    window.addEventListener("armada:select-option", onSelectOption);
    return () => window.removeEventListener("armada:select-option", onSelectOption);
  }, [setValue]);

  const onSubmit = async (data: LeadFormData) => {
    if (data.website) return;
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Ошибка отправки");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Ошибка отправки");
    }
  };

  return (
    <section
      id="lead-form"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="form-heading"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="form-heading"
            eyebrow="Заявка"
            title="Заявка на подключение по трудовому договору"
            description="Единая форма для трёх вариантов ТД в Яндекс Такси. Менеджер свяжется с вами в рабочее время."
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="glass space-y-5 rounded-2xl p-6 sm:p-8"
            noValidate
          >
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <label htmlFor="website">Не заполняйте</label>
              <input
                id="website"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Имя" error={errors.name?.message}>
                <Input
                  placeholder="Иван"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </Field>
              <Field label="Телефон" error={errors.phone?.message}>
                <Input
                  placeholder="+7 900 000-00-00"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Telegram" error={errors.telegram?.message}>
                <Input
                  placeholder="@username"
                  autoComplete="off"
                  {...register("telegram")}
                />
              </Field>
              <Field label="Город" error={errors.city?.message}>
                <Input
                  placeholder="Москва"
                  autoComplete="address-level2"
                  aria-invalid={!!errors.city}
                  {...register("city")}
                />
              </Field>
            </div>

            <Field label="Автомобиль" error={errors.car?.message}>
              <Input
                placeholder="Марка, модель, год"
                aria-invalid={!!errors.car}
                {...register("car")}
              />
            </Field>

            <div>
              <Label className="mb-3 block">Вариант оформления</Label>
              <div className="grid gap-2" role="radiogroup" aria-label="Вариант оформления">
                {LABOR_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                      selectedOption === opt.value
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border bg-surface/40 text-muted-foreground hover:border-accent/40"
                    )}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      className="accent-amber-500"
                      {...register("option")}
                    />
                    <span>{opt.title}</span>
                  </label>
                ))}
              </div>
              {errors.option ? (
                <p className="mt-2 text-sm text-red-400" role="alert">
                  {errors.option.message}
                </p>
              ) : null}
            </div>

            <Field label="Комментарий" error={errors.comment?.message}>
              <Textarea
                placeholder="Дополнительная информация (необязательно)"
                {...register("comment")}
              />
            </Field>

            {status === "success" ? (
              <p className="rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300" role="status">
                Заявка отправлена. Мы свяжемся с вами в рабочее время.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300" role="alert">
                {serverError || "Не удалось отправить заявку. Попробуйте ещё раз или напишите в мессенджер."}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              shine
              className="w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Отправка…" : "Отправить заявку"}
            </Button>
          </form>
        </FadeIn>

      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
