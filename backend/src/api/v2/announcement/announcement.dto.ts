export interface IAnnouncement {
  title: string;
  category: string;
  content: string;
  link?: string;
  photo?: string;
  source?: string;
  publishDate?: Date;
  status?: string;
  scheduleDate?: Date;
  views?: number;
  eventDate?: Date;
}

export interface IAnnouncementGet extends IAnnouncement {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnnouncementResponse {
  announcements: IAnnouncementGet[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
}

export interface IAnnouncementInput {
  title: string;
  category: string;
  content: string;
  link?: string;
  photo?: string;
  source?: string;
  status?: string;
  scheduleDate?: Date;
  eventDate?: Date;
}

export interface IAnnouncementDoc extends IAnnouncement, Document {}

export interface IAnnouncementQueryDTO {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "title" | "createdAt";
  sortOrder?: "asc" | "desc";
}
