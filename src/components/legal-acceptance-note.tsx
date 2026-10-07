import Link from "next/link";
import { cn } from "@/lib/utils";

/** Короткая юридическая оговорка у кнопок регистрации / заявки */
export function LegalAcceptanceNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-center text-[11px] leading-snug text-muted-foreground/90",
        className
      )}
    >
      Нажимая «Авторегистрация» или обращаясь в поддержку парка, вы принимаете{" "}
      <Link href="/offer/" className="text-accent underline-offset-2 hover:underline">
        агентское соглашение (оферту)
      </Link>{" "}
      и{" "}
      <Link
        href="/privacy/"
        className="text-accent underline-offset-2 hover:underline"
      >
        политику конфиденциальности
      </Link>
      .
    </p>
  );
}
