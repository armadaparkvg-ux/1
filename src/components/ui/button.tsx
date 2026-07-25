import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Unified premium button system:
 * - Primary (default / emerald): soft gold or emerald fill, calm slow gleam
 * - Secondary / outline: quiet elevated surface
 * - shine: exclusive slow shimmer (not flashy)
 * - pulse: reserved for chat — soft static glow, no aggressive rings
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-accent-foreground shadow-[0_8px_28px_-10px_rgba(245,158,11,0.55)] hover:brightness-105 hover:scale-[1.02]",
        secondary:
          "bg-surface-elevated text-foreground border border-border/90 hover:border-amber-400/35 hover:bg-muted/80 hover:scale-[1.02]",
        outline:
          "border border-amber-400/40 bg-transparent text-amber-200 hover:bg-amber-400/10 hover:border-amber-300/55 hover:scale-[1.02]",
        ghost:
          "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60",
        emerald:
          "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-[0_8px_28px_-10px_rgba(16,185,129,0.45)] hover:brightness-105 hover:scale-[1.02]",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Calm premium gleam — primary CTAs / registration */
  shine?: boolean;
  /** Soft glow for chat buttons (no flashy pulse rings) */
  pulse?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      shine = false,
      pulse = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const pulseClass =
      variant === "emerald"
        ? "shadow-[0_0_22px_-8px_rgba(16,185,129,0.5)]"
        : variant === "outline"
          ? "shadow-[0_0_18px_-10px_rgba(245,158,11,0.35)]"
          : "shadow-[0_0_22px_-8px_rgba(245,158,11,0.4)]";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          shine &&
            "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/22 before:to-transparent before:opacity-90 before:content-[''] before:animate-shine-soft",
          pulse && pulseClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
