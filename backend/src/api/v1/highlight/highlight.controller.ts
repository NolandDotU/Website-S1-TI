import highlightService from "./highlight.service";
import { HighlightDTO } from "./highlight.dto";
import { ApiResponse, asyncHandler, JWTPayload, logger } from "../../../utils";
import { Request, Response } from "express";
export class HighlightController {
  constructor(private service: typeof highlightService = highlightService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const content = req.body as HighlightDTO;
    const currentUser = req.user as JWTPayload;
    const highlight = await this.service.create(content, currentUser);
    logger.info("Highlight created successfully");
    res
      .status(201)
      .json(
        ApiResponse.success(highlight, "Highlight created successfully", 201)
      );
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const highlight = await this.service.getAll();
    logger.info("Highlight fetched successfully");
    res
      .status(200)
      .json(ApiResponse.success(highlight, "Highlight fetched successfully"));
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user as JWTPayload;
    const highlight = await this.service.update(id, req.body, currentUser);
    logger.info("Highlight updated successfully");
    res
      .status(200)
      .json(ApiResponse.success(highlight, "Highlight updated successfully"));
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user as JWTPayload;
    const highlight = await this.service.delete(id, currentUser);
    logger.info("Highlight deleted successfully");
    res
      .status(200)
      .json(ApiResponse.success(highlight, "Highlight deleted successfully"));
  });

  clear = asyncHandler(async (req: Request, res: Response) => {
    const highlight = await this.service.deleteAll();
    logger.info("Highlight deleted successfully");
    res
      .status(200)
      .json(ApiResponse.success(highlight, "Highlight deleted successfully"));
  });
}
