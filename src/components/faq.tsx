"use client";

import { FadeIn, SectionHeading } from "@/components/fade-in";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/seo";

export function Faq() {
  return (
    <section
      id="faq"
      className="section-anchor relative py-12 sm:py-20 lg:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            title="Частые вопросы о подключении к Яндекс Такси"
            description="Ответы про самозанятость, трудовой договор, лицензию ФГИС, ОСГОП и оформление в таксопарке «Армада»."
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
