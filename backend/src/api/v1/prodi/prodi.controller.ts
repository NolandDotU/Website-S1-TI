import { Request, Response } from "express";
import ProdiProfileModel from "../../../model/ProdiProfileModel";
import { ApiResponse } from "../../../utils";

export class ProdiController {
  public async getProfile(req: Request, res: Response) {
    try {
      let profile = await ProdiProfileModel.findOne();
      
      // If no profile exists, create a default one
      if (!profile) {
        const newProfile = new ProdiProfileModel();
        profile = await newProfile.save();
      }

      return res.status(200).json(ApiResponse.success(profile, "Success get prodi profile"));
    } catch (error) {
      console.error("Error get prodi profile:", error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  }

  public async updateProfile(req: Request, res: Response) {
    try {
      const payload = req.body;
      
      const profile = await ProdiProfileModel.findOneAndUpdate({}, payload, { new: true, upsert: true, setDefaultsOnInsert: true });

      return res.status(200).json(ApiResponse.success(profile, "Success update prodi profile"));
    } catch (error) {
      console.error("Error update prodi profile:", error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  }

  public async uploadSertifikat(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json(ApiResponse.error("No file uploaded"));
      }

      const photoUrl = `/uploads/prodi/${req.file.filename}`;
      return res.status(200).json(ApiResponse.success({ url: photoUrl }, "Success upload sertifikat"));
    } catch (error) {
      console.error("Error upload sertifikat:", error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  }
}
