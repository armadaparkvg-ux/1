/**
 * Короткий ответ в начале страницы — для людей и для ИИ-поиска.
 * HTML-список, без FAQPage / HowTo.
 */
export function PageAnswer({
  items,
}: {
  items: readonly { label: string; value: string }[];
}) {
  return (
    <div className="mt-6 max-w-2xl rounded-2xl border border-border/80 bg-[#0b111c]/70 p-4 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
        Коротко
      </p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-medium text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold leading-snug text-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
