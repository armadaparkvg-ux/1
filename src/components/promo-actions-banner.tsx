/**
 * Adaptive promo banner for «Акции и бонусы» (static hosting srcset).
 */
export function PromoActionsBanner({ className = "" }: { className?: string }) {
  const alt =
    "Регулярные розыгрыши и акции парка Армада — подключайся и получай бонусы, подпишись на каналы MAX и VK";

  return (
    <picture className={className}>
      <source
        type="image/webp"
        srcSet={[
          "/images/promo-actions-480.webp 480w",
          "/images/promo-actions-640.webp 640w",
          "/images/promo-actions-768.webp 768w",
          "/images/promo-actions-1024.webp 1024w",
        ].join(", ")}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 640px"
      />
      <source
        type="image/jpeg"
        srcSet={[
          "/images/promo-actions-480.jpg 480w",
          "/images/promo-actions-640.jpg 640w",
          "/images/promo-actions-768.jpg 768w",
          "/images/promo-actions-1024.jpg 1024w",
        ].join(", ")}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 640px"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/promo-actions.jpg"
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
