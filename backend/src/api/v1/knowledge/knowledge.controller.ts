import { Request, Response } from "express";
import { asyncHandler, ApiResponse } from "../../../utils";
import { KnowledgeService } from "./knowledge.service";

export class KnowledgeController {
  private service: KnowledgeService;

  constructor(service?: KnowledgeService) {
    this.service = service || new KnowledgeService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const search = String(req.query.search || "");
    const kind = req.query.kind as "contact" | "service" | undefined;
    const data = await this.service.getAll(page, limit, search, kind);

    res
      .status(200)
      .json(ApiResponse.success(data, "Knowledge fetched successfully", 200));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getById(req.params.id);
    res
      .status(200)
      .json(ApiResponse.success(data, "Knowledge fetched successfully", 200));
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    res
      .status(201)
      .json(ApiResponse.success(data, "Knowledge created successfully", 201));
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.update(req.params.id, req.body);
    res
      .status(200)
      .json(ApiResponse.success(data, "Knowledge updated successfully", 200));
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    res
      .status(200)
      .json(ApiResponse.success(null, "Knowledge deleted successfully", 200));
  });
}
