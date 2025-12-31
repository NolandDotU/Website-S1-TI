"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isProd = exports.isDev = exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const envSchema = zod_1.z.object({
    API_VERSION: zod_1.z.string().default("v1"),
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.string().transform(Number).default(5000),
    //LOG LEVEL
    LOG_LEVEL: zod_1.z.string().default("info"),
    //SALT BCRYPT
    SALT_BCRYPT: zod_1.z.number().default(10),
    // MongoDB
    MONGODB_URI: zod_1.z.string(),
    MONGODB_NAME: zod_1.z.string(),
    // Redis
    REDIS_HOST: zod_1.z.string().default("127.0.0.1"),
    REDIS_PORT: zod_1.z.string().transform(Number).default(6379),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    REDIS_URL: zod_1.z.string().optional(),
    TTL: zod_1.z
        .string()
        .transform(Number)
        .default(60 * 15),
    // JWT
    JWT_SECRET: zod_1.z.string(),
    //Frontend Origins
    FRONTEND_ORIGIN: zod_1.z.string().default("http://localhost:3000"),
    UPLOAD_DIR: zod_1.z.string().default("./uploads"),
    //GOOGLE OAUTH CONFIG
    GOOGLE_CLIENT_ID: zod_1.z.string(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string(),
    GOOGLE_CALLBACK_URL: zod_1.z.string(),
    ALLOWED_DOMAIN_EMAIL: zod_1.z
        .string()
        .default("@student.uksw.edu,@uksw.edu")
        .transform((val) => val.split(",").map((d) => d.trim())),
});
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.log(error.issues);
            error.issues.forEach((err) => {
                console.error(`  - ${err.path.join(".")}: ${err.message}`);
            });
        }
        throw new Error(`Invalid environment variables ${error}`);
    }
};
exports.env = parseEnv();
exports.isDev = exports.env.NODE_ENV === "development";
exports.isProd = exports.env.NODE_ENV === "production";
exports.isTest = exports.env.NODE_ENV === "test";
//# sourceMappingURL=env.js.map