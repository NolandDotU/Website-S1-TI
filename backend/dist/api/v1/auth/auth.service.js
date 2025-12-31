"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../../../model/userModel"));
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const utils_3 = require("../../../utils");
const utils_4 = require("../../../utils");
const history_1 = __importDefault(require("../../../utils/history"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class AuthService {
    constructor() {
        this.history = history_1.default || null;
        this.saveImage = async (buffer, username) => {
            const dirPath = path_1.default.join("uploads/user");
            const fileName = `google-avatar-${username}.jpg`;
            const filePath = path_1.default.join("uploads/user", fileName);
            if (!fs_1.default.existsSync(dirPath)) {
                fs_1.default.mkdirSync(dirPath, { recursive: true });
            }
            fs_1.default.writeFileSync(filePath, buffer);
            return `/uploads/user/${fileName}`;
        };
    }
    async madeHistory(action, userId, entity, description) {
        if (this.history !== null) {
            await this.history.create({ user: userId, action, entity, description });
        }
    }
    async checkMe(id) {
        const user = await userModel_1.default.findById(id);
        if (!user)
            throw utils_1.ApiError.notFound("User not found");
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            photo: user.photo,
            authProvider: user.authProvider,
        };
    }
    async createAdmin(data, userId) {
        const existing = await userModel_1.default.findOne({ email: data.email });
        if (existing) {
            await this.madeHistory("POST", existing.id, "auth");
            throw utils_1.ApiError.conflict("Admin account already exists");
        }
        const user = await userModel_1.default.create(data);
        await this.madeHistory("POST", user.id, "auth");
        return user;
    }
    async assignRole(username, role) {
        const user = await userModel_1.default.findOne({ username });
        if (!user)
            throw utils_1.ApiError.notFound("User not found");
        user.role = role;
        await user.save();
        return user;
    }
    async handleGoogleAuth(googleUser) {
        const { googleId, email, username, photo, emailVerified, fullname } = googleUser;
        utils_3.logger.info("Google User", googleUser);
        let user = await userModel_1.default.findOne({ email });
        if (user) {
            if (user.isActive === false) {
                throw utils_1.ApiError.unauthorized("User tidak aktif!");
            }
            user.googleId = googleId;
            user.isEmailVerified = emailVerified;
            user.lastLogin = new Date();
            await user.save();
            utils_3.logger.info("Existing user logged in", user);
        }
        else {
            const googleImage = await axios_1.default.get(photo, {
                responseType: "arraybuffer",
            });
            const fileName = (await this.saveImage(Buffer.from(googleImage.data, "binary"), username)) || "";
            user = await userModel_1.default.create({
                googleId,
                email,
                photo: fileName,
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
    async adminLogin(data) {
        const { username, password } = data;
        const user = await userModel_1.default.findOne({ username });
        if (!user)
            throw utils_1.ApiError.unauthorized("Username atau password salah!");
        utils_3.logger.info("User", user);
        if (user?.role !== "admin")
            throw utils_1.ApiError.unauthorized("User bukan admin!");
        if (!user.isActive)
            throw utils_1.ApiError.unauthorized("User tidak aktif!");
        if (!user.password && user.googleId)
            throw utils_1.ApiError.unauthorized("Login menggunakan Google!");
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid)
            throw utils_1.ApiError.unauthorized("Email atau password salah!");
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
    async updateAdminPassword(data) {
        const { username, password } = data;
        const user = await userModel_1.default.findOne({ username });
        if (!user)
            throw utils_1.ApiError.unauthorized("User tidak di temukan!");
        user.password = await (0, utils_4.hashingPassword)(password);
        await user.save();
        return true;
    }
    generateToken(user) {
        utils_3.logger.info("Generating token : ", user);
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            authProvider: user.authProvider,
        };
        const accessToken = (0, utils_2.generateToken)(payload);
        const refreshToken = (0, utils_2.generateRefreshToken)(payload);
        return { accessToken, refreshToken };
    }
}
const authService = new AuthService();
exports.default = authService;
//# sourceMappingURL=auth.service.js.map