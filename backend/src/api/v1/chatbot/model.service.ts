import axios from "axios";
import { env } from "../../../config/env";
import { logger } from "../../../utils";

export class ModelService {
  private apiKey = env.OPENROUTER_API_KEY;
  private baseUrl = env.OPENROUTER_BASE_URL;
  private model = env.OPENROUTER_MODEL;

  private systemPrompt =
    "Anda adalah Mr. Wacana, asisten virtual Program Studi Teknologi Informasi UKSW. Jawablah dengan sopan dan informatif dalam Bahasa Indonesia.";

  constructor() {
    if (!this.apiKey || !this.baseUrl || !this.model) {
      throw new Error("Missing OpenRouter config");
    }
  }

  async generateStreamedResponse(
    prompt: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    logger.debug(`OPEN ROUTER PROMPT ${prompt}`);

    let response;

    try {
      response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
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
      );
      logger.debug(`OPEN ROUTER RESPONSE ${response.data}`);
    } catch (err: any) {
      throw new Error(
        `OpenRouter request failed: ${err.response?.status || err.message}`,
      );
    }

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

  async generateResponseOnce(prompt: string): Promise<string> {
    let res;

    try {
      res = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
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
      );
    } catch (err: any) {
      throw new Error(
        `OpenRouter request failed: ${err.response?.status || err.message}`,
      );
    }

    const content = res.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Invalid OpenRouter response format");
    }

    return content;
  }
}

export const modelServiceInstance = new ModelService();
