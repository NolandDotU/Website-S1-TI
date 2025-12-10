import { CorsOptions } from "cors";
import { env } from "./env";

const allowedOrigins = env.FRONTEND_URL.split(",").map((url) => url.trim());

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
