import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/lib/schema";
import { SITE } from "@/lib/constants";

function itemUrl(href: string) {
  if (href.startsWith("http")) return href;
  if (href === "/" || href === "") return `${SITE.url}/`;
  return `${SITE.url}${href.startsWith("/") ? href : `/${href}`}`;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="text-sm text-muted-foreground"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={item.href ?? item.name}
              className="inline-flex items-center gap-1"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {i > 0 ? (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 opacity-60"
                  aria-hidden
                />
              ) : null}
              {last || !item.href ? (
                <span itemProp="name" className="text-foreground/80">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  itemProp="item"
                  itemScope
                  itemType="https://schema.org/WebPage"
                  itemID={itemUrl(item.href)}
                  className="hover:text-accent transition-colors"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(i + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
