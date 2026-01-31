export interface AnnouncementDoc {
    _id: any;
    title: string;
    category: string;
    content: string;
}

export interface LecturerDoc {
    _id: any;
    fullname: string;
    expertise: string[];
    email: string;
}

export interface PartnerDoc {
    _id: any;
    company: string;
    link: string;
}

export interface SematicMatch {
    rowId: string;
    tableName: "announcement" | "lecturer" | "partner";
    similarity: number;
}