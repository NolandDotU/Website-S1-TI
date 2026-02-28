import { EmbeddingServiceInstance } from "../embeddings/embedding.service";
import { modelServiceInstance, type ModelRequestMeta } from "./model.service";
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

export type RagQueryMeta = {
  source: "intent" | "semantic_no_context" | "openrouter";
  model?: ModelRequestMeta;
};

export class RagService {
  private identity: ChatbotIdentity;
  private readonly compactContextLimit = 2500;

  constructor() {
    this.identity = {
      name: "Mr. Wacana",
      role: "Asisten Virtual Program Studi Teknik Informatika UKSW",
      department: "Fakultas Teknologi Informasi",
      university: "Universitas Kristen Satya Wacana",
      tone: "gen-z dan informatif",
      language: "Bahasa Indonesia yang baik dan benar",
      limitation: "Hanya menjawab berdasarkan data kampus",
    };
  }

  private intents = [
    {
      patterns: ["halo", "hai", "hello", "hi", "hallo", "yuhu", "woi"],
      response: () =>
        `Halo👋! Saya ${this.identity.name}, ${this.identity.role}. Ada yang bisa saya bantu terkait informasi Program Studi Teknik Informatika?🤔`,
    },
    {
      patterns: ["siapa kamu", "nama kamu", "kamu siapa"],
      response: () =>
        `Saya ${this.identity.name}, ${this.identity.role}😊.`,
    },
    {
      patterns: ["pembuat kamu", "developer", "siapa yang buat", "dibuat oleh"],
      response: () =>
        `Saya dikembangkan oleh ${this.identity.department} di ${this.identity.university}🏫.`,
    },
    {
      patterns: ["terima kasih", "makasih", "thanks", "thx", "ty", "thank you", "thank u", "terimakasih"],
      response: () =>
        `Sama-sama. Senang bisa membantu🤗☺️.`,
    },
  ];

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private hasIntentPattern(normalizedQuery: string, rawPattern: string): boolean {
    const pattern = this.normalize(rawPattern);
    if (!pattern) return false;

    // Match as whole word/phrase to avoid false positives, e.g. "hi" in "akhir".
    const regex = new RegExp(
      `(^|\\s)${this.escapeRegex(pattern).replace(/\s+/g, "\\s+")}(?=\\s|$)`,
    );

    return regex.test(normalizedQuery);
  }

  private handleIntent(query: string): string | null {
    const q = this.normalize(query);

    for (const intent of this.intents) {
      if (intent.patterns.some((p) => this.hasIntentPattern(q, p))) {
        return intent.response();
      }
    }

    return null;
  }

  private async retrieveSemanticContext(query: string): Promise<string> {
    const matches = await EmbeddingServiceInstance.semanticSearch(
      query,
      ["announcement", "lecturer", "partner", "knowledge"],
      5,
      0.1,
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
              ? `Pengguna: ${item.content}`
              : `Asisten: ${item.content}`,
          )
          .join("\n")
        : "Belum ada riwayat sebelumnya.";

    return `
Anda adalah ${id.name}, ${id.role} di ${id.department}, ${id.university}.

PERATURAN WAJIB:
- Jawaban harus sepenuhnya berdasarkan informasi yang tersedia pada DATA.
- Dilarang menambahkan asumsi atau informasi di luar DATA.
- Jika DATA kosong atau tidak relevan, jawab: "Saya tidak menemukan informasi tersebut pada data yang tersedia."

Bahasa: ${id.language}
Tone: ${id.tone}

RIWAYAT:
${historyText}

DATA:
${context}

PERTANYAAN:
${query}

JAWABAN: 
Berikan jawaban yang ringkas namun informatif (Boleh tambahkan emote jika perlu).
`;
  }

  private buildCompactPrompt(query: string, context: string): string {
    const compactContext =
      context.length > this.compactContextLimit
        ? `${context.slice(0, this.compactContextLimit)}...`
        : context;

    return this.buildPrompt(query, compactContext, []);
  }

  async queryStream(
    userQuery: string,
    onChunk: (chunk: string) => void,
    history: HistoryMessage[] = [],
  ): Promise<RagQueryMeta> {
    const intentsReply = this.handleIntent(userQuery);
    if (intentsReply) {
      onChunk(intentsReply);
      return { source: "intent" };
    }

    const context = await this.retrieveSemanticContext(userQuery);

    if (!context) {
      onChunk(
        "Saya belum menemukan informasi yang sesuai pada data yang tersedia.",
      );
      return { source: "semantic_no_context" };
    }

    const prompt = this.buildPrompt(userQuery, context, history);
    let modelMeta: ModelRequestMeta | undefined;
    try {
      await modelServiceInstance.generateStreamedResponse(prompt, onChunk, (meta) => {
        modelMeta = meta;
      });
    } catch {
      // Fallback: if streaming request fails (e.g. intermittent 400), retry once
      // using non-stream with compact prompt to keep chat UX responsive.
      const compactPrompt = this.buildCompactPrompt(userQuery, context);
      const answer = await modelServiceInstance.generateResponseOnce(
        compactPrompt,
        (meta) => {
          modelMeta = meta;
        },
      );
      onChunk(answer);
    }
    return { source: "openrouter", model: modelMeta };
  }

  async queryOnce(
    userQuery: string,
    history: HistoryMessage[] = [],
  ): Promise<{ answer: string; meta: RagQueryMeta }> {
    const intentsReply = this.handleIntent(userQuery);
    if (intentsReply) {
      return { answer: intentsReply, meta: { source: "intent" } };
    }

    const context = await this.retrieveSemanticContext(userQuery);
    if (!context) {
      return {
        answer:
          "Maaf, saya tidak menemukan informasi tersebut di database kampus. (non-stream)",
        meta: { source: "semantic_no_context" },
      };
    }

    const prompt = this.buildPrompt(userQuery, context, history);
    let modelMeta: ModelRequestMeta | undefined;
    const answer = await modelServiceInstance.generateResponseOnce(prompt, (meta) => {
      modelMeta = meta;
    });
    return { answer, meta: { source: "openrouter", model: modelMeta } };
  }
}

export const ragServiceInstance = new RagService();
