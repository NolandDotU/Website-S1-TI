import cron from "node-cron";
import AnnouncementModel from "../model/AnnouncementModel";
import { logger } from "../utils";

export const scheduller = () => {
  try {
    cron.schedule("*/5 * * * *", async () => {
      await AnnouncementModel.updateMany(
        { status: "scheduled" },
        { status: "published" }
      );
    });
  } catch (error) {
    logger.error("ERROR SCHEDULLING PUBLISH ANNOUNCEMENT", error);
  }
};
