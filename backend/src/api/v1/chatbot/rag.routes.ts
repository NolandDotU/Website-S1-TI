import express from "express";
import { ragServiceInstance } from "./rag.service";
import { wlcMessage } from "./welcomeMessage";
import { chatHistoryService } from "./chatHistory.service";
import { logger } from "../../../utils";

const router = express.Router();

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

  try {
    const { ownerType, ownerId, sessionId } = chatHistoryService.resolveOwner(
      req,
      res,
    );
    const history = await chatHistoryService.getRecentMessages(
      ownerType,
      ownerId,
      sessionId,
    );

    await chatHistoryService.saveMessage({
      ownerType,
      ownerId,
      sessionId,
      role: "user",
      content: query,
    });

    let fullAssistantReply = "";

    await ragServiceInstance.queryStream(
      query,
      (chunk) => {
        fullAssistantReply += chunk;
        res.write(`data: ${JSON.stringify({ chunk, sessionId })}\n\n`);
      },
      history,
    );

    await chatHistoryService.saveMessage({
      ownerType,
      ownerId,
      sessionId,
      role: "assistant",
      content: fullAssistantReply,
    });

    res.write(`data: ${JSON.stringify({ done: true, sessionId })}\n\n`);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";

    logger.error("RAG stream error", {
      error: message,
      path: req.originalUrl,
      method: req.method,
      sessionId: req.query.session_id,
    });

    res.write(`data: ${JSON.stringify({ error: true, message })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true, failed: true })}\n\n`);
  } finally {
    res.end();
  }
});

router.post("/non-stream", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        status: "FAILED",
        message: "query is required",
      });
    }

    const { ownerType, ownerId, sessionId } = chatHistoryService.resolveOwner(
      req,
      res,
    );
    const history = await chatHistoryService.getRecentMessages(
      ownerType,
      ownerId,
      sessionId,
    );

    await chatHistoryService.saveMessage({
      ownerType,
      ownerId,
      sessionId,
      role: "user",
      content: query,
    });

    const answer = await ragServiceInstance.queryOnce(query, history);

    await chatHistoryService.saveMessage({
      ownerType,
      ownerId,
      sessionId,
      role: "assistant",
      content: answer,
    });

    res.json({
      status: "OK",
      answer,
      sessionId,
    });
  } catch (err: any) {
    console.error("RAG error:", err);

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
