import highlightService from "../highlight/highlight.service";
import { UserService } from "../users/user.service";
import { AnnouncementService } from "../announcement/announcement.service";
import { IDashboard } from "./dashboard.dto";
import { logger } from "../../../utils";
import ChatbotRequestMetricModel from "../../../model/chatbotRequestMetricModel";
import { env } from "../../../config/env";
import { getDBStatus } from "../../../config/database";
import { isRedisReady } from "../../../config/redis";

export default class DashboardService {
  private highlightService: typeof highlightService;
  private userService: UserService;
  private annService: AnnouncementService;

  constructor() {
    this.highlightService = highlightService;
    this.userService = new UserService();
    this.annService = new AnnouncementService();
  }

  private calcPercentage(current: number, last: number): string {
    if (last === 0) {
      return current > 0 ? "+100%" : "0%";
    }

    const change = ((current - last) / last) * 100;
    const formatted = change.toFixed(1);

    return `${change > 0 ? "+" : ""}${formatted}%`;
  }

  private async getChatbotMetrics(startDate: Date, endDate: Date) {
    const [result] = await ChatbotRequestMetricModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          successfulRequests: {
            $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] },
          },
          failedRequests: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
          fallbackRequests: {
            $sum: { $cond: [{ $eq: ["$fallbackUsed", true] }, 1, 0] },
          },
          intentResponses: {
            $sum: { $cond: [{ $eq: ["$source", "intent"] }, 1, 0] },
          },
          noContextResponses: {
            $sum: { $cond: [{ $eq: ["$source", "semantic_no_context"] }, 1, 0] },
          },
          totalDurationMs: { $sum: { $ifNull: ["$durationMs", 0] } },
          streamRequests: {
            $sum: { $cond: [{ $eq: ["$mode", "stream"] }, 1, 0] },
          },
          nonStreamRequests: {
            $sum: { $cond: [{ $eq: ["$mode", "non-stream"] }, 1, 0] },
          },
          openrouterResponses: {
            $sum: { $cond: [{ $eq: ["$source", "openrouter"] }, 1, 0] },
          },
          uniqueSessions: { $addToSet: "$sessionId" },
          uniqueOwners: {
            $addToSet: {
              $concat: ["$ownerType", ":", "$ownerId"],
            },
          },
          modelNames: { $addToSet: "$modelName" },
          lastRequestAt: { $max: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRequests: 1,
          successfulRequests: 1,
          failedRequests: 1,
          fallbackRequests: 1,
          intentResponses: 1,
          noContextResponses: 1,
          streamRequests: 1,
          nonStreamRequests: 1,
          openrouterResponses: 1,
          modelNames: {
            $filter: {
              input: "$modelNames",
              as: "model",
              cond: { $and: [{ $ne: ["$$model", null] }, { $ne: ["$$model", ""] }] },
            },
          },
          lastRequestAt: 1,
          avgResponseTimeMs: {
            $cond: [
              { $gt: ["$totalRequests", 0] },
              { $round: [{ $divide: ["$totalDurationMs", "$totalRequests"] }, 0] },
              0,
            ],
          },
          successRate: {
            $cond: [
              { $gt: ["$totalRequests", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$successfulRequests", "$totalRequests"] },
                      100,
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
          errorRate: {
            $cond: [
              { $gt: ["$totalRequests", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$failedRequests", "$totalRequests"] },
                      100,
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
          fallbackRate: {
            $cond: [
              { $gt: ["$totalRequests", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$fallbackRequests", "$totalRequests"] },
                      100,
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
          uniqueSessions: { $size: "$uniqueSessions" },
          uniqueUsers: { $size: "$uniqueOwners" },
        },
      },
    ]);

    return (
      result || {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        successRate: 0,
        errorRate: 0,
        fallbackRequests: 0,
        fallbackRate: 0,
        avgResponseTimeMs: 0,
        uniqueSessions: 0,
        uniqueUsers: 0,
        intentResponses: 0,
        noContextResponses: 0,
        streamRequests: 0,
        nonStreamRequests: 0,
        openrouterResponses: 0,
        modelNames: [],
        lastRequestAt: null,
      }
    );
  }

  private async getTopUsedModels(startDate: Date, endDate: Date) {
    return ChatbotRequestMetricModel.aggregate<{ model: string; count: number }>([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          modelName: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$modelName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          model: "$_id",
          count: 1,
        },
      },
    ]);
  }

  private getConfiguredModels() {
    const primaryModel = env.OPENROUTER_MODEL?.trim() || null;
    const fallbackModels = (env.OPENROUTER_FALLBACK_MODELS || "")
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean);

    return {
      primaryModel,
      fallbackModels,
      configuredModels: Array.from(
        new Set([primaryModel, ...fallbackModels].filter(Boolean)),
      ) as string[],
    };
  }

  getDashboardData = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [users, announcements, topFiveAnn, chatbotCurrent, chatbotLast, topUsedModels] =
      await Promise.all([
      this.userService.getStatistics(
        startOfMonth,
        now,
        startOfLastMonth,
        endOfLastMonth,
      ),
      this.annService.getStatistics(
        startOfMonth,
        now,
        startOfLastMonth,
        endOfLastMonth,
      ),
      this.annService.topTierAnnouncements(),
      this.getChatbotMetrics(startOfMonth, now),
      this.getChatbotMetrics(startOfLastMonth, endOfLastMonth),
      this.getTopUsedModels(startOfMonth, now),
    ]);

    const [userPercentage, announcementPercentage, chatbotRequestPercentage] =
      await Promise.all([
      this.calcPercentage(
        users.currentMonthActiveUser,
        users.lastMonthActiveUser,
      ),
      this.calcPercentage(
        announcements.currentMonthAnnouncement,
        announcements.lastMonthAnnouncement,
      ),
      this.calcPercentage(chatbotCurrent.totalRequests, chatbotLast.totalRequests),
    ]);

    logger.info(`ANNOUCEMENT : ${JSON.stringify(announcements)}`);

    const { primaryModel, fallbackModels, configuredModels } =
      this.getConfiguredModels();
    const mongodbStatus = getDBStatus();
    const redisStatus = isRedisReady() ? "connected" : "disconnected";
    const openrouterStatus =
      env.OPENROUTER_API_KEY && env.OPENROUTER_BASE_URL
        ? "configured"
        : "missing_config";
    const embeddingStatus = env.EMBEDDING_BASE_URL
      ? "configured"
      : "missing_config";

    return {
      users: {
        totalUser: users.totalUser,
        currentMonthActiveUser: users.currentMonthActiveUser,
        lastMonthActiveUser: users.lastMonthActiveUser,
      },
      announcements: {
        totalAnnouncement: announcements.totalAnnouncement,
        currentMonthActiveAnnouncement: announcements.currentMonthAnnouncement,
        lastMonthActiveAnnouncement: announcements.lastMonthAnnouncement,
        mostViewedThisMonth: announcements.mostViewedThisMonth,
        totalPublishedAnnouncement: announcements.totalPublishedAnnouncement,
      },
      userPercentage,
      announcementPercentage,
      chatbotRequestPercentage,
      topFiveAnn: topFiveAnn.announcements,
      chatbot: {
        ...chatbotCurrent,
        topUsedModels,
        configuredModels,
        info: {
          provider: "openrouter",
          primaryModel,
          fallbackModels,
          modelCount: configuredModels.length,
          embeddingBaseUrl: env.EMBEDDING_BASE_URL || null,
          embeddingDimension: Number(env.EMBEDDING_DIMENSION),
          vectorSearchMode: env.USE_ATLAS_VECTOR_SEARCH
            ? "atlas"
            : "fallback_cosine",
          requestTimeoutMs: 120000,
        },
        connections: {
          mongodb: mongodbStatus as
            | "connected"
            | "connecting"
            | "disconnecting"
            | "disconnected",
          redis: redisStatus,
          openrouter: openrouterStatus,
          embedding: embeddingStatus,
        },
      },
    } as IDashboard;
  };
}
