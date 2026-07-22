import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground shadow-glow-sm hover:bg-accent-soft hover:scale-[1.03] hover:shadow-glow",
        secondary:
          "bg-surface-elevated text-foreground border border-border hover:border-accent/40 hover:bg-muted hover:scale-[1.03]",
        outline:
          "border border-accent/50 bg-transparent text-accent hover:bg-accent/10 hover:scale-[1.03]",
        ghost:
          "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60",
        emerald:
          "bg-emerald-glow text-white shadow-[0_0_24px_-6px_rgba(16,185,129,0.45)] hover:brightness-110 hover:scale-[1.03]",
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
  /** Premium continuous shimmer — for registration / primary funnel CTAs */
  shine?: boolean;
  /** Premium soft pulse — for chat / messenger CTAs */
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
        ? "animate-chat-pulse"
        : variant === "outline"
          ? "animate-chat-pulse-outline"
          : "animate-chat-pulse-amber";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          shine &&
            "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:opacity-100 before:content-[''] before:animate-shine-loop",
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
