export interface INews {
  title: string;
  category: string;
  content: string;
  link: string;
  photo: string;
  uploadDate: Date;
  eventDate: Date;
}

export interface INewsResponse extends INews {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INewsInput extends INews {}

export interface INewsDoc extends INews, Document {}

export interface INewsQueryDTO {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "title" | "createdAt";
  sortOrder?: "asc" | "desc";
}
