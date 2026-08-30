import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Kept for call-site compatibility; ignored (content must stay visible without JS). */
  delay?: number;
  y?: number;
  once?: boolean;
};

/**
 * Lightweight section wrapper — no opacity:0 / framer-motion.
 * Previous FadeIn hid SSR HTML until hydration + IntersectionObserver,
 * which looked like empty gaps and a broken page on slow mobile.
 */
export function FadeIn({ children, className }: FadeInProps) {
  return <div className={className}>{children}</div>;
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function Stagger({ children, className }: StaggerProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "center",
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
  id?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-3 sm:space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-medium tracking-wide text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
