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

  cretaee = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as JWTPayload;
    const data = await this.service?.newPartner(req.body, user);
    res
      .status(201)
      .json(ApiResponse.success(data, "Partner created successfully", 201));
  });

  edit = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as JWTPayload;
    const data = await this.service?.editPartner(id, req.body, user);
    res
      .status(200)
      .json(ApiResponse.success(data, "Partner updated successfully", 200));
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as JWTPayload;
    await this.service?.deletePartner(id, user);
    res
      .status(200)
      .json(ApiResponse.success(null, "Partner deleted successfully", 200));
  });
}
