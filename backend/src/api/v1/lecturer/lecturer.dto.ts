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
  isActive: boolean;
}

export interface LecturerQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface IPaginatedLecturerResponse {
  lecturers: ILecturerResponse[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
