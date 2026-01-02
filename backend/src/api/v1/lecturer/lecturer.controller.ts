import { Request, Response } from "express";
import { logger, ApiResponse, asyncHandler } from "../../../utils";
import { LecturerService } from "./lecturer.service";
import { LecturerQueryDTO } from "./lecturer.dto";
import { validate } from "../../../middleware/validate.middleware";

export class LecturerController {
  constructor(private service: LecturerService = new LecturerService()) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const lecturer = await this.service.create(req.body, user);
    logger.info("Lecturer created successfully");
    res
      .status(201)
      .json(
        ApiResponse.success(lecturer, "Lecturer created successfully", 201)
      );
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search } = req.query as LecturerQueryDTO;
    logger.info("Query params: ", req.query);
    const data = await this.service.getAll(page, limit, search);
    res
      .status(200)
      .json(
        ApiResponse.success(
          data.lecturers,
          "Lecturers fetched successfully",
          200,
          data.meta
        )
      );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const lecturer = await this.service.update(req.body, id, user);
    return res.json(ApiResponse.success(lecturer));
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const lecturer = await this.service.delete(id, user);
    return res.json(ApiResponse.success(lecturer));
  });
}
