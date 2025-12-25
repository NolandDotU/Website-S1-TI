import { Request, Response } from "express";
import { logger, ApiResponse, asyncHandler } from "../../../utils";
import { AnnouncementService } from "./announcement.service";
import { IAnnouncementQueryDTO } from "./announcement.dto";

export class NewsController {
  service = new AnnouncementService();

  getAllPublished = asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.query as IAnnouncementQueryDTO;
    const result = await this.service.getAllPublished(
      Number(page),
      Number(limit),
      search
    );
    return ApiResponse.success(result, "News fetched successfully", 200);
  });

  getAllContent = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search } = req.query as IAnnouncementQueryDTO;
    const result = await this.service.getAllPublished(
      Number(page),
      Number(limit),
      search
    );
    return ApiResponse.success(result, "Content fetched successfully", 200);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    // const userId = req.user?.id;
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

  publish = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.service.changeStatus(id, "published");
    return ApiResponse.success(result, "News deactivated successfully", 200);
  });

  archive = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.service.changeStatus(id, "archived");
    return ApiResponse.success(result, "News activated successfully", 200);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.service.delete(id);
    return ApiResponse.success(result, "News deleted successfully", 200);
  });
}
