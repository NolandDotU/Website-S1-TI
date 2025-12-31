"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: false,
    },
    photo: {
        type: String,
        default: "",
        required: false,
    },
    role: {
        type: String,
        enum: ["lecturer", "student", "admin"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allow null but unique if exists
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: Date,
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }
    try {
        this.password = await (0, utils_1.hashingPassword)(this.password);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (password) {
    return await (0, utils_1.comparePassword)(password, this.password);
};
const UserModel = mongoose_1.default.model("user_collection", userSchema);
exports.default = UserModel;
//# sourceMappingURL=userModel.js.map