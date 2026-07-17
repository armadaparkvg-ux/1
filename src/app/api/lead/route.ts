import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Проверьте правильность заполнения формы",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Stub: in production send to CRM / email / messenger bot
    console.info("[lead]", {
      ...parsed.data,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      message: "Заявка принята",
    });
  } catch {
    return NextResponse.json(
      { error: "Не удалось обработать заявку" },
      { status: 500 }
    );
  }
}
