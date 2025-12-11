import { z } from "zod";

export const LecturerValidation = z.object({
  _id: z.string(),
  username: z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .max(100, "Username must be at most 100 characters long"),
  fullname: z
    .string()
    .min(4, "Fullname must be at least 4 characters long")
    .max(100, "Fullname must be at most 100 characters long"),
  email: z.string().email("Please enter a valid email").toLowerCase(),
  expertise: z.array(z.string()),
  externalLink: z.string().optional(),
  photo: z.string().optional(),
});

export const queryLecturerSchema = z.object({
  page: z.string().transform(Number).default(1).optional(),
  limit: z.string().transform(Number).default(10).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["name", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
