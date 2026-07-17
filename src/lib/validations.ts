import { z } from "zod";

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Укажите имя (минимум 2 символа)")
    .max(80, "Слишком длинное имя"),
  phone: z
    .string()
    .min(10, "Укажите корректный телефон")
    .max(20, "Слишком длинный номер")
    .refine((value) => {
      const digits = normalizePhone(value).replace(/^\+/, "");
      const normalized = digits.startsWith("8")
        ? `7${digits.slice(1)}`
        : digits;
      return /^7\d{10}$/.test(normalized);
    }, "Укажите номер в формате +7 XXX XXX-XX-XX"),
  telegram: z
    .string()
    .max(64, "Слишком длинный Telegram")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .min(2, "Укажите город")
    .max(80, "Слишком длинное название города"),
  car: z
    .string()
    .min(2, "Укажите автомобиль")
    .max(120, "Слишком длинное описание авто"),
  option: z.enum(["3% + 300₽", "5% + 100₽", "6% без списаний"], {
    message: "Выберите вариант оформления",
  }),
  comment: z
    .string()
    .max(1000, "Комментарий слишком длинный")
    .optional()
    .or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadFormData = z.infer<typeof leadSchema>;
