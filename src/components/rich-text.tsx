import type { ReactNode } from "react";
import Link from "next/link";

const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]+|https?:\/\/[^)\s]+)\)/g;

type RichTextProps = {
  text: string;
  as?: "p" | "span" | "li";
  className?: string;
};

/** Рендер абзаца с markdown-ссылками `[анкор](/path/)`. */
export function RichText({ text, as = "p", className }: RichTextProps) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  const re = new RegExp(LINK_RE.source, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const label = match[1];
    const href = match[2];
    if (href.startsWith("/")) {
      nodes.push(
        <Link key={key++} href={href} className="text-accent hover:underline">
          {label}
        </Link>
      );
    } else {
      nodes.push(
        <a
          key={key++}
          href={href}
          className="text-accent hover:underline"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));

  if (as === "li") {
    return <li className={className}>{nodes}</li>;
  }
  if (as === "span") {
    return <span className={className}>{nodes}</span>;
  }
  return <p className={className}>{nodes}</p>;
}
