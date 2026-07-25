/**
 * Adaptive labor-contract promo for /taxi/#labor-contract (static srcset).
 */
export function LaborContractBanner({ className = "" }: { className?: string }) {
  const alt =
    "Не можешь оформить самозанятость или ИП — подключайся в парк Армада по трудовому договору. Есть решение, поможем!";

  return (
    <picture className={className}>
      <source
        type="image/webp"
        srcSet={[
          "/images/labor-contract-480.webp 480w",
          "/images/labor-contract-640.webp 640w",
          "/images/labor-contract-768.webp 768w",
          "/images/labor-contract-1024.webp 1024w",
        ].join(", ")}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 560px"
      />
      <source
        type="image/jpeg"
        srcSet={[
          "/images/labor-contract-480.jpg 480w",
          "/images/labor-contract-640.jpg 640w",
          "/images/labor-contract-768.jpg 768w",
          "/images/labor-contract-1024.jpg 1024w",
        ].join(", ")}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 560px"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/labor-contract-banner.jpg"
        alt={alt}
        width={1024}
        height={1024}
        loading="lazy"
        decoding="async"
        className="mx-auto h-auto w-full max-w-full rounded-2xl object-contain shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)]"
      />
    </picture>
  );
}

/** Same creative for each of the 3 labor tariff cards (responsive). */
export function LaborTariffCardImage({
  badge,
  alt,
}: {
  badge?: string | null;
  alt: string;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-[#0a0a0a] sm:aspect-[5/4]">
      <picture>
        <source
          type="image/webp"
          srcSet={[
            "/images/labor-contract-480.webp 480w",
            "/images/labor-contract-640.webp 640w",
            "/images/labor-contract-768.webp 768w",
            "/images/labor-contract-1024.webp 1024w",
          ].join(", ")}
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/labor-contract-banner.jpg"
          alt={alt}
          width={1024}
          height={1024}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1724] via-transparent to-transparent" />
      {badge ? (
        <span className="absolute left-4 top-4 rounded-full bg-accent/95 px-3 py-1 text-xs font-semibold text-accent-foreground">
          {badge}
        </span>
      ) : null}
    </div>
  );
}
