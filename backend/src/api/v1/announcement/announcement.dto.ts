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
  eventDate?: Date;
}

export interface IAnnouncementResponse extends IAnnouncement {
  id: string;
  createdAt: Date;
  updatedAt: Date;
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
