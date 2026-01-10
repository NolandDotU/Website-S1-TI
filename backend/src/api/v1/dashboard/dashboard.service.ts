import highlightService from "../highlight/highlight.service";
import { UserService } from "../users/user.service";
import { AnnouncementService } from "../announcement/announcement.service";
import { start } from "repl";
import { IDashboard } from "./dashboard.dto";

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

  getDashboardData = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [users, announcements, topFiveAnn] = await Promise.all([
      this.userService.getStatistics(
        startOfMonth,
        now,
        startOfLastMonth,
        endOfLastMonth
      ),
      this.annService.getStatistics(
        startOfMonth,
        now,
        startOfLastMonth,
        endOfLastMonth
      ),
      this.annService.topTierAnnouncements(),
    ]);

    const [userPercentage, announcementPercentage] = await Promise.all([
      this.calcPercentage(
        users.currentMonthActiveUser,
        users.lastMonthActiveUser
      ),
      this.calcPercentage(
        announcements.currentMonthAnnouncement,
        announcements.lastMonthAnnouncement
      ),
    ]);

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
        totalPublishedAnnouncement: announcements.mostViewedThisMonth,
      },
      userPercentage,
      announcementPercentage,
      topFiveAnn: topFiveAnn.announcements,
    } as IDashboard;
  };
}
