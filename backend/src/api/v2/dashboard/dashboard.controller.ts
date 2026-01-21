import DashboardService from "./dashboard.service";
import { asyncHandler } from "../../../utils";
import { ApiResponse } from "../../../utils";
import { Response, Request } from "express";

export default class DashboardController {
  service = new DashboardService();

  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getDashboardData();
    res.json(ApiResponse.success(data, "Dashboard fetched successfully", 200)),
      200;
  });
}
