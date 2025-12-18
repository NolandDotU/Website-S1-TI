import { Request, Response } from "express";
import { logger, ApiResponse, asyncHandler } from "../../../utils";
import { NewsService } from "./news.service";
import { INewsQueryDTO } from "./news.dto";

export class NewsController {
  service = new NewsService();

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query as INewsQueryDTO;
    const result = await this.service.getAll(Number(page), Number(limit));
    return ApiResponse.success(result, "News fetched successfully", 200);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const news = await this.service.create(req.body);
    return ApiResponse.success(news, "News created successfully", 201);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const news = await this.service.getById(id);
    return ApiResponse.success(news, "News fetched successfully", 200);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const news = await this.service.update(req.body, id);
    return ApiResponse.success(news, "News updated successfully", 200);
  });

  deactivate = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.service.deactivate(id);
    return ApiResponse.success(result, "News deactivated successfully", 200);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.service.delete(id);
    return ApiResponse.success(result, "News deleted successfully", 200);
  });
}
