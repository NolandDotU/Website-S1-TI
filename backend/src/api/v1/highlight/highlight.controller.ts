import highlightService from "./highlight.service";
import { IHighlightInput } from "./highlight.dto";
import { ApiResponse, asyncHandler, logger } from "../../../utils";
import { Request, Response } from "express";
class HighlightController {
  constructor(private service: typeof highlightService = highlightService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const content = (
      Array.isArray(req.body) ? req.body : [req.body]
    ) as IHighlightInput[];
    const highlight = await this.service.create(content);
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

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const highlight = await this.service.delete(id);
    logger.info("Highlight deleted successfully");
    res
      .status(200)
      .json(ApiResponse.success(highlight, "Highlight deleted successfully"));
  });
}
