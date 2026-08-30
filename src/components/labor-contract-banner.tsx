/**
 * Adaptive labor promo — only for Step 2 «Трудовой договор» card on /taxi/.
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
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      <source
        type="image/jpeg"
        srcSet={[
          "/images/labor-contract-480.jpg 480w",
          "/images/labor-contract-640.jpg 640w",
          "/images/labor-contract-768.jpg 768w",
          "/images/labor-contract-1024.jpg 1024w",
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
        className="mx-auto h-auto w-full max-h-[min(88vw,340px)] rounded-xl object-contain sm:max-h-[400px]"
      />
    </picture>
  );
}
