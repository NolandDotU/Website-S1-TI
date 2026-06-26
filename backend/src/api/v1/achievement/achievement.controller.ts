import { Request, Response, NextFunction } from "express";
import { AchievementService } from "./achievement.service";
import { ApiResponse } from "../../../utils";
import { IAchievementInput } from "./achievement.dto";

export class AchievementController {
  private achievementService: AchievementService;

  constructor() {
    this.achievementService = new AchievementService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";

      const data = await this.achievementService.getAll(page, limit, search);
      res.status(200).json(ApiResponse.success(data, "Get all achievements success"));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const data = await this.achievementService.getById(id);
      res.status(200).json(ApiResponse.success(data, "Get achievement success"));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IAchievementInput = req.body;
      const createdBy = req.user;

      const result = await this.achievementService.create(data, createdBy);
      res.status(201).json(ApiResponse.success(result, "Achievement created successfully"));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const data: IAchievementInput = req.body;
      const createdBy = req.user;

      const result = await this.achievementService.update(data, id, createdBy);
      res.status(200).json(ApiResponse.success(result, "Achievement updated successfully"));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const createdBy = req.user;

      await this.achievementService.delete(id, createdBy);
      res.status(200).json(ApiResponse.success(null, "Achievement deleted successfully"));
    } catch (error) {
      next(error);
    }
  };
}
