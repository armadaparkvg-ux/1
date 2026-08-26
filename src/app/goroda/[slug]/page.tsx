import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLanding } from "@/components/city-landing";
import { RelatedGuides } from "@/components/related-guides";
import { getCity, getCitySlugs } from "@/lib/cities";
import { pageMetadata } from "@/lib/seo-meta";

export function generateStaticParams() {
  return getCitySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const city = getCity(params.slug);
  if (!city) return {};
  return pageMetadata({
    title: city.title,
    description: city.description,
    path: `/goroda/${city.slug}/`,
  });
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = getCity(params.slug);
  if (!city) notFound();
  return (
    <>
      <CityLanding city={city} />
      <RelatedGuides
        topic="taxi"
        title={`Подключение ${city.inCity}: такси, трудовой, доставка`}
        description="Оформление удалённое — те же форматы, что на федеральных страницах."
      />
    </>
  );
}
