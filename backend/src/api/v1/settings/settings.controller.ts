import { Request, Response } from "express";
import SystemSettingModel from "../../../model/SystemSettingModel";
import { ApiResponse } from "../../../utils";

export class SettingsController {
  public async getSettings(req: Request, res: Response) {
    try {
      let settings = await SystemSettingModel.findOne();
      
      if (!settings) {
        settings = await SystemSettingModel.create({} as any);
      }

      return res.status(200).json(ApiResponse.success(settings, "Success get system settings"));
    } catch (error) {
      console.error("Error get settings:", error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  }

  public async updateSettings(req: Request, res: Response) {
    try {
      const payload = req.body;
      
      let settings = await SystemSettingModel.findOne();
      if (!settings) {
        settings = await SystemSettingModel.create(payload as any);
      } else {
        settings = await SystemSettingModel.findOneAndUpdate({}, payload, { new: true });
      }

      return res.status(200).json(ApiResponse.success(settings, "Success update system settings"));
    } catch (error) {
      console.error("Error update settings:", error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  }
}
