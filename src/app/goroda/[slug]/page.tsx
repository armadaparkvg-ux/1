import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLanding } from "@/components/city-landing";
import { getCity, getCitySlugs } from "@/lib/cities";
import { SITE } from "@/lib/constants";

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
  return {
    title: city.title,
    description: city.description,
    alternates: { canonical: `${SITE.url}/goroda/${city.slug}/` },
    openGraph: {
      title: city.title,
      description: city.description,
      url: `${SITE.url}/goroda/${city.slug}/`,
    },
  };
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = getCity(params.slug);
  if (!city) notFound();
  return <CityLanding city={city} />;
}
