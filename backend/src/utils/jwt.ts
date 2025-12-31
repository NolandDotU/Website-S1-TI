// utils/jwt.ts
import jwt, {
  Secret,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./ApiError";

export interface JWTPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  authProvider: string;
}

export interface DecodedJWT extends JWTPayload {
  iat: number;
  exp: number;
}

const ACCESS_TOKEN_SECRET = env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = env.JWT_SECRET + "_refresh";

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "2m",
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (
  token: string,
  isRefreshToken = false
): DecodedJWT => {
  try {
    const secret = isRefreshToken ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
    return jwt.verify(token, secret) as DecodedJWT;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw ApiError.unauthorized("Token expired");
    }
    if (error instanceof JsonWebTokenError) {
      throw ApiError.unauthorized("Invalid token");
    }
    throw ApiError.unauthorized("Failed to verify token");
  }
};

export const decodeToken = (token: string): DecodedJWT | null => {
  try {
    return jwt.decode(token) as DecodedJWT;
  } catch {
    return null;
  }
};
