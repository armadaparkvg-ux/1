import type { Metadata } from "next";
import { AboutParkLanding } from "@/components/about-park-landing";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/constants";
import {
  breadcrumbJsonLd,
  graphJsonLd,
  webpageJsonLd,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "О парке «Армада» — знакомство с таксопарком",
  description:
    "Таксопарк «Армада»: 7+ лет на рынке, 3 800+ самозанятых водителей, 1 180 по трудовому договору, 2 368+ курьеров, более 5 000 реестров ФГИС.",
  alternates: { canonical: `${SITE.url}/o-parke/` },
  openGraph: {
    title: "О парке «Армада»",
    description:
      "7+ лет на рынке · 3 800+ самозанятых · 1 180 трудовых · 2 368+ курьеров · 5 000+ ФГИС",
    url: `${SITE.url}/o-parke/`,
  },
};

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
      { name: "О парке", href: "/o-parke/" },
    ]),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <AboutParkLanding />
    </>
  );
}
