import KnowledgeModel from "../../../model/knowledgeModel";
import EmbeddingInsertService from "../embeddings/embeddingInsert.service";
import { ApiError, logger } from "../../../utils";
import {
  IKnowledgeGet,
  IKnowledgeInput,
  IKnowledgeResponse,
} from "./knowledge.dto";

export class KnowledgeService {
  private model: typeof KnowledgeModel;
  private embedding = EmbeddingInsertService;

  constructor(model = KnowledgeModel) {
    this.model = model;
  }

  private normalizeSynonyms(synonyms: string[] = []): string[] {
    return Array.from(
      new Set(
        synonyms
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => s.toLowerCase()),
      ),
    );
  }

  private buildEmbeddingContent(data: {
    title: string;
    content: string;
    kind: "contact" | "service";
    link?: string;
    synonyms?: string[];
  }): string {
    const kindLabel = data.kind === "contact" ? "Kontak" : "Layanan";
    const synonymText = (data.synonyms || []).join(", ");

    return [
      `Jenis: ${kindLabel}`,
      `Judul: ${data.title}`,
      `Isi: ${data.content}`,
      data.link ? `Link: ${data.link}` : "",
      synonymText ? `Sinonim: ${synonymText}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  async getAll(
    page = 1,
    limit = 20,
    search = "",
    kind?: "contact" | "service",
  ): Promise<IKnowledgeResponse> {
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (kind) query.kind = kind;
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
        { synonyms: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const [docs, total] = await Promise.all([
      this.model.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(query),
    ]);

    const items = docs.map((doc) => doc.toJSON() as unknown as IKnowledgeGet);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const doc = await this.model.findById(id);
    if (!doc) throw ApiError.notFound("Knowledge not found");

    return doc.toJSON();
  }

  async create(data: IKnowledgeInput) {
    const payload = {
      ...data,
      synonyms: this.normalizeSynonyms(data.synonyms || []),
    };

    const doc = await this.model.create(payload);

    setImmediate(() => {
      const normalizedDoc = doc.toJSON() as unknown as IKnowledgeGet;
      const content = this.buildEmbeddingContent({
        kind: normalizedDoc.kind,
        title: normalizedDoc.title,
        content: normalizedDoc.content,
        link: normalizedDoc.link,
        synonyms: normalizedDoc.synonyms,
      });

      this.embedding
        .upsertOne("knowledge", doc._id.toString(), content)
        .catch((err) =>
          logger.error(
            "Knowledge embedding insert failed",
            doc._id.toString(),
            err?.message,
          ),
        );
    });

    return doc.toJSON();
  }

  async update(id: string, data: Partial<IKnowledgeInput>) {
    const patch: Partial<IKnowledgeInput> = { ...data };
    if (patch.synonyms) {
      patch.synonyms = this.normalizeSynonyms(patch.synonyms);
    }

    const doc = await this.model.findByIdAndUpdate(id, patch, { new: true });
    if (!doc) throw ApiError.notFound("Knowledge not found");

    setImmediate(() => {
      const normalizedDoc = doc.toJSON() as unknown as IKnowledgeGet;
      const content = this.buildEmbeddingContent({
        kind: normalizedDoc.kind,
        title: normalizedDoc.title,
        content: normalizedDoc.content,
        link: normalizedDoc.link,
        synonyms: normalizedDoc.synonyms,
      });

      this.embedding
        .upsertOne("knowledge", doc._id.toString(), content)
        .catch((err) =>
          logger.error(
            "Knowledge embedding update failed",
            doc._id.toString(),
            err?.message,
          ),
        );
    });

    return doc.toJSON();
  }

  async delete(id: string): Promise<boolean> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw ApiError.notFound("Knowledge not found");

    setImmediate(() => {
      this.embedding.deleteOne("knowledge", id).catch((err) =>
        logger.error("Knowledge embedding delete failed", id, err?.message),
      );
    });

    return true;
  }
}
