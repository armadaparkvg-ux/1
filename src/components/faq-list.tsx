import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: string };

/**
 * FAQ в обычном HTML (`details`): ответы есть в исходнике страницы
 * даже в свёрнутом виде — так Яндекс и нейропоиск читают блок без JS.
 */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-surface/30">
      {items.map((item) => (
        <details key={item.q} className="group px-4 sm:px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-medium text-foreground transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
