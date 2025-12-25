import userModel from "../../../model/userModel";
import { ApiError, JWTPayload } from "../../../utils";
import {
  AuthResponseDTO,
  AdminLoginDTO,
  AdminLoginSchema,
  AdminRegisterDTO,
} from "./auth.dto";
import { generateToken, generateRefreshToken } from "../../../utils";
import { logger } from "../../../utils";
import { hashingPassword } from "../../../utils";
import historyService from "../../../utils/history";

class AuthService {
  history: typeof historyService | null = historyService || null;

  async madeHistory(
    action: string,
    userId: any,
    entity: string,
    description?: string
  ) {
    if (this.history !== null) {
      await this.history.create({ user: userId, action, entity, description });
    }
  }
  async checkMe(id: string) {
    const user = await userModel.findById(id);
    if (!user) throw ApiError.notFound("User not found");
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      photo: user.photo,
      authProvider: user.authProvider,
    };
  }

  async createAdmin(data: AdminRegisterDTO, userId?: any) {
    const existing = await userModel.findOne({ email: data.email });
    if (existing) {
      await this.madeHistory("POST", existing.id, "auth");
      throw ApiError.conflict("Admin account already exists");
    }
    const user = await userModel.create(data);
    await this.madeHistory("POST", user.id, "auth");
    return user;
  }

  async assignRole(username: string, role: string) {
    const user = await userModel.findOne({ username });
    if (!user) throw ApiError.notFound("User not found");
    user.role = role;
    await user.save();
    return user;
  }

  async handleGoogleAuth(googleUser: any): Promise<AuthResponseDTO> {
    const { googleId, email, username, photo, emailVerified, fullname } =
      googleUser;

    logger.info("Google User", googleUser);

    let user = await userModel.findOne({ email });
    if (user) {
      if (user.isActive === false) {
        throw ApiError.unauthorized("User tidak aktif!");
      }
      user.googleId = googleId;
      user.photo = photo;
      user.isEmailVerified = emailVerified;
      user.lastLogin = new Date();
      await user.save();

      logger.info("Existing user logged in", user);
    } else {
      user = await userModel.create({
        googleId,
        email,
        photo,
        isEmailVerified: emailVerified,
        authProvider: "google",
        username,
        fullname,
      });
    }

    const { accessToken, refreshToken } = this.generateToken(user);

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        photo: user.photo,
        authProvider: user.authProvider,
      },
      accessToken,
      refreshToken,
    };
  }

  async adminLogin(data: AdminLoginDTO): Promise<AuthResponseDTO> {
    const { username, password } = data;
    const user = await userModel.findOne({ username });
    if (!user) throw ApiError.unauthorized("Username atau password salah!");

    logger.info("User", user);

    if (user?.role !== "admin")
      throw ApiError.unauthorized("User bukan admin!");
    if (!user.isActive) throw ApiError.unauthorized("User tidak aktif!");
    if (!user.password && user.googleId)
      throw ApiError.unauthorized("Login menggunakan Google!");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      throw ApiError.unauthorized("Email atau password salah!");

    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = this.generateToken(user);

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        photo: user.photo,
        authProvider: user.authProvider,
      },
      accessToken,
      refreshToken,
    };
  }

  async updateAdminPassword(data: AdminLoginDTO) {
    const { username, password } = data;
    const user = await userModel.findOne({ username });

    if (!user) throw ApiError.unauthorized("User tidak di temukan!");

    user.password = await hashingPassword(password);
    await user.save();
    return true;
  }

  private generateToken(user: any) {
    logger.info("Generating token : ", user);
    const payload: JWTPayload = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      authProvider: user.authProvider,
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }
}

const authService = new AuthService();
export default authService;
