"use client";

import Link from "next/link";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/lib/seo";

type FaqProps = {
  /** Homepage preview: first N items + link to /faq/ */
  previewCount?: number;
};

export function Faq({ previewCount }: FaqProps) {
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
        <FadeIn>
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            title="Частые вопросы о подключении к Яндекс Такси"
            description="Ответы про самозанятость, трудовой договор, лицензию ФГИС, ОСГОП, доставку и оформление в таксопарке «Армада»."
          />
        </FadeIn>

        <FadeIn className="mt-8 sm:mt-10">
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
