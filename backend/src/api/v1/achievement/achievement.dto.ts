export interface IAchievementInput {
  title: string;
  recipient: string;
  category: "Mahasiswa" | "Dosen" | "Program Studi" | "Alumni" | "Organisasi";
  level:
    | "Internasional"
    | "Nasional"
    | "Provinsi"
    | "Kabupaten/Kota"
    | "Universitas"
    | "Fakultas"
    | "Program Studi";
  organizer?: string;
  achievementDate: Date;
  description?: string;
  image?: string;
  certificate?: string;
}

export interface IAchievementGet {
  id: string;
  title: string;
  recipient: string;
  category: string;
  level: string;
  organizer: string;
  achievementDate: Date;
  description: string;
  image: string;
  certificate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAchievementResponse {
  achievements?: IAchievementGet[] | any;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  id?: string;
  title?: string;
  recipient?: string;
  category?: string;
  level?: string;
  organizer?: string;
  achievementDate?: Date;
  description?: string;
  image?: string;
  certificate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
