"use client";

import { FadeIn, SectionHeading } from "@/components/fade-in";
import { Check } from "lucide-react";

const REQUIREMENTS = [
  "Гражданство РФ (обязательно)",
  "Возраст от 21 года",
  "Водительский стаж от 3 лет",
  "Паспорт РФ и водительское удостоверение",
  "Свидетельство о регистрации ТС (СТС)",
  "Автомобиль, соответствующий требованиям Яндекс Такси",
  "Готовность пройти проверку документов парком",
  "Для лицензии ФГИС: фото СТС (2 стороны) и фото авто с 4 сторон",
];

export function Requirements() {
  return (
    <section
      id="requirements"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="requirements-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <FadeIn>
            <SectionHeading
              id="requirements-heading"
              align="left"
              eyebrow="Оформление"
              title="Условия оформления в таксопарк по трудовому договору"
              description="Требования для легального подключения к Яндекс Такси: документы, стаж, авто. Подготовим и проверим пакет вместе с вами."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <ul className="glass space-y-3 rounded-2xl p-6 sm:p-8">
              {REQUIREMENTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
