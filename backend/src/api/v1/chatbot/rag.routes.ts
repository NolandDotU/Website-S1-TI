import express from "express";
import { ragServiceInstance } from "./rag.service";
import { wlcMessage } from "./welcomeMessage";
import { chatHistoryService } from "./chatHistory.service";
import { logger } from "../../../utils";
import ChatbotRequestMetricModel from "../../../model/chatbotRequestMetricModel";

const router = express.Router();

const extractErrorCode = (err: unknown): string => {
  const anyErr = err as any;
  return (
    anyErr?.response?.status?.toString() ||
    anyErr?.code ||
    anyErr?.name ||
    "UNKNOWN_ERROR"
  );
};

const extractErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Internal server error";
};

router.get("/stream", async (req, res) => {
  const query = req.query.message as string;

  if (!query) {
    return res.status(400).json({
      status: "FAILED",
      message: "message query param is required",
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const startedAt = Date.now();
  let ownerType: "guest" | "user" | null = null;
  let ownerId: string | null = null;
  let sessionId: string | null = null;

  try {
    const owner = chatHistoryService.resolveOwner(
      req,
      res,
    );
    ownerType = owner.ownerType;
    ownerId = owner.ownerId;
    sessionId = owner.sessionId;

    const history = await chatHistoryService.getRecentMessages(
      owner.ownerType,
      owner.ownerId,
      owner.sessionId,
    );

    await chatHistoryService.saveMessage({
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      sessionId: owner.sessionId,
      role: "user",
      content: query,
    });

    let fullAssistantReply = "";

    const ragMeta = await ragServiceInstance.queryStream(
      query,
      (chunk) => {
        fullAssistantReply += chunk;
        res.write(`data: ${JSON.stringify({ chunk, sessionId: owner.sessionId })}\n\n`);
      },
      history,
    );

    await chatHistoryService.saveMessage({
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      sessionId: owner.sessionId,
      role: "assistant",
      content: fullAssistantReply,
    });

    await ChatbotRequestMetricModel.create({
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      sessionId: owner.sessionId,
      mode: "stream",
      status: "success",
      source: ragMeta.source,
      modelName: ragMeta.model?.model,
      attemptedModels: ragMeta.model?.attemptedModels || [],
      fallbackUsed: ragMeta.model?.fallbackUsed || false,
      fallbackCount: ragMeta.model?.fallbackCount || 0,
      durationMs: Date.now() - startedAt,
    });

    res.write(`data: ${JSON.stringify({ done: true, sessionId: owner.sessionId })}\n\n`);
  } catch (err) {
    const message = extractErrorMessage(err);

    logger.error("RAG stream error", {
      error: message,
      path: req.originalUrl,
      method: req.method,
      sessionId: req.query.session_id,
    });

    if (ownerType && ownerId && sessionId) {
      await ChatbotRequestMetricModel.create({
        ownerType,
        ownerId,
        sessionId,
        mode: "stream",
        status: "failed",
        source: "openrouter",
        attemptedModels: [],
        fallbackUsed: false,
        fallbackCount: 0,
        durationMs: Date.now() - startedAt,
        errorCode: extractErrorCode(err),
        errorMessage: message,
      });
    }

    res.write(`data: ${JSON.stringify({ error: true, message })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true, failed: true })}\n\n`);
  } finally {
    res.end();
  }
});

router.post("/non-stream", async (req, res) => {
  const startedAt = Date.now();
  let ownerType: "guest" | "user" | null = null;
  let ownerId: string | null = null;
  let sessionId: string | null = null;

  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        status: "FAILED",
        message: "query is required",
      });
    }

    const owner = chatHistoryService.resolveOwner(
      req,
      res,
    );
    ownerType = owner.ownerType;
    ownerId = owner.ownerId;
    sessionId = owner.sessionId;

    const history = await chatHistoryService.getRecentMessages(
      owner.ownerType,
      owner.ownerId,
      owner.sessionId,
    );

    await chatHistoryService.saveMessage({
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      sessionId: owner.sessionId,
      role: "user",
      content: query,
    });

    const { answer, meta } = await ragServiceInstance.queryOnce(query, history);

    await chatHistoryService.saveMessage({
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      sessionId: owner.sessionId,
      role: "assistant",
      content: answer,
    });

    await ChatbotRequestMetricModel.create({
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      sessionId: owner.sessionId,
      mode: "non-stream",
      status: "success",
      source: meta.source,
      modelName: meta.model?.model,
      attemptedModels: meta.model?.attemptedModels || [],
      fallbackUsed: meta.model?.fallbackUsed || false,
      fallbackCount: meta.model?.fallbackCount || 0,
      durationMs: Date.now() - startedAt,
    });

    res.json({
      status: "OK",
      answer,
      sessionId: owner.sessionId,
    });
  } catch (err: any) {
    console.error("RAG error:", err);

    if (ownerType && ownerId && sessionId) {
      await ChatbotRequestMetricModel.create({
        ownerType,
        ownerId,
        sessionId,
        mode: "non-stream",
        status: "failed",
        source: "openrouter",
        attemptedModels: [],
        fallbackUsed: false,
        fallbackCount: 0,
        durationMs: Date.now() - startedAt,
        errorCode: extractErrorCode(err),
        errorMessage: extractErrorMessage(err),
      });
    }

    res.status(500).json({
      status: "FAILED",
      message: err.message || "Internal server error",
    });
  }
});

router.get("/history", async (req, res) => {
  try {
    const sessionId = req.query.session_id as string;

    if (!sessionId) {
      return res.status(400).json({
        status: "FAILED",
        message: "session_id is required",
      });
    }

    const owner = chatHistoryService.resolveOwner(req, res);
    const messages = await chatHistoryService.getSessionMessages(
      owner.ownerType,
      owner.ownerId,
      sessionId,
    );

    res.json({
      status: "OK",
      data: {
        sessionId,
        messages,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      status: "FAILED",
      message: err.message || "Internal server error",
    });
  }
});

router.get("/welcome", wlcMessage.getWelcomeMessage);

export default router;
