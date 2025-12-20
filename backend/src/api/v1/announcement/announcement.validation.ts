import { z } from "zod";

export const AnnouncementSchema = z
  .object({
    title: z
      .string()
      .min(4, "Title minimal 4 karakter")
      .max(100, "Title maksimal 100 karakter"),

    category: z
      .string()
      .refine((val) => ["event", "lowongan", "pengumuman"].includes(val), {
        message: "Category tidak valid",
      }),

    content: z
      .string()
      .min(300, "Konten minimal 300 karakter")
      .max(6000, "Konten maksimal 6000 karakter"),

    link: z.string().url("Link harus berupa URL valid").optional(),

    photo: z.string().url("Photo harus berupa URL valid").optional(),

    source: z.string().max(100, "Source maksimal 100 karakter").optional(),

    status: z
      .enum(["draft", "scheduled", "published", "archived"])
      .default("draft"),

    scheduleDate: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    ),

    eventDate: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    ),
  })
  .superRefine((data, ctx) => {
    if (data.status === "scheduled" && !data.scheduleDate) {
      ctx.addIssue({
        path: ["scheduleDate"],
        message: "scheduleDate wajib diisi jika status scheduled",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.category === "event" && !data.eventDate) {
      ctx.addIssue({
        path: ["eventDate"],
        message: "eventDate wajib diisi untuk kategori event",
        code: z.ZodIssueCode.custom,
      });
    }
  });
