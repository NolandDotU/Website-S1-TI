import { z } from "zod";

export const NewsValidation = z.object({
  title: z
    .string()
    .max(100, "Judul tidak boleh lebih dari 100 karakter")
    .min(4, "Judul tidak boleh kurang dari 4 karakter"),
  category: z.enum(["berita", "lowongan", "pengumuman"]),
  content: z.string(),
  link: z.string().url().optional(),
  photo: z.string().optional(),
  eventDate: z.date().optional(),
});

export const UpdateNewsValidation = z.object({
  title: z
    .string()
    .max(100, "Judul tidak boleh lebih dari 100 karakter")
    .min(4, "Judul tidak boleh kurang dari 4 karakter")
    .optional(),
  category: z.enum(["berita", "lowongan", "pengumuman"]).optional(),
  content: z.string().optional(),
  link: z.string().url().optional(),
  photo: z.string().optional(),
  eventDate: z.date().optional(),
});
