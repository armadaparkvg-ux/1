const AFTER = [
  {
    title: "Страница направления",
    text: "Там цена, кому подходит формат и что подготовить. Другие услуги на этой странице не мешают.",
  },
  {
    title: "Формат и заявка",
    text: "Самозанятый, ИП и курьер — форма Fleet. Трудовой договор и лицензия ФГИС — только сообщение в MAX или Telegram.",
  },
  {
    title: "Выход на линию",
    text: "Активация обычно 10–15 минут. В первый день сверьте парк, занятость и выплаты в Яндекс Про.",
  },
] as const;

export function ConnectPath() {
  return (
    <section className="py-10 sm:py-14" aria-labelledby="connect-path-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            После выбора
          </p>
          <h2
            id="connect-path-heading"
            className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl"
          >
            Что будет после карточки
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Карточка выше уже выбирает маршрут. Ниже — что произойдёт на
            странице, без второй развилки.
          </p>
        </div>

        <ol className="mt-6 grid gap-3 lg:grid-cols-3">
          {AFTER.map((step, index) => (
            <li key={step.title} className="premium-card rounded-2xl p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                Шаг {index + 1}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
