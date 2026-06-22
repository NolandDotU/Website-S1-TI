import userModel from "../../../model/userModel";
import { ApiError, CacheManager, JWTPayload } from "../../../utils";
import {
  AuthResponseDTO,
  LocalLoginSchema,
  LocalLoginDTO,
  AdminRegisterDTO,
} from "./auth.dto";
import { generateToken, generateRefreshToken } from "../../../utils";
import { logger } from "../../../utils";
import { hashingPassword } from "../../../utils";
import historyService from "../../../utils/history";
import { LecturerModel } from "../../../model/lecturerModel";
import mongoose from "mongoose";

class AuthService {
  history: typeof historyService | null = historyService || null;
  private lecturerModel: typeof LecturerModel = LecturerModel;
  private cache: CacheManager;

  constructor() {
    this.cache = CacheManager.getInstance();
  }

  async madeHistory(
    action: string,
    userId: any,
    entity: string,
    description?: string,
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
      fullname: user.fullname,
    };
  }

  async createAdmin(data: AdminRegisterDTO, currentUser: JWTPayload) {
    const existing = await userModel.findOne({ email: data.email });
    if (existing) {
      throw ApiError.conflict("Admin account already exists");
    }
    const user = await userModel.create(data);
    await this.madeHistory(
      "POST",
      new mongoose.Types.ObjectId(currentUser.id),
      "auth",
      `Admin account ${data.username} created by ${currentUser.username}`,
    );
    return user;
  }

  async assignRole(id: string, role: string) {
    const user = await userModel.findById({ id: id });
    if (!user) throw ApiError.notFound("User not found");
    user.role = role;
    await user.save();
    return user;
  }

  async localLogin(data: LocalLoginDTO): Promise<AuthResponseDTO> {
    const { username, password } = data;

    // Support login with email or username
    const user = await userModel.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) throw ApiError.unauthorized("Username/email atau password salah!");

    if (!user.isActive) throw ApiError.unauthorized("User tidak aktif!");
    if (!user.password)
      throw ApiError.unauthorized("Akun ini tidak memiliki password. Hubungi admin.");

    logger.info("user", user);
    const isPasswordValid = await user.comparePassword(password);
    logger.info("isPasswordValid", isPasswordValid);
    if (!isPasswordValid)
      throw ApiError.unauthorized("Username/email atau password salah!");

    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = this.generateToken(user);

    setImmediate(() => {
      this.madeHistory(
        "POST",
        user.id,
        "auth",
        `${user.username} login dengan local`,
      );
    });

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        photo: user.photo,
        authProvider: user.authProvider,
        fullname: user.fullname,
      },
      accessToken,
      refreshToken,
    };
  }

  async updateAdminPassword(data: LocalLoginDTO): Promise<boolean> {
    const { username, password } = data;
    const user = await userModel.findOne({ username });

    if (!user) throw ApiError.unauthorized("User tidak di temukan!");

    user.password = await hashingPassword(password);
    await user.save();
    return true;
  }

  private generateToken(user: any) {
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
