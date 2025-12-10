import jwt, {
  Secret,
  SignOptions,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./ApiError";

export interface JWTPayload {
  _id: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: 60 * 60 * 12,
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: 60 * 60 * 12 * 7,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw ApiError.unauthorized("Token Expired");
    }
    if (error instanceof JsonWebTokenError) {
      throw ApiError.unauthorized("Invalid Token");
    }
    throw ApiError.unauthorized("Failed to Verify Token");
  }
};
