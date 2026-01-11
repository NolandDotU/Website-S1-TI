import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
