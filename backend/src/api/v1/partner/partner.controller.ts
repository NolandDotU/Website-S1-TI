import { asyncHandler, ApiResponse, JWTPayload } from "../../../utils";
import { PartnerService } from "./partner.service";
import { Request, Response } from "express";

export class PartnerController {
  private service: PartnerService | null = new PartnerService();
  constructor(service?: PartnerService) {
    this.service = service || new PartnerService();
  }
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service?.getAllPartners();
    res
      .status(200)
      .json(ApiResponse.success(data, "Partners fetched successfully", 200));
  });
}
