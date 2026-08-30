"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { FaqList } from "@/components/faq-list";
import { useSiteAssistant } from "@/components/site-assistant";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/lib/seo";

type FaqProps = {
  /** Homepage preview: first N items + link to /faq/ */
  previewCount?: number;
  /** На /faq/ H1 уже в шапке страницы — не дублировать тем же H2. */
  hideHeading?: boolean;
};

export function Faq({ previewCount, hideHeading = false }: FaqProps) {
  const { openAssistant } = useSiteAssistant();
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

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isPreview ? (
            <Button asChild size="lg" variant="secondary">
              <Link href="/faq/">Все вопросы и ответы</Link>
            </Button>
          ) : null}
          <Button
            type="button"
            size="lg"
            variant={isPreview ? "outline" : "secondary"}
            onClick={() => openAssistant({ place: "faq" })}
          >
            <Search className="h-4 w-4" aria-hidden />
            Спросить пультом
          </Button>
        </div>
      </div>
    </section>
  );
}
