/**
 * Adaptive delivery hero for static hosting (srcset WebP + JPEG).
 * Widths: 480 / 768 / 1024 / 1280 / 1536.
 */
export function DeliveryHeroBanner({ className = "" }: { className?: string }) {
  const alt =
    "Армада — партнёр Яндекс Доставки: курьер, легковой авто и грузовой фургон. Стань профессионалом вместе с нами";

  return (
    <picture className={className}>
      <source
        type="image/webp"
        srcSet={[
          "/images/delivery-hero-banner-480.webp 480w",
          "/images/delivery-hero-banner-768.webp 768w",
          "/images/delivery-hero-banner-1024.webp 1024w",
          "/images/delivery-hero-banner-1280.webp 1280w",
          "/images/delivery-hero-banner-1536.webp 1536w",
        ].join(", ")}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1536px"
      />
      <source
        type="image/jpeg"
        srcSet={[
          "/images/delivery-hero-banner-480.jpg 480w",
          "/images/delivery-hero-banner-768.jpg 768w",
          "/images/delivery-hero-banner-1024.jpg 1024w",
          "/images/delivery-hero-banner-1280.jpg 1280w",
          "/images/delivery-hero-banner-1536.jpg 1536w",
        ].join(", ")}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1536px"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/delivery-hero-banner.jpg"
        alt={alt}
        width={1536}
        height={1024}
        decoding="async"
        fetchPriority="high"
        className="mx-auto h-auto w-full max-w-full max-h-[min(58vw,420px)] object-contain sm:max-h-[min(52vw,560px)] lg:max-h-none"
      />
    </picture>
  );
}
