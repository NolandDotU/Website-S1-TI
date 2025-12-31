"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementSchema = void 0;
const zod_1 = require("zod");
exports.AnnouncementSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .min(4, "Title minimal 4 karakter")
        .max(100, "Title maksimal 100 karakter"),
    category: zod_1.z
        .string()
        .refine((val) => ["event", "lowongan", "pengumuman"].includes(val), {
        message: "Category tidak valid",
    }),
    content: zod_1.z
        .string()
        .min(300, "Konten minimal 300 karakter")
        .max(6000, "Konten maksimal 6000 karakter"),
    link: zod_1.z.string().url("Link harus berupa URL valid").optional(),
    photo: zod_1.z.string().url("Photo harus berupa URL valid").optional(),
    source: zod_1.z.string().max(100, "Source maksimal 100 karakter").optional(),
    status: zod_1.z
        .enum(["draft", "scheduled", "published", "archived"])
        .default("draft"),
    scheduleDate: zod_1.z.preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date().optional()),
    eventDate: zod_1.z.preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date().optional()),
})
    .superRefine((data, ctx) => {
    if (data.status === "scheduled" && !data.scheduleDate) {
        ctx.addIssue({
            path: ["scheduleDate"],
            message: "scheduleDate wajib diisi jika status scheduled",
            code: zod_1.z.ZodIssueCode.custom,
        });
    }
    if (data.category === "event" && !data.eventDate) {
        ctx.addIssue({
            path: ["eventDate"],
            message: "eventDate wajib diisi untuk kategori event",
            code: zod_1.z.ZodIssueCode.custom,
        });
    }
});
//# sourceMappingURL=announcement.validation.js.map