import type { Metadata } from "next";
import { AboutParkLanding } from "@/components/about-park-landing";
import { SITE } from "@/lib/constants";

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
  return <AboutParkLanding />;
}
