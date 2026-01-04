import { Request, Response } from "express";
import { logger, ApiResponse, asyncHandler, JWTPayload } from "../../../utils";
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
    const result = await this.service.getAll(
      Number(page),
      Number(limit),
      search
    );
    res.json(ApiResponse.success(result, "Content fetched successfully", 200)),
      200;
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as JWTPayload;
    const news = await this.service.create(req.body, user);
    res.json(ApiResponse.success(news, "News created successfully", 201)), 201;
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const news = await this.service.getById(id);
    res.json(ApiResponse.success(news, "News fetched successfully", 200)), 200;
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("ID : ", id);
    const user = req.user as JWTPayload;
    const news = await this.service.update(req.body, id, user);
    res.json(ApiResponse.success(news, "News updated successfully", 201)), 201;
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id, status } = req.params;
    const user = req.user as JWTPayload;
    const result = await this.service.changeStatus(id, "published");
    res.json(
      ApiResponse.success(
        result,
        `Status pengumuman berhasil di update menjadi ${status} `
      )
    ),
      201;
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as JWTPayload;
    const result = await this.service.delete(id, user);
    return ApiResponse.success(result, "News deleted successfully", 200);
  });
}
