import { ZodError, ZodAny, ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw ApiError.badRequest(err.issues.map((e) => e.message).join(", "));
      }
      next(err);
    }
  };
