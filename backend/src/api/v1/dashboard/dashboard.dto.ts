export interface IDashboard {
  users: {
    totalUser: number;
    currentMonthActiveUser: number;
    lastMonthActiveUser: number;
  };
  announcements: {
    totalAnnouncement: number;
    currentMonthActiveAnnouncement: number;
    lastMonthActiveAnnouncement: number;
    mostViewedThisMonth: object;
    totalPublishedAnnouncement: number;
  };
  userPercentage: string;
  announcementPercentage: string;
  chatbotRequestPercentage: string;
  topFiveAnn: object[];
  chatbot: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    successRate: number;
    errorRate: number;
    fallbackRequests: number;
    fallbackRate: number;
    avgResponseTimeMs: number;
    uniqueSessions: number;
    uniqueUsers: number;
    intentResponses: number;
    noContextResponses: number;
  };
}
