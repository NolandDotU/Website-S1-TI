import { z } from "zod";

// Admin login
export const AdminLoginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const AdminRegisterSchema = z.object({
  id: z.string(),
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type AdminLoginDTO = z.infer<typeof AdminLoginSchema>;
export type AdminRegisterDTO = z.infer<typeof AdminRegisterSchema>;

export interface AuthResponseDTO {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    photo: string | null | undefined;
    authProvider: string;
  };
  accessToken: string;
  refreshToken: string;
}
