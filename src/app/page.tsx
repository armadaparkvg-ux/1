import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { HomeDestinations } from "@/components/home-destinations";
import { HomeCities } from "@/components/home-cities";
import { MaxChannel } from "@/components/max-channel";
import { Faq } from "@/components/faq";
import { Contacts } from "@/components/contacts";
import { LegacyHashRedirect } from "@/components/legacy-hash-redirect";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = pageMetadata({
  title: SITE.title,
  description: SITE.description,
  path: "/",
});

/**
 * Главная — компактная витрина направлений.
 * «О парке» вынесено на /o-parke/.
 */
export default function HomePage() {
  return (
    <>
      <LegacyHashRedirect />
      <Hero />
      <HomeDestinations />
      <HomeCities />
      <MaxChannel />
      <Faq previewCount={10} />
      <Contacts />
    </>
  );
}
