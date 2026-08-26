"use client";

import Link from "next/link";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { FaqList } from "@/components/faq-list";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/lib/seo";

type FaqProps = {
  /** Homepage preview: first N items + link to /faq/ */
  previewCount?: number;
  /** На /faq/ H1 уже в шапке страницы — не дублировать тем же H2. */
  hideHeading?: boolean;
};

export function Faq({ previewCount, hideHeading = false }: FaqProps) {
  const items =
    typeof previewCount === "number"
      ? FAQ_ITEMS.slice(0, previewCount)
      : FAQ_ITEMS;
  const isPreview = typeof previewCount === "number";

  return (
    <section
      id="faq"
      className="section-anchor relative py-8 sm:py-16 lg:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {hideHeading ? null : (
          <FadeIn>
            <SectionHeading
              id="faq-heading"
              eyebrow="FAQ"
              title="Частые вопросы о подключении к Яндекс Такси"
              description="Ответы про самозанятость, трудовой договор, лицензию ФГИС, ОСГОП, доставку и оформление в таксопарке «Армада»."
            />
          </FadeIn>
        )}

        <FadeIn className={hideHeading ? undefined : "mt-8 sm:mt-10"}>
          <FaqList items={items} />
        </FadeIn>

        {isPreview ? (
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/faq/">Все вопросы и ответы →</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
