import { Search } from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type FgisCheckButtonProps = {
  className?: string;
  size?: "default" | "lg";
};

/** Яркая CTA-кнопка проверки ФГИС с переливом и мерцанием. */
export function FgisCheckButton({
  className,
  size = "default",
}: FgisCheckButtonProps) {
  return (
    <a
      href={CONTACTS.fgisCheck}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "btn-fgis group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold text-accent-foreground",
        "bg-[length:200%_200%] bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400",
        "animate-fgis-attention",
        "transition-transform duration-300 hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        size === "lg" ? "h-12 px-7 text-base" : "h-11 px-5 text-sm",
        className
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine-loop"
        aria-hidden
      />
      <Search className="relative z-10 h-4 w-4 shrink-0" aria-hidden />
      <span className="relative z-10">Проверить ФГИС Такси</span>
    </a>
  );
}
