/**
 * Adaptive hero for /trudovoj-dogovor/ (srcset WebP + JPEG).
 * Widths: 480 / 640 / 768 / 1024 / 1280.
 */
export function LaborLimitHeroBanner({ className = "" }: { className?: string }) {
  const alt =
    "Превысил лимит по самозанятости и не хочешь переходить на ИП? Подключайся в парк Армада по ТК РФ — есть решение, поможем!";

  return (
    <picture className={className}>
      <source
        type="image/webp"
        srcSet={[
          "/images/labor-limit-hero-480.webp 480w",
          "/images/labor-limit-hero-640.webp 640w",
          "/images/labor-limit-hero-768.webp 768w",
          "/images/labor-limit-hero-1024.webp 1024w",
          "/images/labor-limit-hero-1280.webp 1280w",
        ].join(", ")}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) min(100vw, 1280px), 1280px"
      />
      <source
        type="image/jpeg"
        srcSet={[
          "/images/labor-limit-hero-480.jpg 480w",
          "/images/labor-limit-hero-640.jpg 640w",
          "/images/labor-limit-hero-768.jpg 768w",
          "/images/labor-limit-hero-1024.jpg 1024w",
          "/images/labor-limit-hero-1280.jpg 1280w",
        ].join(", ")}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) min(100vw, 1280px), 1280px"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/labor-limit-hero.jpg"
        alt={alt}
        width={1280}
        height={1280}
        decoding="async"
        fetchPriority="high"
        className="mx-auto h-auto w-full max-w-full object-contain"
      />
    </picture>
  );
}
