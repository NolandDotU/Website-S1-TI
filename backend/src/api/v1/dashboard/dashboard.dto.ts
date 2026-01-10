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
  topFiveAnn: object[];
}
