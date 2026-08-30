/** JSON-LD в исходнике HTML: переносы и пробелы, чтобы валидаторы и «Просмотр кода» находили @type. */
export function JsonLd({
  data,
  id,
}: {
  data: unknown;
  id?: string;
}) {
  const json = JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
