import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load .env file - in Docker, env vars are passed directly, but still support .env for local dev
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  // API Configuration
  API_VERSION: z.string().default("v1"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),

  // Logging
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .default("info"),

  // Security
  SALT_BCRYPT: z.coerce.number().default(10),

  // MongoDB Configuration
  MONGODB_URI: z.string().url("Invalid MongoDB URI"),
  MONGODB_NAME: z.string().min(1, "Database name is required"),

  // Redis Configuration
  REDIS_HOST: z.string().default("redis"), // Changed to 'redis' for Docker service name
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URL: z.string().url("Invalid Redis URL").optional().or(z.literal("")), // Allow empty string
  TTL: z.coerce.number().default(60 * 15), // 15 minutes

  // JWT Authentication
  JWT_SECRET: z
    .string()
    .min(32, "JWT Secret must be at least 32 characters")
    .refine(
      (val) => !val.includes("your-secret-key"),
      "Please change default JWT_SECRET in production",
    ),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT Refresh Secret must be at least 32 characters")
    .optional(),
  JWT_EXPIRE: z.string().default("1d"),
  JWT_REFRESH_EXPIRE: z.string().default("3d"),

  // CORS & Frontend Configuration
  FRONTEND_ORIGIN: z
    .string()
    .url("Invalid frontend origin URL")
    .or(z.literal("*"))
    .default("http://localhost:3000"),
  FRONTEND_URL: z
    .string()
    .url("Invalid frontend URL")
    .default("http://localhost:3000"),
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:3000")
    .transform((val) => {
      // Support multiple origins separated by comma
      if (val.includes(",")) {
        return val.split(",").map((origin) => origin.trim());
      }
      return val;
    }),

  // File Upload Configuration
  UPLOAD_DIR: z.string().default("./uploads"),

  // API Timeout
  API_TIMEOUT: z.coerce.number().default(30000), // 30 seconds

  // Hugging Face Embedding Configuration
  HF_API_KEY: z.string().optional(),
  HF_BASE_URL: z
    .string()
    .url()
    .default("https://router.huggingface.co")
    .optional(),
  HF_MODEL_NAME: z.string().default("Qwen/Qwen3-Embedding-8B").optional(),

  // Custom Embedding Service Configuration
  EMBEDDING_BASE_URL: z
    .string()
    .url()
    .default("http://localhost:8001")
    .optional(),
  EMBEDDING_DIMENSION: z.coerce.number().default(384),
  USE_ATLAS_VECTOR_SEARCH: z.boolean().default(false),
  // OpenRouter AI Configuration
  OPENROUTER_API_KEY: z.string().optional(),
  // OPENROUTER_MODEL: z.string().default("stepfun/step-3.5-flash:free").optional(),
  OPENROUTER_MODEL: z.string().default("google/gemma-3-27b-it:free").optional(),
  OPENROUTER_FALLBACK_MODELS: z.string().default("").optional(),
  OPENROUTER_BASE_URL: z
    .string()
    .url()
    .default("https://openrouter.ai/api/v1")
    .optional(),

  // Application URL
  APP_URL: z.string().url().default("http://localhost:5000"),

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),
  ALLOWED_DOMAIN_EMAIL: z
    .string()
    .default("@student.uksw.edu,@uksw.edu")
    .transform((val) => val.split(",").map((d) => d.trim())),
});

/**
 * Parse and validate environment variables
 * Throws detailed error if validation fails
 */
const parseEnv = () => {
  try {
    const parsed = envSchema.parse(process.env);

    // Production safety checks
    if (parsed.NODE_ENV === "production") {
      // Ensure JWT secrets are changed in production
      if (parsed.JWT_SECRET.includes("change")) {
        throw new Error("JWT_SECRET must be changed in production environment");
      }

      // Ensure MongoDB URI is not localhost in production
      if (
        parsed.MONGODB_URI.includes("localhost") ||
        parsed.MONGODB_URI.includes("127.0.0.1")
      ) {
        console.warn(
          "⚠️  WARNING: Using localhost MongoDB in production is not recommended",
        );
      }
    }

    return parsed;
  } catch (error) {
    console.error("❌ Environment validation failed:");

    if (error instanceof z.ZodError) {
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      console.error(
        "\n💡 Please check your .env file or environment variables",
      );
    }

    throw new Error(
      `Invalid environment variables: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
};

// Parse and export environment configuration
export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;

// Environment helpers
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

// Log environment on startup (only in development)
if (isDev) {
  console.log("🔧 Environment Configuration:");
  console.log(`  - NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  - PORT: ${env.PORT}`);
  console.log(`  - MongoDB: ${env.MONGODB_NAME}`);
  console.log(`  - Redis: ${env.REDIS_HOST}:${env.REDIS_PORT}`);
  console.log(`  - Frontend: ${env.FRONTEND_URL}`);
  console.log(`  - Log Level: ${env.LOG_LEVEL}`);
}

// Production startup check
if (isProd) {
  console.log("🚀 Starting in PRODUCTION mode");
  console.log(`  - Port: ${env.PORT}`);
  console.log(`  - Database: ${env.MONGODB_NAME}`);
  console.log(`  - Log Level: ${env.LOG_LEVEL}`);
}
