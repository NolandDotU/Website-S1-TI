import express from "express";
import { ragServiceInstance } from "./rag.service";
import { wlcMessage } from "./welcomeMessage";

const router = express.Router();

// router.post("/stream", async (req, res) => {
//   const { query } = req.body;

//   if (!query || typeof query !== "string") {
//     res.status(400).end();
//     return;
//   }

//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   try {
//     await ragServiceInstance.queryStream(query, chunk => {
//       res.write(`data: ${chunk}\n\n`);
//     });
//   } catch (err) {
//     res.write(`data: [ERROR]\n\n`);
//   } finally {
//     res.end();
//   }
// });
router.get("/stream", async (req, res) => {
  const query = req.query.message as string;

  if (!query) {
    res.status(400).end();
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    await ragServiceInstance.queryStream(query, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: true })}\n\n`);
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

    const answer = await ragServiceInstance.queryOnce(query);

    res.json({
      status: "OK",
      answer,
    });
  } catch (err: any) {
    console.error("RAG error:", err);

    res.status(500).json({
      status: "FAILED",
      message: err.message || "Internal server error",
    });
  }
});

router.get("/welcome", wlcMessage.getWelcomeMessage);

export default router;
