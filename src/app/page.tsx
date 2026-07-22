import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { FunnelNav } from "@/components/funnel-nav";
import { Trust } from "@/components/trust";
import { HowItWorks } from "@/components/how-it-works";
import { Directions } from "@/components/directions";
import { YandexRideTariffs } from "@/components/yandex-ride-tariffs";
import { Tariffs } from "@/components/tariffs";
import { TariffCompare } from "@/components/tariff-compare";
import { TariffQuiz } from "@/components/tariff-quiz";
import { LaborContract } from "@/components/labor-contract";
import { Requirements } from "@/components/requirements";
import { Services } from "@/components/services";
import { Taxes } from "@/components/taxes";
import { Reviews } from "@/components/reviews";
import { MaxChannel } from "@/components/max-channel";
import { Faq } from "@/components/faq";
import { ApplySection } from "@/components/apply-section";
import { Contacts } from "@/components/contacts";
import { FunnyVideo } from "@/components/funny-video";
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
 * Воронка (docs/ux-funnel-audit.md):
 * Парк → Как → Направления → Классы → Оформление →
 * Сравнение/квиз → детали → отзывы → FAQ → заявка.
 * Видео — после заявки (не в критическом пути).
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <FunnelNav />
      <Trust />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <HowItWorks />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <Directions />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <YandexRideTariffs />
      <Tariffs />
      <TariffCompare />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <TariffQuiz />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <LaborContract />
      <Taxes />
      <Requirements />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <Services />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <Reviews />
      <MaxChannel />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <Faq />
      <div className="divider-glow mx-auto max-w-7xl" aria-hidden />
      <ApplySection />
      <Contacts />
      <FunnyVideo />
    </>
  );
}
