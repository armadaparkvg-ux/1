import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DestinationHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  accent?: "amber" | "emerald";
  children?: React.ReactNode;
};

export function DestinationHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  onPrimaryClick,
  accent = "amber",
  children,
}: DestinationHeroProps) {
  const isEmerald = accent === "emerald";

  return (
    <section
      data-hero
      className="relative isolate overflow-hidden border-b border-border bg-[#080b11] pt-24 sm:pt-28"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-65"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07090d] via-[#07090d]/88 to-[#07090d]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-[#07090d]/35" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          На главную
        </Link>
        <div className="mt-10 max-w-3xl sm:mt-12">
          <p
            className={cn(
              "inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur",
              isEmerald
                ? "border-emerald-glow/30 bg-emerald-glow/10 text-emerald-glow"
                : "border-accent/30 bg-accent/10 text-accent"
            )}
          >
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:mt-5 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
            {description}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              asChild
              shine
              size="lg"
              variant={isEmerald ? "emerald" : "default"}
              className="w-full sm:w-auto"
            >
              <Link href={primaryHref} onClick={onPrimaryClick}>
                {primaryLabel}
              </Link>
            </Button>
            {secondaryHref && secondaryLabel ? (
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
          {children ? <div className="mt-8 sm:mt-10">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
