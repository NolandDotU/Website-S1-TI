import axios from "axios";
import { env } from "../../../config/env";
import { logger } from "../../../utils";

export type ModelRequestMeta = {
  model: string;
  attemptedModels: string[];
  totalAttempts: number;
  fallbackUsed: boolean;
  fallbackCount: number;
};

export class ModelService {
  private apiKey = env.OPENROUTER_API_KEY;
  private baseUrl = env.OPENROUTER_BASE_URL;
  private models: string[];
  private activeModelIndex = 0;

  private systemPrompt =
    "Anda adalah Mr. Wacana, asisten virtual Program Studi Teknologi Informasi UKSW. Jawablah dengan sopan dan informatif dalam Bahasa Indonesia.";

  constructor() {
    const primaryModel = env.OPENROUTER_MODEL?.trim();
    const fallbackModels =
      env.OPENROUTER_FALLBACK_MODELS
        ?.split(",")
        .map((model) => model.trim())
        .filter(Boolean) ?? [];

    this.models = Array.from(new Set([primaryModel, ...fallbackModels])).filter(
      Boolean,
    ) as string[];

    if (!this.apiKey || !this.baseUrl || this.models.length === 0) {
      throw new Error("Missing OpenRouter config");
    }

    logger.info(
      `[ModelService] initialized provider=openrouter models="${this.models.join(",")}" activeModel="${this.getActiveModel()}" baseUrl="${this.baseUrl}"`,
    );
  }

  private getActiveModel(): string {
    return this.models[this.activeModelIndex];
  }

  private getErrorDetail(err: any): string {
    return err?.response?.status
      ? `${err.response.status} ${err.response.statusText || ""}`.trim()
      : err?.code || err?.message || "unknown_error";
  }

  private isRetryableOpenRouterError(err: any): boolean {
    const status = err?.response?.status;
    const code = err?.code;

    if (status && [408, 409, 425, 429, 500, 502, 503, 504].includes(status)) {
      return true;
    }

    return ["ECONNABORTED", "ETIMEDOUT", "ECONNRESET", "EAI_AGAIN"].includes(
      code,
    );
  }

  private trySwitchToNextModel(reason: string): boolean {
    const nextIndex = this.activeModelIndex + 1;
    if (nextIndex >= this.models.length) return false;

    const previousModel = this.getActiveModel();
    this.activeModelIndex = nextIndex;
    const nextModel = this.getActiveModel();

    logger.warn(
      `[ModelService] switching model from="${previousModel}" to="${nextModel}" reason="${reason}"`,
    );
    return true;
  }

  private async requestWithModelFallback<T>(
    operationType: "stream" | "non-stream",
    requestFn: (model: string) => Promise<T>,
  ): Promise<{ result: T; meta: ModelRequestMeta }> {
    let lastError: any;
    const attemptedModels: string[] = [];

    for (let attempt = 1; attempt <= this.models.length; attempt++) {
      const currentModel = this.getActiveModel();
      attemptedModels.push(currentModel);

      try {
        const result = await requestFn(currentModel);
        return {
          result,
          meta: {
            model: currentModel,
            attemptedModels: [...attemptedModels],
            totalAttempts: attemptedModels.length,
            fallbackUsed: attemptedModels.length > 1,
            fallbackCount: Math.max(0, attemptedModels.length - 1),
          },
        };
      } catch (err: any) {
        const errorDetail = this.getErrorDetail(err);
        lastError = err;

        logger.error(
          `[ModelService] ${operationType} request failed attempt=${attempt}/${this.models.length} model="${currentModel}" detail="${errorDetail}"`,
        );

        if (!this.isRetryableOpenRouterError(err)) break;

        const switched = this.trySwitchToNextModel(errorDetail);
        if (!switched) break;
      }
    }

    throw new Error(
      `OpenRouter ${operationType} request failed: ${this.getErrorDetail(lastError)}`,
    );
  }

  async generateStreamedResponse(
    prompt: string,
    onChunk: (chunk: string) => void,
    onMeta?: (meta: ModelRequestMeta) => void,
  ): Promise<void> {
    const { result: response, meta } = await this.requestWithModelFallback(
      "stream",
      async (model) =>
        axios.post(
          `${this.baseUrl}/chat/completions`,
          {
            model,
            messages: [
              { role: "system", content: this.systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature: 0.5,
            stream: true,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": env.APP_URL,
              "X-Title": "S1 TI Chatbot",
            },
            responseType: "stream",
            timeout: 120_000,
          },
        ),
    );
    onMeta?.(meta);

    const stream = response.data as NodeJS.ReadableStream;
    let buffer = "";

    for await (const chunk of stream) {
      buffer += chunk.toString();

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const line = event.trim();
        if (!line.startsWith("data: ")) continue;

        const payload = line.replace("data: ", "");

        if (payload === "[DONE]") return;

        try {
          const json = JSON.parse(payload);
          const content = json.choices?.[0]?.delta?.content;
          if (content) onChunk(content);
        } catch {
          continue;
        }
      }
    }
  }

  async generateResponseOnce(
    prompt: string,
    onMeta?: (meta: ModelRequestMeta) => void,
  ): Promise<string> {
    const { result: res, meta } = await this.requestWithModelFallback(
      "non-stream",
      async (model) =>
        axios.post(
          `${this.baseUrl}/chat/completions`,
          {
            model,
            messages: [
              { role: "system", content: this.systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            stream: false,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": env.APP_URL,
              "X-Title": "S1 TI Chatbot",
            },
            timeout: 120_000,
          },
        ),
    );
    onMeta?.(meta);

    const content = res.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Invalid OpenRouter response format");
    }

    return content;
  }
}

export const modelServiceInstance = new ModelService();
