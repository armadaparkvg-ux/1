import type { Metadata } from "next";
import { AboutParkLanding } from "@/components/about-park-landing";
import { JsonLd } from "@/components/json-ld";
import { RelatedGuides } from "@/components/related-guides";
import {
  breadcrumbJsonLd,
  graphJsonLd,
  webpageJsonLd,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = pageMetadata({
  title: "О парке «Армада» — знакомство с таксопарком",
  description:
    "Таксопарк «Армада»: 7+ лет на рынке, 3 800+ самозанятых водителей, 1 180 по трудовому договору, 2 368+ курьеров, более 5 000 реестров ФГИС.",
  path: "/o-parke/",
});

export default function AboutParkPage() {
  const jsonLd = graphJsonLd([
    webpageJsonLd({
      path: "/o-parke/",
      name: "О парке «Армада» — знакомство с таксопарком",
      description:
        "7+ лет на рынке, 3 800+ самозанятых, трудовой договор, курьеры и ФГИС.",
    }),
    breadcrumbJsonLd([
      { name: "Главная", href: "/" },
      { name: "О парке" },
    ]),
  ]);
  return (
    <>
      <JsonLd id="jsonld-page" data={jsonLd} />
      <AboutParkLanding />
      <RelatedGuides
        topic="park"
        title="Как выбрать парк и подключиться удалённо"
        excludeHref="/o-parke/"
      />
    </>
  );
}
