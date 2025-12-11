import { Request, Response } from "express";
import { logger, ApiResponse, asyncHandler } from "../../../utils";
import { LecturerService } from "./lecturer.service";
import { LecturerQueryDTO } from "./lecturer.dto";

export class LecturerController {
  service = new LecturerService();

  create = asyncHandler(async (req: Request, res: Response) => {
    const lecturer = await this.service.create(req.body);
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
    const lecturers = await this.service.getAll(page, limit, search);
    res.json(
      ApiResponse.success(lecturers, "Lecturers fetched successfully", 200)
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const lecturer = await this.service.update(req.body, id);
    return res.json(ApiResponse.success(lecturer));
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const lecturer = await this.service.delete(id);
    return res.json(ApiResponse.success(lecturer));
  });
}
