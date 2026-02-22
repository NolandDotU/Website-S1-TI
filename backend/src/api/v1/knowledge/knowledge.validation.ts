import { z } from "zod";

const kindSchema = z.enum(["contact", "service"]);

const synonymsSchema = z
  .array(z.string().trim().min(1, "Sinonim tidak boleh kosong"))
  .max(100, "Sinonim terlalu banyak");

export const KnowledgeCreateSchema = z.object({
  kind: kindSchema,
  title: z
    .string()
    .trim()
    .min(3, "Title minimal 3 karakter")
    .max(120, "Title maksimal 120 karakter"),
  content: z
    .string()
    .trim()
    .min(20, "Content minimal 20 karakter")
    .max(6000, "Content maksimal 6000 karakter"),
  link: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.string().trim().url("Link harus berupa URL valid").optional(),
  ),
  synonyms: synonymsSchema.optional().default([]),
});

export const KnowledgeUpdateSchema = z
  .object({
    kind: kindSchema.optional(),
    title: z
      .string()
      .trim()
      .min(3, "Title minimal 3 karakter")
      .max(120, "Title maksimal 120 karakter")
      .optional(),
    content: z
      .string()
      .trim()
      .min(20, "Content minimal 20 karakter")
      .max(6000, "Content maksimal 6000 karakter")
      .optional(),
    link: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.string().trim().url("Link harus berupa URL valid").optional(),
    ),
    synonyms: synonymsSchema.optional(),
  })
  .refine((val) => Object.keys(val).length > 0, {
    message: "Minimal satu field harus diubah",
  });
