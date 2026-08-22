import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { HomeDestinations } from "@/components/home-destinations";
import { MaxChannel } from "@/components/max-channel";
import { Contacts } from "@/components/contacts";
import { LegacyHashRedirect } from "@/components/legacy-hash-redirect";
import { SITE } from "@/lib/constants";
import { buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: SITE.title,
  },
  description: SITE.description,
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
  },
};

const jsonLd = buildJsonLd();

/**
 * Главная — компактная витрина направлений.
 * «О парке» вынесено на /o-parke/.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegacyHashRedirect />
      <Hero />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <HomeDestinations />
      <MaxChannel />
      <Contacts />
    </>
  );
}
