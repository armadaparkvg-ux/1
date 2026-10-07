import Link from "next/link";
import { FaqList } from "@/components/faq-list";

type FaqItem = { q: string; a: string };

export function PageFaq({
  title,
  items,
}: {
  title: string;
  items: readonly FaqItem[];
}) {
  return (
    <section
      id="faq"
      className="border-t border-border py-10 sm:py-14"
      aria-labelledby="page-faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2
          id="page-faq-heading"
          className="font-display text-2xl font-semibold text-foreground"
        >
          {title}
        </h2>
        <div className="mt-6">
          <FaqList items={items} />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Больше ответов — на странице{" "}
          <Link href="/faq/" className="text-accent hover:underline">
            частых вопросов
          </Link>
          .
        </p>
      </div>
    </section>
  );
}