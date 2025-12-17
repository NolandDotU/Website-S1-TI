import express from 'express';
import { embeddingServiceInstance } from '../service/embeddingService';

const router = express.Router();

router.post("/embedding", async (req, res) => {
    const {text} = req.body;
    if (!text) {
        return res.status(400).json({error: "text required"});
    }

    const embedding = await embeddingServiceInstance.generateEmbedding(text);

    res.json({
        length: embedding?.length ?? 0,
        sample: embedding?.slice(0, 5),
    });
});

export default router;