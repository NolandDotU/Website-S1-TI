import { z } from "zod";
import { IUserResponse } from "../users/user.dto";
// Admin login
export const LocalLoginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const AdminRegisterSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid").optional(),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LocalLoginDTO = z.infer<typeof LocalLoginSchema>;
export type AdminRegisterDTO = z.infer<typeof AdminRegisterSchema>;

export interface AuthResponseDTO {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
}
