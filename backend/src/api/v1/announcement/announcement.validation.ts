import { z } from "zod";

const Status = z
  .enum(["draft", "scheduled", "published", "archived"])
  .default("draft");

const scheduleDate = z.preprocess(
  (val) => (val ? new Date(val as string) : undefined),
  z.date().optional(),
);

export const StatusSchema = z
  .object({
    status: Status,
    scheduleDate: scheduleDate,
  })
  .superRefine((data, ctx) => {
    if (data.status === "scheduled" && !data.scheduleDate) {
      ctx.addIssue({
        path: ["scheduleDate"],
        message: "scheduleDate wajib diisi jika status scheduled",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const AnnouncementSchema = z
  .object({
    title: z
      .string()
      .min(4, "Title minimal 4 karakter")
      .max(100, "Title maksimal 100 karakter"),

    category: z
      .string()
      .lowercase()
      .refine(
        (val) => ["event", "lowongan", "pengumuman", "alumni"].includes(val),
        {
          message: "Kategori tidak valid",
        },
      ),

    content: z
      .string()
      .min(50, "Konten minimal 50 karakter")
      .max(6000, "Konten maksimal 6000 karakter"),

    link: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.string().url("Link harus berupa URL valid").optional(),
    ),

    photo: z.string().optional().nullable(),

    source: z
      .enum([
        "Lembaga Kemahasiswaan",
        "Kampus",
        "Fakultas",
        "External",
        "Program Studi",
        "",
      ])
      .optional()
      .default("Program Studi"),

    status: Status,

    scheduleDate: scheduleDate,

    eventDate: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional(),
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
