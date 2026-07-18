import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Trust } from "@/components/trust";
import { Tariffs } from "@/components/tariffs";
import { LaborContract } from "@/components/labor-contract";
import { MaxChannel } from "@/components/max-channel";
import { Services } from "@/components/services";
import { Taxes } from "@/components/taxes";
import { Requirements } from "@/components/requirements";
import { HowItWorks } from "@/components/how-it-works";
import { TariffQuiz } from "@/components/tariff-quiz";
import { Faq } from "@/components/faq";
import { ApplySection } from "@/components/apply-section";
import { Contacts } from "@/components/contacts";
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Trust />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <TariffQuiz />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <Tariffs />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <LaborContract />
      <MaxChannel />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <Services />
      <Taxes />
      <Requirements />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <HowItWorks />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <Faq />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <ApplySection />
      <Contacts />
    </>
  );
}
