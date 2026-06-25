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

export interface KnowledgeDoc {
    _id: any;
    kind: "contact" | "service";
    title: string;
    content: string;
    link?: string;
    synonyms: string[];
}

export interface ProdiProfileDoc {
    _id: any;
    title: string;
    description: string;
    accreditationText: string;
    visi: string;
    misi: string[];
    peminatan: { title: string; description: string }[];
    profilLulusan: { title: string; desc: string }[];
    kurikulum: {
        title: string;
        sk: string;
        perubahanUtama: { title: string; description: string }[];
        strategiPembelajaran: { tahun: string; description: string }[];
        notes: string;
    };
}

export interface SematicMatch {
    rowId: string;
    tableName: "announcement" | "lecturer" | "partner" | "knowledge" | "prodi_profile";
    similarity: number;
}
