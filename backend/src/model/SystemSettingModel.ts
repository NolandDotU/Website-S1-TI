import mongoose from "mongoose";
import { env } from "process";
import { extend } from "zod/v4/core/util.cjs";

export interface ISystemSetting extends mongoose.Document {
  isMaintenance: boolean;
  theme: string;
  SystemInfo: {
    version: string;
    env: string;
    developerContanct: string;
  };
}

const systemSettingSchema = new mongoose.Schema(
  {
    isMaintenance: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "light",
      enum: ["light", "dark"],
    },
    SystemInfo: {
      version: {
        type: String,
        default: "1.0.0",
      },
      env: {
        type: String,
        default: env.NODE_ENV,
      },
      developerContanct: {
        type: String,
        default: "josephsebastian2505@gmail.com",
      },
    },
  },
  { timestamps: true }
);

const SystemSettingModel = mongoose.model(
  "system_setting_collection",
  systemSettingSchema
);
export default SystemSettingModel;
