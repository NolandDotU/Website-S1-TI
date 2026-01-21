import z from "zod";

export interface IUser {
  id: string;
  email: string;
  username: string;
  role: string;
  photo: string | null | undefined;
  authProvider: string;
  isActive?: boolean;
}

export const UserValidation = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .max(100, "Username must be at most 100 characters long"),
  email: z.string().email("Please enter a valid email").toLowerCase(),
  fullname: z.string().optional(),
  role: z.enum(["admin", "user"]),
  photo: z.string().optional(),
  authProvider: z.enum(["local", "google"]).optional(),
  isActive: z.boolean().optional(),
});
