export interface ILecturer {
  username: string;
  fullname: string;
  email: string;
  expertise: string[];
  externalLink: string;
  photo: string;
}

export interface ILecturerDoc extends ILecturer, Document {}

export interface ILecturerInput extends ILecturer {}

export interface ILecturerResponse extends ILecturer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateInput extends ILecturer {
  id: string;
}

export interface LecturerQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}
