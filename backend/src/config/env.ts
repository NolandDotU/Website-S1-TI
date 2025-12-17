import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  API_VERSION: z.string().default("v1"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default(5000),

  //LOG LEVEL
  LOG_LEVEL: z.string().default("info"),

  //SALT BCRYPT
  SALT_BCRYPT: z.number().default(10),

  // MongoDB
  MONGODB_URI: z.string(),
  MONGODB_NAME: z.string(),

  // Redis
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z.string().transform(Number).default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URL: z.string().optional(),
  TTL: z
    .string()
    .transform(Number)
    .default(60 * 15),

  // JWT
  JWT_SECRET: z.string(),

  //Frontend Origins
  FRONTEND_ORIGIN: z.string().default("http://localhost:3000"),

  UPLOAD_DIR: z.string().default("./uploads"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),

  // Embedding
  HF_API_KEY: z.string(),
  HF_BASE_URL: z.string().default("https://router.huggingface.co"),
  HF_MODEL_NAME: z.string().default("Qwen/Qwen3-Embedding-8B"),
  EMBEDDING_DIMENSION: z.coerce.number().default(1024),

  //OpenRouter
  OPENROUTER_API_KEY: z.string(),
  OPENROUTER_MODEL: z.string().default("google/gemma-3-27b-it:free"),
  OPENROUTER_BASE_URL: z.string().default("https://openrouter.ai/api/v1"),
  
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues);
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    }
    throw new Error("Invalid environment variables");
  }
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;

export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
