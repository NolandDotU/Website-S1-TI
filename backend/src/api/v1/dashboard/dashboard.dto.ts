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
    lastRequestAt?: Date;
    streamRequests: number;
    nonStreamRequests: number;
    openrouterResponses: number;
    configuredModels: string[];
    topUsedModels: {
      model: string;
      count: number;
    }[];
    info: {
      provider: string;
      primaryModel: string | null;
      fallbackModels: string[];
      modelCount: number;
      embeddingBaseUrl: string | null;
      embeddingDimension: number;
      vectorSearchMode: "atlas" | "fallback_cosine";
      requestTimeoutMs: number;
    };
    connections: {
      mongodb: "connected" | "connecting" | "disconnecting" | "disconnected";
      redis: "connected" | "disconnected";
      openrouter: "configured" | "missing_config";
      embedding: "configured" | "missing_config";
    };
  };
}
