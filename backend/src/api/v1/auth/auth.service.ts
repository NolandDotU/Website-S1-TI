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
import axios from "axios";
import path from "path";
import fs from "fs";
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
  saveImage = async (buffer: Buffer, username: string) => {
    const dirPath = path.join("uploads/user");
    const fileName = `google-avatar-${username}.jpg`;
    const filePath = path.join("uploads/user", fileName);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    return `/uploads/user/${fileName}`;
  };

  // ===== GOOGLE AUTH SECTION =====

  private newLectureAcc = async (user: any) => {
    try {
      const payload = {
        username: user.username,
        email: user.email,
        photo: user.photo,
        fullname: user.fullname,
      };
      const newLecture = await this.lecturerModel.create(payload);
      if (this.cache !== null) {
        await this.cache.incr("lecturers:version");
      }
      return newLecture;
    } catch (error: any) {
      if (error.code === 11000) {
        return ApiError.conflict("Lecture account already exists");
      }
    }
  };

  private roleMaker = (email: string) => {
    const domain = email.split("@")[1];
    if (email === "fti.hmp.s1.ti@uksw.edu") return "hmp";
    if (email === "fti.hmp.s1.ti@adm.uksw.edu") return "hmp";
    if (email === "fti.sekretaris.s1.ti@uksw.edu") return "admin";
    if (domain === "uksw.edu") return "dosen";
    if (domain === "student.uksw.edu") return "mahasiswa";
    return "user";
  };

  private handleGoogleNewUser = async (googleUser: any) => {
    try {
      const { googleId, email, username, photo, emailVerified, fullname } =
        googleUser;
      const googleImage = await axios.get(photo, {
        responseType: "arraybuffer",
      });

      const fileName =
        (await this.saveImage(
          Buffer.from(googleImage.data, "binary"),
          username,
        )) || "";

      const role = await this.roleMaker(email);

      const user = await userModel.create({
        googleId,
        email,
        photo: fileName,
        isEmailVerified: emailVerified,
        authProvider: "google",
        username,
        fullname,
        role: role,
      });

      if (role === "dosen") await this.newLectureAcc(user);

      if (this.cache !== null) {
        await this.cache.incr("users:version");
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  async handleGoogleAuth(googleUser: any): Promise<AuthResponseDTO> {
    const { googleId, email, emailVerified, fullname } = googleUser;

    let user = await userModel.findOne({ email });
    if (user) {
      if (user.isActive === false) {
        throw ApiError.unauthorized("User tidak aktif!");
      }

      if (user && user.authProvider !== "google") {
        throw ApiError.unauthorized("Login menggunakan metode lain!");
      }

      user.googleId = googleId;
      user.isEmailVerified = emailVerified;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await this.handleGoogleNewUser(googleUser);
    }

    const { accessToken, refreshToken } = this.generateToken(user);
    setImmediate(() => {
      this.madeHistory(
        "POST",
        user.id,
        "auth",
        `${user.username} login dengan ${user.authProvider}`,
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

  async localLogin(data: LocalLoginDTO): Promise<AuthResponseDTO> {
    const { username, password } = data;
    const user = await userModel.findOne({ username });
    if (!user) throw ApiError.unauthorized("Username atau password salah!");

    if (!user.isActive) throw ApiError.unauthorized("User tidak aktif!");
    if (!user.password && user.googleId)
      throw ApiError.unauthorized("Login menggunakan Google!");

    logger.info("user", user);
    const isPasswordValid = await user.comparePassword(password);
    logger.info("isPasswordValid", isPasswordValid);
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
