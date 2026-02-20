import cron from "node-cron";
import AnnouncementModel from "../model/AnnouncementModel";
import EmbeddingInsertService from "../api/v1/embeddings/embeddingInsert.service";
import { logger } from "../utils";

export const scheduller = () => {
  try {
    cron.schedule("*/5 * * * *", async () => {
      const now = new Date();
      const scheduledAnnouncements = await AnnouncementModel.find({
        status: "scheduled",
        scheduleDate: { $lte: now },
      });

      if (!scheduledAnnouncements.length) return;

      const ids = scheduledAnnouncements.map((doc) => doc._id);
      await AnnouncementModel.updateMany(
        { _id: { $in: ids } },
        {
          status: "published",
          publishDate: now,
        },
      );

      await Promise.allSettled(
        scheduledAnnouncements.map((doc) =>
          EmbeddingInsertService.upsertOne(
            "announcement",
            doc._id.toString(),
            `${doc.title}\n${doc.category}\n${doc.content}`,
          ),
        ),
      );

      logger.info(
        `Scheduler published ${scheduledAnnouncements.length} announcement(s) and refreshed embeddings`,
      );
    });
  } catch (error) {
    logger.error("ERROR SCHEDULLING PUBLISH ANNOUNCEMENT", error);
  }
};
