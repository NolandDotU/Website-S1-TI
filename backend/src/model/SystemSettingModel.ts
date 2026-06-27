import mongoose from "mongoose";
import { env } from "process";
import { extend } from "zod/v4/core/util.cjs";

export interface ISystemSetting extends mongoose.Document {
  isMaintenance: boolean;
  theme: string;
  prodiPhone: string;
  prodiEmail: string;
  prodiAddress: string;
  prodiMapsLink: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
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
    prodiPhone: {
      type: String,
      default: "(0298) 321212",
    },
    prodiEmail: {
      type: String,
      default: "fti@uksw.edu",
    },
    prodiAddress: {
      type: String,
      default: "Gedung Fakultas Teknologi Informasi, Kampus III Universitas Kristen Satya Wacana\nJl. Dr. O. Notohamidjojo, Blotongan, Sidorejo, Kota Salatiga, 50715, Indonesia",
    },
    prodiMapsLink: {
      type: String,
      default: "https://maps.app.goo.gl/KkVx5nF79qKXZc3D8",
    },
    socialFacebook: {
      type: String,
      default: "#",
    },
    socialInstagram: {
      type: String,
      default: "#",
    },
    socialYoutube: {
      type: String,
      default: "#",
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
  "settings_collection",
  systemSettingSchema
);
export default SystemSettingModel;
