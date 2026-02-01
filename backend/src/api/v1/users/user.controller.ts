import {
  ApiError,
  ApiResponse,
  asyncHandler,
  JWTPayload,
  logger,
} from "../../../utils";
import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  service: UserService = new UserService();
  constructor(service: UserService = new UserService()) {
    if (this.service === null) this.service = service;
  }

  newUser = asyncHandler(async (req: Request, res: Response) => {
    const currentUser = req.user as JWTPayload;
    const user = await this.service.newUser(req.body, currentUser);

    return (
      res.json(ApiResponse.success(user, "User created successfully", 201)),
      201
    );
  });

  getAllUser = asyncHandler(async (req: Request, res: Response) => {
    const { limit, page, search } = req.query as {
      limit?: number;
      page?: number;
      search?: string;
    };
    const users = await this.service.getAllUser(page, limit, search);
    return (
      res.json(ApiResponse.success(users, "Users fetched successfully", 200)),
      200
    );
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user as JWTPayload;
    const user = await this.service.deleteUser(id, currentUser);
    return (
      res.json(ApiResponse.success(user, "User deleted successfully", 200)),
      200
    );
  });

  nonactivate = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user as JWTPayload;
    const user = await this.service.changeStatus(id, false, currentUser);
    return (
      res.json(
        ApiResponse.success(user, "User nonactivated successfully", 200),
      ),
      200
    );
  });
  activate = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user as JWTPayload;
    const user = await this.service.changeStatus(id, true, currentUser);
    return (
      res.json(ApiResponse.success(user, "User activated successfully", 200)),
      200
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const currentUser = req.user as JWTPayload;
    logger.info(`1. id params : ${id}, currentUser id : ${currentUser.id}`);

    if (id !== currentUser.id && currentUser.role !== "admin") {
      logger.info(`id params : ${id}, currentUser id : ${currentUser.id}`);
      logger.info("You can't update this user");
      throw ApiError.forbidden("You can't update this user");
    }

    const user = await this.service.updateUser(id, data, currentUser);
    return (
      res.json(ApiResponse.success(user, "User berhasil di update", 200)),
      200
    );
  });

  updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const currentUser = req.user as JWTPayload;
    const user = await this.service.updatePassword(data, currentUser);
    return (
      res.json(ApiResponse.success(user, "Password berhasil di update", 200)),
      200
    );
  });
}
