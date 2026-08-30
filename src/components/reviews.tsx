"use client";

import { Star } from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { REVIEWS } from "@/lib/reviews";

export function Reviews() {
  return (
    <section
      id="reviews"
      className="section-anchor relative py-12 sm:py-20 lg:py-24"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="reviews-heading"
            eyebrow="Отзывы"
            title="Что говорят водители парка «Армада»"
            description="Реальные сценарии подключения: самозанятый, ИП, трудовой договор, лицензия ФГИС. Оформление удалённо по всей России."
          />
        </FadeIn>

        <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {REVIEWS.map((review) => (
            <StaggerItem key={`${review.name}-${review.city}`}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-5 sm:p-6">
                <div className="flex gap-0.5" aria-label={`Оценка ${review.rating} из 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-accent text-accent"
                          : "text-muted-foreground/40"
                      }`}
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                  «{review.text}»
                </blockquote>
                <figcaption className="mt-4 border-t border-border/70 pt-3 text-sm">
                  <span className="font-semibold text-foreground">
                    {review.name}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {review.city} · {review.role}
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
