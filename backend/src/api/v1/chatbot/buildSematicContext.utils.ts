import AnnouncementModel from "../../../model/AnnouncementModel";
import { LecturerModel } from "../../../model/lecturerModel";
import PartnersModel from "../../../model/partnersModel";
import KnowledgeModel from "../../../model/knowledgeModel";
import ProdiProfileModel from "../../../model/ProdiProfileModel";
import { fetchByIdsPreserveOrder } from "./fetchByIdsPreserveOrder.utils";
import {
  AnnouncementDoc,
  KnowledgeDoc,
  LecturerDoc,
  PartnerDoc,
  SematicMatch,
  ProdiProfileDoc
} from "./sematic.dto";

export async function buildSemanticContext(matches: SematicMatch[]) {
  if (!matches.length) return "";

  const grouped = matches.reduce<Record<string, string[]>>((acc, m) => {
    acc[m.tableName] ??= [];
    acc[m.tableName].push(m.rowId.toString());
    return acc;
  }, {});

  const contexts: string[] = [];

  if (grouped.announcement) {
    const docs = await fetchByIdsPreserveOrder<AnnouncementDoc>(
      AnnouncementModel,
      grouped.announcement
    );

    contexts.push(
      ...docs.map(d =>
        `Judul: ${d.title}
Kategori: ${d.category}
Isi: ${d.content}`
      )
    );
  }

  if (grouped.lecturer) {
    const docs = await fetchByIdsPreserveOrder<LecturerDoc>(
      LecturerModel,
      grouped.lecturer
    );

    contexts.push(
      ...docs.map(d =>
        `Dosen: ${d.fullname}
Keahlian: ${d.expertise}`
      )
    );
  }

  if (grouped.partner) {
    const docs = await fetchByIdsPreserveOrder<PartnerDoc>(
      PartnersModel,
      grouped.partner
    );

    contexts.push(
      ...docs.map(d =>
        `Partner: ${d.company}
Link: ${d.link}`
      )
    );
  }

  if (grouped.knowledge) {
    const docs = await fetchByIdsPreserveOrder<KnowledgeDoc>(
      KnowledgeModel,
      grouped.knowledge
    );

    contexts.push(
      ...docs.map(d => {
        const kindLabel = d.kind === "contact" ? "Kontak" : "Layanan";
        const synonymText = (d.synonyms || []).join(", ");

        return `Jenis: ${kindLabel}
Judul: ${d.title}
Isi: ${d.content}${d.link ? `\nLink: ${d.link}` : ""}${synonymText ? `\nSinonim: ${synonymText}` : ""}`;
      })
    );
  }

  if (grouped.prodi_profile) {
    const docs = await fetchByIdsPreserveOrder<ProdiProfileDoc>(
      ProdiProfileModel,
      grouped.prodi_profile
    );

    contexts.push(
      ...docs.map(d =>
        `Program Studi: ${d.title}
Deskripsi: ${d.description}
Akreditasi: ${d.accreditationText}
Visi: ${d.visi}
Misi: 
${d.misi?.map((m: string) => `- ${m}`).join('\n') || ''}

Peminatan: 
${d.peminatan?.map((p: any) => `- ${p.title}: ${p.description}`).join('\n') || ''}

Profil Lulusan: 
${d.profilLulusan?.map((p: any) => `- ${p.title}: ${p.desc}`).join('\n') || ''}

Kurikulum: ${d.kurikulum?.title || ''}
SK Kurikulum: ${d.kurikulum?.sk || ''}
Perubahan Utama Kurikulum: 
${d.kurikulum?.perubahanUtama?.map((p: any) => `- ${p.title}: ${p.description}`).join('\n') || ''}

Strategi Pembelajaran: 
${d.kurikulum?.strategiPembelajaran?.map((p: any) => `- ${p.tahun}: ${p.description}`).join('\n') || ''}

Catatan Kurikulum: ${d.kurikulum?.notes || ''}`.trim().replace(/<[^>]*>?/gm, '')
      )
    );
  }

  return contexts.join("\n\n");
}
