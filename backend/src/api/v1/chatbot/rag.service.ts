import { EmbeddingServiceInstance } from "../embeddings/embedding.service";
import { modelServiceInstance } from "./model.service";
import { buildSemanticContext } from "./buildSematicContext.utils";


type ChatbotIdentity = {
  name: string;
  role: string;
  department: string;
  university: string;
  tone: string;
  language: string;
  limitation: string;
};

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export class RagService {
  private identity: ChatbotIdentity;

  constructor() {
    this.identity = {
      name: "Mr. Wacana",
      role: "Asisten Virtual Program Studi Teknologi Informasi UKSW",
      department: "Fakultas Teknologi Informasi",
      university: "Universitas Kristen Satya Wacana",
      tone: "gen-z dan informatif",
      language: "Bahasa Indonesia yang baik dan benar",
      limitation: "Hanya menjawab berdasarkan data kampus",
    };
  }

  private handleIdentityQuery(query: string): string | null {
    const q = query.toLowerCase();

    if (q.includes("siapa kamu") || q.includes("nama kamu")) {
      return `Halo! Saya ${this.identity.name}, ${this.identity.role}.`;
    }

    if (q.includes("pembuat kamu") || q.includes("developer")) {
      return `Saya dikembangkan oleh ${this.identity.department} di ${this.identity.university}.`;
    }

    return null;
  }

  private async retrieveSemanticContext(query: string): Promise<string> {
    const matches = await EmbeddingServiceInstance.semanticSearch(
      query,
      ["announcement", "lecturer", "partner"],
      5,
      0.5
    );

    return buildSemanticContext(matches);

    // Preserve ranking
    //     const orderedIds = matches.map((m) => new mongoose.Types.ObjectId(m.rowId));
    //     const docs = await NewsModel.find({ _id: { $in: orderedIds } });

    //     const docMap = new Map(docs.map((d) => [d._id.toString(), d]));

    //     return matches
    //       .map((m) => {
    //         const doc = docMap.get(m.rowId.toString());
    //         if (!doc) return null;
    //         return `Judul: ${doc.title}
    // Kategori: ${doc.category}
    // Isi: ${doc.content}`;
    //       })
    //       .filter(Boolean)
    //       .join("\n\n");
  }

  private buildPrompt(
    query: string,
    context: string,
    history: HistoryMessage[] = [],
  ): string {
    const id = this.identity;
    const historyText =
      history.length > 0
        ? history
            .map((item) =>
              item.role === "user"
                ? `User: ${item.content}`
                : `Assistant: ${item.content}`,
            )
            .join("\n")
        : "BELUM ADA";

    return `
Anda adalah ${id.name}, ${id.role} dari ${id.department} di ${id.university}.
Bahasa: ${id.language}. Gaya: ${id.tone}.

ATURAN KERAS:
- Jika konteks kosong, jawab: "Saya tidak menemukan informasi tersebut di database kampus."
- Jangan mengarang.
- Jawab hanya berdasarkan konteks.
- Gunakan bahasa sopan dan jelas.

RIWAYAT PERCAKAPAN:
${historyText}

KONTEKS:
${context || "TIDAK ADA DATA RELEVAN"}

PERTANYAAN:
${query}

JAWABAN:
`;
  }

  async queryStream(
    userQuery: string,
    onChunk: (chunk: string) => void,
    history: HistoryMessage[] = [],
  ): Promise<void> {
    const identityReply = this.handleIdentityQuery(userQuery);
    if (identityReply) {
      onChunk(identityReply);
      return;
    }

    const context = await this.retrieveSemanticContext(userQuery);

    if (!context) {
      onChunk(
        "Maaf, saya tidak menemukan informasi tersebut di database kampus."
      );
      return;
    }

    const prompt = this.buildPrompt(userQuery, context, history);
    await modelServiceInstance.generateStreamedResponse(prompt, onChunk);
  }

  async queryOnce(
    userQuery: string,
    history: HistoryMessage[] = [],
  ): Promise<string> {
    const identityReply = this.handleIdentityQuery(userQuery);
    if (identityReply) return identityReply;

    const context = await this.retrieveSemanticContext(userQuery);
    if (!context) {
      return "Maaf, saya tidak menemukan informasi tersebut di database kampus. (non-stream)";
    }

    const prompt = this.buildPrompt(userQuery, context, history);
    return modelServiceInstance.generateResponseOnce(prompt);
  }
}

export const ragServiceInstance = new RagService();
