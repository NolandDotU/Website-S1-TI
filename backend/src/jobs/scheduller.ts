import cron from "node-cron";
import AnnouncementModel from "../model/AnnouncementModel";
import EmbeddingInsertService from "../api/v1/embeddings/embeddingInsert.service";
import { logger, CacheManager } from "../utils";

export const scheduller = () => {
  try {
    cron.schedule("*/5 * * * *", async () => {
      const now = new Date();
      const scheduledAnnouncements = await AnnouncementModel.find({
        status: "scheduled",
        scheduleDate: { $lte: now },
      });

      if (scheduledAnnouncements.length) {
        const ids = scheduledAnnouncements.map((doc: any) => doc._id);
        await AnnouncementModel.updateMany(
          { _id: { $in: ids } },
          {
            status: "published",
            publishDate: now,
          },
        );

        await Promise.allSettled(
          scheduledAnnouncements.map((doc: any) =>
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

        // Invalidate cache
        const cache = CacheManager.getInstance();
        if (cache) {
          await cache.incr("news:version");
          await cache.incr("highlights:version");
        }
      }

      const expiredAnnouncements = await AnnouncementModel.find({
        status: "published",
        validUntil: { $lte: now },
      });

      if (expiredAnnouncements.length) {
        const expiredIds = expiredAnnouncements.map((doc: any) => doc._id);
        await AnnouncementModel.updateMany(
          { _id: { $in: expiredIds } },
          { status: "archived" },
        );

        await Promise.allSettled(
          expiredAnnouncements.map((doc: any) =>
            EmbeddingInsertService.deleteOne(
              "announcement",
              doc._id.toString(),
            ),
          ),
        );

        logger.info(
          `Scheduler archived ${expiredAnnouncements.length} expired announcement(s) and deleted their embeddings`,
        );

        // Invalidate cache
        const cache = CacheManager.getInstance();
        if (cache) {
          await cache.incr("news:version");
          await cache.incr("highlights:version");
        }
      }
    });
  } catch (error) {
    logger.error("ERROR SCHEDULLING PUBLISH ANNOUNCEMENT", error);
  }
};
