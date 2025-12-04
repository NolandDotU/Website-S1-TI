import express from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import serviceFactory from "../service/base/factoryService.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await serviceFactory.get("lecturer").getAll(req.query);
    res.json(result);
  })
);

module.exports = router;
