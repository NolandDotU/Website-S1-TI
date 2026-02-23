import highlightService from "../highlight/highlight.service";
import { UserService } from "../users/user.service";
import { AnnouncementService } from "../announcement/announcement.service";
import { IDashboard } from "./dashboard.dto";
import { logger } from "../../../utils";
import ChatbotRequestMetricModel from "../../../model/chatbotRequestMetricModel";

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
          uniqueSessions: { $addToSet: "$sessionId" },
          uniqueOwners: {
            $addToSet: {
              $concat: ["$ownerType", ":", "$ownerId"],
            },
          },
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
      }
    );
  }

  getDashboardData = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [users, announcements, topFiveAnn, chatbotCurrent, chatbotLast] =
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
      chatbot: chatbotCurrent,
    } as IDashboard;
  };
}
