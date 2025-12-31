"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerModel = exports.LecturerSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.LecturerSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        minLength: [4, "Username must be at least 4 characters long"],
        maxLength: [100, "Username must be at most 100 characters long"],
    },
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        minLength: [4, "Username must be at least 4 characters long"],
        maxLength: [100, "Username must be at most 100 characters long"],
    },
    expertise: {
        type: [String],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email",
        ],
    },
    externalLink: {
        type: String,
    },
    photo: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
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
exports.LecturerSchema.index({ username: 1 }, { unique: true });
exports.LecturerSchema.index({ email: 1 }, { unique: true });
exports.LecturerModel = mongoose_1.default.model("lecturer_collection", exports.LecturerSchema);
//# sourceMappingURL=lecturerModel.js.map